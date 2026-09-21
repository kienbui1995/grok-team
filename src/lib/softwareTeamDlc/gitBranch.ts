/**
 * Delivery git-branch *label* for Software Works.
 * Stored on pipeline items. Does not create a worktree, checkout, or rewrite ~/.grok.
 */

import {
  updateSoftwareTeamPipelineItem,
  type SoftwareTeamPipelineStore,
} from "./pipeline";

function slugFromTitle(title: string): string {
  const fromTitle = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return fromTitle || "delivery";
}

/** Letters, digits, `.` `_` `-` `/`. No leading dash, `..`, or `//`. */
const BRANCH_BODY = /^(?!-)[A-Za-z0-9._][A-Za-z0-9._\-/]{0,78}$/;

export function normalizeSoftwareTeamGitBranch(
  raw: string | null | undefined,
): string | null {
  const value = (raw ?? "").trim();
  if (!value) return "";
  if (value.includes("..") || value.includes("//") || value.endsWith("/")) {
    return null;
  }
  if (!BRANCH_BODY.test(value)) return null;
  return value;
}

export function isSoftwareTeamGitBranchLabel(
  raw: string | null | undefined,
): boolean {
  return normalizeSoftwareTeamGitBranch(raw) !== null;
}

export function softwareTeamSuggestGitBranch(title: string): string {
  const slug = slugFromTitle(title);
  const suggested = normalizeSoftwareTeamGitBranch(`feat/${slug}`);
  return suggested ?? "feat/delivery";
}

export function softwareTeamDeliveryGitBranch(
  items: ReadonlyArray<{ gitBranch?: string }>,
): string {
  for (const item of items) {
    const branch = (item.gitBranch ?? "").trim();
    if (branch) return branch;
  }
  return "";
}

export function setSoftwareTeamDeliveryGitBranch(
  store: SoftwareTeamPipelineStore,
  deliveryId: string,
  branch: string,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const id = deliveryId.trim();
  const normalized = normalizeSoftwareTeamGitBranch(branch);
  if (!id || normalized === null) return store;
  let next = store;
  for (const item of store.items) {
    if (item.deliveryId.trim() !== id) continue;
    next = updateSoftwareTeamPipelineItem(
      next,
      item.id,
      { gitBranch: normalized },
      now,
    );
  }
  return next;
}
