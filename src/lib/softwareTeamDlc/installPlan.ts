/**
 * Software Team DLC — pack write planner.
 *
 * In-app presets are always available when the DLC is enabled (no disk I/O).
 * Optional filesystem install must never rewrite shared `~/.grok`.
 */

import {
  normalizeSessionDataMode,
  type SessionDataMode,
} from "@/lib/sessionDataMode";

export const SOFTWARE_TEAM_DLC_INSTALL_TARGETS = ["project", "user"] as const;

export type SoftwareTeamDlcInstallTarget =
  (typeof SOFTWARE_TEAM_DLC_INSTALL_TARGETS)[number];

export type SoftwareTeamDlcInstallReason =
  | "ok_project"
  | "ok_independent_user"
  | "blocked_shared_user"
  | "need_project";

export type SoftwareTeamDlcInstallPlan = {
  target: SoftwareTeamDlcInstallTarget;
  sessionDataMode: SessionDataMode;
  allowed: boolean;
  reason: SoftwareTeamDlcInstallReason;
  /** True only when a user-scope write would touch shared CLI home. */
  rewritesSharedGrokHome: boolean;
};

/**
 * Decide whether a pack write is allowed.
 *
 * - `project` — `.grok/` under the workbench project (not GROK_HOME).
 * - `user` — Independent agent-home only. Shared mode is refused.
 */
export function planSoftwareTeamDlcPackWrite(input: {
  sessionDataMode?: string | null;
  target: SoftwareTeamDlcInstallTarget;
  projectPath?: string | null;
}): SoftwareTeamDlcInstallPlan {
  const sessionDataMode = normalizeSessionDataMode(input.sessionDataMode);
  const target = input.target;

  if (target === "project") {
    const project = (input.projectPath ?? "").trim();
    if (!project) {
      return {
        target,
        sessionDataMode,
        allowed: false,
        reason: "need_project",
        rewritesSharedGrokHome: false,
      };
    }
    return {
      target,
      sessionDataMode,
      allowed: true,
      reason: "ok_project",
      rewritesSharedGrokHome: false,
    };
  }

  if (sessionDataMode === "shared") {
    return {
      target,
      sessionDataMode,
      allowed: false,
      reason: "blocked_shared_user",
      rewritesSharedGrokHome: true,
    };
  }

  return {
    target,
    sessionDataMode,
    allowed: true,
    reason: "ok_independent_user",
    rewritesSharedGrokHome: false,
  };
}

/** Honesty helper for tests / UI — shared user writes are always refused. */
export function softwareTeamDlcWouldRewriteSharedGrokHome(input: {
  sessionDataMode?: string | null;
  target: SoftwareTeamDlcInstallTarget;
}): boolean {
  return planSoftwareTeamDlcPackWrite(input).rewritesSharedGrokHome;
}
