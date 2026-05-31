"use client";

/* ============================================================
   SideQuest — Employer marketing page (/employers).
   Pitch to London small businesses: pre-matched student talent,
   only pay per placement, we handle the payment, WSIB-covered.
   ============================================================ */

import React from "react";
import { Icon, Avatar, MatchBadge } from "@/components/ui";
import { MarketingNav, MarketingFooter, useGo } from "@/components/marketing/chrome";

/* A concrete candidate preview so the hero shows the actual product. */
function CandidatePreview() {
  return (
    <div className="stack-visual" style={{ maxWidth: 380 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span className="eyebrow">Top match · Marketing Assistant</span>
        <MatchBadge score={94} />
      </div>
      <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
        <Avatar name="Maya Thompson" size={46} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Maya Thompson</div>
          <div className="hint">Business Administration · Fanshawe</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "14px 0" }}>
        <span className="chip chip-have">
          <Icon name="check" size={12} /> Social Media
        </span>
        <span className="chip chip-have">
          <Icon name="check" size={12} /> Canva
        </span>
        <span className="chip chip-transfer">
          <Icon name="sparkle" size={12} /> Teamwork
        </span>
        <span className="chip chip-transfer">
          <Icon name="sparkle" size={12} /> Communication
        </span>
      </div>
      <div className="hours-pill" style={{ marginTop: 0 }}>
        <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>Needs 150 hrs to finish co-op</span>
        <span className="tag tag-blue" style={{ height: 26 }}>
          <Icon name="layers" size={13} /> Stack-friendly
        </span>
      </div>
      <div className="stack-visual-foot">
        <Icon name="sparkle" size={15} style={{ color: "var(--primary)" }} />2 skills + 2 from experience · in your field
      </div>
    </div>
  );
}

function Benefit({ icon, gold, title, body }: { icon: string; gold?: boolean; title: string; body: string }) {
  return (
    <div className="emp-benefit">
      <div className={`emp-benefit-icon${gold ? " gold" : ""}`}>
        <Icon name={icon} size={22} />
      </div>
      <h3 style={{ fontSize: 17, marginTop: 14 }}>{title}</h3>
      <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>{body}</p>
    </div>
  );
}

