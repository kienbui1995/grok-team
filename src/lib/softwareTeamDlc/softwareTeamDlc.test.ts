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
  applySoftwareTeamDeliveryShipToStore,
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
  softwareTeamHandoffKeepsSourceCard,
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
  SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
  SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED,
  SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE,
  SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE,
  SOFTWARE_TEAM_PIPELINE_SCHEMA,
  SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION,
  filterSoftwareTeamItemsByDelivery,
  listSoftwareTeamDeliveryGroups,
  openSoftwareTeamSdlcDoc,
  parseSoftwareTeamActivityList,
  parseSoftwareTeamPipelineFileDoc,
  parseSoftwareTeamPipelineStore,
  planSoftwareTeamPipelineFileWrite,
  readSoftwareTeamPipelineFile,
  reloadSoftwareTeamPipelineIfNewer,
  resetSoftwareTeamPipelineFileSeenState,
  resolveSoftwareTeamDeliveryId,
  serializeSoftwareTeamPipelineFile,
  softwareTeamDeliveryItemDraft,
  softwareTeamDeliverySiblingDraft,
  softwareTeamRoleHistoryIds,
  acceptSoftwareTeamPipelineFile,
  keepSoftwareTeamPipelineLocal,
  writeSoftwareTeamPipelineFile,
  buildSoftwareTeamDeliveryDetail,
  composeSoftwareTeamDeliveryMarkdown,
  decideSoftwareTeamDeliveryNextCta,
  exportSoftwareTeamDeliverySummary,
  filterSoftwareTeamStudioItems,
  isSoftwareTeamItemArchived,
  isSoftwareTeamSdlcDeliverySummaryRelative,
  planSoftwareTeamDeliveryExport,
  setSoftwareTeamDeliveryArchived,
  setSoftwareTeamDeliveryGitBranch,
  clearSoftwareTeamUndoStack,
  normalizeSoftwareTeamGitBranch,
  popSoftwareTeamUndoSnapshot,
  pushSoftwareTeamUndoSnapshot,
  removeSoftwareTeamPipelineItem,
  softwareTeamActivityMessageKey,
  softwareTeamSuggestGitBranch,
  softwareTeamUndoDepth,
  softwareTeamRedoDepth,
  popSoftwareTeamRedoSnapshot,
  renameSoftwareTeamDelivery,
  duplicateSoftwareTeamDelivery,
  bindPipelineItemSession,
  decideSoftwareTeamBindThisChat,
  moveSoftwareTeamItemDelivery,
  softwareTeamBindThisChatMessageKey,
  softwareTeamDeliveryTitle,
  SOFTWARE_TEAM_ROLE_FILTER_ALL,
  SOFTWARE_TEAM_STAGE_FILTER_ALL,
  softwareTeamLaunchItemPatch,
  softwareTeamWriterShipWritesFiles,
  writeSoftwareTeamWorkspaceBootstrap,
  SOFTWARE_TEAM_ATTACH_MAX,
  SOFTWARE_TEAM_ATTACH_PREFER,
  SOFTWARE_TEAM_ROSTER_ROLES,
  SOFTWARE_TEAM_DLC_STUDIO_PREFS_KEY,
  loadSoftwareTeamStudioPrefs,
  parseSoftwareTeamStudioPrefs,
  resolveSoftwareTeamStudioPrefs,
  saveSoftwareTeamStudioPrefs,
  commitSoftwareTeamStudioPrefs,
  pickSoftwareTeamStudioOverlay,
  softwareTeamExportShouldCopyInstead,
  SOFTWARE_TEAM_BOOTSTRAP_RELATIVE,
  softwareTeamRoleChecklist,
  softwareTeamShipBlockMessageKey,
  softwareTeamShipGate,
  firstSoftwareTeamNonEmptyField,
  softwareTeamDeliveryMembers,
  softwareTeamDeliveryShipFields,
  softwareTeamDeliveryShipGate,
  setSoftwareTeamDeliveryNote,
  syncSoftwareTeamDeliverySliceRefs,
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

function fileHost(opts?: {
  desktop?: boolean;
  files?: Record<string, string>;
  mtimes?: Record<string, number>;
  failWrite?: string;
}) {
  const files = { ...(opts?.files ?? {}) };
  const mtimes = { ...(opts?.mtimes ?? {}) };
  const writes: string[] = [];
  return {
    writes,
    files,
    mtimes,
    host: {
      isDesktopHost: () => opts?.desktop !== false,
      readFile: async (_p: string, relative: string) => {
        if (relative in files) {
          return {
            text: files[relative],
            mtimeMs: mtimes[relative] ?? 1,
          };
        }
        return { error: `not a file: ${relative}` };
      },
      writeFile: async (_p: string, relative: string, content: string) => {
        writes.push(relative);
        if (opts?.failWrite === relative) throw new Error("write boom");
        files[relative] = content;
        mtimes[relative] = (mtimes[relative] ?? 0) + 10;
      },
    },
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
      "architect",
      "reviewer",
      "qa",
      "writer",
    ]);
  });
});

describe("Software Works project pipeline file SoT", () => {
  afterEach(() => {
    resetSoftwareTeamPipelineFileSeenState();
  });

  it("refuses shared ~/.grok and does not write", async () => {
    const { host, writes } = fileHost();
    expect(
      planSoftwareTeamPipelineFileWrite({
        projectPath: "~/.grok",
        host,
      }).reason,
    ).toBe("blocked_shared_home");
    const result = await writeSoftwareTeamPipelineFile({
      projectPath: "/home/u/.grok",
      store: createEmptySoftwareTeamPipelineStore(),
      host,
    });
    expect(result).toMatchObject({ ok: false, reason: "blocked_shared_home" });
    expect(writes).toEqual([]);
  });

  it("round-trips versioned JSON and is idempotent", async () => {
    const item = createSoftwareTeamPipelineItem({
      id: "p1",
      roleId: "product",
      title: "Auth",
      deliveryId: "d1",
    })!;
    const store = addSoftwareTeamPipelineItem(
      createEmptySoftwareTeamPipelineStore(),
      item,
    );
    const text = serializeSoftwareTeamPipelineFile(store, 99);
    expect(text).toContain(SOFTWARE_TEAM_PIPELINE_SCHEMA);
    expect(text).toContain(`"version": ${SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION}`);
    expect(text).toContain("activity");
    const parsed = parseSoftwareTeamPipelineFileDoc(text);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.store.items[0]?.title).toBe("Auth");
    const { host, writes, files } = fileHost();
    const first = await writeSoftwareTeamPipelineFile({
      projectPath: "/repo",
      store,
      host,
      now: 99,
    });
    expect(first).toMatchObject({ ok: true, reason: "ok_project" });
    const again = await writeSoftwareTeamPipelineFile({
      projectPath: "/repo",
      store,
      host,
      now: 100,
    });
    expect(again).toMatchObject({ ok: true, skipped: true });
    expect(writes).toEqual([SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]);
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toContain("Auth");
  });

  it("does not wipe a corrupt project file", async () => {
    const { host, writes, files } = fileHost({
      files: { [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: "{not-json" },
    });
    const original = files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE];
    const read = await readSoftwareTeamPipelineFile({
      projectPath: "/repo",
      host,
    });
    expect(read).toMatchObject({ ok: false, reason: "parse_fail", backedUp: true });
    const write = await writeSoftwareTeamPipelineFile({
      projectPath: "/repo",
      store: addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
        id: "x",
        roleId: "engineer",
      }),
      host,
    });
    expect(write).toMatchObject({ ok: false, reason: "parse_fail" });
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toBe(original);
    expect(writes).toContain(".grok/software-works.json.bak");
    expect(
      writes.filter((w) => w === SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE),
    ).toHaveLength(0);
  });

  it("stays cache-only without Host or project", async () => {
    expect(
      planSoftwareTeamPipelineFileWrite({
        projectPath: "/repo",
        host: { isDesktopHost: () => false },
      }).reason,
    ).toBe("need_host");
    expect(
      planSoftwareTeamPipelineFileWrite({
        projectPath: "  ",
        host: { isDesktopHost: () => true },
      }).reason,
    ).toBe("need_project");
  });
});

