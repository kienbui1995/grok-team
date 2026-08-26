# Software Works / SDLC Studio

Opt-in **software-delivery edition** for Grok App. When on, the Agents pane **is** the product for making software: roster, pipeline board, and role handoff. When off, ordinary Grok App is unchanged.

Internal pref key stays `grok.softwareTeamDlc.*` (stable). UI says **Software Works** / **SDLC Studio**.

This is **not** a rebrand of the whole app, and **not** a second agent runtime (Claude / Codex). Remote IM and the workbench still control **Grok Build** only.

## What it is

A single pipeline for a slice of software:

1. Bind a Grok Build session to a role.
2. Move the item on the SDLC board (Backlog → Design → Build → Review → Ship).
3. Hand off Product → Architect → Engineer → Reviewer → QA → Writer. The item’s stage updates and the next-role starter is copied (no new CLI process).

Plan / goal / artifact fields live on the work item so the next role sees the same slice.

- **Off by default.** Ordinary Grok App users are unchanged.
- **Never auto-applies** an appearance skin (see [appearance-skins.md](./appearance-skins.md)).
- **Never rewrites** shared `GROK_HOME=~/.grok`. Pack files stay in-app unless the user installs to a **project** `.grok/` or **Independent** agent-home.

## Enable

| Surface | Detail |
|---------|--------|
| Setting | Settings → Extensions → **Agents** |
| Toggle | `Enable Software Works` |
| Pref key | `grok.softwareTeamDlc.enabled` (`localStorage`, `"1"` / `"0"`) |
| Catalog id | `ext.softwareTeamDlc` |
| Anchor | `settings-anchor-software-team-dlc` |
| Deep link | `#/settings/extensions/agents` |
| Studio | Sidebar **Agents** (Kanban pane) becomes **SDLC Studio** |

No Host `AppSettings` field — same pattern as Developer mode. Changing the toggle does not spawn agents and does not write `config.toml`.

## Pipeline (source of truth)

Store: `grok.softwareTeamDlc.pipeline` (`src/lib/softwareTeamDlc/pipeline.ts`).

Each work item: `sessionId` + `roleId` + `stageId` + title + `planRef` / `goalRef` / `artifactRef`.

| Write | Effect |
|-------|--------|
| Board stage change | Updates the item (`stageSource: board`) and **rewrites** session tags from the store. |
| Live session `working` / `done` | Maps to Build / Ship (`stageSource: session`). `needs_you` / `idle` do **not** overwrite Design / Review / Backlog. |
| Handoff | Next role + that role’s default stage (`stageSource: handoff`) + starter text. |
| Session tags | Projection only (`grok.softwareTeamDlc.sessionTags`). Never a second dead overlay. Legacy tags hydrate into items on first load. |

Does not change Host session schema. Does not spawn CLI processes.

## Roles

| Role | Pack / slash hint | Default stage | Next handoff |
|------|-------------------|---------------|--------------|
| Product | `team-product` · `/team-product` | Backlog | Architect |
| Architect | `team-architect` · `/team-architect` | Design | Engineer |
| Engineer | `team-engineer` · `/team-engineer` | Build | Reviewer |
| Reviewer | `team-reviewer` · `/team-reviewer` | Review | QA |
| QA | `team-qa` · `/team-qa` | Review | Writer |
| Tech Writer | `team-writer` · `/team-writer` | Ship | (done) |

Slash names are **hints on the roster**. First-class entry is the studio (copy starter / handoff). `AppWorkbench.applySlashItem` is not extended (growth freeze).

**Team = bound Grok Build sessions** plus existing **attach-chat**. Do not spawn parallel CLI processes.

## UI

- Settings card: `src/components/SoftwareTeamDlcPanel.tsx` (enable + honesty).
- Studio: `src/components/SdlcStudioPage.tsx` from `KanbanBoardPage` when the edition is on. Live agent columns remain a second tab.
- Sidebar / title: `WorkbenchSidebar` / `WorkbenchMain` relabel Agents → SDLC Studio when on.
- Controls: chips, `ContextMenu`, `GlassModal` — no `window.confirm`, no native `<select>`.
- Strings: `src/i18n/messages/*/software-team-dlc.ts` (15 locales, `en` authority).

## Pack files

Helpers: `src/lib/softwareTeamDlc/`. Manifest is idempotent (`softwareTeamDlcPackManifest`).

Write planner: `planSoftwareTeamDlcPackWrite`.

| Target | Shared `~/.grok` | Independent agent-home | Project `.grok/` |
|--------|------------------|------------------------|------------------|
| `user` | **refused** (`blocked_shared_user`) | allowed | — |
| `project` | n/a (not GROK_HOME) | n/a | allowed if a project path is set |

Disk install is planned only; do not call Host scaffold APIs that write user GROK_HOME while shared.

## Forbidden

- New `useState` / feature blocks in `src/App.tsx` or `src/app/AppWorkbench.tsx`.
- Auto-apply `.grokskin`.
- Claude / Codex runtime, Remote IM, Session API scope creep.
- Claiming parallel multi-agent execution that the Host does not provide.
- Full-repo rebrand while the edition is off.

## Related

- Settings IA: [settings-ia.md](./settings-ia.md)
- Kanban columns: `src/lib/kanbanBoard.ts`
- Appearance: [appearance-skins.md](./appearance-skins.md)
- Dialogs: [dialogs.md](./dialogs.md)
- i18n: [i18n.md](./i18n.md)
