/**
 * Software Works — Review → QA → Ship gate.
 *
 * Ship requires a Reviewer pass, a QA pass, and non-empty notes for both.
 * Notes live on the pipeline item (local persist). No Host review entity.
 */

import {
  isSoftwareTeamRoleId,
  type SoftwareTeamRoleId,
} from "./roles";

export const SOFTWARE_TEAM_SHIP_BLOCKS = [
  "need_reviewer",
  "need_qa",
  "need_review_note",
  "need_qa_note",
] as const;

export type SoftwareTeamShipBlock = (typeof SOFTWARE_TEAM_SHIP_BLOCKS)[number];

export type SoftwareTeamShipGate = {
  ok: boolean;
  blocks: SoftwareTeamShipBlock[];
};

export type SoftwareTeamShipFields = {
  roleId: SoftwareTeamRoleId;
  roleHistory: readonly SoftwareTeamRoleId[];
  reviewNote: string;
  qaNote: string;
};

export function parseSoftwareTeamRoleHistory(
  raw: unknown,
): SoftwareTeamRoleId[] {
  if (!Array.isArray(raw)) return [];
  const out: SoftwareTeamRoleId[] = [];
  const seen = new Set<SoftwareTeamRoleId>();
  for (const entry of raw) {
    if (typeof entry !== "string" || !isSoftwareTeamRoleId(entry)) continue;
    if (seen.has(entry)) continue;
    seen.add(entry);
    out.push(entry);
  }
  return out;
}

export function recordSoftwareTeamRoleVisit(
  history: readonly SoftwareTeamRoleId[] | null | undefined,
  ...roleIds: Array<SoftwareTeamRoleId | null | undefined>
): SoftwareTeamRoleId[] {
  const out = parseSoftwareTeamRoleHistory(history ?? []);
  const seen = new Set(out);
  for (const roleId of roleIds) {
    if (!roleId || !isSoftwareTeamRoleId(roleId) || seen.has(roleId)) continue;
    seen.add(roleId);
    out.push(roleId);
  }
  return out;
}

export function softwareTeamHasVisitedRole(
  item: SoftwareTeamShipFields,
  roleId: SoftwareTeamRoleId,
): boolean {
  if (item.roleId === roleId) return true;
  return item.roleHistory.includes(roleId);
}

export function softwareTeamShipGate(
  item: SoftwareTeamShipFields,
): SoftwareTeamShipGate {
  const blocks: SoftwareTeamShipBlock[] = [];
  if (!softwareTeamHasVisitedRole(item, "reviewer")) {
    blocks.push("need_reviewer");
  }
  if (!softwareTeamHasVisitedRole(item, "qa")) {
    blocks.push("need_qa");
  }
  if (!(item.reviewNote ?? "").trim()) {
    blocks.push("need_review_note");
  }
  if (!(item.qaNote ?? "").trim()) {
    blocks.push("need_qa_note");
  }
  return { ok: blocks.length === 0, blocks };
}

export function softwareTeamShipBlockMessageKey(
  block: SoftwareTeamShipBlock,
):
  | "softwareTeamDlc.shipNeedReviewer"
  | "softwareTeamDlc.shipNeedQa"
  | "softwareTeamDlc.shipNeedReviewNote"
  | "softwareTeamDlc.shipNeedQaNote" {
  switch (block) {
    case "need_reviewer":
      return "softwareTeamDlc.shipNeedReviewer";
    case "need_qa":
      return "softwareTeamDlc.shipNeedQa";
    case "need_review_note":
      return "softwareTeamDlc.shipNeedReviewNote";
    case "need_qa_note":
      return "softwareTeamDlc.shipNeedQaNote";
    default: {
      const _never: never = block;
      return _never;
    }
  }
}

/** Agent-facing English checklist (not UI copy). */
export function softwareTeamRoleChecklist(roleId: SoftwareTeamRoleId): string[] {
  switch (roleId) {
    case "reviewer":
      return [
        "Reviewer checklist:",
        "- Diff: files touched, must-fix vs nits.",
        "- Test: name how you would verify — do not invent a pass.",
        "- Risk: regressions, honesty, App.tsx / AppWorkbench freeze.",
        "- Do not rewrite the change unless asked.",
      ];
    case "qa":
      return [
        "QA checklist:",
        "- Diff: what changed vs the agreed slice.",
        "- Test: happy path, edges, a likely regression. Run or name existing unit/typecheck — no invented browser pass.",
        "- Risk: what you did not run, and why.",
        "- Report fail/pass with the commands used.",
      ];
    case "product":
    case "architect":
    case "engineer":
    case "writer":
      return [];
    default: {
      const _never: never = roleId;
      return _never;
    }
  }
}
