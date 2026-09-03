/**
 * Software Works — project pipeline SoT (`.grok/software-works.json`).
 *
 * localStorage remains a cache. With Host + a real project folder the board
 * reads/writes this file. Never writes shared `~/.grok`. Parse failure
 * refuses overwrite (optional `.bak`) so unknown items are not wiped.
 *
 * Schema v1–v2 are still readable (no `activity` / no archive map). Writes are
 * v3. There is no Host fs-watch API — Studio reloads on open / window focus /
 * visibility using `mtimeMs` from `fsReadFile`.
 *
 * Dirty local + a different foreign file = conflict: keep memory, do not
 * clobber the file. Implicit persist backs up the foreign file to `.bak`
 * and refuses unless the user picks **Keep this board**
 * (`overwriteConflict`). **Use project file** hydrates even when local is
 * dirty. A never-accepted file is also foreign.
 */

import * as api from "@/lib/api";
import type { MessageKey } from "@/i18n";
import { isSoftwareTeamSharedHomePath } from "./delivery";
import {
  parseSoftwareTeamActivityList,
  type SoftwareTeamActivityEvent,
} from "./activity";
import {
  createEmptySoftwareTeamPipelineStore,
  loadSoftwareTeamPipelineStore,
  parseSoftwareTeamArchivedDeliveryIds,
  parseSoftwareTeamPipelineItem,
  persistSoftwareTeamPipeline,
  softwareTeamArchivedDeliveryIds,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamPipelineStore,
} from "./pipeline";

export const SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE =
  ".grok/software-works.json";
export const SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE =
  ".grok/software-works.json.bak";
export const SOFTWARE_TEAM_PIPELINE_SCHEMA = "software-works.pipeline";
export const SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION = 3;
/** Oldest file version this reader still hydrates. */
export const SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION_MIN = 1;

export const SOFTWARE_TEAM_PIPELINE_FILE_REASONS = [
  "ok_project",
  "missing",
  "cache_only",
  "need_host",
  "need_project",
  "blocked_shared_home",
  "parse_fail",
  "conflict",
  "host_error",
] as const;

export type SoftwareTeamPipelineFileReason =
  (typeof SOFTWARE_TEAM_PIPELINE_FILE_REASONS)[number];

export type SoftwareTeamPipelineFileHost = {
  isDesktopHost: () => boolean;
  readFile: (
    projectPath: string,
    relative: string,
  ) => Promise<{
    error?: string | null;
    text?: string | null;
    mtimeMs?: number | null;
  }>;
  writeFile: (
    projectPath: string,
    relative: string,
    content: string,
  ) => Promise<unknown>;
};

export type SoftwareTeamPipelineFileDoc = {
  schema: typeof SOFTWARE_TEAM_PIPELINE_SCHEMA;
  version: number;
  updatedAt: number;
  items: SoftwareTeamPipelineItem[];
  activity: SoftwareTeamActivityEvent[];
  archivedDeliveryIds: string[];
};

export type SoftwareTeamPipelineFileParse =
  | { ok: true; store: SoftwareTeamPipelineStore; version: number }
  | { ok: false; reason: Extract<SoftwareTeamPipelineFileReason, "parse_fail"> };

export type SoftwareTeamPipelineFileRead =
  | {
      ok: true;
      reason: Extract<SoftwareTeamPipelineFileReason, "ok_project" | "missing">;
      store: SoftwareTeamPipelineStore | null;
      raw: string;
      mtimeMs?: number | null;
    }
  | {
      ok: false;
      reason: Exclude<
        SoftwareTeamPipelineFileReason,
        "ok_project" | "missing" | "cache_only"
      >;
      error?: string;
      raw?: string;
      backedUp?: boolean;
    };

export type SoftwareTeamPipelineFileWrite =
  | {
      ok: true;
      reason: Extract<SoftwareTeamPipelineFileReason, "ok_project" | "cache_only">;
      skipped?: boolean;
    }
  | {
      ok: false;
      reason: Exclude<
        SoftwareTeamPipelineFileReason,
        "ok_project" | "missing" | "cache_only"
      >;
      error?: string;
    };

