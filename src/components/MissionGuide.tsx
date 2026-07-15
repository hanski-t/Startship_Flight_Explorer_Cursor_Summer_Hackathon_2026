import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  BLOCK_GUIDE,
  OUTCOME_GUIDE,
  STAGE_GUIDE,
} from "../data/guideContent";
import { StageIcon } from "../lib/stageIcons";
import { Panel } from "./Panel";

export function MissionGuide() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Panel aria-label="Mission guide">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left outline-none transition-colors hover:bg-[color:var(--color-panel-2)]"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <Info
            className="h-4 w-4 text-[color:var(--color-mute)]"
            aria-hidden
          />
          <h2 className="font-display text-sm font-semibold tracking-tight text-[color:var(--color-ink)]">
            How to read this dashboard
          </h2>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[color:var(--color-faint)] transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {expanded && (
        <div className="space-y-8 border-t border-[color:var(--color-line)] px-5 py-6">
          <div>
            <h3 className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-faint)]">
              Vehicle blocks
            </h3>
            <p className="mb-4 max-w-2xl text-xs leading-relaxed text-[color:var(--color-mute)]">
              Starship hardware evolves in numbered blocks. Each generation
              incorporates fixes and upgrades from the last, and flights are
              grouped by which vehicle version flew.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {BLOCK_GUIDE.map((block) => (
                <article
                  key={block.id}
                  className="rounded-lg border-l-2 border-l-[color:var(--color-line-strong)] border-y border-r border-[color:var(--color-line)] bg-[color:var(--color-panel-2)] p-4"
                >
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <h4 className={`font-display text-sm font-semibold ${block.accentClass}`}>
                      {block.name}
                    </h4>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--color-faint)]">
                      {block.flights}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[color:var(--color-mute)]">
                    {block.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-faint)]">
              Flight stages
            </h3>
            <p className="mb-4 max-w-2xl text-xs leading-relaxed text-[color:var(--color-mute)]">
              Every integrated flight test follows the same rough sequence. Each
              card and map shows how far that flight got: green worked, amber was
              partial, red failed, gray means the flight never got there.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {STAGE_GUIDE.map((stage) => (
                <article
                  key={stage.key}
                  className="flex gap-3 rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel-2)] p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)]">
                    <StageIcon
                      stage={stage.key}
                      size={16}
                      className="text-[color:var(--color-mute)]"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[color:var(--color-ink)]">
                      {stage.label}
                    </h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--color-mute)]">
                      {stage.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-faint)]">
              Status colors
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {OUTCOME_GUIDE.map((outcome) => (
                <div key={outcome.id} className="flex items-start gap-2.5">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${outcome.colorClass}`}
                  />
                  <div>
                    <p className="text-xs font-medium text-[color:var(--color-ink)]">
                      {outcome.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[color:var(--color-faint)]">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
