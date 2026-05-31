"use client";

/* ============================================================
   SideQuest — Student landing page (full redesign).
   Ported from the /sidequest design. All markup is scoped under
   `.sqland` (see app/sqland.css) so the design's generic class
   names never collide with the app's global design system.
   Buttons/links route through the real app via useGo().
   ============================================================ */

import React, { useEffect, useState } from "react";
import { useGo } from "@/components/marketing/chrome";

/* ---------- inline icons (faithful to the design's SVGs) ---------- */
const IcXp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z" /></svg>
);
const IcSpark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" /></svg>
);
const IcStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 7L12 17.8 5.8 21.2 7 14.2 2 9.3l7.1-1z" /></svg>
);
const IcLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2 7l10-4 10 4-10 4z" /><path d="M2 12l10 4 10-4M2 17l10 4 10-4" /></svg>
);
const IcCap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" /></svg>
);
const IcBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3" /></svg>
);
const IcCheck = ({ sw = 2.2 }: { sw?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
const IcCert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="5" /><path d="M9 12.8L7.5 22l4.5-2.7L16.5 22 15 12.8" /></svg>
);
const IcUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4" /><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" /></svg>
);
const IcTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /></svg>
);
const IcClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
);
const IcArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const IcX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 6l12 12M18 6L6 18" /></svg>
);

/* ---------- self-contained initials avatar (no external images) ---------- */
const AVA_PALETTE = ["#7c5cfc", "#e0457b", "#1e7c6b", "#e08a2b", "#3b82c4"];
function avaBg(name: string) {
  const i = name.length % AVA_PALETTE.length;
  return `linear-gradient(135deg, ${AVA_PALETTE[i]}, ${AVA_PALETTE[(i + 1) % AVA_PALETTE.length]})`;
}
function avaInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
function Ava({ name, kind, src }: { name: string; kind: "ava" | "avatar-sm"; src?: string }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={kind} src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
    );
  }
  // Initials fallback — used if a portrait ever fails to load.
  return (
    <span className={`${kind} ava-i`} style={{ background: avaBg(name), fontSize: 15 }} aria-hidden="true">
      {avaInitials(name)}
    </span>
  );
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <a className="brand" onClick={onClick} style={{ cursor: "pointer" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo-img" src="/sidequest-logo.png" alt="SideQuest" />
      <span className="word">Side<b>Quest</b></span>
    </a>
  );
}

const STACK = [
  { name: "Forest City Roasters", hrs: 120, w: 30, c: "var(--c-forest)" },
  { name: "Thames Valley Marketing Group", hrs: 150, w: 37.5, c: "var(--c-thames)" },
  { name: "Northern Currents Studio", hrs: 100, w: 25, c: "var(--c-northern)" },
  { name: "Riverbend Design Co.", hrs: 30, w: 7.5, c: "var(--c-riverbend)" },
];

/* Stacked hours bar that fills segment-by-segment on mount — the hero
   "hours progress" moment (great for the demo GIF). Honors reduced-motion. */
