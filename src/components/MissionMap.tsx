import type { FlightStages } from "../types/flight";
import {
  MAP_NODES,
  getFurthestStageIndex,
  stageGlowColor,
  stageStrokeColor,
} from "../lib/missionProgress";
import { stageStatusLabel } from "../lib/stageColors";

interface MissionMapProps {
  stages: FlightStages;
  upcoming?: boolean;
  compact?: boolean;
  flightId?: string;
}

const ASCENT_PATH =
  "M 80 320 C 120 260, 140 220, 160 200 C 200 160, 230 130, 260 120";
const SHIP_PATH =
  "M 260 120 C 340 80, 420 70, 520 100 C 600 120, 650 180, 680 260";
const BOOSTER_PATH =
  "M 260 120 C 240 160, 220 220, 200 280";

export function MissionMap({
  stages,
  upcoming = false,
  compact = false,
  flightId,
}: MissionMapProps) {
  const furthest = getFurthestStageIndex(stages);
  const viewBox = compact ? "0 0 760 120" : "0 0 760 340";

  return (
    <div
      className={`relative overflow-hidden border border-[color:var(--color-line)] bg-gradient-to-br from-[#0b0d12] via-[#090b0f] to-[#07080b] ${
        compact ? "h-[120px] rounded-xl" : "min-h-[340px] rounded-b-2xl"
      }`}
    >
      {!compact && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_82%,rgba(150,165,190,0.08)_0%,transparent_55%)]" />
      )}

      <svg
        viewBox={viewBox}
        className="h-full w-full"
        role="img"
        aria-label={
          flightId
            ? `Mission profile map for ${flightId}`
            : "Mission profile map"
        }
      >
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#12151c" />
            <stop offset="100%" stopColor="#08090c" />
          </linearGradient>
          <linearGradient id="landGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#20252f" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#12151c" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {!compact && (
          <>
            <rect x="0" y="0" width="760" height="340" fill="url(#oceanGrad)" />
            <path
              d="M 0 300 Q 100 280 180 290 L 180 340 L 0 340 Z"
              fill="url(#landGrad)"
              opacity="0.8"
            />
            <text x="40" y="310" fill="#626b7c" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.5">
              Texas Gulf Coast
            </text>
            <text x="620" y="300" fill="#626b7c" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="0.5">
              Indian Ocean
            </text>
            <ellipse
              cx="200"
              cy="295"
              rx="55"
              ry="18"
              fill="none"
              stroke="#2b323f"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.7"
            />
            <text x="168" y="318" fill="#626b7c" fontSize="8" fontFamily="var(--font-mono)">
              Booster zone
            </text>
          </>
        )}

        <PathSegment
          d={ASCENT_PATH}
          active={!upcoming && furthest >= 1}
          color={getSegmentColor(stages, ["liftoff", "maxQ"], upcoming)}
          compact={compact}
          delay={0}
        />
        <PathSegment
          d={`M 160 200 L 260 120`}
          active={!upcoming && furthest >= 2}
          color={getSegmentColor(stages, ["maxQ", "stageSeparation"], upcoming)}
          compact={compact}
          delay={0.3}
        />
        <PathSegment
          d={BOOSTER_PATH}
          active={!upcoming && furthest >= 3}
          color={getSegmentColor(stages, ["stageSeparation", "boosterLanding"], upcoming)}
          compact={compact}
          delay={0.6}
          dashed
        />
        <PathSegment
          d={SHIP_PATH}
          active={!upcoming && furthest >= 4}
          color={getSegmentColor(
            stages,
            ["stageSeparation", "shipReentry", "splashdown"],
            upcoming,
          )}
          compact={compact}
          delay={0.9}
        />

        {MAP_NODES.map((node, index) => {
          const status = stages[node.key];
          const reached = !upcoming && status !== "not-attempted";
          const isFailure = status === "failure" || status === "partial";
          const scale = compact ? 0.55 : 1;
          const cx = compact ? node.x * 0.95 : node.x;
          const cy = compact
            ? 60 + (node.y - 120) * 0.35
            : node.y;

          return (
            <g key={node.key} transform={`translate(${cx}, ${cy})`}>
              {reached && (
                <circle
                  r={14 * scale}
                  fill={stageGlowColor(status, upcoming)}
                  className={isFailure ? "animate-pulse" : "animate-ping-slow"}
                  opacity="0.5"
                />
              )}
              <circle
                r={8 * scale}
                fill={reached ? stageStrokeColor(status, upcoming) : "#11141b"}
                stroke={reached ? "#fff" : "#2b323f"}
                strokeWidth={reached ? 1.5 : 1}
                filter={reached ? "url(#glow)" : undefined}
                className="transition-all duration-500"
              />
              {!compact && (
                <>
                  <text
                    y={22}
                    textAnchor="middle"
                    fill={reached ? "#eceef4" : "#626b7c"}
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.4"
                    fontWeight={reached ? "600" : "400"}
                  >
                    {node.label}
                  </text>
                  {reached && (
                    <text
                      y={34}
                      textAnchor="middle"
                      fill={stageStrokeColor(status, upcoming)}
                      fontSize="8"
                      fontFamily="var(--font-mono)"
                    >
                      {stageStatusLabel(status)}
                    </text>
                  )}
                </>
              )}
              {compact && reached && index === furthest && (
                <circle r={4 * scale} fill="#fff" className="animate-pulse" />
              )}
            </g>
          );
        })}

        {!upcoming && furthest >= 0 && (
          <RocketMarker
            stages={stages}
            furthest={furthest}
            compact={compact}
          />
        )}
      </svg>

      {!compact && !upcoming && (
        <div className="absolute bottom-3 left-3 flex gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-faint)]">
          <LegendDot color="#34d399" label="Success" />
          <LegendDot color="#fbbf24" label="Partial" />
          <LegendDot color="#f2564d" label="Failure" />
          <LegendDot color="#3a4252" label="Not reached" />
        </div>
      )}
    </div>
  );
}

