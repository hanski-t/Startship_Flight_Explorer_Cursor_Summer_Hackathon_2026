import { useEffect, useMemo, useState } from "react";
import { RotateCcw, ZoomOut } from "lucide-react";
import type { Flight, StageKey, StageStatus } from "../types/flight";
import { STAGE_KEYS } from "../types/flight";
import { formatDate } from "../lib/formatDate";
import {
  getFurthestStageIndex,
  stageStrokeColor,
} from "../lib/missionProgress";
import { stageStatusLabel } from "../lib/stageColors";
import { getStageGuide } from "../data/guideContent";
import { OutcomeBadge } from "./OutcomeBadge";

interface MissionProfileHeroProps {
  flight: Flight;
}

/* ── Trajectory geometry (viewBox 0 0 1200 560) ──────────────────
   A cinematic flight profile in the spirit of the SpaceX mission
   diagram: shared ascent, then the booster branch curls back to a
   Gulf splashdown while the ship arcs across to its own splashdown. */
const VB_W = 1200;
const VB_H = 560;

const ASCENT =
  "M 92 502 C 150 470 198 388 240 332 C 288 268 328 214 360 152";
const SHIP_MAIN =
  "M 360 152 C 470 78 622 52 720 64 C 882 84 968 132 1010 208 C 1064 306 1110 406 1140 484";
const SHIP_A =
  "M 360 152 C 470 78 622 52 720 64 C 882 84 968 132 1010 208";
const SHIP_B = "M 1010 208 C 1064 306 1110 406 1140 484";
const BOOSTER =
  "M 360 152 C 330 116 298 130 312 170 C 346 278 416 406 472 502";
const MAIN_ROUTE = `${ASCENT} C 470 78 622 52 720 64 C 882 84 968 132 1010 208 C 1064 306 1110 406 1140 484`;

interface Node {
  key: StageKey;
  x: number;
  y: number;
  label: string;
  rot: number;
  labelDx: number;
  labelDy: number;
  anchor: "start" | "middle" | "end";
}

const NODES: Node[] = [
  { key: "liftoff", x: 92, y: 502, label: "Launch", rot: 40, labelDx: 16, labelDy: 4, anchor: "start" },
  { key: "maxQ", x: 240, y: 332, label: "Max-Q", rot: 34, labelDx: 16, labelDy: 4, anchor: "start" },
  { key: "stageSeparation", x: 360, y: 152, label: "Hot staging", rot: 74, labelDx: 16, labelDy: -4, anchor: "start" },
  { key: "boosterLanding", x: 472, y: 502, label: "Booster landing", rot: 2, labelDx: 16, labelDy: 6, anchor: "start" },
  { key: "shipReentry", x: 1010, y: 208, label: "Ship entry", rot: 118, labelDx: 16, labelDy: -6, anchor: "start" },
  { key: "splashdown", x: 1140, y: 484, label: "Splashdown", rot: 2, labelDx: 0, labelDy: 26, anchor: "middle" },
];

/* Ambient, unlit event labels that enrich the diagram like the
   reference, without implying status. */
const AMBIENT = [{ x: 726, y: 40, label: "Coast phase" }];

function segColor(flight: Flight, keys: StageKey[]): string {
  const statuses = keys
    .map((k) => flight.stages[k])
    .filter((s) => s !== "not-attempted");
  if (statuses.length === 0) return "#2b323f";
  const worst: StageStatus = statuses.includes("failure")
    ? "failure"
    : statuses.includes("partial")
      ? "partial"
      : "success";
  return stageStrokeColor(worst);
}

