import type { Flight } from "../types/flight";
import { blockLabel } from "../lib/stageColors";
import { FlightCard } from "./FlightCard";

interface FlightTimelineProps {
  flights: Flight[];
  selectedFlightId: string | null;
  onSelectFlight: (id: string) => void;
}

export function FlightTimeline({
  flights,
  selectedFlightId,
  onSelectFlight,
}: FlightTimelineProps) {
  return (
    <div
      className="overflow-x-auto pb-2"
      tabIndex={0}
      role="list"
      aria-label="Starship flight test timeline"
    >
      <div className="flex min-w-max snap-x snap-mandatory gap-4 px-1 py-2">
        {flights.map((flight) => {
          const dividerLabel = blockLabel(flight.number);

          return (
            <div key={flight.id} className="flex items-stretch gap-4">
              {dividerLabel && (
                <div className="flex flex-col items-center justify-center gap-2 px-1">
                  <div className="h-full w-px bg-gradient-to-b from-transparent via-[color:var(--color-line-strong)] to-transparent" />
                  <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-faint)] [writing-mode:vertical-lr]">
                    {dividerLabel}
                  </span>
                  <div className="h-full w-px bg-gradient-to-b from-transparent via-[color:var(--color-line-strong)] to-transparent" />
                </div>
              )}
              <FlightCard
                flight={flight}
                selected={selectedFlightId === flight.id}
                onSelect={onSelectFlight}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
