/* ============================================================
   SideQuest — The scoring function (BUILD_SPEC.md §F)
   ONE pure function, used on BOTH sides. The score describes
   the PAIRING (student × opportunity), so the student's matches
   and the employer's matched candidates come from the same call.

   London-only phase weights (see TRANSFERABLE_SKILLS_PLAN.md §1):
   claimed skills 0.40 · transferable skills 0.20 · field 0.20 · hours 0.20.
   A resume-inferred (transferable) skill is worth half a claimed one.
   Location & preferences are intentionally not scored yet.
   ============================================================ */

import type { Student, Opportunity, ScoreResult } from "./types";
import { fieldAffinity } from "./taxonomies";

export interface ScoreContext {
  /** the student's remaining co-op hours (hoursRequired − approved). */
  remainingHours?: number;
}

const WEIGHTS = {
  skills: 0.4,
  transferable: 0.2,
  field: 0.2,
  hours: 0.2,
};

/** TRANSFER_CREDIT, made explicit: a transferable skill is worth this fraction
    of a claimed one (0.20 / 0.40 = 0.5). Tune via the weights above. */

export function score(
  student: Student,
  opportunity: Opportunity,
  ctx: ScoreContext = {},
): ScoreResult {
  const required = opportunity.requiredSkills;

  // Claimed skills — full credit.
  const direct = required.filter((s) => student.skills.includes(s));
  // Transferable skills — resume-inferred, counted only for required skills the
  // student does NOT already claim (no double-counting).
  const transferableSet = new Set(student.transferableSkills ?? []);
  const transfer = required.filter((s) => !student.skills.includes(s) && transferableSet.has(s));

  const skills = required.length ? direct.length / required.length : 0;
  const transferable = required.length ? transfer.length / required.length : 0;

  // Field / program fit.
  const field = fieldAffinity(student.field, opportunity.field);

  // Availability / hours fit — partial = partial credit, NEVER a rejection.
  const remaining =
    ctx.remainingHours !== undefined && ctx.remainingHours > 0
      ? ctx.remainingHours
      : student.hoursRequired;
  const hours = Math.max(0, Math.min(1, opportunity.hoursOffered / remaining));

  const dimensions = { skills, transferable, field, hours };

  const total =
    skills * WEIGHTS.skills +
    transferable * WEIGHTS.transferable +
    field * WEIGHTS.field +
    hours * WEIGHTS.hours;

  return {
    score: Math.round(total * 100),
    reasons: buildReasons(opportunity, { direct, transfer, dimensions, remaining }),
    dimensions,
  };
}

function buildReasons(
  opportunity: Opportunity,
  {
    direct,
    transfer,
    dimensions,
    remaining,
  }: {
    direct: string[];
    transfer: string[];
    dimensions: ScoreResult["dimensions"];
    remaining: number;
  },
): string[] {
  const required = opportunity.requiredSkills;

  const skillsText =
    direct.length === required.length && required.length > 0
      ? `all ${required.length} skills`
      : `${direct.length} of ${required.length} skills`;

  const fieldText =
    dimensions.field === 1
      ? "in your field"
      : dimensions.field >= 0.6
        ? "adjacent field"
        : "new field for you";

  const parts: { text: string; weight: number }[] = [
    { text: skillsText, weight: dimensions.skills * WEIGHTS.skills },
    { text: fieldText, weight: dimensions.field * WEIGHTS.field },
  ];

  // Transferable skills — surface when the resume covers skills the student
  // didn't claim. This is the differentiator, so give it a slight nudge so it
  // shows even when its raw weight ties with hours.
  if (transfer.length > 0) {
    parts.push({
      text: `+${transfer.length} from experience`,
      weight: dimensions.transferable * WEIGHTS.transferable + 0.001,
    });
  }

  // Only surface an hours reason when it's a genuinely distinguishing signal —
  // i.e. the opportunity is "right-sized" for the remaining gap (not 5× too big).
  const rightSized = remaining > 0 && opportunity.hoursOffered <= remaining * 2;
  if (rightSized) {
    const hoursText =
      opportunity.hoursOffered >= remaining
        ? "covers your remaining hours"
        : `${opportunity.hoursOffered} hrs toward your goal`;
    parts.push({ text: hoursText, weight: dimensions.hours * WEIGHTS.hours });
  } else if (remaining === 0) {
    parts.push({
      text: `offers ${opportunity.hoursOffered} hrs`,
      weight: dimensions.hours * WEIGHTS.hours,
    });
  }

  return parts
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((p) => p.text);
}
