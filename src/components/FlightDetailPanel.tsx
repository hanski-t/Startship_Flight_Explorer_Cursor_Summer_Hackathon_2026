import { X } from "lucide-react";
import type { Flight } from "../types/flight";
import { formatDate } from "../lib/formatDate";
import { getMissionProgress } from "../lib/missionProgress";
import { vehicleAccent } from "../lib/stageColors";
import { getBlockGuideForVehicle } from "../data/guideContent";
import { Panel } from "./Panel";
import { OutcomeBadge } from "./OutcomeBadge";
import { StageTracker } from "./StageTracker";

interface FlightDetailPanelProps {
  flight: Flight;
  onClose: () => void;
}

export function FlightDetailPanel({ flight, onClose }: FlightDetailPanelProps) {
  const isUpcoming = flight.upcoming === true;
  const progress = getMissionProgress(flight.stages, isUpcoming);
  const blockGuide = getBlockGuideForVehicle(flight.vehicle);

  return (
    <Panel
      elevated
      className="animate-panel-in overflow-hidden"
      aria-label={`Details for ${flight.id}`}
    >
      <div className="border-b border-[color:var(--color-line)] p-5 md:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">
                {flight.id}
              </h2>
              {isUpcoming ? (
                <span className="rounded-full border border-[color:var(--color-line-strong)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--color-mute)]">
                  Scheduled
                </span>
              ) : (
                <OutcomeBadge outcome={flight.outcome} />
              )}
            </div>
            <p className="tnum mt-1.5 text-sm text-[color:var(--color-faint)]">
              {formatDate(flight.date, isUpcoming)}
            </p>
            <span
              className={`mt-2.5 inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ring-1 ring-inset ${vehicleAccent(flight.vehicle)}`}
            >
              {flight.vehicle}
            </span>
            {blockGuide && (
              <p className="mt-3.5 text-xs leading-relaxed text-[color:var(--color-mute)]">
                <span className="font-medium text-[color:var(--color-ink)]">
                  About {blockGuide.name}:
                </span>{" "}
                {blockGuide.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[color:var(--color-faint)] transition-colors hover:bg-[color:var(--color-panel)] hover:text-[color:var(--color-ink)]"
            aria-label="Close details"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {!isUpcoming && (
          <div className="mb-4">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-[color:var(--color-faint)]">
                Mission profile completion
              </span>
              <span className="tnum font-semibold text-[color:var(--color-ink)]">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--color-panel)]">
              <div
                className="h-full rounded-full bg-[color:var(--color-ink)] transition-all duration-700 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        <p className="text-sm leading-relaxed text-[color:var(--color-mute)]">
          {flight.summary}
        </p>
      </div>

      <div className="p-5 md:p-6">
        <h3 className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-faint)]">
          Stage progression
        </h3>
        <p className="mb-3 text-xs leading-relaxed text-[color:var(--color-faint)]">
          Each row is a milestone in the flight sequence. Compare which stages
          this flight reached versus earlier tests.
        </p>
        <StageTracker stages={flight.stages} upcoming={isUpcoming} animated />
      </div>
    </Panel>
  );
}
