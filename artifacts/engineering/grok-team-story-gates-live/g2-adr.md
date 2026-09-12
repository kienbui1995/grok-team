# G2 ADR — Stack B + Story gates overlay on workbench

Date: 2026-09-04 (Asia/Saigon)
Owner: Software Developer
Story: **Story gates rail on existing workbench (Phase 1 T3)**
REQ: `product/grok-team-sdlc/04-design.md` v1.1 · `03-prd.md` v1.1 · `02-problem.md` v1.1
Status: ADR before G3 for **this** story (not Lean PoC)

## Context

Cần workplace AI-native SDLC trên repo `kienbui1995/grok-team`: soi đủ G1–G5 trên GUI thật, không invent app mới, không coi Lean PoC = Done.

## Decision

**Stack B:** Shep-class CLI trên PATH (`@shepai/cli`) **+** `grok-team` Tauri GUI/session.

**Story gates = overlay/rail trên workbench sẵn** — đúng 2 bề mặt (Workbench + Story gates). **Không** third route / factory UI / màn thứ ba.

## Why

1. `02` / `03` khóa **B** mặc định; hướng **A** chỉ Explicit Kien.
2. `04` khóa layout: gates panel trên cùng workbench; G3 soi diff trên Workbench.
3. Phase 1 đã có tool proof: T1 Shep PATH QC PASS + T2 Tauri local QC PASS → workplace B khả dụng.
4. Overlay tái dùng chrome sẵn → ít surface, khớp DoD design (không invent factory).

## Alternatives rejected

| Option | Why not |
|---|---|
| Manual B-shaped / GUI optional (Lean debt) | Product FAIL stitch Lean+Welcome+UI — không đủ Story Pass live |
| Factory / multi-route Tauri UI (hướng A) | Ngoài 04; cần Explicit |
| Separate Story Pass app / third screen | Cấm trong 04 |
| Reuse Lean PoC artifacts for Done | CPO/PM: Lean Pass ≠ Product Done |

## Consequences

- Chip G1–G5 deep-link **artifact của story này** (folder pack live), không trỏ Lean PoC để claim Done.
- G5 giữ cổng giữa + ship-path; prod vẫn cửa Kien.
- PR #2 Story gates giữ **draft** — không merge/ship từ ADR này.
