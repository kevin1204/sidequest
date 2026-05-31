# SideQuest — Profile links + Schedule-fit ("the killer feature")

**Status:** Plan / draft — not yet implemented.
**Goal:** (1) Add portfolio/website/LinkedIn + a short pitch to the student profile. (2) Add a weekly **availability schedule** — students block class time and mark when they can work; employers post the shifts they need; we compute a **Schedule fit** and surface it as a badge + filter on both sides. This operationalizes the validated insight: London employers offer **6–10 fragmented hours/week**, so *schedule overlap*, not skills, is the real make-or-break.

---

## 0. Safety principles (this is the most important section)

The user's #1 ask: **do not break anything.** Every change below follows these rules:

1. **Additive & optional.** All new `Student` / `Opportunity` fields are optional (`?`) with safe fallbacks. Existing seed data, onboarding, scoring, and pages keep working untouched if a field is absent.
2. **The score() formula is NOT changed.** We just fixed the 80%→100% ceiling — we will not touch `lib/scoring.ts` weights. Schedule-fit is a **badge + filter + tie-breaker only**, computed in a *separate* selector.
3. **Graceful "unknown".** If a student has no availability set, or an opportunity has no shifts set, `scheduleFit` returns **`null` (unknown)** — we show nothing, never a misleading 0%. So existing seed roles (no shifts) simply don't show a fit badge.
4. **New component, no surgery.** The weekly grid is a new self-contained component; on existing cards we only *insert* a badge, never restructure them.
5. **Verify after each phase** with `tsc --noEmit`, `next build`, and `eslint` (the workflow we've used throughout).

---

## 1. Profile additions

Add to the student profile (`student/profile/page.tsx`) — all optional, shown only when present:

- **Links:** Portfolio, Website, LinkedIn (one card row, each an external link with an icon).
- **One-line pitch / bio:** short free-text headline.
- **Work preference:** In-person / Hybrid / Remote (chip select).
- **Résumé on file:** surface the parsed résumé (ties into the existing résumé-parse feature) with a "re-scan" affordance. *(Display-only for now; wiring to the parser is a follow-up.)*

These feed **profile strength** (see §6) and give employers more signal on the candidate detail page.

---

## 2. Schedule feature

### 2.1 Model (coarse weekly grid — low friction, demoable)

A week = **7 days × 3 blocks** (Morning / Afternoon / Evening) = 21 cells. Coarse on purpose; an hour-by-hour calendar is a v2.

- **Student** marks each cell as one of: `class` (hard-blocked), `available` (will work), or *unset* (won't work / not offered).
- **Employer** marks the cells where they **need** someone (`needed`).

### 2.2 The flow (answers the A-vs-B question)

1. Student **blocks class time** → those cells are locked.
2. Student **marks availability** in the remaining free cells (opt-in — they won't work every free hour).
3. Employer posts **shifts needed** on the same grid.
4. We compute **Schedule fit** = `coveredNeededCells / totalNeededCells`.
5. **Employers see availability + fit %, never the raw personal calendar** (privacy: no "dentist Wednesday", just "available / not").

### 2.3 Schedule-fit selector (new, isolated)

`scheduleFit(student, opportunity) → { fit: number, covered: number, needed: number, label } | null`

- Returns `null` when either side has no schedule (→ render nothing).
- `fit = covered / needed`; `label` examples: *"Free for all 3 shifts they need"*, *"Covers 2 of 3 shifts"*, *"Schedule fit 67%"*.
- Pure function in `lib/schedule.ts` (kept out of `lib/scoring.ts`).

### 2.4 Where it surfaces (badge + filter + tie-breaker only)

- **Student matches:** a new refinement chip **"Fits my schedule"**, and a small badge on cards (*"✓ Free for all their shifts"* / *"Covers 2 of 3"*). Only shown when fit is known.
- **Employer candidates:** the same fit badge on each candidate card + an availability strip on the candidate detail page.
- **Sorting:** keep primary sort by match score; schedule-fit may break ties (optional). **Not** added to `score()`.

---

## 3. Data model changes (`lib/types.ts`) — all optional

```ts
// Weekly availability grid
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type BlockKey = "morning" | "afternoon" | "evening";
export type StudentSlot = "class" | "available";       // unset = not available
export type EmployerSlot = "needed";

export type AvailabilityGrid = Partial<Record<DayKey, Partial<Record<BlockKey, StudentSlot>>>>;
export type ShiftGrid = Partial<Record<DayKey, Partial<Record<BlockKey, EmployerSlot>>>>;

export interface StudentLinks {
  portfolio?: string;
  website?: string;
  linkedin?: string;
}

// Student — ADD (all optional):
//   links?: StudentLinks;
//   bio?: string;
//   workPreference?: "in-person" | "hybrid" | "remote";
//   schedule?: AvailabilityGrid;

// Opportunity — ADD (optional):
//   shifts?: ShiftGrid;
```

Because every new field is optional, **no existing seed object, reducer action, or page breaks.** `UPDATE_STUDENT` already takes `Partial<Student>`, so saving links / schedule needs **no new action**. `ADD_POSTING` gets an optional `shifts` pass-through.

---

## 4. File-by-file change map

| File | Change | Risk |
|---|---|---|
| `lib/types.ts` | Add optional `links`, `bio`, `workPreference`, `schedule` to `Student`; `shifts` to `Opportunity`; grid types. | none (additive) |
| `lib/schedule.ts` *(new)* | `scheduleFit()` + grid helpers (count needed, count covered, default empty grid, labels). | none (new file) |
| `components/WeekGrid.tsx` *(new)* | Reusable grid: `mode="student" \| "employer" \| "readonly"`, `value`, `onChange`. Tap to toggle. Responsive. | none (new file) |
| `lib/store/selectors.ts` | Add `scheduleFitFor(state, student, opp)` wrapper; add `scheduleFit` to `MatchVM`/`CandidateVM` builders (optional field, `null` when unknown). | low (additive fields) |
| `lib/types.ts` (VMs) | Add `scheduleFit?: ScheduleFit \| null` to `MatchVM` & `CandidateVM`. | none |
| `app/(student)/student/profile/page.tsx` | Add Links card, bio, work-preference, and the WeekGrid (edit). | low (new sections) |
| `app/(employer)/employer/post/page.tsx` | Add optional "Shifts needed" WeekGrid; pass `shifts` to `addPosting`. | low |
| `lib/store/reducer.ts` | `ADD_POSTING`: thread optional `shifts` onto the new opportunity. | low |
| `app/(student)/student/matches/page.tsx` | Add "Fits my schedule" filter chip + fit badge on cards. | low (insert only) |
| `app/(employer)/employer/candidates/page.tsx` + `candidate/[id]` | Fit badge + availability strip. | low (insert only) |
| `lib/seed.ts` | Give students a `schedule`, give 2–3 opportunities `shifts`, so the demo shows fit. Optional `links`/`bio` on Maya. | low (data only) |
| `app/globals.css` | Styles for `.weekgrid`, fit badge, links row. Mobile-first. | none |

---

## 5. Seed updates (for the demo)

- **Maya:** class blocks Mon/Wed/Fri mornings; available Tue/Thu afternoons + Mon/Wed afternoons; add `links.portfolio`, a one-line `bio`.
- Give **Forest City Media's "Brand & Social Lead"** (`o_bsl`) shifts = Tue/Thu afternoons → Maya is **"Free for all their shifts"** → reinforces her 95% match with a schedule-fit badge. 🔥 the demo money-shot.
- Give 1–2 other roles partial-overlap shifts so we also show *"Covers 2 of 3 shifts."*
- Leave most seed roles **without** `shifts` → they correctly show **no** fit badge (proves the graceful-unknown path).

---

## 6. Profile strength (optional polish)

Add a small `computeProfileStrength(student)` helper so adding links / bio / schedule visibly nudges the meter (e.g. +links 8, +bio 6, +schedule 10). Keep it derived and optional; if we skip it, the static seed value still renders fine.

---

## 7. Build phases (verify between each)

| Phase | Scope | Demoable result |
|---|---|---|
| **1 — Model + selector** | types, `lib/schedule.ts`, VM fields, seed schedules/shifts | `scheduleFit` computes; nothing visible yet but safe. |
| **2 — WeekGrid + profile** | `WeekGrid` component, profile links/bio/work-pref + grid edit | Students can set availability; links show. |
| **3 — Employer post + fit badges** | "Shifts needed" on post form; fit badge + "Fits my schedule" filter on matches & candidates | The full loop: schedule → fit → badge. The killer-feature demo. |

---

## 8. What we will NOT touch (guardrails)

- ❌ `score()` weights / the matching formula (protect the 100% ceiling fix).
- ❌ The hours/certificate logic, placements, reducer actions' existing behavior.
- ❌ Existing card layouts beyond inserting a badge.
- ❌ The marketing pages / landing (separate workstream).
- Anything schedule-related degrades to "unknown" when data is missing.

---

## 9. Open knobs

- **Granularity:** 3 blocks/day (chosen) vs hourly (v2). Start coarse.
- **Days shown:** all 7, or Mon–Fri + a "weekends" toggle. Default: 7, compact.
- **Schedule-fit as a real score dimension:** deliberately deferred — ship as badge/filter first, observe, then consider weighting (with a fresh ceiling check).
- **Employer privacy view:** show availability grid vs only the fit % — default to a *masked availability grid* (available/not), never reasons.
```
