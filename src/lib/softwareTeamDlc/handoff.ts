/**
 * Software Works — Product → Architect → Engineer → Reviewer → QA → Writer.
 *
 * Handoff updates the pipeline item (role + default stage) and returns a
 * starter for the next Grok Build session. It does not spawn a CLI process.
 */

import {
  softwareTeamRoleById,
  type SoftwareTeamRoleId,
} from "./roles";
import type { SoftwareTeamSdlcStageId } from "./sdlc";
import { softwareTeamRoleStarterPrompt } from "./pack";
import { softwareTeamDeliverySiblingDraft } from "./delivery";
import {
  addSoftwareTeamPipelineItem,
  appendSoftwareTeamPipelineActivity,
  createSoftwareTeamPipelineItem,
  pipelineItemById,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamPipelineStore,
  updateSoftwareTeamPipelineItem,
} from "./pipeline";
import {
  firstSoftwareTeamNonEmptyField,
  recordSoftwareTeamRoleVisit,
  softwareTeamDeliveryShipGate,
  softwareTeamRoleChecklist,
} from "./shipGate";

export const SOFTWARE_TEAM_HANDOFF_CHAIN: readonly SoftwareTeamRoleId[] = [
  "product",
  "architect",
  "engineer",
  "reviewer",
  "qa",
  "writer",
] as const;

export function nextSoftwareTeamRole(
  roleId: SoftwareTeamRoleId,
): SoftwareTeamRoleId | null {
  switch (roleId) {
    case "product":
      return "architect";
    case "architect":
      return "engineer";
    case "engineer":
      return "reviewer";
    case "reviewer":
      return "qa";
    case "qa":
      return "writer";
    case "writer":
      return null;
    default: {
      const _never: never = roleId;
      return _never;
    }
  }
}

export const SOFTWARE_TEAM_HANDOFF_MODES = [
  "mutate",
  "focus",
  "created",
  "done",
  "none",
] as const;

export type SoftwareTeamHandoffMode =
  (typeof SOFTWARE_TEAM_HANDOFF_MODES)[number];

export type SoftwareTeamHandoffResult =
  | {
      kind: "advanced";
      fromRole: SoftwareTeamRoleId;
      toRole: SoftwareTeamRoleId;
      fromStage: SoftwareTeamSdlcStageId;
      toStage: SoftwareTeamSdlcStageId;
      item: SoftwareTeamPipelineItem;
      starter: string;
    }
  | {
      kind: "done";
      fromRole: SoftwareTeamRoleId;
      toRole: null;
      fromStage: SoftwareTeamSdlcStageId;
      toStage: null;
      item: SoftwareTeamPipelineItem;
      starter: null;
    };

export type SoftwareTeamHandoffStoreResult = {
  store: SoftwareTeamPipelineStore;
  result: SoftwareTeamHandoffResult | null;
  mode: SoftwareTeamHandoffMode;
};

/** Delivery cards keep their role. Ungrouped cards still mutate in place. */
export function softwareTeamHandoffKeepsSourceCard(
  item: Pick<SoftwareTeamPipelineItem, "deliveryId">,
): boolean {
  return Boolean(item.deliveryId.trim());
}

function roleLabel(roleId: SoftwareTeamRoleId): string {
  switch (roleId) {
    case "product":
      return "Product";
    case "architect":
      return "Architect";
    case "engineer":
      return "Engineer";
    case "reviewer":
      return "Reviewer";
    case "qa":
      return "QA";
    case "writer":
      return "Tech Writer";
    default: {
      const _never: never = roleId;
      return _never;
    }
  }
}

function stageLabel(stageId: SoftwareTeamSdlcStageId): string {
  switch (stageId) {
    case "backlog":
      return "Backlog";
    case "design":
      return "Design";
    case "build":
      return "Build";
    case "review":
      return "Review";
    case "ship":
      return "Ship";
    default: {
      const _never: never = stageId;
      return _never;
    }
  }
}

