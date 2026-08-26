# Software Team DLC（可选工作区包）

Opt-in **workspace pack** for Grok App. Internal name: **Software Team DLC**. UI may say **AI Software DLC**.

This is **not** a rebrand of Grok App, and **not** a second agent runtime (Claude / Codex). Remote IM and the workbench still control **Grok Build** only.

## What it is

A downloadable-content **mode**: team roles + SDLC aliases on top of Hub agents / skills / workflows, Plan / Goal, and the existing Agent Kanban.

- **Off by default.** Ordinary Grok App users are unchanged.
- **Never auto-applies** an appearance skin (see [appearance-skins.md](./appearance-skins.md)).
- **Never rewrites** shared `GROK_HOME=~/.grok`. Pack files stay in-app unless the user installs to a **project** `.grok/` or **Independent** agent-home.

## Enable

| Surface | Detail |
|---------|--------|
| Setting | Settings → Extensions → **Agents** |
| Toggle | `Enable Software Team DLC` |
| Pref key | `grok.softwareTeamDlc.enabled` (`localStorage`, `"1"` / `"0"`) |
| Catalog id | `ext.softwareTeamDlc` |
| Anchor | `settings-anchor-software-team-dlc` |
| Deep link | `#/settings/extensions/agents` (scrolls to the DLC card) |

No Host `AppSettings` field — same pattern as Developer mode. Changing the toggle does not spawn agents and does not write `config.toml`.

## Roles (presets)

| Role | Pack / slash | Default SDLC |
|------|----------------|--------------|
| Product | `team-product` · `/team-product` | Backlog |
| Architect | `team-architect` · `/team-architect` | Design |
| Engineer | `team-engineer` · `/team-engineer` | Build |
| Reviewer | `team-reviewer` · `/team-reviewer` | Review |
| QA | `team-qa` · `/team-qa` | Review |
| Tech Writer | `team-writer` · `/team-writer` | Ship |

Each role is an **in-app** agent + skill template + starter prompt. The first slice does **not** add slash handlers in `AppWorkbench` (growth freeze). Users copy the starter into the composer, or tag a Kanban card.

**Team = multiple Grok Build sessions** (one role each) plus existing **attach-chat**. Do not spawn parallel CLI processes for this pack.

## SDLC → Kanban (no new board)

Live cards still sit in **Needs you / Working / Done / Idle** from run state (`kanbanBoard.ts`). Stages are **aliases + session tags**:

| SDLC | Kanban column |
|------|----------------|
| Backlog | Needs you |
| Design | Needs you |
| Build | Working |
| Review | Needs you |
| Ship | Done |
| (idle alias) | Idle → Backlog (idle) |

Session tags: `grok.softwareTeamDlc.sessionTags` (local). Right-click a Kanban card when the DLC is on. Tags do **not** move cards.

## Pack files

Pure helpers: `src/lib/softwareTeamDlc/`. Manifest is idempotent (`softwareTeamDlcPackManifest`).

Write planner: `planSoftwareTeamDlcPackWrite`.

| Target | Shared `~/.grok` | Independent agent-home | Project `.grok/` |
|--------|------------------|------------------------|------------------|
| `user` | **refused** (`blocked_shared_user`) | allowed | — |
| `project` | n/a (not GROK_HOME) | n/a | allowed if a project path is set |

First slice ships **in-app presets + copy starter**. Disk install is planned only; do not call Host scaffold APIs that write user GROK_HOME while shared.

## UI / i18n / dialogs

- Roster panel: `src/components/SoftwareTeamDlcPanel.tsx` (Extensions → Agents).
- Kanban overlay: `KanbanBoardPage` reads the enable pref; column aliases + `ContextMenu` for tags.
- Strings: `src/i18n/messages/*/software-team-dlc.ts` (15 locales, `en` authority).
- Controls: `UiSwitch` / `ContextMenu` — no `window.confirm`, no native `<select>`.

## Forbidden

- New `useState` / feature blocks in `src/App.tsx` or `src/app/AppWorkbench.tsx`.
- Auto-apply `.grokskin`.
- Claude / Codex runtime, Remote IM Phase 5, Session API scope creep.
- Claiming parallel multi-agent execution that the Host does not provide.

## Related

- Settings IA: [settings-ia.md](./settings-ia.md)
- Kanban columns: `src/lib/kanbanBoard.ts`
- Appearance: [appearance-skins.md](./appearance-skins.md)
- Dialogs: [dialogs.md](./dialogs.md)
- i18n: [i18n.md](./i18n.md)
