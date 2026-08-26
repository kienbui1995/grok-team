/**
 * Software Team DLC — role catalog (presets, not a second agent OS).
 *
 * Each role is an in-app template: agent/skill/workflow names, starter prompt,
 * slash hint, and a default SDLC stage. Enabling the DLC does not spawn extra
 * CLI processes; the user attaches roles to existing Grok Build sessions.
 */

import type { MessageKey } from "@/i18n";
import type { SoftwareTeamSdlcStageId } from "./sdlc";

export const SOFTWARE_TEAM_ROLE_IDS = [
  "product",
  "architect",
  "engineer",
  "reviewer",
  "qa",
  "writer",
] as const;

export type SoftwareTeamRoleId = (typeof SOFTWARE_TEAM_ROLE_IDS)[number];

export type SoftwareTeamRoleDef = {
  id: SoftwareTeamRoleId;
  /** CLI-safe agent / skill stem (`team-product`). */
  packName: string;
  /** Slash hint shown in the roster (`team-product`). */
  slashName: string;
  defaultStage: SoftwareTeamSdlcStageId;
  titleKey: MessageKey;
  descKey: MessageKey;
};

const ROLE_TITLE_KEYS = {
  product: "softwareTeamDlc.role.product",
  architect: "softwareTeamDlc.role.architect",
  engineer: "softwareTeamDlc.role.engineer",
  reviewer: "softwareTeamDlc.role.reviewer",
  qa: "softwareTeamDlc.role.qa",
  writer: "softwareTeamDlc.role.writer",
} as const satisfies Record<SoftwareTeamRoleId, MessageKey>;

const ROLE_DESC_KEYS = {
  product: "softwareTeamDlc.role.product.desc",
  architect: "softwareTeamDlc.role.architect.desc",
  engineer: "softwareTeamDlc.role.engineer.desc",
  reviewer: "softwareTeamDlc.role.reviewer.desc",
  qa: "softwareTeamDlc.role.qa.desc",
  writer: "softwareTeamDlc.role.writer.desc",
} as const satisfies Record<SoftwareTeamRoleId, MessageKey>;

const ROLE_DEFAULT_STAGE: Record<SoftwareTeamRoleId, SoftwareTeamSdlcStageId> = {
  product: "backlog",
  architect: "design",
  engineer: "build",
  reviewer: "review",
  qa: "review",
  writer: "ship",
};

export const SOFTWARE_TEAM_ROLES: readonly SoftwareTeamRoleDef[] =
  SOFTWARE_TEAM_ROLE_IDS.map((id) => ({
    id,
    packName: `team-${id}`,
    slashName: `team-${id}`,
    defaultStage: ROLE_DEFAULT_STAGE[id],
    titleKey: ROLE_TITLE_KEYS[id],
    descKey: ROLE_DESC_KEYS[id],
  }));

const ROLE_BY_ID = new Map<SoftwareTeamRoleId, SoftwareTeamRoleDef>(
  SOFTWARE_TEAM_ROLES.map((role) => [role.id, role]),
);

export function isSoftwareTeamRoleId(
  raw: string | null | undefined,
): raw is SoftwareTeamRoleId {
  return (
    typeof raw === "string" &&
    (SOFTWARE_TEAM_ROLE_IDS as readonly string[]).includes(raw)
  );
}

export function softwareTeamRoleById(
  raw: string | null | undefined,
): SoftwareTeamRoleDef | null {
  if (!isSoftwareTeamRoleId(raw)) return null;
  return ROLE_BY_ID.get(raw) ?? null;
}

/** Slash hint as the user would type it (`/team-product`). */
export function softwareTeamRoleSlashHint(role: SoftwareTeamRoleDef): string {
  return `/${role.slashName}`;
}
