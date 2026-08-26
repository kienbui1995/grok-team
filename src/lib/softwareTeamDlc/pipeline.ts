/**
 * Software Works / SDLC Studio — pipeline work items (single source of truth).
 *
 * Board stage, role, and plan/goal/artifact live here. Session tags are a
 * projection written on every persist so they cannot drift from the board.
 */

import type { AgentKanbanColumnId } from "@/lib/kanbanBoard";
import type { SoftwareTeamDlcStorage } from "./pref";
import {
  isSoftwareTeamRoleId,
  softwareTeamRoleById,
  type SoftwareTeamRoleId,
} from "./roles";
import {
  isSoftwareTeamSdlcStageId,
  type SoftwareTeamSdlcStageId,
} from "./sdlc";
import {
  SOFTWARE_TEAM_DLC_TAGS_KEY,
  createEmptySoftwareTeamSessionTagMap,
  parseSoftwareTeamSessionTagMap,
  saveSoftwareTeamSessionTagMap,
  type SoftwareTeamSessionTagMap,
} from "./sessionTags";

export const SOFTWARE_TEAM_DLC_PIPELINE_KEY = "grok.softwareTeamDlc.pipeline";

/** Fired on `window` after a successful pipeline persist. */
export const SOFTWARE_TEAM_DLC_PIPELINE_CHANGE_EVENT =
  "grok-software-team-dlc-pipeline-change";

export const SOFTWARE_TEAM_STAGE_SOURCES = [
  "board",
  "session",
  "handoff",
] as const;

export type SoftwareTeamStageSource =
  (typeof SOFTWARE_TEAM_STAGE_SOURCES)[number];

export type SoftwareTeamPipelineItem = {
  id: string;
  /** Bound Grok Build session; empty = unbound. */
  sessionId: string;
  roleId: SoftwareTeamRoleId;
  stageId: SoftwareTeamSdlcStageId;
  title: string;
  planRef: string;
  goalRef: string;
  artifactRef: string;
  updatedAt: number;
  stageSource: SoftwareTeamStageSource;
};

export type SoftwareTeamPipelineStore = {
  items: SoftwareTeamPipelineItem[];
};

export type SoftwareTeamPipelineItemDraft = {
  id?: string;
  sessionId?: string;
  roleId: SoftwareTeamRoleId;
  stageId?: SoftwareTeamSdlcStageId;
  title?: string;
  planRef?: string;
  goalRef?: string;
  artifactRef?: string;
  updatedAt?: number;
  stageSource?: SoftwareTeamStageSource;
};

function defaultStorage(): SoftwareTeamDlcStorage {
  if (typeof localStorage !== "undefined") return localStorage;
  return { getItem: () => null, setItem: () => {} };
}

export function isSoftwareTeamStageSource(
  raw: string | null | undefined,
): raw is SoftwareTeamStageSource {
  return (
    typeof raw === "string" &&
    (SOFTWARE_TEAM_STAGE_SOURCES as readonly string[]).includes(raw)
  );
}

export function createEmptySoftwareTeamPipelineStore(): SoftwareTeamPipelineStore {
  return { items: [] };
}

export function newSoftwareTeamPipelineItemId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createSoftwareTeamPipelineItem(
  draft: SoftwareTeamPipelineItemDraft,
): SoftwareTeamPipelineItem | null {
  const role = softwareTeamRoleById(draft.roleId);
  if (!role) return null;
  const stageId = isSoftwareTeamSdlcStageId(draft.stageId)
    ? draft.stageId
    : role.defaultStage;
  const stageSource = isSoftwareTeamStageSource(draft.stageSource)
    ? draft.stageSource
    : "board";
  const id = (draft.id ?? "").trim() || newSoftwareTeamPipelineItemId();
  return {
    id,
    sessionId: (draft.sessionId ?? "").trim(),
    roleId: role.id,
    stageId,
    title: (draft.title ?? "").trim(),
    planRef: (draft.planRef ?? "").trim(),
    goalRef: (draft.goalRef ?? "").trim(),
    artifactRef: (draft.artifactRef ?? "").trim(),
    updatedAt:
      typeof draft.updatedAt === "number" && Number.isFinite(draft.updatedAt)
        ? draft.updatedAt
        : Date.now(),
    stageSource,
  };
}