let boundProjectPath: string | null = null;
let lastFileStatus: SoftwareTeamPipelineFileWrite | SoftwareTeamPipelineFileRead | null =
  null;
let lastSeenMtimeMs: number | null = null;
let lastSeenFingerprint: string | null = null;

export const SOFTWARE_TEAM_PIPELINE_FILE_EVENT =
  "grok-software-team-dlc-pipeline-file";

export function bindSoftwareTeamPipelineProjectPath(
  projectPath?: string | null,
): string | null {
  const next = (projectPath ?? "").trim() || null;
  if (next !== boundProjectPath) {
    lastSeenMtimeMs = null;
    lastSeenFingerprint = null;
  }
  boundProjectPath = next;
  return boundProjectPath;
}

export function boundSoftwareTeamPipelineProjectPath(): string | null {
  return boundProjectPath;
}

export function lastSoftwareTeamPipelineFileStatus():
  | SoftwareTeamPipelineFileWrite
  | SoftwareTeamPipelineFileRead
  | null {
  return lastFileStatus;
}

export function lastSoftwareTeamPipelineFileMtimeMs(): number | null {
  return lastSeenMtimeMs;
}

export function resetSoftwareTeamPipelineFileSeenState(): void {
  lastSeenMtimeMs = null;
  lastSeenFingerprint = null;
}

export function softwareTeamPipelineStoreFingerprint(
  store: SoftwareTeamPipelineStore,
): string {
  return JSON.stringify({
    items: store.items,
    activity: store.activity ?? [],
    archivedDeliveryIds: softwareTeamArchivedDeliveryIds(store),
  });
}

function storeFingerprint(store: SoftwareTeamPipelineStore): string {
  return softwareTeamPipelineStoreFingerprint(store);
}

export function isSoftwareTeamPipelineLocalDirty(
  cached: SoftwareTeamPipelineStore,
): boolean {
  if (lastSeenFingerprint == null) return false;
  return storeFingerprint(cached) !== lastSeenFingerprint;
}

function rememberSeen(
  store: SoftwareTeamPipelineStore,
  mtimeMs?: number | null,
): void {
  lastSeenFingerprint = storeFingerprint(store);
  if (typeof mtimeMs === "number" && Number.isFinite(mtimeMs)) {
    lastSeenMtimeMs = mtimeMs;
  }
}

function mtimeFromWriteResult(result: unknown): number | null {
  if (!result || typeof result !== "object") return null;
  const mtimeMs = (result as { mtimeMs?: unknown }).mtimeMs;
  return typeof mtimeMs === "number" && Number.isFinite(mtimeMs) ? mtimeMs : null;
}

async function backupRawPipelineFile(
  host: SoftwareTeamPipelineFileHost,
  projectPath: string,
  raw: string,
): Promise<boolean> {
  try {
    await host.writeFile(
      projectPath,
      SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE,
      raw,
    );
    return true;
  } catch {
    return false;
  }
}

function emitFileStatus(
  status: SoftwareTeamPipelineFileWrite | SoftwareTeamPipelineFileRead,
): void {
  lastFileStatus = status;
  if (
    typeof window === "undefined" ||
    typeof window.dispatchEvent !== "function"
  ) {
    return;
  }
  try {
    window.dispatchEvent(
      new CustomEvent(SOFTWARE_TEAM_PIPELINE_FILE_EVENT, { detail: status }),
    );
  } catch {
    /* ignore */
  }
}

export function defaultSoftwareTeamPipelineFileHost(): SoftwareTeamPipelineFileHost {
  return {
    isDesktopHost: () => api.isDesktopHost(),
    readFile: (projectPath, relative) => api.fsReadFile(projectPath, relative),
    writeFile: (projectPath, relative, content) =>
      api.fsWriteFile(projectPath, relative, content),
  };
}

