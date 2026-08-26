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
  setSoftwareTeamItemArchived,
  updateSoftwareTeamPipelineItem,
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
} {
  const [store, setStore] = useState(loadSoftwareTeamPipelineStore);

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
    setStore(commit(next));
    return created;
  }, []);

  const updateItem = useCallback(
    (itemId: string, patch: Partial<Omit<SoftwareTeamPipelineItem, "id">>) => {
      setStore(
        commit(updateSoftwareTeamPipelineItem(loadSoftwareTeamPipelineStore(), itemId, patch)),
      );
    },
    [],
  );

  const setStage = useCallback((itemId: string, stageId: SoftwareTeamSdlcStageId) => {
    setStore(commit(setPipelineItemStage(loadSoftwareTeamPipelineStore(), itemId, stageId)));
  }, []);

  const setRole = useCallback((itemId: string, roleId: SoftwareTeamRoleId) => {
    setStore(commit(setPipelineItemRole(loadSoftwareTeamPipelineStore(), itemId, roleId)));
  }, []);

  const bindSession = useCallback((itemId: string, sessionId: string) => {
    setStore(
      commit(bindPipelineItemSession(loadSoftwareTeamPipelineStore(), itemId, sessionId)),
    );
  }, []);

  const assignSession = useCallback(
    (
      sessionId: string,
      patch: { roleId?: SoftwareTeamRoleId; stageId?: SoftwareTeamSdlcStageId },
    ) => {
      setStore(
        commit(assignSessionToPipeline(loadSoftwareTeamPipelineStore(), sessionId, patch)),
      );
    },
    [],
  );

  const clearSession = useCallback((sessionId: string) => {
    setStore(commit(clearSessionFromPipeline(loadSoftwareTeamPipelineStore(), sessionId)));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setStore(commit(removeSoftwareTeamPipelineItem(loadSoftwareTeamPipelineStore(), itemId)));
  }, []);

  const handoff = useCallback((itemId: string): SoftwareTeamHandoffResult | null => {
    const { store: next, result } = applySoftwareTeamHandoffToStore(
      loadSoftwareTeamPipelineStore(),
      itemId,
    );
    setStore(commit(next));
    return result;
  }, []);

  const applySessionKanban = useCallback(
    (sessionId: string, column: AgentKanbanColumnId) => {
      const current = loadSoftwareTeamPipelineStore();
      const next = applySessionKanbanToPipeline(current, sessionId, column);
      if (next === current) return;
      setStore(commit(next));
    },
    [],
  );

  const setDeliveryArchived = useCallback(
    (deliveryId: string, archived: boolean) => {
      setStore(
        commit(
          setSoftwareTeamDeliveryArchived(
            loadSoftwareTeamPipelineStore(),
            deliveryId,
            archived,
          ),
        ),
      );
    },
    [],
  );

  const setItemArchived = useCallback((itemId: string, archived: boolean) => {
    setStore(
      commit(
        setSoftwareTeamItemArchived(
          loadSoftwareTeamPipelineStore(),
          itemId,
          archived,
        ),
      ),
    );
  }, []);

  const reloadFromProject = useCallback(async (projectPath?: string | null) => {
    const result = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: projectPath ?? boundSoftwareTeamPipelineProjectPath(),
    });
    if (result.ok && result.kind === "replaced") {
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
      setStore(commit(next));
    },
    [],
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
