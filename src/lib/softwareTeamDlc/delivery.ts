/**
 * Software Works — start a delivery (wizard) + optional workspace bootstrap.
 *
 * Bootstrap writes only under the project folder (`docs/sdlc/…`).
 * Never writes shared `~/.grok`. Never claims success without Host.
 */

import * as api from "@/lib/api";
import type { MessageKey } from "@/i18n";
import type { SoftwareTeamPipelineItemDraft } from "./pipeline";
import { softwareTeamRoleById, type SoftwareTeamRoleId } from "./roles";

export const SOFTWARE_TEAM_BOOTSTRAP_RELATIVE = [
  "docs/sdlc/spec.md",
  "docs/sdlc/design.md",
  "docs/sdlc/review.md",
] as const;

export const SOFTWARE_TEAM_BOOTSTRAP_REASONS = [
  "ok_project",
  "skipped",
  "need_host",
  "need_project",
  "blocked_shared_home",
  "host_error",
] as const;

export type SoftwareTeamBootstrapReason =
  (typeof SOFTWARE_TEAM_BOOTSTRAP_REASONS)[number];

export type SoftwareTeamBootstrapHost = {
  isDesktopHost: () => boolean;
  readFile: (
    projectPath: string,
    relative: string,
  ) => Promise<{ error?: string | null; text?: string | null }>;
  writeFile: (
    projectPath: string,
    relative: string,
    content: string,
  ) => Promise<unknown>;
};

export type SoftwareTeamBootstrapFileResult = {
  relative: string;
  action: "created" | "skipped";
};

export type SoftwareTeamBootstrapResult =
  | {
      ok: true;
      reason: Extract<SoftwareTeamBootstrapReason, "ok_project" | "skipped">;
      files: SoftwareTeamBootstrapFileResult[];
    }
  | {
      ok: false;
      reason: Exclude<SoftwareTeamBootstrapReason, "ok_project" | "skipped">;
      error?: string;
      files: SoftwareTeamBootstrapFileResult[];
    };

/** True when `projectPath` *is* shared GROK_HOME (`~/.grok`), not a normal repo. */
export function isSoftwareTeamSharedHomePath(
  raw: string | null | undefined,
): boolean {
  const p = (raw ?? "").trim().replace(/\\/g, "/").replace(/\/+$/, "");
  if (!p) return false;
  const lower = p.toLowerCase();
  if (lower === "~/.grok" || lower === "~/.grok/") return true;
  return /(?:^|\/)\.grok$/.test(lower);
}

export function newSoftwareTeamDeliveryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function defaultSoftwareTeamBootstrapHost(): SoftwareTeamBootstrapHost {
  return {
    isDesktopHost: () => api.isDesktopHost(),
    readFile: (projectPath, relative) => api.fsReadFile(projectPath, relative),
    writeFile: (projectPath, relative, content) =>
      api.fsWriteFile(projectPath, relative, content),
  };
}

export function planSoftwareTeamWorkspaceBootstrap(input: {
  projectPath?: string | null;
  bootstrap?: boolean;
  host?: Pick<SoftwareTeamBootstrapHost, "isDesktopHost">;
}): {
  allowed: boolean;
  reason: SoftwareTeamBootstrapReason;
  projectPath: string;
} {
  if (!input.bootstrap) {
    return { allowed: false, reason: "skipped", projectPath: "" };
  }
  const projectPath = (input.projectPath ?? "").trim();
  if (!projectPath) {
    return { allowed: false, reason: "need_project", projectPath: "" };
  }
  if (isSoftwareTeamSharedHomePath(projectPath)) {
    return { allowed: false, reason: "blocked_shared_home", projectPath };
  }
  const host = input.host ?? defaultSoftwareTeamBootstrapHost();
  if (!host.isDesktopHost()) {
    return { allowed: false, reason: "need_host", projectPath };
  }
  return { allowed: true, reason: "ok_project", projectPath };
}

