/**
 * Software Works — execute pack install via real Host APIs.
 *
 * Never fakes success. Shared GROK_HOME user writes are refused by the
 * planner. Browser / mirror without desktop Host returns `need_host`.
 */

import type { MessageKey } from "@/i18n";
import * as api from "@/lib/api";
import {
  planSoftwareTeamDlcPackWrite,
  type SoftwareTeamDlcInstallReason,
  type SoftwareTeamDlcInstallTarget,
} from "./installPlan";
import { softwareTeamDlcPackFiles, type SoftwareTeamPackFile } from "./pack";

export const SOFTWARE_TEAM_PACK_INSTALL_FAIL_REASONS = [
  "blocked_shared_user",
  "need_project",
  "need_host",
  "host_error",
] as const;

export type SoftwareTeamPackInstallFailReason =
  (typeof SOFTWARE_TEAM_PACK_INSTALL_FAIL_REASONS)[number];

export type SoftwareTeamPackFileAction = "created" | "updated";

export type SoftwareTeamPackFileResult = {
  name: string;
  kind: SoftwareTeamPackFile["kind"];
  path: string;
  action: SoftwareTeamPackFileAction;
};

export type SoftwareTeamPackInstallResult =
  | {
      ok: true;
      target: SoftwareTeamDlcInstallTarget;
      reason: Extract<
        SoftwareTeamDlcInstallReason,
        "ok_project" | "ok_independent_user"
      >;
      files: SoftwareTeamPackFileResult[];
    }
  | {
      ok: false;
      reason: SoftwareTeamPackInstallFailReason;
      error?: string;
      files: SoftwareTeamPackFileResult[];
    };

export type SoftwareTeamPackWriteHost = {
  isDesktopHost: () => boolean;
  agentsScaffold: (opts: {
    name: string;
    scope?: "user" | "project" | string;
    projectPath?: string | null;
    force?: boolean;
    description?: string | null;
  }) => Promise<{
    name: string;
    path: string;
    created: boolean;
    overwritten: boolean;
  }>;
  skillCreate: (opts: {
    name: string;
    description?: string | null;
    projectPath?: string | null;
    scope?: "user" | "project" | null;
  }) => Promise<{
    path: string;
    name: string;
    created: boolean;
    alreadyExisted: boolean;
  }>;
  skillWrite: (
    path: string,
    content: string,
    expectedMtimeMs?: number | null,
    projectPath?: string | null,
  ) => Promise<unknown>;
  workflowsCreate: (opts: {
    name: string;
    scope?: "user" | "project" | string;
    projectPath?: string | null;
    force?: boolean;
  }) => Promise<{
    name: string;
    path: string;
    created: boolean;
    overwritten: boolean;
  }>;
  writeAbsolute: (path: string, content: string) => Promise<unknown>;
};

export function defaultSoftwareTeamPackHost(): SoftwareTeamPackWriteHost {
  return {
    isDesktopHost: () => api.isDesktopHost(),
    agentsScaffold: (opts) => api.agentsScaffold(opts),
    skillCreate: (opts) => api.skillCreate(opts),
    skillWrite: (path, content, expectedMtimeMs, projectPath) =>
      api.skillWrite(path, content, expectedMtimeMs, projectPath),
    workflowsCreate: (opts) => api.workflowsCreate(opts),
    writeAbsolute: (path, content) => api.fsWriteAbsolute(path, content),
  };
}

export function pickSoftwareTeamInstallTarget(input: {
  sessionDataMode?: string | null;
  projectPath?: string | null;
  preferred?: SoftwareTeamDlcInstallTarget | null;
}): SoftwareTeamDlcInstallTarget {
  if (input.preferred === "user" || input.preferred === "project") {
    return input.preferred;
  }
  return (input.projectPath ?? "").trim() ? "project" : "user";
}

