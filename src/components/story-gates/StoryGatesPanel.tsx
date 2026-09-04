/**
 * Story gates overlay — G1–G5 chips on the existing workbench.
 * Not a route, factory, or ship-prod surface.
 */

import { useMemo } from "react";
import {
  IconAlertTriangle,
  IconCheck,
  IconCircle,
  IconClose,
  IconFileDiff,
  IconFileText,
} from "@/components/icons";
import { createT, type Locale } from "@/i18n";
import type { StoryGate, StoryGatesConfig } from "@/lib/storyGates";
import {
  assertStoryGateKind,
  storyGateArtifactLabel,
  storyGateNameKey,
  storyGateStatusKey,
} from "@/lib/storyGatesUi";

export type StoryGatesPanelProps = {
  locale: Locale;
  config: StoryGatesConfig;
  previewText: string | null;
  previewBusy?: boolean;
  onClose: () => void;
  onSelectGate: (gate: StoryGate) => void;
};

export function StoryGatesPanel({
  locale,
  config,
  previewText,
  previewBusy = false,
  onClose,
  onSelectGate,
}: StoryGatesPanelProps) {
  const tr = useMemo(() => createT(locale), [locale]);
  const preview =
    previewText ??
    (previewBusy ? "" : tr("storyGates.previewEmpty"));

  return (
    <aside
      className="story-gates-panel"
      data-testid="story-gates-panel"
      role="dialog"
      aria-labelledby="story-gates-title"
      aria-modal="false"
    >
      <header className="story-gates-panel__head">
        <div className="story-gates-panel__titles">
          <div className="story-gates-panel__title-row">
            <h2 className="story-gates-panel__title" id="story-gates-title">
              {tr("storyGates.title")}
            </h2>
            <span className="story-gates-panel__badge">
              {tr("storyGates.unofficial")}
            </span>
          </div>
          <p
            className="story-gates-panel__sub"
            data-testid="story-gates-demo-non-prod"
          >
            {tr("storyGates.demoNonProd")}
          </p>
        </div>
        <button
          type="button"
          className="chrome-btn story-gates-panel__close"
          aria-label={tr("storyGates.close")}
          data-testid="story-gates-close"
          onClick={onClose}
        >
          <IconClose size={16} />
        </button>
      </header>

      <ol className="story-gates-panel__list" aria-label={tr("storyGates.listLabel")}>
        {config.gates.map((gate) => {
          const name = tr(storyGateNameKey(gate.name));
          const status = tr(storyGateStatusKey(gate.status));
          const kind = assertStoryGateKind(gate.kind);
          const artifact = storyGateArtifactLabel(
            config,
            gate,
            tr("storyGates.artifactDiff"),
          );
          const openLabel =
            kind === "diff"
              ? tr("storyGates.openDiff")
              : tr("storyGates.openArtifact", { path: artifact });
          return (
            <li
              key={gate.id}
              className="story-gates-chip"
              data-testid={`story-gates-chip-${gate.id}`}
              data-gate-id={gate.id}
              data-gate-status={gate.status}
              data-gate-kind={kind}
            >
              <span className="story-gates-chip__id" aria-hidden>
                {gate.id}
              </span>
              <span className="story-gates-chip__name">{name}</span>
              <button
                type="button"
                className="story-gates-chip__artifact"
                data-testid={`story-gates-artifact-${gate.id}`}
                aria-label={tr("storyGates.chipAria", {
                  id: gate.id,
                  name,
                  status,
                })}
                title={openLabel}
                onClick={() => onSelectGate(gate)}
              >
                {kind === "diff" ? (
                  <IconFileDiff size={14} />
                ) : (
                  <IconFileText size={14} />
                )}
                <span className="story-gates-chip__artifact-label">
                  {artifact}
                </span>
              </button>
              <span
                className={`story-gates-chip__status story-gates-chip__status--${gate.status}`}
                data-testid={`story-gates-status-${gate.id}`}
              >
                {status}
                {gate.status === "pass" ? " ✓" : ""}
              </span>
              <span
                className={`story-gates-chip__mark story-gates-chip__mark--${gate.status}`}
                aria-hidden
              >
                {gate.status === "pass" ? (
                  <IconCheck size={12} />
                ) : gate.status === "fail" ? (
                  <IconAlertTriangle size={12} />
                ) : (
                  <IconCircle size={12} />
                )}
              </span>
            </li>
          );
        })}
      </ol>

      <section
        className="story-gates-panel__preview"
        data-testid="story-gates-preview"
        aria-label={tr("storyGates.previewTitle")}
      >
        <h3 className="story-gates-panel__preview-title">
          {tr("storyGates.previewTitle")}
        </h3>
        <pre className="story-gates-panel__preview-body">{preview}</pre>
      </section>

      <p className="story-gates-panel__legal" data-testid="story-gates-legal">
        {tr("storyGates.legal")}
      </p>
    </aside>
  );
}
