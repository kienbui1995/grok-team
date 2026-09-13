/**
 * Software Works Studio chrome: GlassModal conflict, no native dialogs,
 * close stays in conflict so inline chips still work.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = readFileSync(join(__dirname, "SdlcStudioPage.tsx"), "utf8");

describe("SdlcStudioPage dialog / i18n guard", () => {
  it("never uses window.confirm / alert / prompt or native select", () => {
    expect(SRC).not.toMatch(/window\.(confirm|alert|prompt)\s*\(/);
    expect(SRC).not.toMatch(/<select[\s>]/);
    expect(SRC).not.toMatch(/className=["']menu-panel["']/);
  });

  it("resolves pipeline conflict with GlassModal copy (close stays unresolved)", () => {
    expect(SRC).toContain("<GlassModal");
    expect(SRC).toContain('open={overlay === "conflict"}');
    expect(SRC).toContain('t("softwareTeamDlc.conflictTitle")');
    expect(SRC).toContain('t("softwareTeamDlc.conflictUseFile")');
    expect(SRC).toContain('t("softwareTeamDlc.conflictKeepBoard")');
    expect(SRC).toMatch(/onClose=\{\(\) => setConflictOpen\(false\)\}/);
    expect(SRC).not.toMatch(/onClose=\{\(\) => \{\s*setConflictOpen\(false\);\s*setFileStatus/);
  });

  it("dismisses the empty-board wizard when a conflict is shown so chips stay clickable", () => {
    expect(SRC).toMatch(/if \(inConflict[\s\S]*setWizard\(null\)/);
    expect(SRC).toContain("decideEmptyStudioWizard");
    expect(SRC).toContain('t("softwareTeamDlc.conflictUseFile")');
    expect(SRC).toContain("task-board__chip");
  });
});
