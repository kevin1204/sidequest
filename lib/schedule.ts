/* ============================================================
   SideQuest — Weekly availability helpers (optional feature).
   Hourly slots (8am–8pm). Pure constants + tiny helpers.
   ============================================================ */

import type { AvailabilityGrid, DayKey, StudentSlot } from "./types";

export const DAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export const HOUR_START = 8; // 8 AM
export const HOUR_END = 21; // up to 9 PM (last selectable slot starts at 8 PM)

/** One selectable slot per clock hour, e.g. { key: "13", label: "1p" }. */
export const HOURS: { key: string; label: string }[] = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, i) => {
    const h = HOUR_START + i;
    const period = h < 12 ? "a" : "p";
    const display = h % 12 === 0 ? 12 : h % 12;
    return { key: String(h), label: `${display}${period}` };
  },
);

/** True when no availability has been set yet. */
export function scheduleIsEmpty(g?: AvailabilityGrid): boolean {
  if (!g) return true;
  return !Object.values(g).some((day) => day && Object.keys(day).length > 0);
}

/** Total clock-hours per week marked available (one hour per set slot). */
export function totalAvailableHours(g?: AvailabilityGrid): number {
  if (!g) return 0;
  let hrs = 0;
  for (const day of Object.values(g)) {
    for (const slot of Object.values(day ?? {})) if (slot === "available") hrs++;
  }
  return hrs;
}

/** Hours-per-week summary line, e.g. "13 hrs/week available". */
export function availableHoursLabel(g?: AvailabilityGrid): string {
  const hrs = totalAvailableHours(g);
  return hrs === 0 ? "Not set" : `${hrs} hrs/week available`;
}

/** Build a day's slots over an hour range [start, end) — handy for seed data. */
export function hourRange(start: number, end: number, slot: StudentSlot = "available"): Record<string, StudentSlot> {
  const out: Record<string, StudentSlot> = {};
  for (let h = start; h < end; h++) out[String(h)] = slot;
  return out;
}