describe("Software Works delivery filter + docs open", () => {
  it("groups and filters cards by deliveryId", () => {
    const a = createSoftwareTeamPipelineItem({
      id: "a",
      roleId: "product",
      title: "Billing",
      deliveryId: "d-bill",
      roleHistory: ["product", "architect"],
      updatedAt: 2,
    })!;
    const b = createSoftwareTeamPipelineItem({
      id: "b",
      roleId: "engineer",
      title: "Auth",
      deliveryId: "d-auth",
      updatedAt: 3,
    })!;
    const c = createSoftwareTeamPipelineItem({
      id: "c",
      roleId: "qa",
      deliveryId: "",
    })!;
    const groups = listSoftwareTeamDeliveryGroups([a, b, c]);
    expect(groups.map((g) => g.id)).toEqual(["d-auth", "d-bill"]);
    expect(
      filterSoftwareTeamItemsByDelivery([a, b, c], SOFTWARE_TEAM_DELIVERY_FILTER_ALL),
    ).toHaveLength(3);
    expect(
      filterSoftwareTeamItemsByDelivery([a, b, c], "d-bill").map((i) => i.id),
    ).toEqual(["a"]);
    expect(
      filterSoftwareTeamItemsByDelivery(
        [a, b, c],
        SOFTWARE_TEAM_DELIVERY_FILTER_UNSCOPED,
      ).map((i) => i.id),
    ).toEqual(["c"]);
    expect(softwareTeamRoleHistoryIds(a)).toEqual(["product", "architect"]);
  });

  it("opens docs via editor when Host has it, else copies the path", async () => {
    const opened: string[] = [];
    const ok = await openSoftwareTeamSdlcDoc({
      projectPath: "/repo",
      relative: "docs/sdlc/spec.md",
      host: {
        isDesktopHost: () => true,
        readFile: async () => ({ text: "# spec" }),
        resolvePath: async () => ({ absolutePath: "/repo/docs/sdlc/spec.md" }),
        openInEditor: async (path) => {
          opened.push(path);
        },
      },
    });
    expect(ok).toEqual({
      ok: true,
      reason: "opened_editor",
      path: "/repo/docs/sdlc/spec.md",
    });
    expect(opened).toEqual(["/repo/docs/sdlc/spec.md"]);
    const copied = await openSoftwareTeamSdlcDoc({
      projectPath: "/repo",
      relative: "docs/sdlc/design.md",
      copyText: async () => true,
      host: {
        isDesktopHost: () => true,
        readFile: async () => ({ text: "# design" }),
        resolvePath: async () => ({ absolutePath: "/repo/docs/sdlc/design.md" }),
      },
    });
    expect(copied).toMatchObject({ ok: true, reason: "copied_path" });
    const blocked = await openSoftwareTeamSdlcDoc({
      projectPath: "~/.grok",
      relative: "docs/sdlc/spec.md",
      host: {
        isDesktopHost: () => true,
        readFile: async () => ({ text: "x" }),
        resolvePath: async () => ({ absolutePath: "/x" }),
      },
    });
    expect(blocked).toMatchObject({ ok: false, reason: "blocked_shared_home" });
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

  it("hides Host team-* skills when the edition is off", () => {
    const hostSkill = {
      name: "team-product",
      description: "from disk",
      source: "project",
    };
    const off = buildSlashCatalog([hostSkill], {
      includeSoftwareTeamSkills: false,
    });
    expect(off.skills.some((s) => s.name === "team-product")).toBe(false);
    expect(
      buildSlashCatalog([{ name: "review-commit", description: "ok" }], {
        includeSoftwareTeamSkills: false,
      }).skills.some((s) => s.name === "review-commit"),
    ).toBe(true);
    const on = buildSlashCatalog([hostSkill], {
      includeSoftwareTeamSkills: true,
    });
    expect(on.skills.some((s) => s.name === "team-product")).toBe(true);
  });
});

describe("Software Works activity + delivery detail + reload", () => {
  afterEach(() => {
    resetSoftwareTeamPipelineFileSeenState();
  });

  it("appends activity on add, stage, notes, handoff, and start delivery", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "act-1",
      roleId: "product",
      title: "Billing",
      deliveryId: "del-act",
      updatedAt: 10,
    });
    expect(store.activity.map((e) => e.type)).toEqual([
      "item_added",
      "delivery_started",
    ]);
    store = setPipelineItemStage(store, "act-1", "design", 11);
    expect(store.activity.map((e) => e.type)).toContain("stage_changed");
    store = updateSoftwareTeamPipelineItem(
      store,
      "act-1",
      { reviewNote: "nits only" },
      12,
    );
    expect(store.activity.some((e) => e.type === "notes" && e.noteKind === "review")).toBe(
      true,
    );
    const handed = applySoftwareTeamHandoffToStore(store, "act-1", 13);
    expect(handed.result?.kind).toBe("advanced");
    expect(handed.mode).toBe("created");
    expect(pipelineItemById(handed.store, "act-1")?.roleId).toBe("product");
    expect(handed.store.activity.some((e) => e.type === "handoff")).toBe(true);
    expect(handed.store.activity.every((e) => e.deliveryId === "del-act")).toBe(
      true,
    );
  });

  it("hydrates v1 files and caches without activity; skips unknown types", () => {
    const item = createSoftwareTeamPipelineItem({
      id: "legacy-1",
      roleId: "engineer",
      title: "Auth",
      deliveryId: "d-legacy",
    })!;
    const v1 = parseSoftwareTeamPipelineFileDoc({
      schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
      version: 1,
      updatedAt: 1,
      items: [item],
    });
    expect(v1.ok).toBe(true);
    if (!v1.ok) return;
    expect(v1.version).toBe(1);
    expect(v1.store.items[0]?.title).toBe("Auth");
    expect(v1.store.activity).toEqual([]);
    const cache = parseSoftwareTeamPipelineStore(
      JSON.stringify({ items: [item] }),
    );
    expect(cache.activity).toEqual([]);
    expect(cache.items[0]?.id).toBe("legacy-1");
    expect(
      parseSoftwareTeamActivityList([
        { at: 1, type: "item_added", deliveryId: "d", itemId: "legacy-1" },
        { at: 2, type: "future_kind", deliveryId: "d", itemId: "legacy-1" },
        { at: "bad", type: "notes" },
      ]).map((e) => e.type),
    ).toEqual(["item_added"]);
  });

  it("builds a delivery detail from filter, notes, sessions, and next CTA", () => {
    const a = createSoftwareTeamPipelineItem({
      id: "det-a",
      roleId: "reviewer",
      title: "Billing",
      deliveryId: "d-bill",
      sessionId: "sess-prod",
      reviewNote: "must-fix auth",
      roleHistory: ["product", "engineer", "reviewer"],
      sessionDonePending: true,
    })!;
    const b = createSoftwareTeamPipelineItem({
      id: "det-b",
      roleId: "qa",
      title: "Billing",
      deliveryId: "d-bill",
      sessionId: "sess-qa",
      qaNote: "login passes",
      roleHistory: ["qa"],
    })!;
    const other = createSoftwareTeamPipelineItem({
      id: "det-c",
      roleId: "product",
      title: "Other",
      deliveryId: "d-other",
      sessionId: "sess-other",
    })!;
    const detail = buildSoftwareTeamDeliveryDetail({
      items: [a, b, other],
      activity: [
        {
          at: 1,
          type: "delivery_started",
          deliveryId: "d-bill",
          itemId: "det-a",
        },
      ],
      sessions: [
        { id: "sess-prod", title: "Product chat" },
        { id: "sess-qa", title: "QA chat" },
        { id: "sess-other", title: "Ignore me" },
      ],
      target: { kind: "delivery", deliveryId: "d-bill", focusItemId: "det-a" },
    });
    expect(detail?.title).toBe("Billing");
    expect(detail?.items.map((i) => i.id)).toEqual(["det-a", "det-b"]);
    expect(detail?.roleHistory).toEqual(["product", "engineer", "reviewer", "qa"]);
    expect(detail?.reviewNotes.map((n) => n.text)).toEqual(["must-fix auth"]);
    expect(detail?.qaNotes.map((n) => n.text)).toEqual(["login passes"]);
    expect(detail?.sessions.map((s) => s.sessionId)).toEqual([
      "sess-prod",
      "sess-qa",
    ]);
    expect(detail?.activity).toHaveLength(1);
    expect(detail?.cta.kind).toBe("ship");
    expect(decideSoftwareTeamDeliveryNextCta(a).kind).toBe("handoff");
    expect(
      buildSoftwareTeamDeliveryDetail({
        items: [a, b, other],
        target: { kind: "delivery", deliveryId: "missing" },
      }),
    ).toBeNull();
  });

  it("reloads when the project file is newer and keeps cache on parse fail", async () => {
    const item = createSoftwareTeamPipelineItem({
      id: "rel-1",
      roleId: "product",
      title: "First",
      deliveryId: "d-rel",
    })!;
    const v1 = JSON.stringify({
      schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
      version: 1,
      updatedAt: 1,
      items: [item],
    });
    const { host, files, mtimes } = fileHost({
      files: { [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: v1 },
      mtimes: { [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: 10 },
    });
    const storage = memoryStore();
    persistSoftwareTeamPipeline(createEmptySoftwareTeamPipelineStore(), storage);
    const first = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
    });
    expect(first).toMatchObject({ ok: true, kind: "replaced" });
    if (!first.ok || first.kind !== "replaced") return;
    expect(first.store.items[0]?.title).toBe("First");
    expect(first.store.activity).toEqual([]);

    const same = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
      cached: first.store,
    });
    expect(same).toMatchObject({ ok: true, kind: "unchanged" });

    const newer = createSoftwareTeamPipelineItem({
      id: "rel-1",
      roleId: "product",
      title: "Second",
      deliveryId: "d-rel",
    })!;
    files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = JSON.stringify({
      schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
      version: 2,
      updatedAt: 2,
      items: [newer],
      activity: [
        {
          at: 2,
          type: "item_added",
          deliveryId: "d-rel",
          itemId: "rel-1",
        },
      ],
    });
    mtimes[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = 99;
    const replaced = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
      cached: first.store,
    });
    expect(replaced).toMatchObject({ ok: true, kind: "replaced" });
    if (!replaced.ok || replaced.kind !== "replaced") return;
    expect(replaced.store.items[0]?.title).toBe("Second");
    expect(replaced.store.activity[0]?.type).toBe("item_added");

    files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = "{not-json";
    mtimes[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = 120;
    const cacheBefore = loadSoftwareTeamPipelineStore(storage);
    const failed = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
      cached: cacheBefore,
    });
    expect(failed).toMatchObject({ ok: false, kind: "parse_failed" });
    expect(loadSoftwareTeamPipelineStore(storage).items[0]?.title).toBe("Second");
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toBe("{not-json");
  });

  it("reload refuses shared ~/.grok", async () => {
    const { host, writes } = fileHost();
    const result = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/home/u/.grok",
      host,
    });
    expect(result).toMatchObject({ ok: false, kind: "blocked_shared_home" });
    expect(writes).toEqual([]);
  });
});

