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
                className={`group relative flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--color-line)] ${
                  reached
                    ? stageStatusBgMuted(status)
                    : "bg-[color:var(--color-panel-2)]"
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
                      : "text-[color:var(--color-faint)]"
                  }
                />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-44 -translate-x-1/2 rounded-md border border-[color:var(--color-line-strong)] bg-[color:var(--color-panel-2)] px-2 py-1.5 text-[10px] leading-snug text-[color:var(--color-ink)] shadow-lg group-hover:block">
                  <span className="font-medium">{STAGE_LABELS[key]}</span>
                  <span className="mt-0.5 block text-[color:var(--color-mute)]">
                    {getStageGuide(key)?.description ?? stageStatusLabel(status)}
                  </span>
                </span>
              </div>
              {index < STAGE_KEYS.length - 1 && (
                <div
                  className={`h-0.5 w-2 transition-colors duration-500 ${
                    reached && !upcoming
                      ? stageStatusConnector(status)
                      : "bg-[color:var(--color-line)]"
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
        const bgMuted = upcoming
          ? "bg-[color:var(--color-panel)]"
          : stageStatusBgMuted(status);
        const textColor = upcoming
          ? "text-[color:var(--color-faint)]"
          : stageStatusTextColor(status);
        const isFailure = status === "failure" || status === "partial";
        const stageGuide = getStageGuide(key);

        return (
          <li
            key={key}
            className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-all duration-300 ${
              reached
                ? "border border-[color:var(--color-line)] bg-[color:var(--color-panel)]"
                : "opacity-45"
            } ${animated ? "animate-stage-slide-in" : ""}`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-[color:var(--color-line)] ${bgMuted}`}
              >
                <StageIcon
                  stage={key}
                  size={18}
                  className={
                    reached ? textColor : "text-[color:var(--color-faint)]"
                  }
                />
                {reached && (
                  <span
                    className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ${
                      upcoming
                        ? "bg-[color:var(--color-idle)]"
                        : stageStatusColor(status)
                    } ring-2 ring-[color:var(--color-panel-2)] ${
                      isFailure ? "animate-pulse" : ""
                    }`}
                  />
                )}
              </div>
              <div>
                <span className="block text-sm font-medium text-[color:var(--color-ink)]">
                  {STAGE_LABELS[key]}
                </span>
                {stageGuide && (
                  <span className="mt-0.5 block text-xs leading-snug text-[color:var(--color-faint)]">
                    {stageGuide.description}
                  </span>
                )}
              </div>
            </div>
            <span className={`text-sm font-semibold ${textColor}`}>
              {upcoming ? "Pending" : reached ? stageStatusLabel(status) : "-"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
