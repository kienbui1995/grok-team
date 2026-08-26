import { afterEach, describe, expect, it, vi } from "vitest";
import { AGENT_KANBAN_COLUMN_IDS } from "@/lib/kanbanBoard";
import {
  DEFAULT_SOFTWARE_TEAM_DLC_ENABLED,
  SOFTWARE_TEAM_DLC_CHANGE_EVENT,
  SOFTWARE_TEAM_DLC_INSTALL_TARGETS,
  SOFTWARE_TEAM_DLC_PIPELINE_KEY,
  SOFTWARE_TEAM_DLC_STORAGE_KEY,
  SOFTWARE_TEAM_DLC_TAGS_KEY,
  SOFTWARE_TEAM_HANDOFF_CHAIN,
  SOFTWARE_TEAM_ROLE_IDS,
  SOFTWARE_TEAM_ROLES,
  SOFTWARE_TEAM_SDLC_STAGE_IDS,
  addSoftwareTeamPipelineItem,
  applySessionKanbanToPipeline,
  applySoftwareTeamHandoff,
  applySoftwareTeamHandoffToStore,
  assignSessionToPipeline,
  clearSessionFromPipeline,
  clearSoftwareTeamSessionTag,
  createEmptySoftwareTeamPipelineStore,
  createSoftwareTeamPipelineItem,
  getSoftwareTeamSessionTag,
  hydratePipelineFromSessionTags,
  isSoftwareTeamDlcEnabled,
  isSoftwareTeamRoleId,
  kanbanColumnSdlcAliasKey,
  loadSoftwareTeamDlcEnabled,
  loadSoftwareTeamPipelineStore,
  loadSoftwareTeamSessionTagMap,
  mapSdlcStageToKanbanColumn,
  nextSoftwareTeamRole,
  parseSoftwareTeamDlcEnabled,
  parseSoftwareTeamSessionTagMap,
  persistSoftwareTeamPipeline,
  pipelineItemForSession,
  planSoftwareTeamDlcPackWrite,
  projectSessionTagsFromPipeline,
  saveSoftwareTeamDlcEnabled,
  saveSoftwareTeamSessionTagMap,
  sdlcStagesForKanbanColumn,
  setPipelineItemStage,
  softwareTeamDlcPackFiles,
  softwareTeamDlcPackManifest,
  softwareTeamDlcWouldRewriteSharedGrokHome,
  softwareTeamRoleById,
  softwareTeamRoleSlashHint,
  softwareTeamRoleStarterPrompt,
  stageFromSessionKanbanColumn,
  upsertSoftwareTeamSessionTag,
} from "./index";

function memoryStore(initial?: Record<string, string>) {
  const map = new Map<string, string>(Object.entries(initial ?? {}));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, String(v));
    },
    dump: () => map,
  };
}

describe("Software Team DLC enable pref", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to off", () => {
    const storage = memoryStore();
    expect(DEFAULT_SOFTWARE_TEAM_DLC_ENABLED).toBe(false);
    expect(loadSoftwareTeamDlcEnabled(storage)).toBe(false);
    expect(isSoftwareTeamDlcEnabled(storage)).toBe(false);
    expect(parseSoftwareTeamDlcEnabled(null)).toBe(false);
    expect(parseSoftwareTeamDlcEnabled("nope")).toBe(false);
  });

  it("parses true/false tokens", () => {
    expect(parseSoftwareTeamDlcEnabled("1")).toBe(true);
    expect(parseSoftwareTeamDlcEnabled("true")).toBe(true);
    expect(parseSoftwareTeamDlcEnabled("0")).toBe(false);
    expect(parseSoftwareTeamDlcEnabled("false")).toBe(false);
  });

  it("persists and reloads without touching GROK_HOME paths", () => {
    const storage = memoryStore();
    saveSoftwareTeamDlcEnabled(true, storage);
    expect(storage.getItem(SOFTWARE_TEAM_DLC_STORAGE_KEY)).toBe("1");
    expect(loadSoftwareTeamDlcEnabled(storage)).toBe(true);
    saveSoftwareTeamDlcEnabled(false, storage);
    expect(storage.getItem(SOFTWARE_TEAM_DLC_STORAGE_KEY)).toBe("0");
    expect(loadSoftwareTeamDlcEnabled(storage)).toBe(false);
    expect([...storage.dump().keys()]).toEqual([SOFTWARE_TEAM_DLC_STORAGE_KEY]);
  });

  it("dispatches change event when window is available", () => {
    const dispatch = vi.fn();
    vi.stubGlobal("window", { dispatchEvent: dispatch });
    saveSoftwareTeamDlcEnabled(true, memoryStore());
    expect(dispatch).toHaveBeenCalledTimes(1);
    const ev = dispatch.mock.calls[0][0] as CustomEvent;
    expect(ev.type).toBe(SOFTWARE_TEAM_DLC_CHANGE_EVENT);
    expect(ev.detail).toBe(true);
    vi.unstubAllGlobals();
  });
});

