/**
 * Software Works — attach-chat seeds for a delivery (max 3).
 *
 * Uses the existing composer attach-chat domain (`chatAttach.ts`).
 * There is no Host “team attach” RPC. Studio seeds session-draft
 * `chatAttachments` + `[[chat:]]` tokens. Live chips appear when
 * Workbench restores that session — AppWorkbench is not extended.
 */

import {
  addChatRef,
  isChatSessionId,
  MAX_ATTACHED_CHATS,
  prependChatTokens,
  type ChatRef,
} from "@/lib/chatAttach";
import type { SoftwareTeamPipelineItem } from "./pipeline";
import type { SoftwareTeamRoleId } from "./roles";

export const SOFTWARE_TEAM_ATTACH_MAX = MAX_ATTACHED_CHATS;

export const SOFTWARE_TEAM_ATTACH_PREFER: readonly SoftwareTeamRoleId[] = [
  "product",
  "engineer",
  "reviewer",
];

export type SoftwareTeamAttachPick = {
  sessionId: string;
  title: string;
  roleId: SoftwareTeamRoleId;
};

function roleRank(roleId: SoftwareTeamRoleId): number {
  const i = SOFTWARE_TEAM_ATTACH_PREFER.indexOf(roleId);
  return i >= 0 ? i : SOFTWARE_TEAM_ATTACH_PREFER.length;
}

/**
 * Other bound sessions on the same delivery (or the whole board if no id).
 * Drops non-UUID ids — attach-chat tokens require App session UUIDs.
 */
export function pickSoftwareTeamAttachSessions(
  items: readonly SoftwareTeamPipelineItem[],
  current: Pick<SoftwareTeamPipelineItem, "id" | "sessionId" | "deliveryId">,
  max = SOFTWARE_TEAM_ATTACH_MAX,
): SoftwareTeamAttachPick[] {
  const self = (current.sessionId ?? "").trim();
  const deliveryId = (current.deliveryId ?? "").trim();
  const pool = items.filter((item) => {
    if (item.id === current.id) return false;
    const sid = item.sessionId.trim();
    if (!sid || sid === self) return false;
    if (!isChatSessionId(sid)) return false;
    if (deliveryId && item.deliveryId && item.deliveryId !== deliveryId) {
      return false;
    }
    return true;
  });
  const ranked = [...pool].sort((a, b) => {
    const rr = roleRank(a.roleId) - roleRank(b.roleId);
    if (rr !== 0) return rr;
    return b.updatedAt - a.updatedAt;
  });
  const out: SoftwareTeamAttachPick[] = [];
  const seen = new Set<string>();
  for (const item of ranked) {
    if (out.length >= max) break;
    if (seen.has(item.sessionId)) continue;
    seen.add(item.sessionId);
    out.push({
      sessionId: item.sessionId,
      title: item.title || item.roleId,
      roleId: item.roleId,
    });
  }
  return out;
}

export function softwareTeamAttachRefs(
  picks: readonly SoftwareTeamAttachPick[],
  currentSessionId?: string | null,
): ChatRef[] {
  let refs: ChatRef[] = [];
  for (const pick of picks) {
    const added = addChatRef(
      refs,
      { sessionId: pick.sessionId, title: pick.title },
      { currentId: currentSessionId },
    );
    refs = added.refs;
  }
  return refs;
}

export function seedSoftwareTeamAttachStarter(
  starter: string,
  refs: readonly ChatRef[],
): string {
  if (!refs.length) return starter;
  return prependChatTokens(starter, [...refs]);
}