export function planSoftwareTeamPipelineFileWrite(input: {
  projectPath?: string | null;
  host?: Pick<SoftwareTeamPipelineFileHost, "isDesktopHost">;
}): {
  allowed: boolean;
  reason: SoftwareTeamPipelineFileReason;
  projectPath: string;
} {
  const projectPath = (input.projectPath ?? "").trim();
  if (!projectPath) {
    return { allowed: false, reason: "need_project", projectPath: "" };
  }
  if (isSoftwareTeamSharedHomePath(projectPath)) {
    return { allowed: false, reason: "blocked_shared_home", projectPath };
  }
  const host = input.host ?? defaultSoftwareTeamPipelineFileHost();
  if (!host.isDesktopHost()) {
    return { allowed: false, reason: "need_host", projectPath };
  }
  return { allowed: true, reason: "ok_project", projectPath };
}

export function softwareTeamPipelineFileMessageKey(
  reason: SoftwareTeamPipelineFileReason,
): MessageKey {
  switch (reason) {
    case "ok_project":
      return "softwareTeamDlc.pipelineFileOk";
    case "missing":
      return "softwareTeamDlc.pipelineFileMissing";
    case "cache_only":
      return "softwareTeamDlc.pipelineFileCache";
    case "need_host":
      return "softwareTeamDlc.pipelineFileNeedHost";
    case "need_project":
      return "softwareTeamDlc.pipelineFileNeedProject";
    case "blocked_shared_home":
      return "softwareTeamDlc.pipelineFileBlockedHome";
    case "parse_fail":
      return "softwareTeamDlc.pipelineFileParseFail";
    case "conflict":
      return "softwareTeamDlc.pipelineFileConflict";
    case "host_error":
      return "softwareTeamDlc.pipelineFileHostError";
    default: {
      const _never: never = reason;
      return _never;
    }
  }
}

export function serializeSoftwareTeamPipelineFile(
  store: SoftwareTeamPipelineStore,
  now = Date.now(),
): string {
  const doc: SoftwareTeamPipelineFileDoc = {
    schema: SOFTWARE_TEAM_PIPELINE_SCHEMA,
    version: SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION,
    updatedAt: now,
    items: store.items,
    activity: store.activity ?? [],
    archivedDeliveryIds: softwareTeamArchivedDeliveryIds(store),
  };
  return `${JSON.stringify(doc, null, 2)}\n`;
}

export function parseSoftwareTeamPipelineFileDoc(
  raw: unknown,
): SoftwareTeamPipelineFileParse {
  let data: unknown = raw;
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) {
      return {
        ok: true,
        store: createEmptySoftwareTeamPipelineStore(),
        version: SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION_MIN,
      };
    }
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      return { ok: false, reason: "parse_fail" };
    }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, reason: "parse_fail" };
  }
  const rec = data as Record<string, unknown>;
  if (typeof rec.schema === "string" && rec.schema !== SOFTWARE_TEAM_PIPELINE_SCHEMA) {
    return { ok: false, reason: "parse_fail" };
  }
  const version =
    typeof rec.version === "number" && Number.isFinite(rec.version)
      ? rec.version
      : SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION_MIN;
  if (
    version < SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION_MIN ||
    version > SOFTWARE_TEAM_PIPELINE_SCHEMA_VERSION
  ) {
    return { ok: false, reason: "parse_fail" };
  }
  if (!Array.isArray(rec.items)) {
    return { ok: false, reason: "parse_fail" };
  }
  const items: SoftwareTeamPipelineItem[] = [];
  const seen = new Set<string>();
  for (const entry of rec.items) {
    const item = parseSoftwareTeamPipelineItem(entry);
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }
  const archivedDeliveryIds = parseSoftwareTeamArchivedDeliveryIds(
    rec.archivedDeliveryIds,
  );
  for (const item of items) {
    if (
      item.archived &&
      item.deliveryId &&
      !archivedDeliveryIds.includes(item.deliveryId)
    ) {
      archivedDeliveryIds.push(item.deliveryId);
    }
  }
  return {
    ok: true,
    store: {
      items,
      activity: parseSoftwareTeamActivityList(rec.activity),
      archivedDeliveryIds,
    },
    version,
  };
}

