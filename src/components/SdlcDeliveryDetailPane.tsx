/**
 * Software Works — delivery detail (GlassModal).
 * Title, role history, Review/QA notes, next CTA, docs/sdlc, same-delivery sessions.
 */

import { useMemo } from "react";
import { GlassModal } from "@/components/GlassModal";
import { createT, intlLocale, type Locale, type MessageKey } from "@/i18n";
import {
  softwareTeamActivityMessageKey,
  softwareTeamRoleById,
  type SoftwareTeamDeliveryDetail,
  type SoftwareTeamPipelineItem,
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
}: SdlcDeliveryDetailPaneProps) {
  const tr = useMemo(() => createT(locale), [locale]);
  const t: TFn = (k, vars) => tr(k, vars);
  const presentDocs = sdlcDocs.filter((row) => row.exists);
  const focus = detail?.focusItem ?? null;

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
            <span>{t("softwareTeamDlc.reviewNote")}</span>
            {detail.reviewNotes.length ? (
              <ul className="sdlc-studio__activity">
                {detail.reviewNotes.map((note) => (
                  <li key={`review-${note.itemId}`} className="sdlc-studio__activity-item">
                    {note.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sdlc-studio__slash-note">{t("softwareTeamDlc.notesEmpty")}</p>
            )}
          </div>
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.qaNote")}</span>
            {detail.qaNotes.length ? (
              <ul className="sdlc-studio__activity">
                {detail.qaNotes.map((note) => (
                  <li key={`qa-${note.itemId}`} className="sdlc-studio__activity-item">
                    {note.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sdlc-studio__slash-note">{t("softwareTeamDlc.notesEmpty")}</p>
            )}
          </div>
          {presentDocs.length ? (
            <div className="sdlc-studio__field">
              <span>{t("softwareTeamDlc.openSdlcDocs")}</span>
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
            </div>
          ) : null}
          <div className="sdlc-studio__field">
            <span>{t("softwareTeamDlc.deliverySessions")}</span>
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
