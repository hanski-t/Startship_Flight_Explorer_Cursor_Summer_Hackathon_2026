import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Minimize2 } from "lucide-react";
import type { Flight, StageKey } from "../types/flight";
import { formatDate } from "../lib/formatDate";
import { stageStrokeColor } from "../lib/missionProgress";
import { stageStatusLabel } from "../lib/stageColors";
import { getStageGuide } from "../data/guideContent";
import { OutcomeBadge } from "./OutcomeBadge";

interface MissionProfileHeroProps {
  flight: Flight;
}

/* ── Trajectory geometry (viewBox 0 0 1200 560) ──────────────────
   A schematic flight profile: a shared ascent, then the booster
   branch curls back toward a Gulf splashdown while the ship arcs
   across to entry and its own splashdown. Not drawn to scale. */
const VB_W = 1200;
const VB_H = 560;

const ASCENT = "M 92 502 C 150 470 198 388 240 332 C 288 268 328 214 360 152";
const SHIP_MAIN =
  "M 360 152 C 470 78 622 52 720 64 C 882 84 968 132 1010 208 C 1064 306 1110 406 1140 484";
/* Legs between consecutive milestones, so the colored trajectory only
   extends as far as the flight actually flew. */
const LEG_LAUNCH_MAXQ = "M 92 502 C 150 470 198 388 240 332";
const LEG_MAXQ_SEP = "M 240 332 C 288 268 328 214 360 152";
const SHIP_A = "M 360 152 C 470 78 622 52 720 64 C 882 84 968 132 1010 208";
const SHIP_B = "M 1010 208 C 1064 306 1110 406 1140 484";
const BOOSTER =
  "M 360 152 C 330 116 298 130 312 170 C 346 278 416 406 472 502";

interface Node {
  key: StageKey;
  x: number;
  y: number;
  short: string;
  labelDx: number;
  labelDy: number;
  anchor: "start" | "middle" | "end";
}

const NODES: Node[] = [
  { key: "liftoff", x: 92, y: 502, short: "Launch", labelDx: 16, labelDy: 5, anchor: "start" },
  { key: "maxQ", x: 240, y: 332, short: "Max-Q", labelDx: 16, labelDy: 5, anchor: "start" },
  { key: "stageSeparation", x: 360, y: 152, short: "Hot staging", labelDx: 16, labelDy: -6, anchor: "start" },
  { key: "boosterLanding", x: 472, y: 502, short: "Booster", labelDx: 16, labelDy: 6, anchor: "start" },
  { key: "shipReentry", x: 1010, y: 208, short: "Ship entry", labelDx: 16, labelDy: -8, anchor: "start" },
  { key: "splashdown", x: 1140, y: 484, short: "Splashdown", labelDx: 0, labelDy: 28, anchor: "middle" },
];

/* Nominal (target) flight profile. Values are representative of a
   typical Starship test, not per-flight telemetry. */
const PROFILE: Record<
  StageKey,
  { t: string; alt: string; vel: string; actor: string }
> = {
  liftoff: { t: "T+00:00", alt: "0 km", vel: "0 km/h", actor: "Full stack" },
  maxQ: { t: "T+00:55", alt: "~13 km", vel: "~2,500 km/h", actor: "Full stack" },
  stageSeparation: { t: "T+02:40", alt: "~68 km", vel: "~6,000 km/h", actor: "Separation" },
  boosterLanding: { t: "T+07:00", alt: "0 km", vel: "~0 km/h", actor: "Super Heavy" },
  shipReentry: { t: "T+47:00", alt: "~100 km", vel: "~26,000 km/h", actor: "Starship" },
  splashdown: { t: "T+1:06:00", alt: "0 km", vel: "~0 km/h", actor: "Starship" },
};

/* Each leg is drawn only when its destination milestone was reached,
   and coloured by that milestone's outcome. */
const LEGS: { d: string; dest: StageKey; dashed?: boolean; width?: number }[] = [
  { d: LEG_LAUNCH_MAXQ, dest: "maxQ" },
  { d: LEG_MAXQ_SEP, dest: "stageSeparation" },
  { d: SHIP_A, dest: "shipReentry" },
  { d: SHIP_B, dest: "splashdown" },
  { d: BOOSTER, dest: "boosterLanding", dashed: true, width: 2 },
];