export function EmployersPage() {
  const go = useGo();
  return (
    <div style={{ background: "#fff" }}>
      <MarketingNav active="employers" />

      {/* HERO */}
      <section className="emp-hero land-hero sq-grain">
        <div className="container" style={{ position: "relative", paddingTop: 60, paddingBottom: 56 }}>
          <div className="land-hero-grid">
            <div style={{ maxWidth: 580 }}>
              <div className="sq-quest-badge">
                <Icon name="building" size={15} style={{ color: "var(--gold)" }} /> For London small businesses
              </div>
              <h1 className="display" style={{ fontSize: "clamp(38px, 5.2vw, 60px)", lineHeight: 1.0, marginTop: 18 }}>
                Hire student talent. <span style={{ color: "var(--gold)" }}>Only pay per placement.</span>
              </h1>
              <p style={{ fontSize: 18.5, color: "var(--ink-2)", marginTop: 20, lineHeight: 1.5, maxWidth: 500 }}>
                Get pre-matched, motivated students from Fanshawe &amp; Western — ranked on the skills your role actually
                needs. No subscriptions, no wage markup. We handle the payment, and every placement is WSIB-covered.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <button className="btn btn-primary btn-lg" onClick={() => go("login", "employer")}>
                  <Icon name="plus" size={18} /> Post a role — free
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => go("students")}>
                  <Icon name="cap" size={18} /> I&apos;m a Student
                </button>
              </div>
              <div className="sq-hero-stats">
                <div className="sq-hero-stat">
                  <b>$0</b>
                  <span>to post &amp; review candidates</span>
                </div>
                <div className="sq-hero-stat-div" />
                <div className="sq-hero-stat">
                  <b>$99</b>
                  <span>flat, per placement</span>
                </div>
                <div className="sq-hero-stat-div" />
                <div className="sq-hero-stat">
                  <b>WSIB</b>
                  <span>covered, every time</span>
                </div>
              </div>
            </div>
            <div className="land-hero-visual">
              <CandidatePreview />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container sq-section">
        <div className="how-head">
          <div>
            <span className="sq-kicker eyebrow">
              <Icon name="sparkle" size={14} /> Why SideQuest
            </span>
            <h2 className="display sq-h2">Built for a busy small business.</h2>
          </div>
          <p className="sq-lede">
            You don&apos;t have an HR team or a recruiter budget. SideQuest does the matching, the paperwork, and the
            payment — you just pick who to hire.
          </p>
        </div>
        <div className="emp-benefits">
          <Benefit
            gold
            icon="bolt"
            title="Only pay per placement"
            body="Free to post and review candidates. A flat $99 when you actually start someone — never a % of wages, never a subscription."
          />
          <Benefit
            icon="layers"
            title="We handle the payment"
            body="Pay your student through SideQuest. They receive 100% of their wage; you skip setting up payroll for a short placement."
          />
          <Benefit
            gold
            icon="check"
            title="WSIB-covered"
            body="Every placement is covered for workplace safety insurance — a real liability lifted off your shoulders."
          />
          <Benefit
            icon="target"
            title="Pre-matched candidates"
            body="Students arrive ranked by fit for your exact role — skills, field and availability — so you review 5 great fits, not 50 résumés."
          />
          <Benefit
            icon="sparkle"
            title="See hidden potential"
            body="Our transferable-skills engine surfaces what a café or club job really taught a student — so you don't overlook a great hire."
          />
          <Benefit
            icon="award"
            title="Stack-friendly hires"
            body="Even a 60-hour project helps a student finish their co-op. Offer what you can — partial placements are welcome."
          />
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="sq-section sq-section-tint">
        <div className="container">
          <div className="how-head">
            <div>
              <span className="sq-kicker eyebrow">
                <Icon name="target" size={14} /> How it works
              </span>
              <h2 className="display sq-h2">From posting to placed in four steps.</h2>
            </div>
            <p className="sq-lede">Our matching engine ranks every student against your role — the same score they see.</p>
          </div>
          <div className="emp-method">
            {(
              [
                ["Post your role", "Add the skills, hours and location. Free, takes two minutes.", "plus"],
                ["Get ranked candidates", "Students arrive scored by fit — with the reasons spelled out.", "users"],
                ["Accept & start", "Shortlist, accept, and a placement is created automatically.", "checkCircle"],
                ["Approve & pay", "Approve logged hours and pay through us — WSIB-covered.", "clock"],
              ] as [string, string, string][]
            ).map(([title, body, icon], i) => (
              <div key={title} className="emp-step">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="emp-step-n">0{i + 1}</span>
                  <Icon name={icon} size={20} style={{ color: "var(--primary)" }} />
                </div>
                <h3 style={{ fontSize: 16.5, marginTop: 10 }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, marginTop: 7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENTS + WSIB */}
      <section className="container sq-section">
        <div className="emp-pay">
          <div>
            <span className="sq-kicker eyebrow">
              <Icon name="layers" size={14} /> Payments &amp; coverage
            </span>
            <h2 className="display sq-h2" style={{ fontSize: "clamp(26px,3vw,38px)" }}>
              We move the money. You skip the headache.
            </h2>
            <p className="sq-lede">
              Pay your student through SideQuest and we handle the transfer. They get 100% of their wage; you avoid
              standing up payroll for a short placement.
            </p>
            <div className="emp-feature-list" style={{ marginTop: 22 }}>
              <div className="emp-feature">
                <span className="emp-feature-ic gold">
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>WSIB-covered placements</div>
                  <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, marginTop: 3 }}>
                    Workplace safety insurance is included — a genuine risk and cost lifted off small businesses.
                  </p>
                </div>
              </div>
              <div className="emp-feature">
                <span className="emp-feature-ic">
                  <Icon name="bolt" size={18} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>We&apos;re the rail, not the employer</div>
                  <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.5, marginTop: 3 }}>
                    SideQuest facilitates the payment via Stripe. You stay the employer of record — we just make paying
                    simple.
                  </p>
                </div>
              </div>
            </div>
            <span className="wsib-badge" style={{ marginTop: 20 }}>
              <Icon name="check" size={15} /> Every placement WSIB-covered
            </span>
          </div>

          {/* pay snapshot card */}
          <div className="emp-pay-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>What you pay</span>
              <span className="tag tag-gray">Example placement</span>
            </div>
            <div className="emp-pay-row">
              <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>Student wage (100% to them)</span>
              <b className="tnum">$2,000</b>
            </div>
            <div className="emp-pay-row">
              <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>SideQuest placement fee</span>
              <b className="tnum">$99</b>
            </div>
            <div className="emp-pay-row">
              <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>
                Payment handling <span className="hint">(of wage)</span>
              </span>
              <b className="tnum">~4%</b>
            </div>
            <div className="emp-pay-row">
              <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>WSIB coverage</span>
              <span className="tag tag-green">
                <Icon name="check" size={12} /> Included
              </span>
            </div>
            <div className="emp-pay-row total">
              <span style={{ fontWeight: 800 }}>No subscription. No wage markup.</span>
              <span className="sq-xp-pip" style={{ height: 24 }}>
                Pay per placement
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ paddingTop: 8, paddingBottom: 72 }}>
        <div className="land-cta sq-grain">
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="land-uni-badge">
              <span className="dot" style={{ background: "#5eead4" }} /> Free to post · only pay when you place
            </span>
            <h2 className="display" style={{ color: "#fff", fontSize: "clamp(26px,3vw,38px)", marginTop: 18, lineHeight: 1.08, maxWidth: 560 }}>
              Meet your next hire this week.
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <button className="btn btn-onteal btn-lg" onClick={() => go("login", "employer")}>
                <Icon name="plus" size={18} /> Post a role — free
              </button>
              <button className="btn btn-onteal-ghost btn-lg" onClick={() => go("login", "employer")}>
                <Icon name="building" size={18} /> See candidate matches
              </button>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
