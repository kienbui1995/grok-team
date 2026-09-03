/**
 * Software Works — slash palette extras (outside AppWorkbench).
 *
 * `applySlashItem` already inserts `[[skill:name]]` for `kind: "skill"`.
 * These rows appear only when the edition is on. CLI resolves the skill
 * after a real pack install. Opening a session from the board is the
 * first-class entry and does not depend on slash.
 */

import { softwareTeamRoleStarterPrompt } from "./pack";
import { SOFTWARE_TEAM_ROLES } from "./roles";

/** Pack / slash stems (`team-product`). Used to hide Host rows when off. */
export function isSoftwareTeamSlashSkillName(name: string): boolean {
  const key = name.trim().toLowerCase();
  return SOFTWARE_TEAM_ROLES.some((role) => role.packName === key);
}

/** Host-shaped skill rows so `buildSlashCatalog` can merge them. */
export function softwareTeamSlashSkillInfos(): Array<{
  name: string;
  description: string;
  source: string;
  userInvocable: true;
  enabled: true;
}> {
  return SOFTWARE_TEAM_ROLES.map((role) => ({
    name: role.packName,
    description:
      softwareTeamRoleStarterPrompt(role.id).split("\n")[0] ?? role.packName,
    source: "software-works",
    userInvocable: true,
    enabled: true,
  }));
}
