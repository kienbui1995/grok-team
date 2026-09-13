/**
 * Software Works — exclusive Studio overlay.
 *
 * Multiple GlassModals share `.overlay` z-index 12000. Opening two at once
 * stacks focus traps and lets the lower dialog receive clicks. Pick one.
 */

export const SOFTWARE_TEAM_STUDIO_OVERLAYS = [
  "conflict",
  "remove",
  "notes",
  "editor",
  "wizard",
  "detail",
] as const;

export type SoftwareTeamStudioOverlay =
  (typeof SOFTWARE_TEAM_STUDIO_OVERLAYS)[number];

export type SoftwareTeamStudioOverlayFlags = {
  [K in SoftwareTeamStudioOverlay]?: boolean;
};

export function pickSoftwareTeamStudioOverlay(
  flags: SoftwareTeamStudioOverlayFlags,
): SoftwareTeamStudioOverlay | null {
  for (const id of SOFTWARE_TEAM_STUDIO_OVERLAYS) {
    if (flags[id]) return id;
  }
  return null;
}
