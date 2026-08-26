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
import {
  appendSoftwareTeamPipelineActivity,
  pipelineItemById,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamPipelineStore,
  updateSoftwareTeamPipelineItem,
} from "./pipeline";
import {
  recordSoftwareTeamRoleVisit,
  softwareTeamRoleChecklist,
  softwareTeamShipGate,
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

export function applySoftwareTeamHandoff(
  item: SoftwareTeamPipelineItem,
  now = Date.now(),
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
  let toStage = role?.defaultStage ?? "build";
  const nextDraft: SoftwareTeamPipelineItem = {
    ...item,
    roleId: toRole,
    stageId: toStage,
    roleHistory,
    stageSource: "handoff",
    updatedAt: now,
  };
  if (toStage === "ship" && !softwareTeamShipGate(nextDraft).ok) {
    toStage = "review";
  }
  const next: SoftwareTeamPipelineItem = {
    ...nextDraft,
    stageId: toStage,
    sessionDonePending: false,
  };
  return {
    kind: "advanced",
    fromRole: item.roleId,
    toRole,
    fromStage: item.stageId,
    toStage,
    item: next,
    starter: composeHandoffStarter(item, next),
  };
}

export function applySoftwareTeamHandoffToStore(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  now = Date.now(),
): { store: SoftwareTeamPipelineStore; result: SoftwareTeamHandoffResult | null } {
  const prev = pipelineItemById(store, itemId);
  if (!prev) return { store, result: null };
  const result = applySoftwareTeamHandoff(prev, now);
  if (result.kind === "done") return { store, result };
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
    store: appendSoftwareTeamPipelineActivity(next, {
      at: now,
      type: "handoff",
      deliveryId: result.item.deliveryId,
      itemId: result.item.id,
      roleId: result.item.roleId,
      stageId: result.item.stageId,
    }),
    result,
  };
}
