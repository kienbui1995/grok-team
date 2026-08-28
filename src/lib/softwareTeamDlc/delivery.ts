/**
 * Software Works — start a delivery (wizard) + optional workspace bootstrap.
 *
 * Bootstrap writes only under the project folder (`docs/sdlc/…`).
 * Never writes shared `~/.grok`. Never claims success without Host.
 */

import * as api from "@/lib/api";
import type { MessageKey } from "@/i18n";
import {
  appendSoftwareTeamPipelineActivity,
  createSoftwareTeamPipelineItem,
  pipelineItemById,
  updateSoftwareTeamPipelineItem,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamPipelineItemDraft,
  type SoftwareTeamPipelineStore,
} from "./pipeline";
import { softwareTeamDeliveryTitle } from "./deliveryFilter";
import { softwareTeamDeliveryGitBranch } from "./gitBranch";
import { softwareTeamRoleById, type SoftwareTeamRoleId } from "./roles";
import { firstSoftwareTeamNonEmptyField } from "./shipGate";

export const SOFTWARE_TEAM_BOOTSTRAP_RELATIVE = [
  "docs/sdlc/spec.md",
  "docs/sdlc/design.md",
  "docs/sdlc/review.md",
] as const;

export const SOFTWARE_TEAM_BOOTSTRAP_REASONS = [
  "ok_project",
  "skipped",
  "need_host",
  "need_project",
  "blocked_shared_home",
  "host_error",
] as const;

export type SoftwareTeamBootstrapReason =
  (typeof SOFTWARE_TEAM_BOOTSTRAP_REASONS)[number];

export type SoftwareTeamBootstrapHost = {
  isDesktopHost: () => boolean;
  readFile: (
    projectPath: string,
    relative: string,
  ) => Promise<{ error?: string | null; text?: string | null }>;
  writeFile: (
    projectPath: string,
    relative: string,
    content: string,
  ) => Promise<unknown>;
};

export type SoftwareTeamBootstrapFileResult = {
  relative: string;
  action: "created" | "skipped";
};

export type SoftwareTeamBootstrapResult =
  | {
      ok: true;
      reason: Extract<SoftwareTeamBootstrapReason, "ok_project" | "skipped">;
      files: SoftwareTeamBootstrapFileResult[];
    }
  | {
      ok: false;
      reason: Exclude<SoftwareTeamBootstrapReason, "ok_project" | "skipped">;
      error?: string;
      files: SoftwareTeamBootstrapFileResult[];
    };

/** True when `projectPath` *is* shared GROK_HOME (`~/.grok`), not a normal repo. */
export function isSoftwareTeamSharedHomePath(
  raw: string | null | undefined,
): boolean {
  const p = (raw ?? "").trim().replace(/\\/g, "/").replace(/\/+$/, "");
  if (!p) return false;
  const lower = p.toLowerCase();
  if (lower === "~/.grok" || lower === "~/.grok/") return true;
  return /(?:^|\/)\.grok$/.test(lower);
}

export function newSoftwareTeamDeliveryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function defaultSoftwareTeamBootstrapHost(): SoftwareTeamBootstrapHost {
  return {
    isDesktopHost: () => api.isDesktopHost(),
    readFile: (projectPath, relative) => api.fsReadFile(projectPath, relative),
    writeFile: (projectPath, relative, content) =>
      api.fsWriteFile(projectPath, relative, content),
  };
}

export function planSoftwareTeamWorkspaceBootstrap(input: {
  projectPath?: string | null;
  bootstrap?: boolean;
  host?: Pick<SoftwareTeamBootstrapHost, "isDesktopHost">;
}): {
  allowed: boolean;
  reason: SoftwareTeamBootstrapReason;
  projectPath: string;
} {
  if (!input.bootstrap) {
    return { allowed: false, reason: "skipped", projectPath: "" };
  }
  const projectPath = (input.projectPath ?? "").trim();
  if (!projectPath) {
    return { allowed: false, reason: "need_project", projectPath: "" };
  }
  if (isSoftwareTeamSharedHomePath(projectPath)) {
    return { allowed: false, reason: "blocked_shared_home", projectPath };
  }
  const host = input.host ?? defaultSoftwareTeamBootstrapHost();
  if (!host.isDesktopHost()) {
    return { allowed: false, reason: "need_host", projectPath };
  }
  return { allowed: true, reason: "ok_project", projectPath };
}

