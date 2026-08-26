/**
 * Software Works — group / filter pipeline cards by deliveryId.
 */

import type { SoftwareTeamPipelineItem } from "./pipeline";

export const SOFTWARE_TEAM_DELIVERY_FILTER_ALL = "all";
export const SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED = "unscoped";

export type SoftwareTeamDeliveryFilterId =
  | typeof SOFTWARE_TEAM_DELIVERY_FILTER_ALL
  | typeof SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED
  | string;

export type SoftwareTeamDeliveryGroup = {
  id: string;
  title: string;
  count: number;
  updatedAt: number;
};

export function softwareTeamDeliveryTitle(
  items: readonly SoftwareTeamPipelineItem[],
  deliveryId: string,
): string {
  const id = deliveryId.trim();
  if (!id) return "";
  const members = items.filter((item) => item.deliveryId.trim() === id);
  const titled = members.find((item) => item.title.trim()) ?? members[0];
  return (titled?.title ?? "").trim() || id.slice(0, 8);
}

export function listSoftwareTeamDeliveryGroups(
  items: readonly SoftwareTeamPipelineItem[],
): SoftwareTeamDeliveryGroup[] {
  const map = new Map<string, SoftwareTeamDeliveryGroup>();
  for (const item of items) {
    const id = item.deliveryId.trim();
    if (!id) continue;
    const prev = map.get(id);
    if (!prev) {
      map.set(id, {
        id,
        title: item.title.trim() || id.slice(0, 8),
        count: 1,
        updatedAt: item.updatedAt,
      });
      continue;
    }
    prev.count += 1;
    if (item.updatedAt >= prev.updatedAt) {
      prev.updatedAt = item.updatedAt;
      if (item.title.trim()) prev.title = item.title.trim();
    } else if (!prev.title || prev.title === id.slice(0, 8)) {
      if (item.title.trim()) prev.title = item.title.trim();
    }
  }
  return [...map.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function filterSoftwareTeamItemsByDelivery(
  items: readonly SoftwareTeamPipelineItem[],
  filter: SoftwareTeamDeliveryFilterId,
): SoftwareTeamPipelineItem[] {
  const id = (filter ?? SOFTWARE_TEAM_DELIVERY_FILTER_ALL).trim();
  if (!id || id === SOFTWARE_TEAM_DELIVERY_FILTER_ALL) {
    return [...items];
  }
  if (id === SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED) {
    return items.filter((item) => !item.deliveryId.trim());
  }
  return items.filter((item) => item.deliveryId.trim() === id);
}

export function softwareTeamRoleHistoryIds(
  item: Pick<SoftwareTeamPipelineItem, "roleId" | "roleHistory">,
): SoftwareTeamPipelineItem["roleHistory"] {
  return item.roleHistory.length ? item.roleHistory : [item.roleId];
}
