/**
 * Software Works × Laya — opt-in sidecar preference (local App, not ~/.grok).
 *
 * Off by default. Never writes agent config.toml. minConfidence only
 * marks suggestions uncertain; it never unlocks Ship.
 */

import type { MessageKey } from "@/i18n";
import {
  DEFAULT_SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE,
  type SoftwareTeamLayaPlan,
} from "./laya";
import { isSoftwareTeamLayaTimeoutError } from "./layaHost";
import type { SoftwareTeamDlcStorage } from "./pref";

export const SOFTWARE_TEAM_DLC_LAYA_KEY = "grok.softwareTeamDlc.laya.enabled";
export const SOFTWARE_TEAM_DLC_LAYA_MIN_CONFIDENCE_KEY =
  "grok.softwareTeamDlc.laya.minConfidence";
export const SOFTWARE_TEAM_DLC_LAYA_CHANGE_EVENT =
  "grok-software-team-dlc-laya-change";

/** Off by default — Laya is an opt-in sidecar, not a second runtime. */
export const DEFAULT_SOFTWARE_TEAM_LAYA_ENABLED = false;

export const SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE_MIN = 0.5;
export const SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE_MAX = 0.95;

function defaultStorage(): SoftwareTeamDlcStorage {
  if (typeof localStorage !== "undefined") return localStorage;
  return { getItem: () => null, setItem: () => {} };
}

export function parseSoftwareTeamLayaEnabled(raw: unknown): boolean {
  if (raw === "0" || raw === "false" || raw === false) return false;
  if (raw === "1" || raw === "true" || raw === true) return true;
  return DEFAULT_SOFTWARE_TEAM_LAYA_ENABLED;
}

export function loadSoftwareTeamLayaEnabled(
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): boolean {
  try {
    return parseSoftwareTeamLayaEnabled(storage.getItem(SOFTWARE_TEAM_DLC_LAYA_KEY));
  } catch {
    return DEFAULT_SOFTWARE_TEAM_LAYA_ENABLED;
  }
}

export function saveSoftwareTeamLayaEnabled(
  enabled: boolean,
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): void {
  try {
    storage.setItem(SOFTWARE_TEAM_DLC_LAYA_KEY, enabled ? "1" : "0");
  } catch {
    /* private mode / quota */
  }
  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function"
  ) {
    try {
      window.dispatchEvent(
        new CustomEvent(SOFTWARE_TEAM_DLC_LAYA_CHANGE_EVENT, {
          detail: enabled,
        }),
      );
    } catch {
      /* ignore */
    }
  }
}

export function parseSoftwareTeamLayaMinConfidence(raw: unknown): number {
  if (raw == null || raw === "") return DEFAULT_SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE;
  return Math.min(
    SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE_MAX,
    Math.max(SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE_MIN, n),
  );
}

export function loadSoftwareTeamLayaMinConfidence(
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): number {
  try {
    return parseSoftwareTeamLayaMinConfidence(
      storage.getItem(SOFTWARE_TEAM_DLC_LAYA_MIN_CONFIDENCE_KEY),
    );
  } catch {
    return DEFAULT_SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE;
  }
}

export function saveSoftwareTeamLayaMinConfidence(
  value: number,
  storage: SoftwareTeamDlcStorage = defaultStorage(),
): number {
  const clamped = parseSoftwareTeamLayaMinConfidence(value);
  try {
    storage.setItem(SOFTWARE_TEAM_DLC_LAYA_MIN_CONFIDENCE_KEY, String(clamped));
  } catch {
    /* private mode / quota */
  }
  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function"
  ) {
    try {
      window.dispatchEvent(
        new CustomEvent(SOFTWARE_TEAM_DLC_LAYA_CHANGE_EVENT, {
          detail: { minConfidence: clamped },
        }),
      );
    } catch {
      /* ignore */
    }
  }
  return clamped;
}

export function softwareTeamLayaMessageKey(
  reason: SoftwareTeamLayaPlan["reason"],
): MessageKey {
  switch (reason) {
    case "disabled":
      return "softwareTeamDlc.layaDisabled";
    case "need_host":
      return "softwareTeamDlc.layaNeedHost";
    case "need_python":
      return "softwareTeamDlc.layaNeedPython";
    case "need_laya":
      return "softwareTeamDlc.layaNeedPackage";
    case "blocked_shared_home":
      return "softwareTeamDlc.layaBlockedHome";
    case "host_error":
      return "softwareTeamDlc.layaHostError";
    case "ok":
      return "softwareTeamDlc.layaSuggest";
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}

/** Status line for a refused suggest. Timeout is its own sentence, not a success. */
export function softwareTeamLayaHonesty(
  reason: SoftwareTeamLayaPlan["reason"],
  error?: string,
): { key: MessageKey; vars?: { error: string } } {
  if (reason === "host_error" && isSoftwareTeamLayaTimeoutError(error)) {
    return { key: "softwareTeamDlc.layaHostTimeout" };
  }
  if (reason === "host_error") {
    return {
      key: "softwareTeamDlc.layaHostError",
      vars: { error: error ?? "" },
    };
  }
  return { key: softwareTeamLayaMessageKey(reason) };
}
