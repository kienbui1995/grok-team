/**
 * In-memory undo for Software Works pipeline mutates.
 * Not persisted. Does not write ~/.grok. Cleared when the project file replaces the cache.
 */

import {
  parseSoftwareTeamPipelineStore,
  serializeSoftwareTeamPipelineStore,
  type SoftwareTeamPipelineStore,
} from "./pipeline";

export const SOFTWARE_TEAM_UNDO_MAX = 20;

let stack: string[] = [];

export function clearSoftwareTeamUndoStack(): void {
  stack = [];
}

export function softwareTeamUndoDepth(): number {
  return stack.length;
}

export function pushSoftwareTeamUndoSnapshot(
  store: SoftwareTeamPipelineStore,
): void {
  const json = serializeSoftwareTeamPipelineStore(store);
  if (stack[stack.length - 1] === json) return;
  stack.push(json);
  if (stack.length > SOFTWARE_TEAM_UNDO_MAX) {
    stack = stack.slice(stack.length - SOFTWARE_TEAM_UNDO_MAX);
  }
}

export function popSoftwareTeamUndoSnapshot(): SoftwareTeamPipelineStore | null {
  const raw = stack.pop();
  if (!raw) return null;
  return parseSoftwareTeamPipelineStore(raw);
}

export function peekSoftwareTeamUndoSnapshot(): SoftwareTeamPipelineStore | null {
  const raw = stack[stack.length - 1];
  if (!raw) return null;
  return parseSoftwareTeamPipelineStore(raw);
}