export function softwareTeamBootstrapMessageKey(
  reason: SoftwareTeamBootstrapReason,
): MessageKey {
  switch (reason) {
    case "ok_project":
      return "softwareTeamDlc.startDeliveryBootstrapped";
    case "skipped":
      return "softwareTeamDlc.startDeliveryBootstrapSkip";
    case "need_host":
      return "softwareTeamDlc.startDeliveryNeedHost";
    case "need_project":
      return "softwareTeamDlc.startDeliveryNeedProject";
    case "blocked_shared_home":
      return "softwareTeamDlc.startDeliveryBlockedHome";
    case "host_error":
      return "softwareTeamDlc.startDeliveryHostError";
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}

function bootstrapBody(relative: string, title: string): string {
  const slice = title.trim() || "Untitled slice";
  const stem = relative.split("/").pop() ?? relative;
  return [
    `# ${stem.replace(/\.md$/, "")}`,
    "",
    `Slice: ${slice}`,
    "",
    "Placeholder for Software Works / SDLC Studio.",
    "Stay on Grok Build. Fill this file in the project workspace.",
    "Do not write shared ~/.grok from this bootstrap.",
    "",
  ].join("\n");
}

/** Write missing `docs/sdlc/{spec,design,review}.md` under the project. Idempotent. */
export async function writeSoftwareTeamWorkspaceBootstrap(input: {
  projectPath?: string | null;
  title?: string | null;
  bootstrap?: boolean;
  host?: SoftwareTeamBootstrapHost;
}): Promise<SoftwareTeamBootstrapResult> {
  const host = input.host ?? defaultSoftwareTeamBootstrapHost();
  const plan = planSoftwareTeamWorkspaceBootstrap({
    projectPath: input.projectPath,
    bootstrap: input.bootstrap ?? true,
    host,
  });
  if (plan.reason === "skipped") {
    return { ok: true, reason: "skipped", files: [] };
  }
  if (
    plan.reason === "need_host" ||
    plan.reason === "need_project" ||
    plan.reason === "blocked_shared_home" ||
    plan.reason === "host_error"
  ) {
    return { ok: false, reason: plan.reason, files: [] };
  }
  if (!plan.allowed) {
    return { ok: false, reason: "host_error", files: [] };
  }
  const files: SoftwareTeamBootstrapFileResult[] = [];
  try {
    for (const relative of SOFTWARE_TEAM_BOOTSTRAP_RELATIVE) {
      let exists = false;
      try {
        const read = await host.readFile(plan.projectPath, relative);
        exists = !read.error && typeof read.text === "string";
      } catch {
        exists = false;
      }
      if (exists) {
        files.push({ relative, action: "skipped" });
        continue;
      }
      await host.writeFile(
        plan.projectPath,
        relative,
        bootstrapBody(relative, input.title ?? ""),
      );
      files.push({ relative, action: "created" });
    }
    return { ok: true, reason: "ok_project", files };
  } catch (err) {
    const error =
      err instanceof Error && err.message.trim()
        ? err.message.trim()
        : String(err ?? "bootstrap write failed");
    return { ok: false, reason: "host_error", error, files };
  }
}

export function inheritSoftwareTeamDeliveryId(
  items: readonly Pick<SoftwareTeamPipelineItem, "deliveryId" | "updatedAt">[],
): string {
  const withId = items.filter((item) => (item.deliveryId ?? "").trim());
  const unique = [...new Set(withId.map((item) => item.deliveryId.trim()))];
  if (unique.length === 1) return unique[0]!;
  const latest = [...withId].sort((a, b) => b.updatedAt - a.updatedAt)[0];
  return (latest?.deliveryId ?? "").trim();
}

/** Prefer an explicit id, else the board’s single/latest delivery, else a new one. */
export function resolveSoftwareTeamDeliveryId(
  items: readonly Pick<SoftwareTeamPipelineItem, "deliveryId" | "updatedAt">[],
  preferred?: string | null,
): string {
  const pref = (preferred ?? "").trim();
  if (pref) return pref;
  return inheritSoftwareTeamDeliveryId(items) || newSoftwareTeamDeliveryId();
}

export function ensureSoftwareTeamItemDeliveryId(
  item: SoftwareTeamPipelineItem,
): { item: SoftwareTeamPipelineItem; deliveryId: string; patched: boolean } {
  const existing = item.deliveryId.trim();
  if (existing) return { item, deliveryId: existing, patched: false };
  const deliveryId = newSoftwareTeamDeliveryId();
  return { item: { ...item, deliveryId }, deliveryId, patched: true };
}

export function softwareTeamDeliveryItemDraft(input: {
  title: string;
  roleId?: SoftwareTeamRoleId | null;
  deliveryId?: string | null;
  sessionId?: string | null;
  planRef?: string | null;
  goalRef?: string | null;
  artifactRef?: string | null;
}): SoftwareTeamPipelineItemDraft {
  const role = softwareTeamRoleById(input.roleId) ?? softwareTeamRoleById("product")!;
  const title = input.title.trim();
  return {
    title,
    roleId: role.id,
    stageId: role.defaultStage,
    sessionId: (input.sessionId ?? "").trim(),
    deliveryId: (input.deliveryId ?? "").trim() || newSoftwareTeamDeliveryId(),
    planRef: (input.planRef ?? "").trim(),
    goalRef: (input.goalRef ?? "").trim() || title,
    artifactRef: (input.artifactRef ?? "").trim(),
    stageSource: "board",
  };
}

/** Sibling role on the same delivery. Always unbound — launch creates a new session. */
export function softwareTeamDeliverySiblingDraft(input: {
  source: Pick<
    SoftwareTeamPipelineItem,
    "title" | "planRef" | "goalRef" | "artifactRef"
  >;
  roleId: SoftwareTeamRoleId;
  deliveryId: string;
}): SoftwareTeamPipelineItemDraft {
  const role = softwareTeamRoleById(input.roleId) ?? softwareTeamRoleById("product")!;
  return {
    title: input.source.title,
    roleId: role.id,
    stageId: role.defaultStage,
    sessionId: "",
    deliveryId: input.deliveryId.trim(),
    planRef: input.source.planRef,
    goalRef: input.source.goalRef,
    artifactRef: input.source.artifactRef,
    stageSource: "board",
  };
}

export function syncSoftwareTeamDeliverySliceRefs(
  store: SoftwareTeamPipelineStore,
  deliveryId: string,
  refs: {
    planRef?: string | null;
    goalRef?: string | null;
    artifactRef?: string | null;
  },
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const id = deliveryId.trim();
  if (!id) return store;
  const patch: Partial<
    Pick<SoftwareTeamPipelineItem, "planRef" | "goalRef" | "artifactRef">
  > = {};
  if (refs.planRef !== undefined) patch.planRef = (refs.planRef ?? "").trim();
  if (refs.goalRef !== undefined) patch.goalRef = (refs.goalRef ?? "").trim();
  if (refs.artifactRef !== undefined) {
    patch.artifactRef = (refs.artifactRef ?? "").trim();
  }
  if (Object.keys(patch).length === 0) return store;
  let next = store;
  for (const item of store.items) {
    if (item.deliveryId.trim() !== id) continue;
    next = updateSoftwareTeamPipelineItem(next, item.id, patch, now);
  }
  return next;
}

export type SoftwareTeamDeliveryNoteKind = "review" | "qa";

export function setSoftwareTeamDeliveryNote(
  store: SoftwareTeamPipelineStore,
  input: {
    deliveryId?: string | null;
    focusItemId?: string | null;
    kind: SoftwareTeamDeliveryNoteKind;
    text: string;
  },
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const field = (() => {
    switch (input.kind) {
      case "review":
        return "reviewNote" as const;
      case "qa":
        return "qaNote" as const;
      default: {
        const _never: never = input.kind;
        return _never;
      }
    }
  })();
  const roleId = (() => {
    switch (input.kind) {
      case "review":
        return "reviewer" as const;
      case "qa":
        return "qa" as const;
      default: {
        const _never: never = input.kind;
        return _never;
      }
    }
  })();
  const text = input.text.trim();
  const deliveryId = (input.deliveryId ?? "").trim();
  const focusId = (input.focusItemId ?? "").trim();
  const members = deliveryId
    ? store.items.filter((item) => item.deliveryId.trim() === deliveryId)
    : focusId
      ? store.items.filter((item) => item.id === focusId)
      : [];
  if (!members.length) return store;
  const byRole = members.find((item) => item.roleId === roleId);
  const byNote = members.find((item) => item[field].trim());
  const byFocus = focusId
    ? members.find((item) => item.id === focusId)
    : undefined;
  const target = byRole ?? byNote ?? byFocus ?? members[0];
  if (!target) return store;
  return updateSoftwareTeamPipelineItem(store, target.id, { [field]: text }, now);
}

export function renameSoftwareTeamDelivery(
  store: SoftwareTeamPipelineStore,
  deliveryId: string,
  title: string,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const id = deliveryId.trim();
  const name = title.trim();
  if (!id || !name) return store;
  let next = store;
  for (const item of store.items) {
    if (item.deliveryId.trim() !== id) continue;
    next = updateSoftwareTeamPipelineItem(
      next,
      item.id,
      { deliveryTitle: name },
      now,
    );
  }
  return next;
}

export function duplicateSoftwareTeamDelivery(
  store: SoftwareTeamPipelineStore,
  deliveryId: string,
  titleSuffix: string,
  now = Date.now(),
): { store: SoftwareTeamPipelineStore; deliveryId: string } | null {
  const id = deliveryId.trim();
  if (!id) return null;
  const members = store.items.filter((item) => item.deliveryId.trim() === id);
  if (!members.length) return null;
  const suffix = titleSuffix.trim();
  const newId = newSoftwareTeamDeliveryId();
  const copies: SoftwareTeamPipelineItem[] = [];
  for (const item of members) {
    const baseTitle = (item.deliveryTitle || item.title).trim();
    const copyTitle = suffix && baseTitle ? `${baseTitle}${suffix}` : baseTitle || suffix;
    const created = createSoftwareTeamPipelineItem({
      roleId: item.roleId,
      stageId: item.stageId,
      title: item.title.trim()
        ? suffix
          ? `${item.title.trim()}${suffix}`
          : item.title.trim()
        : "",
      deliveryTitle: copyTitle,
      planRef: item.planRef,
      goalRef: item.goalRef,
      artifactRef: item.artifactRef,
      roleHistory: item.roleHistory,
      reviewNote: item.reviewNote,
      qaNote: item.qaNote,
      deliveryId: newId,
      sessionId: "",
      sessionDonePending: false,
      archived: false,
      gitBranch: item.gitBranch,
      stageSource: "board",
      updatedAt: now,
    });
    if (created) copies.push(created);
  }
  if (!copies.length) return null;
  let next: SoftwareTeamPipelineStore = {
    items: [...store.items, ...copies],
    activity: store.activity,
    archivedDeliveryIds: store.archivedDeliveryIds,
  };
  next = appendSoftwareTeamPipelineActivity(next, {
    at: now,
    type: "delivery_duplicated",
    deliveryId: newId,
    itemId: copies[0]!.id,
    roleId: copies[0]!.roleId,
    stageId: copies[0]!.stageId,
  });
  return { store: next, deliveryId: newId };
}

/**
 * Move a card onto another delivery (or ungroup). Inherits the destination
 * title and branch label. Does not create a session or write ~/.grok.
 */
export function moveSoftwareTeamItemDelivery(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  targetDeliveryId: string | null | undefined,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const prev = pipelineItemById(store, itemId);
  if (!prev) return store;
  const target = (targetDeliveryId ?? "").trim();
  if (prev.deliveryId.trim() === target) return store;
  if (!target) {
    return updateSoftwareTeamPipelineItem(
      store,
      itemId,
      { deliveryId: "", deliveryTitle: "" },
      now,
    );
  }
  const siblings = store.items.filter(
    (item) => item.id !== prev.id && item.deliveryId.trim() === target,
  );
  const title =
    softwareTeamDeliveryTitle(siblings, target) ||
    softwareTeamDeliveryTitle(store.items, target) ||
    prev.deliveryTitle;
  const branch = softwareTeamDeliveryGitBranch(siblings) || prev.gitBranch;
  const planRef =
    firstSoftwareTeamNonEmptyField(siblings.map((item) => item.planRef)) ||
    prev.planRef;
  const goalRef =
    firstSoftwareTeamNonEmptyField(siblings.map((item) => item.goalRef)) ||
    prev.goalRef;
  const artifactRef =
    firstSoftwareTeamNonEmptyField(siblings.map((item) => item.artifactRef)) ||
    prev.artifactRef;
  return updateSoftwareTeamPipelineItem(
    store,
    itemId,
    {
      deliveryId: target,
      deliveryTitle: title,
      gitBranch: branch,
      planRef,
      goalRef,
      artifactRef,
    },
    now,
  );
}
