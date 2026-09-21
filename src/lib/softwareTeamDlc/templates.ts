/**
 * Software Works — delivery templates for Start a delivery.
 *
 * A template preselects the first role and the docs/sdlc placeholder
 * subset written by the workspace bootstrap. Informational only: it
 * never gates Ship and never writes outside the bootstrap allowlist.
 */

import { SOFTWARE_TEAM_BOOTSTRAP_RELATIVE } from "./delivery";
import type { MessageKey } from "@/i18n";
import type { SoftwareTeamRoleId } from "./roles";

export const SOFTWARE_TEAM_TEMPLATE_IDS = [
  "feature",
  "bugfix",
  "hotfix",
  "docs",
] as const;

export type SoftwareTeamTemplateId = (typeof SOFTWARE_TEAM_TEMPLATE_IDS)[number];

export type SoftwareTeamTemplateDoc = "spec" | "design" | "review";

export type SoftwareTeamTemplate = {
  id: SoftwareTeamTemplateId;
  /** Chip label in the Start a delivery modal. */
  titleKey: MessageKey;
  /** Preselected first role; the modal role chips stay editable. */
  roleId: SoftwareTeamRoleId;
  docs: readonly SoftwareTeamTemplateDoc[];
};

export const SOFTWARE_TEAM_TEMPLATES: readonly SoftwareTeamTemplate[] = [
  {
    id: "feature",
    titleKey: "softwareTeamDlc.templateFeature",
    roleId: "product",
    docs: ["spec", "design", "review"],
  },
  {
    id: "bugfix",
    titleKey: "softwareTeamDlc.templateBugfix",
    roleId: "engineer",
    docs: ["review"],
  },
  {
    id: "hotfix",
    titleKey: "softwareTeamDlc.templateHotfix",
    roleId: "engineer",
    docs: [],
  },
  {
    id: "docs",
    titleKey: "softwareTeamDlc.templateDocs",
    roleId: "writer",
    docs: [],
  },
];

export const SOFTWARE_TEAM_TEMPLATE_DEFAULT: SoftwareTeamTemplateId = "feature";

export function softwareTeamTemplateById(
  id: string | null | undefined,
): SoftwareTeamTemplate | null {
  const needle = (id ?? "").trim();
  return SOFTWARE_TEAM_TEMPLATES.find((template) => template.id === needle) ?? null;
}

const SOFTWARE_TEAM_TEMPLATE_DOC_RELATIVE: Record<
  SoftwareTeamTemplateDoc,
  string
> = {
  spec: "docs/sdlc/spec.md",
  design: "docs/sdlc/design.md",
  review: "docs/sdlc/review.md",
};

/**
 * Allowlisted bootstrap relatives for a template. Unknown doc names are
 * dropped, so the result is always a subset of SOFTWARE_TEAM_BOOTSTRAP_RELATIVE.
 */
export function softwareTeamTemplateDocsRelative(
  template: SoftwareTeamTemplate | null,
): string[] {
  if (!template) return [];
  const allow = new Set<string>(SOFTWARE_TEAM_BOOTSTRAP_RELATIVE);
  return template.docs
    .map((doc) => SOFTWARE_TEAM_TEMPLATE_DOC_RELATIVE[doc])
    .filter((relative) => allow.has(relative));
}
