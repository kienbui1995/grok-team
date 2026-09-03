/**
 * Software Works — probe pack files on the chosen target and repair gaps.
 *
 * Reads Host list APIs. Never claims installed without a matching listing.
 */

import type { MessageKey } from "@/i18n";
import * as api from "@/lib/api";
import {
  installSoftwareTeamDlcPack,
  pickSoftwareTeamInstallTarget,
  type SoftwareTeamPackInstallResult,
  type SoftwareTeamPackWriteHost,
} from "./install";
import {
  planSoftwareTeamDlcPackWrite,
  type SoftwareTeamDlcInstallTarget,
} from "./installPlan";
import {
  softwareTeamDlcPackFiles,
  type SoftwareTeamPackFile,
  type SoftwareTeamPackKind,
} from "./pack";

export const SOFTWARE_TEAM_PACK_STATUS_KINDS = [
  "installed",
  "missing",
  "blocked_shared",
  "need_project",
  "need_host",
  "host_error",
] as const;

export type SoftwareTeamPackStatusKind =
  (typeof SOFTWARE_TEAM_PACK_STATUS_KINDS)[number];

export type SoftwareTeamPackListedFile = {
  name: string;
  kind: SoftwareTeamPackKind;
  scope?: string;
};

export type SoftwareTeamPackProbeHost = {
  isDesktopHost: () => boolean;
  agentsList: (projectPath?: string | null) => Promise<{
    agents: Array<{ name: string; scope?: string | null }>;
  }>;
  skillsList: (projectPath?: string | null) => Promise<{
    skills: Array<{ name: string; source?: string | null }>;
  }>;
  workflowsList: (projectPath?: string | null) => Promise<{
    workflows: Array<{ name: string; scope?: string | null }>;
  }>;
};

export type SoftwareTeamPackStatus = {
  kind: SoftwareTeamPackStatusKind;
  target: SoftwareTeamDlcInstallTarget;
  present: SoftwareTeamPackListedFile[];
  missing: SoftwareTeamPackListedFile[];
  error?: string;
};

export function defaultSoftwareTeamPackProbeHost(): SoftwareTeamPackProbeHost {
  return {
    isDesktopHost: () => api.isDesktopHost(),
    agentsList: (projectPath) => api.agentsList(projectPath),
    skillsList: (projectPath) => api.skillsList(projectPath),
    workflowsList: (projectPath) => api.workflowsList(projectPath),
  };
}

export function softwareTeamPackStatusMessageKey(
  kind: SoftwareTeamPackStatusKind,
): MessageKey {
  switch (kind) {
    case "installed":
      return "softwareTeamDlc.install.status.installed";
    case "missing":
      return "softwareTeamDlc.install.status.missing";
    case "blocked_shared":
      return "softwareTeamDlc.install.blockedShared";
    case "need_project":
      return "softwareTeamDlc.install.needProject";
    case "need_host":
      return "softwareTeamDlc.install.needHost";
    case "host_error":
      return "softwareTeamDlc.install.hostError";
    default: {
      const _never: never = kind;
      return _never;
    }
  }
}

function norm(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase();
}

export function softwareTeamListedScopeMatchesTarget(
  target: SoftwareTeamDlcInstallTarget,
  listedScope: string | null | undefined,
): boolean {
  const scope = norm(listedScope);
  if (target === "project") {
    return scope === "project" || scope === "workspace" || scope === "local";
  }
  return scope === "user" || scope === "agent-home" || scope === "independent";
}

function listedHas(
  rows: Array<{ name: string; scope?: string | null; source?: string | null }>,
  packName: string,
  target: SoftwareTeamDlcInstallTarget,
): boolean {
  const want = norm(packName);
  return rows.some((row) => {
    if (norm(row.name) !== want) return false;
    return softwareTeamListedScopeMatchesTarget(
      target,
      row.scope ?? row.source,
    );
  });
}

