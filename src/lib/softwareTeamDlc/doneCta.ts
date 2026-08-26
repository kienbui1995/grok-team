/**
 * Software Works — live `done` / Ship-blocked CTA (handoff vs Ship).
 *
 * Live Kanban `done` never auto-advances to Ship. The card shows a CTA.
 * Choosing Ship only seeds a Writer starter — it does not write files.
 */

import { nextSoftwareTeamRole } from "./handoff";
import type { SoftwareTeamPipelineItem } from "./pipeline";
import {
  recordSoftwareTeamRoleVisit,
  softwareTeamShipGate,
} from "./shipGate";
import { softwareTeamRoleStarterPrompt } from "./pack";
import type { SoftwareTeamRoleId } from "./roles";

export const SOFTWARE_TEAM_DONE_CTA_KINDS = [
  "handoff",
  "ship",
  "none",
] as const;

export type SoftwareTeamDoneCtaKind =
  (typeof SOFTWARE_TEAM_DONE_CTA_KINDS)[number];

export type SoftwareTeamDoneCta =
  | { kind: "handoff"; nextRole: SoftwareTeamRoleId }
  | { kind: "ship" }
  | { kind: "none" };

export function decideSoftwareTeamDoneCta(
  item: Pick<
    SoftwareTeamPipelineItem,
    | "roleId"
    | "roleHistory"
    | "reviewNote"
    | "qaNote"
    | "sessionDonePending"
    | "stageId"
  >,
): SoftwareTeamDoneCta {
  if (!item.sessionDonePending) return { kind: "none" };
  if (softwareTeamShipGate(item).ok) return { kind: "ship" };
  const nextRole = nextSoftwareTeamRole(item.roleId);
  if (nextRole) return { kind: "handoff", nextRole };
  return { kind: "none" };
}

/**
 * Agent-facing English Writer/Ship starter. Composer only — no file I/O.
 * Tells the agent to use the *user project* changelog, never a foreign repo.
 */
export function composeWriterShipStarter(
  item: Pick<
    SoftwareTeamPipelineItem,
    "title" | "planRef" | "goalRef" | "artifactRef" | "reviewNote" | "qaNote"
  >,
): string {
  const lines = [
    softwareTeamRoleStarterPrompt("writer"),
    "",
    "Ship this slice. Draft release notes in the composer first.",
    "If the user asks you to update a changelog, use this project workspace only",
    "(docs/, docs/sdlc/, or this repo's own CHANGELOG.md).",
    "Do not edit a changelog that is not in this workspace.",
    "Do not invent a file write that the user did not ask for.",
  ];
  const title = (item.title ?? "").trim();
  if (title) lines.push("", `Slice: ${title}`);
  if (item.planRef) lines.push(`Plan: ${item.planRef}`);
  if (item.goalRef) lines.push(`Goal: ${item.goalRef}`);
  if (item.artifactRef) lines.push(`Artifact: ${item.artifactRef}`);
  if (item.reviewNote) lines.push(`Reviewer notes: ${item.reviewNote}`);
  if (item.qaNote) lines.push(`QA notes: ${item.qaNote}`);
  lines.push(
    "",
    "Stay on Grok Build. Do not spawn a second CLI runtime.",
  );
  return lines.join("\n");
}

/** Honesty: Ship CTA never writes application files. */
export function softwareTeamWriterShipWritesFiles(): boolean {
  return false;
}

export function applySoftwareTeamShipChoice(
  item: SoftwareTeamPipelineItem,
  now = Date.now(),
):
  | { ok: true; item: SoftwareTeamPipelineItem; starter: string }
  | { ok: false; blocks: ReturnType<typeof softwareTeamShipGate>["blocks"] } {
  const gate = softwareTeamShipGate(item);
  if (!gate.ok) return { ok: false, blocks: gate.blocks };
  const next: SoftwareTeamPipelineItem = {
    ...item,
    roleId: "writer",
    stageId: "ship",
    roleHistory: recordSoftwareTeamRoleVisit(item.roleHistory, item.roleId, "writer"),
    sessionDonePending: false,
    stageSource: "board",
    updatedAt: now,
  };
  return { ok: true, item: next, starter: composeWriterShipStarter(next) };
}
