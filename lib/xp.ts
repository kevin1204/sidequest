/* ============================================================
   SideQuest — XP / level model (gamification).
   Single source of truth: 1 approved co-op hour = 10 XP.
   Used by the Hours panel, the profile, and the matches hero.
   ============================================================ */

export const XP_PER_HOUR = 10;

export const XP_LEVELS: { xp: number; title: string }[] = [
  { xp: 0, title: "Novice" },
  { xp: 500, title: "Apprentice" },
  { xp: 1500, title: "Explorer" },
  { xp: 2500, title: "Specialist" },
  { xp: 3500, title: "Pro" },
  { xp: 5000, title: "Legend" },
];

export function xpFromHours(approvedHours: number): number {
  return approvedHours * XP_PER_HOUR;
}

export interface LevelInfo {
  xp: number;
  level: number; // 1-based
  title: string;
  next: { xp: number; title: string } | undefined;
  toNext: number; // XP remaining to next level (0 at max)
  pct: number; // progress through the current level, 0–100
}

export function levelInfo(approvedHours: number): LevelInfo {
  const xp = xpFromHours(approvedHours);
  let i = 0;
  for (let k = 0; k < XP_LEVELS.length; k++) if (xp >= XP_LEVELS[k].xp) i = k;
  const cur = XP_LEVELS[i];
  const next = XP_LEVELS[i + 1];
  const pct = next ? Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100) : 100;
  return { xp, level: i + 1, title: cur.title, next, toNext: next ? next.xp - xp : 0, pct };
}

/** Deterministic thousands separator (locale-independent → SSR-safe). */
export const fmtXp = (n: number): string => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
