/**
 * Software Works — session tag projection.
 *
 * Tags are written from the pipeline store so they cannot drift from the
 * SDLC board. Prefer `persistSoftwareTeamPipeline` over writing this map
 * directly.
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
  const roleRaw = typeof rec.roleId === "string" ? rec.roleId : null;
  if (!isSoftwareTeamRoleId(roleRaw)) return null;
  const role = softwareTeamRoleById(roleRaw);
  if (!role) return null;
  const stageRaw = typeof rec.stageId === "string" ? rec.stageId : null;
  const stageId = isSoftwareTeamSdlcStageId(stageRaw)
    ? stageRaw
    : role.defaultStage;
  return { roleId: roleRaw, stageId };
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
  key: string = SOFTWARE_TEAM_DLC_TAGS_KEY,
): void {
  try {
    storage.setItem(key, serializeSoftwareTeamSessionTagMap(map));
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
