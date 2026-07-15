import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  BLOCK_GUIDE,
  OUTCOME_GUIDE,
  STAGE_GUIDE,
} from "../data/guideContent";
import { StageIcon } from "../lib/stageIcons";

export function MissionGuide() {
  const [expanded, setExpanded] = useState(true);

  return (
    <section
      className="rounded-xl border border-slate-700/60 bg-slate-900/50 backdrop-blur-sm"
      aria-label="Mission guide"
    >
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-800/30"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-sky-400" aria-hidden />
          <h2 className="text-sm font-semibold text-white">
            How to read this dashboard
          </h2>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {expanded && (
        <div className="space-y-6 border-t border-slate-700/50 px-5 py-5">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vehicle blocks
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">
              Starship hardware evolves in numbered &quot;blocks&quot; — each
              generation incorporates fixes and upgrades from the last. Flights
              are grouped by which vehicle version flew.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {BLOCK_GUIDE.map((block) => (
                <article
                  key={block.id}
                  className={`rounded-lg border border-white/5 p-4 ring-1 ring-inset ${block.accentClass}`}
                >
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <h4 className="font-semibold">{block.name}</h4>
                    <span className="text-[10px] text-slate-500">
                      {block.flights}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {block.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Flight stages
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-slate-400">
              Every integrated flight test follows the same rough sequence. Each
              card and map shows how far that flight got — green means the stage
              worked, amber means partial, red means failure, gray means the
              flight never got there.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {STAGE_GUIDE.map((stage) => (
                <article
                  key={stage.key}
                  className="flex gap-3 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/50">
                    <StageIcon stage={stage.key} size={16} className="text-sky-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">
                      {stage.label}
                    </h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                      {stage.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status colors
            </h3>
            <div className="flex flex-wrap gap-4">
              {OUTCOME_GUIDE.map((outcome) => (
                <div key={outcome.id} className="flex items-start gap-2">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${outcome.colorClass}`}
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      {outcome.label}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
