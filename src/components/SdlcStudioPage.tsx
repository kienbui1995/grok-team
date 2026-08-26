/**
 * Software Works — first-class SDLC Studio (roster + pipeline + handoff).
 * Mounted from the Agents / Kanban pane when the edition is on.
 */

import { useCallback, useMemo, useState } from "react";
import type { Locale, MessageKey } from "@/i18n";
import { createT } from "@/i18n";
import { ContextMenu, type ContextMenuItem } from "@/components/ContextMenu";
import { GlassModal } from "@/components/GlassModal";
import { useSoftwareTeamPipeline } from "@/hooks/useSoftwareTeamDlc";
import type { AgentDashboardSessionInput } from "@/lib/agentDashboard";
import {
  SOFTWARE_TEAM_ROLES,
  SOFTWARE_TEAM_SDLC_STAGES,
  nextSoftwareTeamRole,
  softwareTeamRoleById,
  softwareTeamRoleSlashHint,
  softwareTeamRoleStarterPrompt,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamRoleId,
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

function emptyDraft(
  roleId: SoftwareTeamRoleId = "product",
  sessionId = "",
): ItemDraft {
  const role = softwareTeamRoleById(roleId);
  return {
    title: "",
    roleId,
    stageId: role?.defaultStage ?? "backlog",
    sessionId,
    planRef: "",
    goalRef: "",
    artifactRef: "",
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
  currentSessionId?: string | null;
  untitledLabel?: string;
  onSelectSession?: (sessionId: string) => void;
  onShowLive?: () => void;
};

export function SdlcStudioPage({
  locale,
  sessions,
  currentSessionId,
  untitledLabel,
  onSelectSession,
  onShowLive,
}: SdlcStudioPageProps) {
  const tr = useMemo(() => createT(locale), [locale]);
  const t: TFn = (k, vars) => tr(k, vars);
  const pipeline = useSoftwareTeamPipeline();
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [editor, setEditor] = useState<ItemDraft | null>(null);
  const [menu, setMenu] = useState<{
    itemId: string;
    x: number;
    y: number;
  } | null>(null);

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pipeline.items;
    return pipeline.items.filter((item) => {
      const hay = [
        item.title,
        item.planRef,
        item.goalRef,
        item.artifactRef,
        item.sessionId,
        item.roleId,
        item.stageId,
        item.sessionId ? sessionTitle(item.sessionId) : "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [pipeline.items, query, sessionTitle]);

  const onCopyStarter = useCallback(
    async (roleId: SoftwareTeamRoleId) => {
      const ok = await copyText(softwareTeamRoleStarterPrompt(roleId));
      setCopyError(!ok);
      setCopied(ok ? `role:${roleId}` : null);
      setStatus(ok ? t("softwareTeamDlc.copied") : t("softwareTeamDlc.copyFailed"));
    },
    [t],
  );

  const onHandoff = useCallback(
    async (itemId: string) => {
      const result = pipeline.handoff(itemId);
      if (!result) return;
      if (result.kind === "done") {
        setStatus(t("softwareTeamDlc.handoffDone"));
        return;
      }
      const ok = await copyText(result.starter);
      setCopyError(!ok);
      setCopied(ok ? `handoff:${itemId}` : null);
      setStatus(
        ok
          ? t("softwareTeamDlc.handoffCopied")
          : t("softwareTeamDlc.copyFailed"),
      );
    },
    [pipeline, t],
  );

  const openCreate = (roleId?: SoftwareTeamRoleId) => {
    setEditor(
      emptyDraft(roleId ?? "product", currentSessionId ?? ""),
    );
  };

  const saveEditor = () => {
    if (!editor) return;
    if (editor.id) {
      pipeline.updateItem(editor.id, {
        title: editor.title,
        roleId: editor.roleId,
        stageId: editor.stageId,
        sessionId: editor.sessionId,
        planRef: editor.planRef,
        goalRef: editor.goalRef,
        artifactRef: editor.artifactRef,
        stageSource: "board",
      });
    } else {
      pipeline.addItem({
        title: editor.title,
        roleId: editor.roleId,
        stageId: editor.stageId,
        sessionId: editor.sessionId,
        planRef: editor.planRef,
        goalRef: editor.goalRef,
        artifactRef: editor.artifactRef,
        stageSource: "board",
      });
    }
    setEditor(null);
  };

  const menuItem = menu ? pipeline.items.find((i) => i.id === menu.itemId) : null;
  const menuItems: ContextMenuItem[] = useMemo(() => {
    if (!menu || !menuItem) return [];
    const nextRole = nextSoftwareTeamRole(menuItem.roleId);
    const items: ContextMenuItem[] = [
      {
        label: t("softwareTeamDlc.assignStage"),
        children: SOFTWARE_TEAM_SDLC_STAGES.map((stage) => ({
          id: `stage-${stage.id}`,
          label: t("softwareTeamDlc.moveStage", { stage: t(stage.titleKey) }),
          onClick: () => pipeline.setStage(menuItem.id, stage.id),
        })),
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
    items.push({
      label: t("softwareTeamDlc.removeItem"),
      danger: true,
      onClick: () => pipeline.removeItem(menuItem.id),
    });
    return items;
  }, [menu, menuItem, onHandoff, onSelectSession, pipeline, t]);

  return (
    <div className="auto-page agent-kanban-page sdlc-studio" data-testid="sdlc-studio">
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

        <div className="agent-kanban__toolbar">
          <input
            type="search"
            className="settings-input agent-kanban__search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("kanban.searchPlaceholder")}
            autoComplete="off"
            spellCheck={false}
            aria-label={t("kanban.searchPlaceholder")}
          />
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => openCreate()}
          >
            {t("softwareTeamDlc.addItem")}
          </button>
        </div>

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
                            onClick={() => {
                              if (item.sessionId) onSelectSession?.(item.sessionId);
                              else setEditor(draftFromItem(item));
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setMenu({ itemId: item.id, x: e.clientX, y: e.clientY });
                            }}
                          >
                            <span className="agent-kanban__card-title">
                              {displayTitle(item)}
                            </span>
                            <span className="agent-kanban__card-team">
                              {t(softwareTeamRoleById(item.roleId)?.titleKey ?? "softwareTeamDlc.rosterTitle")}
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
                          </button>
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
            <button type="button" className="btn" onClick={saveEditor}>
              {t("common.save")}
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
                {SOFTWARE_TEAM_SDLC_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    type="button"
                    className={
                      "task-board__chip" + (editor.stageId === stage.id ? " is-active" : "")
                    }
                    onClick={() => setEditor({ ...editor, stageId: stage.id })}
                  >
                    {t(stage.titleKey)}
                  </button>
                ))}
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
          </div>
        ) : null}
      </GlassModal>
    </div>
  );
}
