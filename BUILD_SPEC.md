# TalentTie — Complete Build Spec

Two-sided web app matching London, Ontario students (Fanshawe College, Western University) with internships/co-op placements. Signature feature: students complete their required co-op hours across **multiple** small businesses; the platform tracks the total and issues a completion certificate.

**Stack:** Next.js + React + Tailwind. Data seeded **in-memory** (NO real database). **NO real auth** — test account / role-switcher only.

**Golden rule:** every action must persist into shared in-memory state, not just animate. "Express Interest" writes an application record both sides can see. "Approve hours" moves hours from pending to approved and updates every total that depends on it. That persistence is what separates a real platform from a slideshow.

---

## Build phases (always-demoable checkpoints)

| Phase | What's working at the end of it |
|---|---|
| 1 – Brain | Data model, seed data, the scoring function. Nothing visible yet, but everything depends on it. |
| 2 – Core student | Onboarding → profile → ranked matches with scores & reasons. A demo on its own. |
| 3 – Core employer | Post opportunity → ranked matched candidates. Now two-sided. |
| 4 – The loop | Express Interest persists → application status both sides; opportunity & candidate detail pages. |
| 5 – Signature | Hours tracker (log → approve → progress) and the completion certificate. The payoff. |
| 6 – Alive | Notifications, the "complete my hours" planner, empty states, polish & micro-interactions. |

---

## A. Marketing & Entry

### A1. Landing page (lead with the signature feature, not a generic hero)
- Navbar: TalentTie logo (returns home), links (How it works, For Students, For Employers), Log in, Get started.
- Hero leads with the multi-business hours concept, shown visually: a bar filling from 3 colored company segments toward a certificate, animated if possible. Teal.
- Two CTAs: "I'm a Student" / "I'm an Employer."
- Proof strip: "Built for 60,000+ students across Fanshawe & Western"; London neighbourhood / local-business specifics.
- "How it works" in 3 steps; signature-feature section; "University partners coming soon — Fanshawe & Western" badge; footer.
- Commit to TEAL as primary (not blue). Break uniform card rhythm with one teal-tinted section and asymmetry.

### A2. Login (keep — already good)
- Split panel; role cards (Student / Employer); email + password pre-filled with test@test.com; "Log in as {role}."
- Routes to the correct dashboard by selected role.

### A3. Onboarding flow (NEW)
- Student steps: school & program → year & availability → skills (pick from the fixed taxonomy, NOT free text) → certifications → hours required. Progress indicator.
- Employer steps: company name & location → industry/field → "post your first opportunity."
- On finish, writes a profile record and lands on the dashboard.

---

## B. Student Side

### B1. Matches / dashboard
- Hours-progress hero panel: segmented bar where each segment color maps EXACTLY to the company in the "by placement" legend. Show approved vs. pending.
- "Top pick" hero match above the list: one standout ("Your best match this week — Riverbend Design, 94%").
- Ranked opportunity cards: company, role, London location, match-score badge, a VARIED reason line per card, skill chips (teal+check = have, grey outline = missing), and an hours label ("Offers 100 of your 400 required hours" — vary across cards).
- Refinement chips only (one-tap presets): All / In my field / 120+ hrs / Fits my remaining hours. Sort by Match / Hours / Soonest. NO filter sidebar.
- Express Interest on each card → persists an application (see B5).

### B2. Opportunity detail (NEW)
- Full role description, company info, all required skills (have/missing), hours offered, location, match score + full reason breakdown, Express Interest / Save.
- If already interested, show status instead of the button.

### B3. My Hours / tracker (keep — best screen)
- Completion-certificate summary card with donut % (colors consistent with the dashboard bar).
- Per-placement cards: own progress bar, weekly log rows, Approved vs. Pending states, "Hours complete" / "Active" status.
- "Log hours" action (modal): pick placement, week, hours, short work note → creates a PENDING hour-log.
- Micro-interaction: bar animates up when an employer approves.

### B4. Completion certificate (NEW — the payoff)
- Official-looking certificate: student name, program & school, TOTAL verified hours, breakdown by employer with dates, issue date, "Verified by TalentTie" mark and a verification ID.
- Locked until total approved hours ≥ requirement; unlocks with a celebratory moment.
- Download / share (PDF) and a small "University-recognized — coming soon" note.

### B5. My Applications / interest status (NEW — closes the matching loop)
- List of opportunities the student expressed interest in, with status: Interested → Shortlisted → Accepted → Active placement.
- Mirrors the employer side: when an employer shortlists/accepts, status updates here.

### B6. Complete-my-hours planner (NEW — strongest differentiator)
- Given the student's remaining hours, suggest a COMBINATION of placements that sum to the goal.
- "You need 150 more hours. These 2 placements together cover it: Forest City (100h) + Northern Currents (50h)."
- One-tap express interest in the whole suggested stack.

