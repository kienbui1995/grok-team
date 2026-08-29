/**
 * Software Works — delivery detail (GlassModal).
 * Title, role history, Review/QA notes, next CTA, docs/sdlc, same-delivery sessions.
 */

import { useEffect, useMemo, useState } from "react";
import { GlassModal } from "@/components/GlassModal";
import { createT, intlLocale, type Locale, type MessageKey } from "@/i18n";
import {
  softwareTeamActivityMessageKey,
  softwareTeamRoleById,
  softwareTeamSuggestGitBranch,
  type SoftwareTeamDeliveryDetail,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamRoleId,
  type SoftwareTeamSdlcDocProbe,
} from "@/lib/softwareTeamDlc";

type TFn = (key: MessageKey, vars?: Record<string, string | number>) => string;

export type SdlcDeliveryDetailPaneProps = {
  open: boolean;
  locale: Locale;
  detail: SoftwareTeamDeliveryDetail | null;
  sdlcDocs: SoftwareTeamSdlcDocProbe[];
  onClose: () => void;
  onHandoff: (itemId: string) => void;
  onShip: (item: SoftwareTeamPipelineItem) => void;
  onOpenSdlcDoc: (relative: string) => void;
  onSelectSession?: (sessionId: string) => void;
  onExport?: () => void;
  onCopySummary?: () => void;
  onToggleArchive?: (archived: boolean) => void;
  onSaveGitBranch?: (branch: string) => boolean;
  onCopyGitBranch?: (branch: string) => void;
  onRenameDelivery?: (title: string) => boolean;
  onDuplicateDelivery?: () => void;
  missingRoles?: readonly SoftwareTeamRoleId[];
  onAddTeammate?: (roleId: SoftwareTeamRoleId) => void;
  onBindThisChat?: () => void;
  bindThisChatDisabled?: boolean;
  onUnbindSession?: () => void;
  onAddSdlcDocs?: () => void;
  onSaveSliceRefs?: (refs: {
    planRef: string;
    goalRef: string;
    artifactRef: string;
  }) => boolean;
  onSaveReviewNote?: (text: string) => void;
  onSaveQaNote?: (text: string) => void;
};