export function pipelineFileItemsEqual(
  a: SoftwareTeamPipelineStore,
  b: SoftwareTeamPipelineStore,
): boolean {
  return storeFingerprint(a) === storeFingerprint(b);
}

async function readRaw(
  host: SoftwareTeamPipelineFileHost,
  projectPath: string,
  relative: string,
): Promise<{
  text: string | null;
  missing: boolean;
  error?: string;
  mtimeMs?: number | null;
}> {
  try {
    const read = await host.readFile(projectPath, relative);
    const mtimeMs =
      typeof read.mtimeMs === "number" && Number.isFinite(read.mtimeMs)
        ? read.mtimeMs
        : null;
    if (read.error) {
      const err = read.error.trim();
      if (/not a file|no such|not found|missing/i.test(err)) {
        return { text: null, missing: true, mtimeMs };
      }
      return { text: null, missing: false, error: err, mtimeMs };
    }
    if (typeof read.text === "string") {
      return { text: read.text, missing: false, mtimeMs };
    }
    return { text: null, missing: true, mtimeMs };
  } catch (err) {
    const error =
      err instanceof Error && err.message.trim()
        ? err.message.trim()
        : String(err ?? "read failed");
    if (/not a file|no such|not found|missing/i.test(error)) {
      return { text: null, missing: true };
    }
    return { text: null, missing: false, error };
  }
}

export async function readSoftwareTeamPipelineFile(input: {
  projectPath?: string | null;
  host?: SoftwareTeamPipelineFileHost;
  /** Default true. Reload sets false so only the final status is emitted. */
  emitStatus?: boolean;
}): Promise<SoftwareTeamPipelineFileRead> {
  const host = input.host ?? defaultSoftwareTeamPipelineFileHost();
  const publish = (status: SoftwareTeamPipelineFileRead) => {
    if (input.emitStatus !== false) emitFileStatus(status);
  };
  const plan = planSoftwareTeamPipelineFileWrite({
    projectPath: input.projectPath,
    host,
  });
  if (!plan.allowed) {
    const fail: SoftwareTeamPipelineFileRead = {
      ok: false,
      reason: plan.reason as Exclude<
        SoftwareTeamPipelineFileReason,
        "ok_project" | "missing" | "cache_only"
      >,
    };
    publish(fail);
    return fail;
  }
  const raw = await readRaw(host, plan.projectPath, SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE);
  if (raw.missing || !(raw.text ?? "").trim()) {
    const result: SoftwareTeamPipelineFileRead = {
      ok: true,
      reason: "missing",
      store: null,
      raw: "",
      mtimeMs: raw.mtimeMs ?? null,
    };
    publish(result);
    return result;
  }
  if (raw.error || raw.text == null) {
    const fail: SoftwareTeamPipelineFileRead = {
      ok: false,
      reason: "host_error",
      error: raw.error,
    };
    publish(fail);
    return fail;
  }
  const parsed = parseSoftwareTeamPipelineFileDoc(raw.text);
  if (!parsed.ok) {
    const backedUp = await backupRawPipelineFile(
      host,
      plan.projectPath,
      raw.text,
    );
    const fail: SoftwareTeamPipelineFileRead = {
      ok: false,
      reason: "parse_fail",
      raw: raw.text,
      backedUp,
    };
    publish(fail);
    return fail;
  }
  const result: SoftwareTeamPipelineFileRead = {
    ok: true,
    reason: "ok_project",
    store: parsed.store,
    raw: raw.text,
    mtimeMs: raw.mtimeMs ?? null,
  };
  publish(result);
  return result;
}

