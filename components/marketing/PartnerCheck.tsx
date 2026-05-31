"use client";

/* ============================================================
   SideQuest — "Is your school a partner?" check.
   MVP verification = institutional email DOMAIN. If a student's
   school email domain is on the partner list, their school sponsors
   them and SideQuest+ is free. (Document upload is the fallback for
   schools on non-standard domains — noted in the UI.)
   ============================================================ */

import React, { useState } from "react";
import { Icon } from "@/components/ui";
import { useGo } from "@/components/marketing/chrome";

/** Partner schools, keyed by the email domain we'd verify against. */
const PARTNER_DOMAINS: Record<string, string> = {
  "fanshawec.ca": "Fanshawe College",
  "fanshaweonline.ca": "Fanshawe College",
  "uwo.ca": "Western University",
  "ivey.uwo.ca": "Western University",
};

type Result =
  | { kind: "partner"; school: string }
  | { kind: "edu-unknown"; domain: string }
  | { kind: "invalid" };

function evaluate(email: string): Result {
  const m = email.trim().toLowerCase().match(/@([a-z0-9.-]+\.[a-z]{2,})$/);
  if (!m) return { kind: "invalid" };
  const domain = m[1];
  for (const [d, school] of Object.entries(PARTNER_DOMAINS)) {
    if (domain === d || domain.endsWith(`.${d}`)) return { kind: "partner", school };
  }
  return { kind: "edu-unknown", domain };
}

export function PartnerCheck() {
  const go = useGo();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    setResult(evaluate(email));
  }

  return (
    <section className="container sq-section">
      <div className="sq-partner sq-grain">
        <div className="sq-partner-grid">
          <div>
            <span className="sq-partner-chip">
              <span className="dot" style={{ background: "#7fe0d2" }} /> School-sponsored access
            </span>
            <h2 className="display" style={{ color: "#fff", fontSize: "clamp(26px,3.2vw,38px)", marginTop: 16, lineHeight: 1.08 }}>
              Is your school a partner? Then SideQuest+ is <em>free</em>.
            </h2>
            <p style={{ color: "rgba(255,255,255,.82)", fontSize: 16, marginTop: 14, lineHeight: 1.55, maxWidth: 460 }}>
              When your college or university partners with us, they cover the upgrade for every student. Check with your
              school email — we verify the domain instantly, no paperwork.
            </p>
            <div style={{ display: "flex", gap: 18, marginTop: 20, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#fff", fontSize: 13.5, fontWeight: 600 }}>
                <Icon name="check" size={15} style={{ color: "#7fe0d2" }} /> Instant email-domain check
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#fff", fontSize: 13.5, fontWeight: 600 }}>
                <Icon name="check" size={15} style={{ color: "#7fe0d2" }} /> Student ID upload if needed
              </span>
            </div>
          </div>

          <form className="sq-partner-check" onSubmit={check}>
            <label style={{ color: "#fff", fontWeight: 700, fontSize: 13.5, display: "block", marginBottom: 8 }}>
              Check your school
            </label>
            <div className="sq-partner-input">
              <input
                type="email"
                inputMode="email"
                placeholder="you@fanshawec.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="School email"
              />
              <button className="btn btn-onteal" type="submit">
                Check <Icon name="arrowRight" size={16} />
              </button>
            </div>

            {result?.kind === "partner" && (
              <div className="sq-partner-result yes">
                <Icon name="checkCircle" size={18} style={{ flex: "none", marginTop: 1 }} />
                <span>
                  🎉 <b>{result.school}</b> is a SideQuest partner — you study <b>100% free</b>. Verify with your school
                  email at sign-up and SideQuest+ is on us.
                </span>
              </div>
            )}
            {result?.kind === "edu-unknown" && (
              <div className="sq-partner-result no">
                <Icon name="sparkle" size={18} style={{ flex: "none", marginTop: 1 }} />
                <span>
                  We don&apos;t see <b>{result.domain}</b> yet. You can still join free or go SideQuest+ for $10/mo — and
                  we&apos;ll invite your school to partner.
                </span>
              </div>
            )}
            {result?.kind === "invalid" && (
              <div className="sq-partner-result no">
                <Icon name="x" size={18} style={{ flex: "none", marginTop: 1 }} />
                <span>That doesn&apos;t look like a school email — try your @school.ca address.</span>
              </div>
            )}

            <button
              type="button"
              className="btn btn-onteal-ghost btn-block"
              style={{ marginTop: 14 }}
              onClick={() => go("login", "student")}
            >
              Create my free account
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
