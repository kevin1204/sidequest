"use client";

/* ============================================================
   SideQuest — Student landing (the default marketing page).
   "Your degree is the main quest — this is the side quest that
   levels you up." Leads with the signature hours-stacking feature.
   ============================================================ */

import React, { useEffect, useState } from "react";
import { Icon, CoTile } from "@/components/ui";
import { getCompanyColor } from "@/lib/taxonomies";
import { MarketingNav, MarketingFooter, useGo } from "@/components/marketing/chrome";
import { Testimonials } from "@/components/marketing/Testimonials";
import { StudentPricing } from "@/components/marketing/StudentPricing";
import { PartnerCheck } from "@/components/marketing/PartnerCheck";

/* ---------- The star: animated hours-stacking visual ---------- */
function StackingVisual() {
  const segs = [
    { company: "Forest City Roasters", hours: 120 },
    { company: "Thames Valley Marketing Group", hours: 150 },
    { company: "Northern Currents Studio", hours: 100 },
    { company: "Riverbend Design Co.", hours: 30 },
  ];
  const goal = 400;
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    // Fill once on mount; reduced-motion users skip the animated delay.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setFilled(true), reduce ? 0 : 250);
    return () => clearTimeout(t);
  }, []);
  const total = segs.reduce((s, x) => s + x.hours, 0);

  return (
    <div className="stack-visual">
      <div className="stack-visual-head">
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Maya&apos;s co-op hours</div>
          <div className="hint">Business Administration · Fanshawe</div>
        </div>
        <div className={`stack-cert ${filled ? "on" : ""}`}>
          <Icon name="award" size={16} /> {filled ? "Certificate unlocked" : `${goal} hrs to go`}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "4px 0 12px", whiteSpace: "nowrap" }}>
        <span
          className="tnum"
          style={{ fontSize: 40, fontWeight: 800, color: "var(--primary)", letterSpacing: "-.03em", transition: "all .8s var(--ease)" }}
        >
          {filled ? total : 0}
        </span>
        <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: 16, whiteSpace: "nowrap" }}>/ {goal} hours</span>
      </div>

      <div className="bar" style={{ height: 18 }}>
        {segs.map((s, i) => (
          <div
            key={i}
            className="bar-seg"
            style={{
              width: filled ? `${(s.hours / goal) * 100}%` : "0%",
              background: getCompanyColor(s.company),
              transitionDelay: `${i * 0.22}s`,
              transitionDuration: ".7s",
            }}
          />
        ))}
      </div>

      <div className="stack-visual-legend">
        {segs.map((s, i) => (
          <div key={i} className="svl-row" style={{ transitionDelay: `${i * 0.22 + 0.2}s`, opacity: filled ? 1 : 0.35 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span className="dot" style={{ width: 10, height: 10, background: getCompanyColor(s.company), flex: "none" }} />
              <span style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.company}
              </span>
            </span>
            <span className="tnum" style={{ fontWeight: 700, fontSize: 13, flex: "none" }}>
              {s.hours}h
            </span>
          </div>
        ))}
      </div>
      <div className="stack-visual-foot">
        <Icon name="layers" size={15} style={{ color: "var(--primary)" }} />
        Four local businesses · one certificate
      </div>
    </div>
  );
}

