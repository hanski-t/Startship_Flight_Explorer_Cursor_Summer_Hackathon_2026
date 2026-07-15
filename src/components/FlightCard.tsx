import type { Flight } from "../types/flight";
import { formatDate } from "../lib/formatDate";
import { getMissionProgress } from "../lib/missionProgress";
import { vehicleAccent } from "../lib/stageColors";
import { MissionMap } from "./MissionMap";
import { OutcomeBadge } from "./OutcomeBadge";
import { StageTracker } from "./StageTracker";

interface FlightCardProps {
  flight: Flight;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function FlightCard({ flight, selected, onSelect }: FlightCardProps) {
  const isUpcoming = flight.upcoming === true;
  const progress = getMissionProgress(flight.stages, isUpcoming);

  return (
    <button
      type="button"
      onClick={() => onSelect(flight.id)}
      aria-pressed={selected}
      className={`group flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-xl border text-left transition-all duration-300 ${
        isUpcoming
          ? "border-dashed border-slate-600/80 bg-slate-900/40 opacity-80 hover:opacity-100"
          : "border-slate-700/80 bg-slate-900/70 hover:border-sky-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-sky-500/5"
      } ${
        selected
          ? "scale-[1.02] border-sky-400/60 ring-2 ring-sky-400/70 ring-offset-2 ring-offset-slate-950 shadow-xl shadow-sky-500/10"
          : ""
      }`}
    >
      <div className="relative">
        <MissionMap
          stages={flight.stages}
          upcoming={isUpcoming}
          compact
          flightId={flight.id}
        />
        {!isUpcoming && (
          <div className="absolute bottom-1 right-2 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
            {Math.round(progress * 100)}% profile
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-sky-200">
              {flight.id}
            </h3>
            <p className="text-xs text-slate-400">
              {formatDate(flight.date, isUpcoming)}
            </p>
          </div>
          {isUpcoming ? (
            <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-500/40">
              Scheduled
            </span>
          ) : (
            <OutcomeBadge outcome={flight.outcome} />
          )}
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${vehicleAccent(flight.vehicle)}`}
        >
          {flight.vehicle}
        </span>

        <StageTracker
          stages={flight.stages}
          compact
          upcoming={isUpcoming}
          animated={selected}
        />
      </div>
    </button>
  );
}
