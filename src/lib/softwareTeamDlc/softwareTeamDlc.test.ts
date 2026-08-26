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
  pipelineItemById,
  pipelineItemForSession,
  planSoftwareTeamDlcPackWrite,
  projectSessionTagsFromPipeline,
  saveSoftwareTeamDlcEnabled,
  saveSoftwareTeamSessionTagMap,
  sdlcStagesForKanbanColumn,
  setPipelineItemStage,
  updateSoftwareTeamPipelineItem,
  softwareTeamDlcPackFiles,
  softwareTeamDlcPackManifest,
  softwareTeamDlcWouldRewriteSharedGrokHome,
  softwareTeamInstallFailMessageKey,
  softwareTeamRoleById,
  softwareTeamRoleSlashHint,
  softwareTeamRoleStarterPrompt,
  softwareTeamSlashSkillInfos,
  stageFromSessionKanbanColumn,
  upsertSoftwareTeamSessionTag,
  applySoftwareTeamShipChoice,
  attachSoftwareTeamPlanChrome,
  composeHandoffStarter,
  composeRoleSessionStarter,
  composeWriterShipStarter,
  decideSoftwareTeamDoneCta,
  decideSoftwareTeamComposerNav,
  hostEntityIdFromUnknown,
  installSoftwareTeamDlcPack,
  isSoftwareTeamSharedHomePath,
  launchSoftwareTeamWorkItem,
  inheritSoftwareTeamDeliveryId,
  missingSoftwareTeamDeliveryRoles,
  pickSoftwareTeamAttachSessions,
  pickSoftwareTeamInstallTarget,
  planSoftwareTeamWorkspaceBootstrap,
  probeSoftwareTeamDlcPack,
  repairSoftwareTeamDlcPack,
  resolveSoftwareTeamWorkspace,
  seedSoftwareTeamAttachStarter,
  seedSoftwareTeamComposerDraft,
  softwareTeamAttachRefs,
  resolveSoftwareTeamDeliveryId,
  softwareTeamDeliveryItemDraft,
  softwareTeamDeliverySiblingDraft,
  softwareTeamLaunchItemPatch,
  softwareTeamWriterShipWritesFiles,
  writeSoftwareTeamWorkspaceBootstrap,
  SOFTWARE_TEAM_ATTACH_MAX,
  SOFTWARE_TEAM_BOOTSTRAP_RELATIVE,
  softwareTeamRoleChecklist,
  softwareTeamShipBlockMessageKey,
  softwareTeamShipGate,
  type SoftwareTeamLaunchHost,
  type SoftwareTeamPackProbeHost,
  type SoftwareTeamPackWriteHost,
} from "./index";
import { buildSlashCatalog } from "@/lib/slashCatalog";

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
    expect(pipelineItemForSession(store, "sess-2")).toMatchObject({
      stageId: "build",
      sessionDonePending: true,
    });
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
    expect(pipelineItemForSession(store, "sess-3")?.stageId).toBe("review");
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
    expect(pipelineItemById(store, "w4")?.stageId).toBe("review");
    persistSoftwareTeamPipeline(store, storage);
    expect(storage.getItem(SOFTWARE_TEAM_DLC_PIPELINE_KEY)).toContain("review");
    expect(loadSoftwareTeamSessionTagMap(storage)["sess-4"]).toEqual({
      roleId: "reviewer",
      stageId: "review",
    });
    expect(loadSoftwareTeamPipelineStore(storage).items[0]?.stageId).toBe(
      "review",
    );
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

function fakePackHost(
  overrides?: Partial<SoftwareTeamPackWriteHost> & {
    failOn?: string;
  },
): SoftwareTeamPackWriteHost & { calls: string[] } {
  const calls: string[] = [];
  const host: SoftwareTeamPackWriteHost & { calls: string[] } = {
    calls,
    isDesktopHost: () => true,
    agentsScaffold: async (opts) => {
      calls.push(`scaffold:${opts.name}:${opts.scope}`);
      if (overrides?.failOn === opts.name) throw new Error("scaffold boom");
      return {
        name: opts.name,
        path: `/tmp/agents/${opts.name}.md`,
        created: true,
        overwritten: false,
      };
    },
    skillCreate: async (opts) => {
      calls.push(`skillCreate:${opts.name}:${opts.scope}`);
      if (overrides?.failOn === opts.name) throw new Error("skill boom");
      return {
        path: `/tmp/skills/${opts.name}/SKILL.md`,
        name: opts.name,
        created: true,
        alreadyExisted: false,
      };
    },
    skillWrite: async (path, _content) => {
      calls.push(`skillWrite:${path}`);
    },
    workflowsCreate: async (opts) => {
      calls.push(`workflow:${opts.name}:${opts.scope}`);
      if (overrides?.failOn === opts.name) throw new Error("workflow boom");
      return {
        name: opts.name,
        path: `/tmp/workflows/${opts.name}.rhai`,
        created: true,
        overwritten: false,
      };
    },
    writeAbsolute: async (path) => {
      calls.push(`write:${path}`);
    },
    ...overrides,
  };
  return host;
}

