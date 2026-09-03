/**
 * Studio overlay policy: the empty-board wizard must not cover
 * pipeline-conflict chips after the user closes the GlassModal.
 */

export type EmptyStudioWizardDecision = {
  open: boolean;
  markOffered: boolean;
};

export function decideEmptyStudioWizard(input: {
  itemCount: number;
  inConflict: boolean;
  alreadyOffered: boolean;
}): EmptyStudioWizardDecision {
  if (input.alreadyOffered) return { open: false, markOffered: false };
  if (input.inConflict) return { open: false, markOffered: false };
  if (input.itemCount > 0) return { open: false, markOffered: true };
  return { open: true, markOffered: true };
}

export function shouldAutoOpenEmptyStudioWizard(input: {
  itemCount: number;
  inConflict: boolean;
  alreadyOffered: boolean;
}): boolean {
  return decideEmptyStudioWizard(input).open;
}