function formatActivityAt(locale: Locale, at: number): string {
  try {
    return new Date(at).toLocaleString(intlLocale(locale), {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return new Date(at).toISOString();
  }
}

export function SdlcDeliveryDetailPane({
  open,
  locale,
  detail,
  sdlcDocs,
  onClose,
  onHandoff,
  onShip,
  onOpenSdlcDoc,
  onSelectSession,
  onExport,
  onCopySummary,
  onToggleArchive,
  onSaveGitBranch,
  onCopyGitBranch,
  onRenameDelivery,
  onDuplicateDelivery,
  missingRoles = [],
  onAddTeammate,
  onBindThisChat,
  bindThisChatDisabled,
  onUnbindSession,
  onAddSdlcDocs,
  onSaveSliceRefs,
  onSaveReviewNote,
  onSaveQaNote,
}: SdlcDeliveryDetailPaneProps) {
  const tr = useMemo(() => createT(locale), [locale]);
  const t: TFn = (k, vars) => tr(k, vars);
  const presentDocs = sdlcDocs.filter((row) => row.exists);
  const focus = detail?.focusItem ?? null;
  const [branchDraft, setBranchDraft] = useState(detail?.gitBranch ?? "");
  const [titleDraft, setTitleDraft] = useState(detail?.title ?? "");
  const [planDraft, setPlanDraft] = useState(detail?.planRef ?? "");
  const [goalDraft, setGoalDraft] = useState(detail?.goalRef ?? "");
  const [artifactDraft, setArtifactDraft] = useState(detail?.artifactRef ?? "");
  const [reviewDraft, setReviewDraft] = useState(
    detail?.reviewNotes[0]?.text ?? "",
  );
  const [qaDraft, setQaDraft] = useState(detail?.qaNotes[0]?.text ?? "");
  useEffect(() => {
    setBranchDraft(detail?.gitBranch ?? "");
    setTitleDraft(detail?.title ?? "");
    setPlanDraft(detail?.planRef ?? "");
    setGoalDraft(detail?.goalRef ?? "");
    setArtifactDraft(detail?.artifactRef ?? "");
    setReviewDraft(detail?.reviewNotes[0]?.text ?? "");
    setQaDraft(detail?.qaNotes[0]?.text ?? "");
  }, [
    detail?.deliveryId,
    detail?.gitBranch,
    detail?.title,
    detail?.planRef,
    detail?.goalRef,
    detail?.artifactRef,
    detail?.reviewNotes,
    detail?.qaNotes,
  ]);

  return (
    <GlassModal
      open={open && !!detail}
      onClose={onClose}
      title={detail?.title || t("softwareTeamDlc.deliveryDetail")}
      closeLabel={t("window.close")}
      wrapBody
      size="lg"
      footer={
        <>
          {focus && detail?.cta.kind === "ship" ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                onShip(focus);
                onClose();
              }}
            >
              {t("softwareTeamDlc.shipCta")}
            </button>
          ) : null}
          {focus && detail?.cta.kind === "handoff" ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                onHandoff(focus.id);
                onClose();
              }}
            >
              {t("softwareTeamDlc.handoffCta", {
                role: t(
                  softwareTeamRoleById(detail.cta.nextRole)?.titleKey ??
                    "softwareTeamDlc.handoff",
                ),
              })}
            </button>
          ) : null}
          {onExport ? (
            <button type="button" className="btn btn--ghost" onClick={onExport}>
              {t("softwareTeamDlc.exportSummary")}
            </button>
          ) : null}
          {onCopySummary ? (
            <button type="button" className="btn btn--ghost" onClick={onCopySummary}>
              {t("softwareTeamDlc.copySummary")}
            </button>
          ) : null}
          {onDuplicateDelivery && detail?.deliveryId ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onDuplicateDelivery}
            >
              {t("softwareTeamDlc.duplicateDelivery")}
            </button>
          ) : null}
          {onToggleArchive ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onToggleArchive(!detail?.archived)}
            >
              {detail?.archived
                ? t("softwareTeamDlc.unarchiveDelivery")
                : t("softwareTeamDlc.archiveDelivery")}
            </button>
          ) : null}
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {t("window.close")}
          </button>
        </>
      }
    >
      {detail ? (
        <div className="sdlc-studio__form">
          <p className="sdlc-studio__slash-note">
            {t("softwareTeamDlc.deliveryDetailHint")}
          </p>
          {onRenameDelivery && detail.deliveryId ? (
            <div className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.deliveryName")}</span>
              <input
                className="settings-input"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder={t("softwareTeamDlc.startDeliveryTitlePlaceholder")}
                autoComplete="off"
                spellCheck={false}
                aria-label={t("softwareTeamDlc.deliveryName")}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => onRenameDelivery(titleDraft)}
              >
                {t("softwareTeamDlc.deliveryRename")}
              </button>
            </div>
          ) : null}
          {detail.archived ? (
            <p className="sdlc-studio__slash-note" role="status">
              {t("softwareTeamDlc.archived")}
            </p>
          ) : null}
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.roleHistory", {
              roles: detail.roleHistory
                .map((roleId) =>
                  t(
                    softwareTeamRoleById(roleId)?.titleKey ??
                      "softwareTeamDlc.rosterTitle",
                  ),
                )
                .join(" → ") || t("softwareTeamDlc.notesEmpty"),
            })}</span>
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.gitBranch")}</span>
            <input
              className="settings-input"
              value={branchDraft}
              onChange={(e) => setBranchDraft(e.target.value)}
              placeholder={t("softwareTeamDlc.gitBranchPlaceholder")}
              autoComplete="off"
              spellCheck={false}
              aria-label={t("softwareTeamDlc.gitBranch")}
            />
            <p className="sdlc-studio__slash-note">{t("softwareTeamDlc.gitBranchHint")}</p>
            <div className="sdlc-studio__chips" role="group">
              {onSaveGitBranch ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => onSaveGitBranch(branchDraft)}
                >
                  {t("softwareTeamDlc.gitBranchSave")}
                </button>
              ) : null}
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() =>
                  setBranchDraft(softwareTeamSuggestGitBranch(detail.title))
                }
              >
                {t("softwareTeamDlc.gitBranchSuggest")}
              </button>
              {onCopyGitBranch && branchDraft.trim() ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => onCopyGitBranch(branchDraft)}
                >
                  {t("softwareTeamDlc.gitBranchCopy")}
                </button>
              ) : null}
            </div>
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.planRef")}</span>
            <input
              className="settings-input"
              value={planDraft}
              onChange={(e) => setPlanDraft(e.target.value)}
              placeholder={t("softwareTeamDlc.planPlaceholder")}
              autoComplete="off"
              spellCheck={false}
              aria-label={t("softwareTeamDlc.planRef")}
            />
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.goalRef")}</span>
            <input
              className="settings-input"
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              placeholder={t("softwareTeamDlc.goalPlaceholder")}
              autoComplete="off"
              spellCheck={false}
              aria-label={t("softwareTeamDlc.goalRef")}
            />
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.artifactRef")}</span>
            <input
              className="settings-input"
              value={artifactDraft}
              onChange={(e) => setArtifactDraft(e.target.value)}
              placeholder={t("softwareTeamDlc.artifactPlaceholder")}
              autoComplete="off"
              spellCheck={false}
              aria-label={t("softwareTeamDlc.artifactRef")}
            />
            <p className="sdlc-studio__slash-note">
              {t("softwareTeamDlc.sliceRefsHint")}
            </p>
            {onSaveSliceRefs ? (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() =>
                  onSaveSliceRefs({
                    planRef: planDraft,
                    goalRef: goalDraft,
                    artifactRef: artifactDraft,
                  })
                }
              >
                {t("softwareTeamDlc.saveSliceRefs")}
              </button>
            ) : null}
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.reviewNote")}</span>
            <textarea
              className="settings-input"
              rows={4}
              value={reviewDraft}
              onChange={(e) => setReviewDraft(e.target.value)}
              placeholder={t("softwareTeamDlc.reviewNotePlaceholder")}
              aria-label={t("softwareTeamDlc.reviewNote")}
            />
            {onSaveReviewNote ? (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => onSaveReviewNote(reviewDraft)}
              >
                {t("common.save")}
              </button>
            ) : null}
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.qaNote")}</span>
            <textarea
              className="settings-input"
              rows={4}
              value={qaDraft}
              onChange={(e) => setQaDraft(e.target.value)}
              placeholder={t("softwareTeamDlc.qaNotePlaceholder")}
              aria-label={t("softwareTeamDlc.qaNote")}
            />
            {onSaveQaNote ? (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => onSaveQaNote(qaDraft)}
              >
                {t("common.save")}
              </button>
            ) : null}
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.openSdlcDocs")}</span>
            {presentDocs.length ? (
              <div className="sdlc-studio__chips" role="group">
                {presentDocs.map((row) => (
                  <button
                    key={row.relative}
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => onOpenSdlcDoc(row.relative)}
                  >
                    {t("softwareTeamDlc.openSdlcDoc", {
                      file: row.relative.split("/").pop() ?? row.relative,
                    })}
                  </button>
                ))}
              </div>
            ) : (
              <p className="sdlc-studio__slash-note">
                {t("softwareTeamDlc.openSdlcDocMissing")}
              </p>
            )}
            {onAddSdlcDocs ? (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={onAddSdlcDocs}
              >
                {t("softwareTeamDlc.addSdlcDocs")}
              </button>
            ) : null}
          </div>
          <div className="sdlc-studio__field">
            <span>
              {missingRoles.length
                ? t("softwareTeamDlc.missingRoles", {
                    roles: missingRoles
                      .map((roleId) =>
                        t(
                          softwareTeamRoleById(roleId)?.titleKey ??
                            "softwareTeamDlc.rosterTitle",
                        ),
                      )
                      .join(", "),
                  })
                : t("softwareTeamDlc.teamComplete")}
            </span>
            {onAddTeammate && missingRoles.length ? (
              <div className="sdlc-studio__chips" role="group">
                {missingRoles.map((roleId) => (
                  <button
                    key={roleId}
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => onAddTeammate(roleId)}
                  >
                    {t("softwareTeamDlc.addTeammate", {
                      role: t(
                        softwareTeamRoleById(roleId)?.titleKey ??
                          "softwareTeamDlc.rosterTitle",
                      ),
                    })}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.deliverySessions")}</span>
            <div className="sdlc-studio__chips" role="group">
              {onBindThisChat ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  disabled={bindThisChatDisabled}
                  onClick={onBindThisChat}
                >
                  {t("softwareTeamDlc.bindThisChat")}
                </button>
              ) : null}
              {onUnbindSession ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={onUnbindSession}
                >
                  {t("softwareTeamDlc.clearTag")}
                </button>
              ) : null}
            </div>
            {detail.sessions.length ? (
              <div className="sdlc-studio__sessions" role="list">
                {detail.sessions.map((session) => (
                  <button
                    key={session.sessionId}
                    type="button"
                    className="sdlc-studio__session"
                    onClick={() => onSelectSession?.(session.sessionId)}
                  >
                    {t(softwareTeamRoleById(session.roleId)?.titleKey ?? "softwareTeamDlc.sessionLabel")}
                    {" · "}
                    {session.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="sdlc-studio__slash-note">
                {t("softwareTeamDlc.deliveryNoSessions")}
              </p>
            )}
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.activityLog")}</span>
            {detail.activity.length ? (
              <ul className="sdlc-studio__activity">
                {[...detail.activity].reverse().map((event, index) => (
                  <li
                    key={`${event.at}-${event.type}-${event.itemId}-${index}`}
                    className="sdlc-studio__activity-item"
                  >
                    {formatActivityAt(locale, event.at)}
                    {" · "}
                    {t(softwareTeamActivityMessageKey(event.type))}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sdlc-studio__slash-note">
                {t("softwareTeamDlc.activityEmpty")}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </GlassModal>
  );
}