describe("Software Works archive, studio filter, export, conflict", () => {
  afterEach(() => {
    resetSoftwareTeamPipelineFileSeenState();
  });

  it("hides archived deliveries until Show archived, and unarchives", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "arc-1",
      roleId: "product",
      title: "Billing",
      deliveryId: "d-bill",
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "arc-2",
      roleId: "engineer",
      title: "Auth",
      deliveryId: "d-auth",
    });
    store = setSoftwareTeamDeliveryArchived(store, "d-bill", true, 20);
    expect(store.archivedDeliveryIds).toEqual(["d-bill"]);
    expect(isSoftwareTeamItemArchived(store.items[0]!, store.archivedDeliveryIds)).toBe(
      true,
    );
    expect(store.activity.some((e) => e.type === "archived")).toBe(true);
    const hidden = filterSoftwareTeamStudioItems({
      items: store.items,
      archivedDeliveryIds: store.archivedDeliveryIds,
      showArchived: false,
    });
    expect(hidden.map((i) => i.id)).toEqual(["arc-2"]);
    const shown = filterSoftwareTeamStudioItems({
      items: store.items,
      archivedDeliveryIds: store.archivedDeliveryIds,
      showArchived: true,
    });
    expect(shown.map((i) => i.id).sort()).toEqual(["arc-1", "arc-2"]);
    store = setSoftwareTeamDeliveryArchived(store, "d-bill", false, 21);
    expect(store.archivedDeliveryIds).toEqual([]);
    expect(store.activity.some((e) => e.type === "unarchived")).toBe(true);
    expect(
      filterSoftwareTeamStudioItems({
        items: store.items,
        archivedDeliveryIds: store.archivedDeliveryIds,
      }).map((i) => i.id).sort(),
    ).toEqual(["arc-1", "arc-2"]);
  });

  it("searches title and chips filter stage/role with the delivery filter", () => {
    const a = createSoftwareTeamPipelineItem({
      id: "f-a",
      roleId: "reviewer",
      stageId: "review",
      title: "Billing slice",
      deliveryId: "d-bill",
    })!;
    const b = createSoftwareTeamPipelineItem({
      id: "f-b",
      roleId: "engineer",
      stageId: "build",
      title: "Auth slice",
      deliveryId: "d-auth",
    })!;
    const c = createSoftwareTeamPipelineItem({
      id: "f-c",
      roleId: "reviewer",
      stageId: "review",
      title: "Billing QA follow-up",
      deliveryId: "d-bill",
    })!;
    expect(
      filterSoftwareTeamStudioItems({
        items: [a, b, c],
        query: "billing",
      }).map((i) => i.id),
    ).toEqual(["f-a", "f-c"]);
    expect(
      filterSoftwareTeamStudioItems({
        items: [a, b, c],
        deliveryFilter: "d-bill",
        stageId: "review",
        roleId: "reviewer",
      }).map((i) => i.id),
    ).toEqual(["f-a", "f-c"]);
    expect(
      filterSoftwareTeamStudioItems({
        items: [a, b, c],
        stageId: "build",
        roleId: SOFTWARE_TEAM_ROLE_FILTER_ALL,
      }).map((i) => i.id),
    ).toEqual(["f-b"]);
    expect(
      filterSoftwareTeamStudioItems({
        items: [a, b, c],
        stageId: SOFTWARE_TEAM_STAGE_FILTER_ALL,
        query: "nope",
      }),
    ).toEqual([]);
  });

  it("loads v2 files without archive fields", () => {
    const item = createSoftwareTeamPipelineItem({
      id: "v2-1",
      roleId: "product",
      title: "Legacy",
    })!;
    const parsed = parseSoftwareTeamPipelineFileDoc({
      schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
      version: 2,
      updatedAt: 1,
      items: [item],
      activity: [],
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.store.archivedDeliveryIds).toEqual([]);
    expect(parsed.store.items[0]?.archived).toBe(false);
  });

  it("exports a markdown summary and refuses ~/.grok", async () => {
    const item = createSoftwareTeamPipelineItem({
      id: "ex-1",
      roleId: "product",
      title: "Billing",
      deliveryId: "d-bill",
      reviewNote: "nits",
    })!;
    const detail = buildSoftwareTeamDeliveryDetail({
      items: [item],
      target: { kind: "delivery", deliveryId: "d-bill" },
    })!;
    const md = composeSoftwareTeamDeliveryMarkdown(detail, 1);
    expect(md).toContain("# Billing");
    expect(md).toContain("nits");
    expect(isSoftwareTeamSdlcDeliverySummaryRelative("docs/sdlc/billing-delivery.md")).toBe(
      true,
    );
    expect(isSoftwareTeamSdlcDeliverySummaryRelative("docs/sdlc/../x-delivery.md")).toBe(
      false,
    );
    expect(
      planSoftwareTeamDeliveryExport({
        projectPath: "~/.grok",
        relative: "docs/sdlc/billing-delivery.md",
        host: { isDesktopHost: () => true },
      }).reason,
    ).toBe("blocked_shared_home");
    const writes: string[] = [];
    const ok = await exportSoftwareTeamDeliverySummary({
      projectPath: "/repo",
      detail,
      host: {
        isDesktopHost: () => true,
        writeFile: async (_p, relative) => {
          writes.push(relative);
        },
      },
    });
    expect(ok).toMatchObject({
      ok: true,
      relative: "docs/sdlc/billing-delivery.md",
    });
    expect(writes).toEqual(["docs/sdlc/billing-delivery.md"]);
    const blocked = await exportSoftwareTeamDeliverySummary({
      projectPath: "/home/u/.grok",
      detail,
      host: {
        isDesktopHost: () => true,
        writeFile: async () => {
          throw new Error("should not write");
        },
      },
    });
    expect(blocked).toMatchObject({ ok: false, reason: "blocked_shared_home" });
  });

  it("does not clobber dirty local when the project file is newer", async () => {
    const first = createSoftwareTeamPipelineItem({
      id: "cf-1",
      roleId: "product",
      title: "Local",
      deliveryId: "d-cf",
    })!;
    const { host, files, mtimes } = fileHost({
      files: {
        [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: JSON.stringify({
          schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
          version: 2,
          updatedAt: 1,
          items: [first],
          activity: [],
        }),
      },
      mtimes: { [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: 10 },
    });
    const storage = memoryStore();
    const loaded = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
    });
    expect(loaded).toMatchObject({ ok: true, kind: "replaced" });
    if (!loaded.ok || loaded.kind !== "replaced") return;
    const dirty = addSoftwareTeamPipelineItem(loaded.store, {
      id: "cf-2",
      roleId: "engineer",
      title: "Unsaved",
      deliveryId: "d-cf",
    });
    persistSoftwareTeamPipeline(dirty, storage);
    files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = JSON.stringify({
      schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
      version: 3,
      updatedAt: 2,
      items: [
        createSoftwareTeamPipelineItem({
          id: "cf-1",
          roleId: "product",
          title: "Foreign",
          deliveryId: "d-cf",
        }),
      ],
      activity: [],
      archivedDeliveryIds: [],
    });
    mtimes[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = 99;
    const conflict = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
      cached: dirty,
    });
    expect(conflict).toMatchObject({ ok: false, kind: "conflict" });
    expect(loadSoftwareTeamPipelineStore(storage).items.map((i) => i.title)).toEqual(
      ["Local", "Unsaved"],
    );
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toContain("Foreign");

    const save = await writeSoftwareTeamPipelineFile({
      projectPath: "/repo",
      store: dirty,
      host,
    });
    expect(save).toMatchObject({ ok: false, reason: "conflict" });
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toContain("Foreign");
    expect(files[SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE]).toContain("Foreign");
  });

  it("conflict reload emits only conflict, not a transient ok_project", async () => {
    const first = createSoftwareTeamPipelineItem({
      id: "cf-emit-1",
      roleId: "product",
      title: "Local",
      deliveryId: "d-cfe",
    })!;
    const { host, files, mtimes } = fileHost({
      files: {
        [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: JSON.stringify({
          schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
          version: 2,
          updatedAt: 1,
          items: [first],
          activity: [],
        }),
      },
      mtimes: { [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: 10 },
    });
    const storage = memoryStore();
    const loaded = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
    });
    expect(loaded).toMatchObject({ ok: true, kind: "replaced" });
    if (!loaded.ok || loaded.kind !== "replaced") return;
    const dirty = addSoftwareTeamPipelineItem(loaded.store, {
      id: "cf-emit-2",
      roleId: "engineer",
      title: "Unsaved",
      deliveryId: "d-cfe",
    });
    persistSoftwareTeamPipeline(dirty, storage);
    files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = JSON.stringify({
      schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
      version: 3,
      updatedAt: 2,
      items: [
        createSoftwareTeamPipelineItem({
          id: "cf-emit-1",
          roleId: "product",
          title: "Foreign",
          deliveryId: "d-cfe",
        }),
      ],
      activity: [],
      archivedDeliveryIds: [],
    });
    mtimes[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = 99;
    const dispatch = vi.fn();
    vi.stubGlobal("window", { dispatchEvent: dispatch });
    const conflict = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
      cached: dirty,
    });
    const reasons = dispatch.mock.calls
      .map((call) => (call[0] as CustomEvent<{ reason?: string }> | undefined)?.detail?.reason)
      .filter((reason): reason is string => typeof reason === "string");
    vi.unstubAllGlobals();
    expect(conflict).toMatchObject({ ok: false, kind: "conflict" });
    expect(reasons).toEqual(["conflict"]);
  });

  it("accepts the project file over a dirty local cache", async () => {
    const first = createSoftwareTeamPipelineItem({
      id: "cf-a1",
      roleId: "product",
      title: "Local",
      deliveryId: "d-cfa",
    })!;
    const { host, files, mtimes } = fileHost({
      files: {
        [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: JSON.stringify({
          schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
          version: 2,
          updatedAt: 1,
          items: [first],
          activity: [],
        }),
      },
      mtimes: { [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: 10 },
    });
    const storage = memoryStore();
    const loaded = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
    });
    expect(loaded).toMatchObject({ ok: true, kind: "replaced" });
    if (!loaded.ok || loaded.kind !== "replaced") return;
    const dirty = addSoftwareTeamPipelineItem(loaded.store, {
      id: "cf-a2",
      roleId: "engineer",
      title: "Unsaved",
      deliveryId: "d-cfa",
    });
    persistSoftwareTeamPipeline(dirty, storage);
    files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = JSON.stringify({
      schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
      version: 3,
      updatedAt: 2,
      items: [
        createSoftwareTeamPipelineItem({
          id: "cf-a1",
          roleId: "product",
          title: "Foreign",
          deliveryId: "d-cfa",
        }),
      ],
      activity: [],
      archivedDeliveryIds: [],
    });
    mtimes[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = 99;
    const conflict = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
      cached: dirty,
    });
    expect(conflict).toMatchObject({ ok: false, kind: "conflict" });
    const accepted = await acceptSoftwareTeamPipelineFile({
      projectPath: "/repo",
      host,
      storage,
    });
    expect(accepted).toMatchObject({ ok: true, kind: "replaced" });
    expect(loadSoftwareTeamPipelineStore(storage).items.map((i) => i.title)).toEqual(
      ["Foreign"],
    );
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toContain("Foreign");
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).not.toContain("Unsaved");

    const blocked = await acceptSoftwareTeamPipelineFile({
      projectPath: "/home/u/.grok",
      host,
      storage,
    });
    expect(blocked).toMatchObject({ ok: false, kind: "blocked_shared_home" });
  });

  it("keeps the local board by overwriting after backup", async () => {
    const first = createSoftwareTeamPipelineItem({
      id: "cf-k1",
      roleId: "product",
      title: "Local",
      deliveryId: "d-cfk",
    })!;
    const { host, files, mtimes } = fileHost({
      files: {
        [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: JSON.stringify({
          schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
          version: 2,
          updatedAt: 1,
          items: [first],
          activity: [],
        }),
      },
      mtimes: { [SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]: 10 },
    });
    const storage = memoryStore();
    const loaded = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
    });
    expect(loaded).toMatchObject({ ok: true, kind: "replaced" });
    if (!loaded.ok || loaded.kind !== "replaced") return;
    const dirty = addSoftwareTeamPipelineItem(loaded.store, {
      id: "cf-k2",
      roleId: "engineer",
      title: "Unsaved",
      deliveryId: "d-cfk",
    });
    persistSoftwareTeamPipeline(dirty, storage);
    files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = JSON.stringify({
      schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
      version: 3,
      updatedAt: 2,
      items: [
        createSoftwareTeamPipelineItem({
          id: "cf-k1",
          roleId: "product",
          title: "Foreign",
          deliveryId: "d-cfk",
        }),
      ],
      activity: [],
      archivedDeliveryIds: [],
    });
    mtimes[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE] = 99;
    const conflict = await reloadSoftwareTeamPipelineIfNewer({
      projectPath: "/repo",
      host,
      storage,
      cached: dirty,
    });
    expect(conflict).toMatchObject({ ok: false, kind: "conflict" });

    const refused = await writeSoftwareTeamPipelineFile({
      projectPath: "/repo",
      store: dirty,
      host,
    });
    expect(refused).toMatchObject({ ok: false, reason: "conflict" });
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toContain("Foreign");

    const kept = await keepSoftwareTeamPipelineLocal({
      projectPath: "/repo",
      store: dirty,
      host,
      storage,
    });
    expect(kept).toMatchObject({ ok: true, reason: "ok_project" });
    expect(files[SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE]).toContain("Foreign");
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toContain("Unsaved");
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).toContain("Local");
    expect(files[SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE]).not.toContain("Foreign");
    expect(loadSoftwareTeamPipelineStore(storage).items.map((i) => i.title)).toEqual(
      ["Local", "Unsaved"],
    );

    const blocked = await keepSoftwareTeamPipelineLocal({
      projectPath: "~/.grok",
      store: dirty,
      host,
      storage,
    });
    expect(blocked).toMatchObject({ ok: false, reason: "blocked_shared_home" });
  });
});

