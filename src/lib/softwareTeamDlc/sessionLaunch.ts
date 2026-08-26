/**
 * Software Works — open / bind a Grok Build session and seed the composer.
 *
 * Does not spawn a second CLI process. Uses existing session-create +
 * composer draft APIs. Same-session open must not call `openSession`
 * (stash would overwrite a just-saved starter).
 */

import * as api from "@/lib/api";
import { setDraft } from "@/lib/composerDraftStore";
import {
  saveComposerSessionDraft,
  type ComposerSessionDraftStorage,
} from "@/lib/composerSessionDraft";
import type { PlanChromeStored } from "@/lib/planSession";
import { softwareTeamRoleStarterPrompt } from "./pack";
import type { SoftwareTeamRoleId } from "./roles";
import { softwareTeamRoleChecklist } from "./shipGate";

export const SOFTWARE_TEAM_CHAT_HASH = "#/workbench";

export type SoftwareTeamComposerNav =
  | "apply_live"
  | "open_session"
  | "need_session";

export type SoftwareTeamLaunchFailReason =
  | "need_session"
  | "need_host"
  | "create_failed";

export type SoftwareTeamPlanChromeOutcome = "set" | "skipped" | "failed";

export type SoftwareTeamGoalModeOutcome = "set" | "skipped";

export type SoftwareTeamStarterFields = {
  roleId: SoftwareTeamRoleId;
  title?: string;
  planRef?: string;
  goalRef?: string;
  artifactRef?: string;
};

export type SoftwareTeamLaunchHost = {
  hasHost: () => boolean;
  sessionCreate: (
    projectId?: string,
    title?: string,
  ) => Promise<{ id: string }>;
  canWritePlanChrome: () => boolean;
  sessionPlanChromeSet: (
    sessionId: string,
    chrome: PlanChromeStored,
  ) => Promise<unknown>;
  /** Host goal-entity create. Omitted in production — no such Grok Build API. */
  createGoalEntity?: (
    sessionId: string,
    goalRef: string,
  ) => Promise<unknown>;
  setDraft?: (text: string) => void;
  saveDraft?: (
    sessionId: string,
    draft: { text: string; goalMode?: boolean },
    storage?: ComposerSessionDraftStorage,
  ) => void;
};

export type SoftwareTeamLaunchResult =
  | {
      ok: true;
      sessionId: string;
      createdSession: boolean;
      nav: Exclude<SoftwareTeamComposerNav, "need_session">;
      starter: string;
      planChrome: SoftwareTeamPlanChromeOutcome;
      goalMode: SoftwareTeamGoalModeOutcome;
      planRef: string;
      goalRef: string;
      /** Host plan entity id, only when `sessionPlanChromeSet` returned one. */
      hostPlanId: string | null;
      /** Host goal entity id, only when `createGoalEntity` returned one. */
      hostGoalId: string | null;
    }
  | {
      ok: false;
      reason: SoftwareTeamLaunchFailReason;
      error?: string;
    };

/** Agent-facing English starter (not UI copy). */
export function composeRoleSessionStarter(
  item: SoftwareTeamStarterFields,
): string {
  const lines = [softwareTeamRoleStarterPrompt(item.roleId)];
  const title = (item.title ?? "").trim();
  const planRef = (item.planRef ?? "").trim();
  const goalRef = (item.goalRef ?? "").trim();
  const artifactRef = (item.artifactRef ?? "").trim();
  if (title || planRef || goalRef || artifactRef) {
    lines.push("");
  }
  if (title) lines.push(`Slice: ${title}`);
  if (planRef) lines.push(`Plan: ${planRef}`);
  if (goalRef) lines.push(`Goal: ${goalRef}`);
  if (artifactRef) lines.push(`Artifact: ${artifactRef}`);
  const checklist = softwareTeamRoleChecklist(item.roleId);
  if (checklist.length) {
    lines.push("", ...checklist);
  }
  lines.push(
    "",
    "Stay on Grok Build. Do not spawn a second CLI runtime.",
  );
  return lines.join("\n");
}

