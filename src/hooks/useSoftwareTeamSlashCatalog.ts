/**
 * Slash catalog that tracks the Software Works edition toggle.
 * Lives outside AppWorkbench so toggling the pref does not require a
 * skills reload (the workbench memo only depended on skillInfos).
 */

import { useMemo } from "react";
import { useSoftwareTeamDlcEnabled } from "@/hooks/useSoftwareTeamDlc";
import { buildSlashCatalog, type SkillInfo } from "@/lib/slashCatalog";

export function useSoftwareTeamSlashCatalog(skills: readonly SkillInfo[]) {
  const enabled = useSoftwareTeamDlcEnabled();
  return useMemo(
    () =>
      buildSlashCatalog(skills as SkillInfo[], {
        includeSoftwareTeamSkills: enabled,
      }),
    [enabled, skills],
  );
}