export async function probeSoftwareTeamDlcPack(input: {
  sessionDataMode?: string | null;
  target?: SoftwareTeamDlcInstallTarget | null;
  projectPath?: string | null;
  host?: SoftwareTeamPackProbeHost;
}): Promise<SoftwareTeamPackStatus> {
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
  const empty = {
    target,
    present: [] as SoftwareTeamPackListedFile[],
    missing: [] as SoftwareTeamPackListedFile[],
  };
  if (!plan.allowed) {
    const kind: SoftwareTeamPackStatusKind =
      plan.reason === "blocked_shared_user"
        ? "blocked_shared"
        : plan.reason === "need_project"
          ? "need_project"
          : "host_error";
    return { kind, ...empty };
  }
  const host = input.host ?? defaultSoftwareTeamPackProbeHost();
  if (!host.isDesktopHost()) {
    return { kind: "need_host", ...empty };
  }
  const projectPath =
    target === "project" ? (input.projectPath ?? "").trim() || null : null;
  try {
    const [agents, skills, workflows] = await Promise.all([
      host.agentsList(projectPath),
      host.skillsList(projectPath),
      host.workflowsList(projectPath),
    ]);
    const present: SoftwareTeamPackListedFile[] = [];
    const missing: SoftwareTeamPackListedFile[] = [];
    for (const file of softwareTeamDlcPackFiles()) {
      const row = { name: file.name, kind: file.kind };
      const found =
        file.kind === "agent"
          ? listedHas(agents.agents, file.name, target)
          : file.kind === "skill"
            ? listedHas(skills.skills, file.name, target)
            : listedHas(workflows.workflows, file.name, target);
      if (found) present.push(row);
      else missing.push(row);
    }
    return {
      kind: missing.length === 0 ? "installed" : "missing",
      target,
      present,
      missing,
    };
  } catch (err) {
    const error =
      err instanceof Error && err.message.trim()
        ? err.message.trim()
        : String(err ?? "host list failed");
    return { kind: "host_error", error, ...empty };
  }
}

/** Write only missing pack files. Refuses shared ~/.grok. Does not fake success. */
export async function repairSoftwareTeamDlcPack(input: {
  sessionDataMode?: string | null;
  target?: SoftwareTeamDlcInstallTarget | null;
  projectPath?: string | null;
  probeHost?: SoftwareTeamPackProbeHost;
  writeHost?: SoftwareTeamPackWriteHost;
  status?: SoftwareTeamPackStatus;
}): Promise<SoftwareTeamPackInstallResult> {
  const status =
    input.status ??
    (await probeSoftwareTeamDlcPack({
      sessionDataMode: input.sessionDataMode,
      target: input.target,
      projectPath: input.projectPath,
      host: input.probeHost,
    }));
  if (status.kind === "blocked_shared") {
    return { ok: false, reason: "blocked_shared_user", files: [] };
  }
  if (status.kind === "need_project") {
    return { ok: false, reason: "need_project", files: [] };
  }
  if (status.kind === "need_host") {
    return { ok: false, reason: "need_host", files: [] };
  }
  if (status.kind === "host_error") {
    return {
      ok: false,
      reason: "host_error",
      error: status.error,
      files: [],
    };
  }
  if (status.kind === "installed" || status.missing.length === 0) {
    const plan = planSoftwareTeamDlcPackWrite({
      sessionDataMode: input.sessionDataMode,
      target: status.target,
      projectPath: input.projectPath,
    });
    if (plan.reason === "ok_project" || plan.reason === "ok_independent_user") {
      return { ok: true, target: status.target, reason: plan.reason, files: [] };
    }
    return { ok: false, reason: "host_error", files: [] };
  }
  return installSoftwareTeamDlcPack({
    sessionDataMode: input.sessionDataMode,
    target: status.target,
    projectPath: input.projectPath,
    host: input.writeHost,
    onlyFiles: status.missing.map((row) => ({
      name: row.name,
      kind: row.kind,
    })),
  });
}

export function softwareTeamPackFileNames(
  files: SoftwareTeamPackFile[],
): string[] {
  return files.map((file) => file.name);
}
