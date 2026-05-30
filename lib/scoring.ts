/* ============================================================
   TalentTie — The scoring function (BUILD_SPEC.md §F)
   ONE pure function, used on BOTH sides. The score describes
   the PAIRING (student × opportunity), so the student's matches
   and the employer's matched candidates come from the same call.
   ============================================================ */

import type { Student, Opportunity, ScoreResult } from "./types";
import { fieldAffinity } from "./taxonomies";

export interface ScoreContext {
  /** the student's remaining co-op hours (hoursRequired − approved). */
  remainingHours?: number;
  /** skills the student has demonstrated interest in (e.g. from current placements). */
  interestSkills?: string[];
}

const WEIGHTS = {
  skills: 0.4,
  field: 0.2,
  hours: 0.15,
  location: 0.15,
  preferences: 0.1,
};

export function score(
  student: Student,
  opportunity: Opportunity,
  ctx: ScoreContext = {},
): ScoreResult {
  const required = opportunity.requiredSkills;
  const have = required.filter((s) => student.skills.includes(s));

  // Skills overlap — fraction of the opportunity's required skills the student has.
  const skills = required.length ? have.length / required.length : 0;

  // Field / program fit.
  const field = fieldAffinity(student.field, opportunity.field);

  // Availability / hours fit — partial = partial credit, NEVER a rejection.
  const remaining =
    ctx.remainingHours !== undefined && ctx.remainingHours > 0
      ? ctx.remainingHours
      : student.hoursRequired;
  const hours = Math.max(0, Math.min(1, opportunity.hoursOffered / remaining));

  // Location — London proximity. (All seed data is London; same neighbourhood is best.)
  const location = student.location === opportunity.location ? 1 : 0.85;

  // Preferences — interest overlap (skills the student gravitates toward).
  const interest = ctx.interestSkills?.length ? ctx.interestSkills : student.skills;
  const interestSet = new Set(interest);
  const prefOverlap = required.filter((s) => interestSet.has(s)).length;
  const preferences = required.length
    ? Math.min(1, 0.4 + 0.6 * (prefOverlap / required.length))
    : 0.6;

  const dimensions = { skills, field, hours, location, preferences };

  const total =
    skills * WEIGHTS.skills +
    field * WEIGHTS.field +
    hours * WEIGHTS.hours +
    location * WEIGHTS.location +
    preferences * WEIGHTS.preferences;

  return {
    score: Math.round(total * 100),
    reasons: buildReasons(student, opportunity, { have, dimensions, remaining }),
    dimensions,
  };
}

function buildReasons(
  student: Student,
  opportunity: Opportunity,
  {
    have,
    dimensions,
    remaining,
  }: { have: string[]; dimensions: ScoreResult["dimensions"]; remaining: number },
): string[] {
  const required = opportunity.requiredSkills;

  const skillsText =
    have.length === required.length && required.length > 0
      ? `all ${required.length} skills`
      : `${have.length} of ${required.length} skills`;

  const fieldText =
    dimensions.field === 1
      ? "in your field"
      : dimensions.field >= 0.6
        ? "adjacent field"
        : "new field for you";

  const locationText =
    student.location === opportunity.location ? `in ${opportunity.location}` : "in London";

  const parts: { text: string; weight: number }[] = [
    { text: skillsText, weight: dimensions.skills * WEIGHTS.skills },
    { text: fieldText, weight: dimensions.field * WEIGHTS.field },
    { text: locationText, weight: dimensions.location * WEIGHTS.location },
  ];

  // Only surface an hours reason when it's a genuinely distinguishing signal —
  // i.e. the opportunity is "right-sized" for the remaining gap (not 5× too big).
  // Otherwise it reads identically on every card and stops varying per pairing.
  const rightSized = remaining > 0 && opportunity.hoursOffered <= remaining * 2;
  if (rightSized) {
    const hoursText =
      opportunity.hoursOffered >= remaining
        ? "covers your remaining hours"
        : `${opportunity.hoursOffered} hrs toward your goal`;
    parts.push({ text: hoursText, weight: dimensions.hours * WEIGHTS.hours });
  } else if (remaining === 0) {
    parts.push({ text: `offers ${opportunity.hoursOffered} hrs`, weight: dimensions.hours * WEIGHTS.hours });
  }

  return parts
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((p) => p.text);
}
