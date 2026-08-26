# Software Works / SDLC Studio

Opt-in **software-delivery edition** for Grok App. When on, the Agents pane **is** the product for making software: roster, pipeline board, role handoff, pack install, and opening a Grok Build session with the role starter already in the composer. When off, ordinary Grok App is unchanged.

Internal pref key stays `grok.softwareTeamDlc.*` (stable). UI says **Software Works** / **SDLC Studio**.

This is **not** a rebrand of the whole app, and **not** a second agent runtime (Claude / Codex). Remote IM and the workbench still control **Grok Build** only.

## What it is

A single pipeline for a slice of software:

1. Install the role pack (optional, honest Host write) into **project `.grok/`** or **Independent** agent-home.
2. Add a work item or click a card: **open or create** a Grok Build session and put the role starter **in the composer** (not clipboard-only).
3. Move the item on the SDLC board (Backlog → Design → Build → Review → Ship).
4. Hand off Product → Architect → Engineer → Reviewer → QA → Writer. The item’s stage updates and the next-role starter is loaded into that session’s composer (or a new session if Host `sessionCreate` is available).

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

Each work item: `sessionId` + `roleId` + `stageId` + title + `planRef` / `goalRef` / `artifactRef` + `roleHistory` + `reviewNote` / `qaNote`.

| Write | Effect |
|-------|--------|
| Board stage change | Updates the item (`stageSource: board`) and **rewrites** session tags from the store. |
| Live session `working` / `done` | Maps to Build / Ship (`stageSource: session`). `needs_you` / `idle` do **not** overwrite Design / Review / Backlog. |
| Handoff | Next role + that role’s default stage (`stageSource: handoff`) + starter text into the composer. |
| Session tags | Projection only (`grok.softwareTeamDlc.sessionTags`). Never a second dead overlay. Legacy tags hydrate into items on first load. |

Does not change Host session schema. Does not spawn CLI processes.

## Open session + composer (not copy-paste)

Helpers: `src/lib/softwareTeamDlc/sessionLaunch.ts`.

| Step | API / store | Honesty |
|------|-------------|---------|
| Create session | `api.sessionCreate` when `api.hasHost()` | Browser preview without Host → refuse (`need_host`). Does not fake an id. |
| Seed composer | `saveComposerSessionDraft` + live `setDraft` when already on that session | Same-session **must not** call `openSession` — `stashLeaving` would overwrite the starter. |
| Switch session | existing `onSelectSession` / `openSessionById` | Stash the *other* session, restore ours (draft already saved). |
| Go to chat (same session) | `window.location.hash = "#/workbench"` | `resolveWorkbenchHash` → chat pane. No AppWorkbench growth. |
| Plan attach | `api.sessionPlanChromeSet` when Tauri/mirror | Chrome is void (no plan document id). If the invoke later returns `{ id }` / `{ planId }`, that id is written to `planRef`. Otherwise keep the card text. Do not invent a Host plan document. |
| Goal | session draft `goalMode: true` when `goalRef` is set | No Host “create goal” API in production (`createGoalEntity` is optional and omitted). Field + starter line stay honest. A Host goal id is written to `goalRef` only if that optional hook returns one. |
| Artifact | field + starter line | No fake Host write. |

Handoff uses the same launch path with the next-role starter. No second CLI process.

## Install pack (honesty)

Helpers: `src/lib/softwareTeamDlc/install.ts` + planner `planSoftwareTeamDlcPackWrite`.

Button: SDLC Studio toolbar and Settings → Extensions → Agents (when the edition is on).

Sequence (desktop Host only — `api.isDesktopHost()`):

1. Planner gate (shared + `user` → `blocked_shared_user`; project without path → `need_project`).
2. `agentsScaffold` (force) then `fsWriteAbsolute` with pack body (file must already exist).
3. `skillCreate` (idempotent) then `skillWrite` with pack `SKILL.md`.
4. `workflowsCreate` (force) then `fsWriteAbsolute` for `team-handoff.rhai`.

| Result | Meaning |
|--------|---------|
| `ok` | All 13 files written through Host APIs. |
| `need_host` | Not desktop Tauri. **Never** reports success. |
| `blocked_shared_user` / `need_project` | Planner refuse; no Host calls. |
| `host_error` | A Host call threw; partial file list is returned, success is **false**. |