describe("Software Team DLC roles", () => {
  it("ships the six team presets", () => {
    expect([...SOFTWARE_TEAM_ROLE_IDS]).toEqual([
      "product",
      "architect",
      "engineer",
      "reviewer",
      "qa",
      "writer",
    ]);
    expect(SOFTWARE_TEAM_ROLES).toHaveLength(6);
    expect(isSoftwareTeamRoleId("engineer")).toBe(true);
    expect(isSoftwareTeamRoleId("intern")).toBe(false);
    expect(softwareTeamRoleById("qa")?.packName).toBe("team-qa");
    expect(softwareTeamRoleSlashHint(softwareTeamRoleById("product")!)).toBe(
      "/team-product",
    );
  });

  it("has a starter prompt per role", () => {
    for (const id of SOFTWARE_TEAM_ROLE_IDS) {
      const text = softwareTeamRoleStarterPrompt(id);
      expect(text.length).toBeGreaterThan(40);
      expect(text).toMatch(/Grok Build/);
      expect(text).not.toMatch(/Claude|Codex/i);
    }
  });
});

describe("Software Team DLC SDLC mapping", () => {
  it("maps stages onto existing Kanban columns (no new board schema)", () => {
    expect([...SOFTWARE_TEAM_SDLC_STAGE_IDS]).toEqual([
      "backlog",
      "design",
      "build",
      "review",
      "ship",
    ]);
    expect(mapSdlcStageToKanbanColumn("backlog")).toBe("needs_you");
    expect(mapSdlcStageToKanbanColumn("design")).toBe("needs_you");
    expect(mapSdlcStageToKanbanColumn("review")).toBe("needs_you");
    expect(mapSdlcStageToKanbanColumn("build")).toBe("working");
    expect(mapSdlcStageToKanbanColumn("ship")).toBe("done");
  });

  it("aliases every live Kanban column", () => {
    for (const col of AGENT_KANBAN_COLUMN_IDS) {
      const stages = sdlcStagesForKanbanColumn(col);
      expect(stages.length).toBeGreaterThan(0);
      expect(kanbanColumnSdlcAliasKey(col)).toMatch(/^softwareTeamDlc\.columnMap\./);
    }
    expect(sdlcStagesForKanbanColumn("needs_you")).toEqual([
      "backlog",
      "design",
      "review",
    ]);
    expect(sdlcStagesForKanbanColumn("working")).toEqual(["build"]);
    expect(sdlcStagesForKanbanColumn("done")).toEqual(["ship"]);
    expect(sdlcStagesForKanbanColumn("idle")).toEqual(["backlog"]);
  });
});

describe("Software Team DLC session tags", () => {
  it("upserts role + default stage and ignores empty ids", () => {
    let map = parseSoftwareTeamSessionTagMap("{}");
    map = upsertSoftwareTeamSessionTag(map, "s1", { roleId: "engineer" });
    expect(getSoftwareTeamSessionTag(map, "s1")).toEqual({
      roleId: "engineer",
      stageId: "build",
    });
    map = upsertSoftwareTeamSessionTag(map, "s1", { stageId: "review" });
    expect(getSoftwareTeamSessionTag(map, "s1")?.stageId).toBe("review");
    map = clearSoftwareTeamSessionTag(map, "s1");
    expect(getSoftwareTeamSessionTag(map, "s1")).toBeNull();
    expect(upsertSoftwareTeamSessionTag(map, "  ", { roleId: "qa" })).toEqual(
      map,
    );
  });

  it("drops invalid JSON and unknown roles", () => {
    expect(parseSoftwareTeamSessionTagMap("not-json")).toEqual({});
    expect(
      parseSoftwareTeamSessionTagMap({
        a: { roleId: " intern ", stageId: "build" },
        b: { roleId: "reviewer", stageId: "nope" },
      }),
    ).toEqual({
      b: { roleId: "reviewer", stageId: "review" },
    });
  });

  it("persists tags under a dedicated key", () => {
    const storage = memoryStore();
    saveSoftwareTeamSessionTagMap(
      { abc: { roleId: "product", stageId: "backlog" } },
      storage,
    );
    expect(storage.getItem(SOFTWARE_TEAM_DLC_TAGS_KEY)).toContain("product");
    expect(loadSoftwareTeamSessionTagMap(storage).abc.roleId).toBe("product");
  });
});