### B7. Profile (refine)
- Fix the large empty space — add a "Placement history / verified hours summary" section, or center & widen content.
- Unify skill chips with the rest of the app.
- Keep the editable "hours required" field and the profile-strength meter.

---

## C. Employer Side

### C1. Dashboard (keep)
- Stat cards (active postings, total candidates, hours to approve), postings list with candidates/views, draft state, "new" badges, Post an Opportunity.
- Fix the right-edge overflow/scrollbar artifact.

### C2. Post an opportunity (NEW form)
- Role title, description, required skills (from the taxonomy), location, field/program fit, HOURS OFFERED with an explicit "partial hours allowed (e.g. just 100)" note.
- Save as draft or publish; published postings appear on the dashboard and feed the matching engine.

### C3. Matched candidates (keep)
- Ranked student cards with the SAME score badge & reason format as the student side (intentional symmetry).
- Keep the "Needs 150 more hours to complete co-op" line.
- Express Interest / Shortlist → persists and updates the student's application status (B5).
- All candidates / Shortlisted tabs; sort by match score.

### C4. Candidate detail (NEW)
- Clicking a candidate card opens their standardized profile — reuse the student profile layout (B7).

### C5. Approve hours (keep — the trust layer)
- Pending weekly submissions with the student's work note, hours, Approve / Reject.
- Approving moves hours pending → approved and updates the student's totals, progress bars, and certificate eligibility everywhere.

---

## D. Shared / Cross-cutting

### D1. Notifications (NEW)
- Student: "Forest City approved your 24 hrs," "New 94% match," "Thames Valley shortlisted you."
- Employer: "Maya logged 20 hrs — approve?", "3 new candidates for Marketing Assistant."

### D2. Demo role switcher (keep)
- Persistent "Switch to employer / student" control in the top bar (DEMO badge). One click. Real role-selecting login still exists underneath.

### D3. Empty states (NEW)
- New student no matches; new employer no postings; no pending hours; no applications. Each with a friendly prompt ("Let's find your first placement →").

### D4. Design consistency pass (near the end)
- ONE chip system app-wide. Commit to TEAL primary. Consistent progress-bar colors (dashboard = tracker = certificate donut). Kill overflow artifacts. Hover-lift on cards; bar animation on approval.

---

## E. Roadmap — NAME in the pitch, do NOT build
- University partnership portal (Fanshawe/Western Model-A integration so it counts for official credit).
- In-app messaging between student and employer.
- Employer evaluations & learning objectives (what schools require beyond raw hours).
- Resume auto-parsing to pre-fill the profile.
- Payments / employer subscription (monetization).
- Analytics: student success rates, skill-gap insights.

---

## F. Data Model (seed in-memory; no real DB)

### Fixed taxonomies (define once, reuse everywhere)
- **Skills list:** fixed array (Customer Service, Social Media, Content Writing, Canva, Excel, Event Planning, Teamwork, POS Systems, Analytics, Brand Design, Adobe Illustrator, Communication, CRM, ...). Students PICK from it; never free-type — free text breaks matching.
- **Programs/fields:** fixed list mapped to fields (Business Administration→Business; Computer Science→Tech; Media & Communications→Media; ...).
- **London neighbourhoods:** SoHo, Downtown, Wortley Village, Old East Village, Masonville, ...

### Entities
| Entity | Key fields |
|---|---|
| Student | id, name, school, program, field, year, location, availability, skills[], certifications[], hoursRequired, profileStrength |
| Employer | id, companyName, location, field, logoInitials, colorTag |
| Opportunity | id, employerId, title, description, requiredSkills[], field, location, hoursOffered, status (draft/active), views, candidateCount |
| Application | id, studentId, opportunityId, status (interested/shortlisted/accepted/active), createdAt — the record Express Interest writes |
| Placement | id, studentId, opportunityId, hoursTarget, status (active/complete) — an accepted application now tracking hours |
| HourLog | id, placementId, weekRange, hours, note, status (pending/approved/rejected) |
| Certificate | id, studentId, totalHours, breakdown[{employer, hours, dates}], issueDate, verificationId — generated when approved hours ≥ hoursRequired |
| Notification | id, userId, type, text, read, createdAt |

### The scoring function (one pure function, used on BOTH sides)
`score(student, opportunity) → { score 0–100, reasons[] }`. Same call powers the student's matches and the employer's matched candidates — the score describes the PAIRING.
- Skills overlap ~40%: fraction of the opportunity's requiredSkills the student has.
- Field/program fit ~20%: student.field vs opportunity.field.
- Availability/hours fit ~15%: availability & remaining hours vs hoursOffered (partial = partial credit, never a rejection).
- Location ~15%: London proximity / remote.
- Preferences ~10%: interest overlap.
- **Reason strings:** generated from the top-scoring dimensions, so they're always consistent with the number and VARY per pairing — e.g. "4 of 5 skills · in your field · in London."

---

*Build the brain first (F). Then phases 2–6. Persist every action into shared state. Finish the spine before the planner.*