Do **not** call `agentsScaffold` / `skillCreate` with `scope: "user"` while session data is **shared**.

## Install status + repair

Helpers: `src/lib/softwareTeamDlc/installStatus.ts`.

On every Studio open (and Settings when the edition is on), probe Host `agentsList` / `skillsList` / `workflowsList` for the **chosen target**. A file counts as present only when the listed name matches **and** the listed scope matches the target (`project` / `workspace` / `local` vs `user` / `agent-home` / `independent`). Empty lists are **missing**, never installed.

| Status | Meaning |
|--------|---------|
| `installed` | All 13 files listed on that target. |
| `missing` | Some names absent or wrong scope. Repair writes **only** those names (`onlyNames`). |
| `blocked_shared` | Shared `~/.grok` + user target. No Host write. |
| `need_project` | Project target with no folder. |
| `need_host` | Not desktop Tauri. Does not fake success. |
| `host_error` | List/write threw. Success is false. |

Repair is idempotent. Shared user writes still refuse.

## Review → QA → Ship gate

Helpers: `src/lib/softwareTeamDlc/shipGate.ts`.

Ship is blocked (UI chips / context menu **and** `setPipelineItemStage` / live `done` / QA→Writer handoff) until:

1. The item has visited **Reviewer** and **QA** (`roleId` or `roleHistory`).
2. Non-empty **`reviewNote`** and **`qaNote`** (persisted on the pipeline item).

Legacy items already stored as `ship` stay there. New writes and handoff to Writer without notes stay on **Review**.

Reviewer / QA starters (open + handoff) include an English checklist: **diff / test / risk**. Notes are edited in `GlassModal` (Mark Reviewer notes / Mark QA notes) — no `window.prompt`.

## Slash `/team-*`

`buildSlashCatalog` (domain module, **not** `AppWorkbench.applySlashItem`) merges six skill rows when the edition is on (`src/lib/softwareTeamDlc/slash.ts`). Existing `applySlashItem` `kind: "skill"` inserts `[[skill:team-product]]`.

- After pack install, Grok Build can resolve the skill from disk.
- Before install, the chip is a palette hint only. First-class entry is **Open in composer** on the board.
- `builtinSlashItems()` is unchanged (growth freeze + catalog tests).
- `AppWorkbench.tsx` is not extended.

## Roles

| Role | Pack / slash | Default stage | Next handoff |
|------|--------------|---------------|--------------|
| Product | `team-product` · `/team-product` | Backlog | Architect |
| Architect | `team-architect` · `/team-architect` | Design | Engineer |
| Engineer | `team-engineer` · `/team-engineer` | Build | Reviewer |
| Reviewer | `team-reviewer` · `/team-reviewer` | Review | QA |
| QA | `team-qa` · `/team-qa` | Review | Writer |
| Tech Writer | `team-writer` · `/team-writer` | Ship | (done) |

**Team = bound Grok Build sessions** plus existing **attach-chat**. Do not spawn parallel CLI processes.

## UI

- Settings card: `src/components/SoftwareTeamDlcPanel.tsx` (enable + honesty + install + status/repair).
- Studio: `src/components/SdlcStudioPage.tsx` from `KanbanBoardPage` when the edition is on. Live agent columns remain a second tab. Pack status + Repair on the toolbar. Reviewer/QA notes via `GlassModal`.
- Sidebar / title: `WorkbenchSidebar` / `WorkbenchMain` relabel Agents → SDLC Studio when on.
- Controls: chips, `ContextMenu`, `GlassModal` — no `window.confirm`, no native `<select>`. See [dialogs.md](./dialogs.md).
- Strings: `src/i18n/messages/*/software-team-dlc.ts` (15 locales, `en` authority).

## Forbidden

- New `useState` / feature blocks in `src/App.tsx` or `src/app/AppWorkbench.tsx`.
- Auto-apply `.grokskin`.
- Claude / Codex runtime, Remote IM, Session API scope creep.
- Claiming parallel multi-agent execution that the Host does not provide.
- Faking Host install or session-create success in the browser preview.
- Full-repo rebrand while the edition is off.

## Related

- Settings IA: [settings-ia.md](./settings-ia.md)
- Kanban columns: `src/lib/kanbanBoard.ts`
- Appearance: [appearance-skins.md](./appearance-skins.md)
- Dialogs: [dialogs.md](./dialogs.md)
- i18n: [i18n.md](./i18n.md)
