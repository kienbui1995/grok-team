/**
 * Story gates — sequential G1–G5 SDLC chips for the workbench overlay.
 * Config is local JSON (Lean sample under artifacts/engineering/…).
 * No secrets, PII, or third-screen factory UI.
 */

export const STORY_GATE_IDS = ["G1", "G2", "G3", "G4", "G5"] as const;
export type StoryGateId = (typeof STORY_GATE_IDS)[number];

export const STORY_GATE_STATUSES = ["pass", "fail", "open"] as const;
export type StoryGateStatus = (typeof STORY_GATE_STATUSES)[number];

export const STORY_GATE_KINDS = ["file", "diff"] as const;
export type StoryGateKind = (typeof STORY_GATE_KINDS)[number];

export const STORY_GATE_NAMES = ["spec", "adr", "dev", "qc", "demo"] as const;
export type StoryGateName = (typeof STORY_GATE_NAMES)[number];

export const STORY_GATES_LEAN_POC_ROOT =
  "artifacts/engineering/grok-team-lean-poc";

export const STORY_GATES_DEFAULT_CONFIG_URL = `/${STORY_GATES_LEAN_POC_ROOT}/story-gates.config.json`;

/** 04-design v1.1 — G5 is a middle gate, never the final destination. */
export const STORY_GATES_G5_MIDDLE_LABEL =
  "G5 · cổng giữa — không phải đích cuối";

export const STORY_GATES_G5_CHECKLIST_FILE = "g5-ship-path.md";

export const STORY_GATES_G5_DEMO_FILE = "g5-demo-note.md";

/** Fail UI / copy lock — G5 must never read as a finished ship. */
export const G5_FORBIDDEN_COPY =
  /Ship prod|AI tư vấn|Ship complete|\bDone\b|\bFinished\b/i;

/** Same-origin relative URL only; used by Vite UI / tests. */
export const STORY_GATES_CONFIG_URL_STORAGE_KEY = "grok.storyGates.configUrl";

export const STORY_GATES_OPEN_STORAGE_KEY = "grok.storyGates.open";

const FORBIDDEN_CONFIG_KEYS =
  /^(secret|secrets|token|password|passwd|api[_-]?key|authorization|private[_-]?key|access[_-]?key|refresh[_-]?token|email|phone|ssn|credential|credentials)$/i;

export type StoryGateOpenTarget = "artifact" | "checklist";

export type StoryGate = {
  id: StoryGateId;
  name: StoryGateName;
  status: StoryGateStatus;
  kind: StoryGateKind;
  /** Repo-relative file name, or the literal "diff" for G3. */
  artifact: string;
  /** G5 only: steps-toward-ship checklist (CEO / Kien gate). */
  checklist?: string;
};

export type G5Availability = {
  demo: boolean;
  checklist: boolean;
};

export type StoryGatesConfig = {
  id: string;
  artifactRoot: string;
  gates: StoryGate[];
};

export type ParseStoryGatesResult =
  | { ok: true; config: StoryGatesConfig }
  | { ok: false; error: string };

export const LEAN_POC_STORY_GATES_JSON = {
  id: "grok-team-lean-poc",
  artifactRoot: STORY_GATES_LEAN_POC_ROOT,
  gates: [
    {
      id: "G1",
      name: "spec",
      status: "pass",
      kind: "file",
      artifact: "g1-spec.md",
    },
    {
      id: "G2",
      name: "adr",
      status: "pass",
      kind: "file",
      artifact: "g2-adr.md",
    },
    {
      id: "G3",
      name: "dev",
      status: "open",
      kind: "diff",
      artifact: "diff",
    },
    {
      id: "G4",
      name: "qc",
      status: "open",
      kind: "file",
      artifact: "g4-qc-note.md",
    },
    {
      id: "G5",
      name: "demo",
      status: "open",
      kind: "file",
      artifact: STORY_GATES_G5_DEMO_FILE,
      checklist: STORY_GATES_G5_CHECKLIST_FILE,
    },
  ],
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function walkForbiddenKeys(value: unknown, path: string): string | null {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const hit = walkForbiddenKeys(value[i], `${path}[${i}]`);
      if (hit) return hit;
    }
    return null;
  }
  if (!isRecord(value)) return null;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_CONFIG_KEYS.test(key)) {
      return `${path}.${key}`;
    }
    const hit = walkForbiddenKeys(child, `${path}.${key}`);
    if (hit) return hit;
  }
  return null;
}

