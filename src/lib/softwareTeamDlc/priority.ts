/**
 * Software Works — work-item priority and Studio board ordering.
 *
 * Priority is a triage label on the card (P1 / P2 / P3, empty = none). It is
 * informational: it never gates Ship and never touches sessions. v3 files
 * without the field hydrate empty. Runtime imports stay one-way
 * (priority → activity; pipeline → priority) so the graph has no cycle.
 */

import { appendSoftwareTeamActivity } from "./activity";
import type {
  SoftwareTeamPipelineItem,
  SoftwareTeamPipelineStore,
} from "./pipeline";

export const SOFTWARE_TEAM_ITEM_PRIORITIES = ["", "p1", "p2", "p3"] as const;

export type SoftwareTeamItemPriority =
  (typeof SOFTWARE_TEAM_ITEM_PRIORITIES)[number];

export function normalizeSoftwareTeamItemPriority(
  raw: string | null | undefined,
): SoftwareTeamItemPriority {
  const value = (raw ?? "").trim().toLowerCase();
  return value === "p1" || value === "p2" || value === "p3" ? value : "";
}

function priorityRank(priority: SoftwareTeamItemPriority): number {
  switch (priority) {
    case "p1":
      return 0;
    case "p2":
      return 1;
    case "p3":
      return 2;
    default:
      return 3;
  }
}

export function setSoftwareTeamItemPriority(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  priority: SoftwareTeamItemPriority,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const item = store.items.find((row) => row.id === itemId);
  if (!item || item.priority === priority) return store;
  const items = store.items.map((row) =>
    row.id === itemId ? { ...row, priority, updatedAt: now } : row,
  );
  return {
    items,
    activity: appendSoftwareTeamActivity(store.activity, {
      at: now,
      type: "priority",
      deliveryId: item.deliveryId,
      itemId: item.id,
      priority,
    }),
    archivedDeliveryIds: store.archivedDeliveryIds,
  };
}

export const SOFTWARE_TEAM_STUDIO_SORT_MODES = [
  "newest",
  "oldest",
  "priority",
] as const;

export type SoftwareTeamStudioSortMode =
  (typeof SOFTWARE_TEAM_STUDIO_SORT_MODES)[number];

export function isSoftwareTeamStudioSortMode(
  raw: string | null | undefined,
): raw is SoftwareTeamStudioSortMode {
  return (
    typeof raw === "string" &&
    (SOFTWARE_TEAM_STUDIO_SORT_MODES as readonly string[]).includes(raw)
  );
}

/**
 * Column ordering. `newest` (updatedAt desc) is the historical default;
 * `priority` ranks P1 → P3 with no-priority cards last and recency as the
 * tie-break inside each band.
 */
export function sortSoftwareTeamPipelineItems(
  items: readonly SoftwareTeamPipelineItem[],
  mode: SoftwareTeamStudioSortMode,
): SoftwareTeamPipelineItem[] {
  const sorted = [...items];
  if (mode === "oldest") {
    return sorted.sort((a, b) => a.updatedAt - b.updatedAt);
  }
  if (mode === "priority") {
    return sorted.sort((a, b) => {
      const byRank = priorityRank(a.priority) - priorityRank(b.priority);
      if (byRank !== 0) return byRank;
      return b.updatedAt - a.updatedAt;
    });
  }
  return sorted.sort((a, b) => b.updatedAt - a.updatedAt);
}
