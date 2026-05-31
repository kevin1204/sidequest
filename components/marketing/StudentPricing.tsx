"use client";

/* ============================================================
   SideQuest — Student pricing: SideQuest (free) vs SideQuest+.
   Free covers the *requirement* (get placed + certified); the
   plus tier sells the *advantage* (speed, visibility, coaching).
   ============================================================ */

import React from "react";
import { Icon } from "@/components/ui";
import { useGo } from "@/components/marketing/chrome";

type Row = { label: string; tier: "both" | "plus" };

const FREE_ROWS: { label: string; on: boolean }[] = [
  { label: "See your match scores & reasons", on: true },
  { label: "Browse every local placement", on: true },
  { label: "Stack hours across businesses", on: true },
  { label: "Earn your completion certificate", on: true },
  { label: "Express interest — 5 / month", on: true },
  { label: "Boosted profile & coaching", on: false },
];

const PLUS_ROWS: Row[] = [
  { label: "Everything in SideQuest", tier: "both" },
  { label: "Unlimited express interest", tier: "plus" },
  { label: "Get boosted to employers", tier: "plus" },
  { label: "See who viewed & shortlisted you", tier: "plus" },
  { label: "AI résumé + transferable-skills coaching", tier: "plus" },
  { label: "Early access to new postings", tier: "plus" },
];

export function StudentPricing() {
  const go = useGo();
  return (
    <section className="sq-section sq-section-tint">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 36px" }}>
          <span className="sq-kicker eyebrow">
            <Icon name="layers" size={14} /> Pricing
          </span>
          <h2 className="display sq-h2">Start free. Level up when you&apos;re ready.</h2>
          <p className="sq-lede" style={{ margin: "14px auto 0" }}>
            Getting placed and certified is always free. SideQuest+ is the boost — and it&apos;s on the house if your
            school is a partner.
          </p>
        </div>

        <div className="sq-pricing">
          {/* Free */}
          <div className="sq-tier">
            <div className="sq-tier-name">SideQuest</div>
            <div className="sq-tier-price">
              <b>$0</b>
              <span>free, forever</span>
            </div>
            <p className="hint">Everything you need to finish your co-op.</p>
            <div className="sq-tier-list">
              {FREE_ROWS.map((r) => (
                <div key={r.label} className={`sq-tier-row ${r.on ? "has" : "off"}`}>
                  <span className="sq-tick">
                    <Icon name={r.on ? "check" : "x"} size={12} />
                  </span>
                  {r.label}
                </div>
              ))}
            </div>
            <div className="sq-tier-foot">
              <button className="btn btn-ghost btn-block" onClick={() => go("login", "student")}>
                Create free account
              </button>
            </div>
          </div>

          {/* Plus */}
          <div className="sq-tier plus">
            <span className="sq-tier-flag">
              <Icon name="sparkle" size={12} /> Most popular
            </span>
            <div className="sq-tier-name">
              SideQuest<span style={{ color: "var(--gold)" }}>+</span>
            </div>
            <div className="sq-tier-price">
              <b>$10</b>
              <span>/ month</span>
            </div>
            <p className="hint" style={{ color: "var(--gold)" }}>
              Free if your school is a partner.
            </p>
            <div className="sq-tier-list">
              {PLUS_ROWS.map((r) => (
                <div key={r.label} className={`sq-tier-row ${r.tier === "plus" ? "plus-only" : "has"}`}>
                  <span className="sq-tick">
                    <Icon name="check" size={12} />
                  </span>
                  {r.label}
                </div>
              ))}
            </div>
            <div className="sq-tier-foot">
              <button className="btn btn-primary btn-block" onClick={() => go("login", "student")}>
                Get SideQuest+ <Icon name="arrowRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