export function MissionProfileHero({ flight }: MissionProfileHeroProps) {
  const [runKey, setRunKey] = useState(0);
  const [focus, setFocus] = useState<StageKey | null>(null);
  const [reduce, setReduce] = useState(false);

  const isUpcoming = flight.upcoming === true;
  const furthest = getFurthestStageIndex(flight.stages);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Restart the choreography whenever the featured flight changes.
  useEffect(() => {
    setFocus(null);
    setRunKey((k) => k + 1);
  }, [flight.id]);

  const focusNode = focus ? NODES.find((n) => n.key === focus) ?? null : null;

  const zoomTransform = useMemo(() => {
    if (!focusNode) return "translate(0px, 0px) scale(1)";
    const s = 2.3;
    const tx = VB_W / 2 - s * focusNode.x;
    const ty = VB_H / 2 - s * focusNode.y;
    return `translate(${tx}px, ${ty}px) scale(${s})`;
  }, [focusNode]);

  const boosterReached = flight.stages.boosterLanding !== "not-attempted";
  const focusGuide = focus ? getStageGuide(focus) : null;
  const focusStatus = focus ? flight.stages[focus] : null;

  return (
    <div className="animate-hero-in relative overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-void)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_-40px_rgba(0,0,0,1)]">
      {/* horizon glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(120,140,175,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-line-strong)] to-transparent" />

      {/* ── Overlay: flight meta ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-4 p-5 [text-shadow:0_1px_16px_rgba(7,8,11,0.95)] sm:p-7">
        <div className="max-w-md">
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
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-faint)]">
            Furthest milestone
          </p>
          <p className="mt-0.5 font-display text-sm font-semibold text-[color:var(--color-ink)]">
            {furthest >= 0 && !isUpcoming
              ? NODES[Math.min(furthest, NODES.length - 1)].label
              : "Awaiting launch"}
          </p>
          <p className="mt-4 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-faint)] sm:block">
            Tap a stage to zoom in
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {focus && (
            <button
              type="button"
              onClick={() => setFocus(null)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)]/80 px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink)] backdrop-blur-sm transition-colors hover:bg-[color:var(--color-panel-2)]"
            >
              <ZoomOut size={14} aria-hidden />
              Reset view
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setFocus(null);
              setRunKey((k) => k + 1);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)]/80 px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink)] backdrop-blur-sm transition-colors hover:bg-[color:var(--color-panel-2)]"
          >
            <RotateCcw size={14} aria-hidden />
            Replay
          </button>
        </div>
      </div>

      {/* ── The trajectory ── */}
      <svg
        key={runKey}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Mission profile for ${flight.id}`}
      >
        <defs>
          <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id={`route-main-${runKey}`} d={MAIN_ROUTE} />
          <path id={`route-booster-${runKey}`} d={BOOSTER} />
        </defs>

        {/* faint starfield */}
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.o} />
        ))}

        {/* horizon + water hint */}
        <line x1="0" y1="516" x2={VB_W} y2="516" stroke="#1c212b" strokeWidth="1" />
        <text x="820" y="450" textAnchor="start" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.5" fill="#2b323f">
          INDIAN OCEAN
        </text>

        <g className="traj-zoom" style={{ transform: zoomTransform }}>
          {/* base (unreached) routes */}
          <path d={BOOSTER} fill="none" stroke="#161a22" strokeWidth="2" strokeDasharray="7 7" />
          <path d={SHIP_MAIN} fill="none" stroke="#161a22" strokeWidth="2.5" />
          <path d={ASCENT} fill="none" stroke="#161a22" strokeWidth="2.5" />

          {/* colored, drawn-in segments */}
          <ColoredSeg d={ASCENT} reached={furthest >= 1} color={segColor(flight, ["liftoff", "maxQ"])} delay={0.15} />
          <ColoredSeg d={SHIP_A} reached={furthest >= 2} color={segColor(flight, ["stageSeparation", "shipReentry"])} delay={0.9} width={2.5} />
          <ColoredSeg d={SHIP_B} reached={furthest >= 4} color={segColor(flight, ["shipReentry", "splashdown"])} delay={1.7} width={2.5} />
          <ColoredSeg d={BOOSTER} reached={furthest >= 3} color={segColor(flight, ["boosterLanding"])} delay={1.4} dashed width={2} />

          {/* traveling rockets (native SMIL along the route) */}
          {!reduce && !isUpcoming && furthest >= 0 && (
            <g opacity={0}>
              <TravelGlyph
                color={stageStrokeColor(
                  flight.stages[STAGE_KEYS[Math.max(furthest, 0)]],
                )}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0.9"
                keyTimes="0;0.06;0.9;1"
                dur="3.6s"
                begin="0.2s"
                fill="freeze"
              />
              <animateMotion
                dur="3.6s"
                begin="0.2s"
                fill="freeze"
                rotate="auto"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.5 0 0.5 1"
              >
                <mpath href={`#route-main-${runKey}`} />
              </animateMotion>
            </g>
          )}
          {!reduce && !isUpcoming && boosterReached && (
            <g opacity={0}>
              <TravelGlyph color={stageStrokeColor(flight.stages.boosterLanding)} small />
              <animate
                attributeName="opacity"
                values="0;1;1"
                keyTimes="0;0.1;1"
                dur="1.5s"
                begin="1.6s"
                fill="freeze"
              />
              <animateMotion
                dur="1.5s"
                begin="1.6s"
                fill="freeze"
                rotate="auto"
              >
                <mpath href={`#route-booster-${runKey}`} />
              </animateMotion>
            </g>
          )}

          {/* ambient labels */}
          {AMBIENT.map((a) => (
            <text
              key={a.label}
              x={a.x}
              y={a.y}
              textAnchor="middle"
              className="traj-label"
              style={{ animationDelay: "0.6s" }}
              fontFamily="var(--font-mono)"
              fontSize="9.5"
              letterSpacing="1.4"
              fill="#3a4252"
            >
              {a.label.toUpperCase()}
            </text>
          ))}

          {/* stage markers */}
          {NODES.map((node, i) => {
            const status = flight.stages[node.key];
            const reached = !isUpcoming && status !== "not-attempted";
            const color = reached ? stageStrokeColor(status) : "#2b323f";
            const isFocused = focus === node.key;
            return (
              <g key={node.key}>
                <g
                  className="traj-marker cursor-pointer"
                  style={{ animationDelay: `${0.3 + i * 0.28}s` }}
                  onClick={() => setFocus(isFocused ? null : node.key)}
                >
                  {reached && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={9}
                      fill={color}
                      opacity="0.28"
                      className="traj-pulse"
                      style={{ pointerEvents: "none" }}
                    />
                  )}
                  {/* hit area */}
                  <circle cx={node.x} cy={node.y} r={20} fill="transparent" />
                  <g transform={`translate(${node.x} ${node.y}) rotate(${node.rot})`}>
                    <MarkerGlyph color={color} reached={reached} />
                  </g>
                  {isFocused && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={16}
                      fill="none"
                      stroke="#eceef4"
                      strokeWidth="1"
                      opacity="0.9"
                    />
                  )}
                </g>

                {/* leader + label */}
                <g
                  className="traj-label"
                  style={{ animationDelay: `${0.5 + i * 0.28}s`, pointerEvents: "none" }}
                >
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={node.x + node.labelDx * 0.5}
                    y2={node.y + node.labelDy * 0.5}
                    stroke={reached ? color : "#2b323f"}
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <text
                    x={node.x + node.labelDx}
                    y={node.y + node.labelDy}
                    textAnchor={node.anchor}
                    fontFamily="var(--font-mono)"
                    fontSize="11"
                    letterSpacing="1.2"
                    fontWeight={reached ? 600 : 400}
                    fill={reached ? "#eceef4" : "#626b7c"}
                  >
                    {node.label.toUpperCase()}
                  </text>
                  {reached && (
                    <text
                      x={node.x + node.labelDx}
                      y={node.y + node.labelDy + 13}
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
              </g>
            );
          })}

          {/* launch pad tick */}
          <line x1="92" y1="502" x2="92" y2="516" stroke="#3a4252" strokeWidth="2" />
        </g>
      </svg>

      {/* ── Focused stage detail card ── */}
      {focus && focusGuide && (
        <div className="animate-panel-in absolute bottom-5 left-5 z-10 max-w-xs rounded-xl border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel)]/90 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-sm font-semibold text-[color:var(--color-ink)]">
              {focusGuide.label}
            </h3>
            {focusStatus && focusStatus !== "not-attempted" ? (
              <span
                className="font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: stageStrokeColor(focusStatus) }}
              >
                {stageStatusLabel(focusStatus)}
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-faint)]">
                Not reached
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--color-mute)]">
            {focusGuide.description}
          </p>
        </div>
      )}

    </div>
  );
}

