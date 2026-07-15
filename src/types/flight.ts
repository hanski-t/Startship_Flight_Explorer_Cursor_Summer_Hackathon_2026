export type StageStatus = "success" | "partial" | "failure" | "not-attempted";
export type Outcome = "success" | "partial" | "failure";

export interface FlightStages {
  liftoff: StageStatus;
  maxQ: StageStatus;
  stageSeparation: StageStatus;
  boosterLanding: StageStatus;
  shipReentry: StageStatus;
  splashdown: StageStatus;
}

export type StageKey = keyof FlightStages;

export interface Flight {
  id: string;
  number: number;
  date: string;
  vehicle: string;
  outcome: Outcome;
  summary: string;
  stages: FlightStages;
  upcoming?: boolean;
}

export const STAGE_KEYS: StageKey[] = [
  "liftoff",
  "maxQ",
  "stageSeparation",
  "boosterLanding",
  "shipReentry",
  "splashdown",
];

export const STAGE_LABELS: Record<StageKey, string> = {
  liftoff: "Liftoff",
  maxQ: "Max-Q",
  stageSeparation: "Stage sep",
  boosterLanding: "Booster landing",
  shipReentry: "Ship reentry",
  splashdown: "Splashdown",
};
