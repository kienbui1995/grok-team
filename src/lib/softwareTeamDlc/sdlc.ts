/**
 * Software Works / SDLC Studio — stages for the pipeline board.
 *
 * Studio board (Backlog → Design → Build → Review → Ship) is the source
 * of truth when the edition is on. Live Agent Kanban columns remain an
 * informational alias of run state.
 */

import type { AgentKanbanColumnId } from "@/lib/kanbanBoard";
import type { MessageKey } from "@/i18n";

export const SOFTWARE_TEAM_SDLC_STAGE_IDS = [
  "backlog",
  "design",
  "build",
  "review",
  "ship",
] as const;

export type SoftwareTeamSdlcStageId =
  (typeof SOFTWARE_TEAM_SDLC_STAGE_IDS)[number];

export type SoftwareTeamSdlcStageDef = {
  id: SoftwareTeamSdlcStageId;
  titleKey: MessageKey;
  kanbanColumn: AgentKanbanColumnId;
};

const STAGE_TITLE_KEYS = {
  backlog: "softwareTeamDlc.stage.backlog",
  design: "softwareTeamDlc.stage.design",
  build: "softwareTeamDlc.stage.build",
  review: "softwareTeamDlc.stage.review",
  ship: "softwareTeamDlc.stage.ship",
} as const satisfies Record<SoftwareTeamSdlcStageId, MessageKey>;

const STAGE_COLUMN: Record<SoftwareTeamSdlcStageId, AgentKanbanColumnId> = {
  backlog: "needs_you",
  design: "needs_you",
  build: "working",
  review: "needs_you",
  ship: "done",
};

export const SOFTWARE_TEAM_SDLC_STAGES: readonly SoftwareTeamSdlcStageDef[] =
  SOFTWARE_TEAM_SDLC_STAGE_IDS.map((id) => ({
    id,
    titleKey: STAGE_TITLE_KEYS[id],
    kanbanColumn: STAGE_COLUMN[id],
  }));

export function isSoftwareTeamSdlcStageId(
  raw: string | null | undefined,
): raw is SoftwareTeamSdlcStageId {
  return (
    typeof raw === "string" &&
    (SOFTWARE_TEAM_SDLC_STAGE_IDS as readonly string[]).includes(raw)
  );
}

export function mapSdlcStageToKanbanColumn(
  stage: SoftwareTeamSdlcStageId,
): AgentKanbanColumnId {
  switch (stage) {
    case "backlog":
    case "design":
    case "review":
      return "needs_you";
    case "build":
      return "working";
    case "ship":
      return "done";
    default: {
      const _never: never = stage;
      return _never;
    }
  }
}

/** Stages that alias a live Kanban column (overlay labels only). */
export function sdlcStagesForKanbanColumn(
  column: AgentKanbanColumnId,
): SoftwareTeamSdlcStageId[] {
  switch (column) {
    case "needs_you":
      return ["backlog", "design", "review"];
    case "working":
      return ["build"];
    case "done":
      return ["ship"];
    case "idle":
      return ["backlog"];
    default: {
      const _never: never = column;
      return _never;
    }
  }
}

export function kanbanColumnSdlcAliasKey(
  column: AgentKanbanColumnId,
): MessageKey {
  switch (column) {
    case "needs_you":
      return "softwareTeamDlc.columnMap.needsYou";
    case "working":
      return "softwareTeamDlc.columnMap.working";
    case "done":
      return "softwareTeamDlc.columnMap.done";
    case "idle":
      return "softwareTeamDlc.columnMap.idle";
    default: {
      const _never: never = column;
      return _never;
    }
  }
}
