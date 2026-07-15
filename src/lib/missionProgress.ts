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
  if (upcoming) return "#475569";
  switch (status) {
    case "success":
      return "#10b981";
    case "partial":
      return "#f59e0b";
    case "failure":
      return "#ef4444";
    case "not-attempted":
      return "#334155";
  }
}

export function stageGlowColor(status: StageStatus, upcoming?: boolean): string {
  if (upcoming) return "rgba(71, 85, 105, 0.4)";
  switch (status) {
    case "success":
      return "rgba(16, 185, 129, 0.6)";
    case "partial":
      return "rgba(245, 158, 11, 0.6)";
    case "failure":
      return "rgba(239, 68, 68, 0.6)";
    case "not-attempted":
      return "rgba(51, 65, 85, 0.3)";
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
