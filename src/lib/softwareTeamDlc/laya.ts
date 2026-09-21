import { appendSoftwareTeamActivity } from "./activity";
import { isSoftwareTeamSharedHomePath } from "./delivery";
import { missingSoftwareTeamDeliveryRoles } from "./deliveryAttach";
import { softwareTeamDeliveryTitle } from "./deliveryFilter";
import type { SoftwareTeamPipelineItem, SoftwareTeamPipelineStore } from "./pipeline";
import { SOFTWARE_TEAM_ROLE_IDS, type SoftwareTeamRoleId } from "./roles";
import { firstSoftwareTeamNonEmptyField } from "./shipGate";
import { SOFTWARE_TEAM_TEMPLATE_IDS, type SoftwareTeamTemplateId } from "./templates";
import {
  normalizeSoftwareTeamItemPriority,
  setSoftwareTeamItemPriority,
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

export function softwareTeamLayaPriorityPatch(
  suggestion?: SoftwareTeamLayaSuggestion | null,
): Exclude<SoftwareTeamItemPriority, ""> | null {
  if (!suggestion || suggestion.intent !== "priority" || !suggestion.choice) {
    return null;
  }
  const priority = normalizeSoftwareTeamItemPriority(suggestion.choice);
  return priority === "p1" || priority === "p2" || priority === "p3"
    ? priority
    : null;
}

export function softwareTeamLayaTemplatePatch(
  suggestion?: SoftwareTeamLayaSuggestion | null,
): SoftwareTeamTemplateId | null {
  const choice = suggestion?.choice ?? "";
  return (SOFTWARE_TEAM_TEMPLATE_IDS as readonly string[]).includes(choice)
    ? (choice as SoftwareTeamTemplateId)
    : null;
}

export function softwareTeamLayaFirstRolePatch(
  suggestion?: SoftwareTeamLayaSuggestion | null,
): SoftwareTeamRoleId | null {
  const choice = suggestion?.choice ?? "";
  return (SOFTWARE_TEAM_ROLE_IDS as readonly string[]).includes(choice)
    ? (choice as SoftwareTeamRoleId)
    : null;
}

/**
 * Sidecar state for a delivery. Notes are first-non-empty across members
 * (Reviewer/QA notes live on those cards). Role / stage / priority stay on
 * the focus card. Another deliveryId is never mixed in.
 */
export function softwareTeamLayaDeliveryFields(input: {
  items: readonly SoftwareTeamPipelineItem[];
  focus?: SoftwareTeamPipelineItem | null;
  deliveryTitle?: string;
  templateId?: string;
  locale?: string;
}): Parameters<typeof buildSoftwareTeamLayaState>[0] {
  const focus = input.focus ?? input.items[0] ?? null;
  const deliveryId = (focus?.deliveryId ?? "").trim();
  const members = deliveryId
    ? input.items.filter((item) => item.deliveryId.trim() === deliveryId)
    : focus
      ? [focus]
      : [];
  return {
    title: focus?.title,
    deliveryTitle:
      input.deliveryTitle ??
      (deliveryId ? softwareTeamDeliveryTitle(members, deliveryId) : focus?.title),
    roleId: focus?.roleId,
    stageId: focus?.stageId,
    templateId: input.templateId,
    priority: focus?.priority,
    productNote: firstSoftwareTeamNonEmptyField(
      members.map((item) => item.productNote),
    ),
    architectNote: firstSoftwareTeamNonEmptyField(
      members.map((item) => item.architectNote),
    ),
    reviewNote: firstSoftwareTeamNonEmptyField(
      members.map((item) => item.reviewNote),
    ),
    qaNote: firstSoftwareTeamNonEmptyField(members.map((item) => item.qaNote)),
    missingRoles: deliveryId
      ? missingSoftwareTeamDeliveryRoles(input.items, deliveryId)
      : [],
    locale: input.locale,
  };
}

/**
 * Apply a Laya priority suggestion onto the focus card. Logs `laya_suggest`
 * in addition to the existing `priority` mutate. Never unlocks Ship.
 */
export function applySoftwareTeamLayaPriority(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  suggestion?: SoftwareTeamLayaSuggestion | null,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const priority = softwareTeamLayaPriorityPatch(suggestion);
  if (!priority || !suggestion) return store;
  const item = store.items.find((row) => row.id === itemId);
  if (!item) return store;
  const next = setSoftwareTeamItemPriority(store, itemId, priority, now);
  return {
    ...next,
    activity: appendSoftwareTeamActivity(next.activity, {
      at: now,
      type: "laya_suggest",
      deliveryId: item.deliveryId,
      itemId: item.id,
      priority,
      layaIntent: "priority",
      layaChoice: suggestion.choice,
      layaConfidence: suggestion.confidence,
      layaUncertain: suggestion.uncertain,
    }),
  };
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