export function softwareTeamInstallFailMessageKey(
  reason: SoftwareTeamPackInstallFailReason,
): MessageKey {
  switch (reason) {
    case "blocked_shared_user":
      return "softwareTeamDlc.install.blockedShared";
    case "need_project":
      return "softwareTeamDlc.install.needProject";
    case "need_host":
      return "softwareTeamDlc.install.needHost";
    case "host_error":
      return "softwareTeamDlc.install.hostError";
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}

function fail(
  reason: SoftwareTeamPackInstallFailReason,
  files: SoftwareTeamPackFileResult[],
  error?: string,
): SoftwareTeamPackInstallResult {
  return { ok: false, reason, error, files };
}

function hostErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message.trim()) return err.message.trim();
  const text = String(err ?? "").trim();
  return text || "host write failed";
}

async function writePackFile(
  host: SoftwareTeamPackWriteHost,
  file: SoftwareTeamPackFile,
  scope: "user" | "project",
  projectPath: string | null,
): Promise<SoftwareTeamPackFileResult> {
  switch (file.kind) {
    case "agent": {
      const scaffolded = await host.agentsScaffold({
        name: file.name,
        scope,
        projectPath,
        force: true,
        description: file.content.split("\n")[2] ?? file.name,
      });
      await host.writeAbsolute(scaffolded.path, file.content);
      return {
        name: file.name,
        kind: file.kind,
        path: scaffolded.path,
        action: scaffolded.created ? "created" : "updated",
      };
    }
    case "skill": {
      const created = await host.skillCreate({
        name: file.name,
        description: file.content.split("\n")[2] ?? file.name,
        projectPath,
        scope,
      });
      await host.skillWrite(created.path, file.content, null, projectPath);
      return {
        name: file.name,
        kind: file.kind,
        path: created.path,
        action: created.alreadyExisted ? "updated" : "created",
      };
    }
    case "workflow": {
      const created = await host.workflowsCreate({
        name: file.name,
        scope,
        projectPath,
        force: true,
      });
      await host.writeAbsolute(created.path, file.content);
      return {
        name: file.name,
        kind: file.kind,
        path: created.path,
        action: created.created ? "created" : "updated",
      };
    }
    default: {
      const _never: never = file.kind;
      return _never;
    }
  }
}

/**
 * Install the 13 pack files. Idempotent: existing files are overwritten
 * with the checked-in pack body. Does not rewrite shared ~/.grok.
 */
export async function installSoftwareTeamDlcPack(input: {
  sessionDataMode?: string | null;
  target?: SoftwareTeamDlcInstallTarget | null;
  projectPath?: string | null;
  host?: SoftwareTeamPackWriteHost;
}): Promise<SoftwareTeamPackInstallResult> {
  const host = input.host ?? defaultSoftwareTeamPackHost();
  const target = pickSoftwareTeamInstallTarget({
    sessionDataMode: input.sessionDataMode,
    projectPath: input.projectPath,
    preferred: input.target,
  });
  const plan = planSoftwareTeamDlcPackWrite({
    sessionDataMode: input.sessionDataMode,
    target,
    projectPath: input.projectPath,
  });
  if (!plan.allowed) {
    const reason: SoftwareTeamPackInstallFailReason =
      plan.reason === "blocked_shared_user" || plan.reason === "need_project"
        ? plan.reason
        : "host_error";
    return fail(reason, []);
  }
  if (!host.isDesktopHost()) {
    return fail("need_host", []);
  }

  const scope: "user" | "project" = target === "project" ? "project" : "user";
  const projectPath =
    target === "project" ? (input.projectPath ?? "").trim() || null : null;
  const files: SoftwareTeamPackFileResult[] = [];
  try {
    for (const file of softwareTeamDlcPackFiles()) {
      files.push(await writePackFile(host, file, scope, projectPath));
    }
  } catch (err) {
    return fail("host_error", files, hostErrorMessage(err));
  }

  if (plan.reason === "ok_project" || plan.reason === "ok_independent_user") {
    return {
      ok: true,
      target,
      reason: plan.reason,
      files,
    };
  }
  return fail("host_error", files, "unexpected install plan");
}
