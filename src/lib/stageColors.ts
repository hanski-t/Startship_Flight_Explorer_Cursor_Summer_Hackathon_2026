import type { Outcome, StageStatus } from "../types/flight";

export function stageStatusBgMuted(status: StageStatus): string {
  switch (status) {
    case "success":
      return "bg-emerald-500/20";
    case "partial":
      return "bg-amber-500/20";
    case "failure":
      return "bg-red-500/20";
    case "not-attempted":
      return "bg-slate-800/50";
  }
}

export function stageStatusConnector(status: StageStatus): string {
  switch (status) {
    case "success":
      return "bg-emerald-500/60";
    case "partial":
      return "bg-amber-500/60";
    case "failure":
      return "bg-red-500/60";
    case "not-attempted":
      return "bg-slate-700";
  }
}

export function stageStatusColor(status: StageStatus): string {
  switch (status) {
    case "success":
      return "bg-emerald-500";
    case "partial":
      return "bg-amber-500";
    case "failure":
      return "bg-red-500";
    case "not-attempted":
      return "bg-slate-600";
  }
}

export function stageStatusTextColor(status: StageStatus): string {
  switch (status) {
    case "success":
      return "text-emerald-400";
    case "partial":
      return "text-amber-400";
    case "failure":
      return "text-red-400";
    case "not-attempted":
      return "text-slate-500";
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
      return "bg-emerald-500/20 text-emerald-300 ring-emerald-500/40";
    case "partial":
      return "bg-amber-500/20 text-amber-300 ring-amber-500/40";
    case "failure":
      return "bg-red-500/20 text-red-300 ring-red-500/40";
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

export function vehicleAccent(vehicle: string): string {
  if (vehicle.startsWith("Block 1")) {
    return "text-sky-400 ring-sky-500/30";
  }
  if (vehicle.startsWith("Block 2")) {
    return "text-slate-300 ring-slate-400/30";
  }
  return "text-orange-400 ring-orange-500/30";
}

export function blockLabel(flightNumber: number): string | null {
  if (flightNumber === 1) return "Block 1";
  if (flightNumber === 7) return "Block 2";
  if (flightNumber === 12) return "Block 3";
  return null;
}
