/**
 * Software Works — bind the open workbench chat onto a board card.
 *
 * Does not create a session or call Host. A session can sit on only one
 * card; `bindPipelineItemSession` unbinds the previous owner.
 */

import type { MessageKey } from "@/i18n";

export const SOFTWARE_TEAM_BIND_CHAT_REASONS = [
  "bound",
  "already",
  "need_session",
] as const;

export type SoftwareTeamBindChatReason =
  (typeof SOFTWARE_TEAM_BIND_CHAT_REASONS)[number];

export type SoftwareTeamBindChatDecision = {
  ok: boolean;
  reason: SoftwareTeamBindChatReason;
  sessionId: string;
};

export function decideSoftwareTeamBindThisChat(input: {
  currentSessionId?: string | null;
  itemSessionId?: string | null;
}): SoftwareTeamBindChatDecision {
  const sessionId = (input.currentSessionId ?? "").trim();
  if (!sessionId) {
    return { ok: false, reason: "need_session", sessionId: "" };
  }
  if ((input.itemSessionId ?? "").trim() === sessionId) {
    return { ok: true, reason: "already", sessionId };
  }
  return { ok: true, reason: "bound", sessionId };
}

export function softwareTeamBindThisChatMessageKey(
  reason: SoftwareTeamBindChatReason,
): MessageKey {
  switch (reason) {
    case "bound":
      return "softwareTeamDlc.bindThisChatDone";
    case "already":
      return "softwareTeamDlc.bindThisChatAlready";
    case "need_session":
      return "softwareTeamDlc.bindThisChatNeedSession";
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}
