/**
 * Software Works / SDLC Studio — enable flag + pipeline store (local prefs).
 */

import { useCallback, useEffect, useState } from "react";
import {
  SOFTWARE_TEAM_DLC_CHANGE_EVENT,
  SOFTWARE_TEAM_DLC_PIPELINE_CHANGE_EVENT,
  applySessionKanbanBoardToPipeline,
  applySessionKanbanToPipeline,
  applySoftwareTeamHandoffToStore,
  assignSessionToPipeline,
  bindPipelineItemSession,
  clearSessionFromPipeline,
  loadSoftwareTeamDlcEnabled,
  loadSoftwareTeamPipelineStore,
  persistSoftwareTeamPipeline,
  pipelineItemForSession,
  queueSoftwareTeamPipelineProjectPersist,
  projectSessionTagsFromPipeline,
  removeSoftwareTeamPipelineItem,
  saveSoftwareTeamDlcEnabled,
  setPipelineItemRole,
  setPipelineItemStage,
  type SoftwareTeamHandoffResult,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamPipelineItemDraft,
  type SoftwareTeamPipelineStore,
  type SoftwareTeamRoleId,
  type SoftwareTeamSdlcStageId,
  type SoftwareTeamSessionTag,
  type SoftwareTeamSessionTagMap,
  addSoftwareTeamPipelineItem,
  boundSoftwareTeamPipelineProjectPath,
  reloadSoftwareTeamPipelineIfNewer,
  setSoftwareTeamDeliveryArchived,
  setSoftwareTeamDeliveryGitBranch,
  setSoftwareTeamItemArchived,
  updateSoftwareTeamPipelineItem,
  clearSoftwareTeamUndoStack,
  popSoftwareTeamUndoSnapshot,
  pushSoftwareTeamUndoSnapshot,
  serializeSoftwareTeamPipelineStore,
  softwareTeamUndoDepth,
  type SoftwareTeamPipelineReload,
} from "@/lib/softwareTeamDlc";
import type { AgentKanbanColumnId } from "@/lib/kanbanBoard";

function emitPipelineUi(): void {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") {
    return;
  }
  window.dispatchEvent(new Event(SOFTWARE_TEAM_DLC_PIPELINE_CHANGE_EVENT));
  window.dispatchEvent(new Event("grok-software-team-dlc-tags-change"));
}

function commit(store: SoftwareTeamPipelineStore): SoftwareTeamPipelineStore {
  persistSoftwareTeamPipeline(store);
  queueSoftwareTeamPipelineProjectPersist(store);
  emitPipelineUi();
  return store;
}

function commitMutating(next: SoftwareTeamPipelineStore): SoftwareTeamPipelineStore {
  const current = loadSoftwareTeamPipelineStore();
  if (serializeSoftwareTeamPipelineStore(current) !== serializeSoftwareTeamPipelineStore(next)) {
    pushSoftwareTeamUndoSnapshot(current);
  }
  return commit(next);
}

export function useSoftwareTeamDlcEnabled(): boolean {
  const [enabled, setEnabled] = useState(loadSoftwareTeamDlcEnabled);
  useEffect(() => {
    const sync = () => setEnabled(loadSoftwareTeamDlcEnabled());
    window.addEventListener(SOFTWARE_TEAM_DLC_CHANGE_EVENT, sync);
    return () => window.removeEventListener(SOFTWARE_TEAM_DLC_CHANGE_EVENT, sync);
  }, []);
  return enabled;
}

export function useSoftwareTeamDlcPref(): {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
} {
  const enabled = useSoftwareTeamDlcEnabled();
  const setEnabled = useCallback((next: boolean) => {
    saveSoftwareTeamDlcEnabled(next);
  }, []);
  return { enabled, setEnabled };
}