describe("Software Team DLC pack install", () => {
  it("picks project when a path exists unless user is preferred", () => {
    expect(
      pickSoftwareTeamInstallTarget({ projectPath: "/repo" }),
    ).toBe("project");
    expect(
      pickSoftwareTeamInstallTarget({
        projectPath: "/repo",
        preferred: "user",
      }),
    ).toBe("user");
    expect(pickSoftwareTeamInstallTarget({})).toBe("user");
  });

  it("maps fail reasons exhaustively to i18n keys", () => {
    expect(softwareTeamInstallFailMessageKey("blocked_shared_user")).toBe(
      "softwareTeamDlc.install.blockedShared",
    );
    expect(softwareTeamInstallFailMessageKey("need_project")).toBe(
      "softwareTeamDlc.install.needProject",
    );
    expect(softwareTeamInstallFailMessageKey("need_host")).toBe(
      "softwareTeamDlc.install.needHost",
    );
    expect(softwareTeamInstallFailMessageKey("host_error")).toBe(
      "softwareTeamDlc.install.hostError",
    );
  });

  it("refuses shared user writes without calling Host", async () => {
    const host = fakePackHost();
    const result = await installSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "user",
      host,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("blocked_shared_user");
    expect(host.calls).toEqual([]);
  });

  it("refuses project install without a path and does not fake success", async () => {
    const host = fakePackHost();
    const result = await installSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "  ",
      host,
    });
    expect(result).toMatchObject({ ok: false, reason: "need_project" });
    expect(host.calls).toEqual([]);
  });

  it("refuses when desktop Host is missing", async () => {
    const host = fakePackHost({ isDesktopHost: () => false });
    const result = await installSoftwareTeamDlcPack({
      sessionDataMode: "independent",
      target: "user",
      host,
    });
    expect(result).toMatchObject({ ok: false, reason: "need_host" });
    expect(host.calls).toEqual([]);
  });

  it("writes all pack files and is idempotent", async () => {
    const host = fakePackHost();
    const first = await installSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      host,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.files).toHaveLength(13);
    expect(first.files.filter((f) => f.kind === "agent")).toHaveLength(6);
    expect(first.files.filter((f) => f.kind === "skill")).toHaveLength(6);
    expect(first.files.map((f) => f.name)).toContain("team-handoff");
    expect(host.calls.some((c) => c.startsWith("write:"))).toBe(true);
    expect(host.calls.some((c) => c.startsWith("skillWrite:"))).toBe(true);

    const again = await installSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      host,
    });
    expect(again.ok).toBe(true);
    if (!again.ok) return;
    expect(again.files).toHaveLength(13);
  });

  it("surfaces host errors without claiming success", async () => {
    const host = fakePackHost({ failOn: "team-product" });
    const result = await installSoftwareTeamDlcPack({
      sessionDataMode: "independent",
      target: "user",
      host,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("host_error");
    expect(result.error).toMatch(/boom/);
  });
});

