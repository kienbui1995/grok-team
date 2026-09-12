/**
 * @vitest-environment jsdom
 *
 * SDLC Studio board: HTML5 drag & drop between stage columns reuses the
 * same gate as the context menu — Ship refuses without Reviewer + QA notes.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import "@/test/jsdomStubs";
import {
  SOFTWARE_TEAM_DLC_PIPELINE_KEY,
  createSoftwareTeamPipelineItem,
  serializeSoftwareTeamPipelineStore,
  type SoftwareTeamPipelineItemDraft,
} from "@/lib/softwareTeamDlc";
import { SdlcStudioPage } from "./SdlcStudioPage";

type MemStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

function memoryStorage(): MemStorage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, String(value)),
    removeItem: (key) => void map.delete(key),
    clear: () => void map.clear(),
  };
}

function seedItem(storage: MemStorage, overrides: Partial<SoftwareTeamPipelineItemDraft> = {}): void {
  const item = createSoftwareTeamPipelineItem({
    roleId: "product",
    stageId: "backlog",
    stageSource: "board",
    title: "Alpha slice",
    updatedAt: 1_700_000_000_000,
    ...overrides,
  });
  storage.setItem(
    SOFTWARE_TEAM_DLC_PIPELINE_KEY,
    serializeSoftwareTeamPipelineStore({
      items: item ? [item] : [],
      activity: [],
      archivedDeliveryIds: [],
    }),
  );
}

function stubStorage(): MemStorage {
  const storage = memoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("sessionStorage", memoryStorage());
  return storage;
}

function dataTransferStub() {
  return {
    setData: vi.fn(),
    dropEffect: "",
    effectAllowed: "",
  };
}

function dragCardTo(stageLabel: "Backlog" | "Design" | "Ship", title: string) {
  const card = screen.getByText(title).closest("li");
  expect(card).not.toBeNull();
  const transfer = dataTransferStub();
  fireEvent.dragStart(card as HTMLElement, { dataTransfer: transfer });
  const column = screen.getByRole("listitem", { name: stageLabel });
  fireEvent.dragOver(column, { dataTransfer: transfer });
  fireEvent.drop(column, { dataTransfer: transfer });
  fireEvent.dragEnd(card as HTMLElement, { dataTransfer: transfer });
  return { transfer, column };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("SdlcStudioPage drag & drop", () => {
  it("moves a card between stage columns on drop", () => {
    const storage = stubStorage();
    seedItem(storage);

    render(<SdlcStudioPage locale="en" sessions={[]} />);

    const backlog = screen.getByRole("listitem", { name: "Backlog" });
    expect(within(backlog).getByText("Alpha slice")).toBeInTheDocument();

    dragCardTo("Design", "Alpha slice");

    const design = screen.getByRole("listitem", { name: "Design" });
    expect(within(design).getByText("Alpha slice")).toBeInTheDocument();
    expect(within(backlog).queryByText("Alpha slice")).not.toBeInTheDocument();
  });

  it("refuses a Ship drop without Reviewer + QA notes", () => {
    const storage = stubStorage();
    seedItem(storage);

    render(<SdlcStudioPage locale="en" sessions={[]} />);

    const backlog = screen.getByRole("listitem", { name: "Backlog" });
    expect(within(backlog).getByText("Alpha slice")).toBeInTheDocument();

    const { transfer } = dragCardTo("Ship", "Alpha slice");

    expect(within(backlog).getByText("Alpha slice")).toBeInTheDocument();
    const ship = screen.getByRole("listitem", { name: "Ship" });
    expect(within(ship).queryByText("Alpha slice")).not.toBeInTheDocument();
    // The locked column advertises no-drop while hovering.
    expect(transfer.dropEffect).toBe("none");
  });

  it("ships when the delivery visited Reviewer and QA with notes", () => {
    const storage = stubStorage();
    seedItem(storage, {
      roleId: "engineer",
      stageId: "review",
      reviewNote: "diff / test / risk checked",
      qaNote: "qa pass",
      roleHistory: ["product", "engineer", "reviewer", "qa"],
    });

    render(<SdlcStudioPage locale="en" sessions={[]} />);

    dragCardTo("Ship", "Alpha slice");

    const ship = screen.getByRole("listitem", { name: "Ship" });
    expect(within(ship).getByText("Alpha slice")).toBeInTheDocument();
  });
});
