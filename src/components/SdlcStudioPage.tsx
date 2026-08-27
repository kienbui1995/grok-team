/**
 * Software Works — first-class SDLC Studio (roster + pipeline + handoff).
 * Mounted from the Agents / Kanban pane when the edition is on.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Locale, MessageKey } from "@/i18n";
import { createT } from "@/i18n";
import { ContextMenu, type ContextMenuItem } from "@/components/ContextMenu";
import { GlassModal } from "@/components/GlassModal";
import { SdlcDeliveryDetailPane } from "@/components/SdlcDeliveryDetailPane";
import { useSoftwareTeamPipeline } from "@/hooks/useSoftwareTeamDlc";
import {
  itemToStarterFields,
  studioWorkspaceFromInputs,
  useSoftwareTeamStudioActions,
} from "@/hooks/useSoftwareTeamStudioActions";
import type {
  AgentDashboardProjectInput,
  AgentDashboardSessionInput,
} from "@/lib/agentDashboard";
import {
  SOFTWARE_TEAM_DLC_INSTALL_TARGETS,
  SOFTWARE_TEAM_ROLES,
  SOFTWARE_TEAM_SDLC_STAGES,
  SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
  SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED,
  SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE,
  SOFTWARE_TEAM_PIPELINE_FILE_EVENT,
  SOFTWARE_TEAM_ROLE_FILTER_ALL,
  SOFTWARE_TEAM_STAGE_FILTER_ALL,
  applySoftwareTeamShipChoice,
  buildSoftwareTeamDeliveryDetail,
  decideSoftwareTeamDoneCta,
  ensureSoftwareTeamItemDeliveryId,
  exportSoftwareTeamDeliverySummary,
  filterSoftwareTeamStudioItems,
  isSoftwareTeamItemArchived,
  lastSoftwareTeamPipelineFileStatus,
  listSoftwareTeamDeliveryGroups,
  normalizeSoftwareTeamGitBranch,
  missingSoftwareTeamDeliveryRoles,
  nextSoftwareTeamRole,
  openSoftwareTeamSdlcDoc,
  pickSoftwareTeamAttachSessions,
  planSoftwareTeamDlcPackWrite,
  planSoftwareTeamWorkspaceBootstrap,
  probeSoftwareTeamSdlcDocs,
  resolveSoftwareTeamDeliveryId,
  softwareTeamBootstrapMessageKey,
  softwareTeamDeliveryItemDraft,
  softwareTeamDeliverySiblingDraft,
  softwareTeamExportMessageKey,
  softwareTeamPipelineFileMessageKey,
  softwareTeamRoleById,
  softwareTeamRoleHistoryIds,
  softwareTeamSdlcDocOpenMessageKey,
  softwareTeamRoleSlashHint,
  softwareTeamRoleStarterPrompt,
  softwareTeamShipBlockMessageKey,
  softwareTeamShipGate,
  writeSoftwareTeamWorkspaceBootstrap,
  type SoftwareTeamDeliveryDetailTarget,
  type SoftwareTeamDeliveryFilterId,
  type SoftwareTeamRoleFilterId,
  type SoftwareTeamStageFilterId,
  type SoftwareTeamPipelineFileRead,
  type SoftwareTeamPipelineFileWrite,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamRoleId,
  type SoftwareTeamSdlcDocProbe,
  type SoftwareTeamSdlcStageId,
} from "@/lib/softwareTeamDlc";

type TFn = (key: MessageKey, vars?: Record<string, string | number>) => string;

type ItemDraft = {
  id?: string;
  title: string;
  roleId: SoftwareTeamRoleId;
  stageId: SoftwareTeamSdlcStageId;
  sessionId: string;
  planRef: string;
  goalRef: string;
  artifactRef: string;
  gitBranch: string;
};

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

function emptyDraft(roleId: SoftwareTeamRoleId = "product"): ItemDraft {
  const role = softwareTeamRoleById(roleId);
  return {
    title: "",
    roleId,
    stageId: role?.defaultStage ?? "backlog",
    sessionId: "",
    planRef: "",
    goalRef: "",
    artifactRef: "",
    gitBranch: "",
  };
}

function draftFromItem(item: SoftwareTeamPipelineItem): ItemDraft {
  return {
    id: item.id,
    title: item.title,
    roleId: item.roleId,
    stageId: item.stageId,
    sessionId: item.sessionId,
    planRef: item.planRef,
    goalRef: item.goalRef,
    artifactRef: item.artifactRef,
    gitBranch: item.gitBranch,
  };
}

function stageToneClass(stage: SoftwareTeamSdlcStageId): string {
  switch (stage) {
    case "backlog":
      return "agent-kanban__col--idle";
    case "design":
    case "review":
      return "agent-kanban__col--needs";
    case "build":
      return "agent-kanban__col--working";
    case "ship":
      return "agent-kanban__col--done";
    default: {
      const _never: never = stage;
      return _never;
    }
  }
}

export type SdlcStudioPageProps = {
  locale: Locale;
  sessions: AgentDashboardSessionInput[];
  projects?: AgentDashboardProjectInput[];
  currentSessionId?: string | null;
  untitledLabel?: string;
  generalWorkspacePath?: string | null;
  onSelectSession?: (sessionId: string) => void;
  onShowLive?: () => void;
};

export function SdlcStudioPage({
  locale,
  sessions,
  projects,
  currentSessionId,
  untitledLabel,
  generalWorkspacePath,
  onSelectSession,
  onShowLive,
}: SdlcStudioPageProps) {
  const tr = useMemo(() => createT(locale), [locale]);
  const t: TFn = (k, vars) => tr(k, vars);
  const pipeline = useSoftwareTeamPipeline();
  const workspace = useMemo(
    () =>
      studioWorkspaceFromInputs({
        projects,
        sessions,
        currentSessionId,
        generalWorkspacePath,
      }),
    [projects, sessions, currentSessionId, generalWorkspacePath],
  );
  const actions = useSoftwareTeamStudioActions({
    t,
    currentSessionId,
    workspace,
    bindSession: pipeline.bindSession,
    patchItem: (itemId, patch) => pipeline.updateItem(itemId, patch),
    pipelineItems: pipeline.items,
    onSelectSession,
  });
  const [query, setQuery] = useState("");
  const [deliveryFilter, setDeliveryFilter] =
    useState<SoftwareTeamDeliveryFilterId>(SOFTWARE_TEAM_DELIVERY_FILTER_ALL);
  const [showArchived, setShowArchived] = useState(false);
  const [stageFilter, setStageFilter] =
    useState<SoftwareTeamStageFilterId>(SOFTWARE_TEAM_STAGE_FILTER_ALL);
  const [roleFilter, setRoleFilter] =
    useState<SoftwareTeamRoleFilterId>(SOFTWARE_TEAM_ROLE_FILTER_ALL);
  const [detailTarget, setDetailTarget] =
    useState<SoftwareTeamDeliveryDetailTarget | null>(null);
  const [sdlcDocs, setSdlcDocs] = useState<SoftwareTeamSdlcDocProbe[]>([]);
  const [fileStatus, setFileStatus] = useState<
    SoftwareTeamPipelineFileRead | SoftwareTeamPipelineFileWrite | null
  >(lastSoftwareTeamPipelineFileStatus);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [editor, setEditor] = useState<ItemDraft | null>(null);
  const [wizard, setWizard] = useState<{
    title: string;
    roleId: SoftwareTeamRoleId;
    bootstrap: boolean;
  } | null>(null);
  const [notesEditor, setNotesEditor] = useState<{
    itemId: string;
    kind: "review" | "qa";
    text: string;
  } | null>(null);
  const [pendingRemove, setPendingRemove] = useState<SoftwareTeamPipelineItem | null>(
    null,
  );
  const [menu, setMenu] = useState<{
    itemId: string;
    x: number;
    y: number;
  } | null>(null);
  const emptyWizardOffered = useRef(false);

  useEffect(() => {
    let timer: number | null = null;
    const run = () => {
      void pipeline.reloadFromProject(workspace.projectPath).then((result) => {
        if (result.ok && result.kind === "replaced") {
          setStatus(t("softwareTeamDlc.pipelineFileReloaded"));
        } else if (!result.ok && result.kind === "conflict") {
          setStatus(
            t("softwareTeamDlc.pipelineFileConflict", {
              file: SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE,
            }),
          );
        }
      });
    };
    const schedule = () => {
      if (timer != null) window.clearTimeout(timer);
      timer = window.setTimeout(run, 250);
    };
    schedule();
    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
    };
    window.addEventListener("focus", schedule);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (timer != null) window.clearTimeout(timer);
      window.removeEventListener("focus", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pipeline.reloadFromProject, t, workspace.projectPath]);

  useEffect(() => {
    if (emptyWizardOffered.current) return;
    if (pipeline.items.length > 0) {
      emptyWizardOffered.current = true;
      return;
    }
    emptyWizardOffered.current = true;
    setWizard({ title: "", roleId: "product", bootstrap: false });
  }, [pipeline.items.length]);

  useEffect(() => {
    const sync = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as
        | SoftwareTeamPipelineFileRead
        | SoftwareTeamPipelineFileWrite
        | undefined;
      setFileStatus(detail ?? lastSoftwareTeamPipelineFileStatus());
    };
    window.addEventListener(SOFTWARE_TEAM_PIPELINE_FILE_EVENT, sync);
    return () => window.removeEventListener(SOFTWARE_TEAM_PIPELINE_FILE_EVENT, sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void probeSoftwareTeamSdlcDocs({ projectPath: workspace.projectPath }).then(
      (rows) => {
        if (!cancelled) setSdlcDocs(rows);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [workspace.projectPath, pipeline.items.length]);

  const sessionTitle = useCallback(
    (sessionId: string) => {
      const row = sessions.find((s) => s.id === sessionId);
      const title = (row?.title ?? "").trim();
      if (title) return title;
      return untitledLabel || sessionId.slice(0, 8);
    },
    [sessions, untitledLabel],
  );

  const displayTitle = useCallback(
    (item: SoftwareTeamPipelineItem) => {
      if (item.title.trim()) return item.title.trim();
      if (item.sessionId) return sessionTitle(item.sessionId);
      return t(softwareTeamRoleById(item.roleId)?.titleKey ?? "softwareTeamDlc.rosterTitle");
    },
    [sessionTitle, t],
  );

  const openDetail = useCallback((item: SoftwareTeamPipelineItem) => {
    const deliveryId = item.deliveryId.trim();
    if (deliveryId) {
      setDeliveryFilter(deliveryId);
      setDetailTarget({
        kind: "delivery",
        deliveryId,
        focusItemId: item.id,
      });
      return;
    }
    setDetailTarget({ kind: "item", itemId: item.id });
  }, []);

  const deliveryDetail = useMemo(() => {
    if (!detailTarget) return null;
    return buildSoftwareTeamDeliveryDetail({
      items: pipeline.items,
      activity: pipeline.store.activity,
      archivedDeliveryIds: pipeline.store.archivedDeliveryIds,
      sessions,
      untitledLabel,
      target: detailTarget,
    });
  }, [
    detailTarget,
    pipeline.items,
    pipeline.store.activity,
    pipeline.store.archivedDeliveryIds,
    sessions,
    untitledLabel,
  ]);

  useEffect(() => {
    if (detailTarget && !deliveryDetail) setDetailTarget(null);
  }, [detailTarget, deliveryDetail]);

  const deliveryGroups = useMemo(() => {
    const groups = listSoftwareTeamDeliveryGroups(pipeline.items);
    if (showArchived) return groups;
    const archivedIds = pipeline.store.archivedDeliveryIds ?? [];
    return groups.filter((group) => !archivedIds.includes(group.id));
  }, [pipeline.items, pipeline.store.archivedDeliveryIds, showArchived]);
  const unscopedCount = useMemo(
    () =>
      pipeline.items.filter((item) => {
        if (item.deliveryId.trim()) return false;
        if (!showArchived && isSoftwareTeamItemArchived(item, [])) return false;
        return true;
      }).length,
    [pipeline.items, showArchived],
  );

  const filtered = useMemo(
    () =>
      filterSoftwareTeamStudioItems({
        items: pipeline.items,
        deliveryFilter,
        query,
        stageId: stageFilter,
        roleId: roleFilter,
        showArchived,
        archivedDeliveryIds: pipeline.store.archivedDeliveryIds,
        titleOf: displayTitle,
      }),
    [
      deliveryFilter,
      displayTitle,
      pipeline.items,
      pipeline.store.archivedDeliveryIds,
      query,
      roleFilter,
      showArchived,
      stageFilter,
    ],
  );

  const onOpenSdlcDoc = useCallback(
    async (relative: string) => {
      const result = await openSoftwareTeamSdlcDoc({
        projectPath: workspace.projectPath,
        relative,
        copyText,
      });
      if (result.ok) {
        setStatus(
          result.reason === "copied_path"
            ? t("softwareTeamDlc.openSdlcDocCopied")
            : t("softwareTeamDlc.openSdlcDocOpened"),
        );
        return;
      }
      setStatus(
        result.reason === "host_error"
          ? t(softwareTeamSdlcDocOpenMessageKey(result.reason), {
              error: result.error ?? "",
            })
          : t(softwareTeamSdlcDocOpenMessageKey(result.reason)),
      );
    },
    [t, workspace.projectPath],
  );

  const onExportDelivery = useCallback(
    async (detail: NonNullable<typeof deliveryDetail>) => {
      const result = await exportSoftwareTeamDeliverySummary({
        projectPath: workspace.projectPath,
        detail,
      });
      if (result.ok) {
        setStatus(
          t("softwareTeamDlc.exportOk", { file: result.relative }),
        );
        return;
      }
      setStatus(
        result.reason === "host_error"
          ? t(softwareTeamExportMessageKey(result.reason), {
              error: result.error ?? "",
            })
          : t(softwareTeamExportMessageKey(result.reason)),
      );
    },
    [t, workspace.projectPath],
  );

  const onToggleArchive = useCallback(
    (item: SoftwareTeamPipelineItem, archived: boolean) => {
      if (item.deliveryId.trim()) {
        pipeline.setDeliveryArchived(item.deliveryId, archived);
      } else {
        pipeline.setItemArchived(item.id, archived);
      }
      setStatus(
        archived
          ? t("softwareTeamDlc.archived")
          : t("softwareTeamDlc.unarchived"),
      );
    },
    [pipeline, t],
  );

  const onCopyStarter = useCallback(
    async (roleId: SoftwareTeamRoleId) => {
      const ok = await copyText(softwareTeamRoleStarterPrompt(roleId));
      setCopyError(!ok);
      setCopied(ok ? `role:${roleId}` : null);
      setStatus(ok ? t("softwareTeamDlc.copied") : t("softwareTeamDlc.copyFailed"));
    },
    [t],
  );

  const onCopyGitBranch = useCallback(
    async (branch: string) => {
      const label = branch.trim();
      if (!label) return;
      const ok = await copyText(label);
      setCopyError(!ok);
      setCopied(ok ? `branch:${label}` : null);
      setStatus(
        ok ? t("softwareTeamDlc.gitBranchCopied") : t("softwareTeamDlc.copyFailed"),
      );
    },
    [t],
  );

  const onSaveGitBranch = useCallback(
    (deliveryId: string, itemId: string, raw: string) => {
      const normalized = normalizeSoftwareTeamGitBranch(raw);
      if (normalized === null) {
        setStatus(t("softwareTeamDlc.gitBranchInvalid"));
        return false;
      }
      if (deliveryId.trim()) {
        pipeline.setDeliveryGitBranch(deliveryId, normalized);
      } else if (itemId) {
        pipeline.updateItem(itemId, { gitBranch: normalized });
      }
      setStatus(t("softwareTeamDlc.gitBranchSaved"));
      return true;
    },
    [pipeline, t],
  );

  const onUndo = useCallback(() => {
    if (!pipeline.undo()) {
      setStatus(t("softwareTeamDlc.undoEmpty"));
      return;
    }
    setStatus(t("softwareTeamDlc.undone"));
  }, [pipeline, t]);

  const onRedo = useCallback(() => {
    if (!pipeline.redo()) {
      setStatus(t("softwareTeamDlc.redoEmpty"));
      return;
    }
    setStatus(t("softwareTeamDlc.redone"));
  }, [pipeline, t]);

  const onDuplicateDelivery = useCallback(
    (deliveryId: string) => {
      const id = pipeline.duplicateDelivery(
        deliveryId,
        t("softwareTeamDlc.duplicateSuffix"),
      );
      if (!id) {
        setStatus(t("softwareTeamDlc.duplicateFailed"));
        return;
      }
      setStatus(t("softwareTeamDlc.duplicated"));
      setDetailTarget({ kind: "delivery", deliveryId: id });
    },
    [pipeline, t],
  );

  const onHandoff = useCallback(
    async (itemId: string) => {
      const result = pipeline.handoff(itemId);
      if (!result) return;
      if (result.kind === "done") {
        setStatus(t("softwareTeamDlc.handoffDone"));
        return;
      }
      const launched = await actions.launchItem(
        {
          ...itemToStarterFields(result.item),
          sessionId: result.item.sessionId,
        },
        { starter: result.starter, createIfMissing: true },
      );
      if (launched.ok) {
        setCopyError(false);
        setStatus(t("softwareTeamDlc.handoffLoaded"));
        actions.applyLaunchNav(launched);
        return;
      }
      const ok = await copyText(result.starter);
      setCopyError(!ok);
      setCopied(ok ? `handoff:${itemId}` : null);
      setStatus(
        launched.ok === false
          ? `${actions.describeLaunch(launched)} ${
              ok ? t("softwareTeamDlc.handoffCopied") : t("softwareTeamDlc.copyFailed")
            }`
          : t("softwareTeamDlc.copyFailed"),
      );
    },
    [actions, pipeline, t],
  );

  const onOpenInComposer = useCallback(
    async (
      item: SoftwareTeamPipelineItem,
      createIfMissing = true,
    ) => {
      const launched = await actions.launchItem(itemToStarterFields(item), {
        createIfMissing,
      });
      setStatus(actions.describeLaunch(launched));
      if (launched.ok) actions.applyLaunchNav(launched);
    },
    [actions],
  );

  const onShipChoice = useCallback(
    async (item: SoftwareTeamPipelineItem) => {
      const choice = applySoftwareTeamShipChoice(item);
      if (!choice.ok) {
        setStatus(t("softwareTeamDlc.shipLocked"));
        return;
      }
      pipeline.updateItem(item.id, {
        roleId: choice.item.roleId,
        stageId: choice.item.stageId,
        roleHistory: choice.item.roleHistory,
        sessionDonePending: false,
        stageSource: "board",
      });
      const launched = await actions.launchItem(
        {
          ...itemToStarterFields({ ...item, ...choice.item }),
          roleId: "writer",
        },
        { starter: choice.starter, createIfMissing: true },
      );
      setStatus(actions.describeLaunch(launched));
      if (launched.ok) actions.applyLaunchNav(launched);
    },
    [actions, pipeline, t],
  );

  const onStartDelivery = useCallback(async () => {
    if (!wizard) return;
    const title = wizard.title.trim();
    if (!title) {
      setStatus(t("softwareTeamDlc.startDeliveryNeedTitle"));
      return;
    }
    let planRef = "";
    let artifactRef = "";
    if (wizard.bootstrap) {
      const boot = await writeSoftwareTeamWorkspaceBootstrap({
        projectPath: workspace.projectPath,
        title,
        bootstrap: true,
      });
      if (!boot.ok) {
        setStatus(
          boot.reason === "host_error"
            ? t(softwareTeamBootstrapMessageKey(boot.reason), {
                error: boot.error ?? "",
              })
            : t(softwareTeamBootstrapMessageKey(boot.reason)),
        );
        return;
      }
      const created = boot.files.filter((file) => file.action === "created");
      planRef = "docs/sdlc/spec.md";
      artifactRef = "docs/sdlc";
      if (created.length) {
        setStatus(
          t("softwareTeamDlc.startDeliveryBootstrapped", {
            n: created.length,
          }),
        );
      }
    }
    const draft = softwareTeamDeliveryItemDraft({
      title,
      roleId: wizard.roleId,
      sessionId: "",
      planRef,
      artifactRef,
    });
    const created = pipeline.addItem(draft);
    setWizard(null);
    if (!created) return;
    const launched = await actions.launchItem(itemToStarterFields(created), {
      createIfMissing: true,
    });
    setStatus(
      `${t("softwareTeamDlc.startDeliveryStarted")} ${actions.describeLaunch(launched)}`,
    );
    if (launched.ok) actions.applyLaunchNav(launched);
  }, [
    actions,
    pipeline,
    t,
    wizard,
    workspace.projectPath,
  ]);

  const onAddTeammate = useCallback(
    async (source: SoftwareTeamPipelineItem, roleId: SoftwareTeamRoleId) => {
      const ensured = ensureSoftwareTeamItemDeliveryId(source);
      if (ensured.patched) {
        pipeline.updateItem(source.id, { deliveryId: ensured.deliveryId });
      }
      const created = pipeline.addItem(
        softwareTeamDeliverySiblingDraft({
          source,
          roleId,
          deliveryId: ensured.deliveryId,
        }),
      );
      if (!created) return;
      const attachItems = [
        ...pipeline.items.map((item) =>
          item.id === source.id
            ? { ...item, deliveryId: ensured.deliveryId }
            : item,
        ),
        created,
      ];
      const launched = await actions.launchItem(itemToStarterFields(created), {
        createIfMissing: true,
        items: attachItems,
      });
      setStatus(actions.describeLaunch(launched));
      if (launched.ok) actions.applyLaunchNav(launched);
    },
    [actions, pipeline],
  );

  const openCreate = (roleId?: SoftwareTeamRoleId) => {
    setEditor(emptyDraft(roleId ?? "product"));
  };

  const persistEditor = () => {
    if (!editor) return null;
    const gitBranch = normalizeSoftwareTeamGitBranch(editor.gitBranch);
    if (gitBranch === null) {
      setStatus(t("softwareTeamDlc.gitBranchInvalid"));
      return null;
    }
    if (editor.id) {
      pipeline.updateItem(editor.id, {
        title: editor.title,
        roleId: editor.roleId,
        stageId: editor.stageId,
        sessionId: editor.sessionId,
        planRef: editor.planRef,
        goalRef: editor.goalRef,
        artifactRef: editor.artifactRef,
        gitBranch,
        stageSource: "board",
      });
      return editor.id;
    }
    const created = pipeline.addItem({
      title: editor.title,
      roleId: editor.roleId,
      stageId: editor.stageId,
      sessionId: editor.sessionId,
      planRef: editor.planRef,
      goalRef: editor.goalRef,
      artifactRef: editor.artifactRef,
      gitBranch,
      deliveryId: resolveSoftwareTeamDeliveryId(pipeline.items),
      stageSource: "board",
    });
    return created?.id ?? null;
  };

  const saveEditor = () => {
    if (!persistEditor()) return;
    setEditor(null);
  };

  const saveAndOpenEditor = async () => {
    if (!editor) return;
    const id = persistEditor();
    if (!id) return;
    const draft = { ...editor, id };
    setEditor(null);
    const launched = await actions.launchItem(
      {
        id: draft.id,
        sessionId: draft.sessionId,
        roleId: draft.roleId,
        title: draft.title,
        planRef: draft.planRef,
        goalRef: draft.goalRef,
        artifactRef: draft.artifactRef,
      },
      { createIfMissing: true },
    );
    setStatus(actions.describeLaunch(launched));
    if (launched.ok) actions.applyLaunchNav(launched);
  };

  const menuItem = menu ? pipeline.items.find((i) => i.id === menu.itemId) : null;
  const menuItems: ContextMenuItem[] = useMemo(() => {
    if (!menu || !menuItem) return [];
    const nextRole = nextSoftwareTeamRole(menuItem.roleId);
    const items: ContextMenuItem[] = [
      {
        label: t("softwareTeamDlc.assignStage"),
        children: SOFTWARE_TEAM_SDLC_STAGES.map((stage) => {
          const shipBlocked =
            stage.id === "ship" && !softwareTeamShipGate(menuItem).ok;
          return {
            id: `stage-${stage.id}`,
            label: t("softwareTeamDlc.moveStage", { stage: t(stage.titleKey) }),
            disabled: shipBlocked,
            onClick: () => {
              if (shipBlocked) {
                setStatus(t("softwareTeamDlc.shipLocked"));
                return;
              }
              pipeline.setStage(menuItem.id, stage.id);
            },
          };
        }),
      },
      {
        label: t("softwareTeamDlc.assignRole"),
        children: SOFTWARE_TEAM_ROLES.map((role) => ({
          id: `role-${role.id}`,
          label: t(role.titleKey),
          onClick: () => pipeline.setRole(menuItem.id, role.id),
        })),
      },
    ];
    if (nextRole) {
      const roleTitle = t(softwareTeamRoleById(nextRole)?.titleKey ?? "softwareTeamDlc.handoff");
      items.push({
        label: t("softwareTeamDlc.handoffTo", { role: roleTitle }),
        onClick: () => void onHandoff(menuItem.id),
      });
    } else {
      items.push({
        label: t("softwareTeamDlc.noNextRole"),
        disabled: true,
      });
    }
    items.push({
      label: t("softwareTeamDlc.markReviewNote"),
      onClick: () =>
        setNotesEditor({
          itemId: menuItem.id,
          kind: "review",
          text: menuItem.reviewNote,
        }),
    });
    items.push({
      label: t("softwareTeamDlc.markQaNote"),
      onClick: () =>
        setNotesEditor({
          itemId: menuItem.id,
          kind: "qa",
          text: menuItem.qaNote,
        }),
    });
    const archived = isSoftwareTeamItemArchived(
      menuItem,
      pipeline.store.archivedDeliveryIds,
    );
    items.push({
      label: archived
        ? t("softwareTeamDlc.unarchiveDelivery")
        : t("softwareTeamDlc.archiveDelivery"),
      onClick: () => onToggleArchive(menuItem, !archived),
    });
    items.push({
      label: t("softwareTeamDlc.openDelivery"),
      onClick: () => openDetail(menuItem),
    });
    items.push({
      label: t("softwareTeamDlc.openInComposer"),
      onClick: () => void onOpenInComposer(menuItem),
    });
    const presentDocs = sdlcDocs.filter((row) => row.exists);
    if (presentDocs.length) {
      items.push({
        label: t("softwareTeamDlc.openSdlcDocs"),
        children: presentDocs.map((row) => ({
          id: `sdlc-doc-${row.relative}`,
          label: t("softwareTeamDlc.openSdlcDoc", {
            file: row.relative.split("/").pop() ?? row.relative,
          }),
          onClick: () => void onOpenSdlcDoc(row.relative),
        })),
      });
    }
    const teammateRoles = missingSoftwareTeamDeliveryRoles(
      pipeline.items,
      menuItem.deliveryId,
    );
    if (teammateRoles.length) {
      items.push({
        label: t("softwareTeamDlc.addTeammateGroup"),
        children: teammateRoles.map((roleId) => ({
          id: `teammate-${roleId}`,
          label: t("softwareTeamDlc.addTeammate", {
            role: t(
              softwareTeamRoleById(roleId)?.titleKey ?? "softwareTeamDlc.rosterTitle",
            ),
          }),
          onClick: () => void onAddTeammate(menuItem, roleId),
        })),
      });
    }
    if (menuItem.sessionId) {
      items.push({
        label: t("dashboard.openSession"),
        onClick: () => onSelectSession?.(menuItem.sessionId),
      });
    }
    items.push({ separator: true });
    items.push({
      label: t("softwareTeamDlc.editItem"),
      onClick: () => setEditor(draftFromItem(menuItem)),
    });
    if (menuItem.deliveryId) {
      items.push({
        label: t("softwareTeamDlc.duplicateDelivery"),
        onClick: () => onDuplicateDelivery(menuItem.deliveryId),
      });
    }
    if (menuItem.gitBranch) {
      items.push({
        label: t("softwareTeamDlc.gitBranchCopy"),
        onClick: () => void onCopyGitBranch(menuItem.gitBranch),
      });
    }
    items.push({
      label: t("softwareTeamDlc.removeItem"),
      danger: true,
      onClick: () => setPendingRemove(menuItem),
    });
    return items;
  }, [
    menu,
    menuItem,
    onAddTeammate,
    onCopyGitBranch,
    onDuplicateDelivery,
    onHandoff,
    onOpenInComposer,
    onToggleArchive,
    openDetail,
    onOpenSdlcDoc,
    onSelectSession,
    sdlcDocs,
    pipeline,
    t,
  ]);

  return (
    <div
      className="auto-page agent-kanban-page sdlc-studio"
      data-testid="sdlc-studio"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (!(event.ctrlKey || event.metaKey)) return;
        const target = event.target as HTMLElement | null;
        if (target?.closest("input, textarea, [contenteditable='true']")) return;
        const redoKey =
          (event.key === "z" && event.shiftKey) || event.key === "y";
        const undoKey = event.key === "z" && !event.shiftKey;
        if (redoKey) {
          event.preventDefault();
          onRedo();
          return;
        }
        if (undoKey) {
          event.preventDefault();
          onUndo();
        }
      }}
    >
      <div className="auto-page__head agent-kanban-page__head">
        <div className="auto-page__titles">
          <h1 className="auto-page__title">{t("softwareTeamDlc.studioTitle")}</h1>
          <p className="auto-page__subtitle">{t("softwareTeamDlc.studioHint")}</p>
        </div>
        <div className="agent-kanban__views" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected
            className="agent-kanban__view-tab is-active"
          >
            {t("softwareTeamDlc.pipelineTitle")}
          </button>
          {onShowLive ? (
            <button
              type="button"
              role="tab"
              aria-selected={false}
              className="agent-kanban__view-tab"
              onClick={onShowLive}
            >
              {t("softwareTeamDlc.liveAgents")}
            </button>
          ) : null}
        </div>
      </div>

      <div className="agent-kanban-page__body">
        <div className="sdlc-studio__roster" role="list">
          {SOFTWARE_TEAM_ROLES.map((role) => {
            const bound = pipeline.items
              .filter((item) => item.roleId === role.id)
              .sort((a, b) => b.updatedAt - a.updatedAt)[0];
            const nextRole = nextSoftwareTeamRole(role.id);
            return (
              <div key={role.id} className="sdlc-studio__role" role="listitem">
                <div className="sdlc-studio__role-head">
                  <strong>{t(role.titleKey)}</strong>
                  <span className="software-team-dlc__slash">
                    {t("softwareTeamDlc.slashHint", {
                      slash: softwareTeamRoleSlashHint(role),
                    })}
                  </span>
                </div>
                <p className="sdlc-studio__role-meta">
                  {bound
                    ? t("softwareTeamDlc.roleOnStage", {
                        role: displayTitle(bound),
                        stage: t(
                          SOFTWARE_TEAM_SDLC_STAGES.find((s) => s.id === bound.stageId)
                            ?.titleKey ?? "softwareTeamDlc.sdlcTitle",
                        ),
                      })
                    : t("softwareTeamDlc.unbound")}
                </p>
                <div className="sdlc-studio__role-actions">
                  {bound ? (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => void onOpenInComposer(bound)}
                    >
                      {t("softwareTeamDlc.openInComposer")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => {
                        const created = pipeline.addItem({
                          roleId: role.id,
                          sessionId: "",
                          deliveryId: resolveSoftwareTeamDeliveryId(pipeline.items),
                          stageSource: "board",
                        });
                        if (created) void onOpenInComposer(created);
                      }}
                    >
                      {t("softwareTeamDlc.createAndOpen")}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => void onCopyStarter(role.id)}
                  >
                    {copied === `role:${role.id}`
                      ? t("softwareTeamDlc.copied")
                      : t("softwareTeamDlc.copyStarter")}
                  </button>
                  {bound && nextRole ? (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => void onHandoff(bound.id)}
                    >
                      {t("softwareTeamDlc.handoff")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => openCreate(role.id)}
                  >
                    {t("softwareTeamDlc.addItem")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="agent-kanban__toolbar sdlc-studio__toolbar">
          <input
            type="search"
            className="settings-input agent-kanban__search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("softwareTeamDlc.searchTitle")}
            autoComplete="off"
            spellCheck={false}
            aria-label={t("softwareTeamDlc.searchTitle")}
          />
          <div
            className="sdlc-studio__chips"
            role="group"
            aria-label={t("softwareTeamDlc.install.chooseTarget")}
          >
            {SOFTWARE_TEAM_DLC_INSTALL_TARGETS.map((target) => (
              <button
                key={target}
                type="button"
                className={
                  "task-board__chip" +
                  (actions.installTarget === target ? " is-active" : "")
                }
                onClick={() => actions.setInstallTarget(target)}
              >
                {t(
                  target === "project"
                    ? "softwareTeamDlc.install.targetProject"
                    : "softwareTeamDlc.install.targetUser",
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={actions.installing}
            onClick={() => {
              void actions.installPack().then((result) => {
                setStatus(actions.describeInstall(result));
              });
            }}
          >
            {actions.installing
              ? t("softwareTeamDlc.install.installing")
              : t("softwareTeamDlc.install.action")}
          </button>
          {actions.packStatus?.kind === "missing" ? (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={actions.repairing}
              onClick={() => {
                void actions.repairPack().then((result) => {
                  setStatus(
                    result.ok && result.files.length === 0
                      ? t("softwareTeamDlc.install.repairNone")
                      : result.ok
                        ? t("softwareTeamDlc.install.repaired", {
                            n: result.files.length,
                          })
                        : actions.describeInstall(result),
                  );
                });
              }}
            >
              {actions.repairing
                ? t("softwareTeamDlc.install.repairing")
                : t("softwareTeamDlc.install.repair")}
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={!pipeline.canUndo}
            onClick={onUndo}
          >
            {t("softwareTeamDlc.undo")}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={!pipeline.canRedo}
            onClick={onRedo}
          >
            {t("softwareTeamDlc.redo")}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() =>
              setWizard({ title: "", roleId: "product", bootstrap: false })
            }
          >
            {t("softwareTeamDlc.startDelivery")}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => openCreate()}
          >
            {t("softwareTeamDlc.addItem")}
          </button>
        </div>
        {deliveryGroups.length > 0 || unscopedCount > 0 ? (
          <div
            className="sdlc-studio__chips"
            role="group"
            aria-label={t("softwareTeamDlc.deliveryFilter")}
          >
            <button
              type="button"
              className={
                "task-board__chip" +
                (deliveryFilter === SOFTWARE_TEAM_DELIVERY_FILTER_ALL
                  ? " is-active"
                  : "")
              }
              onClick={() => {
                setDeliveryFilter(SOFTWARE_TEAM_DELIVERY_FILTER_ALL);
                setDetailTarget(null);
              }}
            >
              {t("softwareTeamDlc.deliveryFilterAll")}
            </button>
            {deliveryGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={
                  "task-board__chip" +
                  (deliveryFilter === group.id ? " is-active" : "")
                }
                onClick={() => {
                  setDeliveryFilter(group.id);
                  setDetailTarget({ kind: "delivery", deliveryId: group.id });
                }}
              >
                {group.title}
              </button>
            ))}
            {unscopedCount > 0 ? (
              <button
                type="button"
                className={
                  "task-board__chip" +
                  (deliveryFilter === SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED
                    ? " is-active"
                    : "")
                }
                onClick={() => {
                  setDeliveryFilter(SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED);
                  setDetailTarget(null);
                }}
              >
                {t("softwareTeamDlc.deliveryUnscoped")}
              </button>
            ) : null}
          </div>
        ) : null}
        <div
          className="sdlc-studio__chips"
          role="group"
          aria-label={t("softwareTeamDlc.stageFilter")}
        >
          <button
            type="button"
            className={
              "task-board__chip" +
              (stageFilter === SOFTWARE_TEAM_STAGE_FILTER_ALL ? " is-active" : "")
            }
            onClick={() => setStageFilter(SOFTWARE_TEAM_STAGE_FILTER_ALL)}
          >
            {t("softwareTeamDlc.stageFilterAll")}
          </button>
          {SOFTWARE_TEAM_SDLC_STAGES.map((stage) => (
            <button
              key={stage.id}
              type="button"
              className={
                "task-board__chip" + (stageFilter === stage.id ? " is-active" : "")
              }
              onClick={() => setStageFilter(stage.id)}
            >
              {t(stage.titleKey)}
            </button>
          ))}
        </div>
        <div
          className="sdlc-studio__chips"
          role="group"
          aria-label={t("softwareTeamDlc.roleFilter")}
        >
          <button
            type="button"
            className={
              "task-board__chip" +
              (roleFilter === SOFTWARE_TEAM_ROLE_FILTER_ALL ? " is-active" : "")
            }
            onClick={() => setRoleFilter(SOFTWARE_TEAM_ROLE_FILTER_ALL)}
          >
            {t("softwareTeamDlc.roleFilterAll")}
          </button>
          {SOFTWARE_TEAM_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              className={
                "task-board__chip" + (roleFilter === role.id ? " is-active" : "")
              }
              onClick={() => setRoleFilter(role.id)}
            >
              {t(role.titleKey)}
            </button>
          ))}
        </div>
        <div className="sdlc-studio__chips" role="group" aria-label={t("softwareTeamDlc.showArchived")}>
          <button
            type="button"
            className={"task-board__chip" + (showArchived ? " is-active" : "")}
            onClick={() => setShowArchived((prev) => !prev)}
          >
            {t("softwareTeamDlc.showArchived")}
          </button>
        </div>
        {sdlcDocs.some((row) => row.exists) ? (
          <div
            className="sdlc-studio__chips"
            role="group"
            aria-label={t("softwareTeamDlc.openSdlcDocs")}
          >
            {sdlcDocs
              .filter((row) => row.exists)
              .map((row) => (
                <button
                  key={row.relative}
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => void onOpenSdlcDoc(row.relative)}
                >
                  {t("softwareTeamDlc.openSdlcDoc", {
                    file: row.relative.split("/").pop() ?? row.relative,
                  })}
                </button>
              ))}
          </div>
        ) : null}
        {(() => {
          const plan = planSoftwareTeamDlcPackWrite({
            sessionDataMode: actions.sessionDataMode,
            target: actions.installTarget,
            projectPath: workspace.projectPath,
          });
          if (plan.allowed) return null;
          if (plan.reason === "blocked_shared_user") {
            return (
              <p className="sdlc-studio__slash-note" role="note">
                {t("softwareTeamDlc.install.blockedShared")}
              </p>
            );
          }
          if (plan.reason === "need_project") {
            return (
              <p className="sdlc-studio__slash-note" role="note">
                {t("softwareTeamDlc.install.needProject")}
              </p>
            );
          }
          return null;
        })()}
        {actions.packStatus ? (
          <p className="sdlc-studio__slash-note" role="status">
            {actions.probing
              ? t("softwareTeamDlc.install.status.checking")
              : actions.describePackStatus(actions.packStatus)}
          </p>
        ) : actions.probing ? (
          <p className="sdlc-studio__slash-note" role="status">
            {t("softwareTeamDlc.install.status.checking")}
          </p>
        ) : null}
        <p className="sdlc-studio__slash-note">{t("softwareTeamDlc.slashAfterInstall")}</p>
        {fileStatus ? (
          <p className="sdlc-studio__slash-note" role="status">
            {fileStatus.ok === false && fileStatus.reason === "host_error"
              ? t(softwareTeamPipelineFileMessageKey(fileStatus.reason), {
                  error: fileStatus.error ?? "",
                })
              : fileStatus.ok === false &&
                  (fileStatus.reason === "parse_fail" ||
                    fileStatus.reason === "conflict")
                ? t(softwareTeamPipelineFileMessageKey(fileStatus.reason), {
                    file: SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE,
                  })
                : t(softwareTeamPipelineFileMessageKey(fileStatus.reason))}
          </p>
        ) : null}

        {status ? (
          <p className="sdlc-studio__status" role="status">
            {status}
          </p>
        ) : null}
        {copyError ? (
          <p className="sdlc-studio__status" role="status">
            {t("softwareTeamDlc.copyFailed")}
          </p>
        ) : null}

        {filtered.length === 0 ? (
          <div className="task-board__empty">
            <p className="task-board__empty-title">{t("softwareTeamDlc.emptyBoard")}</p>
            <button
              type="button"
              className="btn"
              onClick={() =>
                setWizard({ title: "", roleId: "product", bootstrap: false })
              }
            >
              {t("softwareTeamDlc.startDelivery")}
            </button>
          </div>
        ) : (
          <div
            className="agent-kanban__columns sdlc-studio__columns"
            role="list"
            aria-label={t("softwareTeamDlc.sdlcTitle")}
          >
            {SOFTWARE_TEAM_SDLC_STAGES.map((stage) => {
              const cards = filtered.filter((item) => item.stageId === stage.id);
              return (
                <section
                  key={stage.id}
                  className={"agent-kanban__col " + stageToneClass(stage.id)}
                  role="listitem"
                  aria-label={t(stage.titleKey)}
                >
                  <header className="agent-kanban__col-head">
                    <span className="agent-kanban__col-title">{t(stage.titleKey)}</span>
                    <span className="agent-kanban__col-count">{cards.length}</span>
                  </header>
                  {cards.length === 0 ? (
                    <p className="agent-kanban__none">{t("kanban.none")}</p>
                  ) : (
                    <ul className="agent-kanban__cards" role="list">
                      {cards.map((item) => (
                        <li
                          key={item.id}
                          className={
                            "agent-kanban__card" +
                            (item.sessionId && item.sessionId === currentSessionId
                              ? " is-current"
                              : "") +
                            (item.stageId === "ship" ? " is-done" : "")
                          }
                        >
                          <button
                            type="button"
                            className="agent-kanban__card-btn"
                            onClick={() => openDetail(item)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setMenu({ itemId: item.id, x: e.clientX, y: e.clientY });
                            }}
                          >
                            <span className="agent-kanban__card-title">
                              {displayTitle(item)}
                            </span>
                            {item.gitBranch.trim() ? (
                              <span className="sdlc-studio__refs">
                                {t("softwareTeamDlc.gitBranch")}: {item.gitBranch.trim()}
                              </span>
                            ) : null}
                            <span className="agent-kanban__card-team">
                              {t(softwareTeamRoleById(item.roleId)?.titleKey ?? "softwareTeamDlc.rosterTitle")}
                            </span>
                            <span className="sdlc-studio__refs">
                              {t("softwareTeamDlc.roleHistory", {
                                roles: softwareTeamRoleHistoryIds(item)
                                  .map((roleId) =>
                                    t(
                                      softwareTeamRoleById(roleId)?.titleKey ??
                                        "softwareTeamDlc.rosterTitle",
                                    ),
                                  )
                                  .join(" → "),
                              })}
                            </span>
                            <span className="agent-kanban__card-meta">
                              {item.sessionId
                                ? sessionTitle(item.sessionId)
                                : t("softwareTeamDlc.unbound")}
                            </span>
                            {item.planRef || item.goalRef || item.artifactRef ? (
                              <span className="sdlc-studio__refs">
                                {item.planRef ? t("softwareTeamDlc.planRef") : null}
                                {item.planRef && (item.goalRef || item.artifactRef)
                                  ? " · "
                                  : null}
                                {item.goalRef ? t("softwareTeamDlc.goalRef") : null}
                                {item.goalRef && item.artifactRef ? " · " : null}
                                {item.artifactRef ? t("softwareTeamDlc.artifactRef") : null}
                              </span>
                            ) : null}
                            {(() => {
                              const gate = softwareTeamShipGate(item);
                              const nearShip =
                                item.roleId === "reviewer" ||
                                item.roleId === "qa" ||
                                item.roleId === "writer" ||
                                item.stageId === "review";
                              if (gate.ok || !nearShip || !gate.blocks[0]) {
                                return null;
                              }
                              return (
                                <span className="sdlc-studio__refs">
                                  {t("softwareTeamDlc.shipLocked")}
                                  {" · "}
                                  {t(softwareTeamShipBlockMessageKey(gate.blocks[0]))}
                                </span>
                              );
                            })()}
                            {item.sessionDonePending ? (
                              <span className="sdlc-studio__refs">
                                {t("softwareTeamDlc.sessionDoneHint")}
                              </span>
                            ) : null}
                            {(() => {
                              const n = pickSoftwareTeamAttachSessions(
                                pipeline.items,
                                item,
                              ).length;
                              if (!n) return null;
                              return (
                                <span className="sdlc-studio__refs">
                                  {t("softwareTeamDlc.attachedHint", { n })}
                                </span>
                              );
                            })()}
                          </button>
                          {(() => {
                            const cta = decideSoftwareTeamDoneCta(item);
                            if (cta.kind === "none") return null;
                            if (cta.kind === "ship") {
                              return (
                                <div className="sdlc-studio__card-cta">
                                  <button
                                    type="button"
                                    className="btn btn--ghost btn--sm"
                                    onClick={() => void onShipChoice(item)}
                                  >
                                    {t("softwareTeamDlc.shipCta")}
                                  </button>
                                </div>
                              );
                            }
                            const roleTitle = t(
                              softwareTeamRoleById(cta.nextRole)?.titleKey ??
                                "softwareTeamDlc.handoff",
                            );
                            return (
                              <div className="sdlc-studio__card-cta">
                                <button
                                  type="button"
                                  className="btn btn--ghost btn--sm"
                                  onClick={() => void onHandoff(item.id)}
                                >
                                  {t("softwareTeamDlc.handoffCta", {
                                    role: roleTitle,
                                  })}
                                </button>
                              </div>
                            );
                          })()}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        onClose={() => setMenu(null)}
        items={menuItems}
      />

      <SdlcDeliveryDetailPane
        open={!!deliveryDetail}
        locale={locale}
        detail={deliveryDetail}
        sdlcDocs={sdlcDocs}
        onClose={() => setDetailTarget(null)}
        onHandoff={(itemId) => void onHandoff(itemId)}
        onShip={(item) => void onShipChoice(item)}
        onOpenSdlcDoc={(relative) => void onOpenSdlcDoc(relative)}
        onSelectSession={onSelectSession}
        onExport={() => {
          if (deliveryDetail) void onExportDelivery(deliveryDetail);
        }}
        onToggleArchive={(archived) => {
          const focus = deliveryDetail?.focusItem;
          if (!focus) return;
          onToggleArchive(focus, archived);
        }}
        onSaveGitBranch={(branch) => {
          if (!deliveryDetail) return false;
          return onSaveGitBranch(
            deliveryDetail.deliveryId,
            deliveryDetail.focusItem?.id ?? "",
            branch,
          );
        }}
        onCopyGitBranch={(branch) => void onCopyGitBranch(branch)}
        onRenameDelivery={(title) => {
          if (!deliveryDetail?.deliveryId) return false;
          const ok = pipeline.renameDelivery(deliveryDetail.deliveryId, title);
          setStatus(
            ok
              ? t("softwareTeamDlc.deliveryRenamed")
              : t("softwareTeamDlc.deliveryRenameNeedTitle"),
          );
          return ok;
        }}
        onDuplicateDelivery={() => {
          if (!deliveryDetail?.deliveryId) return;
          onDuplicateDelivery(deliveryDetail.deliveryId);
        }}
      />

      <GlassModal
        open={!!editor}
        onClose={() => setEditor(null)}
        title={editor?.id ? t("softwareTeamDlc.editItem") : t("softwareTeamDlc.addItem")}
        closeLabel={t("window.close")}
        wrapBody
        footer={
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setEditor(null)}>
              {t("common.cancel")}
            </button>
            <button type="button" className="btn btn--ghost" onClick={saveEditor}>
              {t("common.save")}
            </button>
            <button
              type="button"
              className="btn"
              disabled={actions.launching}
              onClick={() => void saveAndOpenEditor()}
            >
              {t("softwareTeamDlc.saveAndOpen")}
            </button>
          </>
        }
      >
        {editor ? (
          <div className="sdlc-studio__form">
            <label className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.itemTitle")}</span>
              <input
                className="settings-input"
                value={editor.title}
                onChange={(e) => setEditor({ ...editor, title: e.target.value })}
                placeholder={t("softwareTeamDlc.itemTitlePlaceholder")}
              />
            </label>
            <div className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.assignRole")}</span>
              <div className="sdlc-studio__chips" role="group">
                {SOFTWARE_TEAM_ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={
                      "task-board__chip" + (editor.roleId === role.id ? " is-active" : "")
                    }
                    onClick={() =>
                      setEditor({
                        ...editor,
                        roleId: role.id,
                        stageId: softwareTeamRoleById(role.id)?.defaultStage ?? editor.stageId,
                      })
                    }
                  >
                    {t(role.titleKey)}
                  </button>
                ))}
              </div>
            </div>
            <div className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.assignStage")}</span>
              <div className="sdlc-studio__chips" role="group">
                {SOFTWARE_TEAM_SDLC_STAGES.map((stage) => {
                  const live = editor.id
                    ? pipeline.items.find((item) => item.id === editor.id)
                    : null;
                  const shipBlocked =
                    stage.id === "ship" &&
                    (!live || !softwareTeamShipGate(live).ok);
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      className={
                        "task-board__chip" +
                        (editor.stageId === stage.id ? " is-active" : "")
                      }
                      disabled={shipBlocked}
                      onClick={() => {
                        if (shipBlocked) {
                          setStatus(t("softwareTeamDlc.shipLocked"));
                          return;
                        }
                        setEditor({ ...editor, stageId: stage.id });
                      }}
                    >
                      {t(stage.titleKey)}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.sessionLabel")}</span>
              <div className="sdlc-studio__sessions" role="listbox" aria-label={t("softwareTeamDlc.bindSession")}>
                <button
                  type="button"
                  className={
                    "sdlc-studio__session" + (!editor.sessionId ? " is-active" : "")
                  }
                  onClick={() => setEditor({ ...editor, sessionId: "" })}
                >
                  {t("softwareTeamDlc.unbound")}
                </button>
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className={
                      "sdlc-studio__session" +
                      (editor.sessionId === session.id ? " is-active" : "")
                    }
                    onClick={() => setEditor({ ...editor, sessionId: session.id })}
                  >
                    {(session.title ?? "").trim() || untitledLabel || session.id.slice(0, 8)}
                  </button>
                ))}
              </div>
            </div>
            <label className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.planRef")}</span>
              <input
                className="settings-input"
                value={editor.planRef}
                onChange={(e) => setEditor({ ...editor, planRef: e.target.value })}
                placeholder={t("softwareTeamDlc.planPlaceholder")}
              />
            </label>
            <label className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.goalRef")}</span>
              <input
                className="settings-input"
                value={editor.goalRef}
                onChange={(e) => setEditor({ ...editor, goalRef: e.target.value })}
                placeholder={t("softwareTeamDlc.goalPlaceholder")}
              />
            </label>
            <label className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.artifactRef")}</span>
              <input
                className="settings-input"
                value={editor.artifactRef}
                onChange={(e) => setEditor({ ...editor, artifactRef: e.target.value })}
                placeholder={t("softwareTeamDlc.artifactPlaceholder")}
              />
            </label>
            <label className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.gitBranch")}</span>
              <input
                className="settings-input"
                value={editor.gitBranch}
                onChange={(e) => setEditor({ ...editor, gitBranch: e.target.value })}
                placeholder={t("softwareTeamDlc.gitBranchPlaceholder")}
                autoComplete="off"
                spellCheck={false}
              />
              <p className="sdlc-studio__slash-note">{t("softwareTeamDlc.gitBranchHint")}</p>
            </label>
          </div>
        ) : null}
      </GlassModal>

      <GlassModal
        open={!!notesEditor}
        onClose={() => setNotesEditor(null)}
        title={
          notesEditor?.kind === "qa"
            ? t("softwareTeamDlc.markQaNote")
            : t("softwareTeamDlc.markReviewNote")
        }
        closeLabel={t("window.close")}
        wrapBody
        footer={
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setNotesEditor(null)}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (!notesEditor) return;
                const text = notesEditor.text.trim();
                if (notesEditor.kind === "qa") {
                  pipeline.updateItem(notesEditor.itemId, { qaNote: text });
                } else {
                  pipeline.updateItem(notesEditor.itemId, { reviewNote: text });
                }
                setNotesEditor(null);
                setStatus(t("softwareTeamDlc.notesSaved"));
              }}
            >
              {t("common.save")}
            </button>
          </>
        }
      >
        {notesEditor ? (
          <label className="sdlc-studio__field">
            <span>
              {notesEditor.kind === "qa"
                ? t("softwareTeamDlc.qaNote")
                : t("softwareTeamDlc.reviewNote")}
            </span>
            <textarea
              className="settings-input"
              rows={5}
              value={notesEditor.text}
              onChange={(e) =>
                setNotesEditor({ ...notesEditor, text: e.target.value })
              }
              placeholder={
                notesEditor.kind === "qa"
                  ? t("softwareTeamDlc.qaNotePlaceholder")
                  : t("softwareTeamDlc.reviewNotePlaceholder")
              }
            />
          </label>
        ) : null}
      </GlassModal>

      <GlassModal
        open={!!wizard}
        onClose={() => setWizard(null)}
        title={t("softwareTeamDlc.startDelivery")}
        closeLabel={t("window.close")}
        wrapBody
        footer={
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setWizard(null)}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              className="btn"
              disabled={actions.launching || !(wizard?.title ?? "").trim()}
              onClick={() => void onStartDelivery()}
            >
              {t("softwareTeamDlc.startDelivery")}
            </button>
          </>
        }
      >
        {wizard ? (
          <div className="sdlc-studio__form">
            <p className="sdlc-studio__slash-note">
              {t("softwareTeamDlc.startDeliveryHint")}
            </p>
            <label className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.startDeliveryTitle")}</span>
              <input
                className="settings-input"
                value={wizard.title}
                onChange={(e) =>
                  setWizard({ ...wizard, title: e.target.value })
                }
                placeholder={t("softwareTeamDlc.startDeliveryTitlePlaceholder")}
              />
            </label>
            <div className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.startDeliveryRole")}</span>
              <div className="sdlc-studio__chips" role="group">
                {SOFTWARE_TEAM_ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={
                      "task-board__chip" +
                      (wizard.roleId === role.id ? " is-active" : "")
                    }
                    onClick={() => setWizard({ ...wizard, roleId: role.id })}
                  >
                    {t(role.titleKey)}
                  </button>
                ))}
              </div>
            </div>
            {(() => {
              const bootPlan = planSoftwareTeamWorkspaceBootstrap({
                projectPath: workspace.projectPath,
                bootstrap: true,
              });
              return (
                <>
                  <div className="sdlc-studio__field">
                    <span>{t("softwareTeamDlc.startDeliveryBootstrap")}</span>
                    <div className="sdlc-studio__chips" role="group">
                      <button
                        type="button"
                        className={
                          "task-board__chip" +
                          (wizard.bootstrap ? " is-active" : "")
                        }
                        disabled={!bootPlan.allowed}
                        onClick={() =>
                          setWizard({
                            ...wizard,
                            bootstrap: !wizard.bootstrap,
                          })
                        }
                      >
                        {t("softwareTeamDlc.startDeliveryBootstrap")}
                      </button>
                    </div>
                    <p className="sdlc-studio__slash-note">
                      {t("softwareTeamDlc.startDeliveryBootstrapHint")}
                    </p>
                  </div>
                  {!bootPlan.allowed && bootPlan.reason !== "skipped" ? (
                    <p className="sdlc-studio__slash-note" role="note">
                      {t(softwareTeamBootstrapMessageKey(bootPlan.reason))}
                    </p>
                  ) : null}
                </>
              );
            })()}
          </div>
        ) : null}
      </GlassModal>

      <GlassModal
        open={!!pendingRemove}
        onClose={() => setPendingRemove(null)}
        title={t("softwareTeamDlc.removeItemConfirm")}
        closeLabel={t("window.close")}
        wrapBody
        footer={
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setPendingRemove(null)}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (!pendingRemove) return;
                pipeline.removeItem(pendingRemove.id);
                setPendingRemove(null);
                setStatus(t("softwareTeamDlc.removeItem"));
              }}
            >
              {t("softwareTeamDlc.removeItemConfirmAction")}
            </button>
          </>
        }
      >
        <p className="sdlc-studio__slash-note">
          {t("softwareTeamDlc.removeItemConfirmBody", {
            title:
              pendingRemove?.title.trim() ||
              pendingRemove?.id.slice(0, 8) ||
              "",
          })}
        </p>
      </GlassModal>
    </div>
  );
}
