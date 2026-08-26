/**
 * Software Team DLC — opt-in enable preference.
 *
 * Local App pref (not agent-home / not ~/.grok). Off by default so ordinary
 * Grok App users are unchanged. Never auto-applies an appearance skin.
 */

export const SOFTWARE_TEAM_DLC_STORAGE_KEY = "grok.softwareTeamDlc.enabled";

/** Fired on `window` after a successful save (detail = boolean enabled). */
export const SOFTWARE_TEAM_DLC_CHANGE_EVENT = "grok-software-team-dlc-change";

/** Off by default — ordinary workbench stays a single-agent Grok Build UI. */
export const DEFAULT_SOFTWARE_TEAM_DLC_ENABLED = false;

/** Minimal storage surface so unit tests need no jsdom. */
export interface SoftwareTeamDlcStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

function defaultStorage(): SoftwareTeamDlcStorage {
  if (typeof localStorage !== "undefined") return localStorage;
  return { getItem: () => null, setItem: () => {} };
}

/** Parse stored value; invalid / empty → default false. */
export function parseSoftwareTeamDlcEnabled(raw: unknown): boolean {
  if (raw === "0" || raw === "false" || raw === false) return false;
  if (raw === "1" || raw === "true" || raw === true) return true;
  return DEFAULT_SOFTWARE_TEAM_DLC_ENABLED;
}

export function loadSoftwareTeamDlcEnabled(
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): boolean {
  try {
    return parseSoftwareTeamDlcEnabled(
      storage.getItem(SOFTWARE_TEAM_DLC_STORAGE_KEY),
    );
  } catch {
    return DEFAULT_SOFTWARE_TEAM_DLC_ENABLED;
  }
}

export function isSoftwareTeamDlcEnabled(
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): boolean {
  return loadSoftwareTeamDlcEnabled(storage);
}

export function saveSoftwareTeamDlcEnabled(
  enabled: boolean,
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): void {
  try {
    storage.setItem(SOFTWARE_TEAM_DLC_STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* private mode / quota */
  }
  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function"
  ) {
    try {
      window.dispatchEvent(
        new CustomEvent(SOFTWARE_TEAM_DLC_CHANGE_EVENT, {
          detail: enabled,
        }),
      );
    } catch {
      /* ignore */
    }
  }
}
