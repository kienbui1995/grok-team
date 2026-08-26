/**
 * Software Works studio actions — install pack + open/handoff into composer.
 * Lives outside AppWorkbench (growth freeze).
 */

import { useCallback, useEffect, useState } from "react";
import type { MessageKey } from "@/i18n";
import * as api from "@/lib/api";
import {
  defaultSoftwareTeamLaunchHost,
  installSoftwareTeamDlcPack,
  launchSoftwareTeamWorkItem,
  pickSoftwareTeamInstallTarget,
  probeSoftwareTeamDlcPack,
  repairSoftwareTeamDlcPack,
  requestSoftwareTeamChatPane,
  resolveSoftwareTeamWorkspace,
  softwareTeamInstallFailMessageKey,
  softwareTeamLaunchItemPatch,
  pickSoftwareTeamAttachSessions,
  softwareTeamAttachRefs,
  softwareTeamPackStatusMessageKey,
  type SoftwareTeamDlcInstallTarget,
  type SoftwareTeamLaunchResult,
  type SoftwareTeamPackInstallResult,
  type SoftwareTeamPackStatus,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamStarterFields,
} from "@/lib/softwareTeamDlc";
import { normalizeSessionDataMode } from "@/lib/sessionDataMode";

export type SoftwareTeamStudioWorkspace = {
  projectId: string | null;
  projectPath: string | null;
};

