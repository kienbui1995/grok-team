import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { LOCALES, loadAllLocaleCatalogs, messages } from "@/i18n";
import {
  DEFAULT_STORY_GATES,
  LEAN_POC_STORY_GATES_JSON,
  LIVE_STORY_GATES_JSON,
  STORY_GATE_IDS,
  STORY_GATES_DEFAULT_CONFIG_URL,
  STORY_GATES_G5_CHECKLIST_FILE,
  STORY_GATES_G5_MIDDLE_LABEL,
  STORY_GATES_LEAN_POC_ROOT,
  STORY_GATES_LIVE_ROOT,
  evaluateG5Status,
  gateChecklistPath,
  gateDisplayPath,
  gatePublicUrl,
  isForbiddenG5Copy,
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

beforeAll(async () => {
  await loadAllLocaleCatalogs();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseStoryGatesConfig", () => {
  it("accepts Lean POC JSON on disk and the Lean bundled sample", () => {
    const disk = JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
    const fromDisk = parseStoryGatesConfig(disk);
    const leanParsed = parseStoryGatesConfig(LEAN_POC_STORY_GATES_JSON);
    expect(leanParsed.ok).toBe(true);
    if (!leanParsed.ok) return;
    expect(fromDisk).toEqual(leanParsed);
    expect(leanParsed.config.id).toBe("grok-team-lean-poc");
    expect(leanParsed.config.gates[2]?.status).toBe("open");
    expect(leanParsed.config.gates[3]?.status).toBe("open");
    expect(leanParsed.config.gates[4]?.status).toBe("open");
  });

  it("accepts the live Story gates JSON on disk as the runtime default", () => {
    const liveFile = resolve(
      process.cwd(),
      "artifacts/engineering/grok-team-story-gates-live/story-gates.config.json",
    );
    const disk = JSON.parse(readFileSync(liveFile, "utf8"));
    const fromDisk = parseStoryGatesConfig(disk);
    const fromBundle = parseStoryGatesConfig(LIVE_STORY_GATES_JSON);
    expect(fromDisk).toEqual({ ok: true, config: DEFAULT_STORY_GATES });
    expect(fromBundle).toEqual({ ok: true, config: DEFAULT_STORY_GATES });
    expect(DEFAULT_STORY_GATES.artifactRoot).toBe(STORY_GATES_LIVE_ROOT);
    expect(DEFAULT_STORY_GATES.id).toBe("grok-team-story-gates-live");
    expect(DEFAULT_STORY_GATES.gates.map((g) => g.id)).toEqual([...STORY_GATE_IDS]);
    expect(DEFAULT_STORY_GATES.gates.every((g) => g.status === "pass")).toBe(
      true,
    );
    expect(STORY_GATES_DEFAULT_CONFIG_URL).toBe(
      `/${STORY_GATES_LIVE_ROOT}/story-gates.config.json`,
    );
    expect(messages.en["storyGates.demoNonProd"]).toBe("Demo non-prod");
    expect(messages.en["storyGates.demoNonProd"]).not.toMatch(/Ship prod/i);
    expect(messages.en["storyGates.gate.demo"]).toBe(STORY_GATES_G5_MIDDLE_LABEL);
  });

  it("requires G3 to be the workbench diff and G5 to be a middle gate", () => {
    const g3 = DEFAULT_STORY_GATES.gates[2];
    const g5 = DEFAULT_STORY_GATES.gates[4];
    expect(g3.id).toBe("G3");
    expect(g3.kind).toBe("diff");
    expect(g3.artifact).toBe("diff");
    expect(gateDisplayPath(DEFAULT_STORY_GATES, g3)).toBe("diff");
    expect(gatePublicUrl(DEFAULT_STORY_GATES, g3)).toBeNull();
    expect(g5.name).toBe("demo");
    expect(g5.kind).toBe("file");
    expect(g5.artifact).toBe("g5-demo.md");
    expect(g5.checklist).toBe(STORY_GATES_G5_CHECKLIST_FILE);
    expect(gateDisplayPath(DEFAULT_STORY_GATES, g5)).toBe(
      `${STORY_GATES_LIVE_ROOT}/g5-demo.md`,
    );
    expect(gateChecklistPath(DEFAULT_STORY_GATES, g5)).toBe(
      `${STORY_GATES_LIVE_ROOT}/${STORY_GATES_G5_CHECKLIST_FILE}`,
    );
  });

  it("locks G5 copy as a middle gate (04-design v1.1) in every locale", () => {
    for (const loc of LOCALES) {
      expect(messages[loc]["storyGates.gate.demo"]).toBe(
        STORY_GATES_G5_MIDDLE_LABEL,
      );
      expect(messages[loc]["storyGates.demoNonProd"]).toBe("Demo non-prod");
      for (const [key, value] of Object.entries(messages[loc])) {
        if (!key.startsWith("storyGates.")) continue;
        expect(isForbiddenG5Copy(value), `${loc}.${key}`).toBe(false);
      }
    }
  });

  it("fails G5 when demo or ship-path is missing", () => {
    expect(
      evaluateG5Status({
        hasDemo: true,
        hasChecklist: true,
        configured: "pass",
      }),
    ).toBe("pass");
    expect(
      evaluateG5Status({
        hasDemo: false,
        hasChecklist: true,
        configured: "pass",
      }),
    ).toBe("fail");
    expect(
      evaluateG5Status({
        hasDemo: true,
        hasChecklist: false,
        configured: "open",
      }),
    ).toBe("fail");
    expect(isForbiddenG5Copy("Ship prod")).toBe(true);
    expect(isForbiddenG5Copy("Ship complete")).toBe(true);
    expect(isForbiddenG5Copy("Done")).toBe(true);
    expect(isForbiddenG5Copy("Finished")).toBe(true);
    expect(isForbiddenG5Copy("AI tư vấn")).toBe(true);
    expect(isForbiddenG5Copy(STORY_GATES_G5_MIDDLE_LABEL)).toBe(false);
    expect(
      parseStoryGatesConfig({
        ...LEAN_POC_STORY_GATES_JSON,
        gates: LEAN_POC_STORY_GATES_JSON.gates.map((gate) =>
          gate.id === "G5" ? { ...gate, checklist: undefined } : gate,
        ),
      }).ok,
    ).toBe(false);
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
    const swapped = {
      ...LEAN_POC_STORY_GATES_JSON,
      gates: LEAN_POC_STORY_GATES_JSON.gates.map((gate, index) =>
        index === 2
          ? { ...gate, kind: "file" as const, artifact: "g3-extra.md" }
          : gate,
      ),
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
  it("falls back to the live default when fetch fails", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("offline");
    }) as typeof fetch;
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
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toBe(
        "/artifacts/engineering/custom/story-gates.config.json",
      );
      return {
        ok: true,
        json: async () => ({
          ...next,
          artifactRoot: "artifacts/engineering/custom",
        }),
      } as Response;
    }) as typeof fetch;
    const loaded = await loadStoryGatesConfig(fetchImpl, {
      getItem: () => "/artifacts/engineering/custom/story-gates.config.json",
    });
    expect(loaded.id).toBe("override-poc");
    expect(loaded.gates[3].status).toBe("fail");
  });
});