export async function writeSoftwareTeamPipelineFile(input: {
  projectPath?: string | null;
  store: SoftwareTeamPipelineStore;
  host?: SoftwareTeamPipelineFileHost;
  now?: number;
  /** After a `.bak` of the foreign file, write this store anyway. */
  overwriteConflict?: boolean;
}): Promise<SoftwareTeamPipelineFileWrite> {
  const host = input.host ?? defaultSoftwareTeamPipelineFileHost();
  const plan = planSoftwareTeamPipelineFileWrite({
    projectPath: input.projectPath,
    host,
  });
  if (!plan.allowed) {
    const fail: SoftwareTeamPipelineFileWrite = {
      ok: false,
      reason: plan.reason as Exclude<
        SoftwareTeamPipelineFileReason,
        "ok_project" | "missing" | "cache_only"
      >,
    };
    emitFileStatus(fail);
    return fail;
  }
  const existing = await readRaw(
    host,
    plan.projectPath,
    SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE,
  );
  if (existing.error && !existing.missing) {
    const fail: SoftwareTeamPipelineFileWrite = {
      ok: false,
      reason: "host_error",
      error: existing.error,
    };
    emitFileStatus(fail);
    return fail;
  }
  if (existing.text != null && !existing.missing) {
    const parsed = parseSoftwareTeamPipelineFileDoc(existing.text);
    if (!parsed.ok) {
      const backedUp = await backupRawPipelineFile(
        host,
        plan.projectPath,
        existing.text,
      );
      if (!(input.overwriteConflict && backedUp)) {
        const fail: SoftwareTeamPipelineFileWrite = {
          ok: false,
          reason: "parse_fail",
        };
        emitFileStatus(fail);
        return fail;
      }
    } else if (pipelineFileItemsEqual(parsed.store, input.store)) {
      rememberSeen(input.store, existing.mtimeMs);
      const skip: SoftwareTeamPipelineFileWrite = {
        ok: true,
        reason: "ok_project",
        skipped: true,
      };
      emitFileStatus(skip);
      return skip;
    } else {
      const foreign =
        lastSeenFingerprint == null ||
        storeFingerprint(parsed.store) !== lastSeenFingerprint;
      if (foreign) {
        const backedUp = await backupRawPipelineFile(
          host,
          plan.projectPath,
          existing.text,
        );
        if (!backedUp || !input.overwriteConflict) {
          const fail: SoftwareTeamPipelineFileWrite = {
            ok: false,
            reason: "conflict",
            error: backedUp
              ? SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE
              : "foreign file unchanged",
          };
          emitFileStatus(fail);
          return fail;
        }
      }
    }
  }
  try {
    const written = await host.writeFile(
      plan.projectPath,
      SOFTWARE_TEAM_PIPELINE_FILE_RELATIVE,
      serializeSoftwareTeamPipelineFile(input.store, input.now),
    );
    rememberSeen(input.store, mtimeFromWriteResult(written));
    const ok: SoftwareTeamPipelineFileWrite = { ok: true, reason: "ok_project" };
    emitFileStatus(ok);
    return ok;
  } catch (err) {
    const error =
      err instanceof Error && err.message.trim()
        ? err.message.trim()
        : String(err ?? "pipeline write failed");
    const fail: SoftwareTeamPipelineFileWrite = {
      ok: false,
      reason: "host_error",
      error,
    };
    emitFileStatus(fail);
    return fail;
  }
}

export async function hydrateSoftwareTeamPipelineFromProject(input: {
  projectPath?: string | null;
  host?: SoftwareTeamPipelineFileHost;
  storage?: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void };
  /** Accept path: replace even when the in-app cache is dirty. */
  overwriteDirty?: boolean;
}): Promise<SoftwareTeamPipelineFileRead> {
  const loaded = await readSoftwareTeamPipelineFile(input);
  if (loaded.ok && loaded.store) {
    const cached = loadSoftwareTeamPipelineStore(input.storage);
    const dirty = isSoftwareTeamPipelineLocalDirty(cached);
    if (
      dirty &&
      !input.overwriteDirty &&
      !pipelineFileItemsEqual(loaded.store, cached)
    ) {
      const fail: SoftwareTeamPipelineFileRead = {
        ok: false,
        reason: "conflict",
        error: SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE,
      };
      emitFileStatus(fail);
      return fail;
    }
    persistSoftwareTeamPipeline(loaded.store, input.storage);
    rememberSeen(loaded.store, loaded.mtimeMs);
  }
  return loaded;
}

