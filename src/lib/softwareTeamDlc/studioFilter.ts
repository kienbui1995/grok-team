/**
 * Software Works — Studio search + stage/role chips + archive visibility.
 * Combines with the existing deliveryId filter. Title search only.
 */

import { isSoftwareTeamRoleId, type SoftwareTeamRoleId } from "./roles";
import {
  isSoftwareTeamSdlcStageId,
  type SoftwareTeamSdlcStageId,
} from "./sdlc";
import { isSoftwareTeamItemArchived } from "./archive";
import {
  SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
  filterSoftwareTeamItemsByDelivery,
  type SoftwareTeamDeliveryFilterId,
} from "./deliveryFilter";
import type { SoftwareTeamPipelineItem } from "./pipeline";

export const SOFTWARE_TEAM_STAGE_FILTER_ALL = "all";
export const SOFTWARE_TEAM_ROLE_FILTER_ALL = "all";

export type SoftwareTeamStageFilterId =
  | typeof SOFTWARE_TEAM_STAGE_FILTER_ALL
  | SoftwareTeamSdlcStageId;

export type SoftwareTeamRoleFilterId =
  | typeof SOFTWARE_TEAM_ROLE_FILTER_ALL
  | SoftwareTeamRoleId;

export function isSoftwareTeamStageFilterId(
  raw: string | null | undefined,
): raw is SoftwareTeamStageFilterId {
  return (
    raw === SOFTWARE_TEAM_STAGE_FILTER_ALL || isSoftwareTeamSdlcStageId(raw)
  );
}

export function isSoftwareTeamRoleFilterId(
  raw: string | null | undefined,
): raw is SoftwareTeamRoleFilterId {
  return raw === SOFTWARE_TEAM_ROLE_FILTER_ALL || isSoftwareTeamRoleId(raw);
}

export function softwareTeamItemTitleMatches(
  item: Pick<SoftwareTeamPipelineItem, "title">,
  query: string,
  displayTitle?: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const title = item.title.trim().toLowerCase();
  if (title.includes(q)) return true;
  const extra = (displayTitle ?? "").trim().toLowerCase();
  return extra.length > 0 && extra.includes(q);
}

export function filterSoftwareTeamStudioItems(input: {
  items: readonly SoftwareTeamPipelineItem[];
  deliveryFilter?: SoftwareTeamDeliveryFilterId;
  query?: string;
  stageId?: SoftwareTeamStageFilterId;
  roleId?: SoftwareTeamRoleFilterId;
  showArchived?: boolean;
  archivedDeliveryIds?: readonly string[];
  titleOf?: (item: SoftwareTeamPipelineItem) => string;
}): SoftwareTeamPipelineItem[] {
  const archivedIds = input.archivedDeliveryIds ?? [];
  const showArchived = input.showArchived === true;
  const scoped = filterSoftwareTeamItemsByDelivery(
    input.items,
    input.deliveryFilter ?? SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
  );
  const stageId = input.stageId ?? SOFTWARE_TEAM_STAGE_FILTER_ALL;
  const roleId = input.roleId ?? SOFTWARE_TEAM_ROLE_FILTER_ALL;
  const query = input.query ?? "";
  return scoped.filter((item) => {
    if (!showArchived && isSoftwareTeamItemArchived(item, archivedIds)) {
      return false;
    }
    if (stageId !== SOFTWARE_TEAM_STAGE_FILTER_ALL && item.stageId !== stageId) {
      return false;
    }
    if (roleId !== SOFTWARE_TEAM_ROLE_FILTER_ALL && item.roleId !== roleId) {
      return false;
    }
    return softwareTeamItemTitleMatches(
      item,
      query,
      input.titleOf?.(item),
    );
  });
}
