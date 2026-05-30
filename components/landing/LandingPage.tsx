"use client";

/* ============================================================
   TalentTie — Landing (marketing) page, ported from landing.jsx.
   Leads with the signature multi-business hours feature.
   ============================================================ */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, Logo, CoTile } from "@/components/ui";
import { getCompanyColor } from "@/lib/taxonomies";

function useGo() {
  const router = useRouter();
  return (route: "landing" | "login", role?: "student" | "employer") => {
    if (route === "landing") router.push("/");
    else router.push(role ? `/login?role=${role}` : "/login");
  };
}

function LandingNav() {
  const go = useGo();
  return (
    <header className="land-nav">
      <div className="container" style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo onClick={() => go("landing")} />
        <nav className="land-links">
          <a href="#how">How it works</a>
          <a onClick={() => go("login", "student")}>For Students</a>
          <a onClick={() => go("login", "employer")}>For Employers</a>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn btn-quiet btn-sm land-login" onClick={() => go("login")}>
            Log in
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => go("login")}>
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}

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
    // Fill once on mount, then settle — no looping (which read as "glitching").
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFilled(true);
      return;
    }
    const t = setTimeout(() => setFilled(true), 250);
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

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {links.map((l) => (
          <a key={l} style={{ color: "var(--muted)", fontSize: 13.5, cursor: "pointer" }}>
            {l}
          </a>
        ))}
      </div>
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
      <LandingNav />

      {/* HERO */}
      <section className="land-hero">
        <div aria-hidden="true" className="land-hero-bg" />
        <div className="container" style={{ position: "relative", paddingTop: 64, paddingBottom: 56 }}>
          <div className="land-hero-grid">
            <div style={{ maxWidth: 560 }}>
              <div className="land-badge">
                <span className="dot" style={{ background: "var(--teal)" }} /> University partners coming soon — Fanshawe &amp; Western
              </div>
              <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.03, marginTop: 20 }}>
                A confusing internship search, turned into a few <span style={{ color: "var(--primary)" }}>confident matches.</span>
              </h1>
              <p style={{ fontSize: 18.5, color: "var(--ink-2)", marginTop: 20, lineHeight: 1.5, maxWidth: 500 }}>
                TalentTie lets London students complete their required co-op hours across several local businesses — we total every
                hour and issue one completion certificate.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <button className="btn btn-primary btn-lg" onClick={() => go("login", "student")}>
                  <Icon name="cap" size={19} /> I&apos;m a Student
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => go("login", "employer")}>
                  <Icon name="building" size={18} /> I&apos;m an Employer
                </button>
              </div>
              <div style={{ display: "flex", gap: 22, marginTop: 26, color: "var(--muted)", fontSize: 13.5, fontWeight: 600, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon name="check" size={15} style={{ color: "var(--green)" }} /> Free for students
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon name="check" size={15} style={{ color: "var(--green)" }} /> Local London employers
                </span>
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
      <section className="container" id="how" style={{ paddingTop: 72, paddingBottom: 64 }}>
        <div className="how-head">
          <div>
            <div className="eyebrow">How it works</div>
            <h2 style={{ fontSize: "clamp(28px,3.4vw,38px)", marginTop: 12 }}>Three steps to placed.</h2>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 360, lineHeight: 1.55 }}>
            Build one profile, get ranked matches, and stack hours from as many local businesses as it takes.
          </p>
        </div>
        <div className="steps-grid">
          <StepCard n={1} icon="user" title="Build one profile" body="Add your program, skills and required hours once. Standardized so every employer reads it the same way." />
          <StepCard n={2} icon="sparkle" title="Get ranked matches" body="See opportunities scored by skill fit, field and location — each showing exactly how many hours it offers." />
          <StepCard n={3} icon="award" title="Stack hours, get certified" body="Combine placements from several shops. We track the total and issue your completion certificate." />
        </div>
      </section>

      {/* SIGNATURE FEATURE (teal-tinted) */}
      <section className="land-signature">
        <div className="container">
          <div className="land-sig-grid">
            <div>
              <div className="eyebrow" style={{ color: "var(--teal)" }}>
                Signature feature
              </div>
              <h2 style={{ fontSize: "clamp(27px,3.2vw,40px)", marginTop: 12, lineHeight: 1.08 }}>No single shop has to take all your hours.</h2>
              <p style={{ color: "var(--ink-2)", fontSize: 16.5, marginTop: 18, lineHeight: 1.55, maxWidth: 440 }}>
                A café offers 120 hours, a marketing agency 150, a studio 100. TalentTie adds them up, tracks approvals from each
                employer, and gets you across the line — then issues a single, verifiable certificate.
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

      {/* CTA band + university badge */}
      <section className="container" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="land-cta">
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="land-uni-badge">
              <span className="dot" style={{ background: "#5eead4" }} /> University partners coming soon — Fanshawe &amp; Western
            </span>
            <h2 style={{ color: "#fff", fontSize: "clamp(26px,3vw,36px)", marginTop: 18, lineHeight: 1.1, maxWidth: 520 }}>
              Ready to turn your hours into a certificate?
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <button className="btn btn-onteal btn-lg" onClick={() => go("login", "student")}>
                <Icon name="cap" size={18} /> I&apos;m a Student
              </button>
              <button className="btn btn-onteal-ghost btn-lg" onClick={() => go("login", "employer")}>
                <Icon name="building" size={18} /> I&apos;m an Employer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)", background: "#fff" }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="footer-grid">
            <div style={{ maxWidth: 280 }}>
              <Logo size={26} onClick={() => go("landing")} />
              <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 14, lineHeight: 1.5 }}>
                Matching London&apos;s students with local placements. Starting in London, Ontario.
              </p>
            </div>
            <FooterCol title="Product" links={["How it works", "For Students", "For Employers", "Pricing"]} />
            <FooterCol title="Company" links={["About", "Careers", "Partners", "Contact"]} />
            <FooterCol title="London, ON" links={["Fanshawe College", "Western University", "Downtown London", "Get in touch"]} />
          </div>
          <div style={{ borderTop: "1px solid var(--line)", marginTop: 32, paddingTop: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", color: "var(--muted-2)", fontSize: 13 }}>
            <span>© 2026 TalentTie. Made in London, Ontario.</span>
            <span style={{ display: "flex", gap: 18 }}>
              <a>Privacy</a>
              <a>Terms</a>
              <a>Accessibility</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
