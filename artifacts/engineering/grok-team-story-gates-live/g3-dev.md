# G3 Dev — Story gates rail (same story)

Date: 2026-09-04 (Asia/Saigon)
Owner: Software Developer
Story: **Story gates rail on existing workbench (Phase 1 T3)**
REQ: `product/grok-team-sdlc/04-design.md` v1.1
Prefer: **PR HEAD** (local `/workspace/grok-team` may lag remote)

## PR evidence (this story)

| | |
|---|---|
| PR | https://github.com/kienbui1995/grok-team/pull/2 |
| Branch | `cursor/story-gates-panel-a7ea` |
| HEAD | `a6d813d383eab3b370130154728f5aafdc5f08b4` (short `a6d813d`) |
| Freeze | **Draft** — no merge / no push from this pack / no ship |

## Story commits (Story gates + follow-ups)

### Core Story gates

1. `e7385d5` — **Add Story gates rail on the existing workbench.**
2. `828499a` — Fix Story gates test types for tsc.
3. `1881372` — **Treat Story gates G5 as a middle gate (04-design v1.1).**

### Follow-ups on same PR (CI / audit / PII scrub)

4. `4f9cbbb` / `d7d60d5` — chore: kick / re-kick Actions CI
5. `1d766cb` — Bump Tiptap to fix GHSA-cp6q-959q-f8rh audit
6. `e3ec203` — Scrub personal name from Story gates G5 public copy
7. `324f9e1` — Force `@tiptap/core` >=3.30.4 in the prod graph
8. `a6d813d` — Revert force `@tiptap/core` (current HEAD)

## What landed (summary)

- Overlay host + panel: `StoryGatesHost` / `StoryGatesPanel` on existing workbench
- Config JSON + deep-links G1–G5; G3 → workbench diff
- G5 label cổng giữa; demo + ship-path; forbidden “Ship prod”
- Vitest story-gates + CI green on HEAD `a6d813d`

## Note

Local checkout may sit on a tracking branch (`qc-a6d813d` etc.); describe **PR HEAD** for Story Pass, not uncommitted local drift.
