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
import {
  recordSoftwareTeamRoleVisit,
  softwareTeamShipGate,
} from "./shipGate";
import {
  appendSoftwareTeamActivity,
  parseSoftwareTeamActivityList,
  type SoftwareTeamActivityEvent,
  type SoftwareTeamActivityNoteKind,
  type SoftwareTeamActivityType,
} from "./activity";

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
  /** Roles this slice has occupied (Reviewer + QA required before Ship). */
  roleHistory: SoftwareTeamRoleId[];
  reviewNote: string;
  qaNote: string;
  /** Groups items that belong to one Start-a-delivery slice. */
  deliveryId: string;
  /** Live Kanban `done` while Ship is blocked or waiting for a Ship click. */
  sessionDonePending: boolean;
  updatedAt: number;
  stageSource: SoftwareTeamStageSource;
  /** SoT v3. Missing on v1–v2 items = false. */
  archived: boolean;
};

export type SoftwareTeamPipelineStore = {
  items: SoftwareTeamPipelineItem[];
  /** SoT v2. Empty on v1 files and legacy localStorage caches. */
  activity: SoftwareTeamActivityEvent[];
  /** SoT v3. Missing on v1–v2 files = []. */
  archivedDeliveryIds: string[];
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
  roleHistory?: SoftwareTeamRoleId[];
  reviewNote?: string;
  qaNote?: string;
  deliveryId?: string;
  sessionDonePending?: boolean;
  updatedAt?: number;
  stageSource?: SoftwareTeamStageSource;
  archived?: boolean;
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
  return { items: [], activity: [], archivedDeliveryIds: [] };
}

export function softwareTeamPipelineActivity(
  store: SoftwareTeamPipelineStore,
): SoftwareTeamActivityEvent[] {
  return Array.isArray(store.activity) ? store.activity : [];
}