export function parseSoftwareTeamPipelineItem(
  raw: unknown,
): SoftwareTeamPipelineItem | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const rec = raw as Record<string, unknown>;
  const id = typeof rec.id === "string" ? rec.id.trim() : "";
  const roleRaw = typeof rec.roleId === "string" ? rec.roleId : null;
  if (!id || !isSoftwareTeamRoleId(roleRaw)) return null;
  return createSoftwareTeamPipelineItem({
    id,
    sessionId: typeof rec.sessionId === "string" ? rec.sessionId : "",
    roleId: roleRaw,
    stageId: typeof rec.stageId === "string" ? rec.stageId : undefined,
    title: typeof rec.title === "string" ? rec.title : "",
    planRef: typeof rec.planRef === "string" ? rec.planRef : "",
    goalRef: typeof rec.goalRef === "string" ? rec.goalRef : "",
    artifactRef: typeof rec.artifactRef === "string" ? rec.artifactRef : "",
    updatedAt: typeof rec.updatedAt === "number" ? rec.updatedAt : undefined,
    stageSource:
      typeof rec.stageSource === "string" ? rec.stageSource : undefined,
  });
}

export function parseSoftwareTeamPipelineStore(
  raw: unknown,
): SoftwareTeamPipelineStore {
  let data: unknown = raw;
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) return createEmptySoftwareTeamPipelineStore();
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      return createEmptySoftwareTeamPipelineStore();
    }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return createEmptySoftwareTeamPipelineStore();
  }
  const rec = data as Record<string, unknown>;
  const list = Array.isArray(rec.items) ? rec.items : [];
  const items: SoftwareTeamPipelineItem[] = [];
  const seen = new Set<string>();
  for (const entry of list) {
    const item = parseSoftwareTeamPipelineItem(entry);
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }
  return { items };
}

export function serializeSoftwareTeamPipelineStore(
  store: SoftwareTeamPipelineStore,
): string {
  return JSON.stringify({ items: store.items });
}

export function hydratePipelineFromSessionTags(
  tags: SoftwareTeamSessionTagMap,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const items: SoftwareTeamPipelineItem[] = [];
  for (const [sessionId, tag] of Object.entries(tags)) {
    const id = sessionId.trim();
    if (!id) continue;
    const item = createSoftwareTeamPipelineItem({
      id: `tag:${id}`,
      sessionId: id,
      roleId: tag.roleId,
      stageId: tag.stageId,
      updatedAt: now,
      stageSource: "board",
    });
    if (item) items.push(item);
  }
  return { items };
}

export function loadSoftwareTeamPipelineStore(
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): SoftwareTeamPipelineStore {
  try {
    const raw = storage.getItem(SOFTWARE_TEAM_DLC_PIPELINE_KEY);
    const parsed = parseSoftwareTeamPipelineStore(raw);
    if (parsed.items.length > 0) return parsed;
    const tagRaw = storage.getItem(SOFTWARE_TEAM_DLC_TAGS_KEY);
    if (!tagRaw) return createEmptySoftwareTeamPipelineStore();
    return hydratePipelineFromSessionTags(parseSoftwareTeamSessionTagMap(tagRaw));
  } catch {
    return createEmptySoftwareTeamPipelineStore();
  }
}

export function projectSessionTagsFromPipeline(
  store: SoftwareTeamPipelineStore,
): SoftwareTeamSessionTagMap {
  const out = createEmptySoftwareTeamSessionTagMap();
  const ranked = [...store.items].sort((a, b) => a.updatedAt - b.updatedAt);
  for (const item of ranked) {
    const sessionId = item.sessionId.trim();
    if (!sessionId) continue;
    out[sessionId] = { roleId: item.roleId, stageId: item.stageId };
  }
  return out;
}

function emitPipelineChange(): void {
  if (
    typeof window === "undefined" ||
    typeof window.dispatchEvent !== "function"
  ) {
    return;
  }
  try {
    window.dispatchEvent(new Event(SOFTWARE_TEAM_DLC_PIPELINE_CHANGE_EVENT));
    window.dispatchEvent(new Event("grok-software-team-dlc-tags-change"));
  } catch {
    /* ignore */
  }
}

export function persistSoftwareTeamPipeline(
  store: SoftwareTeamPipelineStore,
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): void {
  try {
    storage.setItem(
      SOFTWARE_TEAM_DLC_PIPELINE_KEY,
      serializeSoftwareTeamPipelineStore(store),
    );
  } catch {
    /* private mode / quota */
  }
  saveSoftwareTeamSessionTagMap(projectSessionTagsFromPipeline(store), storage);
  emitPipelineChange();
}