export function queueSoftwareTeamPipelineProjectPersist(
  store: SoftwareTeamPipelineStore,
  host?: SoftwareTeamPipelineFileHost,
): void {
  const projectPath = boundProjectPath;
  if (!projectPath) {
    emitFileStatus({ ok: true, reason: "cache_only" });
    return;
  }
  void writeSoftwareTeamPipelineFile({ projectPath, store, host });
}

export const SOFTWARE_TEAM_PIPELINE_RELOAD_KINDS = [
  "replaced",
  "unchanged",
  "missing",
  "parse_failed",
  "need_host",
  "need_project",
  "blocked_shared_home",
  "conflict",
  "host_error",
] as const;

export type SoftwareTeamPipelineReloadKind =
  (typeof SOFTWARE_TEAM_PIPELINE_RELOAD_KINDS)[number];

export type SoftwareTeamPipelineReload =
  | {
      ok: true;
      kind: Extract<SoftwareTeamPipelineReloadKind, "replaced">;
      store: SoftwareTeamPipelineStore;
      mtimeMs: number | null;
    }
  | {
      ok: true;
      kind: Extract<SoftwareTeamPipelineReloadKind, "unchanged" | "missing">;
      mtimeMs?: number | null;
    }
  | {
      ok: false;
      kind: Exclude<
        SoftwareTeamPipelineReloadKind,
        "replaced" | "unchanged" | "missing"
      >;
      backedUp?: boolean;
      error?: string;
    };

/**
 * Re-read `.grok/software-works.json` when Host + project are available.
 * A different file replaces a clean cache. Dirty local + a different file
 * is a conflict even when mtime is missing or did not increase.
 * Parse failure keeps the cache and writes `.bak`. No polling.
 */
export async function reloadSoftwareTeamPipelineIfNewer(input: {
  projectPath?: string | null;
  host?: SoftwareTeamPipelineFileHost;
  storage?: {
    getItem: (k: string) => string | null;
    setItem: (k: string, v: string) => void;
  };
  cached?: SoftwareTeamPipelineStore;
}): Promise<SoftwareTeamPipelineReload> {
  const host = input.host ?? defaultSoftwareTeamPipelineFileHost();
  const plan = planSoftwareTeamPipelineFileWrite({
    projectPath: input.projectPath,
    host,
  });
  if (!plan.allowed) {
    const kind = plan.reason as Extract<
      SoftwareTeamPipelineReloadKind,
      "need_host" | "need_project" | "blocked_shared_home"
    >;
    const fail: SoftwareTeamPipelineReload = { ok: false, kind };
    emitFileStatus({
      ok: false,
      reason: plan.reason as Exclude<
        SoftwareTeamPipelineFileReason,
        "ok_project" | "missing" | "cache_only"
      >,
    });
    return fail;
  }
  const cached =
    input.cached ?? loadSoftwareTeamPipelineStore(input.storage);
  const prevFingerprint = lastSeenFingerprint;
  const loaded = await readSoftwareTeamPipelineFile({
    projectPath: plan.projectPath,
    host,
    emitStatus: false,
  });
  if (!loaded.ok) {
    emitFileStatus(loaded);
    if (loaded.reason === "parse_fail") {
      return {
        ok: false,
        kind: "parse_failed",
        backedUp: loaded.backedUp,
      };
    }
    return {
      ok: false,
      kind: "host_error",
      error: loaded.error,
    };
  }
  if (loaded.reason === "missing" || !loaded.store) {
    emitFileStatus(loaded);
    return { ok: true, kind: "missing", mtimeMs: loaded.mtimeMs ?? null };
  }
  const mtimeMs = loaded.mtimeMs ?? null;
  const fingerprint = storeFingerprint(loaded.store);
  const sameAsCache = pipelineFileItemsEqual(loaded.store, cached);
  const sameAsSeen = prevFingerprint != null && prevFingerprint === fingerprint;
  const dirty =
    prevFingerprint != null && storeFingerprint(cached) !== prevFingerprint;
  if (sameAsCache || sameAsSeen) {
    if (!dirty) rememberSeen(loaded.store, mtimeMs);
    emitFileStatus(loaded);
    return { ok: true, kind: "unchanged", mtimeMs };
  }
  if (dirty) {
    const fail: SoftwareTeamPipelineReload = { ok: false, kind: "conflict" };
    emitFileStatus({
      ok: false,
      reason: "conflict",
      error: SOFTWARE_TEAM_PIPELINE_BACKUP_RELATIVE,
    });
    return fail;
  }
  persistSoftwareTeamPipeline(loaded.store, input.storage);
  rememberSeen(loaded.store, mtimeMs);
  emitFileStatus(loaded);
  return {
    ok: true,
    kind: "replaced",
    store: loaded.store,
    mtimeMs,
  };
}