export function useSoftwareTeamStudioActions(input: {
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  currentSessionId?: string | null;
  workspace: SoftwareTeamStudioWorkspace;
  bindSession: (itemId: string, sessionId: string) => void;
  /** Write Host-returned plan/goal entity ids onto the pipeline item. */
  patchItem?: (
    itemId: string,
    patch: { planRef?: string; goalRef?: string },
  ) => void;
  pipelineItems?: readonly SoftwareTeamPipelineItem[];
  onSelectSession?: (sessionId: string) => void;
}): {
  sessionDataMode: string;
  installTarget: SoftwareTeamDlcInstallTarget;
  setInstallTarget: (target: SoftwareTeamDlcInstallTarget) => void;
  installing: boolean;
  repairing: boolean;
  probing: boolean;
  packStatus: SoftwareTeamPackStatus | null;
  refreshPackStatus: () => Promise<SoftwareTeamPackStatus>;
  launching: boolean;
  installPack: () => Promise<SoftwareTeamPackInstallResult>;
  repairPack: () => Promise<SoftwareTeamPackInstallResult>;
  describePackStatus: (status: SoftwareTeamPackStatus) => string;
  launchItem: (
    item: SoftwareTeamStarterFields & {
      id?: string;
      sessionId?: string | null;
      deliveryId?: string | null;
    },
    opts?: { starter?: string | null; createIfMissing?: boolean },
  ) => Promise<SoftwareTeamLaunchResult>;
  applyLaunchNav: (result: SoftwareTeamLaunchResult) => void;
  describeLaunch: (result: SoftwareTeamLaunchResult) => string;
  describeInstall: (result: SoftwareTeamPackInstallResult) => string;
} {
  const {
    t,
    currentSessionId,
    workspace,
    bindSession,
    patchItem,
    pipelineItems,
    onSelectSession,
  } = input;
  const [sessionDataMode, setSessionDataMode] = useState("shared");
  const [installTarget, setInstallTarget] =
    useState<SoftwareTeamDlcInstallTarget>(() =>
      pickSoftwareTeamInstallTarget({ projectPath: workspace.projectPath }),
    );
  const [installing, setInstalling] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [probing, setProbing] = useState(false);
  const [packStatus, setPackStatus] = useState<SoftwareTeamPackStatus | null>(
    null,
  );
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!api.isDesktopHost() && !api.hasHost()) return;
      try {
        const snap = await api.agentConfigTomlRead();
        if (!cancelled && snap?.mode) {
          setSessionDataMode(normalizeSessionDataMode(snap.mode));
        }
      } catch {
        /* browser preview / no Host */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshPackStatus = useCallback(async () => {
    setProbing(true);
    try {
      const status = await probeSoftwareTeamDlcPack({
        sessionDataMode,
        target: installTarget,
        projectPath: workspace.projectPath,
      });
      setPackStatus(status);
      return status;
    } finally {
      setProbing(false);
    }
  }, [installTarget, sessionDataMode, workspace.projectPath]);

  useEffect(() => {
    void refreshPackStatus();
  }, [refreshPackStatus]);

  const describePackStatus = useCallback(
    (status: SoftwareTeamPackStatus): string => {
      const key = softwareTeamPackStatusMessageKey(status.kind);
      if (status.kind === "installed") {
        const total = status.present.length + status.missing.length;
        return t(key, { n: status.present.length, total });
      }
      if (status.kind === "missing") {
        return t(key, { n: status.missing.length });
      }
      if (status.kind === "host_error") {
        return t(key, { error: status.error ?? "" });
      }
      return t(key);
    },
    [t],
  );

  const describeInstall = useCallback(
    (result: SoftwareTeamPackInstallResult): string => {
      if (result.ok) {
        const targetLabel = t(
          result.target === "project"
            ? "softwareTeamDlc.install.targetProject"
            : "softwareTeamDlc.install.targetUser",
        );
        return t("softwareTeamDlc.install.ok", {
          n: result.files.length,
          target: targetLabel,
        });
      }
      const key = softwareTeamInstallFailMessageKey(result.reason);
      if (result.reason === "host_error") {
        return t(key, { error: result.error ?? "" });
      }
      return t(key);
    },
    [t],
  );

  const applyLaunchNav = useCallback(
    (result: SoftwareTeamLaunchResult) => {
      if (!result.ok) return;
      if (result.nav === "open_session") {
        onSelectSession?.(result.sessionId);
        return;
      }
      requestSoftwareTeamChatPane();
    },
    [onSelectSession],
  );

  const describeLaunch = useCallback(
    (result: SoftwareTeamLaunchResult): string => {
      if (!result.ok) {
        switch (result.reason) {
          case "need_host":
            return t("softwareTeamDlc.needHostCreate");
          case "create_failed":
            return t("softwareTeamDlc.createFailed", {
              error: result.error ?? "",
            });
          case "need_session":
            return t("softwareTeamDlc.unbound");
          default: {
            const _never: never = result.reason;
            return _never;
          }
        }
      }
      const parts = [t("softwareTeamDlc.starterLoaded")];
      if (result.planChrome === "set") {
        parts.push(t("softwareTeamDlc.planChromeSet"));
      } else if (
        (result.planChrome === "skipped" || result.planChrome === "failed") &&
        result.planRef
      ) {
        parts.push(t("softwareTeamDlc.planChromeSkipped"));
      }
      if (result.goalMode === "set") {
        parts.push(t("softwareTeamDlc.goalModeSet"));
      } else if (result.goalRef) {
        parts.push(t("softwareTeamDlc.goalModeSkipped"));
      }
      if (result.attachCount > 0) {
        parts.push(t("softwareTeamDlc.attachSeeded", { n: result.attachCount }));
      }
      return parts.join(" ");
    },
    [t],
  );

  const launchItem = useCallback(
    async (
      item: SoftwareTeamStarterFields & {
        id?: string;
        sessionId?: string | null;
        deliveryId?: string | null;
      },
      opts?: { starter?: string | null; createIfMissing?: boolean },
    ) => {
      setLaunching(true);
      try {
        const sibling = item.id
          ? pickSoftwareTeamAttachSessions(pipelineItems ?? [], {
              id: item.id,
              sessionId: item.sessionId ?? "",
              deliveryId: item.deliveryId ?? "",
            })
          : [];
        const result = await launchSoftwareTeamWorkItem({
          item,
          currentSessionId,
          projectId: workspace.projectId,
          titleHint: item.title,
          starter: opts?.starter,
          createIfMissing: opts?.createIfMissing ?? true,
          chatAttachments: softwareTeamAttachRefs(sibling, item.sessionId),
          host: defaultSoftwareTeamLaunchHost(),
        });
        if (result.ok && item.id) {
          if (result.createdSession) {
            bindSession(item.id, result.sessionId);
          }
          const refs = softwareTeamLaunchItemPatch(result);
          if (refs) patchItem?.(item.id, refs);
        }
        return result;
      } finally {
        setLaunching(false);
      }
    },
    [
      bindSession,
      currentSessionId,
      patchItem,
      pipelineItems,
      workspace.projectId,
    ],
  );

  const installPack = useCallback(async () => {
    setInstalling(true);
    try {
      const result = await installSoftwareTeamDlcPack({
        sessionDataMode,
        target: installTarget,
        projectPath: workspace.projectPath,
      });
      await refreshPackStatus();
      return result;
    } finally {
      setInstalling(false);
    }
  }, [installTarget, refreshPackStatus, sessionDataMode, workspace.projectPath]);

  const repairPack = useCallback(async () => {
    setRepairing(true);
    try {
      const result = await repairSoftwareTeamDlcPack({
        sessionDataMode,
        target: installTarget,
        projectPath: workspace.projectPath,
        status: packStatus ?? undefined,
      });
      await refreshPackStatus();
      return result;
    } finally {
      setRepairing(false);
    }
  }, [
    installTarget,
    packStatus,
    refreshPackStatus,
    sessionDataMode,
    workspace.projectPath,
  ]);

  return {
    sessionDataMode,
    installTarget,
    setInstallTarget,
    installing,
    repairing,
    probing,
    packStatus,
    refreshPackStatus,
    launching,
    installPack,
    repairPack,
    describePackStatus,
    launchItem,
    applyLaunchNav,
    describeLaunch,
    describeInstall,
  };
}

export function studioWorkspaceFromInputs(input: {
  projects?: ReadonlyArray<{ id: string; path?: string | null }>;
  sessions?: ReadonlyArray<{ id: string; projectId?: string | null }>;
  currentSessionId?: string | null;
  generalWorkspacePath?: string | null;
}): SoftwareTeamStudioWorkspace {
  return resolveSoftwareTeamWorkspace(input);
}

export function itemToStarterFields(
  item: Pick<
    SoftwareTeamPipelineItem,
    | "roleId"
    | "title"
    | "planRef"
    | "goalRef"
    | "artifactRef"
    | "sessionId"
    | "id"
    | "deliveryId"
  >,
): SoftwareTeamStarterFields & {
  id: string;
  sessionId: string;
  deliveryId: string;
} {
  return {
    id: item.id,
    sessionId: item.sessionId,
    deliveryId: item.deliveryId,
    roleId: item.roleId,
    title: item.title,
    planRef: item.planRef,
    goalRef: item.goalRef,
    artifactRef: item.artifactRef,
  };
}

