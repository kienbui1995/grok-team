/**
 * Story gates UI helpers — exhaustive maps for status / name / kind.
 */

import type { MessageKey } from "@/i18n";
import type {
  StoryGate,
  StoryGateKind,
  StoryGateName,
  StoryGateStatus,
  StoryGatesConfig,
} from "@/lib/storyGates";
import { gateDisplayPath } from "@/lib/storyGates";

export function storyGateNameKey(name: StoryGateName): MessageKey {
  switch (name) {
    case "spec":
      return "storyGates.gate.spec";
    case "adr":
      return "storyGates.gate.adr";
    case "dev":
      return "storyGates.gate.dev";
    case "qc":
      return "storyGates.gate.qc";
    case "demo":
      return "storyGates.gate.demo";
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}

export function storyGateStatusKey(status: StoryGateStatus): MessageKey {
  switch (status) {
    case "pass":
      return "storyGates.status.pass";
    case "fail":
      return "storyGates.status.fail";
    case "open":
      return "storyGates.status.open";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function storyGateArtifactLabel(
  config: StoryGatesConfig,
  gate: StoryGate,
  diffLabel: string,
): string {
  switch (gate.kind) {
    case "diff":
      return diffLabel;
    case "file":
      return gateDisplayPath(config, gate);
    default: {
      const _exhaustive: never = gate.kind;
      return _exhaustive;
    }
  }
}

export function assertStoryGateKind(kind: StoryGateKind): StoryGateKind {
  switch (kind) {
    case "diff":
    case "file":
      return kind;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