export function parseSoftwareTeamArchivedDeliveryIds(
  raw: unknown,
): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const entry of raw) {
    if (typeof entry !== "string") continue;
    const id = entry.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function softwareTeamArchivedDeliveryIds(
  store: Pick<SoftwareTeamPipelineStore, "archivedDeliveryIds"> | undefined,
): string[] {
  return Array.isArray(store?.archivedDeliveryIds)
    ? store.archivedDeliveryIds
    : [];
}

function withItems(
  store: SoftwareTeamPipelineStore,
  items: SoftwareTeamPipelineItem[],
): SoftwareTeamPipelineStore {
  return {
    items,
    activity: softwareTeamPipelineActivity(store),
    archivedDeliveryIds: softwareTeamArchivedDeliveryIds(store),
  };
}

export function appendSoftwareTeamPipelineActivity(
  store: SoftwareTeamPipelineStore,
  event: SoftwareTeamActivityEvent,
): SoftwareTeamPipelineStore {
  return {
    items: store.items,
    activity: appendSoftwareTeamActivity(
      softwareTeamPipelineActivity(store),
      event,
    ),
    archivedDeliveryIds: softwareTeamArchivedDeliveryIds(store),
  };
}

function activityDraft(
  type: SoftwareTeamActivityType,
  item: Pick<
    SoftwareTeamPipelineItem,
    "id" | "deliveryId" | "roleId" | "stageId"
  >,
  extra?: {
    at?: number;
    noteKind?: SoftwareTeamActivityNoteKind;
  },
): SoftwareTeamActivityEvent {
  const event: SoftwareTeamActivityEvent = {
    at: extra?.at ?? Date.now(),
    type,
    deliveryId: item.deliveryId,
    itemId: item.id,
    roleId: item.roleId,
    stageId: item.stageId,
  };
  if (extra?.noteKind) event.noteKind = extra.noteKind;
  return event;
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
    roleHistory: recordSoftwareTeamRoleVisit(
      draft.roleHistory,
      role.id,
    ),
    reviewNote: (draft.reviewNote ?? "").trim(),
    qaNote: (draft.qaNote ?? "").trim(),
    deliveryId: (draft.deliveryId ?? "").trim(),
    sessionDonePending: draft.sessionDonePending === true,
    archived: draft.archived === true,
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
  const stageRaw = typeof rec.stageId === "string" ? rec.stageId : null;
  const sourceRaw =
    typeof rec.stageSource === "string" ? rec.stageSource : null;
  return createSoftwareTeamPipelineItem({
    id,
    sessionId: typeof rec.sessionId === "string" ? rec.sessionId : "",
    roleId: roleRaw,
    stageId: isSoftwareTeamSdlcStageId(stageRaw) ? stageRaw : undefined,
    title: typeof rec.title === "string" ? rec.title : "",
    planRef: typeof rec.planRef === "string" ? rec.planRef : "",
    goalRef: typeof rec.goalRef === "string" ? rec.goalRef : "",
    artifactRef: typeof rec.artifactRef === "string" ? rec.artifactRef : "",
    roleHistory: Array.isArray(rec.roleHistory)
      ? rec.roleHistory.filter(isSoftwareTeamRoleId)
      : undefined,
    reviewNote: typeof rec.reviewNote === "string" ? rec.reviewNote : "",
    qaNote: typeof rec.qaNote === "string" ? rec.qaNote : "",
    deliveryId: typeof rec.deliveryId === "string" ? rec.deliveryId : "",
    sessionDonePending: rec.sessionDonePending === true,
    archived: rec.archived === true,
    updatedAt: typeof rec.updatedAt === "number" ? rec.updatedAt : undefined,
    stageSource: isSoftwareTeamStageSource(sourceRaw) ? sourceRaw : undefined,
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
  const archivedDeliveryIds = parseSoftwareTeamArchivedDeliveryIds(
    rec.archivedDeliveryIds,
  );
  for (const item of items) {
    if (item.archived && item.deliveryId && !archivedDeliveryIds.includes(item.deliveryId)) {
      archivedDeliveryIds.push(item.deliveryId);
    }
  }
  return {
    items,
    activity: parseSoftwareTeamActivityList(rec.activity),
    archivedDeliveryIds,
  };
}

export function serializeSoftwareTeamPipelineStore(
  store: SoftwareTeamPipelineStore,
): string {
  return JSON.stringify({
    items: store.items,
    activity: softwareTeamPipelineActivity(store),
    archivedDeliveryIds: softwareTeamArchivedDeliveryIds(store),
  });
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
  return { items, activity: [], archivedDeliveryIds: [] };
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
  if (idx < 0) return withItems(store, [...store.items, next]);
  if (store.items[idx] === next) return store;
  const items = store.items.slice();
  items[idx] = next;
  return withItems(store, items);
}

export function addSoftwareTeamPipelineItem(
  store: SoftwareTeamPipelineStore,
  draft: SoftwareTeamPipelineItemDraft,
): SoftwareTeamPipelineStore {
  const created = createSoftwareTeamPipelineItem(draft);
  if (!created) return store;
  const item =
    created.stageId === "ship" && !softwareTeamShipGate(created).ok
      ? { ...created, stageId: "review" as const }
      : created;
  const isNewDelivery =
    Boolean(item.deliveryId) &&
    !store.items.some(
      (existing) =>
        existing.id !== item.id && existing.deliveryId === item.deliveryId,
    );
  let next = withItems(
    store,
    store.items.filter((existing) => existing.id !== item.id),
  );
  if (item.sessionId) {
    next = unbindOtherSessions(next, item.id, item.sessionId);
  }
  next = withItems(next, [...next.items, item]);
  next = appendSoftwareTeamPipelineActivity(
    next,
    activityDraft("item_added", item, { at: item.updatedAt }),
  );
  if (isNewDelivery) {
    next = appendSoftwareTeamPipelineActivity(
      next,
      activityDraft("delivery_started", item, { at: item.updatedAt }),
    );
  }
  return next;
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
  return changed ? withItems(store, items) : store;
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
  let stageId = patch.stageId ?? prev.stageId;
  if (stageId === "ship" && prev.stageId !== "ship") {
    const probeHistory = recordSoftwareTeamRoleVisit(
      patch.roleHistory ?? prev.roleHistory,
      prev.roleId,
      role.id,
    );
    const probe = {
      roleId: role.id,
      roleHistory: probeHistory,
      reviewNote: (patch.reviewNote ?? prev.reviewNote).trim(),
      qaNote: (patch.qaNote ?? prev.qaNote).trim(),
    };
    if (!softwareTeamShipGate(probe).ok) {
      stageId = prev.stageId;
    }
  }
  const next = createSoftwareTeamPipelineItem({
    id: prev.id,
    sessionId: patch.sessionId ?? prev.sessionId,
    roleId: role.id,
    stageId,
    title: patch.title ?? prev.title,
    planRef: patch.planRef ?? prev.planRef,
    goalRef: patch.goalRef ?? prev.goalRef,
    artifactRef: patch.artifactRef ?? prev.artifactRef,
    roleHistory: recordSoftwareTeamRoleVisit(
      patch.roleHistory ?? prev.roleHistory,
      prev.roleId,
      role.id,
    ),
    reviewNote: patch.reviewNote ?? prev.reviewNote,
    qaNote: patch.qaNote ?? prev.qaNote,
    deliveryId: patch.deliveryId ?? prev.deliveryId,
    sessionDonePending:
      patch.sessionDonePending ?? prev.sessionDonePending,
    archived: patch.archived ?? prev.archived,
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
    next.reviewNote === prev.reviewNote &&
    next.qaNote === prev.qaNote &&
    next.deliveryId === prev.deliveryId &&
    next.sessionDonePending === prev.sessionDonePending &&
    next.archived === prev.archived &&
    next.roleHistory.join(",") === prev.roleHistory.join(",") &&
    next.stageSource === prev.stageSource
  ) {
    return store;
  }
  let out = replaceItem(store, next);
  if (next.sessionId) {
    out = unbindOtherSessions(out, next.id, next.sessionId);
  }
  if (next.stageId !== prev.stageId && next.stageSource !== "handoff") {
    out = appendSoftwareTeamPipelineActivity(
      out,
      activityDraft("stage_changed", next, { at: now }),
    );
  }
  if (next.reviewNote !== prev.reviewNote || next.qaNote !== prev.qaNote) {
    const noteKind: SoftwareTeamActivityNoteKind =
      next.qaNote !== prev.qaNote && next.reviewNote === prev.reviewNote
        ? "qa"
        : "review";
    out = appendSoftwareTeamPipelineActivity(
      out,
      activityDraft("notes", next, { at: now, noteKind }),
    );
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
  const prev = pipelineItemById(store, itemId);
  if (!prev) return store;
  if (stageId === "ship" && !softwareTeamShipGate(prev).ok) {
    return store;
  }
  return updateSoftwareTeamPipelineItem(
    store,
    itemId,
    {
      stageId,
      stageSource: "board",
      sessionDonePending: stageId === "ship" ? false : prev.sessionDonePending,
    },
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
  return withItems(
    store,
    store.items.filter((item) => item.id !== id),
  );
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
  if (column === "done") {
    if (item.stageId === "ship") {
      return item.sessionDonePending
        ? { ...item, sessionDonePending: false, updatedAt: now }
        : item;
    }
    if (item.sessionDonePending) return item;
    return {
      ...item,
      sessionDonePending: true,
      stageSource: "session",
      updatedAt: now,
    };
  }
  const stageId = stageFromSessionKanbanColumn(column);
  if (!stageId || item.stageId === stageId) return item;
  return {
    ...item,
    stageId,
    sessionDonePending: false,
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
  let out = replaceItem(store, next);
  if (next.stageId !== item.stageId) {
    out = appendSoftwareTeamPipelineActivity(
      out,
      activityDraft("stage_changed", next, { at: now }),
    );
  }
  return out;
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
    !item.title &&
    !item.planRef &&
    !item.goalRef &&
    !item.artifactRef &&
    !item.reviewNote &&
    !item.qaNote;
  if (emptyMeta) return removeSoftwareTeamPipelineItem(store, item.id);
  return updateSoftwareTeamPipelineItem(store, item.id, { sessionId: "" });
}

export function pipelineItemHasArtifact(
  item: SoftwareTeamPipelineItem,
): boolean {
  return Boolean(item.planRef || item.goalRef || item.artifactRef);
}