export function MissionProfileHero({ flight }: MissionProfileHeroProps) {
  const [step, setStep] = useState<number | null>(null);

  const isUpcoming = flight.upcoming === true;

  useEffect(() => {
    setStep(null);
  }, [flight.id]);

  const activeNode = step !== null ? NODES[step] : null;

  const zoomTransform = useMemo(() => {
    if (!activeNode) return "translate(0px, 0px) scale(1)";
    const s = 2.05;
    // Bias the focal point to the upper-right so the readout panel
    // (bottom-left) never covers the stage you stepped to.
    const cx = VB_W * 0.66;
    const cy = VB_H * 0.4;
    const tx = cx - s * activeNode.x;
    const ty = cy - s * activeNode.y;
    return `translate(${tx}px, ${ty}px) scale(${s})`;
  }, [activeNode]);

  const go = (next: number) => setStep(Math.min(NODES.length - 1, Math.max(0, next)));

  const activeKey = activeNode?.key ?? null;
  const activeGuide = activeKey ? getStageGuide(activeKey) : null;
  const activeStatus = activeKey ? flight.stages[activeKey] : null;
  const activeReached =
    !isUpcoming && activeStatus !== undefined && activeStatus !== "not-attempted";
  const activeProfile = activeKey ? PROFILE[activeKey] : null;

  return (
    <div className="animate-hero-in relative overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-void)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_-40px_rgba(0,0,0,1)]">
      {/* horizon glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(120,140,175,0.16),transparent_60%)]" />

      {/* ── Overlay: flight meta ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-4 p-5 [text-shadow:0_1px_16px_rgba(7,8,11,0.95)] sm:p-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-3xl font-semibold leading-none tracking-tight text-[color:var(--color-ink)] sm:text-4xl">
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
          <p className="tnum mt-2 text-xs uppercase tracking-[0.16em] text-[color:var(--color-faint)]">
            {formatDate(flight.date, isUpcoming)}
          </p>
        </div>

        {step !== null && (
          <button
            type="button"
            onClick={() => setStep(null)}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)]/80 px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink)] backdrop-blur-sm transition-colors hover:bg-[color:var(--color-panel-2)]"
          >
            <Minimize2 size={14} aria-hidden />
            Overview
          </button>
        )}
      </div>

      {/* ── The trajectory ── */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Mission profile for ${flight.id}`}
        >
          <defs>
            <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.o} />
          ))}

          <line x1="0" y1="516" x2={VB_W} y2="516" stroke="#1c212b" strokeWidth="1" />

          <g className="traj-zoom" style={{ transform: zoomTransform }}>
            {/* Kármán line (schematic) */}
            {step === null && (
              <>
                <line
                  x1="0"
                  y1="96"
                  x2={VB_W}
                  y2="96"
                  stroke="#171b23"
                  strokeWidth="1"
                  strokeDasharray="3 8"
                />
                <text x="1188" y="88" textAnchor="end" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.5" fill="#2b323f">
                  KÁRMÁN LINE · SPACE ~100 KM
                </text>
                <text x="820" y="452" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.5" fill="#2b323f">
                  INDIAN OCEAN
                </text>
                <text x="726" y="40" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1.4" fill="#3a4252">
                  COAST PHASE
                </text>
              </>
            )}

            {/* base (unreached) routes */}
            <path d={BOOSTER} fill="none" stroke="#161a22" strokeWidth="2" strokeDasharray="7 7" />
            <path d={SHIP_MAIN} fill="none" stroke="#161a22" strokeWidth="2.5" />
            <path d={ASCENT} fill="none" stroke="#161a22" strokeWidth="2.5" />

            {/* colored legs — only as far as the flight actually flew */}
            {LEGS.map((leg) => {
              const status = flight.stages[leg.dest];
              const reached = !isUpcoming && status !== "not-attempted";
              return (
                <Seg
                  key={leg.dest}
                  d={leg.d}
                  reached={reached}
                  color={stageStrokeColor(status)}
                  dashed={leg.dashed}
                  width={leg.width}
                />
              );
            })}

            {/* launch pad tick */}
            <line x1="92" y1="502" x2="92" y2="516" stroke="#3a4252" strokeWidth="2" />

            {/* stage nodes */}
            {NODES.map((node, i) => {
              const status = flight.stages[node.key];
              const reached = !isUpcoming && status !== "not-attempted";
              const color = reached ? stageStrokeColor(status) : "#3a4252";
              const active = step === i;
              return (
                <StageNode
                  key={node.key}
                  node={node}
                  index={i}
                  color={color}
                  reached={reached}
                  active={active}
                  onSelect={() => setStep(active ? null : i)}
                />
              );
            })}

            {/* labels (overview only) */}
            {step === null &&
              NODES.map((node) => {
                const status = flight.stages[node.key];
                const reached = !isUpcoming && status !== "not-attempted";
                const color = reached ? stageStrokeColor(status) : "#3a4252";
                return (
                  <g key={node.key} style={{ pointerEvents: "none" }}>
                    <text
                      x={node.x + node.labelDx}
                      y={node.y + node.labelDy - 5}
                      textAnchor={node.anchor}
                      fontFamily="var(--font-mono)"
                      fontSize="11"
                      letterSpacing="1.1"
                      fontWeight={reached ? 600 : 400}
                      fill={reached ? "#eceef4" : "#626b7c"}
                    >
                      {node.short.toUpperCase()}
                    </text>
                    {reached && (
                      <text
                        x={node.x + node.labelDx}
                        y={node.y + node.labelDy + 8}
                        textAnchor={node.anchor}
                        fontFamily="var(--font-mono)"
                        fontSize="9"
                        letterSpacing="0.8"
                        fill={color}
                      >
                        {stageStatusLabel(status).toUpperCase()}
                      </text>
                    )}
                  </g>
                );
              })}
          </g>
        </svg>

        {/* ── Active-stage readout ── */}
        {activeNode && activeGuide && activeProfile && (
          <div className="animate-panel-in absolute bottom-4 left-4 right-4 z-10 max-w-sm rounded-xl border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)]/92 p-4 backdrop-blur-md sm:right-auto">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-faint)]">
                Stage {step! + 1} / {NODES.length} · {activeProfile.actor}
              </p>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: activeReached ? stageStrokeColor(activeStatus!) : "#626b7c" }}
              >
                {activeReached ? stageStatusLabel(activeStatus!) : "Not reached"}
              </span>
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold text-[color:var(--color-ink)]">
              {activeGuide.label}
            </h3>

            <dl className="mt-3 grid grid-cols-3 gap-2 border-y border-[color:var(--color-line)] py-2.5">
              <Readout label="Elapsed" value={activeProfile.t} />
              <Readout label="Altitude" value={activeProfile.alt} />
              <Readout label="Velocity" value={activeProfile.vel} />
            </dl>

            <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-mute)]">
              {activeGuide.description}
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--color-faint)]">
              Nominal profile · outcome shown for {flight.id}
            </p>
          </div>
        )}
      </div>

      {/* ── Stepper ── */}
      <div className="relative z-10 flex items-center gap-2 border-t border-[color:var(--color-line)] bg-[color:var(--color-void)]/60 px-3 py-3 sm:px-4">
        <StepButton
          direction="prev"
          disabled={step === 0}
          onClick={() => go(step === null ? 0 : step - 1)}
        />
        <div className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto sm:justify-center">
          {NODES.map((node, i) => {
            const status = flight.stages[node.key];
            const reached = !isUpcoming && status !== "not-attempted";
            const color = reached ? stageStrokeColor(status) : "#3a4252";
            return (
              <button
                key={node.key}
                type="button"
                onClick={() => setStep(step === i ? null : i)}
                aria-pressed={step === i}
                className={`group flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-colors ${
                  step === i
                    ? "border-[color:var(--color-ink)] bg-[color:var(--color-panel-2)]"
                    : "border-[color:var(--color-line)] hover:border-[color:var(--color-line-strong)] hover:bg-[color:var(--color-panel)]"
                }`}
              >
                <span
                  className="tnum flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-bold"
                  style={{
                    color: "#0b0d12",
                    backgroundColor: color,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] ${
                    step === i
                      ? "text-[color:var(--color-ink)]"
                      : "text-[color:var(--color-mute)]"
                  }`}
                >
                  {node.short}
                </span>
              </button>
            );
          })}
        </div>
        <StepButton
          direction="next"
          disabled={step === NODES.length - 1}
          onClick={() => go(step === null ? 0 : step + 1)}
        />
      </div>
    </div>
  );
}

