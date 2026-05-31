# TalentTie — Resume Parsing + Transferable Skills

**Status:** Implemented — Phases 1, 2 & 4 are live. Phase 3 (real Claude route) is deferred (needs the Anthropic SDK + an API key); the simulated extractor in `lib/resume/simulate.ts` is the drop-in seam for it.
**Goal:** Let a student optionally upload a resume during onboarding. AI parses it, extracts **transferable skills** (skills implied by their experience, not just the ones they list), pre-fills their whole profile, and feeds transferable skills into the match-score formula as a real, weighted factor.

---

## 0. Guiding principles

1. **It's a mapping problem, not a generation problem.** Matching uses a *fixed* skill taxonomy with exact-string matching (`student.skills.includes(s)`). The AI must map messy resume language onto our canonical taxonomy and never invent a skill outside it — otherwise matches silently break.
2. **Pre-fill, don't replace.** The resume is a fast-path that pre-fills the existing 5-step wizard. Skipping it leaves today's manual flow untouched.
3. **Derive, don't store.** Everything visible (scores, reasons, totals) is derived in `selectors.ts`. Writing new skills to a student auto-recomputes every match.
4. **Confirm before it counts.** AI-inferred skills are shown with evidence and only enter the engine after the student confirms them.
5. **Responsive by default.** Every new screen and section works from 360px mobile up to desktop (see §6).

---

## 1. The match-score formula

### 1.1 Current formula (`lib/scoring.ts`)

```
score = round( (skills × 0.40)
             + (field × 0.20)
             + (hours × 0.15)
             + (location × 0.15)
             + (preferences × 0.10) × 100 )
```

Each dimension is in `[0, 1]`. `skills = (required ∩ student.skills) / required`. There is **no** transferable-skills concept today.

### 1.2 New formula (London-only phase)

| Factor | Weight | Change |
|---|---|---|
| Skills (claimed) | **0.40** | unchanged |
| Transferable skills | **0.20** | **new dimension** |
| Field / program fit | **0.20** | unchanged |
| Hours fit | **0.20** | up from 0.15 |
| ~~Location~~ | — | **removed** (London-only; ranged only 0.85–1.0, ≈2-pt swing) |
| ~~Preferences~~ | — | **removed** (circular: falls back to `student.skills` for new students) |

Total = 1.00.

```
direct      = required ∩ student.skills                         // claimed
transfer    = (required ∩ student.transferableSkills) − direct  // inferred, no overlap with direct

skillsScore        = direct.length   / required.length
transferableScore  = transfer.length / required.length

score = round( (skillsScore       × 0.40)
             + (transferableScore × 0.20)
             + (field             × 0.20)
             + (hours             × 0.20) × 100 )
```

- A claimed skill is worth **2×** a resume-inferred one (0.40 vs 0.20 spread across the same required-skill count).
- `direct` and `transfer` never overlap, so no double-counting.
- `field` and `hours` keep their existing definitions (`fieldAffinity`, `hoursOffered / remaining` clamped to `[0,1]`).

### 1.3 Worked example

Opportunity requires 5 skills. Student **claims** 2; resume adds 2 as transferable; same field; offers 100 hrs of 400 remaining.

```
skillsScore       = 2/5 = 0.40   → ×0.40 = 0.160
transferableScore = 2/5 = 0.40   → ×0.20 = 0.080
field             = same = 1.00  → ×0.20 = 0.200
hours             = 100/400 = 0.25 → ×0.20 = 0.050
                                    total = 0.490 → score 49
```

(vs. ~41 before the transferable skills were counted — a visible, defensible lift.)

### 1.4 Reason strings

`buildReasons()` should surface the transferable contribution, e.g.
`"2 skills + 2 from experience · in your field"`.
Keep generating from the top-weighted dimensions so reasons stay varied per pairing.

---

## 2. Data model changes

### `lib/types.ts`
- `Student`: add `transferableSkills: string[]` (canonical taxonomy values; disjoint from `skills`).
- New extraction contract:

```ts
interface ExtractedSkill {
  skill: string;                          // MUST be a SKILL_LIBRARY value
  kind: "explicit" | "transferable";
  confidence: "high" | "medium" | "low";
  evidence: string;                       // exact resume phrase
}

interface ResumeExtraction {
  profile: {                              // best-effort prefill (all optional)
    name?: string;
    school?: string;                      // from SCHOOLS
    program?: string;                     // from PROGRAMS
    year?: string;                        // from YEARS
    availabilityHours?: number;
    hoursRequired?: number;
  };
  explicitSkills: ExtractedSkill[];
  transferableSkills: ExtractedSkill[];
  certifications: string[];               // matched to CERT_OPTIONS
  notes?: string;
}
```

- `ScoreResult.dimensions`: replace `location` / `preferences` keys with a `transferable` key (so the detail-page breakdown reflects the new factors).
- `MatchVM` / `CandidateVM`: add `transferableHave: string[]`.

### `lib/store/selectors.ts`
- `buildMatch` / `buildCandidate`: compute `transferableHave`; `score()` reads `student.transferableSkills` directly.
- Remove the now-unused `interestSkillsFor` plumbing for preferences (or keep the helper, unused, for a future reintroduction).

### `lib/store/reducer.ts`
- `UPDATE_STUDENT` already accepts a `Partial<Student>` patch, so writing `transferableSkills` needs **no new action**.
- *(Optional)* add `APPLY_RESUME_EXTRACTION` to set skills + transferable + profile + certs and bump `profileStrength` in one dispatch.

