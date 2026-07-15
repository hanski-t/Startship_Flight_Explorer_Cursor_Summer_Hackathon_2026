import type { Outcome } from "../types/flight";
import { outcomeColor, outcomeLabel } from "../lib/stageColors";

interface OutcomeBadgeProps {
  outcome: Outcome;
}

export function OutcomeBadge({ outcome }: OutcomeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${outcomeColor(outcome)}`}
    >
      {outcomeLabel(outcome)}
    </span>
  );
}