function StageNode({
  node,
  index,
  color,
  reached,
  active,
  onSelect,
}: {
  node: Node;
  index: number;
  color: string;
  reached: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  const r = active ? 15 : 11;
  return (
    <g className="cursor-pointer" onClick={onSelect}>
      <circle cx={node.x} cy={node.y} r={24} fill="transparent" />
      {active && (
        <circle
          cx={node.x}
          cy={node.y}
          r={r + 6}
          fill="none"
          stroke="#eceef4"
          strokeWidth="1.5"
          opacity="0.9"
        />
      )}
      <circle
        cx={node.x}
        cy={node.y}
        r={r}
        fill="#0c0e13"
        stroke={color}
        strokeWidth={active ? 3 : 2}
        filter={reached ? "url(#hero-glow)" : undefined}
      />
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize={active ? 14 : 11}
        fontWeight="700"
        fill={reached ? color : "#626b7c"}
      >
        {index + 1}
      </text>
    </g>
  );
}

function Seg({
  d,
  reached,
  color,
  dashed,
  width = 2.5,
}: {
  d: string;
  reached: boolean;
  color: string;
  dashed?: boolean;
  width?: number;
}) {
  if (!reached) return null;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? "7 7" : undefined}
      filter="url(#hero-glow)"
    />
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dd className="tnum text-sm font-semibold text-[color:var(--color-ink)]">
        {value}
      </dd>
      <dt className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--color-faint)]">
        {label}
      </dt>
    </div>
  );
}

function StepButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous stage" : "Next stage"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[color:var(--color-line)] text-[color:var(--color-mute)] transition-colors hover:border-[color:var(--color-line-strong)] hover:text-[color:var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-30"
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}

const STARS = Array.from({ length: 46 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r1 = seed / 233280;
  const r2 = ((i * 4523 + 7919) % 233280) / 233280;
  const r3 = ((i * 6151 + 1301) % 233280) / 233280;
  return {
    x: Math.round(r1 * VB_W),
    y: Math.round(r2 * 360),
    r: r3 > 0.85 ? 1.2 : 0.7,
    o: 0.1 + r3 * 0.35,
  };
});