### `lib/seed.ts`
- Give 1–2 seed students `transferableSkills` so employer candidate cards demo the feature with no upload.
- Default all other students to `transferableSkills: []` (type requirement).

---

## 3. Onboarding flow

Insert an optional **Step 0** before today's Step 1, rendered with the existing `WizardShell`.

1. **Step 0 — "Have a resume? Let's save you some typing."**
   - Dropzone (click or drag), accepts PDF; shows a file chip on select.
   - Primary: **"Extract my profile."**  Quiet: **"Skip — I'll fill it in myself"** → today's Step 1.
2. **Parsing state** — shimmer/spinner: *"Reading your resume… finding your transferable skills."*
3. **Step 0b — Review & confirm**
   - Prefilled, editable profile fields (school / program / year / availability / hours).
   - **Skills you listed** — explicit skills pre-checked (teal `select-chip on`).
   - **Skills we spotted from your experience** — visually distinct section; each transferable skill is an "Add this?" chip with its evidence line + a confidence dot.
   - **Certifications** matched to `CERT_OPTIONS`, pre-checked.
   - CTA: **"Looks good — continue."**
4. Confirming seeds the wizard's `useState`; the student lands in **Steps 1–5 pre-filled** and finishes exactly as today.

**Files:** `app/onboarding/student/page.tsx` (Step 0 / 0b + state seeding), `components/onboarding/Wizard.tsx` (new `ResumeDrop` + `TransferableReview`; reuse `ChipSelect` for the rest).

---

## 4. AI extraction (Phase 3)

- **Server route** `app/api/parse-resume/route.ts` → Anthropic SDK.
  ⚠️ This is a **non-standard Next 16** — read `node_modules/next/dist/docs/` before writing the route handler.
- **Canonical output guaranteed structurally:** use **structured output / tool use** where `skill` is an **enum of `SKILL_LIBRARY`**, certs an enum of `CERT_OPTIONS`, program from `PROGRAMS`, field from `FIELDS`. The model cannot emit an off-taxonomy value — no fuzzy post-matching.
- **Model:** Haiku 4.5 for explicit extraction (cheap/fast); Sonnet for sharper transferable inference.
- **Prompt-cache** the taxonomy + instructions (static) for cost at scale.
- **Output:** the `ResumeExtraction` contract above.

---

## 5. Landing page

Add a **"How we match"** section — plain language, **no weight numbers**, led by transferable skills.

- Copy direction: *"Skills, your field, your hours — and the experience you didn't know counted. We surface the transferable skills hiding in your resume, then show you exactly why you match."*
- One trust line: *"Transparent matching — every match shows you why."*
- The real transparency stays **in-app**: per-card reason lines + the opportunity-detail dimension breakdown.

**File:** `components/landing/LandingPage.tsx`.

---

## 6. Responsive requirements

All new UI must be fully responsive, mobile-first (test at 360 / 768 / 1024+).

- **Step 0 upload / dropzone:** full-width card with comfortable touch targets (≥44px); dropzone stacks its icon + label + button vertically on mobile, horizontal on ≥768px. The "Skip" action stays reachable without scrolling on small screens.
- **Step 0b review:** profile fields single-column on mobile, two-column on ≥768px. Skill chips use the existing fluid `chip-select` grid (`repeat(auto-fit, …)` / `minmax`), never a fixed pixel width. Evidence lines wrap, never truncate mid-word.
- **Transferable-skill chips:** chip + evidence + confidence dot must wrap gracefully; on mobile the evidence line drops below the chip rather than overflowing.
- **Landing "How we match" section:** factor cards stack vertically on mobile, row/grid on desktop; no horizontal scroll at any width.
- **General:** reuse existing CSS variables and the established chip/card system; use `clamp()` / fluid units over fixed widths; verify no right-edge overflow (a known artifact called out in `BUILD_SPEC.md` §C1/§D4).

---

## 7. Guardrails

- **Dedup:** a skill that's both claimed and inferred counts as **claimed only** — enforce in the review UI *and* in `score()` (`transfer = required-match − direct`).
- **Off-taxonomy finds:** surface as *"we noticed X — not matchable yet"* rather than dropping silently (free taxonomy-growth signal).
- **Over-claiming:** evidence line + confirm step + the 2× claimed-vs-transferable spread keep inferences honest; show profile-strength before/after truthfully.
- **Privacy:** resumes are PII — fine in-memory for the demo; a real launch needs a consent line + storage policy.

---

## 8. Build order

| Phase | Scope | Demoable result |
|---|---|---|
| **1 — Data + formula** | `types`, `scoring` (new weights + transferable dimension), `selectors`, seed sample transferable skills | Employer candidate cards show transferable lift — zero onboarding UI needed. Validates the formula in isolation. |
| **2 — Review UI** | Step 0 + Step 0b wired to a **simulated** extractor (canned outputs for 2–3 sample resumes) | Full upload → review → pre-filled wizard flow, no API key. |
| **3 — Real AI** | `app/api/parse-resume/route.ts` + Claude structured output + caching; simulated path becomes the offline fallback | Real resume parsing; demo never dies offline. |
| **4 — Landing** | "How we match" section + copy | Public-facing pitch for the feature. |

---

## 9. Open knobs

- **Transferable weight** (`0.20`) and the claimed:transferable ratio (`2×`) are the tuning dials.
- **Location** is removed, not deleted conceptually — reintroduce later as *"near your other placements"* once stacking is real or coverage expands beyond London.
- **Option B** alternative (transferable folded into the 0.40 Skills bucket at half-credit instead of a separate 0.20 dimension) remains available if you'd rather it not render as its own breakdown line.
