import type { StageKey } from "../types/flight";

export interface BlockGuide {
  id: string;
  name: string;
  flights: string;
  accentClass: string;
  description: string;
}

export interface StageGuide {
  key: StageKey;
  label: string;
  description: string;
}

export interface OutcomeGuide {
  id: string;
  label: string;
  colorClass: string;
  description: string;
}

export const BLOCK_GUIDE: BlockGuide[] = [
  {
    id: "block-1",
    name: "Block 1",
    flights: "IFT-1 through IFT-6",
    accentClass: "text-sky-400 ring-sky-500/30 bg-sky-500/10",
    description:
      "The first Starship/Super Heavy hardware generation. These early flights focused on proving basic integrated ascent, hot-staging separation, reaching orbital velocity, and eventually recovering both stages with splashdowns — culminating in the first booster tower catch on IFT-5.",
  },
  {
    id: "block-2",
    name: "Block 2",
    flights: "IFT-7 through IFT-11",
    accentClass: "text-slate-300 ring-slate-400/30 bg-slate-400/10",
    description:
      "An upgraded ship design with lessons from Block 1 baked in. Block 2 introduced tougher reentry hardware and payload deployment tests, but also saw a stretch of ship failures during ascent before IFT-10 and IFT-11 turned the program around with back-to-back successes.",
  },
  {
    id: "block-3",
    name: "Block 3 (V3)",
    flights: "IFT-12 onward",
    accentClass: "text-orange-400 ring-orange-500/30 bg-orange-500/10",
    description:
      "A major redesign with Raptor 3 engines, a taller ship, and a new launch pad. Block 3 flights aim to push toward operational Starlink deployment and more reliable booster recovery — IFT-12 was the maiden V3 flight.",
  },
];

export const STAGE_GUIDE: StageGuide[] = [
  {
    key: "liftoff",
    label: "Liftoff",
    description:
      "Both Super Heavy booster and Starship ship lift off together from Starbase, Texas. All 33 booster engines (and ship engines as needed) ignite and the stack clears the pad.",
  },
  {
    key: "maxQ",
    label: "Max-Q",
    description:
      "Maximum dynamic pressure — the point of greatest aerodynamic stress during ascent. The vehicle must hold structural integrity while throttling engines to limit loads.",
  },
  {
    key: "stageSeparation",
    label: "Stage separation",
    description:
      "Hot staging: Starship ignites its engines while still attached, then separates from the booster mid-flight. This is the handoff from booster-dominated ascent to ship-dominated flight.",
  },
  {
    key: "boosterLanding",
    label: "Booster landing",
    description:
      "Super Heavy performs a boostback burn and either splashes down in the Gulf of Mexico or is caught by the launch tower's \"Mechazilla\" arms. A key reusability milestone.",
  },
  {
    key: "shipReentry",
    label: "Ship reentry",
    description:
      "Starship re-enters the atmosphere after coasting in space. Heat shield tiles and flap control must survive hypersonic entry — where several early flights were lost.",
  },
  {
    key: "splashdown",
    label: "Splashdown",
    description:
      "Starship performs a controlled landing burn and splashes down in a target zone (typically the Indian Ocean). A full success means intact recovery of the ship.",
  },
];

export const OUTCOME_GUIDE: OutcomeGuide[] = [
  {
    id: "success",
    label: "Success",
    colorClass: "bg-emerald-500",
    description: "The stage fully met its objective.",
  },
  {
    id: "partial",
    label: "Partial",
    colorClass: "bg-amber-500",
    description:
      "The stage was reached but did not fully meet its goal (e.g. hard splashdown instead of a controlled catch).",
  },
  {
    id: "failure",
    label: "Failure",
    colorClass: "bg-red-500",
    description:
      "The vehicle was lost or destroyed at or before this stage.",
  },
  {
    id: "not-attempted",
    label: "Not attempted",
    colorClass: "bg-slate-600",
    description:
      "The flight never reached this stage — usually because an earlier failure ended the mission.",
  },
];

export function getBlockGuideForVehicle(vehicle: string): BlockGuide | undefined {
  if (vehicle.startsWith("Block 1")) return BLOCK_GUIDE[0];
  if (vehicle.startsWith("Block 2")) return BLOCK_GUIDE[1];
  if (vehicle.startsWith("Block 3")) return BLOCK_GUIDE[2];
  return undefined;
}

export function getStageGuide(key: StageKey): StageGuide | undefined {
  return STAGE_GUIDE.find((s) => s.key === key);
}
