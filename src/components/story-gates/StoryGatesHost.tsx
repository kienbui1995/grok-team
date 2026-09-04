/**
 * Workbench chrome for Story gates: title-bar toggle + overlay panel.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { IconListCheck } from "@/components/icons";
import { Tip } from "@/components/ui/tooltip";
import { createT, type Locale } from "@/i18n";
import {
  DEFAULT_STORY_GATES,
  gatePublicUrl,
  loadStoryGatesConfig,
  readStoredOpen,
  writeStoredOpen,
  type StoryGate,
  type StoryGatesConfig,
} from "@/lib/storyGates";
import { StoryGatesPanel } from "./StoryGatesPanel";

export type StoryGatesHostProps = {
  locale: Locale;
  /** Open the existing workbench Diff / Review pane (G3). */
  onOpenDiff?: () => void;
  /** Open a Lean artifact path in the existing files surface. */
  onOpenArtifact?: (path: string) => void;
  /** Tests / Vite can inject a config without fetching. */
  config?: StoryGatesConfig;
  initiallyOpen?: boolean;
};

export function StoryGatesHost({
  locale,
  onOpenDiff,
  onOpenArtifact,
  config: configProp,
  initiallyOpen,
}: StoryGatesHostProps) {
  const tr = useMemo(() => createT(locale), [locale]);
  const [open, setOpen] = useState(() =>
    initiallyOpen ??
    (typeof window === "undefined"
      ? false
      : readStoredOpen(window.sessionStorage)),
  );
  const [config, setConfig] = useState<StoryGatesConfig>(
    configProp ?? DEFAULT_STORY_GATES,
  );
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [previewBusy, setPreviewBusy] = useState(false);

  useEffect(() => {
    if (configProp) {
      setConfig(configProp);
      return;
    }
    let cancelled = false;
    const storage =
      typeof window === "undefined" ? null : window.localStorage;
    void loadStoryGatesConfig(fetch, storage).then((next) => {
      if (!cancelled) setConfig(next);
    });
    return () => {
      cancelled = true;
    };
  }, [configProp]);

  const setOpenPersist = useCallback((next: boolean) => {
    setOpen(next);
    if (typeof window !== "undefined") {
      writeStoredOpen(window.sessionStorage, next);
    }
  }, []);

  const toggle = useCallback(() => {
    setOpenPersist(!open);
  }, [open, setOpenPersist]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPersist(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpenPersist]);

  const onSelectGate = useCallback(
    async (gate: StoryGate) => {
      if (gate.kind === "diff") {
        setPreviewText(tr("storyGates.openDiff"));
        onOpenDiff?.();
        return;
      }
      const path = `${config.artifactRoot}/${gate.artifact}`;
      onOpenArtifact?.(path);
      const url = gatePublicUrl(config, gate);
      if (!url) return;
      setPreviewBusy(true);
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          setPreviewText(tr("storyGates.previewUnavailable"));
          return;
        }
        setPreviewText(await res.text());
      } catch {
        setPreviewText(tr("storyGates.previewUnavailable"));
      } finally {
        setPreviewBusy(false);
      }
    },
    [config, onOpenArtifact, onOpenDiff, tr],
  );

  const toggleLabel = open
    ? tr("storyGates.toggleHide")
    : tr("storyGates.toggleShow");

  const toggleBtn = (
    <Tip label={toggleLabel}>
      <button
        type="button"
        className={"chrome-btn main__pane-toggle" + (open ? " is-on" : "")}
        aria-label={toggleLabel}
        aria-pressed={open}
        aria-expanded={open}
        data-testid="story-gates-toggle"
        onClick={toggle}
      >
        <IconListCheck size={16} />
      </button>
    </Tip>
  );

  const panel =
    open && typeof document !== "undefined"
      ? createPortal(
          <StoryGatesPanel
            locale={locale}
            config={config}
            previewText={previewText}
            previewBusy={previewBusy}
            onClose={() => setOpenPersist(false)}
            onSelectGate={(gate) => {
              void onSelectGate(gate);
            }}
          />,
          document.body,
        )
      : null;

  return (
    <>
      {toggleBtn}
      {panel}
    </>
  );
}
