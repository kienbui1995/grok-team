# Software Works × Laya — design

**Date:** 2026-09-21  
**Status:** design for implementation (not shipped)  
**Edition:** Software Works / SDLC Studio (opt-in)  
**Related:** [software-team-dlc.md](../../llm-wiki/software-team-dlc.md), [catalog.md](../../llm-wiki/catalog.md), [settings-ia.md](../../llm-wiki/settings-ia.md)

## Problem

Grok Build is a **System 2** coding agent (tokens, tools, sessions). Software Works already has a human decision trail (Product / Architect notes, P1–P3 priority, delivery templates, Review/QA Ship gate). Those choices are still typed by hand.

[Laya](https://laya.convaiinnovations.com/) is an open-weight **System 1** decision engine (ConvAI Innovations, Apache 2.0, `pip install laya>=0.3.3`):

- Input: a **state** (text or JSON) + **typed questions** (`choice` / `score` / `noul`).
- Output: labels, ordinal scores, or calibrated P(true) — **no generated prose**, nothing to parse.
- Latency (vendor T4 numbers): ~33 ms/question GPU; ~193–464 ms CPU with `Router(preload=True)`.
- Router picks English vs multilingual checkpoint from script **before** the forward pass (English-only checkpoint is confidently wrong on non-Latin text, including Vietnamese).

The product need: **faster, more honest triage** on the SDLC board — not a second coding runtime.

## Non-goals

- Laya is **not** a Claude/Codex/Grok replacement. Remote IM and the workbench still control **Grok Build only**.
- Laya **never** unlocks Ship, never auto-applies priority/template/role, never invents Host plan/goal ids, never rewrites shared `~/.grok`.
- The Tauri app **does not** bundle torch / 800 MB+ weights.
- We do **not** claim vendor “0.766 typed-decisions accuracy” out of the box. That number is a **fine-tuned** checkpoint. Base Laya is near chance on that benchmark (~0.35). V1 copy must say **suggestion / triage**, not oracle.
- Fine-tuning a Software Works checkpoint is **Phase B** (after labeled accept/reject data exists). Not in V1.
- No `window.confirm` / `prompt` / `alert`. No native `<select>`. No App.tsx / AppWorkbench growth.

## Approaches considered

| | Approach | Trade-off |
|-|----------|-----------|
| A | Call Grok Build to “decide” P1 / template / ship-ready | Slow, free-text, fake confidence. Already have sessions for writing. Rejected. |
| B | Embed Laya in the renderer | Impossible honestly (torch + weights). Rejected. |
| **C (recommended)** | **Opt-in local sidecar**: Host probes `python3` + `import laya`, runs `scripts/software-works-laya.py` over stdin JSON, Studio shows suggestions with confidence. Apply is a click. | Real Laya, testable domain without Python, honest `need_host` / `need_python` / `need_laya`. CPU is slower than vendor GPU numbers — copy must not promise 33 ms. |

## Architecture

```
Studio / Settings
    → planSoftwareTeamLayaDecide (pure)
    → SoftwareTeamLayaHost.probe | .predict
         desktop: invoke Host → python3 scripts/software-works-laya.py
         tests: injected fake
         browser: need_host (never fake answers)
    → parseSoftwareTeamLayaResult
    → suggestion chips (Apply / Dismiss)
    → existing setters (setPriority, wizard template, first role)
```

- **Grok Build** remains System 2 (code, notes, handoff starters).
- **Laya** is System 1 triage on a **bounded schema** (<20 options per `choice`).
- **Human** remains the gate. Confidence below `minConfidence` marks `uncertain: true`; Apply stays available but labeled uncertain.

## Decision intents (V1)

All questions are English instructions (Laya schemas are English). The **state** may be Vietnamese — **Router is required** (not English-only `laya.load`).

| Intent | Primitive | Options | Apply writes | Must not |
|--------|-----------|---------|--------------|----------|
| `priority` | `choice` | `p1` / `p2` / `p3` | `normalizeSoftwareTeamItemPriority` on the focus card | Gate Ship |
| `template` | `choice` | `feature` / `bugfix` / `hotfix` / `docs` | Start-delivery wizard template (still editable) | Write docs until user starts |
| `firstRole` | `choice` | six `SOFTWARE_TEAM_ROLE_IDS` | Wizard first-role chips | Steal the open chat |
| `shipReady` | `noul` | P(true) | **Display only** | Unlock `softwareTeamDeliveryShipGate` |

Optional later (same module, not V1 UI): `handoffReady` noul, `archive` noul.

## State (what Laya sees)

JSON built only from board fields already on the delivery (no session transcripts, no `auth.json`):

```ts
{
  title, deliveryTitle, roleId, stageId, templateId, priority,
  productNote, architectNote, reviewNote, qaNote,
  missingRoles, locale
}
```

Cap concatenated text so we stay inside Laya context (English 512 / multilingual 1024). Truncate notes, never send file bodies from the repo.

## Honesty reasons

`planSoftwareTeamLayaDecide` / probe / predict share:

| Reason | Meaning |
|--------|---------|
| `disabled` | Edition off **or** Laya pref off (default **off**) |
| `need_host` | Not desktop Tauri |
| `need_python` | No `python3` (or Windows `py -3`) |
| `need_laya` | `import laya` failed — hint `pip install laya>=0.3.3`, never pip-install ourselves |
| `blocked_shared_home` | Project path *is* user `~/.grok` |
| `host_error` | Spawn / timeout / non-JSON |
| `uncertain` | Result parsed but confidence < pref |
| `ok` | Parsed suggestion shown |

Browser preview always `need_host`. Partial sidecar never reports success.

## Prefs and settings

| Key | Default | Surface |
|-----|---------|---------|
| `grok.softwareTeamDlc.enabled` | off | existing |
| `grok.softwareTeamDlc.laya.enabled` | **off** | Settings → Extensions → Agents (under Software Works) |
| `grok.softwareTeamDlc.laya.minConfidence` | `0.7` | same card; clamp 0.5–0.95 |

Register on `ext.softwareTeamDlc` (`descKeys` + keywords `laya`, `decision engine`). Deep link stays `#/settings/extensions/agents`.

## Sidecar contract

Repo script: `scripts/software-works-laya.py` (no secrets).

**stdin** (one JSON object):

```json
{ "state": { "...": "..." }, "questions": { "priority": { "type": "choice", "...": {} } } }
```

**stdout** (one JSON object): either Laya `router.predict` shape (`answers`, `routing`) or `{ "ok": false, "reason": "need_laya", "error": "..." }`.

- `Router(preload=False)` on first call (honest cold start: seconds). Do not preload all three checkpoints in V1 (RAM). Document that language-switch reload can take several seconds on CPU.
- Timeout: Host kills after 60s first call / 15s warm.
- Working directory: project folder when allowed; never `~/.grok`.
- Weights cache: Hugging Face default user cache — **not** written by App into `~/.grok`. Independent mode must not rewrite agent `config.toml` for this.

## UI

- Start a delivery: **Suggest** (disabled when plan not `ok`). Fills template + first role as *draft chips*; user still confirms Start.
- Card / detail: **Suggest priority** → chip + confidence; **Apply** calls existing priority setter (activity `priority`).
- Detail: **Ship-ready suggestion** is a status line only (`noul` + confidence). Ship CTA unchanged.
- Exclusive overlay: suggestion is not a second GlassModal on top of conflict (`pickSoftwareTeamStudioOverlay` stays conflict-first). Suggest results live in the wizard / detail body.
- i18n: 16 locales, `en` key authority. Never hardcode “Laya said…”.

## Persistence

V1 does **not** add Laya fields to `.grok/software-works.json`. Applying a suggestion uses existing mutates. Optional activity type `laya_suggest` (unknown types already skipped) can log `{ intent, choice, confidence, uncertain }` without gating anything.

## Testing

- Domain: planner reasons, question schema keys, parse unknown payload → fail (no invented choice), confidence gate, `/repo/.grok` allowed / `~/.grok` blocked, Apply path does not touch Ship gate.
- Injected host fakes for probe/predict (same pattern as `pipelineFile` `fileHost`).
- i18n lockstep + settings catalog search.
- **Do not** require torch in CI. Script unit-testable with `LAYA_STUB=1` printing a fixture.

## Phase B (out of V1)

Fine-tune `laya-typed-decisions`-style on accept/reject of Studio suggestions (only after users opt in to local logging). Recalibrate temperatures on that domain. Until then, treat V1 as a **fast, uncertain triage aid**.
