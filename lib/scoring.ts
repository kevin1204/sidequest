/* ============================================================
   SideQuest — The scoring function (BUILD_SPEC.md §F)
   ONE pure function, used on BOTH sides. The score describes
   the PAIRING (student × opportunity), so the student's matches
   and the employer's matched candidates come from the same call.

   London-only phase (see TRANSFERABLE_SKILLS_PLAN.md §1):
   skills 0.50 · field 0.25 · hours 0.25.

   Transferable skills are folded INTO the skills dimension at half
   credit (a resume-inferred skill is worth 0.5 of a claimed one), so:
   (a) the engine still rewards transferable skills, AND
   (b) a perfect direct match can still reach 100% — a separate
       transferable weight would have capped every score below it.
   The raw direct/transfer fractions are still reported separately for
   the "why you match" breakdown.
   ============================================================ */

import type { Student, Opportunity, ScoreResult } from "./types";
import { fieldAffinity } from "./taxonomies";

export interface ScoreContext {
  /** the student's remaining co-op hours (hoursRequired − approved). */
  remainingHours?: number;
}

const WEIGHTS = {
  skills: 0.5,
  field: 0.25,
  hours: 0.25,
};

/** A transferable (resume-inferred) skill counts as this fraction of a claimed one. */
const TRANSFER_CREDIT = 0.5;

export function score(
  student: Student,
  opportunity: Opportunity,
  ctx: ScoreContext = {},
): ScoreResult {
  const required = opportunity.requiredSkills;

  // Claimed skills — full credit.
  const direct = required.filter((s) => student.skills.includes(s));
  // Transferable skills — only for required skills NOT already claimed (no double count).
  const transferableSet = new Set(student.transferableSkills ?? []);
  const transfer = required.filter((s) => !student.skills.includes(s) && transferableSet.has(s));

  // Combined skills score (drives the total); raw fractions kept for display.
  const skillsRaw = required.length ? direct.length / required.length : 0;
  const transferableRaw = required.length ? transfer.length / required.length : 0;
  const skillsCombined = required.length
    ? Math.min(1, (direct.length + TRANSFER_CREDIT * transfer.length) / required.length)
    : 0;

  // Field / program fit.
  const field = fieldAffinity(student.field, opportunity.field);

  // Availability / hours fit — partial = partial credit, NEVER a rejection.
  const remaining =
    ctx.remainingHours !== undefined && ctx.remainingHours > 0
      ? ctx.remainingHours
      : student.hoursRequired;
  const hours = Math.max(0, Math.min(1, opportunity.hoursOffered / remaining));

  // Reported dimensions (raw, 0–1) for the detail-page breakdown.
  const dimensions = { skills: skillsRaw, transferable: transferableRaw, field, hours };

  const total = skillsCombined * WEIGHTS.skills + field * WEIGHTS.field + hours * WEIGHTS.hours;

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
  // didn't claim. This is the differentiator, so give it a slight nudge.
  if (transfer.length > 0) {
    parts.push({
      text: `+${transfer.length} from experience`,
      weight: dimensions.transferable * WEIGHTS.skills * TRANSFER_CREDIT + 0.06,
    });
  }

  // Only surface an hours reason when it's a genuinely distinguishing signal.
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
