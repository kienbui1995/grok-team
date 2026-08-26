/**
 * Settings → Extensions → Agents: Software Works edition toggle.
 * Roster / board / handoff live in SDLC Studio (Agents pane), not here.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { createT, type Locale, type MessageKey } from "@/i18n";
import { UiSwitch } from "@/components/settings/shared";
import { useSettingsModel } from "@/providers/SettingsModelContext";
import { useSoftwareTeamDlcPref } from "@/hooks/useSoftwareTeamDlc";
import {
  SOFTWARE_TEAM_DLC_INSTALL_TARGETS,
  SOFTWARE_TEAM_ROLES,
  SOFTWARE_TEAM_SDLC_STAGES,
  installSoftwareTeamDlcPack,
  planSoftwareTeamDlcPackWrite,
  probeSoftwareTeamDlcPack,
  repairSoftwareTeamDlcPack,
  softwareTeamDlcPackManifest,
  softwareTeamInstallFailMessageKey,
  softwareTeamPackStatusMessageKey,
  softwareTeamRoleSlashHint,
  type SoftwareTeamDlcInstallTarget,
  type SoftwareTeamPackStatus,
} from "@/lib/softwareTeamDlc";

type TFn = (key: MessageKey, vars?: Record<string, string | number>) => string;

export function SoftwareTeamDlcPanel({ locale }: { locale: Locale }) {
  const tr = useMemo(() => createT(locale), [locale]);
  const t: TFn = (k, vars) => tr(k, vars);
  const { enabled, setEnabled } = useSoftwareTeamDlcPref();
  const settings = useSettingsModel();
  const sessionDataMode = String(settings.sessionDataMode ?? "shared");
  const projectPath = settings.projectPath ?? null;
  const [installTarget, setInstallTarget] =
    useState<SoftwareTeamDlcInstallTarget>(() =>
      (projectPath ?? "").trim() ? "project" : "user",
    );
  const [installing, setInstalling] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [probing, setProbing] = useState(false);
  const [packStatus, setPackStatus] = useState<SoftwareTeamPackStatus | null>(
    null,
  );
  const [installStatus, setInstallStatus] = useState<string | null>(null);

  const refreshPackStatus = useCallback(async () => {
    setProbing(true);
    try {
      const status = await probeSoftwareTeamDlcPack({
        sessionDataMode,
        target: installTarget,
        projectPath,
      });
      setPackStatus(status);
      return status;
    } finally {
      setProbing(false);
    }
  }, [installTarget, projectPath, sessionDataMode]);

  useEffect(() => {
    if (!enabled) return;
    void refreshPackStatus();
  }, [enabled, refreshPackStatus]);

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

  const sharedUserPlan = planSoftwareTeamDlcPackWrite({
    sessionDataMode,
    target: "user",
  });
  const projectPlan = planSoftwareTeamDlcPackWrite({
    sessionDataMode,
    target: "project",
    projectPath,
  });
  const manifest = softwareTeamDlcPackManifest();

  return (
    <section
      className="ext-ref-block software-team-dlc"
      id="settings-anchor-software-team-dlc"
      data-testid="software-team-dlc-panel"
    >
      <div className="settings-row">
        <div className="settings-row__text">
          <div className="settings-row__label">{t("softwareTeamDlc.enable")}</div>
          <div className="settings-row__desc">{t("softwareTeamDlc.enableDesc")}</div>
        </div>
        <UiSwitch
          checked={enabled}
          label={t("softwareTeamDlc.enable")}
          onChange={setEnabled}
        />
      </div>

      <p className="ext-ref-block__lead">{t("softwareTeamDlc.optInNote")}</p>
      <p className="ext-ref-block__lead">{t("softwareTeamDlc.noSkinAutoApply")}</p>
      <p className="ext-ref-block__lead">{t("softwareTeamDlc.sharedHomeNote")}</p>
      <p className="ext-ref-block__lead">
        {t("softwareTeamDlc.honesty.grokBuildOnly")}
      </p>
      <p className="ext-ref-block__lead">
        {t("softwareTeamDlc.honesty.noParallelAgents")}
      </p>

      {sharedUserPlan.rewritesSharedGrokHome ? (
        <p className="ext-ref-block__lead" role="note">
          {t("softwareTeamDlc.install.blockedShared")}
        </p>
      ) : (
        <p className="ext-ref-block__lead" role="note">
          {t("softwareTeamDlc.install.independentOk")}
        </p>
      )}
      {!projectPlan.allowed && projectPlan.reason === "need_project" ? (
        <p className="ext-ref-block__lead">{t("softwareTeamDlc.install.needProject")}</p>
      ) : null}

      {enabled ? (
        <>
          <p className="ext-ref-block__lead">{t("softwareTeamDlc.openStudio")}</p>
          <div className="ext-ref-section-label">{t("softwareTeamDlc.rosterTitle")}</div>
          <p className="ext-ref-block__lead">{t("softwareTeamDlc.rosterHint")}</p>
          <ul className="software-team-dlc__roster" role="list">
            {SOFTWARE_TEAM_ROLES.map((role) => (
              <li key={role.id} className="software-team-dlc__role">
                <div className="software-team-dlc__role-head">
                  <strong>{t(role.titleKey)}</strong>
                  <span className="software-team-dlc__slash">
                    {t("softwareTeamDlc.slashHint", {
                      slash: softwareTeamRoleSlashHint(role),
                    })}
                  </span>
                </div>
                <p className="software-team-dlc__role-desc">{t(role.descKey)}</p>
              </li>
            ))}
          </ul>

          <div className="ext-ref-section-label">{t("softwareTeamDlc.sdlcTitle")}</div>
          <p className="ext-ref-block__lead">{t("softwareTeamDlc.sdlcHint")}</p>
          <ul className="software-team-dlc__stages" role="list">
            {SOFTWARE_TEAM_SDLC_STAGES.map((stage) => (
              <li key={stage.id}>
                <strong>{t(stage.titleKey)}</strong>
              </li>
            ))}
          </ul>

          <div className="ext-ref-section-label">{t("softwareTeamDlc.packTitle")}</div>
          <p className="ext-ref-block__lead">{t("softwareTeamDlc.packHint")}</p>
          <p className="ext-ref-block__lead">
            {manifest.agents.join(" · ")} · {manifest.workflows.join(" · ")}
          </p>
          <p className="ext-ref-block__lead">{t("softwareTeamDlc.slashAfterInstall")}</p>
          <div className="sdlc-studio__chips" role="group" aria-label={t("softwareTeamDlc.install.chooseTarget")}>
            {SOFTWARE_TEAM_DLC_INSTALL_TARGETS.map((target) => (
              <button
                key={target}
                type="button"
                className={
                  "task-board__chip" + (installTarget === target ? " is-active" : "")
                }
                onClick={() => setInstallTarget(target)}
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
            disabled={installing}
            onClick={() => {
              setInstalling(true);
              void installSoftwareTeamDlcPack({
                sessionDataMode,
                target: installTarget,
                projectPath,
              })
                .then(async (result) => {
                  if (result.ok) {
                    setInstallStatus(
                      t("softwareTeamDlc.install.ok", {
                        n: result.files.length,
                        target: t(
                          result.target === "project"
                            ? "softwareTeamDlc.install.targetProject"
                            : "softwareTeamDlc.install.targetUser",
                        ),
                      }),
                    );
                    await refreshPackStatus();
                    return;
                  }
                  const key = softwareTeamInstallFailMessageKey(result.reason);
                  setInstallStatus(
                    result.reason === "host_error"
                      ? t(key, { error: result.error ?? "" })
                      : t(key),
                  );
                  await refreshPackStatus();
                })
                .finally(() => setInstalling(false));
            }}
          >
            {installing
              ? t("softwareTeamDlc.install.installing")
              : t("softwareTeamDlc.install.action")}
          </button>
          {packStatus?.kind === "missing" ? (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              disabled={repairing}
              onClick={() => {
                setRepairing(true);
                void repairSoftwareTeamDlcPack({
                  sessionDataMode,
                  target: installTarget,
                  projectPath,
                  status: packStatus,
                })
                  .then(async (result) => {
                    setInstallStatus(
                      result.ok && result.files.length === 0
                        ? t("softwareTeamDlc.install.repairNone")
                        : result.ok
                          ? t("softwareTeamDlc.install.repaired", {
                              n: result.files.length,
                            })
                          : result.reason === "host_error"
                            ? t(
                                softwareTeamInstallFailMessageKey(result.reason),
                                { error: result.error ?? "" },
                              )
                            : t(softwareTeamInstallFailMessageKey(result.reason)),
                    );
                    await refreshPackStatus();
                  })
                  .finally(() => setRepairing(false));
              }}
            >
              {repairing
                ? t("softwareTeamDlc.install.repairing")
                : t("softwareTeamDlc.install.repair")}
            </button>
          ) : null}
          {probing || packStatus ? (
            <p className="ext-ref-block__lead" role="status">
              {probing
                ? t("softwareTeamDlc.install.status.checking")
                : packStatus
                  ? describePackStatus(packStatus)
                  : null}
            </p>
          ) : null}
          {installStatus ? (
            <p className="ext-ref-block__lead" role="status">
              {installStatus}
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