describe("Software Team DLC session launch + composer seed", () => {
  it("composes a role starter with artifact refs", () => {
    const text = composeRoleSessionStarter({
      roleId: "engineer",
      title: "Auth slice",
      planRef: "plan://auth",
      goalRef: "login works",
      artifactRef: "src/auth.ts",
    });
    expect(text).toMatch(/Engineer/);
    expect(text).toMatch(/Grok Build/);
    expect(text).toContain("Auth slice");
    expect(text).toContain("plan://auth");
    expect(text).toContain("login works");
    expect(text).toContain("src/auth.ts");
    expect(text).not.toMatch(/Claude|Codex/i);
  });

  it("does not reopen the current session (stash would wipe the starter)", () => {
    expect(
      decideSoftwareTeamComposerNav({
        targetSessionId: "s1",
        currentSessionId: "s1",
      }),
    ).toBe("apply_live");
    expect(
      decideSoftwareTeamComposerNav({
        targetSessionId: "s2",
        currentSessionId: "s1",
      }),
    ).toBe("open_session");
    expect(
      decideSoftwareTeamComposerNav({
        targetSessionId: "",
        currentSessionId: "s1",
      }),
    ).toBe("need_session");
  });

  it("seeds the session draft and optionally the live composer", () => {
    const storage = memoryStore();
    const live: string[] = [];
    seedSoftwareTeamComposerDraft({
      sessionId: "sess-a",
      text: "hello starter",
      applyLive: true,
      setDraft: (t) => live.push(t),
      storage,
    });
    expect(live).toEqual(["hello starter"]);
    expect(storage.getItem("grok.composerSessionDrafts")).toContain(
      "hello starter",
    );
  });

  it("resolves project path from the current session, then first project", () => {
    expect(
      resolveSoftwareTeamWorkspace({
        projects: [
          { id: "p1", path: "/one" },
          { id: "p2", path: "/two" },
        ],
        sessions: [{ id: "s2", projectId: "p2" }],
        currentSessionId: "s2",
      }),
    ).toEqual({ projectId: "p2", projectPath: "/two" });
    expect(
      resolveSoftwareTeamWorkspace({
        projects: [{ id: "p1", path: "/one" }],
        generalWorkspacePath: "/gw",
      }),
    ).toEqual({ projectId: "p1", projectPath: "/one" });
    expect(
      resolveSoftwareTeamWorkspace({ generalWorkspacePath: "/gw" }),
    ).toEqual({ projectId: null, projectPath: "/gw" });
  });

  it("creates a session when Host exists and skips plan chrome without Host write", async () => {
    const created: string[] = [];
    const drafts: string[] = [];
    const host: SoftwareTeamLaunchHost = {
      hasHost: () => true,
      sessionCreate: async (_projectId, title) => {
        created.push(title ?? "");
        return { id: "new-sess" };
      },
      canWritePlanChrome: () => false,
      sessionPlanChromeSet: async () => {
        throw new Error("should not write");
      },
      setDraft: (t) => drafts.push(t),
    };
    const result = await launchSoftwareTeamWorkItem({
      item: {
        roleId: "product",
        title: "Billing",
        planRef: "/plan billing",
        sessionId: "",
      },
      createIfMissing: true,
      currentSessionId: "other",
      projectId: "p1",
      titleHint: "Billing",
      host,
      storage: memoryStore(),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.sessionId).toBe("new-sess");
    expect(result.createdSession).toBe(true);
    expect(result.nav).toBe("open_session");
    expect(result.planChrome).toBe("skipped");
    expect(created).toEqual(["Billing"]);
    expect(drafts).toEqual([]);
  });

  it("applies live draft when already on the session and can persist plan chrome", async () => {
    const drafts: string[] = [];
    const chrome: Array<{ id: string; body?: string }> = [];
    const host: SoftwareTeamLaunchHost = {
      hasHost: () => true,
      sessionCreate: async () => ({ id: "nope" }),
      canWritePlanChrome: () => true,
      sessionPlanChromeSet: async (id, stored) => {
        chrome.push({ id, body: stored.body });
      },
      setDraft: (t) => drafts.push(t),
    };
    const result = await launchSoftwareTeamWorkItem({
      item: {
        roleId: "architect",
        sessionId: "sess-live",
        planRef: "design.md",
        title: "API",
      },
      currentSessionId: "sess-live",
      host,
      storage: memoryStore(),
    });
    expect(result).toMatchObject({
      ok: true,
      nav: "apply_live",
      createdSession: false,
      planChrome: "set",
    });
    expect(drafts[0]).toMatch(/Architect/);
    expect(chrome).toEqual([{ id: "sess-live", body: "design.md" }]);
  });

  it("does not invent a session when Host is missing", async () => {
    const host: SoftwareTeamLaunchHost = {
      hasHost: () => false,
      sessionCreate: async () => ({ id: "nope" }),
      canWritePlanChrome: () => false,
      sessionPlanChromeSet: async () => {},
    };
    const result = await launchSoftwareTeamWorkItem({
      item: { roleId: "qa", sessionId: "" },
      createIfMissing: true,
      host,
    });
    expect(result).toEqual({ ok: false, reason: "need_host" });
    const chrome = await attachSoftwareTeamPlanChrome({
      host,
      sessionId: "s",
      planRef: "x",
    });
    expect(chrome).toEqual({ outcome: "skipped", hostPlanId: null });
  });
});

describe("Software Team DLC pack status + repair", () => {
  function listedPack(scope: string) {
    const files = softwareTeamDlcPackFiles();
    return {
      agents: files
        .filter((file) => file.kind === "agent")
        .map((file) => ({ name: file.name, scope })),
      skills: files
        .filter((file) => file.kind === "skill")
        .map((file) => ({ name: file.name, source: scope })),
      workflows: files
        .filter((file) => file.kind === "workflow")
        .map((file) => ({ name: file.name, scope })),
    };
  }

  function fakeProbeHost(
    lists?: ReturnType<typeof listedPack>,
    extras?: { desktop?: boolean; fail?: boolean },
  ): SoftwareTeamPackProbeHost {
    return {
      isDesktopHost: () => extras?.desktop !== false,
      agentsList: async () => {
        if (extras?.fail) throw new Error("list boom");
        return { agents: lists?.agents ?? [] };
      },
      skillsList: async () => ({ skills: lists?.skills ?? [] }),
      workflowsList: async () => ({ workflows: lists?.workflows ?? [] }),
    };
  }

  it("does not claim installed without a matching Host listing", async () => {
    const empty = await probeSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      host: fakeProbeHost(),
    });
    expect(empty.kind).toBe("missing");
    expect(empty.missing).toHaveLength(13);
    expect(empty.present).toHaveLength(0);
  });

  it("reports installed only when all 13 names match the target scope", async () => {
    const status = await probeSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      host: fakeProbeHost(listedPack("project")),
    });
    expect(status.kind).toBe("installed");
    expect(status.present).toHaveLength(13);
    expect(status.missing).toHaveLength(0);
  });

  it("treats user-scoped listings as missing on a project target", async () => {
    const status = await probeSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      host: fakeProbeHost(listedPack("user")),
    });
    expect(status.kind).toBe("missing");
    expect(status.missing).toHaveLength(13);
  });

  it("refuses shared ~/.grok and need_host without faking success", async () => {
    const shared = await probeSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "user",
      host: fakeProbeHost(listedPack("user")),
    });
    expect(shared.kind).toBe("blocked_shared");
    const noHost = await probeSoftwareTeamDlcPack({
      sessionDataMode: "independent",
      target: "user",
      host: fakeProbeHost(listedPack("user"), { desktop: false }),
    });
    expect(noHost.kind).toBe("need_host");
    const err = await probeSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      host: fakeProbeHost(undefined, { fail: true }),
    });
    expect(err.kind).toBe("host_error");
    expect(err.error).toMatch(/boom/);
  });

  it("writes only the missing names on repair", async () => {
    const present = listedPack("project");
    present.agents = present.agents.filter((row) => row.name !== "team-qa");
    present.skills = present.skills.filter((row) => row.name !== "team-writer");
    present.workflows = [];
    const write = fakePackHost();
    const result = await repairSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      probeHost: fakeProbeHost(present),
      writeHost: write,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.files.map((file) => `${file.kind}:${file.name}`).sort(),
    ).toEqual([
      "agent:team-qa",
      "skill:team-writer",
      "workflow:team-handoff",
    ]);
    expect(write.calls.some((call) => call.includes("team-product"))).toBe(
      false,
    );
  });

  it("repair of a complete pack writes nothing", async () => {
    const write = fakePackHost();
    const result = await repairSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      probeHost: fakeProbeHost(listedPack("project")),
      writeHost: write,
    });
    expect(result).toMatchObject({ ok: true, files: [] });
    expect(write.calls).toEqual([]);
  });

  it("repair refuses shared user writes", async () => {
    const write = fakePackHost();
    const result = await repairSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "user",
      writeHost: write,
    });
    expect(result).toMatchObject({ ok: false, reason: "blocked_shared_user" });
    expect(write.calls).toEqual([]);
  });

  it("install onlyNames writes a subset", async () => {
    const host = fakePackHost();
    const result = await installSoftwareTeamDlcPack({
      sessionDataMode: "shared",
      target: "project",
      projectPath: "/repo",
      host,
      onlyNames: ["team-qa", "team-handoff"],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.files.map((file) => `${file.kind}:${file.name}`).sort()).toEqual(
      ["agent:team-qa", "skill:team-qa", "workflow:team-handoff"],
    );
  });
});

