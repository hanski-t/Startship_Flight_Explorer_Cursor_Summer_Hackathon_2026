import { useCallback, useEffect, useMemo, useState } from "react";
import flightsData from "./data/flights.json";
import type { Flight } from "./types/flight";
import { FlightTimeline } from "./components/FlightTimeline";
import { FlightDetailPanel } from "./components/FlightDetailPanel";
import { MissionGuide } from "./components/MissionGuide";
import { ProgramProgressStrip } from "./components/ProgramProgressStrip";
import { MissionMap } from "./components/MissionMap";
import { Panel } from "./components/Panel";
import { SectionHeading } from "./components/SectionHeading";

const flights = flightsData as Flight[];

function App() {
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(
    flights[0]?.id ?? null,
  );

  const selectedFlight = useMemo(
    () => flights.find((f) => f.id === selectedFlightId) ?? null,
    [selectedFlightId],
  );

  const stats = useMemo(() => {
    const flown = flights.filter((f) => !f.upcoming);
    const successes = flown.filter((f) => f.outcome === "success").length;
    const next = flights.find((f) => f.upcoming);
    return {
      flown: flown.length,
      successes,
      rate: flown.length ? Math.round((successes / flown.length) * 100) : 0,
      next: next?.id ?? "TBD",
    };
  }, []);

  const handleSelectFlight = useCallback((id: string) => {
    setSelectedFlightId(id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedFlightId(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedFlightId(null);
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      const currentIndex = flights.findIndex((f) => f.id === selectedFlightId);
      if (currentIndex === -1) return;

      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = Math.min(
        flights.length - 1,
        Math.max(0, currentIndex + delta),
      );
      setSelectedFlightId(flights[nextIndex].id);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFlightId]);

  return (
    <div className="relative min-h-[100dvh] bg-[color:var(--color-void)] text-[color:var(--color-ink)]">
      {/* Restrained space canvas: one cool top glow + one faint static
          starfield. No dot-grids, no triple-stacked twinkle layers. */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(62%_46%_at_50%_-8%,rgba(140,160,190,0.10),transparent_70%)]" />
      <div className="animate-drift pointer-events-none fixed inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,0.7)_0.6px,transparent_0.6px)] [background-size:96px_96px]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-line-strong)] to-transparent" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <header className="animate-rise-in grid gap-8 border-b border-[color:var(--color-line)] pb-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em] text-[color:var(--color-faint)]">
              Integrated Flight Test Program
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-tight text-[color:var(--color-ink)] sm:text-5xl lg:text-6xl">
              Starship Flight Explorer
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-mute)]">
              How far each flight got — traced across launch, separation, booster
              recovery, and ship splashdown.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-7">
            <Stat label="Flights flown" value={stats.flown} />
            <Stat label="Full successes" value={stats.successes} />
            <Stat label="Success rate" value={`${stats.rate}%`} />
            <Stat label="Next test" value={stats.next} />
          </dl>
        </header>

        <div className="mt-8">
          <MissionGuide />
        </div>

        <Panel className="mt-6 p-5 sm:p-6">
          <SectionHeading
            title="Program trajectory"
            description={`${stats.successes} of ${stats.flown} flights fully successful. Taller bars reached further through the stage sequence. Select a bar to inspect that flight.`}
            right={
              <div className="text-right">
                <p className="tnum text-3xl font-semibold text-[color:var(--color-ok)]">
                  {stats.rate}%
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-faint)]">
                  Success rate
                </p>
              </div>
            }
          />
          <div className="mt-6">
            <ProgramProgressStrip
              flights={flights}
              selectedFlightId={selectedFlightId}
              onSelectFlight={handleSelectFlight}
            />
          </div>
        </Panel>

        {selectedFlight && (
          <Panel
            key={selectedFlight.id}
            className="animate-hero-in mt-6 overflow-hidden"
            aria-label={`Mission profile for ${selectedFlight.id}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[color:var(--color-line)] px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-base font-semibold tracking-tight text-[color:var(--color-ink)]">
                  Mission profile
                </h2>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[color:var(--color-mute)]">
                  Launch from Starbase, booster return to the Gulf, and ship arc
                  toward the Indian Ocean. Node color reflects what happened at
                  each stage.
                </p>
              </div>
              <span className="tnum rounded-md border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel-2)] px-2.5 py-1 text-xs text-[color:var(--color-ink)]">
                {selectedFlight.id}
              </span>
            </div>
            <MissionMap
              stages={selectedFlight.stages}
              upcoming={selectedFlight.upcoming}
              flightId={selectedFlight.id}
            />
          </Panel>
        )}

        <main className="mt-6 flex flex-1 flex-col gap-6 xl:flex-row xl:items-start xl:gap-8">
          <div className="flex-1 xl:min-w-0">
            <SectionHeading
              title="Flight timeline"
              description="Every integrated flight test, in order. Select any card to load its full profile."
              right={
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-faint)]">
                  Arrow keys to step
                </p>
              }
              className="mb-4"
            />
            <FlightTimeline
              flights={flights}
              selectedFlightId={selectedFlightId}
              onSelectFlight={handleSelectFlight}
            />
          </div>

          {selectedFlight && (
            <div className="w-full shrink-0 xl:sticky xl:top-8 xl:w-[420px]">
              <FlightDetailPanel
                flight={selectedFlight}
                onClose={handleCloseDetail}
              />
            </div>
          )}
        </main>

        <footer className="mt-14 border-t border-[color:var(--color-line)] pt-6 text-xs text-[color:var(--color-faint)]">
          Schematic mission maps, not live trajectories. IFT-1 through IFT-12
          flown, IFT-13 scheduled.
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-l border-[color:var(--color-line-strong)] pl-4">
      <dd className="tnum text-2xl font-semibold leading-none text-[color:var(--color-ink)] sm:text-3xl">
        {value}
      </dd>
      <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-faint)]">
        {label}
      </dt>
    </div>
  );
}

export default App;
