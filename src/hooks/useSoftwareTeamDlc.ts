/**
 * Software Team DLC — enable flag + session tags (local prefs).
 */

import { useCallback, useEffect, useState } from "react";
import {
  SOFTWARE_TEAM_DLC_CHANGE_EVENT,
  clearSoftwareTeamSessionTag,
  loadSoftwareTeamDlcEnabled,
  loadSoftwareTeamSessionTagMap,
  saveSoftwareTeamDlcEnabled,
  saveSoftwareTeamSessionTagMap,
  upsertSoftwareTeamSessionTag,
  type SoftwareTeamRoleId,
  type SoftwareTeamSdlcStageId,
  type SoftwareTeamSessionTag,
  type SoftwareTeamSessionTagMap,
} from "@/lib/softwareTeamDlc";

const TAGS_CHANGE = "grok-software-team-dlc-tags-change";

function emitTagsChange(): void {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") {
    return;
  }
  window.dispatchEvent(new Event(TAGS_CHANGE));
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

export function useSoftwareTeamSessionTags(): {
  tags: SoftwareTeamSessionTagMap;
  tagFor: (sessionId: string) => SoftwareTeamSessionTag | null;
  assign: (
    sessionId: string,
    patch: { roleId?: SoftwareTeamRoleId; stageId?: SoftwareTeamSdlcStageId },
  ) => void;
  clear: (sessionId: string) => void;
} {
  const [tags, setTags] = useState(loadSoftwareTeamSessionTagMap);
  useEffect(() => {
    const sync = () => setTags(loadSoftwareTeamSessionTagMap());
    window.addEventListener(TAGS_CHANGE, sync);
    return () => window.removeEventListener(TAGS_CHANGE, sync);
  }, []);

  const assign = useCallback(
    (
      sessionId: string,
      patch: { roleId?: SoftwareTeamRoleId; stageId?: SoftwareTeamSdlcStageId },
    ) => {
      const next = upsertSoftwareTeamSessionTag(
        loadSoftwareTeamSessionTagMap(),
        sessionId,
        patch,
      );
      saveSoftwareTeamSessionTagMap(next);
      setTags(next);
      emitTagsChange();
    },
    [],
  );

  const clear = useCallback((sessionId: string) => {
    const next = clearSoftwareTeamSessionTag(
      loadSoftwareTeamSessionTagMap(),
      sessionId,
    );
    saveSoftwareTeamSessionTagMap(next);
    setTags(next);
    emitTagsChange();
  }, []);

  const tagFor = useCallback(
    (sessionId: string) => tags[sessionId] ?? null,
    [tags],
  );

  return { tags, tagFor, assign, clear };
}