describe("Software Team DLC Review → QA → Ship gate", () => {
  it("blocks ship until Reviewer + QA visits and notes", () => {
    const empty = softwareTeamShipGate({
      roleId: "engineer",
      roleHistory: ["product", "architect", "engineer"],
      reviewNote: "",
      qaNote: "",
    });
    expect(empty.ok).toBe(false);
    expect(empty.blocks).toEqual([
      "need_reviewer",
      "need_qa",
      "need_review_note",
      "need_qa_note",
    ]);
    expect(softwareTeamShipBlockMessageKey("need_reviewer")).toBe(
      "softwareTeamDlc.shipNeedReviewer",
    );
    const ready = softwareTeamShipGate({
      roleId: "writer",
      roleHistory: ["reviewer", "qa", "writer"],
      reviewNote: "must-fix auth",
      qaNote: "pnpm test",
    });
    expect(ready.ok).toBe(true);
    expect(ready.blocks).toEqual([]);
  });

  it("counts the current role as a visit", () => {
    expect(
      softwareTeamShipGate({
        roleId: "reviewer",
        roleHistory: [],
        reviewNote: "ok",
        qaNote: "ok",
      }).blocks,
    ).toEqual(["need_qa"]);
  });

  it("keeps handoff QA→Writer on review until notes exist", () => {
    const item = createSoftwareTeamPipelineItem({
      id: "gate-1",
      roleId: "qa",
      stageId: "review",
      reviewNote: "",
      qaNote: "",
      roleHistory: ["product", "architect", "engineer", "reviewer", "qa"],
    });
    expect(item).not.toBeNull();
    const step = applySoftwareTeamHandoff(item!, 50);
    expect(step.kind).toBe("advanced");
    if (step.kind !== "advanced") return;
    expect(step.toRole).toBe("writer");
    expect(step.toStage).toBe("review");
    expect(step.starter).toMatch(/Tech Writer/);
    expect(step.starter).not.toMatch(/Claude|Codex/i);
  });

  it("lands Writer on ship when Reviewer and QA notes are saved", () => {
    const item = createSoftwareTeamPipelineItem({
      id: "gate-2",
      roleId: "qa",
      stageId: "review",
      reviewNote: "nits only",
      qaNote: "vitest pass",
      roleHistory: ["reviewer", "qa"],
    });
    const step = applySoftwareTeamHandoff(item!, 60);
    expect(step.kind).toBe("advanced");
    if (step.kind !== "advanced") return;
    expect(step.toRole).toBe("writer");
    expect(step.toStage).toBe("ship");
  });

  it("refuses board and live-kanban moves to ship without the gate", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "gate-3",
      sessionId: "s-gate",
      roleId: "writer",
      stageId: "review",
      roleHistory: ["reviewer", "qa", "writer"],
      reviewNote: "",
      qaNote: "",
    });
    expect(setPipelineItemStage(store, "gate-3", "ship").items[0]?.stageId).toBe(
      "review",
    );
    store = applySessionKanbanToPipeline(store, "s-gate", "done", 9);
    expect(pipelineItemForSession(store, "s-gate")).toMatchObject({
      stageId: "review",
      sessionDonePending: true,
    });
    store = updateSoftwareTeamPipelineItem(store, "gate-3", {
      reviewNote: "looks good",
      qaNote: "tests green",
    });
    store = setPipelineItemStage(store, "gate-3", "ship", 10);
    expect(pipelineItemForSession(store, "s-gate")).toMatchObject({
      stageId: "ship",
      sessionDonePending: false,
    });
    persistSoftwareTeamPipeline(store, memoryStore());
  });

  it("persists review/qa notes on the pipeline item", () => {
    const storage = memoryStore();
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "notes-1",
      roleId: "reviewer",
      reviewNote: "diff ok",
      qaNote: "need cases",
    });
    persistSoftwareTeamPipeline(store, storage);
    const loaded = loadSoftwareTeamPipelineStore(storage);
    expect(pipelineItemById(loaded, "notes-1")).toMatchObject({
      reviewNote: "diff ok",
      qaNote: "need cases",
      roleHistory: ["reviewer"],
    });
  });

  it("puts diff / test / risk on Reviewer and QA starters", () => {
    for (const roleId of ["reviewer", "qa"] as const) {
      const lines = softwareTeamRoleChecklist(roleId);
      expect(lines.join("\n")).toMatch(/Diff:/);
      expect(lines.join("\n")).toMatch(/Test:/);
      expect(lines.join("\n")).toMatch(/Risk:/);
      const starter = composeRoleSessionStarter({ roleId, title: "Auth" });
      expect(starter).toMatch(/Diff:/);
      expect(starter).toMatch(/Test:/);
      expect(starter).toMatch(/Risk:/);
    }
    const from = createSoftwareTeamPipelineItem({
      id: "cl-1",
      roleId: "engineer",
      title: "Auth",
    })!;
    const to = createSoftwareTeamPipelineItem({
      id: "cl-2",
      roleId: "reviewer",
      title: "Auth",
    })!;
    expect(composeHandoffStarter(from, to)).toMatch(/Reviewer checklist/);
    expect(softwareTeamRoleChecklist("product")).toEqual([]);
  });

  it("does not create Writer items directly on ship without the gate", () => {
    const store = addSoftwareTeamPipelineItem(
      createEmptySoftwareTeamPipelineStore(),
      { id: "w-new", roleId: "writer" },
    );
    expect(pipelineItemById(store, "w-new")?.stageId).toBe("review");
  });
});