function AnimatedStackbar({ height }: { height?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setOn(true), reduce ? 0 : 280);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="stackbar" style={height ? { height } : undefined}>
      {STACK.map((s, i) => (
        <span
          key={s.name}
          style={{
            width: on ? `${s.w}%` : "0%",
            background: s.c,
            transition: "width .85s cubic-bezier(.22,.61,.36,1)",
            transitionDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

/* Count-up for the big "400" total, synced with the bar fill. */
function CountUp({ to, className }: { to: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let start = 0;
    const dur = 1300;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => {
      if (reduce) setN(to);
      else raf = requestAnimationFrame(tick);
    }, reduce ? 0 : 280);
    return () => { clearTimeout(delay); cancelAnimationFrame(raf); };
  }, [to]);
  return <span className={className}>{n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>;
}

export function LandingPage() {
  const go = useGo();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toStudent = () => go("login", "student");
  const toEmployer = () => go("employers");

  return (
    <div className="sqland">
      {/* ===================== NAV ===================== */}
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="wrap nav-inner">
          <Brand onClick={() => go("students")} />
          <nav className="nav-seg" aria-label="Audience">
            <a className="active" style={{ cursor: "pointer" }} onClick={() => go("students")}>For Students</a>
            <a style={{ cursor: "pointer" }} onClick={toEmployer}>For Employers</a>
          </nav>
          <div className="nav-right">
            <a className="login" style={{ cursor: "pointer" }} onClick={() => go("login")}>Log in</a>
            <a className="btn btn-primary btn-sm" style={{ cursor: "pointer" }} onClick={toStudent}>Get started</a>
          </div>
        </div>
      </header>

      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="pill-quest">
              Your degree is the main quest.
              <span className="xp"><IcXp /> +XP</span>
            </span>
            <h1>Your career starts<br />with <span className="accent">SideQuest.</span></h1>
            <p className="hero-lede">
              Stack your required co-op hours across London&apos;s local businesses, get matched on the skills you
              didn&apos;t know counted, and walk away with one verified completion certificate.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" style={{ cursor: "pointer" }} onClick={toStudent}><IcCap /> Start your SideQuest</a>
              <a className="btn btn-ghost" style={{ cursor: "pointer" }} onClick={toEmployer}><IcBuilding /> I&apos;m an Employer</a>
            </div>
            <div className="hero-stats">
              <div className="stat"><div className="num">60,000+</div><div className="lbl">students · Fanshawe &amp; Western</div></div>
              <div className="stat"><div className="num">Free</div><div className="lbl">to get placed &amp; certified</div></div>
              <div className="stat"><div className="num">WSIB</div><div className="lbl">covered placements</div></div>
            </div>
          </div>

          {/* product dashboard mockup */}
          <div className="card-ui dash-window">
            <div className="dash-bar"><i /><i /><i /><span>app.sidequest.ca / dashboard</span></div>
            <div className="dash-body">
              <div className="profile-row">
                <Ava name="Maya Thompson" kind="avatar-sm" src="/people/maya.jpg" />
                <div>
                  <div className="ui-title">Maya&apos;s co-op hours</div>
                  <div className="ui-sub">Business Administration · Fanshawe</div>
                </div>
                <span className="chip-unlocked" style={{ marginLeft: "auto" }}><IcCert /> Certificate unlocked</span>
              </div>

              <div className="tiles">
                <div className="tile"><div className="t-num">4</div><div className="t-lbl">placements stacked</div></div>
                <div className="tile"><div className="t-num">0h</div><div className="t-lbl">hours remaining</div></div>
                <div className="tile accent"><div className="t-num">100%</div><div className="t-lbl">approved &amp; verified</div></div>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "4px 0 14px", flexWrap: "wrap" }}>
                <CountUp to={400} className="bignum" /><span className="bignum"><small>/ 400 hours</small></span>
                <span
                  style={{
                    marginLeft: "auto",
                    alignSelf: "center",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--cream)",
                    color: "var(--amber-text)",
                    fontWeight: 800,
                    fontSize: 15,
                    padding: "5px 13px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" /></svg>
                  <CountUp to={4000} /> XP
                </span>
              </div>
              <AnimatedStackbar />
              <ul className="legend">
                {STACK.map((s) => (
                  <li key={s.name}>
                    <span className="dot" style={{ background: s.c }} />
                    <span className="nm">{s.name}</span>
                    <span className="status">Approved</span>
                    <span className="hrs">{s.hrs}h</span>
                  </li>
                ))}
              </ul>
              <div className="ui-foot" style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <IcLayers /> Four local businesses · one certificate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS STRIP ===================== */}
      <section className="strip">
        <div className="wrap">
          <div className="strip-top">
            <div className="big">60,000+<small>students across Fanshawe &amp; Western</small></div>
            <div className="strip-div" />
            <div className="strip-hood">
              <h4>Hiring across London neighbourhoods</h4>
              <div className="hoods">
                {["Downtown", "Old East Village", "Wortley Village", "SoHo", "Hyde Park", "Masonville", "Byron", "Westmount"].map((h) => (
                  <span key={h} className="hood">{h}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="strip-rule" />
          <div className="trust">
            <span className="lab">Trusted by local businesses</span>
            {[
              ["FC", "Forest City Roasters", "var(--c-forest)"],
              ["TV", "Thames Valley Marketing", "var(--c-thames)"],
              ["NC", "Northern Currents Studio", "var(--c-northern)"],
              ["RD", "Riverbend Design", "var(--c-riverbend)"],
              ["IW", "Innovation Works", "var(--c-innovation)"],
              ["PB", "Powerhouse Brewing", "var(--c-powerhouse)"],
            ].map(([m, n, c]) => (
              <span key={n} className="biz"><span className="bm" style={{ background: c }}>{m}</span>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="section">
        <div className="wrap">
          <div className="split-head">
            <div>
              <span className="eyebrow"><IcLayers /> How it works</span>
              <h2 style={{ marginTop: 18 }}>Three steps to placed.</h2>
            </div>
            <p className="intro">Build one profile, get ranked matches, and stack hours from as many local businesses as it takes.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-ico"><IcUser /></div>
              <span className="no">01</span>
              <h3>Build one profile</h3>
              <p>Add your program, skills and required hours once — or let us read them off your résumé in seconds.</p>
            </div>
            <div className="step">
              <div className="step-ico"><IcSpark /></div>
              <span className="no">02</span>
              <h3>Get ranked matches</h3>
              <p>See opportunities scored on real skills — including the transferable ones we surface from your experience.</p>
            </div>
            <div className="step">
              <div className="step-ico"><IcCert /></div>
              <span className="no">03</span>
              <h3>Stack hours, get certified</h3>
              <p>Combine placements from several shops. We track the total and issue your completion certificate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FRAMEWORK + MATCH MOCKUP ===================== */}
      <section className="section framework">
        <div className="wrap">
          <div className="fw-head">
            <span className="eyebrow"><IcTarget /> Our framework</span>
            <h2>Matches you can see the reasons for.</h2>
            <p>We weigh a few things to rank your best fits — including the experience you didn&apos;t know counted. Every match shows you exactly why.</p>
          </div>

          <div className="fw-grid">
            <div>
              <div className="reasons">
                <div className="reason">
                  <div className="reason-ico"><IcCheck /></div>
                  <h3>Skills you list</h3>
                  <p>The tools and abilities you&apos;re already confident in.</p>
                </div>
                <div className="reason feature">
                  <div className="reason-ico"><IcSpark /></div>
                  <h3>Transferable skills</h3>
                  <p>The experience hiding in your résumé — a serving job that taught you teamwork, a club that taught you outreach. We surface it and count it.</p>
                  <span className="tag">Our differentiator</span>
                </div>
                <div className="reason">
                  <div className="reason-ico"><IcTarget /></div>
                  <h3>Your field</h3>
                  <p>Placements that fit your program and where you want to go.</p>
                </div>
                <div className="reason">
                  <div className="reason-ico"><IcClock /></div>
                  <h3>Your hours</h3>
                  <p>Roles sized to the co-op hours you still have left to complete.</p>
                </div>
              </div>
              <div className="fw-note">
                <IcSpark />
                <span>Transparent matching — every opportunity shows the skills you have, the ones from your experience, and the ones still to build.</span>
              </div>
            </div>

            {/* live match-results product mockup */}
            <div className="card-ui match-card">
              <div className="match-head">
                <span className="mh-ico"><IcSpark /></span>
                <div><b>Top match for you</b><div className="mh-sub">Ranked from 38 open placements</div></div>
              </div>
              <div className="match-body">
                <div className="match-top">
                  <div>
                    <div className="match-role">Junior Studio Assistant</div>
                    <div className="match-meta"><span className="biz-dot" /> Northern Currents Studio · Wortley Village · 100 co-op hours</div>
                  </div>
                  <div className="score">
                    <div className="ring"><b>94%</b></div>
                    <div className="s-lbl">match</div>
                  </div>
                </div>

                <div className="why-lbl">Why you matched</div>
                <ul className="why">
                  <li>
                    <span className="w-ico"><IcCheck /></span>
                    <div><div className="w-main">Skills you list</div><div className="w-sub">Adobe Suite · layout · client comms</div></div>
                    <span className="w-pill hi">Strong</span>
                  </li>
                  <li>
                    <span className="w-ico"><IcSpark /></span>
                    <div><div className="w-main">Transferable skills</div><div className="w-sub">Teamwork — from your serving job</div></div>
                    <span className="w-pill counted">+ Counted</span>
                  </li>
                  <li>
                    <span className="w-ico"><IcTarget /></span>
                    <div><div className="w-main">Your field</div><div className="w-sub">Graphic Design · creative placement</div></div>
                    <span className="w-pill fit">Aligned</span>
                  </li>
                  <li>
                    <span className="w-ico"><IcClock /></span>
                    <div><div className="w-main">Your hours</div><div className="w-sub">Fills 100 of your 280h remaining</div></div>
                    <span className="w-pill hours">100h</span>
                  </li>
                </ul>

                <div className="match-actions">
                  <a className="btn btn-primary btn-sm" style={{ cursor: "pointer" }} onClick={toStudent}>Express interest</a>
                  <a className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }} onClick={toStudent}>Save for later</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SIGNATURE FEATURE ===================== */}
      <section className="section">
        <div className="wrap sig-grid">
          <div className="sig">
            <span className="eyebrow"><IcLayers /> Signature feature</span>
            <h2>No single shop has to take all your hours.</h2>
            <p className="body">A café offers 120 hours, a marketing agency 150, a studio 100. SideQuest adds them up, tracks approvals from each employer, and gets you across the line — then issues a single, verifiable certificate.</p>
            <ul className="sig-list">
              <li><span className="li-ico"><IcLayers /></span>Partial hours welcome — even 60 hours helps</li>
              <li><span className="li-ico"><IcCheck /></span>Every employer approves their own hours</li>
              <li><span className="li-ico"><IcCert /></span>One certificate, recognized across placements</li>
            </ul>
            <a className="btn btn-primary" style={{ cursor: "pointer" }} onClick={toStudent}>See your hours dashboard <IcArrow /></a>
          </div>

          {/* simpler summary card */}
          <div className="card-ui card-summary">
            <div className="ui-head">
              <div>
                <div className="ui-title">Hours summary</div>
                <div className="ui-sub">Maya · Business Administration</div>
              </div>
              <span className="chip-unlocked"><IcCert /> Complete</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "22px 0 16px" }}>
              <span className="bignum">400</span><span className="bignum"><small>/ 400 hours</small></span>
            </div>
            <AnimatedStackbar height={15} />
            <ul className="legend" style={{ marginTop: 14 }}>
              {STACK.map((s) => (
                <li key={s.name}>
                  <span className="dot" style={{ background: s.c }} />
                  <span className="nm">{s.name}</span>
                  <span className="hrs">{s.hrs}h</span>
                </li>
              ))}
            </ul>
            <div className="ui-foot" style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <IcLayers /> Four local businesses · one certificate
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="section">
        <div className="wrap">
          <div className="split-head">
            <div>
              <span className="eyebrow"><IcSpark /> Student voices</span>
              <h2 style={{ marginTop: 18 }}>Careers, kickstarted.</h2>
            </div>
            <p className="intro">Hundreds of London students have turned scattered gigs into a finished co-op and a verified head start.</p>
          </div>
          <div className="tcards">
            <div className="tcard feature">
              <span className="quote-mark">&ldquo;</span>
              <p className="quote">SideQuest helped me kickstart my career. I stacked three placements in one term and finished my co-op hours without quitting my part-time job.</p>
              <div className="person">
                <Ava name="Maya Thompson" kind="ava" src="/people/maya.jpg" />
                <div className="who"><b>Maya Thompson</b><span>Business Administration · Fanshawe</span></div>
              </div>
            </div>
            <div className="tcard">
              <div className="stars">{Array.from({ length: 5 }).map((_, i) => <IcStar key={i} />)}</div>
              <span className="quote-mark">&ldquo;</span>
              <p className="quote">I didn&apos;t think my café job counted for anything. SideQuest pulled real skills off my résumé and matched me to a marketing role.</p>
              <div className="person">
                <Ava name="Jordan Bélanger" kind="ava" src="/people/jordan.jpg" />
                <div className="who"><b>Jordan Bélanger</b><span>Media &amp; Communications · Western</span></div>
              </div>
            </div>
            <div className="tcard">
              <div className="stars">{Array.from({ length: 5 }).map((_, i) => <IcStar key={i} />)}</div>
              <span className="quote-mark">&ldquo;</span>
              <p className="quote">The certificate made my résumé legit — I walked into interviews with verified hours instead of just promises.</p>
              <div className="person">
                <Ava name="Aanya Gupta" kind="ava" src="/people/aanya.jpg" />
                <div className="who"><b>Aanya Gupta</b><span>Graphic Design · Fanshawe</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section className="section pricing">
        <div className="wrap">
          <div className="price-head">
            <span className="eyebrow"><IcLayers /> Pricing</span>
            <h2>Start free. Level up when you&apos;re ready.</h2>
            <p>Getting placed and certified is always free. SideQuest+ is the boost — and it&apos;s on the house if your school is a partner.</p>
          </div>
          <div className="plans">
            <div className="plan">
              <div className="plan-top"><span className="plan-name">SideQuest</span></div>
              <div className="price"><span className="amt">$0</span><span className="per">free, forever</span></div>
              <p className="sub">Everything you need to finish your co-op.</p>
              <ul className="feat">
                {["See your match scores & reasons", "Browse every local placement", "Stack hours across businesses", "Earn your completion certificate", "Express interest — 5 / month"].map((f) => (
                  <li key={f}><span className="fk"><IcCheck sw={3} /></span>{f}</li>
                ))}
                <li className="muted"><span className="fk off"><IcX /></span>Boosted profile &amp; coaching</li>
              </ul>
              <a className="btn btn-ghost" style={{ cursor: "pointer" }} onClick={toStudent}>Create free account</a>
            </div>
            <div className="plan plus">
              <div className="plan-top">
                <span className="plan-name">SideQuest <span className="pl">+</span></span>
                <span className="badge-pop"><IcSpark /> Most popular</span>
              </div>
              <div className="price"><span className="amt">$10</span><span className="per">/ month</span></div>
              <p className="sub">Free if your school is a partner.</p>
              <ul className="feat">
                {["Everything in SideQuest", "Unlimited express interest", "Get boosted to employers", "See who viewed & shortlisted you", "AI résumé + transferable-skills coaching", "Early access to new postings"].map((f) => (
                  <li key={f}><span className="fk amber"><IcCheck sw={3} /></span>{f}</li>
                ))}
              </ul>
              <a className="btn btn-primary" style={{ cursor: "pointer" }} onClick={toStudent}>Get SideQuest+ <IcArrow /></a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SCHOOL BAND ===================== */}
      <section className="school">
        <div className="wrap">
          <div className="school-card">
            <div>
              <span className="school-badge"><span className="led" /> School-sponsored access</span>
              <h2>Is your school a partner? Then SideQuest+ is <em>free.</em></h2>
              <p>When your college or university partners with us, they cover the upgrade for every student. Check with your school email — we verify the domain instantly, no paperwork.</p>
              <div className="mini">
                <span><IcCheck /> Instant email-domain check</span>
                <span><IcCheck /> Student ID upload if needed</span>
              </div>
            </div>
            <div className="school-form">
              <label htmlFor="sq-school-email">Check your school</label>
              <div className="school-input">
                <input id="sq-school-email" type="email" placeholder="you@fanshawec.ca" />
                <button className="btn btn-sm" onClick={toStudent}>Check <IcArrow /></button>
              </div>
              <button className="btn btn-block" onClick={toStudent}>Create my free account</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="final">
        <div className="wrap">
          <div className="final-card">
            <span className="final-badge"><span className="led" /> University partners coming soon — Fanshawe &amp; Western</span>
            <h2>Ready to turn your hours into a certificate?</h2>
            <div className="final-cta">
              <a className="btn btn-white" style={{ cursor: "pointer" }} onClick={toStudent}><IcCap /> Start your SideQuest</a>
              <a className="btn btn-ondark" style={{ cursor: "pointer" }} onClick={toEmployer}><IcBuilding /> I&apos;m an Employer</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <Brand onClick={() => go("students")} />
              <p className="tag">Real experience before you graduate. Starting in London, Ontario.</p>
              <span className="wsib"><IcCheck /> WSIB-covered placements</span>
            </div>
            <div>
              <h5>Students</h5>
              <ul>{["How it works", "Pricing", "Find placements", "Your certificate"].map((l) => (
                <li key={l}><a style={{ cursor: "pointer" }} onClick={toStudent}>{l}</a></li>
              ))}</ul>
            </div>
            <div>
              <h5>Employers</h5>
              <ul>{["Why SideQuest", "Pay per placement", "Post a role", "WSIB coverage"].map((l) => (
                <li key={l}><a style={{ cursor: "pointer" }} onClick={toEmployer}>{l}</a></li>
              ))}</ul>
            </div>
            <div>
              <h5>London, ON</h5>
              <ul>{["Fanshawe College", "Western University", "Partner with us", "Get in touch"].map((l) => (
                <li key={l}><a style={{ cursor: "pointer" }} onClick={() => go("students")}>{l}</a></li>
              ))}</ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span className="cc">© 2026 SideQuest. Made in London, Ontario.</span>
            <span className="links"><a>Privacy</a><a>Terms</a><a>Accessibility</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
