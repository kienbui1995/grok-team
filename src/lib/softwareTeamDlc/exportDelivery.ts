/**
 * Software Works — export a delivery summary into the project docs/sdlc folder.
 *
 * Writes `docs/sdlc/<slug>-delivery.md` only. Never writes shared `~/.grok`
 * or this app's CHANGELOG.md. Never fakes Host success.
 */

import * as api from "@/lib/api";
import type { MessageKey } from "@/i18n";
import { isSoftwareTeamSharedHomePath } from "./delivery";
import type { SoftwareTeamDeliveryDetail } from "./deliveryDetail";
import type { SoftwareTeamActivityEvent } from "./activity";

export const SOFTWARE_TEAM_EXPORT_REASONS = [
  "ok_project",
  "need_host",
  "need_project",
  "blocked_shared_home",
  "bad_slug",
  "host_error",
] as const;

export type SoftwareTeamExportReason =
  (typeof SOFTWARE_TEAM_EXPORT_REASONS)[number];

export type SoftwareTeamExportHost = {
  isDesktopHost: () => boolean;
  writeFile: (
    projectPath: string,
    relative: string,
    content: string,
  ) => Promise<unknown>;
};

export type SoftwareTeamExportResult =
  | { ok: true; reason: "ok_project"; relative: string }
  | {
      ok: false;
      reason: Exclude<SoftwareTeamExportReason, "ok_project">;
      error?: string;
      relative?: string;
    };

const SDLC_PREFIX = "docs/sdlc/";
const DELIVERY_SUFFIX = "-delivery.md";
const SLUG_BODY = /^[a-z0-9][a-z0-9-]{0,62}$/;
const FILE_NAME = /^[a-z0-9][a-z0-9-]{0,80}-delivery\.md$/;

export function softwareTeamDeliverySlug(
  title: string,
  fallback = "delivery",
): string {
  const fromTitle = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  if (fromTitle && SLUG_BODY.test(fromTitle)) return fromTitle;
  const fromFallback = fallback
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  if (fromFallback && SLUG_BODY.test(fromFallback)) return fromFallback;
  return "delivery";
}

export function softwareTeamDeliveryExportRelative(
  title: string,
  fallback = "delivery",
): string {
  return `${SDLC_PREFIX}${softwareTeamDeliverySlug(title, fallback)}${DELIVERY_SUFFIX}`;
}

/** Tight allowlist twin of Host `docs/sdlc/<slug>-delivery.md`. */
export function isSoftwareTeamSdlcDeliverySummaryRelative(
  relative: string,
): boolean {
  const n = relative.trim().replace(/\\/g, "/");
  if (!n.startsWith(SDLC_PREFIX)) return false;
  if (n.includes("..")) return false;
  const name = n.slice(SDLC_PREFIX.length);
  if (!name || name.includes("/")) return false;
  return FILE_NAME.test(name);
}

export function planSoftwareTeamDeliveryExport(input: {
  projectPath?: string | null;
  relative: string;
  host?: Pick<SoftwareTeamExportHost, "isDesktopHost">;
}): {
  allowed: boolean;
  reason: SoftwareTeamExportReason;
  projectPath: string;
  relative: string;
} {
  const projectPath = (input.projectPath ?? "").trim();
  const relative = input.relative.trim().replace(/\\/g, "/");
  if (!isSoftwareTeamSdlcDeliverySummaryRelative(relative)) {
    return { allowed: false, reason: "bad_slug", projectPath, relative };
  }
  if (!projectPath) {
    return { allowed: false, reason: "need_project", projectPath: "", relative };
  }
  if (isSoftwareTeamSharedHomePath(projectPath)) {
    return { allowed: false, reason: "blocked_shared_home", projectPath, relative };
  }
  const host = input.host ?? defaultSoftwareTeamExportHost();
  if (!host.isDesktopHost()) {
    return { allowed: false, reason: "need_host", projectPath, relative };
  }
  return { allowed: true, reason: "ok_project", projectPath, relative };
}

export function defaultSoftwareTeamExportHost(): SoftwareTeamExportHost {
  return {
    isDesktopHost: () => api.isDesktopHost(),
    writeFile: (projectPath, relative, content) =>
      api.fsWriteFile(projectPath, relative, content),
  };
}

