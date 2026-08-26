/**
 * Software Works — pipeline activity log (SoT v2).
 *
 * v1 files have no `activity`. Unknown event types are skipped so a newer
 * writer cannot wipe the board. Cap keeps the file bounded.
 */

import type { MessageKey } from "@/i18n";
import { isSoftwareTeamRoleId, type SoftwareTeamRoleId } from "./roles";
import {
  isSoftwareTeamSdlcStageId,
  type SoftwareTeamSdlcStageId,
} from "./sdlc";

export const SOFTWARE_TEAM_ACTIVITY_TYPES = [
  "item_added",
  "stage_changed",
  "handoff",
  "notes",
  "delivery_started",
] as const;

export type SoftwareTeamActivityType =
  (typeof SOFTWARE_TEAM_ACTIVITY_TYPES)[number];

export const SOFTWARE_TEAM_ACTIVITY_NOTE_KINDS = ["review", "qa"] as const;

export type SoftwareTeamActivityNoteKind =
  (typeof SOFTWARE_TEAM_ACTIVITY_NOTE_KINDS)[number];

export const SOFTWARE_TEAM_ACTIVITY_MAX = 200;

export type SoftwareTeamActivityEvent = {
  at: number;
  type: SoftwareTeamActivityType;
  deliveryId: string;
  itemId: string;
  roleId?: SoftwareTeamRoleId;
  stageId?: SoftwareTeamSdlcStageId;
  noteKind?: SoftwareTeamActivityNoteKind;
};

export function isSoftwareTeamActivityType(
  raw: string | null | undefined,
): raw is SoftwareTeamActivityType {
  return (
    typeof raw === "string" &&
    (SOFTWARE_TEAM_ACTIVITY_TYPES as readonly string[]).includes(raw)
  );
}

export function isSoftwareTeamActivityNoteKind(
  raw: string | null | undefined,
): raw is SoftwareTeamActivityNoteKind {
  return (
    typeof raw === "string" &&
    (SOFTWARE_TEAM_ACTIVITY_NOTE_KINDS as readonly string[]).includes(raw)
  );
}

export function parseSoftwareTeamActivityEvent(
  raw: unknown,
): SoftwareTeamActivityEvent | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const rec = raw as Record<string, unknown>;
  const typeRaw = typeof rec.type === "string" ? rec.type : "";
  if (!isSoftwareTeamActivityType(typeRaw)) return null;
  const at =
    typeof rec.at === "number" && Number.isFinite(rec.at) ? rec.at : NaN;
  if (!Number.isFinite(at)) return null;
  const event: SoftwareTeamActivityEvent = {
    at,
    type: typeRaw,
    deliveryId: typeof rec.deliveryId === "string" ? rec.deliveryId.trim() : "",
    itemId: typeof rec.itemId === "string" ? rec.itemId.trim() : "",
  };
  const roleRaw = typeof rec.roleId === "string" ? rec.roleId : null;
  if (isSoftwareTeamRoleId(roleRaw)) event.roleId = roleRaw;
  const stageRaw = typeof rec.stageId === "string" ? rec.stageId : null;
  if (isSoftwareTeamSdlcStageId(stageRaw)) event.stageId = stageRaw;
  const noteRaw = typeof rec.noteKind === "string" ? rec.noteKind : null;
  if (isSoftwareTeamActivityNoteKind(noteRaw)) event.noteKind = noteRaw;
  return event;
}

export function parseSoftwareTeamActivityList(
  raw: unknown,
): SoftwareTeamActivityEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: SoftwareTeamActivityEvent[] = [];
  for (const entry of raw) {
    const event = parseSoftwareTeamActivityEvent(entry);
    if (event) out.push(event);
  }
  return out;
}

export function appendSoftwareTeamActivity(
  events: readonly SoftwareTeamActivityEvent[] | undefined,
  event: SoftwareTeamActivityEvent,
): SoftwareTeamActivityEvent[] {
  const next = [...(events ?? []), event];
  if (next.length <= SOFTWARE_TEAM_ACTIVITY_MAX) return next;
  return next.slice(next.length - SOFTWARE_TEAM_ACTIVITY_MAX);
}

export function softwareTeamActivityForDelivery(
  events: readonly SoftwareTeamActivityEvent[] | undefined,
  deliveryId: string,
  itemIds?: ReadonlySet<string>,
): SoftwareTeamActivityEvent[] {
  const id = deliveryId.trim();
  const list = events ?? [];
  if (!id && !itemIds?.size) return [];
  return list.filter((event) => {
    if (id && event.deliveryId.trim() === id) return true;
    if (itemIds?.has(event.itemId)) return true;
    return false;
  });
}

export function softwareTeamActivityMessageKey(
  type: SoftwareTeamActivityType,
): MessageKey {
  switch (type) {
    case "item_added":
      return "softwareTeamDlc.activity.item_added";
    case "stage_changed":
      return "softwareTeamDlc.activity.stage_changed";
    case "handoff":
      return "softwareTeamDlc.activity.handoff";
    case "notes":
      return "softwareTeamDlc.activity.notes";
    case "delivery_started":
      return "softwareTeamDlc.activity.delivery_started";
    default: {
      const _never: never = type;
      return _never;
    }
  }
}
