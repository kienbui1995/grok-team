/**
 * Software Works × Laya — Suggest / Apply without growing AppWorkbench.
 *
 * Laya is a sidecar suggestion engine. Apply is a human click. Ship stays
 * gated by Reviewer/QA notes.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SOFTWARE_TEAM_DLC_LAYA_CHANGE_EVENT,
  defaultSoftwareTeamLayaHost,
  loadSoftwareTeamLayaEnabled,
  loadSoftwareTeamLayaMinConfidence,
  planSoftwareTeamLayaDecide,
  runSoftwareTeamLayaSuggest,
  type SoftwareTeamLayaHost,
  type SoftwareTeamLayaIntent,
  type SoftwareTeamLayaParse,
  type SoftwareTeamLayaPlan,
  type SoftwareTeamLayaSuggestion,
  buildSoftwareTeamLayaState,
} from "@/lib/softwareTeamDlc";

export type SoftwareTeamLayaSuggestResult =
  | SoftwareTeamLayaParse
  | { ok: false; reason: SoftwareTeamLayaPlan["reason"]; error?: string };

export function useSoftwareTeamLaya(input: {
  enabled: boolean;
  projectPath?: string | null;
  locale?: string;
  host?: SoftwareTeamLayaHost;
}): {
  plan: SoftwareTeamLayaPlan;
  applying: boolean;
  last: SoftwareTeamLayaSuggestResult | null;
  suggest: (args: {
    intents?: readonly SoftwareTeamLayaIntent[];
    state: Parameters<typeof buildSoftwareTeamLayaState>[0];
  }) => Promise<SoftwareTeamLayaSuggestResult>;
  dismiss: () => void;
} {
  const [layaEnabled, setLayaEnabled] = useState(loadSoftwareTeamLayaEnabled);
  const [minConfidence, setMinConfidence] = useState(
    loadSoftwareTeamLayaMinConfidence,
  );
  const [applying, setApplying] = useState(false);
  const [last, setLast] = useState<SoftwareTeamLayaSuggestResult | null>(null);
  const host = input.host ?? defaultSoftwareTeamLayaHost();

  useEffect(() => {
    const sync = () => {
      setLayaEnabled(loadSoftwareTeamLayaEnabled());
      setMinConfidence(loadSoftwareTeamLayaMinConfidence());
    };
    window.addEventListener(SOFTWARE_TEAM_DLC_LAYA_CHANGE_EVENT, sync);
    return () => window.removeEventListener(SOFTWARE_TEAM_DLC_LAYA_CHANGE_EVENT, sync);
  }, []);

  const plan = useMemo(
    () =>
      planSoftwareTeamLayaDecide({
        enabled: input.enabled,
        layaEnabled,
        hasHost: host.isDesktopHost(),
        projectPath: input.projectPath,
      }),
    [host, input.enabled, input.projectPath, layaEnabled],
  );

  const suggest = useCallback(
    async (args: {
      intents?: readonly SoftwareTeamLayaIntent[];
      state: Parameters<typeof buildSoftwareTeamLayaState>[0];
    }) => {
      setApplying(true);
      try {
        const result = await runSoftwareTeamLayaSuggest({
          enabled: input.enabled,
          layaEnabled,
          projectPath: input.projectPath,
          intents: args.intents,
          state: { ...args.state, locale: args.state.locale ?? input.locale },
          minConfidence,
          host,
        });
        setLast(result);
        return result;
      } finally {
        setApplying(false);
      }
    },
    [host, input.enabled, input.locale, input.projectPath, layaEnabled, minConfidence],
  );

  const dismiss = useCallback(() => setLast(null), []);

  return { plan, applying, last, suggest, dismiss };
}

export function softwareTeamLayaLastSuggestions(
  last: SoftwareTeamLayaSuggestResult | null,
): Partial<Record<SoftwareTeamLayaIntent, SoftwareTeamLayaSuggestion>> {
  if (!last || !last.ok) return {};
  return last.suggestions;
}
