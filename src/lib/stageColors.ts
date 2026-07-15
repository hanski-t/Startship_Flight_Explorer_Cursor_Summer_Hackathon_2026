import type { Outcome, StageStatus } from "../types/flight";

/* All status styling resolves to the four semantic tokens defined in
   index.css (--color-ok / --color-warn / --color-fail / --color-idle).
   Color on this page means one thing only: flight-status data. */

export function stageStatusBgMuted(status: StageStatus): string {
  switch (status) {
    case "success":
      return "bg-[color-mix(in_srgb,var(--color-ok)_16%,transparent)]";
    case "partial":
      return "bg-[color-mix(in_srgb,var(--color-warn)_16%,transparent)]";
    case "failure":
      return "bg-[color-mix(in_srgb,var(--color-fail)_16%,transparent)]";
    case "not-attempted":
      return "bg-[color:var(--color-panel-2)]";
  }
}

export function stageStatusConnector(status: StageStatus): string {
  switch (status) {
    case "success":
      return "bg-[color-mix(in_srgb,var(--color-ok)_55%,transparent)]";
    case "partial":
      return "bg-[color-mix(in_srgb,var(--color-warn)_55%,transparent)]";
    case "failure":
      return "bg-[color-mix(in_srgb,var(--color-fail)_55%,transparent)]";
    case "not-attempted":
      return "bg-[color:var(--color-line-strong)]";
  }
}

export function stageStatusColor(status: StageStatus): string {
  switch (status) {
    case "success":
      return "bg-[color:var(--color-ok)]";
    case "partial":
      return "bg-[color:var(--color-warn)]";
    case "failure":
      return "bg-[color:var(--color-fail)]";
    case "not-attempted":
      return "bg-[color:var(--color-idle)]";
  }
}

export function stageStatusTextColor(status: StageStatus): string {
  switch (status) {
    case "success":
      return "text-[color:var(--color-ok)]";
    case "partial":
      return "text-[color:var(--color-warn)]";
    case "failure":
      return "text-[color:var(--color-fail)]";
    case "not-attempted":
      return "text-[color:var(--color-faint)]";
  }
}

export function stageStatusLabel(status: StageStatus): string {
  switch (status) {
    case "success":
      return "Success";
    case "partial":
      return "Partial";
    case "failure":
      return "Failure";
    case "not-attempted":
      return "Not attempted";
  }
}

export function outcomeColor(outcome: Outcome): string {
  switch (outcome) {
    case "success":
      return "text-[color:var(--color-ok)] ring-[color-mix(in_srgb,var(--color-ok)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-ok)_12%,transparent)]";
    case "partial":
      return "text-[color:var(--color-warn)] ring-[color-mix(in_srgb,var(--color-warn)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-warn)_12%,transparent)]";
    case "failure":
      return "text-[color:var(--color-fail)] ring-[color-mix(in_srgb,var(--color-fail)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-fail)_12%,transparent)]";
  }
}

export function outcomeLabel(outcome: Outcome): string {
  switch (outcome) {
    case "success":
      return "Success";
    case "partial":
      return "Partial";
    case "failure":
      return "Failure";
  }
}

/* Vehicle generation is a category, not a status, so it is expressed
   with typographic weight and neutral ink rather than a hue. */
export function vehicleAccent(_vehicle: string): string {
  return "text-[color:var(--color-mute)] ring-[color:var(--color-line-strong)]";
}

export function blockLabel(flightNumber: number): string | null {
  if (flightNumber === 1) return "Block 1";
  if (flightNumber === 7) return "Block 2";
  if (flightNumber === 12) return "Block 3";
  return null;
}
