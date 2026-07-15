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
  return (
    <div>
      <div className="flex h-20 items-end gap-1.5">
        {flights.map((flight, index) => {
          const isUpcoming = flight.upcoming === true;
          const height = isUpcoming
            ? 18
            : flight.outcome === "success"
              ? 100
              : flight.outcome === "partial"
                ? 62
                : 34;
          const color = isUpcoming
            ? "var(--color-idle)"
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
              className={`group relative flex h-full flex-1 flex-col justify-end rounded-sm outline-none transition-opacity ${
                isUpcoming ? "opacity-60" : "opacity-90 hover:opacity-100"
              }`}
              title={`${flight.id}: ${isUpcoming ? "Scheduled" : flight.outcome}`}
              aria-label={`Select ${flight.id}`}
              aria-pressed={selected}
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] text-[color:var(--color-mute)] opacity-0 transition-opacity group-hover:opacity-100">
                {flight.number}
              </span>
              <span
                className={`animate-bar-grow w-full rounded-sm transition-[box-shadow,outline] duration-200 ${
                  selected
                    ? "outline outline-2 outline-offset-2 outline-[color:var(--color-ink)]"
                    : ""
                } ${isUpcoming ? "border border-dashed border-[color:var(--color-line-strong)]" : ""}`}
                style={{
                  height: `${height}%`,
                  backgroundColor: isUpcoming ? "transparent" : color,
                  animationDelay: `${index * 0.04}s`,
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[color:var(--color-line)] pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-faint)]">
        <span>IFT-1</span>
        <span className="tracking-[0.24em]">Program maturity</span>
        <span>IFT-13</span>
      </div>
    </div>
  );
}