export function decideSoftwareTeamComposerNav(input: {
  targetSessionId?: string | null;
  currentSessionId?: string | null;
}): SoftwareTeamComposerNav {
  const target = (input.targetSessionId ?? "").trim();
  if (!target) return "need_session";
  const current = (input.currentSessionId ?? "").trim();
  if (current && current === target) return "apply_live";
  return "open_session";
}

export function seedSoftwareTeamComposerDraft(input: {
  sessionId: string;
  text: string;
  goalMode?: boolean;
  applyLive?: boolean;
  setDraft?: (text: string) => void;
  saveDraft?: SoftwareTeamLaunchHost["saveDraft"];
  storage?: ComposerSessionDraftStorage;
}): void {
  const sessionId = input.sessionId.trim();
  const text = input.text;
  if (!sessionId) return;
  const save = input.saveDraft ?? saveComposerSessionDraft;
  save(sessionId, { text, goalMode: !!input.goalMode }, input.storage);
  if (input.applyLive) {
    const apply = input.setDraft ?? setDraft;
    apply(text);
  }
}

/** Hash that `resolveWorkbenchHash` maps to the chat pane. */
export function requestSoftwareTeamChatPane(): void {
  if (typeof window === "undefined") return;
  window.location.hash = SOFTWARE_TEAM_CHAT_HASH;
}

export function resolveSoftwareTeamWorkspace(input: {
  projects?: ReadonlyArray<{
    id: string;
    path?: string | null;
  }>;
  sessions?: ReadonlyArray<{
    id: string;
    projectId?: string | null;
  }>;
  currentSessionId?: string | null;
  generalWorkspacePath?: string | null;
}): { projectId: string | null; projectPath: string | null } {
  const projects = input.projects ?? [];
  const currentId = (input.currentSessionId ?? "").trim();
  const current = currentId
    ? (input.sessions ?? []).find((row) => row.id === currentId)
    : undefined;
  const bound = current?.projectId
    ? projects.find((p) => p.id === current.projectId)
    : undefined;
  if (bound && (bound.path ?? "").trim()) {
    return { projectId: bound.id, projectPath: bound.path!.trim() };
  }
  const firstWithPath = projects.find((p) => (p.path ?? "").trim());
  if (firstWithPath) {
    return {
      projectId: firstWithPath.id,
      projectPath: firstWithPath.path!.trim(),
    };
  }
  const gw = (input.generalWorkspacePath ?? "").trim();
  return {
    projectId: current?.projectId?.trim() || projects[0]?.id || null,
    projectPath: gw || null,
  };
}

export function defaultSoftwareTeamLaunchHost(): SoftwareTeamLaunchHost {
  return {
    hasHost: () => api.hasHost(),
    sessionCreate: async (projectId, title) => {
      const meta = (await api.sessionCreate(projectId, title)) as {
        id: string;
      };
      return { id: meta.id };
    },
    canWritePlanChrome: () => api.isTauri() || api.isMirrorClient(),
    sessionPlanChromeSet: (sessionId, chrome) =>
      api.sessionPlanChromeSet(sessionId, chrome),
    setDraft,
    saveDraft: saveComposerSessionDraft,
  };
}

