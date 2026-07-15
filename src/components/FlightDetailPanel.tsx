import type { Flight } from "../types/flight";
import { formatDate } from "../lib/formatDate";
import { getMissionProgress } from "../lib/missionProgress";
import { vehicleAccent } from "../lib/stageColors";
import { getBlockGuideForVehicle } from "../data/guideContent";
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
    <section
      className="animate-panel-in overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 backdrop-blur-sm"
      aria-label={`Details for ${flight.id}`}
    >
      <div className="border-b border-slate-700/60 p-5 md:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{flight.id}</h2>
              {isUpcoming ? (
                <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-500/40">
                  Scheduled
                </span>
              ) : (
                <OutcomeBadge outcome={flight.outcome} />
              )}
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {formatDate(flight.date, isUpcoming)}
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${vehicleAccent(flight.vehicle)}`}
            >
              {flight.vehicle}
            </span>
            {blockGuide && (
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                <span className="font-medium text-slate-300">
                  About {blockGuide.name}:
                </span>{" "}
                {blockGuide.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {!isUpcoming && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Mission profile completion</span>
              <span className="font-medium text-sky-400">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        <p className="text-sm leading-relaxed text-slate-300">{flight.summary}</p>
      </div>

      <div className="p-5 md:p-6">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Stage progression
        </h3>
        <p className="mb-3 text-xs leading-relaxed text-slate-500">
          Each row is a milestone in the flight sequence. Compare which stages
          this flight reached versus earlier tests.
        </p>
        <StageTracker stages={flight.stages} upcoming={isUpcoming} animated />
      </div>
    </section>
  );
}