function isStoryGateId(value: unknown): value is StoryGateId {
  return (
    typeof value === "string" &&
    (STORY_GATE_IDS as readonly string[]).includes(value)
  );
}

function isStoryGateStatus(value: unknown): value is StoryGateStatus {
  return (
    typeof value === "string" &&
    (STORY_GATE_STATUSES as readonly string[]).includes(value)
  );
}

function isStoryGateKind(value: unknown): value is StoryGateKind {
  return (
    typeof value === "string" &&
    (STORY_GATE_KINDS as readonly string[]).includes(value)
  );
}

function isStoryGateName(value: unknown): value is StoryGateName {
  return (
    typeof value === "string" &&
    (STORY_GATE_NAMES as readonly string[]).includes(value)
  );
}

/** Relative POSIX path under artifacts/; no traversal, URLs, or home paths. */
export function isSafeArtifactRoot(value: string): boolean {
  if (!value || value.length > 240) return false;
  if (value.startsWith("/") || value.startsWith("\\")) return false;
  if (value.includes("://") || value.includes("\\")) return false;
  if (value.startsWith("~") || value.includes("..")) return false;
  if (!value.startsWith("artifacts/")) return false;
  return /^artifacts\/[A-Za-z0-9._/-]+$/.test(value);
}

export function isSafeArtifactName(value: string): boolean {
  if (value === "diff") return true;
  if (!value || value.length > 160) return false;
  if (value.includes("..") || value.includes("/") || value.includes("\\")) {
    return false;
  }
  if (value.includes("://")) return false;
  return /^[A-Za-z0-9._-]+$/.test(value);
}

export function parseStoryGatesConfig(raw: unknown): ParseStoryGatesResult {
  const forbidden = walkForbiddenKeys(raw, "config");
  if (forbidden) {
    return { ok: false, error: `forbidden config key ${forbidden}` };
  }
  if (!isRecord(raw)) {
    return { ok: false, error: "config must be an object" };
  }
  const id = raw.id;
  const artifactRoot = raw.artifactRoot;
  const gates = raw.gates;
  if (typeof id !== "string" || !/^[A-Za-z0-9._-]+$/.test(id)) {
    return { ok: false, error: "invalid config id" };
  }
  if (typeof artifactRoot !== "string" || !isSafeArtifactRoot(artifactRoot)) {
    return { ok: false, error: "invalid artifactRoot" };
  }
  if (!Array.isArray(gates) || gates.length !== STORY_GATE_IDS.length) {
    return { ok: false, error: "gates must be exactly G1–G5" };
  }

  const parsed: StoryGate[] = [];
  for (let i = 0; i < STORY_GATE_IDS.length; i += 1) {
    const gate = gates[i];
    const expectedId = STORY_GATE_IDS[i];
    if (!isRecord(gate)) {
      return { ok: false, error: `gate ${expectedId} must be an object` };
    }
    if (!isStoryGateId(gate.id) || gate.id !== expectedId) {
      return { ok: false, error: `gate ${i + 1} must be ${expectedId}` };
    }
    if (!isStoryGateName(gate.name)) {
      return { ok: false, error: `${expectedId} has invalid name` };
    }
    if (!isStoryGateStatus(gate.status)) {
      return { ok: false, error: `${expectedId} has invalid status` };
    }
    if (!isStoryGateKind(gate.kind)) {
      return { ok: false, error: `${expectedId} has invalid kind` };
    }
    if (typeof gate.artifact !== "string" || !isSafeArtifactName(gate.artifact)) {
      return { ok: false, error: `${expectedId} has invalid artifact` };
    }
    if (gate.kind === "diff") {
      if (gate.artifact !== "diff") {
        return { ok: false, error: `${expectedId} diff artifact must be "diff"` };
      }
    } else if (gate.artifact === "diff") {
      return { ok: false, error: `${expectedId} file artifact cannot be "diff"` };
    }
    const checklistRaw = gate.checklist;
    if (expectedId === "G5") {
      if (
        typeof checklistRaw !== "string" ||
        !isSafeArtifactName(checklistRaw) ||
        checklistRaw === "diff" ||
        checklistRaw === gate.artifact
      ) {
        return {
          ok: false,
          error: "G5 must include a distinct ship-path checklist",
        };
      }
      parsed.push({
        id: gate.id,
        name: gate.name,
        status: gate.status,
        kind: gate.kind,
        artifact: gate.artifact,
        checklist: checklistRaw,
      });
    } else if (checklistRaw != null) {
      return { ok: false, error: `${expectedId} cannot have a checklist` };
    } else {
      parsed.push({
        id: gate.id,
        name: gate.name,
        status: gate.status,
        kind: gate.kind,
        artifact: gate.artifact,
      });
    }
  }

  const g3 = parsed[2];
  if (g3.kind !== "diff" || g3.artifact !== "diff") {
    return { ok: false, error: "G3 must point at workbench diff" };
  }
  const g5 = parsed[4];
  if (g5.name !== "demo" || g5.kind !== "file" || !g5.checklist) {
    return { ok: false, error: "G5 must be the middle-gate demo + ship-path" };
  }

  return {
    ok: true,
    config: { id, artifactRoot, gates: parsed },
  };
}