function getSegmentColor(
  stages: FlightStages,
  keys: (keyof FlightStages)[],
  upcoming?: boolean,
): string {
  if (upcoming) return "#2b323f";
  const statuses = keys.map((k) => stages[k]).filter((s) => s !== "not-attempted");
  if (statuses.length === 0) return "#2b323f";
  const worst = statuses.includes("failure")
    ? "failure"
    : statuses.includes("partial")
      ? "partial"
      : "success";
  return stageStrokeColor(worst, upcoming);
}

function PathSegment({
  d,
  active,
  color,
  compact,
  delay,
  dashed,
}: {
  d: string;
  active: boolean;
  color: string;
  compact: boolean;
  delay: number;
  dashed?: boolean;
}) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="#1c212b"
        strokeWidth={compact ? 2 : 3}
        strokeLinecap="round"
        opacity={0.6}
      />
      <path
        d={d}
        fill="none"
        stroke={active ? color : "#2b323f"}
        strokeWidth={compact ? 2 : 3}
        strokeLinecap="round"
        strokeDasharray={dashed ? "8 6" : undefined}
        pathLength={1}
        strokeDashoffset={active ? 0 : 1}
        className="mission-path"
        style={{
          animationDelay: `${delay}s`,
          opacity: active ? 1 : 0.3,
        }}
      />
    </>
  );
}

function RocketMarker({
  stages,
  furthest,
  compact,
}: {
  stages: FlightStages;
  furthest: number;
  compact: boolean;
}) {
  const node = MAP_NODES[furthest];
  const status = stages[node.key];
  const scale = compact ? 0.5 : 1;
  const cx = compact ? node.x * 0.95 : node.x;
  const cy = compact ? 60 + (node.y - 120) * 0.35 : node.y;

  return (
    <g
      transform={`translate(${cx}, ${cy - 18 * scale})`}
      className="animate-rocket-float"
    >
      <path
        d={`M 0 ${-10 * scale} L ${4 * scale} ${2 * scale} L 0 0 L ${-4 * scale} ${2 * scale} Z`}
        fill={stageStrokeColor(status)}
        stroke="#fff"
        strokeWidth="0.5"
      />
      <ellipse
        cx="0"
        cy={4 * scale}
        rx={3 * scale}
        ry={5 * scale}
        fill="#f97316"
        opacity="0.8"
        className="animate-flame"
      />
    </g>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