describe("Software Works undo, remove, git branch label", () => {
  afterEach(() => {
    clearSoftwareTeamUndoStack();
  });

  it("pushes and pops a pipeline snapshot without writing ~/.grok", () => {
    clearSoftwareTeamUndoStack();
    expect(softwareTeamUndoDepth()).toBe(0);
    const empty = createEmptySoftwareTeamPipelineStore();
    const filled = addSoftwareTeamPipelineItem(empty, {
      id: "u-1",
      roleId: "product",
      title: "Slice",
      deliveryId: "d-u",
    });
    pushSoftwareTeamUndoSnapshot(empty);
    expect(softwareTeamUndoDepth()).toBe(1);
    pushSoftwareTeamUndoSnapshot(filled);
    expect(popSoftwareTeamUndoSnapshot()?.items.map((i) => i.id)).toEqual(["u-1"]);
    expect(popSoftwareTeamUndoSnapshot()?.items).toEqual([]);
    expect(popSoftwareTeamUndoSnapshot()).toBeNull();
  });

  it("remove keeps activity and undo can restore the item", () => {
    const added = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "rm-1",
      roleId: "engineer",
      title: "Keep session",
      deliveryId: "d-rm",
    });
    pushSoftwareTeamUndoSnapshot(added);
    const removed = removeSoftwareTeamPipelineItem(added, "rm-1");
    expect(removed.items).toHaveLength(0);
    expect(removed.activity.some((event) => event.type === "item_removed")).toBe(true);
    const restored = popSoftwareTeamUndoSnapshot();
    expect(restored?.items.map((i) => i.id)).toEqual(["rm-1"]);
  });

  it("accepts feat/slug labels and refuses shared-home-looking junk", () => {
    expect(normalizeSoftwareTeamGitBranch("")).toBe("");
    expect(normalizeSoftwareTeamGitBranch("feat/login")).toBe("feat/login");
    expect(normalizeSoftwareTeamGitBranch("-bad")).toBeNull();
    expect(normalizeSoftwareTeamGitBranch("has space")).toBeNull();
    expect(normalizeSoftwareTeamGitBranch("feat/../etc")).toBeNull();
    expect(softwareTeamSuggestGitBranch("Login form")).toBe("feat/login-form");
    const store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "gb-1",
      roleId: "product",
      title: "Login form",
      deliveryId: "d-gb",
    });
    const labeled = setSoftwareTeamDeliveryGitBranch(store, "d-gb", "feat/login-form");
    expect(labeled.items[0]?.gitBranch).toBe("feat/login-form");
    expect(labeled.activity.some((event) => event.type === "git_branch")).toBe(true);
    expect(setSoftwareTeamDeliveryGitBranch(labeled, "d-gb", "no spaces")).toBe(labeled);
    expect(softwareTeamActivityMessageKey("item_removed")).toBe(
      "softwareTeamDlc.activity.item_removed",
    );
    expect(softwareTeamActivityMessageKey("git_branch")).toBe(
      "softwareTeamDlc.activity.git_branch",
    );
  });

  it("includes the branch label in the export markdown", () => {
    const item = createSoftwareTeamPipelineItem({
      id: "ex-1",
      roleId: "product",
      title: "Billing",
      deliveryId: "d-ex",
      gitBranch: "feat/billing",
    });
    expect(item).not.toBeNull();
    if (!item) return;
    const detail = buildSoftwareTeamDeliveryDetail({
      items: [item],
      target: { kind: "delivery", deliveryId: "d-ex" },
    });
    expect(detail?.gitBranch).toBe("feat/billing");
    expect(composeSoftwareTeamDeliveryMarkdown(detail!)).toContain(
      "Git branch label: feat/billing",
    );
  });

  it("redoes after undo and clears redo on a new mutate snapshot", () => {
    clearSoftwareTeamUndoStack();
    const empty = createEmptySoftwareTeamPipelineStore();
    const filled = addSoftwareTeamPipelineItem(empty, {
      id: "rd-1",
      roleId: "product",
      title: "Slice",
      deliveryId: "d-rd",
    });
    pushSoftwareTeamUndoSnapshot(empty);
    expect(softwareTeamRedoDepth()).toBe(0);
    const undone = popSoftwareTeamUndoSnapshot(filled);
    expect(undone?.items).toEqual([]);
    expect(softwareTeamRedoDepth()).toBe(1);
    const redone = popSoftwareTeamRedoSnapshot(undone ?? empty);
    expect(redone?.items.map((i) => i.id)).toEqual(["rd-1"]);
    pushSoftwareTeamUndoSnapshot(redone ?? filled);
    expect(softwareTeamRedoDepth()).toBe(0);
  });

  it("renames a delivery without rewriting ~/.grok and duplicates unbound copies", () => {
    const first = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "rn-1",
      roleId: "product",
      title: "Card A",
      sessionId: "sess-a",
      deliveryId: "d-rn",
    });
    const store = addSoftwareTeamPipelineItem(first, {
      id: "rn-2",
      roleId: "engineer",
      title: "Card B",
      sessionId: "sess-b",
      deliveryId: "d-rn",
    });
    const renamed = renameSoftwareTeamDelivery(store, "d-rn", "Billing slice");
    expect(softwareTeamDeliveryTitle(renamed.items, "d-rn")).toBe("Billing slice");
    expect(renamed.items.every((item) => item.title !== "Billing slice" || item.deliveryTitle === "Billing slice")).toBe(true);
    expect(renamed.activity.some((event) => event.type === "delivery_renamed")).toBe(true);

    const dup = duplicateSoftwareTeamDelivery(renamed, "d-rn", " (copy)");
    expect(dup).not.toBeNull();
    if (!dup) return;
    expect(dup.deliveryId).not.toBe("d-rn");
    const copies = dup.store.items.filter((item) => item.deliveryId === dup.deliveryId);
    expect(copies).toHaveLength(2);
    expect(copies.every((item) => item.sessionId === "")).toBe(true);
    expect(softwareTeamDeliveryTitle(dup.store.items, dup.deliveryId)).toContain("copy");
    expect(dup.store.activity.some((event) => event.type === "delivery_duplicated")).toBe(true);
  });

  it("binds the open chat only when a session exists and is not already on the card", () => {
    expect(decideSoftwareTeamBindThisChat({}).reason).toBe("need_session");
    expect(
      decideSoftwareTeamBindThisChat({
        currentSessionId: "sess-1",
        itemSessionId: "sess-1",
      }).reason,
    ).toBe("already");
    expect(
      decideSoftwareTeamBindThisChat({
        currentSessionId: "sess-2",
        itemSessionId: "sess-1",
      }),
    ).toEqual({ ok: true, reason: "bound", sessionId: "sess-2" });
    expect(softwareTeamBindThisChatMessageKey("need_session")).toBe(
      "softwareTeamDlc.bindThisChatNeedSession",
    );
  });

  it("moves a card between deliveries and ungroups without inventing a session", () => {
    let     store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "mv-a",
      roleId: "product",
      title: "Alpha",
      deliveryId: "d-a",
      deliveryTitle: "Alpha",
      gitBranch: "feat/alpha",
      planRef: "docs/sdlc/spec.md",
      goalRef: "ship billing",
      artifactRef: "pr-1",
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "mv-b",
      roleId: "engineer",
      title: "Beta card",
      deliveryId: "d-b",
      deliveryTitle: "Beta",
    });
    const moved = moveSoftwareTeamItemDelivery(store, "mv-b", "d-a");
    const card = moved.items.find((item) => item.id === "mv-b");
    expect(card?.deliveryId).toBe("d-a");
    expect(card?.deliveryTitle).toBe("Alpha");
    expect(card?.gitBranch).toBe("feat/alpha");
    expect(card?.planRef).toBe("docs/sdlc/spec.md");
    expect(card?.goalRef).toBe("ship billing");
    expect(card?.artifactRef).toBe("pr-1");
    expect(card?.sessionId).toBe("");
    expect(moved.activity.some((event) => event.type === "item_moved")).toBe(true);
    expect(moveSoftwareTeamItemDelivery(moved, "mv-b", "d-a")).toBe(moved);

    const unbound = moveSoftwareTeamItemDelivery(moved, "mv-b", "");
    expect(unbound.items.find((item) => item.id === "mv-b")?.deliveryId).toBe("");
    expect(unbound.items.find((item) => item.id === "mv-b")?.deliveryTitle).toBe("");
  });

  it("unbinds the previous card when the same chat is bound again", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "bd-1",
      roleId: "product",
      title: "One",
      sessionId: "sess-shared",
      deliveryId: "d-bd",
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "bd-2",
      roleId: "engineer",
      title: "Two",
      deliveryId: "d-bd",
    });
    const bound = bindPipelineItemSession(store, "bd-2", "sess-shared");
    expect(bound.items.find((item) => item.id === "bd-2")?.sessionId).toBe("sess-shared");
    expect(bound.items.find((item) => item.id === "bd-1")?.sessionId).toBe("");
    expect(bound.activity.some((event) => event.type === "session_bound")).toBe(true);
    expect(bound.activity.some((event) => event.type === "session_unbound")).toBe(
      true,
    );
    expect(softwareTeamActivityMessageKey("item_moved")).toBe(
      "softwareTeamDlc.activity.item_moved",
    );
    expect(softwareTeamActivityMessageKey("session_unbound")).toBe(
      "softwareTeamDlc.activity.session_unbound",
    );
  });
});

