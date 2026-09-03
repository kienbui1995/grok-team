/**
 * Software Works — remember the last Studio delivery filter.
 *
 * Local App pref (not agent-home / not ~/.grok). Does not write the
 * project pipeline file. Invalid or deleted ids fall back to All.
 */

import { isSoftwareTeamItemArchived } from "./archive";
import {
  SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
  SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED,
  type SoftwareTeamDeliveryFilterId,
} from "./deliveryFilter";
import type { SoftwareTeamPipelineItem } from "./pipeline";
import type { SoftwareTeamDlcStorage } from "./pref";

export const SOFTWARE_TEAM_DLC_STUDIO_PREFS_KEY = "grok.softwareTeamDlc.studio";

export type SoftwareTeamStudioPrefs = {
  deliveryFilter: SoftwareTeamDeliveryFilterId;
  showArchived: boolean;
};

export const DEFAULT_SOFTWARE_TEAM_STUDIO_PREFS: SoftwareTeamStudioPrefs = {
  deliveryFilter: SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
  showArchived: false,
};

function defaultStorage(): SoftwareTeamDlcStorage {
  if (typeof localStorage !== "undefined") return localStorage;
  return { getItem: () => null, setItem: () => {} };
}

export function parseSoftwareTeamStudioPrefs(
  raw: unknown,
): SoftwareTeamStudioPrefs {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_SOFTWARE_TEAM_STUDIO_PREFS };
  }
  const rec = raw as Record<string, unknown>;
  const filter =
    typeof rec.deliveryFilter === "string" ? rec.deliveryFilter.trim() : "";
  return {
    deliveryFilter: filter || SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
    showArchived: rec.showArchived === true,
  };
}

export function loadSoftwareTeamStudioPrefs(
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): SoftwareTeamStudioPrefs {
  try {
    const raw = storage.getItem(SOFTWARE_TEAM_DLC_STUDIO_PREFS_KEY);
    if (!raw) return { ...DEFAULT_SOFTWARE_TEAM_STUDIO_PREFS };
    return parseSoftwareTeamStudioPrefs(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_SOFTWARE_TEAM_STUDIO_PREFS };
  }
}

export function saveSoftwareTeamStudioPrefs(
  prefs: SoftwareTeamStudioPrefs,
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): void {
  try {
    storage.setItem(
      SOFTWARE_TEAM_DLC_STUDIO_PREFS_KEY,
      JSON.stringify({
        deliveryFilter: prefs.deliveryFilter,
        showArchived: prefs.showArchived === true,
      }),
    );
  } catch {
    /* private mode / quota */
  }
}

/**
 * Keep a remembered filter only when that delivery (or Ungrouped) still
 * exists. An archived remembered delivery turns Show archived on so the
 * last slice stays visible.
 */
export function resolveSoftwareTeamStudioPrefs(
  prefs: SoftwareTeamStudioPrefs,
  items: readonly SoftwareTeamPipelineItem[],
  archivedDeliveryIds: readonly string[] = [],
): SoftwareTeamStudioPrefs {
  const filter = (prefs.deliveryFilter ?? "").trim();
  const hasUnscoped = items.some((item) => !item.deliveryId.trim());
  const known = new Set(
    items.map((item) => item.deliveryId.trim()).filter(Boolean),
  );
  let deliveryFilter: SoftwareTeamDeliveryFilterId =
    SOFTWARE_TEAM_DELIVERY_FILTER_ALL;
  if (!filter || filter === SOFTWARE_TEAM_DELIVERY_FILTER_ALL) {
    deliveryFilter = SOFTWARE_TEAM_DELIVERY_FILTER_ALL;
  } else if (filter === SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED) {
    deliveryFilter = hasUnscoped
      ? SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED
      : SOFTWARE_TEAM_DELIVERY_FILTER_ALL;
  } else if (known.has(filter)) {
    deliveryFilter = filter;
  }

  let showArchived = prefs.showArchived === true;
  if (
    deliveryFilter !== SOFTWARE_TEAM_DELIVERY_FILTER_ALL &&
    deliveryFilter !== SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED
  ) {
    const archived = items.some(
      (item) =>
        item.deliveryId.trim() === deliveryFilter &&
        isSoftwareTeamItemArchived(item, archivedDeliveryIds),
    );
    if (archived) showArchived = true;
  }
  return { deliveryFilter, showArchived };
}

/** Resolve against live items, then write the fallback (deleted id → All). */
export function commitSoftwareTeamStudioPrefs(
  prefs: SoftwareTeamStudioPrefs,
  items: readonly SoftwareTeamPipelineItem[],
  archivedDeliveryIds: readonly string[] = [],
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): SoftwareTeamStudioPrefs {
  const resolved = resolveSoftwareTeamStudioPrefs(
    prefs,
    items,
    archivedDeliveryIds,
  );
  saveSoftwareTeamStudioPrefs(resolved, storage);
  return resolved;
}
