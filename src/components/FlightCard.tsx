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
      className={`group flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-xl border text-left outline-none transition-[transform,border-color,background-color] duration-300 ${
        isUpcoming
          ? "border-dashed border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)] opacity-75 hover:opacity-100"
          : "border-[color:var(--color-line)] bg-[color:var(--color-panel)] hover:border-[color:var(--color-line-strong)] hover:bg-[color:var(--color-panel-2)]"
      } ${
        selected
          ? "-translate-y-1 border-[color:var(--color-ink)]/70 ring-1 ring-[color:var(--color-ink)]/60"
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
          <div className="tnum absolute bottom-1.5 right-2 rounded border border-[color:var(--color-line)] bg-[color:var(--color-void)]/80 px-1.5 py-0.5 text-[10px] text-[color:var(--color-mute)] backdrop-blur-sm">
            {Math.round(progress * 100)}% profile
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-[color:var(--color-ink)]">
              {flight.id}
            </h3>
            <p className="tnum mt-0.5 text-xs text-[color:var(--color-faint)]">
              {formatDate(flight.date, isUpcoming)}
            </p>
          </div>
          {isUpcoming ? (
            <span className="rounded-full border border-[color:var(--color-line-strong)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--color-mute)]">
              Scheduled
            </span>
          ) : (
            <OutcomeBadge outcome={flight.outcome} />
          )}
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ring-1 ring-inset ${vehicleAccent(flight.vehicle)}`}
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
