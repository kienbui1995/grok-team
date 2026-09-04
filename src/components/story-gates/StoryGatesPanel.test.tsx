/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  DEFAULT_STORY_GATES,
  STORY_GATE_IDS,
  STORY_GATES_G5_MIDDLE_LABEL,
  STORY_GATES_LEAN_POC_ROOT,
  type StoryGatesConfig,
} from "@/lib/storyGates";
import { StoryGatesHost } from "./StoryGatesHost";
import { StoryGatesPanel } from "./StoryGatesPanel";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.sessionStorage.clear();
  window.localStorage.clear();
});

const FORBIDDEN_COPY =
  /Ship prod|AI tư vấn|Grok official|App Store|YOLO-IM|factory dashboard|Ship complete|\bDone\b|\bFinished\b/i;

describe("StoryGatesPanel", () => {
  it("renders chips G1–G5 with status and artifact links", () => {
    const onSelect = vi.fn();
    render(
      <StoryGatesPanel
        locale="en"
        config={DEFAULT_STORY_GATES}
        previewText={null}
        onClose={() => undefined}
        onSelectGate={onSelect}
      />,
    );

    const panel = screen.getByTestId("story-gates-panel");
    expect(panel).toBeInTheDocument();
    expect(screen.getByTestId("story-gates-demo-non-prod")).toHaveTextContent(
      "Demo non-prod",
    );
    expect(screen.getByTestId("story-gates-legal")).toHaveTextContent(/MIT/);
    expect(screen.getByTestId("story-gates-legal")).toHaveTextContent(
      /RongleCat/,
    );
    expect(panel.textContent ?? "").not.toMatch(FORBIDDEN_COPY);

    for (const id of STORY_GATE_IDS) {
      const chip = screen.getByTestId(`story-gates-chip-${id}`);
      expect(chip).toBeInTheDocument();
      expect(within(chip).getByText(id)).toBeInTheDocument();
      expect(screen.getByTestId(`story-gates-status-${id}`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`story-gates-artifact-${id}`),
      ).toBeInTheDocument();
    }

    expect(screen.getByTestId("story-gates-chip-G1")).toHaveAttribute(
      "data-gate-status",
      "pass",
    );
    expect(screen.getByTestId("story-gates-artifact-G1")).toHaveTextContent(
      "artifacts/engineering/grok-team-lean-poc/g1-spec.md",
    );
    expect(screen.getByTestId("story-gates-artifact-G3")).toHaveTextContent(
      "diff",
    );
    expect(screen.getByTestId("story-gates-chip-G3")).toHaveAttribute(
      "data-gate-kind",
      "diff",
    );
    expect(screen.getByTestId("story-gates-g5-label")).toHaveTextContent(
      STORY_GATES_G5_MIDDLE_LABEL,
    );
    expect(screen.getByTestId("story-gates-g5-subtitle")).toHaveTextContent(
      "Demo non-prod",
    );
    expect(screen.getByTestId("story-gates-artifact-G5")).toHaveTextContent(
      `${STORY_GATES_LEAN_POC_ROOT}/g5-demo-note.md`,
    );
    expect(screen.getByTestId("story-gates-checklist-G5")).toHaveTextContent(
      `${STORY_GATES_LEAN_POC_ROOT}/g5-ship-path.md`,
    );
    expect(screen.getAllByTestId(/story-gates-chip-G/)).toHaveLength(5);
  });

  it("shows G5 Fail UI when demo or ship-path is missing", () => {
    const g5 = DEFAULT_STORY_GATES.gates[4];
    const failConfig: StoryGatesConfig = {
      ...DEFAULT_STORY_GATES,
      gates: DEFAULT_STORY_GATES.gates.map((gate) =>
        gate.id === "G5"
          ? { ...g5, status: "fail", artifact: "g5-demo-note.md", checklist: undefined }
          : gate,
      ),
    };
    render(
      <StoryGatesPanel
        locale="en"
        config={failConfig}
        previewText={null}
        onClose={() => undefined}
        onSelectGate={() => undefined}
      />,
    );
    expect(screen.getByTestId("story-gates-chip-G5")).toHaveAttribute(
      "data-gate-status",
      "fail",
    );
    expect(screen.getByTestId("story-gates-g5-missing-checklist")).toBeInTheDocument();
    expect(screen.queryByTestId("story-gates-checklist-G5")).not.toBeInTheDocument();
    expect(screen.getByTestId("story-gates-panel").textContent ?? "").not.toMatch(
      FORBIDDEN_COPY,
    );
  });
});

describe("StoryGatesHost", () => {
  it("toggles the panel from workbench chrome without a new route", async () => {
    const user = userEvent.setup();
    const onOpenDiff = vi.fn();
    const onOpenArtifact = vi.fn();
    render(
      <StoryGatesHost
        locale="en"
        config={DEFAULT_STORY_GATES}
        initiallyOpen={false}
        onOpenDiff={onOpenDiff}
        onOpenArtifact={onOpenArtifact}
      />,
    );

    expect(screen.queryByTestId("story-gates-panel")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("story-gates-toggle"));
    expect(screen.getByTestId("story-gates-panel")).toBeInTheDocument();
    expect(screen.getByTestId("story-gates-chip-G1")).toBeInTheDocument();
    expect(screen.getByTestId("story-gates-chip-G5")).toBeInTheDocument();

    await user.click(screen.getByTestId("story-gates-artifact-G3"));
    expect(onOpenDiff).toHaveBeenCalledTimes(1);
    expect(onOpenArtifact).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("story-gates-checklist-G5"));
    expect(onOpenArtifact).toHaveBeenCalledWith(
      `${STORY_GATES_LEAN_POC_ROOT}/g5-ship-path.md`,
    );

    await user.click(screen.getByTestId("story-gates-close"));
    expect(screen.queryByTestId("story-gates-panel")).not.toBeInTheDocument();
  });

  it("opens a Lean file artifact path for G1", async () => {
    const user = userEvent.setup();
    const onOpenArtifact = vi.fn();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        text: async () => "# G1 Spec",
      })),
    );
    render(
      <StoryGatesHost
        locale="en"
        config={DEFAULT_STORY_GATES}
        initiallyOpen
        onOpenArtifact={onOpenArtifact}
      />,
    );
    await user.click(screen.getByTestId("story-gates-artifact-G1"));
    expect(onOpenArtifact).toHaveBeenCalledWith(
      "artifacts/engineering/grok-team-lean-poc/g1-spec.md",
    );
    expect(await screen.findByText("# G1 Spec")).toBeInTheDocument();
  });
});

describe("workbench wiring", () => {
  it("mounts Story gates on the existing WorkbenchMain (no third screen)", () => {
    const src = readFileSync(
      resolve(process.cwd(), "src/app/WorkbenchMain.tsx"),
      "utf8",
    );
    expect(src).toContain("StoryGatesHost");
    expect(src).toContain("openSideTab(sideWorkbench, \"review\")");
    expect(src).not.toMatch(/#\/story-gates|Ship prod|factory dashboard/);
  });
});