/** Agent-facing English starter (not UI copy). */
export function composeHandoffStarter(
  from: SoftwareTeamPipelineItem,
  to: SoftwareTeamPipelineItem,
): string {
  const lines = [
    softwareTeamRoleStarterPrompt(to.roleId),
    "",
    `Handoff from ${roleLabel(from.roleId)} (${stageLabel(from.stageId)}) → ${roleLabel(to.roleId)} (${stageLabel(to.stageId)}).`,
  ];
  if (from.title) lines.push(`Slice: ${from.title}`);
  if (from.planRef) lines.push(`Plan: ${from.planRef}`);
  if (from.goalRef) lines.push(`Goal: ${from.goalRef}`);
  if (from.artifactRef) lines.push(`Artifact: ${from.artifactRef}`);
  const checklist = softwareTeamRoleChecklist(to.roleId);
  if (checklist.length) {
    lines.push("", ...checklist);
  }
  if (from.reviewNote) lines.push(`Reviewer notes: ${from.reviewNote}`);
  if (from.qaNote) lines.push(`QA notes: ${from.qaNote}`);
  lines.push(
    "Stay on Grok Build. Do not spawn a second CLI runtime. Continue this session or attach-chat.",
  );
  return lines.join("\n");
}

function mergeDeliverySlice(
  item: SoftwareTeamPipelineItem,
  siblings?: readonly SoftwareTeamPipelineItem[] | null,
): Pick<
  SoftwareTeamPipelineItem,
  "planRef" | "goalRef" | "artifactRef" | "reviewNote" | "qaNote"
> {
  const others = (siblings ?? []).filter((row) => row.id !== item.id);
  return {
    planRef: firstSoftwareTeamNonEmptyField([
      item.planRef,
      ...others.map((row) => row.planRef),
    ]),
    goalRef: firstSoftwareTeamNonEmptyField([
      item.goalRef,
      ...others.map((row) => row.goalRef),
    ]),
    artifactRef: firstSoftwareTeamNonEmptyField([
      item.artifactRef,
      ...others.map((row) => row.artifactRef),
    ]),
    reviewNote: firstSoftwareTeamNonEmptyField([
      item.reviewNote,
      ...others.map((row) => row.reviewNote),
    ]),
    qaNote: firstSoftwareTeamNonEmptyField([
      item.qaNote,
      ...others.map((row) => row.qaNote),
    ]),
  };
}

export function applySoftwareTeamHandoff(
  item: SoftwareTeamPipelineItem,
  now = Date.now(),
  siblings?: readonly SoftwareTeamPipelineItem[] | null,
): SoftwareTeamHandoffResult {
  const toRole = nextSoftwareTeamRole(item.roleId);
  if (!toRole) {
    return {
      kind: "done",
      fromRole: item.roleId,
      toRole: null,
      fromStage: item.stageId,
      toStage: null,
      item,
      starter: null,
    };
  }
  const role = softwareTeamRoleById(toRole);
  const roleHistory = recordSoftwareTeamRoleVisit(
    item.roleHistory,
    item.roleId,
    toRole,
  );
  const merged = mergeDeliverySlice(item, siblings);
  let toStage = role?.defaultStage ?? "build";
  const nextDraft: SoftwareTeamPipelineItem = {
    ...item,
    ...merged,
    roleId: toRole,
    stageId: toStage,
    roleHistory,
    stageSource: "handoff",
    updatedAt: now,
  };
  const others = (siblings ?? []).filter((row) => row.id !== item.id);
  const cohort = others.length ? [...others, nextDraft] : [nextDraft];
  if (toStage === "ship" && !softwareTeamDeliveryShipGate(cohort).ok) {
    toStage = "review";
  }
  const next: SoftwareTeamPipelineItem = {
    ...item,
    ...(toStage === "ship" ? merged : {}),
    roleId: toRole,
    stageId: toStage,
    roleHistory,
    stageSource: "handoff",
    updatedAt: now,
    sessionDonePending: false,
  };
  const starterFrom = { ...item, ...merged };
  return {
    kind: "advanced",
    fromRole: item.roleId,
    toRole,
    fromStage: item.stageId,
    toStage,
    item: next,
    starter: composeHandoffStarter(starterFrom, next),
  };
}

