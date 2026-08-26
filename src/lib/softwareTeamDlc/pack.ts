/**
 * Software Team DLC — checked-in pack templates (agents / skills / workflows).
 *
 * These are in-app presets. Enabling the DLC surfaces them immediately.
 * Optional disk install is gated by `planSoftwareTeamDlcPackWrite` (never
 * rewrites shared ~/.grok).
 */

import {
  SOFTWARE_TEAM_ROLES,
  softwareTeamRoleById,
  type SoftwareTeamRoleId,
} from "./roles";

export type SoftwareTeamPackKind = "agent" | "skill" | "workflow";

export type SoftwareTeamPackFile = {
  kind: SoftwareTeamPackKind;
  /** File stem / skill folder (`team-product`). */
  name: string;
  /** Relative path under a `.grok` root. */
  relativePath: string;
  content: string;
  roleId?: SoftwareTeamRoleId;
};

const ROLE_STARTERS: Record<SoftwareTeamRoleId, string> = {
  product: [
    "Act as the Product role in this Grok Build session (Software Team DLC).",
    "Stay on Grok Build — do not switch runtimes or spawn extra CLI agents.",
    "Clarify the user outcome, scope, and acceptance checks.",
    "Write a short backlog: problem, in-scope / out-of-scope, and the next Design handoff.",
    "Ask before expanding scope. Prefer one shippable slice.",
  ].join("\n"),
  architect: [
    "Act as the Architect role in this Grok Build session (Software Team DLC).",
    "Stay on Grok Build — do not switch runtimes or spawn extra CLI agents.",
    "Propose a design that fits this repo: modules, data flow, and risks.",
    "Call out files to touch and what not to rewrite.",
    "Hand off a concrete Build plan the Engineer role can execute.",
  ].join("\n"),
  engineer: [
    "Act as the Engineer role in this Grok Build session (Software Team DLC).",
    "Stay on Grok Build — do not switch runtimes or spawn extra CLI agents.",
    "Implement the agreed slice. Match existing code style.",
    "Do not add features outside the handoff. Keep App.tsx / AppWorkbench.tsx untouched unless the task is a documented shrink.",
    "Summarize files changed and how to verify.",
  ].join("\n"),
  reviewer: [
    "Act as the Reviewer role in this Grok Build session (Software Team DLC).",
    "Stay on Grok Build — do not switch runtimes or spawn extra CLI agents.",
    "Review the current diff for correctness, regressions, and honesty.",
    "Prefer specific file:line comments. Do not rewrite the change unless asked.",
    "Gate Ship on must-fix items only; list nits separately.",
  ].join("\n"),
  qa: [
    "Act as the QA role in this Grok Build session (Software Team DLC).",
    "Stay on Grok Build — do not switch runtimes or spawn extra CLI agents.",
    "List test cases for the slice: happy path, edges, and a likely regression.",
    "Run or name the existing unit/typecheck commands. Do not claim a Tauri browser pass you did not do.",
    "Report fail/pass with commands used.",
  ].join("\n"),
  writer: [
    "Act as the Tech Writer role in this Grok Build session (Software Team DLC).",
    "Stay on Grok Build — do not switch runtimes or spawn extra CLI agents.",
    "Update agent-facing wiki or in-app i18n only when the product change needs it.",
    "Do not invent user-facing README sections the user did not ask for.",
    "Keep identifiers (CLI flags, setting keys, hashes) exact.",
  ].join("\n"),
};

function agentMd(roleId: SoftwareTeamRoleId): string {
  const role = softwareTeamRoleById(roleId);
  const name = role?.packName ?? `team-${roleId}`;
  const title = name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return [
    `# ${title}`,
    "",
    ROLE_STARTERS[roleId],
    "",
    "Suggested slash: `/" + name + "`.",
    "",
  ].join("\n");
}

function skillMd(roleId: SoftwareTeamRoleId): string {
  const role = softwareTeamRoleById(roleId);
  const name = role?.packName ?? `team-${roleId}`;
  const title = name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const desc = ROLE_STARTERS[roleId].split("\n")[0] ?? title;
  return [
    "---",
    `name: ${name}`,
    `description: ${desc.replace(/"/g, '\\"')}`,
    "---",
    "",
    `# ${title}`,
    "",
    ROLE_STARTERS[roleId],
    "",
    "## Steps",
    "",
    "1. Confirm the session should stay in this role.",
    "2. Follow the orientation above.",
    "3. Hand off to the next SDLC stage when the slice is ready.",
    "",
  ].join("\n");
}

const HANDOFF_WORKFLOW = [
  "// Software Team DLC — single-agent SDLC handoff hint.",
  "// Runs inside Grok Build. Does not spawn a second CLI runtime.",
  "fn main() {",
  '    print("Software Team DLC handoff: Backlog → Design → Build → Review → Ship");',
  '    print("Use one Grok Build session per role, or attach-chat across sessions.");',
  '    print("Do not rewrite shared ~/.grok; do not auto-apply appearance skins.");',
  "}",
  "",
].join("\n");

export function softwareTeamRoleStarterPrompt(
  roleId: SoftwareTeamRoleId,
): string {
  return ROLE_STARTERS[roleId];
}

/** Agent + skill files for every role, plus one handoff workflow. */
export function softwareTeamDlcPackFiles(): SoftwareTeamPackFile[] {
  const files: SoftwareTeamPackFile[] = [];
  for (const role of SOFTWARE_TEAM_ROLES) {
    files.push({
      kind: "agent",
      name: role.packName,
      relativePath: `agents/${role.packName}.md`,
      content: agentMd(role.id),
      roleId: role.id,
    });
    files.push({
      kind: "skill",
      name: role.packName,
      relativePath: `skills/${role.packName}/SKILL.md`,
      content: skillMd(role.id),
      roleId: role.id,
    });
  }
  files.push({
    kind: "workflow",
    name: "team-handoff",
    relativePath: "workflows/team-handoff.rhai",
    content: HANDOFF_WORKFLOW,
  });
  return files;
}

export function softwareTeamDlcPackFileByName(
  name: string,
): SoftwareTeamPackFile | null {
  const key = name.trim().toLowerCase();
  if (!key) return null;
  return (
    softwareTeamDlcPackFiles().find(
      (f) => f.name.toLowerCase() === key || f.relativePath.toLowerCase() === key,
    ) ?? null
  );
}

/** Idempotent listing: same names and paths every call. */
export function softwareTeamDlcPackManifest(): {
  agents: string[];
  skills: string[];
  workflows: string[];
} {
  const files = softwareTeamDlcPackFiles();
  return {
    agents: files.filter((f) => f.kind === "agent").map((f) => f.name),
    skills: files.filter((f) => f.kind === "skill").map((f) => f.name),
    workflows: files.filter((f) => f.kind === "workflow").map((f) => f.name),
  };
}