function StepCard({ n, icon, title, body }: { n: number; icon: string; title: string; body: string }) {
  return (
    <div className="card card-pad hover-lift" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--tl-50)", color: "var(--primary)", display: "grid", placeItems: "center" }}>
          <Icon name={icon} size={22} />
        </div>
        <span className="tnum" style={{ fontSize: 30, fontWeight: 800, color: "var(--line)", letterSpacing: "-.04em" }}>
          0{n}
        </span>
      </div>
      <h3 style={{ fontSize: 19 }}>{title}</h3>
      <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

export function LandingPage() {
  const go = useGo();
  const businesses = [
    "Forest City Roasters",
    "Thames Valley Marketing Group",
    "Northern Currents Studio",
    "Riverbend Design Co.",
    "Innovation Works",
    "Powerhouse Brewing Co.",
  ];
  return (
    <div style={{ background: "#fff" }}>
      <MarketingNav active="students" />

      {/* HERO */}
      <section className="land-hero sq-grain">
        <div aria-hidden="true" className="land-hero-bg" />
        <div className="container" style={{ position: "relative", paddingTop: 60, paddingBottom: 56 }}>
          <div className="land-hero-grid">
            <div style={{ maxWidth: 580 }}>
              <div className="sq-quest-badge">
                Your degree is the main quest.
                <span className="sq-xp-pip">
                  <Icon name="sparkle" size={11} /> +XP
                </span>
              </div>
              <h1 className="display" style={{ fontSize: "clamp(40px, 5.4vw, 62px)", lineHeight: 1.0, marginTop: 18 }}>
                Your career starts with <span style={{ color: "var(--primary)" }}>SideQuest.</span>
              </h1>
              <p style={{ fontSize: 18.5, color: "var(--ink-2)", marginTop: 20, lineHeight: 1.5, maxWidth: 500 }}>
                Stack your required co-op hours across London&apos;s local businesses, get matched on the skills you
                didn&apos;t know counted, and walk away with one verified completion certificate.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <button className="btn btn-primary btn-lg" onClick={() => go("login", "student")}>
                  <Icon name="cap" size={19} /> Start your SideQuest
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => go("employers")}>
                  <Icon name="building" size={18} /> I&apos;m an Employer
                </button>
              </div>
              <div className="sq-hero-stats">
                <div className="sq-hero-stat">
                  <b>60,000+</b>
                  <span>students · Fanshawe &amp; Western</span>
                </div>
                <div className="sq-hero-stat-div" />
                <div className="sq-hero-stat">
                  <b>Free</b>
                  <span>to get placed &amp; certified</span>
                </div>
                <div className="sq-hero-stat-div" />
                <div className="sq-hero-stat">
                  <b>WSIB</b>
                  <span>covered placements</span>
                </div>
              </div>
            </div>
            <div className="land-hero-visual">
              <StackingVisual />
            </div>
          </div>
        </div>
      </section>

      {/* PROOF STRIP (teal band) */}
      <section className="land-proof">
        <div className="container">
          <div className="land-proof-grid">
            <div>
              <div className="tnum" style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>
                60,000+
              </div>
              <div style={{ color: "rgba(255,255,255,.78)", fontSize: 13.5, fontWeight: 600 }}>students across Fanshawe &amp; Western</div>
            </div>
            <div className="land-proof-divider" />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "rgba(255,255,255,.78)", fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
                Hiring across London neighbourhoods
              </div>
              <div className="land-hoods">
                {["Downtown", "Old East Village", "Wortley Village", "SoHo", "Hyde Park", "Masonville", "Byron", "Westmount"].map((n) => (
                  <span key={n} className="land-hood">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="land-logos">
            <span style={{ color: "rgba(255,255,255,.7)", fontSize: 12.5, fontWeight: 700, marginRight: 4 }}>Trusted by local businesses</span>
            {businesses.map((b) => (
              <span key={b} className="land-logo">
                <CoTile name={b} size={26} radius={7} />{" "}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {b.replace(" Group", "").replace(" Co.", "")}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container sq-section" id="how">
        <div className="how-head">
          <div>
            <span className="sq-kicker eyebrow">
              <Icon name="layers" size={14} /> How it works
            </span>
            <h2 className="display sq-h2">Three steps to placed.</h2>
          </div>
          <p className="sq-lede">
            Build one profile, get ranked matches, and stack hours from as many local businesses as it takes.
          </p>
        </div>
        <div className="steps-grid">
          <StepCard n={1} icon="user" title="Build one profile" body="Add your program, skills and required hours once — or let us read them off your résumé in seconds." />
          <StepCard n={2} icon="sparkle" title="Get ranked matches" body="See opportunities scored on real skills — including the transferable ones we surface from your experience." />
          <StepCard n={3} icon="award" title="Stack hours, get certified" body="Combine placements from several shops. We track the total and issue your completion certificate." />
        </div>
      </section>

      {/* HOW WE MATCH — transferable skills (no numbers) */}
      <section className="sq-section sq-section-tint">
        <div className="container">
          <div className="how-head">
            <div>
              <span className="sq-kicker eyebrow">
                <Icon name="target" size={14} /> Our framework
              </span>
              <h2 className="display sq-h2">Matches you can see the reasons for.</h2>
            </div>
            <p className="sq-lede">
              We weigh a few things to rank your best fits — including the experience you didn&apos;t know counted. Every
              match shows you exactly why.
            </p>
          </div>
          <div className="match-factors">
            {(
              [
                ["check", "Skills you list", "The tools and abilities you're already confident in.", false],
                [
                  "sparkle",
                  "Transferable skills",
                  "The experience hiding in your résumé — a serving job that taught you teamwork, a club that taught you outreach. We surface it and count it.",
                  true,
                ],
                ["target", "Your field", "Placements that fit your program and where you want to go.", false],
                ["clock", "Your hours", "Roles sized to the co-op hours you still have left to complete.", false],
              ] as [string, string, string, boolean][]
            ).map(([icon, title, body, lead]) => (
              <div key={title} className={`card card-pad hover-lift match-factor${lead ? " lead" : ""}`}>
                <div className="match-factor-icon">
                  <Icon name={icon} size={20} />
                </div>
                <h3 style={{ fontSize: 17, marginTop: 14 }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>{body}</p>
                {lead && <span className="match-factor-tag">Our differentiator</span>}
              </div>
            ))}
          </div>
          <div className="match-transparency">
            <Icon name="sparkle" size={16} style={{ color: "var(--primary)", flex: "none" }} />
            Transparent matching — every opportunity shows the skills you have, the ones from your experience, and the
            ones still to build.
          </div>
        </div>
      </section>

      {/* SIGNATURE FEATURE (teal-tinted) */}
      <section className="land-signature">
        <div className="container">
          <div className="land-sig-grid">
            <div>
              <span className="sq-kicker eyebrow" style={{ color: "var(--teal)" }}>
                <Icon name="layers" size={14} /> Signature feature
              </span>
              <h2 className="display" style={{ fontSize: "clamp(27px,3.2vw,40px)", marginTop: 14, lineHeight: 1.08 }}>
                No single shop has to take all your hours.
              </h2>
              <p style={{ color: "var(--ink-2)", fontSize: 16.5, marginTop: 18, lineHeight: 1.55, maxWidth: 440 }}>
                A café offers 120 hours, a marketing agency 150, a studio 100. SideQuest adds them up, tracks approvals
                from each employer, and gets you across the line — then issues a single, verifiable certificate.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
                {([
                  ["Partial hours welcome — even 60 hours helps", "layers"],
                  ["Every employer approves their own hours", "check"],
                  ["One certificate, recognized across placements", "award"],
                ] as [string, string][]).map(([t, ic]) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14.5, fontWeight: 600, color: "var(--ink-2)" }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: "#fff", color: "var(--primary)", display: "grid", placeItems: "center", flex: "none", boxShadow: "var(--sh-xs)" }}>
                      <Icon name={ic} size={16} />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 26 }} onClick={() => go("login", "student")}>
                See your hours dashboard <Icon name="arrowRight" size={16} />
              </button>
            </div>
            <div className="land-sig-visual">
              <StackingVisual />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* PRICING */}
      <StudentPricing />

      {/* SCHOOL PARTNER CHECK */}
      <PartnerCheck />

      {/* CTA band */}
      <section className="container" style={{ paddingTop: 8, paddingBottom: 72 }}>
        <div className="land-cta sq-grain">
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="land-uni-badge">
              <span className="dot" style={{ background: "#5eead4" }} /> University partners coming soon — Fanshawe &amp; Western
            </span>
            <h2 className="display" style={{ color: "#fff", fontSize: "clamp(26px,3vw,38px)", marginTop: 18, lineHeight: 1.08, maxWidth: 540 }}>
              Ready to turn your hours into a certificate?
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <button className="btn btn-onteal btn-lg" onClick={() => go("login", "student")}>
                <Icon name="cap" size={18} /> Start your SideQuest
              </button>
              <button className="btn btn-onteal-ghost btn-lg" onClick={() => go("employers")}>
                <Icon name="building" size={18} /> I&apos;m an Employer
              </button>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