/** Accept a Host-returned entity id only. Never invent one. */
export function hostEntityIdFromUnknown(raw: unknown): string | null {
  if (typeof raw === "string") {
    const id = raw.trim();
    return id ? id : null;
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const rec = raw as Record<string, unknown>;
  for (const key of ["id", "planId", "goalId"] as const) {
    const value = rec[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export type SoftwareTeamPlanChromeAttach = {
  outcome: SoftwareTeamPlanChromeOutcome;
  hostPlanId: string | null;
};

export async function attachSoftwareTeamPlanChrome(input: {
  host: Pick<SoftwareTeamLaunchHost, "canWritePlanChrome" | "sessionPlanChromeSet">;
  sessionId: string;
  planRef?: string | null;
  title?: string | null;
}): Promise<SoftwareTeamPlanChromeAttach> {
  const sessionId = input.sessionId.trim();
  const planRef = (input.planRef ?? "").trim();
  if (!sessionId || !planRef) return { outcome: "skipped", hostPlanId: null };
  if (!input.host.canWritePlanChrome()) {
    return { outcome: "skipped", hostPlanId: null };
  }
  try {
    const raw = await input.host.sessionPlanChromeSet(sessionId, {
      title: (input.title ?? "").trim() || "SDLC Studio",
      body: planRef,
      visible: true,
      userClosed: false,
    });
    return {
      outcome: "set",
      hostPlanId: hostEntityIdFromUnknown(raw),
    };
  } catch {
    return { outcome: "failed", hostPlanId: null };
  }
}

/** Patch pipeline plan/goal fields only when Host returned entity ids. */
export function softwareTeamLaunchItemPatch(
  result: SoftwareTeamLaunchResult,
): { planRef?: string; goalRef?: string } | null {
  if (!result.ok) return null;
  const patch: { planRef?: string; goalRef?: string } = {};
  if (result.hostPlanId) patch.planRef = result.hostPlanId;
  if (result.hostGoalId) patch.goalRef = result.hostGoalId;
  return Object.keys(patch).length ? patch : null;
}

export async function launchSoftwareTeamWorkItem(input: {
  item: SoftwareTeamStarterFields & { sessionId?: string | null };
  currentSessionId?: string | null;
  projectId?: string | null;
  titleHint?: string | null;
  starter?: string | null;
  createIfMissing?: boolean;
  host: SoftwareTeamLaunchHost;
  storage?: ComposerSessionDraftStorage;
}): Promise<SoftwareTeamLaunchResult> {
  let sessionId = (input.item.sessionId ?? "").trim();
  let createdSession = false;
  if (!sessionId && input.createIfMissing) {
    if (!input.host.hasHost()) {
      return { ok: false, reason: "need_host" };
    }
    try {
      const meta = await input.host.sessionCreate(
        input.projectId?.trim() || undefined,
        (input.titleHint ?? input.item.title ?? "").trim() || undefined,
      );
      sessionId = (meta.id ?? "").trim();
      createdSession = true;
    } catch (err) {
      return {
        ok: false,
        reason: "create_failed",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
  const nav = decideSoftwareTeamComposerNav({
    targetSessionId: sessionId,
    currentSessionId: input.currentSessionId,
  });
  if (nav === "need_session" || !sessionId) {
    return { ok: false, reason: "need_session" };
  }
  const starter =
    (input.starter ?? "").trim() || composeRoleSessionStarter(input.item);
  seedSoftwareTeamComposerDraft({
    sessionId,
    text: starter,
    goalMode: !!(input.item.goalRef ?? "").trim(),
    applyLive: nav === "apply_live",
    setDraft: input.host.setDraft,
    saveDraft: input.host.saveDraft,
    storage: input.storage,
  });
  const planRef = (input.item.planRef ?? "").trim();
  const goalRef = (input.item.goalRef ?? "").trim();
  const planAttach = await attachSoftwareTeamPlanChrome({
    host: input.host,
    sessionId,
    planRef,
    title: input.item.title,
  });
  let hostGoalId: string | null = null;
  if (goalRef && input.host.createGoalEntity) {
    try {
      hostGoalId = hostEntityIdFromUnknown(
        await input.host.createGoalEntity(sessionId, goalRef),
      );
    } catch {
      /* keep the card field — do not invent a goal id */
    }
  }
  return {
    ok: true,
    sessionId,
    createdSession,
    nav,
    starter,
    planChrome: planAttach.outcome,
    goalMode: goalRef ? "set" : "skipped",
    planRef,
    goalRef,
    hostPlanId: planAttach.hostPlanId,
    hostGoalId,
  };
}