function fileReadFailToReload(
  loaded: Extract<SoftwareTeamPipelineFileRead, { ok: false }>,
): SoftwareTeamPipelineReload {
  switch (loaded.reason) {
    case "parse_fail":
      return {
        ok: false,
        kind: "parse_failed",
        backedUp: loaded.backedUp,
      };
    case "need_host":
      return { ok: false, kind: "need_host" };
    case "need_project":
      return { ok: false, kind: "need_project" };
    case "blocked_shared_home":
      return { ok: false, kind: "blocked_shared_home" };
    case "conflict":
      return { ok: false, kind: "conflict" };
    case "host_error":
      return { ok: false, kind: "host_error", error: loaded.error };
    default: {
      const _never: never = loaded.reason;
      return { ok: false, kind: "host_error", error: String(_never) };
    }
  }
}

/**
 * Replace the cache from `.grok/software-works.json` even when local is dirty.
 * Does not invent Host ids. Refuses shared `~/.grok`.
 */
export async function acceptSoftwareTeamPipelineFile(input: {
  projectPath?: string | null;
  host?: SoftwareTeamPipelineFileHost;
  storage?: {
    getItem: (k: string) => string | null;
    setItem: (k: string, v: string) => void;
  };
}): Promise<SoftwareTeamPipelineReload> {
  const loaded = await hydrateSoftwareTeamPipelineFromProject({
    ...input,
    overwriteDirty: true,
  });
  if (!loaded.ok) return fileReadFailToReload(loaded);
  if (loaded.reason === "missing" || !loaded.store) {
    return { ok: true, kind: "missing", mtimeMs: loaded.mtimeMs ?? null };
  }
  return {
    ok: true,
    kind: "replaced",
    store: loaded.store,
    mtimeMs: loaded.mtimeMs ?? null,
  };
}

/**
 * Keep the in-app board: backup the foreign project file, then write this store.
 */
export async function keepSoftwareTeamPipelineLocal(input: {
  projectPath?: string | null;
  store?: SoftwareTeamPipelineStore;
  host?: SoftwareTeamPipelineFileHost;
  storage?: {
    getItem: (k: string) => string | null;
    setItem: (k: string, v: string) => void;
  };
  now?: number;
}): Promise<SoftwareTeamPipelineFileWrite> {
  const store = input.store ?? loadSoftwareTeamPipelineStore(input.storage);
  persistSoftwareTeamPipeline(store, input.storage);
  return writeSoftwareTeamPipelineFile({
    projectPath: input.projectPath,
    store,
    host: input.host,
    now: input.now,
    overwriteConflict: true,
  });
}
