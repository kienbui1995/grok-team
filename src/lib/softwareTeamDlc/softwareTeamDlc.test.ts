import { afterEach, describe, expect, it, vi } from "vitest";
import { AGENT_KANBAN_COLUMN_IDS } from "@/lib/kanbanBoard";
import {
  DEFAULT_SOFTWARE_TEAM_DLC_ENABLED,
  SOFTWARE_TEAM_DLC_CHANGE_EVENT,
  SOFTWARE_TEAM_DLC_INSTALL_TARGETS,
  SOFTWARE_TEAM_DLC_STORAGE_KEY,
  SOFTWARE_TEAM_DLC_TAGS_KEY,
  SOFTWARE_TEAM_ROLE_IDS,
  SOFTWARE_TEAM_ROLES,
  SOFTWARE_TEAM_SDLC_STAGE_IDS,
  clearSoftwareTeamSessionTag,
  getSoftwareTeamSessionTag,
  isSoftwareTeamDlcEnabled,
  isSoftwareTeamRoleId,
  kanbanColumnSdlcAliasKey,
  loadSoftwareTeamDlcEnabled,
  loadSoftwareTeamSessionTagMap,
  mapSdlcStageToKanbanColumn,
  parseSoftwareTeamDlcEnabled,
  parseSoftwareTeamSessionTagMap,
  planSoftwareTeamDlcPackWrite,
  saveSoftwareTeamDlcEnabled,
  saveSoftwareTeamSessionTagMap,
  sdlcStagesForKanbanColumn,
  softwareTeamDlcPackFiles,
  softwareTeamDlcPackManifest,
  softwareTeamDlcWouldRewriteSharedGrokHome,
  softwareTeamRoleById,
  softwareTeamRoleSlashHint,
  softwareTeamRoleStarterPrompt,
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
