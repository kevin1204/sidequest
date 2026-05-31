"use client";

/* SideQuest — Login screen (ported from auth.jsx). No real auth:
   pick a role, the demo account is pre-filled, "log in" routes to
   the matching dashboard and sets the role in the shared store. */

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon, Avatar } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import type { Role } from "@/lib/types";

function RoleCard({
  active,
  icon,
  title,
  sub,
  onClick,
}: {
  active: boolean;
  icon: string;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        textAlign: "left",
        padding: "18px 18px",
        borderRadius: "var(--r-md)",
        border: `2px solid ${active ? "var(--primary)" : "var(--line)"}`,
        background: active ? "var(--tl-50)" : "#fff",
        boxShadow: active ? "0 0 0 4px var(--tl-100)" : "var(--sh-xs)",
        transition: "all .16s var(--ease)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            display: "grid",
            placeItems: "center",
            background: active ? "var(--primary)" : "var(--bg-2)",
            color: active ? "#fff" : "var(--muted)",
          }}
        >
          <Icon name={icon} size={21} />
        </div>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `2px solid ${active ? "var(--primary)" : "var(--line)"}`,
            background: active ? "var(--primary)" : "#fff",
            display: "grid",
            placeItems: "center",
          }}
        >
          {active && <Icon name="check" size={12} style={{ color: "#fff" }} />}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>{sub}</div>
      </div>
    </button>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { setRole: setStoreRole } = useStore();
  const initialRole = (params.get("role") as Role) || "student";
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("test@test.com");
  const [pw, setPw] = useState("demo1234");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setStoreRole(role);
    router.push(role === "student" ? "/student/matches" : "/employer/postings");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left brand panel */}
      <div className="login-aside">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(700px 380px at 30% 10%, rgba(255,255,255,.16), transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="18" height="18" rx="6" fill="#fff" />
              <rect x="12" y="12" width="18" height="18" rx="6" fill="#5eead4" />
              <rect x="12" y="12" width="8" height="8" rx="3" fill="#0c1322" fillOpacity="0.16" />
            </svg>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-.03em", color: "#fff" }}>SideQuest</span>
          </button>
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="login-quote">
            <Icon name="sparkle" size={18} style={{ color: "#5eead4" }} />
            <p style={{ color: "#fff", fontSize: 16.5, lineHeight: 1.5, fontWeight: 500, marginTop: 10 }}>
              &quot;I finished my 400 hours across a café, a marketing agency and a design studio — all within a 10-minute bike
              ride. The certificate dropped automatically.&quot;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
              <Avatar name="Maya Thompson" size={36} />
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13.5 }}>Maya Thompson</div>
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 12.5 }}>Business Administration · Fanshawe</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginTop: 26 }}>
            {([
              ["sparkle", "Ranked matches by skill, field & location"],
              ["layers", "Stack hours across multiple placements"],
              ["award", "One certificate when you hit your goal"],
            ] as [string, string][]).map(([ic, t]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,.92)", fontSize: 14, fontWeight: 500 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.14)", display: "grid", placeItems: "center", flex: "none" }}>
                  <Icon name={ic} size={16} style={{ color: "#fff" }} />
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 2, color: "rgba(255,255,255,.7)", fontSize: 13 }}>
          Fanshawe College · Western University · Coming soon
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-main">
        <div style={{ position: "absolute", top: 24, right: 28 }}>
          <button className="btn btn-quiet btn-sm" onClick={() => router.push("/")}>
            <Icon name="arrowLeft" size={15} /> Back
          </button>
        </div>
        <form onSubmit={submit} className="login-form fade-up">
          <h1 style={{ fontSize: 28 }}>Welcome back</h1>
          <p style={{ color: "var(--muted)", marginTop: 8, marginBottom: 24 }}>Log in to your SideQuest account.</p>

          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 9 }}>I am a…</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
            <RoleCard active={role === "student"} icon="cap" title="Student" sub="Find placements & track hours" onClick={() => setRole("student")} />
            <RoleCard active={role === "employer"} icon="building" title="Employer" sub="Post roles & meet candidates" onClick={() => setRole("employer")} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field">
              <label>Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label>Password</label>
                <a style={{ fontSize: 12.5, color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>Forgot?</a>
              </div>
              <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 24 }}>
            Log in as {role === "student" ? "Student" : "Employer"} <Icon name="arrowRight" size={17} />
          </button>

          <div style={{ marginTop: 16, padding: "10px 13px", background: "var(--bg-2)", borderRadius: 10, fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="bolt" size={15} style={{ color: "var(--amber)" }} />
            Demo account is pre-filled — just press <b style={{ color: "var(--ink-2)" }}>Log in</b>.
          </div>

          <p style={{ textAlign: "center", marginTop: 22, color: "var(--muted)", fontSize: 13.5 }}>
            New to SideQuest?{" "}
            <a
              style={{ color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
              onClick={() => router.push(role === "student" ? "/onboarding/student" : "/onboarding/employer")}
            >
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
