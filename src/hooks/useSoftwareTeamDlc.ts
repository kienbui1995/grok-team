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
  popSoftwareTeamRedoSnapshot,
  popSoftwareTeamUndoSnapshot,
  pushSoftwareTeamUndoSnapshot,
  serializeSoftwareTeamPipelineStore,
  softwareTeamRedoDepth,
  softwareTeamUndoDepth,
  duplicateSoftwareTeamDelivery,
  moveSoftwareTeamItemDelivery,
  renameSoftwareTeamDelivery,
  setSoftwareTeamDeliveryNote,
  syncSoftwareTeamDeliverySliceRefs,
  type SoftwareTeamDeliveryNoteKind,
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
  renameDelivery: (deliveryId: string, title: string) => boolean;
  moveItemToDelivery: (itemId: string, deliveryId: string) => boolean;
  duplicateDelivery: (deliveryId: string, titleSuffix: string) => string | null;
  syncDeliverySliceRefs: (
    deliveryId: string,
    refs: { planRef?: string; goalRef?: string; artifactRef?: string },
  ) => boolean;
  setDeliveryNote: (input: {
    deliveryId?: string | null;
    focusItemId?: string | null;
    kind: SoftwareTeamDeliveryNoteKind;
    text: string;
  }) => void;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: boolean;
  canRedo: boolean;
} {
  const [store, setStore] = useState(loadSoftwareTeamPipelineStore);
  const [undoDepth, setUndoDepth] = useState(softwareTeamUndoDepth);
  const [redoDepth, setRedoDepth] = useState(softwareTeamRedoDepth);

  const rememberHistory = useCallback(() => {
    setUndoDepth(softwareTeamUndoDepth());
    setRedoDepth(softwareTeamRedoDepth());
  }, []);

  const rememberUndo = useCallback((next: SoftwareTeamPipelineStore) => {
    const saved = commitMutating(next);
    rememberHistory();
    return saved;
  }, [rememberHistory]);

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

  const renameDelivery = useCallback((deliveryId: string, title: string) => {
    const current = loadSoftwareTeamPipelineStore();
    const next = renameSoftwareTeamDelivery(current, deliveryId, title);
    if (next === current) return false;
    setStore(rememberUndo(next));
    return true;
  }, [rememberUndo]);

  const moveItemToDelivery = useCallback((itemId: string, deliveryId: string) => {
    const current = loadSoftwareTeamPipelineStore();
    const next = moveSoftwareTeamItemDelivery(current, itemId, deliveryId);
    if (next === current) return false;
    setStore(rememberUndo(next));
    return true;
  }, [rememberUndo]);

  const duplicateDelivery = useCallback((deliveryId: string, titleSuffix: string) => {
    const current = loadSoftwareTeamPipelineStore();
    const result = duplicateSoftwareTeamDelivery(current, deliveryId, titleSuffix);
    if (!result) return null;
    setStore(rememberUndo(result.store));
    return result.deliveryId;
  }, [rememberUndo]);

  const syncDeliverySliceRefs = useCallback(
    (
      deliveryId: string,
      refs: { planRef?: string; goalRef?: string; artifactRef?: string },
    ) => {
      const current = loadSoftwareTeamPipelineStore();
      const next = syncSoftwareTeamDeliverySliceRefs(current, deliveryId, refs);
      if (next === current) return false;
      setStore(rememberUndo(next));
      return true;
    },
    [rememberUndo],
  );

  const setDeliveryNote = useCallback(
    (input: {
      deliveryId?: string | null;
      focusItemId?: string | null;
      kind: SoftwareTeamDeliveryNoteKind;
      text: string;
    }) => {
      setStore(
        rememberUndo(
          setSoftwareTeamDeliveryNote(loadSoftwareTeamPipelineStore(), input),
        ),
      );
    },
    [rememberUndo],
  );

  const undo = useCallback(() => {
    const current = loadSoftwareTeamPipelineStore();
    const prev = popSoftwareTeamUndoSnapshot(current);
    if (!prev) return false;
    setStore(commit(prev));
    rememberHistory();
    return true;
  }, [rememberHistory]);

  const redo = useCallback(() => {
    const current = loadSoftwareTeamPipelineStore();
    const next = popSoftwareTeamRedoSnapshot(current);
    if (!next) return false;
    setStore(commit(next));
    rememberHistory();
    return true;
  }, [rememberHistory]);

  const reloadFromProject = useCallback(async (projectPath?: string | null) => {
    const result = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: projectPath ?? boundSoftwareTeamPipelineProjectPath(),
    });
    if (result.ok && result.kind === "replaced") {
      clearSoftwareTeamUndoStack();
      rememberHistory();
      setStore(result.store);
    }
    return result;
  }, [rememberHistory]);

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
    renameDelivery,
    moveItemToDelivery,
    duplicateDelivery,
    syncDeliverySliceRefs,
    setDeliveryNote,
    undo,
    redo,
    canUndo: undoDepth > 0,
    canRedo: redoDepth > 0,
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
