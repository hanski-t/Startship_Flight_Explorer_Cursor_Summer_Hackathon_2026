import type { Flight, FlightStages, StageKey, StageStatus } from "../types/flight";
import { STAGE_KEYS } from "../types/flight";

export function isStageReached(status: StageStatus): boolean {
  return status !== "not-attempted";
}

export function getFurthestStageIndex(stages: FlightStages): number {
  let furthest = -1;
  STAGE_KEYS.forEach((key, index) => {
    if (isStageReached(stages[key])) {
      furthest = index;
    }
  });
  return furthest;
}

export function getFailureStageIndex(stages: FlightStages): number | null {
  const failureIndex = STAGE_KEYS.findIndex(
    (key) => stages[key] === "failure" || stages[key] === "partial",
  );
  return failureIndex >= 0 ? failureIndex : null;
}

export function getMissionProgress(stages: FlightStages, upcoming?: boolean): number {
  if (upcoming) return 0;
  const reached = STAGE_KEYS.filter((key) => isStageReached(stages[key])).length;
  return reached / STAGE_KEYS.length;
}

export function stageStrokeColor(status: StageStatus, upcoming?: boolean): string {
  if (upcoming) return "#3a4252";
  switch (status) {
    case "success":
      return "#34d399";
    case "partial":
      return "#fbbf24";
    case "failure":
      return "#f2564d";
    case "not-attempted":
      return "#2b323f";
  }
}

export function stageGlowColor(status: StageStatus, upcoming?: boolean): string {
  if (upcoming) return "rgba(58, 66, 82, 0.4)";
  switch (status) {
    case "success":
      return "rgba(52, 211, 153, 0.55)";
    case "partial":
      return "rgba(251, 191, 36, 0.55)";
    case "failure":
      return "rgba(242, 86, 77, 0.55)";
    case "not-attempted":
      return "rgba(43, 50, 63, 0.3)";
  }
}

export interface StageMapNode {
  key: StageKey;
  x: number;
  y: number;
  label: string;
}

export const MAP_NODES: StageMapNode[] = [
  { key: "liftoff", x: 80, y: 320, label: "Starbase" },
  { key: "maxQ", x: 160, y: 200, label: "Max-Q" },
  { key: "stageSeparation", x: 260, y: 120, label: "Hot staging" },
  { key: "boosterLanding", x: 200, y: 280, label: "Booster zone" },
  { key: "shipReentry", x: 520, y: 100, label: "Reentry" },
  { key: "splashdown", x: 680, y: 260, label: "Indian Ocean" },
];

export function countSuccessfulStages(flights: Flight[]): number {
  return flights.filter((f) => !f.upcoming && f.outcome === "success").length;
}