const defaultParsed = parseStoryGatesConfig(LEAN_POC_STORY_GATES_JSON);
if (!defaultParsed.ok) {
  throw new Error(`default Story gates config is invalid: ${defaultParsed.error}`);
}

export const DEFAULT_STORY_GATES: StoryGatesConfig = defaultParsed.config;

export function gateDisplayPath(
  config: StoryGatesConfig,
  gate: StoryGate,
): string {
  if (gate.kind === "diff") return "diff";
  return `${config.artifactRoot}/${gate.artifact}`;
}

export function gatePublicUrl(
  config: StoryGatesConfig,
  gate: StoryGate,
): string | null {
  if (gate.kind === "diff") return null;
  return `/${config.artifactRoot}/${gate.artifact}`;
}

export function gateChecklistPath(
  config: StoryGatesConfig,
  gate: StoryGate,
): string | null {
  if (gate.id !== "G5" || !gate.checklist) return null;
  return `${config.artifactRoot}/${gate.checklist}`;
}

export function gateChecklistUrl(
  config: StoryGatesConfig,
  gate: StoryGate,
): string | null {
  const path = gateChecklistPath(config, gate);
  return path ? `/${path}` : null;
}

export function isForbiddenG5Copy(text: string): boolean {
  return G5_FORBIDDEN_COPY.test(text);
}

export function evaluateG5Status(input: {
  hasDemo: boolean;
  hasChecklist: boolean;
  configured: StoryGateStatus;
}): StoryGateStatus {
  if (!input.hasDemo || !input.hasChecklist) return "fail";
  return input.configured;
}

export function applyG5Availability(
  config: StoryGatesConfig,
  availability: G5Availability,
): StoryGatesConfig {
  return {
    ...config,
    gates: config.gates.map((gate) => {
      if (gate.id !== "G5") return gate;
      return {
        ...gate,
        status: evaluateG5Status({
          hasDemo: availability.demo && gate.kind === "file" && !!gate.artifact,
          hasChecklist: availability.checklist && !!gate.checklist,
          configured: gate.status,
        }),
      };
    }),
  };
}

export function isSafeConfigUrl(url: string): boolean {
  if (!url.startsWith("/artifacts/") || url.includes("..")) return false;
  if (url.includes("://") || url.includes("\\")) return false;
  return url.endsWith(".json") && url.length < 280;
}

export function readStoredConfigUrl(
  storage: Pick<Storage, "getItem"> | null | undefined,
): string | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORY_GATES_CONFIG_URL_STORAGE_KEY);
    if (!raw || !isSafeConfigUrl(raw)) return null;
    return raw;
  } catch {
    return null;
  }
}

export function readStoredOpen(
  storage: Pick<Storage, "getItem"> | null | undefined,
): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(STORY_GATES_OPEN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeStoredOpen(
  storage: Pick<Storage, "setItem"> | null | undefined,
  open: boolean,
): void {
  if (!storage) return;
  try {
    storage.setItem(STORY_GATES_OPEN_STORAGE_KEY, open ? "1" : "0");
  } catch {
    /* ignore quota / private mode */
  }
}

export async function loadStoryGatesConfig(
  fetchImpl: typeof fetch = fetch,
  storage?: Pick<Storage, "getItem"> | null,
): Promise<StoryGatesConfig> {
  const override = readStoredConfigUrl(storage);
  const url = override ?? STORY_GATES_DEFAULT_CONFIG_URL;
  try {
    const res = await fetchImpl(url, { cache: "no-store" });
    if (!res.ok) return DEFAULT_STORY_GATES;
    const parsed = parseStoryGatesConfig(await res.json());
    return parsed.ok ? parsed.config : DEFAULT_STORY_GATES;
  } catch {
    return DEFAULT_STORY_GATES;
  }
}
