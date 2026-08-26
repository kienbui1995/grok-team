/**
 * Software Team DLC — session ↔ role / SDLC stage tags.
 *
 * Local overlay only. Does not change Host session schema or move Kanban
 * cards (placement stays live run-state).
 */

import {
  isSoftwareTeamRoleId,
  softwareTeamRoleById,
  type SoftwareTeamRoleId,
} from "./roles";
import {
  isSoftwareTeamSdlcStageId,
  type SoftwareTeamSdlcStageId,
} from "./sdlc";
import type { SoftwareTeamDlcStorage } from "./pref";

export const SOFTWARE_TEAM_DLC_TAGS_KEY = "grok.softwareTeamDlc.sessionTags";

export type SoftwareTeamSessionTag = {
  roleId: SoftwareTeamRoleId;
  stageId: SoftwareTeamSdlcStageId;
};

export type SoftwareTeamSessionTagMap = Record<string, SoftwareTeamSessionTag>;

function defaultStorage(): SoftwareTeamDlcStorage {
  if (typeof localStorage !== "undefined") return localStorage;
  return { getItem: () => null, setItem: () => {} };
}

export function createEmptySoftwareTeamSessionTagMap(): SoftwareTeamSessionTagMap {
  return {};
}

export function parseSoftwareTeamSessionTag(
  raw: unknown,
): SoftwareTeamSessionTag | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const rec = raw as Record<string, unknown>;
  if (!isSoftwareTeamRoleId(rec.roleId)) return null;
  const role = softwareTeamRoleById(rec.roleId);
  if (!role) return null;
  const stageId = isSoftwareTeamSdlcStageId(rec.stageId)
    ? rec.stageId
    : role.defaultStage;
  return { roleId: rec.roleId, stageId };
}

export function parseSoftwareTeamSessionTagMap(
  raw: unknown,
): SoftwareTeamSessionTagMap {
  let data: unknown = raw;
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) return createEmptySoftwareTeamSessionTagMap();
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      return createEmptySoftwareTeamSessionTagMap();
    }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return createEmptySoftwareTeamSessionTagMap();
  }
  const out: SoftwareTeamSessionTagMap = {};
  for (const [sessionId, value] of Object.entries(
    data as Record<string, unknown>,
  )) {
    const id = sessionId.trim();
    if (!id) continue;
    const tag = parseSoftwareTeamSessionTag(value);
    if (!tag) continue;
    out[id] = tag;
  }
  return out;
}

export function serializeSoftwareTeamSessionTagMap(
  map: SoftwareTeamSessionTagMap,
): string {
  return JSON.stringify(map);
}

export function loadSoftwareTeamSessionTagMap(
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): SoftwareTeamSessionTagMap {
  try {
    const raw = storage.getItem(SOFTWARE_TEAM_DLC_TAGS_KEY);
    if (!raw) return createEmptySoftwareTeamSessionTagMap();
    return parseSoftwareTeamSessionTagMap(raw);
  } catch {
    return createEmptySoftwareTeamSessionTagMap();
  }
}

export function saveSoftwareTeamSessionTagMap(
  map: SoftwareTeamSessionTagMap,
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): void {
  try {
    storage.setItem(
      SOFTWARE_TEAM_DLC_TAGS_KEY,
      serializeSoftwareTeamSessionTagMap(map),
    );
  } catch {
    /* private mode / quota */
  }
}

export function getSoftwareTeamSessionTag(
  map: SoftwareTeamSessionTagMap,
  sessionId: string | null | undefined,
): SoftwareTeamSessionTag | null {
  const id = (sessionId ?? "").trim();
  if (!id) return null;
  return map[id] ?? null;
}

export function upsertSoftwareTeamSessionTag(
  map: SoftwareTeamSessionTagMap,
  sessionId: string,
  patch: Partial<SoftwareTeamSessionTag> & { roleId?: SoftwareTeamRoleId },
): SoftwareTeamSessionTagMap {
  const id = sessionId.trim();
  if (!id) return map;
  const prev = map[id];
  const roleId = patch.roleId ?? prev?.roleId;
  if (!roleId) return map;
  const role = softwareTeamRoleById(roleId);
  if (!role) return map;
  const stageId = patch.stageId ?? prev?.stageId ?? role.defaultStage;
  const next: SoftwareTeamSessionTag = { roleId, stageId };
  if (prev && prev.roleId === next.roleId && prev.stageId === next.stageId) {
    return map;
  }
  return { ...map, [id]: next };
}

export function clearSoftwareTeamSessionTag(
  map: SoftwareTeamSessionTagMap,
  sessionId: string,
): SoftwareTeamSessionTagMap {
  const id = sessionId.trim();
  if (!id || map[id] == null) return map;
  const next = { ...map };
  delete next[id];
  return next;
}