describe("Software Works delivery-wide Ship + slice refs", () => {
  function engineerPlusNotes() {
    const engineer = createSoftwareTeamPipelineItem({
      id: "eng-1",
      roleId: "engineer",
      stageId: "build",
      title: "Auth",
      deliveryId: "d-ship",
      sessionDonePending: true,
      roleHistory: ["product", "engineer"],
    })!;
    const reviewer = createSoftwareTeamPipelineItem({
      id: "rev-1",
      roleId: "reviewer",
      stageId: "review",
      title: "Auth",
      deliveryId: "d-ship",
      reviewNote: "must-fix auth",
      roleHistory: ["reviewer"],
    })!;
    const qa = createSoftwareTeamPipelineItem({
      id: "qa-1",
      roleId: "qa",
      stageId: "review",
      title: "Auth",
      deliveryId: "d-ship",
      qaNote: "vitest pass",
      roleHistory: ["qa"],
    })!;
    return { engineer, reviewer, qa, members: [engineer, reviewer, qa] };
  }

  it("sibling Reviewer+QA notes unlock Ship on the Engineer card", () => {
    const { engineer, members } = engineerPlusNotes();
    expect(softwareTeamShipGate(engineer).ok).toBe(false);
    expect(softwareTeamDeliveryShipGate([engineer]).ok).toBe(false);
    expect(softwareTeamDeliveryShipGate(members).ok).toBe(true);
    expect(softwareTeamDeliveryShipFields(members)).toMatchObject({
      reviewNote: "must-fix auth",
      qaNote: "vitest pass",
    });
    expect(firstSoftwareTeamNonEmptyField(["", "  ", "docs/plan"])).toBe(
      "docs/plan",
    );
    expect(softwareTeamDeliveryMembers(members, "d-ship")).toHaveLength(3);
  });

  it("decideSoftwareTeamDoneCta and delivery detail CTA become ship when siblings unlock", () => {
    const { engineer, members } = engineerPlusNotes();
    expect(decideSoftwareTeamDoneCta(engineer).kind).toBe("handoff");
    expect(decideSoftwareTeamDoneCta(engineer, members)).toEqual({
      kind: "ship",
    });
    expect(decideSoftwareTeamDeliveryNextCta(engineer).kind).toBe("handoff");
    expect(decideSoftwareTeamDeliveryNextCta(engineer, members).kind).toBe(
      "ship",
    );
    const detail = buildSoftwareTeamDeliveryDetail({
      items: members,
      target: { kind: "delivery", deliveryId: "d-ship", focusItemId: "eng-1" },
    });
    expect(detail?.cta.kind).toBe("ship");
    expect(detail?.planRef).toBe("");
  });

  it("applySoftwareTeamShipChoice with siblings copies notes onto the shipped card only", () => {
    const { engineer, members } = engineerPlusNotes();
    const blocked = applySoftwareTeamShipChoice(engineer);
    expect(blocked.ok).toBe(false);
    const ship = applySoftwareTeamShipChoice(engineer, 20, members);
    expect(ship.ok).toBe(true);
    if (!ship.ok) return;
    expect(ship.item.id).toBe("eng-1");
    expect(ship.item.roleId).toBe("writer");
    expect(ship.item.stageId).toBe("ship");
    expect(ship.item.reviewNote).toBe("must-fix auth");
    expect(ship.item.qaNote).toBe("vitest pass");
    expect(ship.starter).toMatch(/must-fix auth/);
    expect(ship.starter).toMatch(/vitest pass/);
    expect(members.find((row) => row.id === "rev-1")?.roleId).toBe("reviewer");
  });

  it("setPipelineItemStage to ship is allowed when siblings have notes and blocked on this card alone", () => {
    const { engineer, reviewer, qa } = engineerPlusNotes();
    let store = addSoftwareTeamPipelineItem(
      createEmptySoftwareTeamPipelineStore(),
      engineer,
    );
    store = addSoftwareTeamPipelineItem(store, reviewer);
    store = addSoftwareTeamPipelineItem(store, qa);
    const alone = addSoftwareTeamPipelineItem(
      createEmptySoftwareTeamPipelineStore(),
      engineer,
    );
    expect(setPipelineItemStage(alone, "eng-1", "ship").items[0]?.stageId).toBe(
      "build",
    );
    const shipped = setPipelineItemStage(store, "eng-1", "ship", 30);
    expect(pipelineItemById(shipped, "eng-1")?.stageId).toBe("ship");
  });

  it("sync refs writes all members and updateSoftwareTeamPipelineItem planRef syncs siblings", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "ref-a",
      roleId: "product",
      deliveryId: "d-ref",
      planRef: "old-plan",
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "ref-b",
      roleId: "engineer",
      deliveryId: "d-ref",
    });
    expect(pipelineItemById(store, "ref-b")?.planRef).toBe("old-plan");
    store = syncSoftwareTeamDeliverySliceRefs(store, "d-ref", {
      planRef: "docs/sdlc/spec.md",
      goalRef: "login",
      artifactRef: "pr-9",
    });
    expect(store.items.every((item) => item.planRef === "docs/sdlc/spec.md")).toBe(
      true,
    );
    expect(store.items.every((item) => item.goalRef === "login")).toBe(true);
    expect(store.items.every((item) => item.artifactRef === "pr-9")).toBe(true);
    store = updateSoftwareTeamPipelineItem(store, "ref-a", {
      planRef: "docs/sdlc/design.md",
    });
    expect(pipelineItemById(store, "ref-b")?.planRef).toBe("docs/sdlc/design.md");
    expect(pipelineItemById(store, "ref-b")?.reviewNote).toBe("");
  });

  it("setSoftwareTeamDeliveryNote writes onto the reviewer/qa card", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "note-eng",
      roleId: "engineer",
      deliveryId: "d-note",
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "note-rev",
      roleId: "reviewer",
      deliveryId: "d-note",
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "note-qa",
      roleId: "qa",
      deliveryId: "d-note",
    });
    store = setSoftwareTeamDeliveryNote(store, {
      deliveryId: "d-note",
      focusItemId: "note-eng",
      kind: "review",
      text: "nits only",
    });
    store = setSoftwareTeamDeliveryNote(store, {
      deliveryId: "d-note",
      focusItemId: "note-eng",
      kind: "qa",
      text: "pnpm test",
    });
    expect(pipelineItemById(store, "note-rev")?.reviewNote).toBe("nits only");
    expect(pipelineItemById(store, "note-qa")?.qaNote).toBe("pnpm test");
    expect(pipelineItemById(store, "note-eng")?.reviewNote).toBe("");
    expect(pipelineItemById(store, "note-eng")?.qaNote).toBe("");
  });

  it("QA→Writer handoff lands on ship when siblings unlock", () => {
    const qa = createSoftwareTeamPipelineItem({
      id: "qa-handoff",
      roleId: "qa",
      stageId: "review",
      deliveryId: "d-h",
      qaNote: "",
      roleHistory: ["qa"],
    })!;
    const reviewer = createSoftwareTeamPipelineItem({
      id: "rev-handoff",
      roleId: "reviewer",
      stageId: "review",
      deliveryId: "d-h",
      reviewNote: "looks good",
      roleHistory: ["reviewer"],
    })!;
    const qaWithNote = { ...qa, qaNote: "cases pass" };
    const blocked = applySoftwareTeamHandoff(qa, 40);
    expect(blocked.kind).toBe("advanced");
    if (blocked.kind === "advanced") expect(blocked.toStage).toBe("review");
    const step = applySoftwareTeamHandoff(qaWithNote, 41, [qaWithNote, reviewer]);
    expect(step.kind).toBe("advanced");
    if (step.kind !== "advanced") return;
    expect(step.toRole).toBe("writer");
    expect(step.toStage).toBe("ship");
    expect(step.item.reviewNote).toBe("looks good");
    expect(step.starter).toMatch(/looks good/);
    let store = addSoftwareTeamPipelineItem(
      createEmptySoftwareTeamPipelineStore(),
      reviewer,
    );
    store = addSoftwareTeamPipelineItem(store, qaWithNote);
    const handed = applySoftwareTeamHandoffToStore(store, "qa-handoff", 42);
    expect(handed.result?.kind).toBe("advanced");
    if (handed.result?.kind !== "advanced") return;
    expect(handed.mode).toBe("created");
    expect(handed.result.toStage).toBe("ship");
    expect(pipelineItemById(handed.store, "qa-handoff")?.roleId).toBe("qa");
    expect(pipelineItemById(handed.store, "qa-handoff")?.stageId).toBe("review");
    const writer = handed.store.items.find((item) => item.roleId === "writer");
    expect(writer?.stageId).toBe("ship");
    expect(writer?.sessionId).toBe("");
    expect(handed.result.item.id).toBe(writer?.id);
  });

  it("does not invent Host plan or goal ids when syncing slice refs", () => {
    const store = addSoftwareTeamPipelineItem(
      createEmptySoftwareTeamPipelineStore(),
      {
        id: "host-1",
        roleId: "product",
        deliveryId: "d-host",
        planRef: "/plan billing",
        goalRef: "checkout",
      },
    );
    const next = syncSoftwareTeamDeliverySliceRefs(store, "d-host", {
      planRef: "/plan billing",
      goalRef: "checkout",
    });
    expect(pipelineItemById(next, "host-1")).toMatchObject({
      planRef: "/plan billing",
      goalRef: "checkout",
    });
    expect(pipelineItemById(next, "host-1")?.planRef).not.toMatch(
      /^[0-9a-f-]{36}$/i,
    );
    expect(pipelineItemById(next, "host-1")?.goalRef).not.toMatch(
      /^[0-9a-f-]{36}$/i,
    );
  });
});

