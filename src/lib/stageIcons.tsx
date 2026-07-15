import {
  Anchor,
  Flame,
  Gauge,
  Layers,
  Rocket,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { StageKey } from "../types/flight";

export const STAGE_ICONS: Record<StageKey, LucideIcon> = {
  liftoff: Rocket,
  maxQ: Gauge,
  stageSeparation: Layers,
  boosterLanding: Anchor,
  shipReentry: Flame,
  splashdown: Waves,
};

interface StageIconProps {
  stage: StageKey;
  className?: string;
  size?: number;
}

export function StageIcon({ stage, className, size = 16 }: StageIconProps) {
  const Icon = STAGE_ICONS[stage];
  return <Icon className={className} size={size} aria-hidden />;
}