describe("Software Works pipeline board ↔ session ↔ handoff", () => {
  it("board stage change updates the item and the session-tag projection", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "w1",
      sessionId: "sess-1",
      roleId: "engineer",
      stageId: "build",
      title: "Auth slice",
      planRef: "/plan auth",
      updatedAt: 1,
    });
    store = setPipelineItemStage(store, "w1", "review", 2);
    const item = pipelineItemForSession(store, "sess-1");
    expect(item?.stageId).toBe("review");
    expect(item?.roleId).toBe("engineer");
    expect(item?.stageSource).toBe("board");
    expect(item?.planRef).toBe("/plan auth");
    const tags = projectSessionTagsFromPipeline(store);
    expect(tags["sess-1"]).toEqual({ roleId: "engineer", stageId: "review" });
  });

  it("session working/done status reflects on the board; needs_you does not clobber Design", () => {
    expect(stageFromSessionKanbanColumn("working")).toBe("build");
    expect(stageFromSessionKanbanColumn("done")).toBe("ship");
    expect(stageFromSessionKanbanColumn("needs_you")).toBeNull();
    expect(stageFromSessionKanbanColumn("idle")).toBeNull();

    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "w2",
      sessionId: "sess-2",
      roleId: "architect",
      stageId: "design",
      updatedAt: 1,
    });
    const untouched = applySessionKanbanToPipeline(store, "sess-2", "needs_you", 3);
    expect(untouched).toBe(store);
    expect(pipelineItemForSession(untouched, "sess-2")?.stageId).toBe("design");

    store = applySessionKanbanToPipeline(store, "sess-2", "working", 4);
    expect(pipelineItemForSession(store, "sess-2")).toMatchObject({
      stageId: "build",
      stageSource: "session",
    });
    store = applySessionKanbanToPipeline(store, "sess-2", "done", 5);
    expect(pipelineItemForSession(store, "sess-2")?.stageId).toBe("ship");
  });

  it("handoff walks Product→…→Writer and copies the next starter with artifacts", () => {
    expect([...SOFTWARE_TEAM_HANDOFF_CHAIN]).toEqual([
      "product",
      "architect",
      "engineer",
      "reviewer",
      "qa",
      "writer",
    ]);
    expect(nextSoftwareTeamRole("product")).toBe("architect");
    expect(nextSoftwareTeamRole("writer")).toBeNull();

    const first = createSoftwareTeamPipelineItem({
      id: "w3",
      sessionId: "sess-3",
      roleId: "product",
      stageId: "backlog",
      title: "Billing",
      goalRef: "checkout works",
      artifactRef: "docs/plan.md",
      updatedAt: 1,
    });
    expect(first).not.toBeNull();
    const step = applySoftwareTeamHandoff(first!, 10);
    expect(step.kind).toBe("advanced");
    if (step.kind !== "advanced") return;
    expect(step.toRole).toBe("architect");
    expect(step.toStage).toBe("design");
    expect(step.item.roleId).toBe("architect");
    expect(step.item.stageSource).toBe("handoff");
    expect(step.starter).toMatch(/Architect/);
    expect(step.starter).toMatch(/Grok Build/);
    expect(step.starter).not.toMatch(/Claude|Codex/i);
    expect(step.starter).toContain("Billing");
    expect(step.starter).toContain("checkout works");
    expect(step.starter).toContain("docs/plan.md");

    let store = addSoftwareTeamPipelineItem(
      createEmptySoftwareTeamPipelineStore(),
      first!,
    );
    const walk: string[] = ["product"];
    let currentId = "w3";
    for (let i = 0; i < 8; i += 1) {
      const { store: nextStore, result } = applySoftwareTeamHandoffToStore(
        store,
        currentId,
        20 + i,
      );
      store = nextStore;
      if (!result || result.kind === "done") break;
      walk.push(result.toRole);
    }
    expect(walk).toEqual([...SOFTWARE_TEAM_HANDOFF_CHAIN]);
    expect(pipelineItemForSession(store, "sess-3")?.roleId).toBe("writer");
    expect(pipelineItemForSession(store, "sess-3")?.stageId).toBe("ship");
  });

  it("persists pipeline as SoT and migrates leftover session tags", () => {
    const storage = memoryStore();
    saveSoftwareTeamSessionTagMap(
      { legacy: { roleId: "qa", stageId: "review" } },
      storage,
    );
    const migrated = loadSoftwareTeamPipelineStore(storage);
    expect(pipelineItemForSession(migrated, "legacy")?.roleId).toBe("qa");
    expect(pipelineItemForSession(migrated, "legacy")?.stageId).toBe("review");

    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "w4",
      sessionId: "sess-4",
      roleId: "reviewer",
      stageId: "review",
      updatedAt: 1,
    });
    store = setPipelineItemStage(store, "w4", "ship", 2);
    persistSoftwareTeamPipeline(store, storage);
    expect(storage.getItem(SOFTWARE_TEAM_DLC_PIPELINE_KEY)).toContain("ship");
    expect(loadSoftwareTeamSessionTagMap(storage)["sess-4"]).toEqual({
      roleId: "reviewer",
      stageId: "ship",
    });
    expect(loadSoftwareTeamPipelineStore(storage).items[0]?.stageId).toBe("ship");
  });

  it("assign/clear session keeps one session bound and drops empty tag-only items", () => {
    let store = assignSessionToPipeline(
      createEmptySoftwareTeamPipelineStore(),
      "s-a",
      { roleId: "product" },
      1,
    );
    store = assignSessionToPipeline(store, "s-a", { roleId: "engineer", stageId: "build" }, 2);
    expect(store.items).toHaveLength(1);
    expect(pipelineItemForSession(store, "s-a")).toMatchObject({
      roleId: "engineer",
      stageId: "build",
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "other",
      sessionId: "s-b",
      roleId: "writer",
      title: "Release notes",
      updatedAt: 3,
    });
    store = assignSessionToPipeline(store, "s-b", { roleId: "writer" }, 4);
    expect(pipelineItemForSession(store, "s-b")?.title).toBe("Release notes");
    store = clearSessionFromPipeline(store, "s-a");
    expect(pipelineItemForSession(store, "s-a")).toBeNull();
    store = clearSessionFromPipeline(store, "s-b");
    expect(pipelineItemForSession(store, "s-b")).toBeNull();
    expect(store.items.some((item) => item.id === "other")).toBe(true);
    expect(store.items.find((item) => item.id === "other")?.sessionId).toBe("");
  });

  it("hydrate from tags does not invent Claude/Codex roles", () => {
    const store = hydratePipelineFromSessionTags({
      a: { roleId: "product", stageId: "backlog" },
    });
    expect(store.items[0]?.roleId).toBe("product");
    expect(SOFTWARE_TEAM_ROLE_IDS.includes(store.items[0]!.roleId)).toBe(true);
  });
});

