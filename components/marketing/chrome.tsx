"use client";

/* ============================================================
   SideQuest — Shared marketing chrome (nav, footer, avatar).
   Used by the student landing (/) and the employers page (/employers).
   ============================================================ */

import React from "react";
import { useRouter } from "next/navigation";
import { Icon, Logo } from "@/components/ui";
import { avatarGradient, initials } from "@/lib/taxonomies";

export function useGo() {
  const router = useRouter();
  return (route: "students" | "employers" | "login", role?: "student" | "employer") => {
    if (route === "students") router.push("/");
    else if (route === "employers") router.push("/employers");
    else router.push(role ? `/login?role=${role}` : "/login");
  };
}

/** Gradient-ring avatar. Drop a real headshot into /public/people/ and pass `src`
    to upgrade from initials to a photo — the design already accommodates it. */
export function PersonAvatar({ name, src, size = 46 }: { name: string; src?: string; size?: number }) {
  return (
    <div
      className="person-av"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: src ? undefined : avatarGradient(name),
        backgroundImage: src ? `url(${src})` : undefined,
      }}
    >
      {!src && initials(name)}
    </div>
  );
}

export function MarketingNav({ active }: { active: "students" | "employers" }) {
  const go = useGo();
  return (
    <header className="land-nav">
      <div className="container" style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Logo onClick={() => go("students")} />
        <nav className="mk-toggle" aria-label="Audience">
          <a className={active === "students" ? "on" : ""} onClick={() => go("students")}>
            For Students
          </a>
          <a className={active === "employers" ? "on" : ""} onClick={() => go("employers")}>
            For Employers
          </a>
        </nav>
        <div className="mk-nav-cta">
          <button className="btn btn-quiet btn-sm land-login" onClick={() => go("login")}>
            Log in
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => go("login", active === "employers" ? "employer" : "student")}
          >
            Get started
          </button>
        </div>
      </div>
    </header>
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

export function MarketingFooter() {
  const go = useGo();
  return (
    <footer style={{ borderTop: "1px solid var(--line)", background: "#fff" }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="footer-grid">
          <div style={{ maxWidth: 280 }}>
            <Logo size={26} onClick={() => go("students")} />
            <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 14, lineHeight: 1.5 }}>
              Real experience before you graduate. Starting in London, Ontario.
            </p>
            <div className="wsib-badge" style={{ marginTop: 16 }}>
              <Icon name="check" size={15} /> WSIB-covered placements
            </div>
          </div>
          <FooterCol title="Students" links={["How it works", "Pricing", "Find placements", "Your certificate"]} />
          <FooterCol title="Employers" links={["Why SideQuest", "Pay per placement", "Post a role", "WSIB coverage"]} />
          <FooterCol title="London, ON" links={["Fanshawe College", "Western University", "Partner with us", "Get in touch"]} />
        </div>
        <div
          style={{
            borderTop: "1px solid var(--line)",
            marginTop: 32,
            paddingTop: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            color: "var(--muted-2)",
            fontSize: 13,
          }}
        >
          <span>© 2026 SideQuest. Made in London, Ontario.</span>
          <span style={{ display: "flex", gap: 18 }}>
            <a>Privacy</a>
            <a>Terms</a>
            <a>Accessibility</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