describe("Software Works studio prefs + full roster + copy export", () => {
  it("remembers the last delivery filter and falls back when the id is gone", () => {
    const storage = memoryStore();
    expect(parseSoftwareTeamStudioPrefs(null)).toEqual({
      deliveryFilter: SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
      showArchived: false,
    });
    saveSoftwareTeamStudioPrefs(
      { deliveryFilter: "d-keep", showArchived: true },
      storage,
    );
    expect(storage.getItem(SOFTWARE_TEAM_DLC_STUDIO_PREFS_KEY)).toContain("d-keep");
    expect(loadSoftwareTeamStudioPrefs(storage)).toEqual({
      deliveryFilter: "d-keep",
      showArchived: true,
    });
    const keep = createSoftwareTeamPipelineItem({
      id: "sp-1",
      roleId: "product",
      deliveryId: "d-keep",
    })!;
    expect(
      resolveSoftwareTeamStudioPrefs(
        { deliveryFilter: "d-gone", showArchived: false },
        [keep],
      ).deliveryFilter,
    ).toBe(SOFTWARE_TEAM_DELIVERY_FILTER_ALL);
    expect(
      resolveSoftwareTeamStudioPrefs(
        { deliveryFilter: "d-keep", showArchived: false },
        [keep],
      ),
    ).toEqual({ deliveryFilter: "d-keep", showArchived: false });
  });

  it("turns Show archived on when the remembered delivery is archived", () => {
    const item = createSoftwareTeamPipelineItem({
      id: "sp-arch",
      roleId: "engineer",
      deliveryId: "d-arch",
      archived: true,
    })!;
    const resolved = resolveSoftwareTeamStudioPrefs(
      { deliveryFilter: "d-arch", showArchived: false },
      [item],
      ["d-arch"],
    );
    expect(resolved).toEqual({
      deliveryFilter: "d-arch",
      showArchived: true,
    });
  });

  it("persists All when the remembered delivery id was deleted", () => {
    const storage = memoryStore();
    const keep = createSoftwareTeamPipelineItem({
      id: "sp-persist",
      roleId: "product",
      deliveryId: "d-keep",
    })!;
    const next = commitSoftwareTeamStudioPrefs(
      { deliveryFilter: "d-gone", showArchived: false },
      [keep],
      [],
      storage,
    );
    expect(next.deliveryFilter).toBe(SOFTWARE_TEAM_DELIVERY_FILTER_ALL);
    expect(loadSoftwareTeamStudioPrefs(storage).deliveryFilter).toBe(
      SOFTWARE_TEAM_DELIVERY_FILTER_ALL,
    );
  });

  it("shows only one Studio overlay and lets conflict win", () => {
    expect(
      pickSoftwareTeamStudioOverlay({
        conflict: true,
        remove: true,
        notes: true,
        editor: true,
        wizard: true,
        detail: true,
      }),
    ).toBe("conflict");
    expect(
      pickSoftwareTeamStudioOverlay({
        wizard: true,
        detail: true,
      }),
    ).toBe("wizard");
    expect(pickSoftwareTeamStudioOverlay({})).toBeNull();
  });

  it("lists the full Product→Writer roster as missing roles", () => {
    expect([...SOFTWARE_TEAM_ROSTER_ROLES]).toEqual([
      "product",
      "architect",
      "engineer",
      "reviewer",
      "qa",
      "writer",
    ]);
    expect([...SOFTWARE_TEAM_ATTACH_PREFER]).toEqual([
      "product",
      "engineer",
      "reviewer",
    ]);
    const product = createSoftwareTeamPipelineItem({
      id: "rs-1",
      roleId: "product",
      deliveryId: "d-rs",
    })!;
    expect(missingSoftwareTeamDeliveryRoles([product], "d-rs")).toEqual([
      "architect",
      "engineer",
      "reviewer",
      "qa",
      "writer",
    ]);
    const full = SOFTWARE_TEAM_ROSTER_ROLES.map((roleId, index) =>
      createSoftwareTeamPipelineItem({
        id: `rs-${roleId}`,
        roleId,
        deliveryId: "d-rs",
        updatedAt: index + 1,
      })!,
    );
    expect(missingSoftwareTeamDeliveryRoles(full, "d-rs")).toEqual([]);
  });

  it("copies markdown when Host export is refused and never writes ~/.grok", async () => {
    expect(softwareTeamExportShouldCopyInstead("ok_project")).toBe(false);
    expect(softwareTeamExportShouldCopyInstead("need_host")).toBe(true);
    expect(softwareTeamExportShouldCopyInstead("blocked_shared_home")).toBe(true);
    const item = createSoftwareTeamPipelineItem({
      id: "cp-1",
      roleId: "product",
      title: "Billing",
      deliveryId: "d-copy",
    })!;
    const detail = buildSoftwareTeamDeliveryDetail({
      items: [item],
      target: { kind: "delivery", deliveryId: "d-copy" },
    })!;
    const blocked = await exportSoftwareTeamDeliverySummary({
      projectPath: "~/.grok",
      detail,
      host: {
        isDesktopHost: () => true,
        writeFile: async () => {
          throw new Error("should not write");
        },
      },
    });
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    expect(softwareTeamExportShouldCopyInstead(blocked.reason)).toBe(true);
    expect(composeSoftwareTeamDeliveryMarkdown(detail)).toContain("# Billing");
  });
});