export function useSoftwareTeamPipeline(): {
  store: SoftwareTeamPipelineStore;
  items: SoftwareTeamPipelineItem[];
  itemForSession: (sessionId: string) => SoftwareTeamPipelineItem | null;
  addItem: (draft: SoftwareTeamPipelineItemDraft) => SoftwareTeamPipelineItem | null;
  updateItem: (
    itemId: string,
    patch: Partial<Omit<SoftwareTeamPipelineItem, "id">>,
  ) => void;
  setStage: (itemId: string, stageId: SoftwareTeamSdlcStageId) => void;
  setRole: (itemId: string, roleId: SoftwareTeamRoleId) => void;
  bindSession: (itemId: string, sessionId: string) => void;
  assignSession: (
    sessionId: string,
    patch: { roleId?: SoftwareTeamRoleId; stageId?: SoftwareTeamSdlcStageId },
  ) => void;
  clearSession: (sessionId: string) => void;
  removeItem: (itemId: string) => void;
  handoff: (itemId: string) => SoftwareTeamHandoffResult | null;
  applySessionKanban: (sessionId: string, column: AgentKanbanColumnId) => void;
  applySessionKanbanBoard: (
    placements: ReadonlyArray<{ sessionId: string; column: AgentKanbanColumnId }>,
  ) => void;
  reloadFromProject: (projectPath?: string | null) => Promise<SoftwareTeamPipelineReload>;
  setDeliveryArchived: (deliveryId: string, archived: boolean) => void;
  setItemArchived: (itemId: string, archived: boolean) => void;
  setDeliveryGitBranch: (deliveryId: string, branch: string) => boolean;
  undo: () => boolean;
  canUndo: boolean;
} {
  const [store, setStore] = useState(loadSoftwareTeamPipelineStore);
  const [undoDepth, setUndoDepth] = useState(softwareTeamUndoDepth);

  const rememberUndo = useCallback((next: SoftwareTeamPipelineStore) => {
    const saved = commitMutating(next);
    setUndoDepth(softwareTeamUndoDepth());
    return saved;
  }, []);

  useEffect(() => {
    const sync = () => setStore(loadSoftwareTeamPipelineStore());
    window.addEventListener(SOFTWARE_TEAM_DLC_PIPELINE_CHANGE_EVENT, sync);
    window.addEventListener("grok-software-team-dlc-tags-change", sync);
    return () => {
      window.removeEventListener(SOFTWARE_TEAM_DLC_PIPELINE_CHANGE_EVENT, sync);
      window.removeEventListener("grok-software-team-dlc-tags-change", sync);
    };
  }, []);

  useEffect(() => {
    const loaded = loadSoftwareTeamPipelineStore();
    if (loaded.items.length > 0) {
      persistSoftwareTeamPipeline(loaded);
    }
  }, []);

  const itemForSession = useCallback(
    (sessionId: string) => pipelineItemForSession(store, sessionId),
    [store],
  );

  const addItem = useCallback((draft: SoftwareTeamPipelineItemDraft) => {
    const next = addSoftwareTeamPipelineItem(loadSoftwareTeamPipelineStore(), draft);
    const created = next.items[next.items.length - 1] ?? null;
    setStore(rememberUndo(next));
    return created;
  }, [rememberUndo]);

  const updateItem = useCallback(
    (itemId: string, patch: Partial<Omit<SoftwareTeamPipelineItem, "id">>) => {
      setStore(
        rememberUndo(updateSoftwareTeamPipelineItem(loadSoftwareTeamPipelineStore(), itemId, patch)),
      );
    },
    [rememberUndo],
  );

  const setStage = useCallback((itemId: string, stageId: SoftwareTeamSdlcStageId) => {
    setStore(rememberUndo(setPipelineItemStage(loadSoftwareTeamPipelineStore(), itemId, stageId)));
  }, [rememberUndo]);

  const setRole = useCallback((itemId: string, roleId: SoftwareTeamRoleId) => {
    setStore(rememberUndo(setPipelineItemRole(loadSoftwareTeamPipelineStore(), itemId, roleId)));
  }, [rememberUndo]);

  const bindSession = useCallback((itemId: string, sessionId: string) => {
    setStore(
      rememberUndo(bindPipelineItemSession(loadSoftwareTeamPipelineStore(), itemId, sessionId)),
    );
  }, [rememberUndo]);

  const assignSession = useCallback(
    (
      sessionId: string,
      patch: { roleId?: SoftwareTeamRoleId; stageId?: SoftwareTeamSdlcStageId },
    ) => {
      setStore(
        rememberUndo(assignSessionToPipeline(loadSoftwareTeamPipelineStore(), sessionId, patch)),
      );
    },
    [rememberUndo],
  );

  const clearSession = useCallback((sessionId: string) => {
    setStore(rememberUndo(clearSessionFromPipeline(loadSoftwareTeamPipelineStore(), sessionId)));
  }, [rememberUndo]);

  const removeItem = useCallback((itemId: string) => {
    setStore(rememberUndo(removeSoftwareTeamPipelineItem(loadSoftwareTeamPipelineStore(), itemId)));
  }, [rememberUndo]);

  const handoff = useCallback((itemId: string): SoftwareTeamHandoffResult | null => {
    const { store: next, result } = applySoftwareTeamHandoffToStore(
      loadSoftwareTeamPipelineStore(),
      itemId,
    );
    setStore(rememberUndo(next));
    return result;
  }, [rememberUndo]);

  const applySessionKanban = useCallback(
    (sessionId: string, column: AgentKanbanColumnId) => {
      const current = loadSoftwareTeamPipelineStore();
      const next = applySessionKanbanToPipeline(current, sessionId, column);
      if (next === current) return;
      setStore(rememberUndo(next));
    },
    [rememberUndo],
  );

  const setDeliveryArchived = useCallback(
    (deliveryId: string, archived: boolean) => {
      setStore(
        rememberUndo(
          setSoftwareTeamDeliveryArchived(
            loadSoftwareTeamPipelineStore(),
            deliveryId,
            archived,
          ),
        ),
      );
    },
    [rememberUndo],
  );

  const setItemArchived = useCallback((itemId: string, archived: boolean) => {
    setStore(
      rememberUndo(
        setSoftwareTeamItemArchived(
          loadSoftwareTeamPipelineStore(),
          itemId,
          archived,
        ),
      ),
    );
  }, [rememberUndo]);

  const setDeliveryGitBranch = useCallback((deliveryId: string, branch: string) => {
    const current = loadSoftwareTeamPipelineStore();
    const next = setSoftwareTeamDeliveryGitBranch(current, deliveryId, branch);
    if (next === current) return false;
    setStore(rememberUndo(next));
    return true;
  }, [rememberUndo]);

  const undo = useCallback(() => {
    const prev = popSoftwareTeamUndoSnapshot();
    if (!prev) return false;
    setStore(commit(prev));
    setUndoDepth(softwareTeamUndoDepth());
    return true;
  }, []);

  const reloadFromProject = useCallback(async (projectPath?: string | null) => {
    const result = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: projectPath ?? boundSoftwareTeamPipelineProjectPath(),
    });
    if (result.ok && result.kind === "replaced") {
      clearSoftwareTeamUndoStack();
      setUndoDepth(0);
      setStore(result.store);
    }
    return result;
  }, []);

  const applySessionKanbanBoard = useCallback(
    (
      placements: ReadonlyArray<{
        sessionId: string;
        column: AgentKanbanColumnId;
      }>,
    ) => {
      const current = loadSoftwareTeamPipelineStore();
      const next = applySessionKanbanBoardToPipeline(current, placements);
      if (next === current) return;
      setStore(rememberUndo(next));
    },
    [rememberUndo],
  );

  return {
    store,
    items: store.items,
    itemForSession,
    addItem,
    updateItem,
    setStage,
    setRole,
    bindSession,
    assignSession,
    clearSession,
    removeItem,
    handoff,
    applySessionKanban,
    applySessionKanbanBoard,
    reloadFromProject,
    setDeliveryArchived,
    setItemArchived,
    setDeliveryGitBranch,
    undo,
    canUndo: undoDepth > 0,
  };
}

export function useSoftwareTeamSessionTags(): {
  tags: SoftwareTeamSessionTagMap;
  tagFor: (sessionId: string) => SoftwareTeamSessionTag | null;
  assign: (
    sessionId: string,
    patch: { roleId?: SoftwareTeamRoleId; stageId?: SoftwareTeamSdlcStageId },
  ) => void;
  clear: (sessionId: string) => void;
} {
  const pipeline = useSoftwareTeamPipeline();
  const tags = projectSessionTagsFromPipeline(pipeline.store);

  const tagFor = useCallback(
    (sessionId: string) => tags[sessionId] ?? null,
    [tags],
  );

  return {
    tags,
    tagFor,
    assign: pipeline.assignSession,
    clear: pipeline.clearSession,
  };
}