describe("Software Team DLC pack + install plan", () => {
  it("is idempotent and covers agents, skills, and a workflow", () => {
    const a = softwareTeamDlcPackManifest();
    const b = softwareTeamDlcPackManifest();
    expect(a).toEqual(b);
    expect(a.agents).toEqual(SOFTWARE_TEAM_ROLE_IDS.map((id) => `team-${id}`));
    expect(a.skills).toEqual(a.agents);
    expect(a.workflows).toEqual(["team-handoff"]);
    const files = softwareTeamDlcPackFiles();
    expect(files).toHaveLength(13);
    expect(new Set(files.map((f) => f.relativePath)).size).toBe(files.length);
  });

  it("refuses user-scope writes in shared GROK_HOME", () => {
    expect([...SOFTWARE_TEAM_DLC_INSTALL_TARGETS]).toEqual(["project", "user"]);
    const sharedUser = planSoftwareTeamDlcPackWrite({
      sessionDataMode: "shared",
      target: "user",
    });
    expect(sharedUser.allowed).toBe(false);
    expect(sharedUser.reason).toBe("blocked_shared_user");
    expect(sharedUser.rewritesSharedGrokHome).toBe(true);
    expect(
      softwareTeamDlcWouldRewriteSharedGrokHome({
        sessionDataMode: "shared",
        target: "user",
      }),
    ).toBe(true);

    const independentUser = planSoftwareTeamDlcPackWrite({
      sessionDataMode: "independent",
      target: "user",
    });
    expect(independentUser.allowed).toBe(true);
    expect(independentUser.rewritesSharedGrokHome).toBe(false);

    const sharedProject = planSoftwareTeamDlcPackWrite({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/tmp/app",
    });
    expect(sharedProject.allowed).toBe(true);
    expect(sharedProject.rewritesSharedGrokHome).toBe(false);

    expect(
      planSoftwareTeamDlcPackWrite({
        sessionDataMode: "shared",
        target: "project",
        projectPath: "  ",
      }).reason,
    ).toBe("need_project");
  });
});
