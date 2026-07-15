import type { FlightStages } from "../types/flight";
import { STAGE_KEYS, STAGE_LABELS } from "../types/flight";
import {
  stageStatusBgMuted,
  stageStatusColor,
  stageStatusConnector,
  stageStatusLabel,
  stageStatusTextColor,
} from "../lib/stageColors";
import { StageIcon } from "../lib/stageIcons";
import { isStageReached } from "../lib/missionProgress";
import { getStageGuide } from "../data/guideContent";

interface StageTrackerProps {
  stages: FlightStages;
  compact?: boolean;
  upcoming?: boolean;
  animated?: boolean;
}

export function StageTracker({
  stages,
  compact = false,
  upcoming = false,
  animated = false,
}: StageTrackerProps) {
  if (compact) {
    return (
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label="Flight stage progression"
      >
        {STAGE_KEYS.map((key, index) => {
          const status = stages[key];
          const reached = !upcoming && isStageReached(status);

          return (
            <div key={key} className="flex items-center">
              <div
                className={`group relative flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 ${
                  reached ? stageStatusBgMuted(status) : "bg-slate-800/50"
                } ${reached && animated ? "animate-stage-pop" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                title={`${STAGE_LABELS[key]}: ${stageStatusLabel(status)}`}
              >
                <StageIcon
                  stage={key}
                  size={14}
                  className={
                    reached
                      ? stageStatusTextColor(status)
                      : "text-slate-600"
                  }
                />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-44 -translate-x-1/2 rounded bg-slate-900 px-2 py-1.5 text-[10px] leading-snug text-slate-200 shadow-lg group-hover:block">
                  <span className="font-medium">{STAGE_LABELS[key]}</span>
                  <span className="mt-0.5 block text-slate-400">
                    {getStageGuide(key)?.description ?? stageStatusLabel(status)}
                  </span>
                </span>
              </div>
              {index < STAGE_KEYS.length - 1 && (
                <div
                  className={`h-0.5 w-2 transition-colors duration-500 ${
                    reached && !upcoming
                      ? stageStatusConnector(status)
                      : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {STAGE_KEYS.map((key, index) => {
        const status = stages[key];
        const reached = !upcoming && isStageReached(status);
        const bgMuted = upcoming ? "bg-slate-800/50" : stageStatusBgMuted(status);
        const textColor = upcoming
          ? "text-slate-500"
          : stageStatusTextColor(status);
        const isFailure = status === "failure" || status === "partial";
        const stageGuide = getStageGuide(key);

        return (
          <li
            key={key}
            className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-all duration-300 ${
              reached
                ? "border border-white/5 bg-slate-800/40"
                : "opacity-50"
            } ${animated ? "animate-stage-slide-in" : ""}`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-white/10 ${bgMuted}`}
              >
                <StageIcon
                  stage={key}
                  size={18}
                  className={reached ? textColor : "text-slate-600"}
                />
                {reached && (
                  <span
                    className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ${upcoming ? "bg-slate-600" : stageStatusColor(status)} ring-2 ring-slate-900 ${
                      isFailure ? "animate-pulse" : ""
                    }`}
                  />
                )}
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-200">
                  {STAGE_LABELS[key]}
                </span>
                {stageGuide && (
                  <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                    {stageGuide.description}
                  </span>
                )}
              </div>
            </div>
            <span className={`text-sm font-semibold ${textColor}`}>
              {upcoming ? "Pending" : reached ? stageStatusLabel(status) : "—"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
