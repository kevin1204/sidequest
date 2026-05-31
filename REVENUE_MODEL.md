# TalentTie — Revenue Model & Pitch Report

**For:** TalentTie team · TechStart Startup Weekend prep
**Purpose:** Align on how we make money, the pricing tiers, the numbers, and how to pitch it to the judges.
**One-line summary:** *Free core for students · $10/mo student premium · employers pay per placement (+ payment fees) · schools license the compliance layer at scale.*

> ⚠️ **All numbers below are illustrative assumptions** to show the logic. Replace the headcounts/conversion rates with verified figures before pitching (see §11 — Verify before pitch).

---

## 1. TL;DR — what we agreed on

1. **We are a marketplace + compliance platform, NOT a staffing agency.** We don't become the employer of record and we don't take a cut of wages. We monetize *software, access, and payment rails*.
2. **Three payers, by who gets value and who has budget:**
   - **Students** → free core + **$10/mo premium** (the "boost"). Validated by founder-market fit ("I'd pay for this myself").
   - **Employers** → **placement fees + payment processing fee** (charged on top of wages, never out of student pay).
   - **Schools/colleges** → **SaaS license** (~$25/student/yr) — the big, scalable, sticky revenue, sold *later* once we have traction.
3. **Golden rule:** never paywall the *requirement* (getting placed + certified). Paywall the *advantage* (speed, visibility, coaching).
4. **Sequencing:** students + employers = revenue **now** (self-serve, demoable, no procurement). Schools = revenue **at scale** (and when a school signs, its students get premium bundled free).

---

## 2. Why not the "staffing agency" model

Staffing agencies make money two ways, and **both doors are closed to us**:

| Agency model | How it works | Why it fails for us |
|---|---|---|
| Bill-rate margin (temp) | Become employer of record; bill client more than the worker earns; keep the spread | Co-op hours are often unpaid/low-paid → no margin. Becoming employer of record = payroll, WSIB, liability. |
| Placement fee | 15–25% of first-year salary on hire | Small businesses won't pay big % fees; placements are short, not full-time hires. |

**Takeaway:** agencies sit inside a paycheck and take a cut of wages. We sit on top as software + rails. Lighter, more scalable, no payroll liability.

---

## 3. The three revenue streams

### 3A. Students — free core + $10/mo premium

