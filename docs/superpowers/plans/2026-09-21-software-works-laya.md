# Software Works × Laya Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Opt-in Laya sidecar suggests Software Works triage (priority, template, first role, ship-ready display) with calibrated confidence; humans apply; Grok Build stays the only agent.

**Architecture:** Pure TS planner + question schemas + result parser; injected `SoftwareTeamLayaHost` for tests; desktop Host runs `scripts/software-works-laya.py` (stdin/stdout JSON, `laya.Router`); Studio/Settings show honesty + Apply chips. No App shell growth, no `~/.grok` rewrite, no auto-Ship.

**Tech Stack:** TypeScript domain in `src/lib/softwareTeamDlc/`, React Studio/Settings, Tauri Host invoke, Python 3 + `laya>=0.3.3` on the user's machine, vitest, 16-locale `createT`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-21-software-works-laya-design.md`
- Edition pref `grok.softwareTeamDlc.enabled` and Laya pref `grok.softwareTeamDlc.laya.enabled` both default **off**
- Grok Build only — Laya is not a coding runtime
- Never invent Host plan/goal ids; never fake predict success in the browser
- Never rewrite shared user `GROK_HOME=~/.grok` (`isSoftwareTeamSharedHomePath`)
- Laya suggestions never satisfy `softwareTeamDeliveryShipGate`
- Choice schemas stay under 20 options; V1 intents only: `priority`, `template`, `firstRole`, `shipReady`
- Router required (not English-only checkpoint) because state may be Vietnamese
- Copy: suggestion / triage, not oracle; do not promise 33 ms or 0.766 accuracy
- No new `useState` in `src/App.tsx` or `src/app/AppWorkbench.tsx`
- No `window.confirm` / `prompt` / `alert`; no native `<select>`
- i18n: 16 locales lockstep with `en`
- Register every new setting on `ext.softwareTeamDlc` in `settingsCatalog`
- Branch: `cursor/ai-software-team-dlc-72cf`; keep PR #1 draft; do not merge

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/softwareTeamDlc/laya.ts` | Prefs, planner, schemas, parse, map to apply-patches |
| `src/lib/softwareTeamDlc/layaHost.ts` | Injected host + default desktop invoke |
| `scripts/software-works-laya.py` | Sidecar: Router.predict, stub mode |
| `src-tauri/src/software_team_laya.rs` | `probe` + `predict` commands |
| `src/hooks/useSoftwareTeamLaya.ts` | Suggest/apply without growing AppWorkbench |
| `src/components/SdlcStudioPage.tsx` | Suggest on wizard / priority / ship-ready line |
| `src/components/SoftwareTeamDlcPanel.tsx` | Enable Laya + status |
| `src/i18n/messages/*/software-team-dlc.ts` | Strings |
| `src/lib/settingsCatalog/entries/extensions.ts` | Search keywords |
| `docs/llm-wiki/software-team-dlc.md` | Product rules |
| `CHANGELOG.md` | Unreleased |

---

### Task 1: Domain planner, schemas, parser

**Files:**
- Create: `src/lib/softwareTeamDlc/laya.ts`
- Modify: `src/lib/softwareTeamDlc/index.ts` (export the new symbols)
- Test: `src/lib/softwareTeamDlc/softwareTeamDlc.test.ts`

**Interfaces:**
- Consumes: `isSoftwareTeamSharedHomePath` from `./delivery`; `SOFTWARE_TEAM_ROLE_IDS` from `./roles`; `SOFTWARE_TEAM_TEMPLATE_IDS` from `./templates`; `SOFTWARE_TEAM_ITEM_PRIORITIES` from `./priority`
- Produces: `SOFTWARE_TEAM_LAYA_INTENTS`, `planSoftwareTeamLayaDecide`, `softwareTeamLayaQuestions`, `buildSoftwareTeamLayaState`, `parseSoftwareTeamLayaResult`, `softwareTeamLayaSuggestionUncertain`, `DEFAULT_SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE`

- [ ] **Step 1: Write the failing tests** at the end of `softwareTeamDlc.test.ts`:

```ts
describe("Software Works Laya triage (domain)", () => {
  it("refuses when Laya pref is off, Host is missing, or path is ~/.grok", () => {
    expect(
      planSoftwareTeamLayaDecide({ enabled: false, layaEnabled: true, hasHost: true, projectPath: "/repo" }),
    ).toMatchObject({ allowed: false, reason: "disabled" });
    expect(
      planSoftwareTeamLayaDecide({ enabled: true, layaEnabled: false, hasHost: true, projectPath: "/repo" }),
    ).toMatchObject({ allowed: false, reason: "disabled" });
    expect(
      planSoftwareTeamLayaDecide({ enabled: true, layaEnabled: true, hasHost: false, projectPath: "/repo" }),
    ).toMatchObject({ allowed: false, reason: "need_host" });
    expect(
      planSoftwareTeamLayaDecide({
        enabled: true,
        layaEnabled: true,
        hasHost: true,
        projectPath: "~/.grok",
      }),
    ).toMatchObject({ allowed: false, reason: "blocked_shared_home" });
    expect(
      planSoftwareTeamLayaDecide({
        enabled: true,
        layaEnabled: true,
        hasHost: true,
        projectPath: "/repo/.grok",
      }),
    ).toMatchObject({ allowed: true, reason: "ok" });
  });

  it("builds choice schemas under 20 options and parses only known keys", () => {
    const questions = softwareTeamLayaQuestions(["priority", "template", "firstRole", "shipReady"]);
    expect(Object.keys(questions.priority.criteria)).toEqual(["p1", "p2", "p3"]);
    expect(Object.keys(questions.template.criteria)).toHaveLength(4);
    expect(Object.keys(questions.firstRole.criteria)).toHaveLength(6);
    expect(questions.shipReady.type).toBe("noul");
    const parsed = parseSoftwareTeamLayaResult(
      {
        answers: {
          priority: { choice: "p1", confidence: 0.91 },
          shipReady: { noul: 0.2, confidence: 0.88 },
        },
        routing: { model: "multilingual", reason: "latin" },
      },
      { minConfidence: 0.7 },
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.suggestions.priority).toMatchObject({
      intent: "priority",
      choice: "p1",
      uncertain: false,
    });
    expect(parsed.suggestions.shipReady?.noul).toBe(0.2);
    expect(
      parseSoftwareTeamLayaResult(
        { answers: { priority: { choice: "urgent", confidence: 0.99 } } },
        { minConfidence: 0.7 },
      ).ok,
    ).toBe(false);
  });

  it("marks low confidence uncertain and never treats shipReady as a gate", () => {
    const parsed = parseSoftwareTeamLayaResult(
      { answers: { priority: { choice: "p2", confidence: 0.4 }, shipReady: { noul: 0.99, confidence: 0.99 } } },
      { minConfidence: 0.7 },
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.suggestions.priority?.uncertain).toBe(true);
    expect(softwareTeamLayaUnlocksShip(parsed)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the new describe and confirm it fails**

Run: `pnpm exec vitest run src/lib/softwareTeamDlc/softwareTeamDlc.test.ts -t "Software Works Laya triage"`

Expected: FAIL (exports not found)

- [ ] **Step 3: Implement `src/lib/softwareTeamDlc/laya.ts`**

```ts
import { isSoftwareTeamSharedHomePath } from "./delivery";
import { SOFTWARE_TEAM_ROLE_IDS, type SoftwareTeamRoleId } from "./roles";
import { SOFTWARE_TEAM_TEMPLATE_IDS, type SoftwareTeamTemplateId } from "./templates";
import {
  normalizeSoftwareTeamItemPriority,
  type SoftwareTeamItemPriority,
} from "./priority";

export const SOFTWARE_TEAM_LAYA_INTENTS = [
  "priority",
  "template",
  "firstRole",
  "shipReady",
] as const;
export type SoftwareTeamLayaIntent = (typeof SOFTWARE_TEAM_LAYA_INTENTS)[number];

export const DEFAULT_SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE = 0.7;

export type SoftwareTeamLayaPlan = {
  allowed: boolean;
  reason:
    | "ok"
    | "disabled"
    | "need_host"
    | "need_python"
    | "need_laya"
    | "blocked_shared_home"
    | "host_error";
};

export function planSoftwareTeamLayaDecide(input: {
  enabled: boolean;
  layaEnabled: boolean;
  hasHost: boolean;
  projectPath?: string | null;
  pythonOk?: boolean;
  layaImportOk?: boolean;
}): SoftwareTeamLayaPlan {
  if (!input.enabled || !input.layaEnabled) return { allowed: false, reason: "disabled" };
  if (!input.hasHost) return { allowed: false, reason: "need_host" };
  if (isSoftwareTeamSharedHomePath(input.projectPath)) {
    return { allowed: false, reason: "blocked_shared_home" };
  }
  if (input.pythonOk === false) return { allowed: false, reason: "need_python" };
  if (input.layaImportOk === false) return { allowed: false, reason: "need_laya" };
  return { allowed: true, reason: "ok" };
}

export function softwareTeamLayaQuestions(
  intents: readonly SoftwareTeamLayaIntent[] = SOFTWARE_TEAM_LAYA_INTENTS,
): Record<string, unknown> {
  const questions: Record<string, unknown> = {};
  if (intents.includes("priority")) {
    questions.priority = {
      type: "choice",
      instructions: "What delivery triage priority fits this software slice?",
      criteria: {
        p1: "blocking users or production; do this first",
        p2: "important this cycle but not a blocker",
        p3: "nice-to-have or can wait",
      },
    };
  }
  if (intents.includes("template")) {
    questions.template = {
      type: "choice",
      instructions: "Which Software Works start-delivery template fits?",
      criteria: {
        feature: "new capability; Product first; spec+design+review docs",
        bugfix: "defect; Engineer first; review notes",
        hotfix: "urgent production patch; Engineer first; no placeholder docs",
        docs: "documentation only; Writer first",
      },
    };
  }
  if (intents.includes("firstRole")) {
    questions.firstRole = {
      type: "choice",
      instructions: "Which role should start this delivery?",
      criteria: {
        product: "scope and success criteria are unclear",
        architect: "design or trade-offs are the next work",
        engineer: "implementation can start now",
        reviewer: "a change exists and needs review",
        qa: "verification is the next work",
        writer: "shipping notes or docs are the next work",
      },
    };
  }
  if (intents.includes("shipReady")) {
    questions.shipReady = {
      type: "noul",
      instructions:
        "Has this delivery already been through Reviewer and QA with saved notes, so a human could click Ship?",
    };
  }
  return questions;
}

export function buildSoftwareTeamLayaState(input: {
  title?: string;
  deliveryTitle?: string;
  roleId?: string;
  stageId?: string;
  templateId?: string;
  priority?: string;
  productNote?: string;
  architectNote?: string;
  reviewNote?: string;
  qaNote?: string;
  missingRoles?: readonly string[];
  locale?: string;
}): Record<string, string> {
  const clip = (value: string | undefined, max: number) => (value ?? "").trim().slice(0, max);
  return {
    title: clip(input.title, 200),
    deliveryTitle: clip(input.deliveryTitle, 200),
    roleId: clip(input.roleId, 32),
    stageId: clip(input.stageId, 32),
    templateId: clip(input.templateId, 32),
    priority: clip(input.priority, 8),
    productNote: clip(input.productNote, 400),
    architectNote: clip(input.architectNote, 400),
    reviewNote: clip(input.reviewNote, 400),
    qaNote: clip(input.qaNote, 400),
    missingRoles: (input.missingRoles ?? []).join(",").slice(0, 80),
    locale: clip(input.locale, 16),
  };
}

export type SoftwareTeamLayaSuggestion = {
  intent: SoftwareTeamLayaIntent;
  choice?: string;
  noul?: number;
  confidence: number;
  uncertain: boolean;
};

export type SoftwareTeamLayaParse =
  | {
      ok: true;
      suggestions: Partial<Record<SoftwareTeamLayaIntent, SoftwareTeamLayaSuggestion>>;
      routing?: { model?: string; reason?: string };
    }
  | { ok: false; reason: "host_error" };

export function softwareTeamLayaSuggestionUncertain(
  confidence: number,
  minConfidence = DEFAULT_SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE,
): boolean {
  return !(confidence >= minConfidence);
}

export function parseSoftwareTeamLayaResult(
  raw: unknown,
  opts?: { minConfidence?: number },
): SoftwareTeamLayaParse {
  const min = opts?.minConfidence ?? DEFAULT_SOFTWARE_TEAM_LAYA_MIN_CONFIDENCE;
  const answers =
    raw && typeof raw === "object" && "answers" in raw
      ? (raw as { answers?: Record<string, unknown> }).answers
      : null;
  if (!answers || typeof answers !== "object") return { ok: false, reason: "host_error" };
  const suggestions: Partial<Record<SoftwareTeamLayaIntent, SoftwareTeamLayaSuggestion>> = {};
  const priority = readChoice(answers.priority, (key) => normalizeSoftwareTeamItemPriority(key) || null);
  if (answers.priority && !priority) return { ok: false, reason: "host_error" };
  if (priority) suggestions.priority = pack("priority", priority, min);
  const template = readChoice(answers.template, (key) =>
    (SOFTWARE_TEAM_TEMPLATE_IDS as readonly string[]).includes(key)
      ? (key as SoftwareTeamTemplateId)
      : null,
  );
  if (answers.template && !template) return { ok: false, reason: "host_error" };
  if (template) suggestions.template = pack("template", template, min);
  const firstRole = readChoice(answers.firstRole, (key) =>
    (SOFTWARE_TEAM_ROLE_IDS as readonly string[]).includes(key)
      ? (key as SoftwareTeamRoleId)
      : null,
  );
  if (answers.firstRole && !firstRole) return { ok: false, reason: "host_error" };
  if (firstRole) suggestions.firstRole = pack("firstRole", firstRole, min);
  if (answers.shipReady) {
    const noul = readNoul(answers.shipReady);
    if (!noul) return { ok: false, reason: "host_error" };
    suggestions.shipReady = {
      intent: "shipReady",
      noul: noul.value,
      confidence: noul.confidence,
      uncertain: softwareTeamLayaSuggestionUncertain(noul.confidence, min),
    };
  }
  const routing =
    raw && typeof raw === "object" && "routing" in raw
      ? (raw as { routing?: { model?: string; reason?: string } }).routing
      : undefined;
  return { ok: true, suggestions, routing };
}

export function softwareTeamLayaUnlocksShip(_parsed: SoftwareTeamLayaParse): boolean {
  return false;
}

function pack(
  intent: SoftwareTeamLayaIntent,
  read: { choice: string; confidence: number },
  min: number,
): SoftwareTeamLayaSuggestion {
  return {
    intent,
    choice: read.choice,
    confidence: read.confidence,
    uncertain: softwareTeamLayaSuggestionUncertain(read.confidence, min),
  };
}

function readChoice(
  raw: unknown,
  allow: (key: string) => string | null,
): { choice: string; confidence: number } | null {
  if (!raw || typeof raw !== "object") return null;
  const choice = allow(String((raw as { choice?: unknown }).choice ?? ""));
  const confidence = Number((raw as { confidence?: unknown }).confidence);
  if (!choice || !Number.isFinite(confidence)) return null;
  return { choice, confidence };
}

function readNoul(raw: unknown): { value: number; confidence: number } | null {
  if (!raw || typeof raw !== "object") return null;
  const value = Number((raw as { noul?: unknown }).noul);
  const confidence = Number((raw as { confidence?: unknown }).confidence ?? value);
  if (!Number.isFinite(value) || value < 0 || value > 1) return null;
  if (!Number.isFinite(confidence)) return null;
  return { value, confidence };
}
```

Export the new symbols from `src/lib/softwareTeamDlc/index.ts` next to the other domain exports.

- [ ] **Step 4: Re-run the describe**

Run: `pnpm exec vitest run src/lib/softwareTeamDlc/softwareTeamDlc.test.ts -t "Software Works Laya triage"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/softwareTeamDlc/laya.ts src/lib/softwareTeamDlc/index.ts src/lib/softwareTeamDlc/softwareTeamDlc.test.ts
git commit -m "feat: Software Works Laya domain planner and parsers"
```

---

### Task 2: Prefs, i18n, settings search

**Files:**
- Create: `src/lib/softwareTeamDlc/layaPref.ts` (or fold load/save into `laya.ts`)
- Modify: `src/i18n/messages/en/software-team-dlc.ts` and the other 15 locale files
- Modify: `src/lib/settingsCatalog/entries/extensions.ts`
- Modify: `src/components/SoftwareTeamDlcPanel.tsx`
- Test: `src/i18n/messages.test.ts`, `src/lib/settingsCatalog.test.ts`

**Interfaces:**
- Consumes: `planSoftwareTeamLayaDecide` reasons for message keys
- Produces: `SOFTWARE_TEAM_DLC_LAYA_KEY`, `loadSoftwareTeamLayaEnabled`, `saveSoftwareTeamLayaEnabled`, `loadSoftwareTeamLayaMinConfidence`, `softwareTeamLayaMessageKey`

Keys to add (`en` authority; translate all 16):

```ts
"softwareTeamDlc.layaEnable": "Enable Laya triage suggestions",
"softwareTeamDlc.layaEnableDesc":
  "Optional local System 1 sidecar (Python + Laya). Suggests priority, delivery template, and first role. Never unlocks Ship, never writes ~/.grok, never invents Host ids. Base weights are a fast triage aid — not an oracle.",
"softwareTeamDlc.layaSuggest": "Suggest with Laya",
"softwareTeamDlc.layaApply": "Apply suggestion",
"softwareTeamDlc.layaDismiss": "Dismiss",
"softwareTeamDlc.layaUncertain": "Low confidence ({n}). Check before applying.",
"softwareTeamDlc.layaNeedHost": "Laya suggestions need the desktop Host.",
"softwareTeamDlc.layaNeedPython": "Install Python 3, then retry.",
"softwareTeamDlc.layaNeedPackage":
  "Laya is not importable. Install with pip install laya>=0.3.3 — this app will not pip-install it.",
"softwareTeamDlc.layaBlockedHome": "Laya will not run against shared ~/.grok.",
"softwareTeamDlc.layaHostError": "Laya sidecar failed: {error}",
"softwareTeamDlc.layaDisabled": "Turn on Laya triage in Settings → Extensions → Agents.",
"softwareTeamDlc.layaShipReady": "Laya ship-ready estimate: {n} (does not unlock Ship).",
"softwareTeamDlc.layaMinConfidence": "Minimum confidence to treat as certain",
```

- [ ] **Step 1: Add the `en` keys, then the same keys in `de es fil fr id it ja ko pt-BR ru ta uk vi zh zh-TW`**
- [ ] **Step 2: Run `pnpm exec vitest run src/i18n/messages.test.ts`** — Expected: FAIL until all 16 match
- [ ] **Step 3: Pref helpers** (`localStorage` `"1"` / `"0"`, default false; minConfidence clamp 0.5–0.95, default 0.7)
- [ ] **Step 4: Register `descKeys` + keywords `laya`, `decision engine`, `triage` on `ext.softwareTeamDlc`**
- [ ] **Step 5: SoftwareTeamDlcPanel** — toggle + status line using existing chips (no native checkbox-only if the panel already uses buttons; match the Software Works enable control). Hidden when edition is off.
- [ ] **Step 6: `pnpm exec vitest run src/i18n/messages.test.ts src/lib/settingsCatalog.test.ts`** — Expected: PASS
- [ ] **Step 7: Commit** `feat: Software Works Laya prefs, i18n, and settings search`

---

### Task 3: Sidecar script (no torch in CI)

**Files:**
- Create: `scripts/software-works-laya.py`
- Test: `src/lib/softwareTeamDlc/softwareTeamDlc.test.ts` (spawn stub) **or** a small node test that runs the script with `LAYA_STUB=1`

**Interfaces:**
- Consumes: stdin `{ state, questions }`
- Produces: stdout Laya-shaped `{ answers, routing }` or `{ ok: false, reason }`

- [ ] **Step 1: Write the script**

```python
#!/usr/bin/env python3
"""Software Works Laya sidecar. Stdin JSON → stdout JSON. Never writes ~/.grok."""
import json
import os
import sys

def main() -> int:
    try:
        raw = sys.stdin.read()
        req = json.loads(raw or "{}")
    except json.JSONDecodeError as err:
        print(json.dumps({"ok": False, "reason": "host_error", "error": str(err)}))
        return 0
    state = req.get("state") or {}
    questions = req.get("questions") or {}
    if os.environ.get("LAYA_STUB") == "1":
        print(json.dumps({
            "answers": {
                "priority": {"choice": "p2", "confidence": 0.8},
                "template": {"choice": "feature", "confidence": 0.8},
                "firstRole": {"choice": "product", "confidence": 0.8},
                "shipReady": {"noul": 0.1, "confidence": 0.8},
            },
            "routing": {"model": "stub", "reason": "LAYA_STUB=1"},
        }))
        return 0
    try:
        from laya import Router
    except Exception as err:
        print(json.dumps({"ok": False, "reason": "need_laya", "error": str(err)}))
        return 0
    try:
        router = Router(preload=False)
        result = router.predict(state, questions)
        print(json.dumps(result, default=str))
        return 0
    except Exception as err:
        print(json.dumps({"ok": False, "reason": "host_error", "error": str(err)}))
        return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Stub test** (no pip laya):

```ts
it("sidecar stub prints parseable answers", async () => {
  const { spawnSync } = await import("node:child_process");
  const out = spawnSync(
    "python3",
    ["scripts/software-works-laya.py"],
    {
      env: { ...process.env, LAYA_STUB: "1" },
      input: JSON.stringify({
        state: { title: "Auth" },
        questions: softwareTeamLayaQuestions(["priority"]),
      }),
      encoding: "utf8",
    },
  );
  if (out.error || out.status !== 0) return; // skip if no python3 in CI
  const parsed = parseSoftwareTeamLayaResult(JSON.parse(out.stdout));
  expect(parsed.ok).toBe(true);
});
```

- [ ] **Step 3: Run vitest** — Expected: PASS (skip-safe if python3 missing)
- [ ] **Step 4: Commit** `feat: Software Works Laya sidecar script with stub mode`

---

### Task 4: Host adapter + Tauri commands

**Files:**
- Create: `src/lib/softwareTeamDlc/layaHost.ts`
- Create: `src-tauri/src/software_team_laya.rs`
- Modify: `src-tauri/src/lib.rs` (or the commands module that registers invokes) to add `software_team_laya_probe` and `software_team_laya_predict`
- Test: `softwareTeamDlc.test.ts` with injected host

**Interfaces:**
- Consumes: `planSoftwareTeamLayaDecide`, script path
- Produces: `SoftwareTeamLayaHost`, `defaultSoftwareTeamLayaHost`, `runSoftwareTeamLayaSuggest`

```ts
export type SoftwareTeamLayaHost = {
  isDesktopHost: () => boolean;
  probe: () => Promise<{ pythonOk: boolean; layaImportOk: boolean; error?: string }>;
  predict: (input: {
    projectPath?: string | null;
    state: unknown;
    questions: unknown;
  }) => Promise<unknown>;
};

export async function runSoftwareTeamLayaSuggest(input: {
  enabled: boolean;
  layaEnabled: boolean;
  projectPath?: string | null;
  intents?: readonly SoftwareTeamLayaIntent[];
  state: Parameters<typeof buildSoftwareTeamLayaState>[0];
  minConfidence?: number;
  host: SoftwareTeamLayaHost;
}): Promise<SoftwareTeamLayaParse | { ok: false; reason: SoftwareTeamLayaPlan["reason"]; error?: string }> {
  const plan = planSoftwareTeamLayaDecide({
    enabled: input.enabled,
    layaEnabled: input.layaEnabled,
    hasHost: input.host.isDesktopHost(),
    projectPath: input.projectPath,
  });
  if (!plan.allowed) return { ok: false, reason: plan.reason };
  const probe = await input.host.probe();
  const afterProbe = planSoftwareTeamLayaDecide({
    ...plan,
    enabled: true,
    layaEnabled: true,
    hasHost: true,
    projectPath: input.projectPath,
    pythonOk: probe.pythonOk,
    layaImportOk: probe.layaImportOk,
  });
  if (!afterProbe.allowed) return { ok: false, reason: afterProbe.reason, error: probe.error };
  try {
    const raw = await input.host.predict({
      projectPath: input.projectPath,
      state: buildSoftwareTeamLayaState(input.state),
      questions: softwareTeamLayaQuestions(input.intents),
    });
    if (raw && typeof raw === "object" && (raw as { ok?: unknown }).ok === false) {
      const reason = (raw as { reason?: SoftwareTeamLayaPlan["reason"] }).reason ?? "host_error";
      return { ok: false, reason, error: (raw as { error?: string }).error };
    }
    return parseSoftwareTeamLayaResult(raw, { minConfidence: input.minConfidence });
  } catch (err) {
    return {
      ok: false,
      reason: "host_error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
```

Default host: `api.isDesktopHost()`; invoke `software_team_laya_probe` / `software_team_laya_predict`. Browser: `isDesktopHost: () => false`.

Rust sketch (register next to other commands; refuse if `project_path` is shared home):

```rust
#[tauri::command]
fn software_team_laya_probe() -> Result<serde_json::Value, String> { /* python3 -c "import laya" */ }