/** Failed Host write: copy markdown instead. Never pretends a file was written. */
export function softwareTeamExportShouldCopyInstead(
  reason: SoftwareTeamExportReason,
): boolean {
  switch (reason) {
    case "ok_project":
      return false;
    case "need_host":
    case "need_project":
    case "blocked_shared_home":
    case "bad_slug":
    case "host_error":
      return true;
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}

export function softwareTeamExportMessageKey(
  reason: SoftwareTeamExportReason,
): MessageKey {
  switch (reason) {
    case "ok_project":
      return "softwareTeamDlc.exportOk";
    case "need_host":
      return "softwareTeamDlc.exportNeedHost";
    case "need_project":
      return "softwareTeamDlc.exportNeedProject";
    case "blocked_shared_home":
      return "softwareTeamDlc.exportBlockedHome";
    case "bad_slug":
      return "softwareTeamDlc.exportBadSlug";
    case "host_error":
      return "softwareTeamDlc.exportHostError";
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}

function activityLine(event: SoftwareTeamActivityEvent): string {
  const when = new Date(event.at).toISOString();
  return `- ${when} · ${event.type}${event.itemId ? ` · ${event.itemId}` : ""}`;
}

/** Project markdown — English identifiers, not UI copy. */
export function composeSoftwareTeamDeliveryMarkdown(
  detail: SoftwareTeamDeliveryDetail,
  now = Date.now(),
): string {
  const lines = [
    `# ${detail.title || "Delivery"}`,
    "",
    `Exported: ${new Date(now).toISOString()}`,
  ];
  if (detail.deliveryId) lines.push(`Delivery id: ${detail.deliveryId}`);
  lines.push(`Archived: ${detail.archived ? "yes" : "no"}`);
  if (detail.gitBranch.trim()) {
    lines.push(`Git branch label: ${detail.gitBranch.trim()}`);
  }
  lines.push("");
  lines.push("## Role history");
  lines.push(
    detail.roleHistory.length ? detail.roleHistory.join(" → ") : "(none)",
  );
  lines.push("");
  lines.push("## Items");
  if (!detail.items.length) {
    lines.push("(none)");
  } else {
    for (const item of detail.items) {
      lines.push(
        `- **${item.title || item.id}** · ${item.roleId} · ${item.stageId}`,
      );
      if (item.reviewNote.trim()) {
        lines.push(`  - Reviewer notes: ${item.reviewNote.trim()}`);
      }
      if (item.qaNote.trim()) {
        lines.push(`  - QA notes: ${item.qaNote.trim()}`);
      }
    }
  }
  lines.push("");
  lines.push("## Review / QA notes");
  if (!detail.reviewNotes.length && !detail.qaNotes.length) {
    lines.push("(none)");
  } else {
    for (const note of detail.reviewNotes) {
      lines.push(`- Reviewer: ${note.text}`);
    }
    for (const note of detail.qaNotes) {
      lines.push(`- QA: ${note.text}`);
    }
  }
  lines.push("");
  lines.push("## Recent activity");
  const recent = [...detail.activity].slice(-20);
  if (!recent.length) {
    lines.push("(none)");
  } else {
    for (const event of recent) lines.push(activityLine(event));
  }
  lines.push("");
  return lines.join("\n");
}

export async function exportSoftwareTeamDeliverySummary(input: {
  projectPath?: string | null;
  detail: SoftwareTeamDeliveryDetail;
  host?: SoftwareTeamExportHost;
  now?: number;
}): Promise<SoftwareTeamExportResult> {
  const relative = softwareTeamDeliveryExportRelative(
    input.detail.title,
    input.detail.deliveryId || input.detail.focusItem?.id || "delivery",
  );
  const host = input.host ?? defaultSoftwareTeamExportHost();
  const plan = planSoftwareTeamDeliveryExport({
    projectPath: input.projectPath,
    relative,
    host,
  });
  if (!plan.allowed) {
    return {
      ok: false,
      reason: plan.reason as Exclude<SoftwareTeamExportReason, "ok_project">,
      relative: plan.relative,
    };
  }
  const markdown = composeSoftwareTeamDeliveryMarkdown(
    input.detail,
    input.now ?? Date.now(),
  );
  try {
    await host.writeFile(plan.projectPath, plan.relative, markdown);
    return { ok: true, reason: "ok_project", relative: plan.relative };
  } catch (err) {
    const error =
      err instanceof Error && err.message.trim()
        ? err.message.trim()
        : String(err ?? "export failed");
    return { ok: false, reason: "host_error", error, relative: plan.relative };
  }
}
