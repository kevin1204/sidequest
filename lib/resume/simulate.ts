/* ============================================================
   SideQuest — Simulated résumé extractor (Phase 2).
   Returns canned ResumeExtraction objects so the upload → review →
   prefill flow is fully demoable with NO API key, NO latency cost.

   Every `skill` is a canonical SKILL_LIBRARY value (a real Claude call
   in Phase 3 enforces this with an enum; here the fixtures simply only
   use taxonomy values). Swap simulateResumeExtraction() for a fetch to
   /api/parse-resume later — same ResumeExtraction return shape.
   ============================================================ */

import type { ResumeExtraction } from "../types";

/** A few realistic London-student résumés. The first leads with a hospitality
    background whose experience hides a lot of transferable skills — the strongest
    demo of the feature. */
const FIXTURES: ResumeExtraction[] = [
  {
    profile: {
      name: "Sam Rivera",
      school: "Fanshawe College",
      program: "Business Administration – Fanshawe",
      field: "Business / Marketing",
      year: "Year 2",
      availability: "20 hrs/week",
      availabilityHours: 20,
      hoursRequired: 400,
    },
    explicitSkills: [
      { skill: "Customer Service", kind: "explicit", confidence: "high", evidence: "Barista at Locomotive Espresso, 2 yrs" },
      { skill: "POS Systems", kind: "explicit", confidence: "high", evidence: "Operated Square POS daily" },
      { skill: "Social Media", kind: "explicit", confidence: "medium", evidence: "Ran the café's Instagram" },
    ],
    transferableSkills: [
      { skill: "Teamwork", kind: "transferable", confidence: "high", evidence: "Coordinated shifts with a team of 8" },
      { skill: "Communication", kind: "transferable", confidence: "high", evidence: "Trained 3 new hires" },
      { skill: "Event Planning", kind: "transferable", confidence: "medium", evidence: "Organized weekly latte-art nights" },
      { skill: "Inventory", kind: "transferable", confidence: "medium", evidence: "Tracked stock and placed supplier orders" },
    ],
    certifications: ["Smart Serve Ontario", "First Aid / CPR"],
    notes: "Hospitality background with strong front-of-house transferable skills.",
  },
  {
    profile: {
      name: "Devon Clarke",
      school: "Fanshawe College",
      program: "Graphic Design – Fanshawe",
      field: "Design",
      year: "Year 2",
      availability: "20 hrs/week",
      availabilityHours: 20,
      hoursRequired: 400,
    },
    explicitSkills: [
      { skill: "Canva", kind: "explicit", confidence: "high", evidence: "Built social templates for a student club" },
      { skill: "Adobe Illustrator", kind: "explicit", confidence: "high", evidence: "Coursework portfolio in Illustrator" },
      { skill: "Brand Design", kind: "explicit", confidence: "medium", evidence: "Designed a logo for a local bake sale" },
    ],
    transferableSkills: [
      { skill: "Content Writing", kind: "transferable", confidence: "medium", evidence: "Wrote captions for club posts" },
      { skill: "Photography", kind: "transferable", confidence: "medium", evidence: "Shot event photos for the design society" },
      { skill: "Teamwork", kind: "transferable", confidence: "high", evidence: "Group studio projects each term" },
    ],
    certifications: ["Adobe Certified"],
    notes: "Design student; writing and photography surfaced from extracurriculars.",
  },
  {
    profile: {
      name: "Priya Nair",
      school: "Western University",
      program: "Media & Communications – Western",
      field: "Communications / Media",
      year: "Year 3",
      availability: "15 hrs/week",
      availabilityHours: 15,
      hoursRequired: 300,
    },
    explicitSkills: [
      { skill: "Content Writing", kind: "explicit", confidence: "high", evidence: "Staff writer, campus newspaper" },
      { skill: "Social Media", kind: "explicit", confidence: "high", evidence: "Grew a club account to 4k followers" },
      { skill: "Communication", kind: "explicit", confidence: "high", evidence: "Hosted a weekly campus podcast" },
    ],
    transferableSkills: [
      { skill: "Analytics", kind: "transferable", confidence: "medium", evidence: "Reported on post reach and engagement" },
      { skill: "Event Planning", kind: "transferable", confidence: "medium", evidence: "Coordinated two campus mixers" },
      { skill: "Outreach", kind: "transferable", confidence: "high", evidence: "Recruited interviewees and sponsors" },
    ],
    certifications: ["Google Analytics"],
    notes: "Media student with measurement and outreach experience beyond writing.",
  },
];

/** Deterministic pick by file name so different uploads show different results,
    without Math.random (keeps the demo reproducible). */
function pickIndex(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 9973;
  return h % FIXTURES.length;
}

export interface ResumeInput {
  fileName: string;
}

/** Phase 2: returns a canned extraction after a short, realistic delay.
    Phase 3 replaces the body with `fetch("/api/parse-resume", …)`. */
export function simulateResumeExtraction({ fileName }: ResumeInput): Promise<ResumeExtraction> {
  const extraction = FIXTURES[pickIndex(fileName || "resume.pdf")];
  return new Promise((resolve) => {
    setTimeout(() => resolve(extraction), 1400);
  });
}