**Principle:** the free tier must still let a student **get placed and get certified** (it's a graduation requirement). Premium only makes them **faster and more visible** (LinkedIn Premium model). Never hide the match score — it's the hook.

| Feature | Free | **Premium — $10/mo** |
|---|---|---|
| See match scores | ✅ (always) | ✅ |
| Browse all postings | ✅ | ✅ |
| Express interest | **5 / month** | **Unlimited** |
| Earn the completion certificate | ✅ (requirement — stays free) | ✅ |
| Boosted / featured to employers | ❌ | ✅ |
| See who viewed / shortlisted you | ❌ | ✅ |
| AI résumé + transferable-skills coaching | ❌ | ✅ |
| Early access to new postings | ❌ | ✅ |

**Why students will pay:** they already spend heavily on their education and career, co-op is mandatory, and they're anxious to get placed and get the experience. Premium reduces that anxiety and gives an edge.

**Guardrails:**
- Don't gate the match score or the certificate.
- Don't make free students *less visible* to employers — that hurts employers (a paying side). Boost premium students *up*; never push free students *down*.

### 3B. Employers — placement fees + payment rails

Small businesses are cash-poor and price-sensitive, so keep entry low and charge on outcomes/value.

| Tier / fee | Price | What they get |
|---|---|---|
| Free | $0 | Post **1** active role, see ranked candidates |
| Pro subscription | **$49–99 / mo** | Unlimited postings, featured placement, candidate analytics |
| Placement fee | **$99 flat per placement** | Charged when they confirm a hire (flat — never % of salary) |
| **Payment facilitation fee** | **+3–5% on top of wages** | We move the money (employer → student) via Stripe Connect and take a small fee |

**Payments rule (critical):** the employer pays the student's wage → **student receives 100%**. We charge the **employer** a fee *on top* for facilitating the transfer.

> ⚠️ **We facilitate payments — we do NOT run payroll.** Via **Stripe Connect** we are only the *payment rail*: we move money and take a fee. The **employer stays the employer of record** and keeps all tax / T4 / WSIB / remittance obligations. Do **not** market this as "we run payroll" — that would imply we're a payroll company and pull in liability we don't want. Note: this stream only applies to **paid** placements (unpaid co-op = nothing to facilitate).

### 3C. Schools / colleges — the scalable engine

This is where budget + mandate + willingness-to-pay align. Co-op/WIL offices already buy software in this category (e.g., Orbis/Outcome, Symplicity, Riipen) and have a CEWIL-driven mandate to **track required hours** — exactly our signature feature.

| Model | Price | Notes |
|---|---|---|
| Per co-op student / year | **$20–30 / student / yr** | Simplest to pitch |
| Flat institutional license | **$25k–50k / school / yr** | For larger or multi-module deals |

When a school licenses the platform, **its students get premium bundled free** (school becomes the payer). This resolves the student-pay vs school-pay conflict cleanly.

---

## 4. The numbers (illustrative — replace with verified data)

### Anchor city (London) — early, pre-school

| Stream | Assumption | Annual |
|---|---|---|
| Student premium | 5,000 active students × 5% convert × $10 × 12 | **$30k** |
| Employer placements | 200 placements × $99 | **$20k** |
| Employer Pro subs | 30 employers × $69/mo × 12 | **$25k** |
| Payment fees | $150k wages processed × 4% | **$6k** |
| **Early ARR (no school yet)** | | **~$80k** |

### Add the first school deals

| Stream | Assumption | Annual |
|---|---|---|
| Fanshawe + Western | 2 schools × ~2,000 co-op students × $25 | **$100k** |
| **London ARR with anchors** | early $80k + $100k | **~$180k** |

### Scale story (national)

- Canada has **200+ colleges + universities.**
- 30 institutions × ~$40k avg license = **$1.2M ARR** from the school layer alone — before student/employer revenue in each new city.

**Sensitivity:** student premium at 10% conversion doubles to ~$60k; school count is the real lever on the ceiling.

---

## 4A. Three-year projection (illustrative)

> Same caveat: **assumptions, not forecasts.** They show the *shape* of the business. Swap in verified numbers before pitching.

### Base-case assumptions (per unit)

| Driver | Value |
|---|---|
| Student premium | $10/mo = **$120/yr** |
| Premium conversion (of active students) | **5–6%** |
| Employer Pro subscription | ~$69/mo = **$828/yr** |
| Placement fee | **$99 flat** |
| Avg wages per paid placement | **~$2,000** |
| Payment facilitation fee | **4%** of wages moved |
| School license | **$25 / co-op student / yr** |

### Base case — revenue by stream

| Stream | **Y1** (London, no school) | **Y2** (2 anchor schools, 2 cities) | **Y3** (~7 institutions, multi-city) |
|---|---|---|---|
| Student premium (direct)¹ | $24k | $45k | $80k |
| Employer Pro subs | $21k | $46k | $110k |
| Placement fees | $25k | $59k | $149k |
| Payment facilitation | $12k | $32k | $88k |
| **School licenses** | $0 | $100k | $280k |
| **Total ARR** | **~$80k** | **~$280k** | **~$700k** |

¹ *School-licensed campuses get premium bundled free, so direct student revenue comes mostly from not-yet-licensed campuses and upsells — that's why this line grows slower than user count.*

### Underlying volumes (base case)

| Metric | Y1 | Y2 | Y3 |
|---|---|---|---|
| Active students | 4,000 | 9,000 | 20,000 |
| Premium subscribers | 200 | ~540 | ~1,300 |
| Active employers | 40 | 90 | 200 |
| Placements / yr | 250 | 600 | 1,500 |
| Paid wages processed | $300k | $800k | $2.2M |
| Schools licensed | 0 | 2 | 7 |

### Scenario range (Year 3 ARR)

| Scenario | Drivers | Year-3 ARR |
|---|---|---|
| **Conservative** | 3% conversion · slow school adoption (3–4 schools) · fewer placements | **~$350–400k** |
| **Base** | 5–6% conversion · 7 schools · steady marketplace growth | **~$700k** |
| **Optimistic** | 10% conversion · 12+ schools · strong payment volume | **~$1.3–1.6M** |

### What moves the needle

- **One school ≈ a lot of students.** A single $50k school license ≈ **417 student-premium subscribers** ($50k ÷ $120). Schools are the efficient revenue.
- **Schools are the ceiling lever.** Going from 7 → 30 institutions (×~$40k) adds **~$1M+** with no per-dollar sales effort once the playbook repeats.
- **Payments scale with GMV.** As paid placements grow, the 4% facilitation fee compounds quietly — a bonus stream, not the engine.

### Simple unit economics (for the pitch)

- **Student premium:** ~$0 marginal cost → near-100% gross margin; LTV over a 2-yr program ≈ **$120–240**.
- **Employer placement:** $99 fee at near-zero marginal cost.
- **School license:** highest margin, lowest churn (multi-year, embedded in compliance) — the value driver.
- **Blended:** software-style margins (~85%+); payments carry Stripe's ~3% cost, which is why we charge the employer *on top*.

---

## 5. Subscription vs. take-rate — the verdict

**Subscription-primary, payments as a stickiness layer.**

| | Subscription (SaaS) | Take-rate (cut of payments) |
|---|---|---|
| Predictability | **High** (recurring MRR/ARR) | Volatile (tied to volume) |
| Works on **unpaid** placements? | **Yes** | **No** |
| What schools buy | **This** | Not this |
| Scales without sales effort | Moderate | **Yes** (grows with GMV) |
| Valuation multiple | **Higher** | Lower |
| Hidden burden | Low | Payroll/compliance risk |

**Why payments still matter:** controlling the money flow makes us the **system of record** (jobs + hours + payments + certificate all run through us) → brutal lock-in. Monetize it with a clean **employer-side** fee. *Subscription pays the bills; owning the rails makes us impossible to leave.*

---

## 6. Go-to-market sequencing

1. **Now (weeks):** student freemium + employer placement fees. Self-serve, no procurement, demoable, founder-validated. Generates **proof** (placements + outcomes).
2. **Next (months):** that proof closes the first school pilot → paid license. Students on that campus fold into the school deal (premium free).
3. **Scale (city by city):** each school anchors a new local market (instant student supply) and de-risks the next school's procurement (higher-ed is reference-driven via CEWIL).

**Key insight — the school deal solves the cold-start:** charging only employers means cold-starting *both* sides. A school adoption hands us the **entire student cohort** as guaranteed supply, which pulls employers in.

---

## 7. Scalability

- **Software layer is portable** — build hour-tracking/matching/certificates once, sell to any institution. ✅
- **Marketplace liquidity is local** — students + employers are city-bound, so each new city needs its local employer base rebuilt. ⚠️ (This is the friction; name it honestly.)
- **References compound** — "Western + Fanshawe run on TalentTie" makes the next school cheaper to win. Lumpy, not viral — but builds a moat consumer apps never get: recurring, expanding, hard-to-rip-out contracts.

---

## 8. Pitch playbook (for the judges)

**Lead with revenue we can demo today, position schools as upside — not dependency.**

- **Founder-market-fit hook (use verbatim):** *"I'm the target user, and I'd pay $10/month for this myself."*
- **Revenue one-liner:** *"Free for students, $10/mo premium for the edge. Employers pay per placement and to run payroll. Schools license the compliance layer — our path from ~$180k ARR in London to a 200-institution market."*
- **De-risk the school question:** don't bet the pitch on a signed school. Get **one validation quote** from a Fanshawe/Western co-op coordinator (*"we struggle to track hours across multiple employers — we'd pilot this"*) and put it on a slide. A quote beats a projection.
- **Frame schools as pulled in by traction:** *"We grow bottom-up — students and employers first. Once we own the student supply, schools come to us, because we already solve their compliance problem."*

### Anticipated judge Q&A

| Question | Answer |
|---|---|
| "Will students really pay for a school requirement?" | Free tier covers the requirement. Premium is the *edge* (visibility, coaching) — like LinkedIn Premium. And students already pay for career tools. |
| "Are you handling wages? Aren't you a payroll company?" | Employers pay through us, **students get 100%**, we charge the employer a platform fee. We're the rails, not the employer of record. |
| "Will a school actually sign?" | Schools already buy this category (Orbis, Symplicity, Riipen) and have a CEWIL mandate to track hours. We start with employer revenue and a pilot; the license follows the traction. |
| "What about bigger players / incumbents?" | Incumbents do compliance *or* matching. Our wedge is **stacking hours across multiple small businesses** + transferable-skills matching — built for the local SMB + student reality. |
| "How is this defensible?" | We become the system of record (matching + hours + payments + certificate). Switching cost is high once a campus runs on us. |

---

## 9. Product features that map to each tier (what we already have / are building)

- **Match score + reasons + dimension breakdown** → the free hook; coaching/insights are premium.
- **Transferable-skills résumé parsing** → free to see; AI coaching/optimization is a premium upsell.
- **Hours stacking across multiple businesses + completion certificate** → free (the requirement); the school-facing compliance dashboard is the institutional product.
- **Express interest / applications** → metered on free, unlimited on premium.

---

## 10. Risks & guardrails

- **Don't paywall the requirement** (placement + certificate stay free) — equity, schools, and student unions will react.
- **Don't skim student wages** — breaks "free for students," alienates schools, triggers payroll law.
- **Don't throttle free-student visibility** — it hurts employers (a paying side) and marketplace liquidity.
- **Student-pay vs school-pay conflict** — they collide at the endgame; resolve by bundling student premium into the school license.
- **Marketplace cold-start** — keep the supply side (students) as frictionless as possible early on.

---

## 11. Verify before pitch (do this!)

- [ ] Real **co-op/WIL student headcounts** at Fanshawe & Western (not total enrolment — the co-op subset).
- [ ] What co-op software each school **currently uses** (incumbent to displace?).
- [ ] Whether typical local co-op placements are **paid or unpaid** (affects the payments stream).
- [ ] A **validation quote** from a co-op coordinator or a few local employers.
- [ ] Realistic **freemium conversion %** for the student tier (benchmark 2–10%).
- [ ] Stripe / payment-rails feasibility for short placements (wages vs marketplace payout classification).

---

## 12. The revenue slide (copy-ready)

> **Students:** Free core · **$10/mo** premium (boost & coaching)
> **Employers:** **$99** per placement · **$49–99/mo** Pro · **+3–5%** payment fee
> **Schools:** **$25/student/yr** license (the scalable, sticky engine)
>
> **London: ~$180k ARR with our two anchor schools → 200-institution national market.**
> *Free for students. We make money the day an employer hires — and own the rails they hire on.*