#[tauri::command]
fn software_team_laya_predict(project_path: Option<String>, request_json: String) -> Result<serde_json::Value, String> {
    // spawn python3 scripts/software-works-laya.py with stdin=request_json
    // timeout 60s first predict / 15s after answers; cwd = project_path if allowed
}
```

Resolve the script from the app resource dir **or** the repo `scripts/` path in dev. Do not copy it into `~/.grok`.

- [ ] **Step 1: Injected-host tests** — probe fail → `need_laya`; predict fixture → parsed p1; spawn throw → `host_error`; `~/.grok` never calls `predict`
- [ ] **Step 2: Implement adapter + commands**
- [ ] **Step 3: `pnpm exec vitest run src/lib/softwareTeamDlc/softwareTeamDlc.test.ts -t Laya`**
- [ ] **Step 4: `pnpm typecheck`**
- [ ] **Step 5: Commit** `feat: Software Works Laya Host adapter`

`cargo test` is listed leftover if the crate fetch is offline — do not fake Host success.

---

### Task 5: Studio Suggest / Apply

**Files:**
- Create: `src/hooks/useSoftwareTeamLaya.ts`
- Modify: `src/components/SdlcStudioPage.tsx` (wizard + detail/priority; do not add App.tsx state)
- Modify: `src/components/SdlcDeliveryDetailPane.tsx` (ship-ready line only)
- Test: `src/components/SdlcStudioPage.guard.test.ts` (no confirm/alert; Suggest uses `t("softwareTeamDlc.layaSuggest")`)

**Interfaces:**
- Consumes: `runSoftwareTeamLayaSuggest`, `setSoftwareTeamItemPriority` (existing), wizard local state
- Produces: hook `{ suggest, applying, last }` 

Apply rules:

- `priority` → existing priority setter (activity `priority`)
- `template` + `firstRole` → only wizard draft fields
- `shipReady` → status string only
- Conflict overlay still wins (`pickSoftwareTeamStudioOverlay`)

- [ ] **Step 1: Guard test** expects `softwareTeamDlc.layaSuggest` and no `window.confirm`
- [ ] **Step 2: Hook + buttons** (`btn` / `task-board__chip`, disabled while busy or `!plan.allowed`)
- [ ] **Step 3: Run guard + softwareTeamDlc tests + `pnpm typecheck`**
- [ ] **Step 4: Commit** `feat: Software Works Studio Laya suggest and apply`

---

### Task 6: Wiki + changelog

**Files:**
- Modify: `docs/llm-wiki/software-team-dlc.md` (new **Laya triage** section)
- Modify: `CHANGELOG.md` Unreleased (en + 中文)
- Modify: PR #1 body (draft) with How to try

Wiki must state: opt-in sidecar; Router; never Ship gate; never `~/.grok`; `need_python` / `need_laya` honesty; not an oracle; Grok Build remains the engine.

- [ ] **Step 1: Write the wiki section after Install status**
- [ ] **Step 2: CHANGELOG bullets**
- [ ] **Step 3: Commit** `docs: Software Works Laya triage wiki and changelog`

---

### Task 7: Verification

- [ ] **Step 1:** `pnpm exec vitest run src/lib/softwareTeamDlc/softwareTeamDlc.test.ts src/i18n/messages.test.ts src/lib/settingsCatalog.test.ts src/components/SdlcStudioPage.guard.test.ts`
- [ ] **Step 2:** `pnpm typecheck`
- [ ] **Step 3:** Desktop (when available): Settings on → Studio Suggest with `LAYA_STUB=1` in Host env → Apply priority; turn pref off → Suggest disabled; shared `~/.grok` project → blocked. Without Python → `need_python`. Do not claim torch success in CI.
- [ ] **Step 4:** Push `cursor/ai-software-team-dlc-72cf`; update draft PR #1; do not merge

## Spec coverage

| Spec section | Task |
|--------------|------|
| Planner / schemas / parse / no Ship unlock | 1 |
| Prefs, i18n, settings IA | 2 |
| Sidecar stdin/stdout + stub | 3 |
| Host probe/predict + shared-home refuse | 4 |
| Studio Apply / display | 5 |
| Wiki honesty | 6 |
| Fine-tune Phase B | out of V1 (spec) |

## Leftover (not this plan)

- Fine-tune / temperature fit on Software Works accepts
- Preload all Laya checkpoints
- Host `cargo test` when crates cannot be fetched
- Product/Architect note autogen (Laya does not write prose)
