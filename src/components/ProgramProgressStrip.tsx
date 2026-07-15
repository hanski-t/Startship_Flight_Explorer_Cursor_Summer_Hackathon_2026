import type { Flight } from "../types/flight";
import { stageStrokeColor } from "../lib/missionProgress";

interface ProgramProgressStripProps {
  flights: Flight[];
  selectedFlightId: string | null;
  onSelectFlight: (id: string) => void;
}

export function ProgramProgressStrip({
  flights,
  selectedFlightId,
  onSelectFlight,
}: ProgramProgressStripProps) {
  const flown = flights.filter((f) => !f.upcoming);
  const successes = flown.filter((f) => f.outcome === "success").length;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Program trajectory</h2>
          <p className="text-xs text-slate-400">
            {successes} of {flown.length} flights fully successful — taller bars
            mean the flight got further through the stage sequence. Click a bar
            to inspect that flight.
          </p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-2xl font-bold text-emerald-400">
            {Math.round((successes / flown.length) * 100)}%
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Success rate
          </p>
        </div>
      </div>

      <div className="flex h-14 items-end gap-1">
        {flights.map((flight, index) => {
          const isUpcoming = flight.upcoming === true;
          const height = isUpcoming
            ? 20
            : flight.outcome === "success"
              ? 100
              : flight.outcome === "partial"
                ? 65
                : 35;
          const color = isUpcoming
            ? "#475569"
            : stageStrokeColor(
                flight.outcome === "success"
                  ? "success"
                  : flight.outcome === "partial"
                    ? "partial"
                    : "failure",
              );
          const selected = selectedFlightId === flight.id;

          return (
            <button
              key={flight.id}
              type="button"
              onClick={() => onSelectFlight(flight.id)}
              className={`group relative flex-1 rounded-t-md transition-all duration-300 hover:opacity-100 ${
                selected ? "ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-950" : ""
              } ${isUpcoming ? "opacity-50" : "opacity-85 hover:scale-y-105"}`}
              style={{
                height: `${height}%`,
                backgroundColor: color,
                animationDelay: `${index * 0.05}s`,
              }}
              title={`${flight.id}: ${isUpcoming ? "Scheduled" : flight.outcome}`}
              aria-label={`Select ${flight.id}`}
              aria-pressed={selected}
            >
              <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[9px] font-medium text-slate-400 group-hover:block">
                {flight.number}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-slate-600">
        <span>IFT-1</span>
        <span>Program maturity →</span>
        <span>IFT-13</span>
      </div>
    </div>
  );
}
