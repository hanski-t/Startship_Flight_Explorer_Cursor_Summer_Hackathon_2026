import type { Outcome } from "../types/flight";
import { outcomeColor, outcomeLabel } from "../lib/stageColors";

interface OutcomeBadgeProps {
  outcome: Outcome;
}

export function OutcomeBadge({ outcome }: OutcomeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ring-1 ring-inset ${outcomeColor(outcome)}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {outcomeLabel(outcome)}
    </span>
  );
}
