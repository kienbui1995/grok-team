# G1 Spec — Story gates rail on existing workbench (Phase 1 T3)

Date: 2026-09-04 (Asia/Saigon)
Owner: Software Developer
Story (one): **Story gates rail on existing workbench (Phase 1 T3)**
Stack: **B** (Shep PATH + `grok-team` Tauri GUI)
Status: Spec BEFORE code for this story (artifact for Story Pass pack)

## REQ (cite)

| Doc | Path |
|---|---|
| Design v1.1 | `/workspace/company/artifacts/product/grok-team-sdlc/04-design.md` |
| Problem AC G1–G5 | `/workspace/company/artifacts/product/grok-team-sdlc/02-problem.md` |
| PRD AC G1–G5 | `/workspace/company/artifacts/product/grok-team-sdlc/03-prd.md` |

**Not** the old Lean PoC (`docs/poc-lean-story.md`). Product FAIL’d stitching Lean + Welcome + UI as one Story Pass.

## Surfaces (04-design v1.1 — đúng 2 bề mặt)

1. **Workbench** — session / project / diff trong `grok-team` (Tauri GUI sẵn). Control: mở/đóng Story gates panel; **không** route mới.
2. **Story gates** — panel/rail overlay trên cùng workbench; trạng thái + deep-link artifact G1–G5.

Cấm: màn thứ ba / factory UI / MBA / App Store / GTM / form PII / CTA “Ship prod”.

## 5 chips (G1 → G5)

| Chip | Name | Deep-link / hành vi | Pass UI | Fail UI |
|---|---|---|---|---|
| G1 | Spec | Mở file spec story | Có path spec trước code | Trống / nhảy code |
| G2 | ADR | Mở ADR/note | Artifact trước G3 | Implement trước artifact |
| G3 | Dev | Trỏ **diff** trên Workbench | Diff/commit story sau G1+G2 | Không code sau G1–G2 |
| G4 | QC | Mở QC note độc lập | Note Pass/Fail độc lập | Không note; QC đỏ mà coi xong |
| G5 | Demo (cổng giữa) | Demo note **+** ship-path checklist | Demo non-prod + đường tới ship; **không** CTA Ship prod | Thiếu demo/path; coi G5 = đích cuối; CTA Ship prod |

## G5 middle-gate copy (khóa 04 v1.1)

- Label: **`G5 · cổng giữa — không phải đích cuối`**
- Subtitle: **`Demo non-prod`**
- Hai deep-link trên cùng chip: demo note + ship-path checklist
- Prod = cửa **Kien** — không CTA “Ship prod” / “Ship complete” / “Done” như đích cuối

## Story Pass bar (02 / 03)

G1→G5 Pass trên stack **B** (Shep PATH + GUI dùng được). Lean PoC Pass ≠ Product Done.

## Out of scope

- Lean PoC story / manual B-shaped
- Hướng A factory trừ Explicit Kien
- Merge / ship prod từ pack này
