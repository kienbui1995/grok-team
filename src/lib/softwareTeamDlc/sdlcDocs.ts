/**
 * Software Works — open project `docs/sdlc/{spec,design,review}.md`.
 *
 * Uses Host `openInEditor` when available. Otherwise copy the path.
 * Never writes ~/.grok. Does not invent success without Host.
 */

import * as api from "@/lib/api";
import type { MessageKey } from "@/i18n";
import {
  SOFTWARE_TEAM_BOOTSTRAP_RELATIVE,
  isSoftwareTeamSharedHomePath,
} from "./delivery";

export const SOFTWARE_TEAM_SDLC_DOC_RELATIVE = SOFTWARE_TEAM_BOOTSTRAP_RELATIVE;

export const SOFTWARE_TEAM_SDLC_DOC_OPEN_REASONS = [
  "opened_editor",
  "copied_path",
  "missing",
  "need_host",
  "need_project",
  "blocked_shared_home",
  "host_error",
] as const;

export type SoftwareTeamSdlcDocOpenReason =
  (typeof SOFTWARE_TEAM_SDLC_DOC_OPEN_REASONS)[number];

export type SoftwareTeamSdlcDocHost = {
  isDesktopHost: () => boolean;
  readFile: (
    projectPath: string,
    relative: string,
  ) => Promise<{ error?: string | null; text?: string | null }>;
  resolvePath: (
    path: string,
    projectPath?: string | null,
  ) => Promise<{ absolutePath?: string }>;
  openInEditor?: (path: string) => Promise<unknown>;
};

export type SoftwareTeamSdlcDocProbe = {
  relative: (typeof SOFTWARE_TEAM_SDLC_DOC_RELATIVE)[number];
  exists: boolean;
};

export type SoftwareTeamSdlcDocOpen =
  | { ok: true; reason: Extract<SoftwareTeamSdlcDocOpenReason, "opened_editor" | "copied_path">; path: string }
  | {
      ok: false;
      reason: Exclude<SoftwareTeamSdlcDocOpenReason, "opened_editor" | "copied_path">;
      error?: string;
      path?: string;
    };

export function defaultSoftwareTeamSdlcDocHost(): SoftwareTeamSdlcDocHost {
  return {
    isDesktopHost: () => api.isDesktopHost(),
    readFile: (projectPath, relative) => api.fsReadFile(projectPath, relative),
    resolvePath: (path, projectPath) => api.fsResolvePath(path, projectPath),
    openInEditor: (path) => api.openInEditor({ path }),
  };
}

export function planSoftwareTeamSdlcDocOpen(input: {
  projectPath?: string | null;
  host?: Pick<SoftwareTeamSdlcDocHost, "isDesktopHost">;
}): {
  allowed: boolean;
  reason: Extract<
    SoftwareTeamSdlcDocOpenReason,
    "need_host" | "need_project" | "blocked_shared_home"
  > | "ok";
  projectPath: string;
} {
  const projectPath = (input.projectPath ?? "").trim();
  if (!projectPath) {
    return { allowed: false, reason: "need_project", projectPath: "" };
  }
  if (isSoftwareTeamSharedHomePath(projectPath)) {
    return { allowed: false, reason: "blocked_shared_home", projectPath };
  }
  const host = input.host ?? defaultSoftwareTeamSdlcDocHost();
  if (!host.isDesktopHost()) {
    return { allowed: false, reason: "need_host", projectPath };
  }
  return { allowed: true, reason: "ok", projectPath };
}

export function softwareTeamSdlcDocOpenMessageKey(
  reason: SoftwareTeamSdlcDocOpenReason,
): MessageKey {
  switch (reason) {
    case "opened_editor":
      return "softwareTeamDlc.openSdlcDocOpened";
    case "copied_path":
      return "softwareTeamDlc.openSdlcDocCopied";
    case "missing":
      return "softwareTeamDlc.openSdlcDocMissing";
    case "need_host":
      return "softwareTeamDlc.openSdlcDocNeedHost";
    case "need_project":
      return "softwareTeamDlc.openSdlcDocNeedProject";
    case "blocked_shared_home":
      return "softwareTeamDlc.openSdlcDocBlockedHome";
    case "host_error":
      return "softwareTeamDlc.openSdlcDocHostError";
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}

export async function probeSoftwareTeamSdlcDocs(input: {
  projectPath?: string | null;
  host?: SoftwareTeamSdlcDocHost;
}): Promise<SoftwareTeamSdlcDocProbe[]> {
  const host = input.host ?? defaultSoftwareTeamSdlcDocHost();
  const plan = planSoftwareTeamSdlcDocOpen({
    projectPath: input.projectPath,
    host,
  });
  if (!plan.allowed) {
    return SOFTWARE_TEAM_SDLC_DOC_RELATIVE.map((relative) => ({
      relative,
      exists: false,
    }));
  }
  const out: SoftwareTeamSdlcDocProbe[] = [];
  for (const relative of SOFTWARE_TEAM_SDLC_DOC_RELATIVE) {
    let exists = false;
    try {
      const read = await host.readFile(plan.projectPath, relative);
      exists = !read.error && typeof read.text === "string";
    } catch {
      exists = false;
    }
    out.push({ relative, exists });
  }
  return out;
}

export async function openSoftwareTeamSdlcDoc(input: {
  projectPath?: string | null;
  relative: string;
  host?: SoftwareTeamSdlcDocHost;
  copyText?: (text: string) => Promise<boolean>;
}): Promise<SoftwareTeamSdlcDocOpen> {
  const host = input.host ?? defaultSoftwareTeamSdlcDocHost();
  const plan = planSoftwareTeamSdlcDocOpen({
    projectPath: input.projectPath,
    host,
  });
  if (!plan.allowed) {
    const reason = plan.reason;
    if (reason === "ok") {
      return { ok: false, reason: "host_error" };
    }
    return { ok: false, reason };
  }
  const relative = input.relative.trim();
  if (
    !(SOFTWARE_TEAM_SDLC_DOC_RELATIVE as readonly string[]).includes(relative)
  ) {
    return { ok: false, reason: "missing" };
  }
  try {
    const read = await host.readFile(plan.projectPath, relative);
    if (read.error || typeof read.text !== "string") {
      return { ok: false, reason: "missing" };
    }
  } catch {
    return { ok: false, reason: "missing" };
  }
  let absolute = `${plan.projectPath.replace(/[/\\]+$/, "")}/${relative}`;
  try {
    const resolved = await host.resolvePath(relative, plan.projectPath);
    if (resolved.absolutePath?.trim()) absolute = resolved.absolutePath.trim();
  } catch {
    /* keep joined path */
  }
  if (host.openInEditor) {
    try {
      await host.openInEditor(absolute);
      return { ok: true, reason: "opened_editor", path: absolute };
    } catch (err) {
      const error =
        err instanceof Error && err.message.trim()
          ? err.message.trim()
          : String(err ?? "open failed");
      const copied = input.copyText ? await input.copyText(absolute) : false;
      if (copied) return { ok: true, reason: "copied_path", path: absolute };
      return { ok: false, reason: "host_error", error, path: absolute };
    }
  }
  const copied = input.copyText ? await input.copyText(absolute) : false;
  if (copied) return { ok: true, reason: "copied_path", path: absolute };
  return { ok: false, reason: "host_error", error: "no editor API", path: absolute };
}