export function softwareTeamBootstrapMessageKey(
  reason: SoftwareTeamBootstrapReason,
): MessageKey {
  switch (reason) {
    case "ok_project":
      return "softwareTeamDlc.startDeliveryBootstrapped";
    case "skipped":
      return "softwareTeamDlc.startDeliveryBootstrapSkip";
    case "need_host":
      return "softwareTeamDlc.startDeliveryNeedHost";
    case "need_project":
      return "softwareTeamDlc.startDeliveryNeedProject";
    case "blocked_shared_home":
      return "softwareTeamDlc.startDeliveryBlockedHome";
    case "host_error":
      return "softwareTeamDlc.startDeliveryHostError";
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}

function bootstrapBody(relative: string, title: string): string {
  const slice = title.trim() || "Untitled slice";
  const stem = relative.split("/").pop() ?? relative;
  return [
    `# ${stem.replace(/\.md$/, "")}`,
    "",
    `Slice: ${slice}`,
    "",
    "Placeholder for Software Works / SDLC Studio.",
    "Stay on Grok Build. Fill this file in the project workspace.",
    "Do not write shared ~/.grok from this bootstrap.",
    "",
  ].join("\n");
}

/** Write missing `docs/sdlc/{spec,design,review}.md` under the project. Idempotent. */
export async function writeSoftwareTeamWorkspaceBootstrap(input: {
  projectPath?: string | null;
  title?: string | null;
  bootstrap?: boolean;
  host?: SoftwareTeamBootstrapHost;
}): Promise<SoftwareTeamBootstrapResult> {
  const host = input.host ?? defaultSoftwareTeamBootstrapHost();
  const plan = planSoftwareTeamWorkspaceBootstrap({
    projectPath: input.projectPath,
    bootstrap: input.bootstrap ?? true,
    host,
  });
  if (plan.reason === "skipped") {
    return { ok: true, reason: "skipped", files: [] };
  }
  if (
    plan.reason === "need_host" ||
    plan.reason === "need_project" ||
    plan.reason === "blocked_shared_home" ||
    plan.reason === "host_error"
  ) {
    return { ok: false, reason: plan.reason, files: [] };
  }
  if (!plan.allowed) {
    return { ok: false, reason: "host_error", files: [] };
  }
  const files: SoftwareTeamBootstrapFileResult[] = [];
  try {
    for (const relative of SOFTWARE_TEAM_BOOTSTRAP_RELATIVE) {
      let exists = false;
      try {
        const read = await host.readFile(plan.projectPath, relative);
        exists = !read.error && typeof read.text === "string";
      } catch {
        exists = false;
      }
      if (exists) {
        files.push({ relative, action: "skipped" });
        continue;
      }
      await host.writeFile(
        plan.projectPath,
        relative,
        bootstrapBody(relative, input.title ?? ""),
      );
      files.push({ relative, action: "created" });
    }
    return { ok: true, reason: "ok_project", files };
  } catch (err) {
    const error =
      err instanceof Error && err.message.trim()
        ? err.message.trim()
        : String(err ?? "bootstrap write failed");
    return { ok: false, reason: "host_error", error, files };
  }
}

export function softwareTeamDeliveryItemDraft(input: {
  title: string;
  roleId?: SoftwareTeamRoleId | null;
  deliveryId?: string | null;
  sessionId?: string | null;
  planRef?: string | null;
  goalRef?: string | null;
  artifactRef?: string | null;
}): SoftwareTeamPipelineItemDraft {
  const role = softwareTeamRoleById(input.roleId) ?? softwareTeamRoleById("product")!;
  const title = input.title.trim();
  return {
    title,
    roleId: role.id,
    stageId: role.defaultStage,
    sessionId: (input.sessionId ?? "").trim(),
    deliveryId: (input.deliveryId ?? "").trim() || newSoftwareTeamDeliveryId(),
    planRef: (input.planRef ?? "").trim(),
    goalRef: (input.goalRef ?? "").trim() || title,
    artifactRef: (input.artifactRef ?? "").trim(),
    stageSource: "board",
  };
}
