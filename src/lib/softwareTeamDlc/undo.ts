/**
 * In-memory undo/redo for Software Works pipeline mutates.
 * Not persisted. Does not write ~/.grok. Cleared when the project file replaces the cache.
 */

import {
  parseSoftwareTeamPipelineStore,
  serializeSoftwareTeamPipelineStore,
  type SoftwareTeamPipelineStore,
} from "./pipeline";

export const SOFTWARE_TEAM_UNDO_MAX = 20;

let undoStack: string[] = [];
let redoStack: string[] = [];

function pushUnique(stack: string[], json: string): string[] {
  if (stack[stack.length - 1] === json) return stack;
  const next = [...stack, json];
  if (next.length > SOFTWARE_TEAM_UNDO_MAX) {
    return next.slice(next.length - SOFTWARE_TEAM_UNDO_MAX);
  }
  return next;
}

export function clearSoftwareTeamUndoStack(): void {
  undoStack = [];
  redoStack = [];
}

export function softwareTeamUndoDepth(): number {
  return undoStack.length;
}

export function softwareTeamRedoDepth(): number {
  return redoStack.length;
}

export function pushSoftwareTeamUndoSnapshot(
  store: SoftwareTeamPipelineStore,
): void {
  undoStack = pushUnique(undoStack, serializeSoftwareTeamPipelineStore(store));
  redoStack = [];
}

export function popSoftwareTeamUndoSnapshot(
  current?: SoftwareTeamPipelineStore,
): SoftwareTeamPipelineStore | null {
  const raw = undoStack[undoStack.length - 1];
  if (!raw) return null;
  undoStack = undoStack.slice(0, -1);
  if (current) {
    redoStack = pushUnique(redoStack, serializeSoftwareTeamPipelineStore(current));
  }
  return parseSoftwareTeamPipelineStore(raw);
}

export function popSoftwareTeamRedoSnapshot(
  current?: SoftwareTeamPipelineStore,
): SoftwareTeamPipelineStore | null {
  const raw = redoStack[redoStack.length - 1];
  if (!raw) return null;
  redoStack = redoStack.slice(0, -1);
  if (current) {
    undoStack = pushUnique(undoStack, serializeSoftwareTeamPipelineStore(current));
  }
  return parseSoftwareTeamPipelineStore(raw);
}

export function peekSoftwareTeamUndoSnapshot(): SoftwareTeamPipelineStore | null {
  const raw = undoStack[undoStack.length - 1];
  if (!raw) return null;
  return parseSoftwareTeamPipelineStore(raw);
}