describe("Software Works delivery handoff keeps the source card", () => {
  it("mutates ungrouped cards and keeps delivery cards", () => {
    const loose = createSoftwareTeamPipelineItem({
      id: "loose-1",
      roleId: "product",
    })!;
    expect(softwareTeamHandoffKeepsSourceCard(loose)).toBe(false);
    const bound = createSoftwareTeamPipelineItem({
      id: "bound-1",
      roleId: "product",
      deliveryId: "d-keep",
    })!;
    expect(softwareTeamHandoffKeepsSourceCard(bound)).toBe(true);
  });

  it("creates or focuses the next-role sibling without rewriting the source", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "src-prod",
      roleId: "product",
      title: "Auth",
      deliveryId: "d-sib",
      planRef: "docs/sdlc/spec.md",
      sessionId: "sess-prod",
    });
    const first = applySoftwareTeamHandoffToStore(store, "src-prod", 5);
    expect(first.mode).toBe("created");
    expect(pipelineItemById(first.store, "src-prod")?.roleId).toBe("product");
    expect(pipelineItemById(first.store, "src-prod")?.sessionId).toBe("sess-prod");
    const architect = first.store.items.find((item) => item.roleId === "architect");
    expect(architect?.sessionId).toBe("");
    expect(architect?.planRef).toBe("docs/sdlc/spec.md");
    expect(first.result?.kind).toBe("advanced");
    if (first.result?.kind === "advanced") {
      expect(first.result.item.id).toBe(architect?.id);
      expect(first.result.starter).toMatch(/Architect/);
      expect(first.result.starter).not.toMatch(/Claude|Codex/i);
    }

    const second = applySoftwareTeamHandoffToStore(first.store, "src-prod", 6);
    expect(second.mode).toBe("focus");
    expect(second.store.items.filter((item) => item.roleId === "architect")).toHaveLength(
      1,
    );
    expect(pipelineItemById(second.store, "src-prod")?.roleId).toBe("product");
  });

  it("ships a Writer sibling and leaves Engineer in place", () => {
    let store = addSoftwareTeamPipelineItem(createEmptySoftwareTeamPipelineStore(), {
      id: "ship-eng",
      roleId: "engineer",
      stageId: "build",
      deliveryId: "d-sib-ship",
      sessionDonePending: true,
      roleHistory: ["engineer"],
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "ship-rev",
      roleId: "reviewer",
      deliveryId: "d-sib-ship",
      reviewNote: "nits",
      roleHistory: ["reviewer"],
    });
    store = addSoftwareTeamPipelineItem(store, {
      id: "ship-qa",
      roleId: "qa",
      deliveryId: "d-sib-ship",
      qaNote: "vitest",
      roleHistory: ["qa"],
    });
    const shipped = applySoftwareTeamDeliveryShipToStore(store, "ship-eng", 9);
    expect(shipped.ok).toBe(true);
    if (!shipped.ok) return;
    expect(shipped.mode).toBe("created");
    expect(pipelineItemById(shipped.store, "ship-eng")?.roleId).toBe("engineer");
    const writer = shipped.store.items.find((item) => item.roleId === "writer");
    expect(writer?.stageId).toBe("ship");
    expect(writer?.sessionId).toBe("");
    expect(shipped.starter).toMatch(/Tech Writer/);
    expect(shipped.item.id).toBe(writer?.id);

    const again = applySoftwareTeamDeliveryShipToStore(shipped.store, "ship-eng", 10);
    expect(again.ok).toBe(true);
    if (!again.ok) return;
    expect(again.mode).toBe("focus");
    expect(again.store.items.filter((item) => item.roleId === "writer")).toHaveLength(1);
  });
});
