import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { messages } from "@/i18n";
import {
  DEFAULT_STORY_GATES,
  LEAN_POC_STORY_GATES_JSON,
  STORY_GATE_IDS,
  STORY_GATES_DEFAULT_CONFIG_URL,
  STORY_GATES_LEAN_POC_ROOT,
  gateDisplayPath,
  gatePublicUrl,
  isSafeArtifactName,
  isSafeArtifactRoot,
  isSafeConfigUrl,
  loadStoryGatesConfig,
  parseStoryGatesConfig,
  readStoredConfigUrl,
} from "./storyGates";

const CONFIG_FILE = resolve(
  process.cwd(),
  "artifacts/engineering/grok-team-lean-poc/story-gates.config.json",
);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseStoryGatesConfig", () => {
  it("accepts the Lean POC JSON on disk and the bundled default", () => {
    const disk = JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
    const fromDisk = parseStoryGatesConfig(disk);
    const fromBundle = parseStoryGatesConfig(LEAN_POC_STORY_GATES_JSON);
    expect(fromDisk).toEqual({ ok: true, config: DEFAULT_STORY_GATES });
    expect(fromBundle).toEqual({ ok: true, config: DEFAULT_STORY_GATES });
    expect(DEFAULT_STORY_GATES.artifactRoot).toBe(STORY_GATES_LEAN_POC_ROOT);
    expect(DEFAULT_STORY_GATES.gates.map((g) => g.id)).toEqual([...STORY_GATE_IDS]);
    expect(messages.en["storyGates.demoNonProd"]).toBe("Demo non-prod");
    expect(messages.en["storyGates.demoNonProd"]).not.toMatch(/Ship prod/i);
  });

  it("requires G3 to be the workbench diff and G5 to be Demo", () => {
    const g3 = DEFAULT_STORY_GATES.gates[2];
    const g5 = DEFAULT_STORY_GATES.gates[4];
    expect(g3.id).toBe("G3");
    expect(g3.kind).toBe("diff");
    expect(g3.artifact).toBe("diff");
    expect(gateDisplayPath(DEFAULT_STORY_GATES, g3)).toBe("diff");
    expect(gatePublicUrl(DEFAULT_STORY_GATES, g3)).toBeNull();
    expect(g5.name).toBe("demo");
    expect(g5.kind).toBe("file");
    expect(gateDisplayPath(DEFAULT_STORY_GATES, g5)).toBe(
      `${STORY_GATES_LEAN_POC_ROOT}/g5-demo-note.md`,
    );
  });

  it("rejects secrets, PII keys, traversal, and missing chips", () => {
    expect(
      parseStoryGatesConfig({
        ...LEAN_POC_STORY_GATES_JSON,
        apiKey: "nope",
      }).ok,
    ).toBe(false);
    expect(
      parseStoryGatesConfig({
        ...LEAN_POC_STORY_GATES_JSON,
        email: "a@b.c",
      }).ok,
    ).toBe(false);
    expect(
      parseStoryGatesConfig({
        ...LEAN_POC_STORY_GATES_JSON,
        artifactRoot: "../secrets",
      }).ok,
    ).toBe(false);
    expect(
      parseStoryGatesConfig({
        ...LEAN_POC_STORY_GATES_JSON,
        gates: LEAN_POC_STORY_GATES_JSON.gates.slice(0, 4),
      }).ok,
    ).toBe(false);
    const swapped = structuredClone(LEAN_POC_STORY_GATES_JSON);
    swapped.gates[2] = {
      ...swapped.gates[2],
      kind: "file",
      artifact: "g3-extra.md",
    };
    expect(parseStoryGatesConfig(swapped).ok).toBe(false);
  });
});

describe("story gates path guards", () => {
  it("only allows artifacts/ roots and same-origin config URLs", () => {
    expect(isSafeArtifactRoot(STORY_GATES_LEAN_POC_ROOT)).toBe(true);
    expect(isSafeArtifactRoot("/etc/passwd")).toBe(false);
    expect(isSafeArtifactRoot("artifacts/../etc")).toBe(false);
    expect(isSafeArtifactName("g1-spec.md")).toBe(true);
    expect(isSafeArtifactName("diff")).toBe(true);
    expect(isSafeArtifactName("../x.md")).toBe(false);
    expect(isSafeConfigUrl(STORY_GATES_DEFAULT_CONFIG_URL)).toBe(true);
    expect(isSafeConfigUrl("https://evil.example/story-gates.json")).toBe(false);
    expect(
      readStoredConfigUrl({
        getItem: () => "https://evil.example/x.json",
      }),
    ).toBeNull();
    expect(
      readStoredConfigUrl({
        getItem: () => STORY_GATES_DEFAULT_CONFIG_URL,
      }),
    ).toBe(STORY_GATES_DEFAULT_CONFIG_URL);
  });
});

describe("loadStoryGatesConfig", () => {
  it("falls back to the Lean default when fetch fails", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("offline");
    });
    await expect(loadStoryGatesConfig(fetchImpl, null)).resolves.toEqual(
      DEFAULT_STORY_GATES,
    );
  });

  it("uses a same-origin override URL when present", async () => {
    const next = {
      ...LEAN_POC_STORY_GATES_JSON,
      id: "override-poc",
      gates: LEAN_POC_STORY_GATES_JSON.gates.map((g) =>
        g.id === "G4" ? { ...g, status: "fail" as const } : g,
      ),
    };
    const fetchImpl = vi.fn(async (url: string) => {
      expect(url).toBe("/artifacts/engineering/custom/story-gates.config.json");
      return {
        ok: true,
        json: async () => ({
          ...next,
          artifactRoot: "artifacts/engineering/custom",
        }),
      } as Response;
    });
    const loaded = await loadStoryGatesConfig(fetchImpl, {
      getItem: () => "/artifacts/engineering/custom/story-gates.config.json",
    });
    expect(loaded.id).toBe("override-poc");
    expect(loaded.gates[3].status).toBe("fail");
  });
});