function membersForHandoff(
  store: SoftwareTeamPipelineStore,
  item: SoftwareTeamPipelineItem,
): SoftwareTeamPipelineItem[] {
  const deliveryId = item.deliveryId.trim();
  if (!deliveryId) return [item];
  return store.items.filter((row) => row.deliveryId.trim() === deliveryId);
}

function appendHandoffActivity(
  store: SoftwareTeamPipelineStore,
  item: SoftwareTeamPipelineItem,
  now: number,
): SoftwareTeamPipelineStore {
  return appendSoftwareTeamPipelineActivity(store, {
    at: now,
    type: "handoff",
    deliveryId: item.deliveryId,
    itemId: item.id,
    roleId: item.roleId,
    stageId: item.stageId,
  });
}

export function applySoftwareTeamHandoffToStore(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  now = Date.now(),
): SoftwareTeamHandoffStoreResult {
  const prev = pipelineItemById(store, itemId);
  if (!prev) return { store, result: null, mode: "none" };
  const members = membersForHandoff(store, prev);
  if (!softwareTeamHandoffKeepsSourceCard(prev)) {
    const result = applySoftwareTeamHandoff(prev, now, members);
    if (result.kind === "done") return { store, result, mode: "done" };
    const next = updateSoftwareTeamPipelineItem(
      store,
      itemId,
      {
        roleId: result.item.roleId,
        stageId: result.item.stageId,
        roleHistory: result.item.roleHistory,
        reviewNote: result.item.reviewNote,
        qaNote: result.item.qaNote,
        sessionDonePending: false,
        stageSource: "handoff",
      },
      now,
    );
    return {
      store: appendHandoffActivity(next, result.item, now),
      result,
      mode: "mutate",
    };
  }

  const toRole = nextSoftwareTeamRole(prev.roleId);
  if (!toRole) {
    const cleared = updateSoftwareTeamPipelineItem(
      store,
      itemId,
      { sessionDonePending: false },
      now,
    );
    return {
      store: cleared,
      result: {
        kind: "done",
        fromRole: prev.roleId,
        toRole: null,
        fromStage: prev.stageId,
        toStage: null,
        item: prev,
        starter: null,
      },
      mode: "done",
    };
  }

  const merged = mergeDeliverySlice(prev, members);
  const starterFrom = { ...prev, ...merged };
  let nextStore = updateSoftwareTeamPipelineItem(
    store,
    itemId,
    { sessionDonePending: false },
    now,
  );
  const existing = members.find((row) => row.id !== prev.id && row.roleId === toRole);
  if (existing) {
    const starter = composeHandoffStarter(starterFrom, existing);
    return {
      store: appendHandoffActivity(nextStore, existing, now),
      result: {
        kind: "advanced",
        fromRole: prev.roleId,
        toRole,
        fromStage: prev.stageId,
        toStage: existing.stageId,
        item: existing,
        starter,
      },
      mode: "focus",
    };
  }

  const created = createSoftwareTeamPipelineItem({
    ...softwareTeamDeliverySiblingDraft({
      source: starterFrom,
      roleId: toRole,
      deliveryId: prev.deliveryId,
    }),
    stageSource: "handoff",
    updatedAt: now,
  });
  if (!created) {
    const fallback = applySoftwareTeamHandoff(prev, now, members);
    return { store, result: fallback, mode: "none" };
  }
  nextStore = addSoftwareTeamPipelineItem(nextStore, created);
  const live = pipelineItemById(nextStore, created.id) ?? created;
  const starter = composeHandoffStarter(starterFrom, live);
  return {
    store: appendHandoffActivity(nextStore, live, now),
    result: {
      kind: "advanced",
      fromRole: prev.roleId,
      toRole,
      fromStage: prev.stageId,
      toStage: live.stageId,
      item: live,
      starter,
    },
    mode: "created",
  };
}