describe("Software Team DLC plan / goal launch honesty", () => {
  it("extracts Host ids only from id-shaped payloads", () => {
    expect(hostEntityIdFromUnknown({ id: "plan-1" })).toBe("plan-1");
    expect(hostEntityIdFromUnknown({ planId: "p2" })).toBe("p2");
    expect(hostEntityIdFromUnknown({ title: "SDLC", body: "x" })).toBeNull();
    expect(hostEntityIdFromUnknown(undefined)).toBeNull();
    expect(softwareTeamLaunchItemPatch({ ok: false, reason: "need_host" })).toBeNull();
  });

  it("attaches a Host plan id when sessionPlanChromeSet returns one", async () => {
    const host: SoftwareTeamLaunchHost = {
      hasHost: () => true,
      sessionCreate: async () => ({ id: "nope" }),
      canWritePlanChrome: () => true,
      sessionPlanChromeSet: async () => ({ id: "host-plan-9" }),
      setDraft: () => {},
    };
    const result = await launchSoftwareTeamWorkItem({
      item: {
        roleId: "architect",
        sessionId: "sess-live",
        planRef: "design.md",
        goalRef: "login works",
        title: "API",
      },
      currentSessionId: "sess-live",
      host,
      storage: memoryStore(),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.planChrome).toBe("set");
    expect(result.goalMode).toBe("set");
    expect(result.hostPlanId).toBe("host-plan-9");
    expect(result.hostGoalId).toBeNull();
    expect(softwareTeamLaunchItemPatch(result)).toEqual({
      planRef: "host-plan-9",
    });
  });

  it("does not invent plan or goal ids when Host returns no entity", async () => {
    const host: SoftwareTeamLaunchHost = {
      hasHost: () => true,
      sessionCreate: async () => ({ id: "nope" }),
      canWritePlanChrome: () => true,
      sessionPlanChromeSet: async () => {},
      setDraft: () => {},
    };
    const result = await launchSoftwareTeamWorkItem({
      item: {
        roleId: "product",
        sessionId: "s1",
        planRef: "/plan billing",
        goalRef: "checkout",
      },
      currentSessionId: "s1",
      host,
      storage: memoryStore(),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hostPlanId).toBeNull();
    expect(result.hostGoalId).toBeNull();
    expect(softwareTeamLaunchItemPatch(result)).toBeNull();
  });

  it("writes a Host goal id only when createGoalEntity returns one", async () => {
    const host: SoftwareTeamLaunchHost = {
      hasHost: () => true,
      sessionCreate: async () => ({ id: "nope" }),
      canWritePlanChrome: () => false,
      sessionPlanChromeSet: async () => {
        throw new Error("should not write");
      },
      createGoalEntity: async () => ({ goalId: "goal-77" }),
      setDraft: () => {},
    };
    const result = await launchSoftwareTeamWorkItem({
      item: {
        roleId: "product",
        sessionId: "s1",
        goalRef: "checkout",
      },
      currentSessionId: "s1",
      host,
      storage: memoryStore(),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.goalMode).toBe("set");
    expect(result.hostGoalId).toBe("goal-77");
    expect(softwareTeamLaunchItemPatch(result)).toEqual({ goalRef: "goal-77" });
  });
});

describe("Software Works start a delivery + workspace bootstrap", () => {
  it("refuses shared ~/.grok and does not write", async () => {
    expect(isSoftwareTeamSharedHomePath("~/.grok")).toBe(true);
    expect(isSoftwareTeamSharedHomePath("/home/u/.grok")).toBe(true);
    expect(isSoftwareTeamSharedHomePath("C:\\Users\\u\\.grok")).toBe(true);
    expect(isSoftwareTeamSharedHomePath("/repo")).toBe(false);
    expect(
      planSoftwareTeamWorkspaceBootstrap({
        projectPath: "/home/u/.grok",
        bootstrap: true,
        host: { isDesktopHost: () => true },
      }).reason,
    ).toBe("blocked_shared_home");
    const writes: string[] = [];
    const result = await writeSoftwareTeamWorkspaceBootstrap({
      projectPath: "~/.grok",
      title: "Auth",
      bootstrap: true,
      host: {
        isDesktopHost: () => true,
        readFile: async () => ({ text: null, error: "missing" }),
        writeFile: async (_p, relative) => {
          writes.push(relative);
        },
      },
    });
    expect(result).toMatchObject({ ok: false, reason: "blocked_shared_home" });
    expect(writes).toEqual([]);
  });

  it("refuses bootstrap without Host or project and skips when unchecked", async () => {
    expect(
      planSoftwareTeamWorkspaceBootstrap({
        projectPath: "/repo",
        bootstrap: true,
        host: { isDesktopHost: () => false },
      }).reason,
    ).toBe("need_host");
    expect(
      planSoftwareTeamWorkspaceBootstrap({
        projectPath: "  ",
        bootstrap: true,
        host: { isDesktopHost: () => true },
      }).reason,
    ).toBe("need_project");
    const skip = await writeSoftwareTeamWorkspaceBootstrap({
      projectPath: "/repo",
      bootstrap: false,
      host: {
        isDesktopHost: () => true,
        readFile: async () => ({ text: "x" }),
        writeFile: async () => {
          throw new Error("should not write");
        },
      },
    });
    expect(skip).toEqual({ ok: true, reason: "skipped", files: [] });
  });

  it("writes only missing docs/sdlc placeholders under the project", async () => {
    const writes: string[] = [];
    const result = await writeSoftwareTeamWorkspaceBootstrap({
      projectPath: "/repo",
      title: "Billing",
      bootstrap: true,
      host: {
        isDesktopHost: () => true,
        readFile: async (_p, relative) =>
          relative.endsWith("spec.md")
            ? { text: "# existing" }
            : { error: "missing" },
        writeFile: async (_p, relative, content) => {
          writes.push(relative);
          expect(content).toContain("Billing");
          expect(relative.startsWith("docs/sdlc/")).toBe(true);
        },
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(writes.sort()).toEqual([
      "docs/sdlc/design.md",
      "docs/sdlc/review.md",
    ]);
    expect([...SOFTWARE_TEAM_BOOTSTRAP_RELATIVE]).toHaveLength(3);
    const draft = softwareTeamDeliveryItemDraft({
      title: "Billing",
      roleId: "product",
    });
    expect(draft.roleId).toBe("product");
    expect(draft.deliveryId).toBeTruthy();
    expect(draft.sessionId).toBe("");
  });

  it("does not bind an existing chat when starting a delivery", () => {
    const draft = softwareTeamDeliveryItemDraft({
      title: "Auth",
      roleId: "product",
    });
    expect(draft.sessionId).toBe("");
    expect(draft.sessionId).not.toBe("current-chat");
  });
});

describe("Software Works done CTA + Writer ship starter", () => {
  it("does not auto-Ship on live done — CTA is handoff until the gate passes", () => {
    const item = createSoftwareTeamPipelineItem({
      id: "cta-1",
      sessionId: "s-done",
      roleId: "engineer",
      stageId: "build",
      sessionDonePending: true,
    })!;
    expect(decideSoftwareTeamDoneCta(item)).toEqual({
      kind: "handoff",
      nextRole: "reviewer",
    });
    let store = addSoftwareTeamPipelineItem(
      createEmptySoftwareTeamPipelineStore(),
      item,
    );
    store = applySessionKanbanToPipeline(store, "s-done", "done", 2);
    expect(pipelineItemForSession(store, "s-done")?.stageId).toBe("build");
    expect(pipelineItemForSession(store, "s-done")?.sessionDonePending).toBe(
      true,
    );
  });

  it("shows Ship CTA when the gate is ready and does not write app files", () => {
    const item = createSoftwareTeamPipelineItem({
      id: "cta-2",
      roleId: "qa",
      stageId: "review",
      title: "Auth",
      reviewNote: "nits",
      qaNote: "vitest",
      roleHistory: ["reviewer", "qa"],
      sessionDonePending: true,
    })!;
    expect(decideSoftwareTeamDoneCta(item)).toEqual({ kind: "ship" });
    expect(softwareTeamWriterShipWritesFiles()).toBe(false);
    const starter = composeWriterShipStarter(item);
    expect(starter).toMatch(/Tech Writer/);
    expect(starter).toMatch(/composer/);
    expect(starter).toMatch(/this project workspace/);
    expect(starter).not.toMatch(/edit this app's CHANGELOG/i);
    const ship = applySoftwareTeamShipChoice(item, 9);
    expect(ship.ok).toBe(true);
    if (!ship.ok) return;
    expect(ship.item.stageId).toBe("ship");
    expect(ship.item.roleId).toBe("writer");
    expect(ship.item.sessionDonePending).toBe(false);
    expect(ship.starter).toBe(composeWriterShipStarter(ship.item));
    expect(applySoftwareTeamShipChoice({ ...item, reviewNote: "" }).ok).toBe(
      false,
    );
  });
});

describe("Software Works attach-chat seed (max 3)", () => {
  const uuid = (n: number) =>
    `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa${n}`;

  it("picks up to 3 UUID siblings and prefers Product/Engineer/Reviewer", () => {
    expect(SOFTWARE_TEAM_ATTACH_MAX).toBe(3);
    const items = [
      createSoftwareTeamPipelineItem({
        id: "a",
        sessionId: uuid(1),
        roleId: "product",
        deliveryId: "d1",
      })!,
      createSoftwareTeamPipelineItem({
        id: "b",
        sessionId: uuid(2),
        roleId: "engineer",
        deliveryId: "d1",
      })!,
      createSoftwareTeamPipelineItem({
        id: "c",
        sessionId: uuid(3),
        roleId: "reviewer",
        deliveryId: "d1",
      })!,
      createSoftwareTeamPipelineItem({
        id: "d",
        sessionId: uuid(4),
        roleId: "qa",
        deliveryId: "d1",
      })!,
      createSoftwareTeamPipelineItem({
        id: "e",
        sessionId: "not-a-uuid",
        roleId: "architect",
        deliveryId: "d1",
      })!,
    ];
    const picks = pickSoftwareTeamAttachSessions(items, items[3]!);
    expect(picks.map((row) => row.roleId)).toEqual([
      "product",
      "engineer",
      "reviewer",
    ]);
    const refs = softwareTeamAttachRefs(picks, items[3]!.sessionId);
    expect(refs).toHaveLength(3);
    const text = seedSoftwareTeamAttachStarter("hello starter", refs);
    expect(text).toMatch(/\[\[chat:/);
    expect(text).toContain("hello starter");
  });

  it("does not attach sessions from another delivery or unscoped cards", () => {
    const uuid = (n: number) =>
      `bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb${n}`;
    const items = [
      createSoftwareTeamPipelineItem({
        id: "cur",
        sessionId: uuid(1),
        roleId: "qa",
        deliveryId: "d-keep",
      })!,
      createSoftwareTeamPipelineItem({
        id: "same",
        sessionId: uuid(2),
        roleId: "product",
        deliveryId: "d-keep",
      })!,
      createSoftwareTeamPipelineItem({
        id: "other",
        sessionId: uuid(3),
        roleId: "engineer",
        deliveryId: "d-other",
      })!,
      createSoftwareTeamPipelineItem({
        id: "loose",
        sessionId: uuid(4),
        roleId: "reviewer",
        deliveryId: "",
      })!,
    ];
    expect(
      pickSoftwareTeamAttachSessions(items, items[0]!).map((row) => row.roleId),
    ).toEqual(["product"]);
  });

  it("inherits one delivery id and drafts an unbound sibling", () => {
    const a = createSoftwareTeamPipelineItem({
      id: "i1",
      roleId: "product",
      deliveryId: "del-9",
      title: "Auth",
      planRef: "docs/sdlc/spec.md",
      updatedAt: 1,
    })!;
    const b = createSoftwareTeamPipelineItem({
      id: "i2",
      roleId: "engineer",
      deliveryId: "del-9",
      updatedAt: 2,
    })!;
    expect(inheritSoftwareTeamDeliveryId([a, b])).toBe("del-9");
    expect(resolveSoftwareTeamDeliveryId([a, b])).toBe("del-9");
    const sibling = softwareTeamDeliverySiblingDraft({
      source: a,
      roleId: "reviewer",
      deliveryId: "del-9",
    });
    expect(sibling).toMatchObject({
      roleId: "reviewer",
      sessionId: "",
      deliveryId: "del-9",
      title: "Auth",
      planRef: "docs/sdlc/spec.md",
    });
    expect(missingSoftwareTeamDeliveryRoles([a, b], "del-9")).toEqual([
      "reviewer",
    ]);
  });
});

describe("Software Team DLC slash extras", () => {
  it("exposes six /team-* skill rows", () => {
    const rows = softwareTeamSlashSkillInfos();
    expect(rows.map((r) => r.name)).toEqual(
      SOFTWARE_TEAM_ROLE_IDS.map((id) => `team-${id}`),
    );
    expect(rows.every((r) => r.userInvocable && r.enabled)).toBe(true);
  });

  it("merges into the slash catalog only when asked", () => {
    const off = buildSlashCatalog([]);
    expect(off.skills.some((s) => s.name === "team-product")).toBe(false);
    const on = buildSlashCatalog([], { includeSoftwareTeamSkills: true });
    expect(on.commands).toEqual(off.commands);
    expect(on.skills.some((s) => s.name === "team-product")).toBe(true);
    expect(on.skills.find((s) => s.name === "team-product")?.kind).toBe(
      "skill",
    );
  });
});
