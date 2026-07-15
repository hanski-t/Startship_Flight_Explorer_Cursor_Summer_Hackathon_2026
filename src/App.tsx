import { useCallback, useEffect, useMemo, useState } from "react";
import flightsData from "./data/flights.json";
import type { Flight } from "./types/flight";
import { FlightTimeline } from "./components/FlightTimeline";
import { FlightDetailPanel } from "./components/FlightDetailPanel";
import { MissionGuide } from "./components/MissionGuide";
import { ProgramProgressStrip } from "./components/ProgramProgressStrip";
import { MissionMap } from "./components/MissionMap";

const flights = flightsData as Flight[];

function App() {
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(
    flights[0]?.id ?? null,
  );

  const selectedFlight = useMemo(
    () => flights.find((f) => f.id === selectedFlightId) ?? null,
    [selectedFlightId],
  );

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#0a0f1e] to-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.08)_0%,_transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none fixed inset-0 animate-twinkle [background-image:radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:120px_120px] opacity-20" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/80">
            Integrated Flight Test Program
          </p>
          <h1 className="bg-gradient-to-r from-white via-sky-100 to-slate-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            Starship Flight Explorer
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            How far each flight got — traced across launch, separation, booster
            recovery, and ship splashdown.
          </p>
        </header>

        <MissionGuide />

        <div className="mt-6">
          <ProgramProgressStrip
            flights={flights}
            selectedFlightId={selectedFlightId}
            onSelectFlight={handleSelectFlight}
          />
        </div>

        {selectedFlight && (
          <div
            key={selectedFlight.id}
            className="animate-hero-in mt-6 overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-900/40 shadow-2xl shadow-sky-500/5 backdrop-blur-sm"
          >
            <div className="border-b border-slate-700/50 px-5 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-sky-400/80">
                Selected mission profile — {selectedFlight.id}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Schematic map showing launch from Starbase, booster return to
                the Gulf, and ship arc toward the Indian Ocean. Node colors
                reflect what happened at each stage.
              </p>
            </div>
            <MissionMap
              stages={selectedFlight.stages}
              upcoming={selectedFlight.upcoming}
              flightId={selectedFlight.id}
            />
          </div>
        )}

        <main className="mt-8 flex flex-1 flex-col gap-6 xl:flex-row xl:items-start xl:gap-8">
          <div className="flex-1 xl:min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-400">
                Flight timeline
              </h2>
              <p className="text-xs text-slate-500">
                Scroll horizontally · Use ← → keys
              </p>
            </div>
            <FlightTimeline
              flights={flights}
              selectedFlightId={selectedFlightId}
              onSelectFlight={handleSelectFlight}
            />
          </div>

          {selectedFlight && (
            <div className="w-full shrink-0 xl:w-[420px] xl:sticky xl:top-8">
              <FlightDetailPanel
                flight={selectedFlight}
                onClose={handleCloseDetail}
              />
            </div>
          )}
        </main>

        <footer className="mt-10 text-center text-xs text-slate-600">
          Schematic mission maps — not live trajectories · IFT-1 through IFT-12
          flown, IFT-13 scheduled
        </footer>
      </div>
    </div>
  );
}

export default App;