function ColoredSeg({
  d,
  reached,
  color,
  delay,
  dashed,
  width = 2.5,
}: {
  d: string;
  reached: boolean;
  color: string;
  delay: number;
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
      pathLength={1}
      filter="url(#hero-glow)"
      className="traj-path-draw"
      style={{ ["--draw-delay" as string]: `${delay}s`, ["--draw-dur" as string]: "1.5s" }}
    />
  );
}

/* Single simple rocket glyph (allowed: one small geometric mark). */
function MarkerGlyph({ color, reached }: { color: string; reached: boolean }) {
  return (
    <g>
      <path
        d="M 0 -8 C 2.6 -4 2.6 2 1.2 5 L -1.2 5 C -2.6 2 -2.6 -4 0 -8 Z"
        fill={reached ? color : "#11141b"}
        stroke={reached ? "#0b0d12" : "#2b323f"}
        strokeWidth="0.6"
      />
      <circle cx="0" cy="-2" r="1" fill="#0b0d12" opacity={reached ? 0.5 : 0} />
    </g>
  );
}

function TravelGlyph({ color, small }: { color: string; small?: boolean }) {
  const s = small ? 0.7 : 1;
  return (
    <g transform={`scale(${s})`}>
      <path d="M 9 0 L -5 4 L -2 0 L -5 -4 Z" fill={color} filter="url(#hero-glow)" />
    </g>
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