export function pipelineItemById(
  store: SoftwareTeamPipelineStore,
  itemId: string,
): SoftwareTeamPipelineItem | null {
  const id = itemId.trim();
  if (!id) return null;
  return store.items.find((item) => item.id === id) ?? null;
}

export function pipelineItemForSession(
  store: SoftwareTeamPipelineStore,
  sessionId: string | null | undefined,
): SoftwareTeamPipelineItem | null {
  const id = (sessionId ?? "").trim();
  if (!id) return null;
  const matches = store.items.filter((item) => item.sessionId === id);
  if (matches.length === 0) return null;
  return matches.reduce((best, item) =>
    item.updatedAt >= best.updatedAt ? item : best,
  );
}

export function pipelineItemsByStage(
  store: SoftwareTeamPipelineStore,
  stageId: SoftwareTeamSdlcStageId,
): SoftwareTeamPipelineItem[] {
  return store.items
    .filter((item) => item.stageId === stageId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function pipelineItemsForRole(
  store: SoftwareTeamPipelineStore,
  roleId: SoftwareTeamRoleId,
): SoftwareTeamPipelineItem[] {
  return store.items
    .filter((item) => item.roleId === roleId)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

function replaceItem(
  store: SoftwareTeamPipelineStore,
  next: SoftwareTeamPipelineItem,
): SoftwareTeamPipelineStore {
  const idx = store.items.findIndex((item) => item.id === next.id);
  if (idx < 0) return { items: [...store.items, next] };
  if (store.items[idx] === next) return store;
  const items = store.items.slice();
  items[idx] = next;
  return { items };
}

export function addSoftwareTeamPipelineItem(
  store: SoftwareTeamPipelineStore,
  draft: SoftwareTeamPipelineItemDraft,
): SoftwareTeamPipelineStore {
  const item = createSoftwareTeamPipelineItem(draft);
  if (!item) return store;
  let next: SoftwareTeamPipelineStore = {
    items: store.items.filter((existing) => existing.id !== item.id),
  };
  if (item.sessionId) {
    next = unbindOtherSessions(next, item.id, item.sessionId);
  }
  return { items: [...next.items, item] };
}

function unbindOtherSessions(
  store: SoftwareTeamPipelineStore,
  keepItemId: string,
  sessionId: string,
): SoftwareTeamPipelineStore {
  const id = sessionId.trim();
  if (!id) return store;
  let changed = false;
  const items = store.items.map((item) => {
    if (item.id === keepItemId || item.sessionId !== id) return item;
    changed = true;
    return { ...item, sessionId: "", updatedAt: Date.now() };
  });
  return changed ? { items } : store;
}

export function updateSoftwareTeamPipelineItem(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  patch: Partial<
    Omit<SoftwareTeamPipelineItem, "id"> & {
      roleId?: SoftwareTeamRoleId;
      stageId?: SoftwareTeamSdlcStageId;
    }
  >,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const prev = pipelineItemById(store, itemId);
  if (!prev) return store;
  const roleId = patch.roleId ?? prev.roleId;
  const role = softwareTeamRoleById(roleId);
  if (!role) return store;
  const next = createSoftwareTeamPipelineItem({
    id: prev.id,
    sessionId: patch.sessionId ?? prev.sessionId,
    roleId: role.id,
    stageId: patch.stageId ?? prev.stageId,
    title: patch.title ?? prev.title,
    planRef: patch.planRef ?? prev.planRef,
    goalRef: patch.goalRef ?? prev.goalRef,
    artifactRef: patch.artifactRef ?? prev.artifactRef,
    updatedAt: now,
    stageSource: patch.stageSource ?? prev.stageSource,
  });
  if (!next) return store;
  if (
    next.sessionId === prev.sessionId &&
    next.roleId === prev.roleId &&
    next.stageId === prev.stageId &&
    next.title === prev.title &&
    next.planRef === prev.planRef &&
    next.goalRef === prev.goalRef &&
    next.artifactRef === prev.artifactRef &&
    next.stageSource === prev.stageSource
  ) {
    return store;
  }
  let out = replaceItem(store, next);
  if (next.sessionId) {
    out = unbindOtherSessions(out, next.id, next.sessionId);
  }
  return out;
}

export function setPipelineItemStage(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  stageId: SoftwareTeamSdlcStageId,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  if (!isSoftwareTeamSdlcStageId(stageId)) return store;
  return updateSoftwareTeamPipelineItem(
    store,
    itemId,
    { stageId, stageSource: "board" },
    now,
  );
}

export function setPipelineItemRole(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  roleId: SoftwareTeamRoleId,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const role = softwareTeamRoleById(roleId);
  if (!role) return store;
  const prev = pipelineItemById(store, itemId);
  if (!prev) return store;
  const stageId = prev.stageId;
  return updateSoftwareTeamPipelineItem(
    store,
    itemId,
    { roleId: role.id, stageId, stageSource: prev.stageSource },
    now,
  );
}

export function bindPipelineItemSession(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  sessionId: string,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  return updateSoftwareTeamPipelineItem(
    store,
    itemId,
    { sessionId: sessionId.trim() },
    now,
  );
}

export function removeSoftwareTeamPipelineItem(
  store: SoftwareTeamPipelineStore,
  itemId: string,
): SoftwareTeamPipelineStore {
  const id = itemId.trim();
  if (!id || !store.items.some((item) => item.id === id)) return store;
  return { items: store.items.filter((item) => item.id !== id) };
}

/**
 * Live agent Kanban column → pipeline stage when the mapping is unambiguous.
 * `needs_you` / `idle` stay board-owned (Backlog / Design / Review overlap).
 */
export function stageFromSessionKanbanColumn(
  column: AgentKanbanColumnId,
): SoftwareTeamSdlcStageId | null {
  switch (column) {
    case "working":
      return "build";
    case "done":
      return "ship";
    case "needs_you":
    case "idle":
      return null;
    default: {
      const _never: never = column;
      return _never;
    }
  }
}

export function applySessionKanbanToItem(
  item: SoftwareTeamPipelineItem,
  column: AgentKanbanColumnId,
  now = Date.now(),
): SoftwareTeamPipelineItem {
  const stageId = stageFromSessionKanbanColumn(column);
  if (!stageId || item.stageId === stageId) return item;
  return {
    ...item,
    stageId,
    stageSource: "session",
    updatedAt: now,
  };
}

export function applySessionKanbanToPipeline(
  store: SoftwareTeamPipelineStore,
  sessionId: string,
  column: AgentKanbanColumnId,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const item = pipelineItemForSession(store, sessionId);
  if (!item) return store;
  const next = applySessionKanbanToItem(item, column, now);
  if (next === item) return store;
  return replaceItem(store, next);
}

export function applySessionKanbanBoardToPipeline(
  store: SoftwareTeamPipelineStore,
  placements: ReadonlyArray<{
    sessionId: string;
    column: AgentKanbanColumnId;
  }>,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  let next = store;
  for (const row of placements) {
    next = applySessionKanbanToPipeline(next, row.sessionId, row.column, now);
  }
  return next;
}

export function assignSessionToPipeline(
  store: SoftwareTeamPipelineStore,
  sessionId: string,
  patch: { roleId?: SoftwareTeamRoleId; stageId?: SoftwareTeamSdlcStageId },
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const id = sessionId.trim();
  if (!id) return store;
  const existing = pipelineItemForSession(store, id);
  const roleId = patch.roleId ?? existing?.roleId ?? "engineer";
  const role = softwareTeamRoleById(roleId);
  if (!role) return store;
  if (existing) {
    return updateSoftwareTeamPipelineItem(
      store,
      existing.id,
      {
        roleId: role.id,
        stageId: patch.stageId ?? existing.stageId,
        stageSource: "board",
      },
      now,
    );
  }
  return addSoftwareTeamPipelineItem(store, {
    sessionId: id,
    roleId: role.id,
    stageId: patch.stageId ?? role.defaultStage,
    updatedAt: now,
    stageSource: "board",
  });
}

export function clearSessionFromPipeline(
  store: SoftwareTeamPipelineStore,
  sessionId: string,
): SoftwareTeamPipelineStore {
  const item = pipelineItemForSession(store, sessionId);
  if (!item) return store;
  const emptyMeta =
    !item.title && !item.planRef && !item.goalRef && !item.artifactRef;
  if (emptyMeta) return removeSoftwareTeamPipelineItem(store, item.id);
  return updateSoftwareTeamPipelineItem(store, item.id, { sessionId: "" });
}

export function pipelineItemHasArtifact(
  item: SoftwareTeamPipelineItem,
): boolean {
  return Boolean(item.planRef || item.goalRef || item.artifactRef);
}
