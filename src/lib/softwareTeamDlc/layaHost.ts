/**
 * Software Works × Laya — injected Host + desktop invoke.
 *
 * Browser / tests never fake predict success. Shared ~/.grok is refused
 * by the planner before probe/predict.
 */

import { invoke, isDesktopHost } from "@/lib/api/host";
import {
  buildSoftwareTeamLayaState,
  parseSoftwareTeamLayaResult,
  planSoftwareTeamLayaDecide,
  softwareTeamLayaQuestions,
  type SoftwareTeamLayaIntent,
  type SoftwareTeamLayaParse,
  type SoftwareTeamLayaPlan,
} from "./laya";

/** Spec: Host kills the first predict after 60s (cold weight load). */
export const SOFTWARE_TEAM_LAYA_PREDICT_TIMEOUT_COLD_MS = 60_000;
/** Spec: after a predict in this Host process returned `answers`, later calls get 15s. */
export const SOFTWARE_TEAM_LAYA_PREDICT_TIMEOUT_WARM_MS = 15_000;
/**
 * Stable Host token for a killed predict. Studio maps it to i18n.
 * A timeout is never a suggestion.
 */
export const SOFTWARE_TEAM_LAYA_TIMEOUT_ERROR = "timeout";

/** Mirrors `predict_timeout_secs` in `software_team_laya.rs`. */
export function softwareTeamLayaPredictTimeoutMs(warm: boolean): number {
  return warm
    ? SOFTWARE_TEAM_LAYA_PREDICT_TIMEOUT_WARM_MS
    : SOFTWARE_TEAM_LAYA_PREDICT_TIMEOUT_COLD_MS;
}

export function isSoftwareTeamLayaTimeoutError(error: unknown): boolean {
  return error === SOFTWARE_TEAM_LAYA_TIMEOUT_ERROR;
}

export type SoftwareTeamLayaHost = {
  isDesktopHost: () => boolean;
  probe: () => Promise<{ pythonOk: boolean; layaImportOk: boolean; error?: string }>;
  predict: (input: {
    projectPath?: string | null;
    state: unknown;
    questions: unknown;
  }) => Promise<unknown>;
};

export function defaultSoftwareTeamLayaHost(): SoftwareTeamLayaHost {
  return {
    isDesktopHost: () => isDesktopHost(),
    probe: async () => {
      if (!isDesktopHost()) {
        return { pythonOk: false, layaImportOk: false, error: "need_host" };
      }
      return invoke<{ pythonOk: boolean; layaImportOk: boolean; error?: string }>(
        "software_team_laya_probe",
      );
    },
    predict: async (input) => {
      return invoke<unknown>("software_team_laya_predict", {
        projectPath: input.projectPath ?? null,
        requestJson: JSON.stringify({
          state: input.state,
          questions: input.questions,
        }),
      });
    },
  };
}

export async function runSoftwareTeamLayaSuggest(input: {
  enabled: boolean;
  layaEnabled: boolean;
  projectPath?: string | null;
  intents?: readonly SoftwareTeamLayaIntent[];
  state: Parameters<typeof buildSoftwareTeamLayaState>[0];
  minConfidence?: number;
  host: SoftwareTeamLayaHost;
}): Promise<
  | SoftwareTeamLayaParse
  | { ok: false; reason: SoftwareTeamLayaPlan["reason"]; error?: string }
> {
  const plan = planSoftwareTeamLayaDecide({
    enabled: input.enabled,
    layaEnabled: input.layaEnabled,
    hasHost: input.host.isDesktopHost(),
    projectPath: input.projectPath,
  });
  if (!plan.allowed) return { ok: false, reason: plan.reason };
  const probe = await input.host.probe();
  const afterProbe = planSoftwareTeamLayaDecide({
    ...plan,
    enabled: true,
    layaEnabled: true,
    hasHost: true,
    projectPath: input.projectPath,
    pythonOk: probe.pythonOk,
    layaImportOk: probe.layaImportOk,
  });
  if (!afterProbe.allowed) return { ok: false, reason: afterProbe.reason, error: probe.error };
  try {
    const raw = await input.host.predict({
      projectPath: input.projectPath,
      state: buildSoftwareTeamLayaState(input.state),
      questions: softwareTeamLayaQuestions(input.intents),
    });
    if (raw && typeof raw === "object" && (raw as { ok?: unknown }).ok === false) {
      const reason = (raw as { reason?: SoftwareTeamLayaPlan["reason"] }).reason ?? "host_error";
      return { ok: false, reason, error: (raw as { error?: string }).error };
    }
    return parseSoftwareTeamLayaResult(raw, { minConfidence: input.minConfidence });
  } catch (err) {
    return {
      ok: false,
      reason: "host_error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
