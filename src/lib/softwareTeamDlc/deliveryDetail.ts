/**
 * Software Works — delivery detail view-model (Studio pane).
 *
 * Pure grouping: title, role history, Review/QA notes, next CTA, sessions
 * sharing `deliveryId`. Does not invent Host team-attach.
 */

import { SOFTWARE_TEAM_HANDOFF_CHAIN, nextSoftwareTeamRole } from "./handoff";
import {
  decideSoftwareTeamDoneCta,
  type SoftwareTeamDoneCta,
} from "./doneCta";
import { softwareTeamShipGate } from "./shipGate";
import {
  softwareTeamActivityForDelivery,
  type SoftwareTeamActivityEvent,
} from "./activity";
import { isSoftwareTeamItemArchived } from "./archive";
import { softwareTeamDeliveryGitBranch } from "./gitBranch";
import {
  softwareTeamDeliveryTitle,
  softwareTeamRoleHistoryIds,
} from "./deliveryFilter";
import type { SoftwareTeamPipelineItem } from "./pipeline";
import type { SoftwareTeamRoleId } from "./roles";

export type SoftwareTeamDeliveryDetailTarget =
  | { kind: "delivery"; deliveryId: string; focusItemId?: string }
  | { kind: "item"; itemId: string };

export type SoftwareTeamDeliverySessionRef = {
  sessionId: string;
  title: string;
  itemId: string;
  roleId: SoftwareTeamRoleId;
};

export type SoftwareTeamDeliveryNote = {
  itemId: string;
  text: string;
};

export type SoftwareTeamDeliveryDetail = {
  target: SoftwareTeamDeliveryDetailTarget;
  deliveryId: string;
  title: string;
  items: SoftwareTeamPipelineItem[];
  focusItem: SoftwareTeamPipelineItem | null;
  roleHistory: SoftwareTeamRoleId[];
  reviewNotes: SoftwareTeamDeliveryNote[];
  qaNotes: SoftwareTeamDeliveryNote[];
  cta: SoftwareTeamDoneCta;
  sessions: SoftwareTeamDeliverySessionRef[];
  activity: SoftwareTeamActivityEvent[];
  archived: boolean;
  gitBranch: string;
};

export function softwareTeamSessionsForDelivery(
  sessions: ReadonlyArray<{ id: string; title?: string | null }>,
  items: readonly SoftwareTeamPipelineItem[],
  untitledLabel = "",
): SoftwareTeamDeliverySessionRef[] {
  const byId = new Map(sessions.map((row) => [row.id, row]));
  const out: SoftwareTeamDeliverySessionRef[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const sessionId = item.sessionId.trim();
    if (!sessionId || seen.has(sessionId)) continue;
    seen.add(sessionId);
    const row = byId.get(sessionId);
    const title = (row?.title ?? "").trim() || untitledLabel || sessionId.slice(0, 8);
    out.push({
      sessionId,
      title,
      itemId: item.id,
      roleId: item.roleId,
    });
  }
  return out;
}

export function unionSoftwareTeamDeliveryRoleHistory(
  items: readonly SoftwareTeamPipelineItem[],
): SoftwareTeamRoleId[] {
  const seen = new Set<SoftwareTeamRoleId>();
  for (const item of items) {
    for (const roleId of softwareTeamRoleHistoryIds(item)) {
      seen.add(roleId);
    }
  }
  return SOFTWARE_TEAM_HANDOFF_CHAIN.filter((roleId) => seen.has(roleId));
}

export function decideSoftwareTeamDeliveryNextCta(
  item: SoftwareTeamPipelineItem | null,
): SoftwareTeamDoneCta {
  if (!item) return { kind: "none" };
  const pending = decideSoftwareTeamDoneCta(item);
  if (pending.kind !== "none") return pending;
  if (item.stageId === "ship") return { kind: "none" };
  if (softwareTeamShipGate(item).ok) return { kind: "ship" };
  const nextRole = nextSoftwareTeamRole(item.roleId);
  if (nextRole) return { kind: "handoff", nextRole };
  return { kind: "none" };
}

export function softwareTeamDeliveryDetailItems(
  items: readonly SoftwareTeamPipelineItem[],
  target: SoftwareTeamDeliveryDetailTarget,
): SoftwareTeamPipelineItem[] {
  switch (target.kind) {
    case "delivery": {
      const id = target.deliveryId.trim();
      if (!id) return [];
      return items.filter((item) => item.deliveryId.trim() === id);
    }
    case "item": {
      const id = target.itemId.trim();
      if (!id) return [];
      return items.filter((item) => item.id === id);
    }
    default: {
      const _never: never = target;
      return _never;
    }
  }
}

export function buildSoftwareTeamDeliveryDetail(input: {
  items: readonly SoftwareTeamPipelineItem[];
  activity?: readonly SoftwareTeamActivityEvent[];
  sessions?: ReadonlyArray<{ id: string; title?: string | null }>;
  untitledLabel?: string;
  archivedDeliveryIds?: readonly string[];
  target: SoftwareTeamDeliveryDetailTarget;
}): SoftwareTeamDeliveryDetail | null {
  const members = softwareTeamDeliveryDetailItems(input.items, input.target);
  if (members.length === 0) return null;
  const deliveryId =
    input.target.kind === "delivery"
      ? input.target.deliveryId.trim()
      : members[0]?.deliveryId.trim() ?? "";
  const focusId =
    input.target.kind === "delivery"
      ? (input.target.focusItemId ?? "").trim()
      : input.target.itemId.trim();
  const focusItem =
    members.find((item) => item.id === focusId) ??
    [...members].sort((a, b) => b.updatedAt - a.updatedAt)[0] ??
    null;
  const title =
    (deliveryId
      ? softwareTeamDeliveryTitle(members, deliveryId)
      : focusItem?.title.trim()) ||
    focusItem?.id.slice(0, 8) ||
    deliveryId.slice(0, 8);
  const itemIds = new Set(members.map((item) => item.id));
  return {
    target: input.target,
    deliveryId,
    title,
    items: members,
    focusItem,
    roleHistory: unionSoftwareTeamDeliveryRoleHistory(members),
    reviewNotes: members
      .filter((item) => item.reviewNote.trim())
      .map((item) => ({ itemId: item.id, text: item.reviewNote.trim() })),
    qaNotes: members
      .filter((item) => item.qaNote.trim())
      .map((item) => ({ itemId: item.id, text: item.qaNote.trim() })),
    cta: decideSoftwareTeamDeliveryNextCta(focusItem),
    sessions: softwareTeamSessionsForDelivery(
      input.sessions ?? [],
      members,
      input.untitledLabel,
    ),
    activity: softwareTeamActivityForDelivery(
      input.activity,
      deliveryId,
      itemIds,
    ),
    archived: focusItem
      ? isSoftwareTeamItemArchived(focusItem, input.archivedDeliveryIds)
      : Boolean(deliveryId) &&
        (input.archivedDeliveryIds ?? []).includes(deliveryId),
    gitBranch: softwareTeamDeliveryGitBranch(members),
  };
}
