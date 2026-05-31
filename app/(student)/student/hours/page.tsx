"use client";

/* SideQuest — My Hours / tracker (B3), ported from student-hours.jsx.
   Log hours → pending HourLog; employer approval flows back into these
   totals and the certificate donut. */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, CoTile, ProgressBar, Modal, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import {
  placementVMs,
  approvedHours,
  pendingHours,
  remainingHours,
  certificateEligible,
  currentStudent,
} from "@/lib/store/selectors";
import { getCompanyColor } from "@/lib/taxonomies";
import { levelInfo, fmtXp } from "@/lib/xp";
import type { PlacementVM } from "@/lib/types";

function LogHoursModal({
  placements,
  onClose,
  onLog,
}: {
  placements: PlacementVM[];
  onClose: () => void;
  onLog: (pid: string, week: string, hours: number, note: string) => void;
}) {
  const active = placements.filter((p) => p.status !== "complete");
  const [pid, setPid] = useState(active[0] ? active[0].id : placements[0]?.id ?? "");
  const [week, setWeek] = useState("Jun 23 – Jun 29");
  const [hours, setHours] = useState(16);
  const [note, setNote] = useState("");

  return (
    <Modal onClose={onClose} max={460}>
      <div style={{ padding: "22px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--tl-50)", color: "var(--primary)", display: "grid", placeItems: "center" }}>
            <Icon name="clock" size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 18 }}>Log your hours</h3>
            <p className="hint">Submit a week for employer approval</p>
          </div>
        </div>
        <button className="icon-btn" onClick={onClose}>
          <Icon name="x" size={18} />
        </button>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="field">
          <label>Placement</label>
          <select className="selectbox" value={pid} onChange={(e) => setPid(e.target.value)}>
            {placements.map((p) => (
              <option key={p.id} value={p.id} disabled={p.status === "complete"}>
                {p.company} — {p.role}
                {p.status === "complete" ? " (complete)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Week</label>
          <input className="input" value={week} onChange={(e) => setWeek(e.target.value)} />
        </div>
        <div className="field">
          <label>Hours worked</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-ghost" style={{ width: 44, padding: 0, flex: "none" }} onClick={() => setHours((h) => Math.max(1, h - 1))}>
              −
            </button>
            <input
              className="input tnum"
              style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}
              type="number"
              value={hours}
              onChange={(e) => setHours(+e.target.value || 0)}
            />
            <button className="btn btn-ghost" style={{ width: 44, padding: 0, flex: "none" }} onClick={() => setHours((h) => h + 1)}>
              +
            </button>
          </div>
        </div>
        <div className="field">
          <label>Work note</label>
          <textarea
            className="textarea"
            rows={2}
            placeholder="What did you work on this week?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <p className="hint">
            Hours are submitted as <b>pending</b> until your employer approves them.
          </p>
        </div>
      </div>
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", display: "flex", gap: 10 }}>
        <button className="btn btn-ghost btn-block" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary btn-block" onClick={() => onLog(pid, week, hours, note || "Logged hours")}>
          Submit {hours} hrs
        </button>
      </div>
    </Modal>
  );
}

function PlacementRow({ p }: { p: PlacementVM }) {
  const color = getCompanyColor(p.company);
  const pct = Math.round((p.approved / p.offered) * 100);
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 13, minWidth: 0 }}>
          <CoTile name={p.company} size={46} />
          <div>
            <h3 style={{ fontSize: 16 }}>{p.role}</h3>
            <div style={{ color: "var(--ink-2)", fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{p.company}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 12.5, marginTop: 4 }}>
              <Icon name="mapPin" size={13} /> {p.neighbourhood}
            </div>
          </div>
        </div>
        {p.status === "complete" ? (
          <span className="tag tag-green">
            <Icon name="check" size={13} /> Hours complete
          </span>
        ) : (
          <span className="tag tag-blue">
            <span className="dot" style={{ background: "var(--primary)" }} /> Active
          </span>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
          <span className="tnum" style={{ fontWeight: 700 }}>
            {p.approved} <span style={{ color: "var(--muted)", fontWeight: 600 }}>/ {p.offered} hrs</span>
            {p.pending > 0 && <span style={{ color: "var(--amber)", fontWeight: 700 }}> · {p.pending} pending</span>}
          </span>
          <span className="tnum" style={{ color: "var(--muted)", fontWeight: 600 }}>
            {pct}%
          </span>
        </div>
        <ProgressBar
          total={p.offered}
          segments={[
            { value: p.approved, color },
            { value: p.pending, color, striped: true },
          ]}
        />
      </div>

      <div className="logtable">
        {p.logs.map((l) => (
          <div key={l.id} className="logrow">
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-2)", fontWeight: 600, fontSize: 13 }}>
              <Icon name="calendar" size={14} style={{ color: "var(--muted-2)" }} /> {l.weekRange}
            </span>
            <span className="tnum" style={{ fontWeight: 700, fontSize: 13 }}>
              {l.hours} hrs
            </span>
            {l.status === "approved" ? (
              <span className="tag tag-green" style={{ height: 22 }}>
                <Icon name="check" size={12} /> Approved
              </span>
            ) : l.status === "pending" ? (
              <span className="tag tag-amber" style={{ height: 22 }}>
                <Icon name="clock" size={12} /> Pending
              </span>
            ) : (
              <span className="tag tag-gray" style={{ height: 22 }}>
                <Icon name="x" size={12} /> Rejected
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Gamified XP panel (10 XP per approved co-op hour) ---------- */
function XpPanel({ approved }: { approved: number }) {
  const { xp, level, title, next, toNext, pct } = levelInfo(approved);

  const [on, setOn] = useState(false);
  const [shownXp, setShownXp] = useState(0);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let start = 0;
    const dur = 1100;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      setShownXp(Math.round((1 - Math.pow(1 - p, 3)) * xp));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const d = setTimeout(() => {
      setOn(true);
      if (reduce) setShownXp(xp);
      else raf = requestAnimationFrame(tick);
    }, reduce ? 0 : 220);
    return () => { clearTimeout(d); cancelAnimationFrame(raf); };
  }, [xp]);

  return (
    <div
      className="card card-pad"
      style={{
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
        background: "linear-gradient(135deg, #fff, var(--gold-tint))",
        borderColor: "var(--gold-line)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: "#fff", color: "var(--gold)", display: "grid", placeItems: "center", border: "1px solid var(--gold-line)", flex: "none", boxShadow: "var(--sh-xs)" }}>
          <Icon name="bolt" size={26} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, fontSize: 17 }}>Level {level} · {title}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 22, padding: "0 9px", borderRadius: 999, background: "var(--gold-tint)", color: "var(--gold)", fontSize: 11.5, fontWeight: 800, border: "1px solid var(--gold-line)" }}>
              <Icon name="bolt" size={11} /> +10 XP / hr
            </span>
          </div>
          <div className="tnum" style={{ fontWeight: 800, fontSize: 30, color: "var(--gold)", letterSpacing: "-.02em", lineHeight: 1.15, marginTop: 2 }}>
            {fmtXp(shownXp)} XP
          </div>
        </div>
      </div>
      <div style={{ flex: "1 1 240px", minWidth: 200, maxWidth: 380 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginBottom: 7 }}>
          <span>{next ? `Level ${level} → ${level + 1}` : "Max level reached"}</span>
          <span className="tnum">{next ? `${fmtXp(toNext)} XP to ${next.title}` : "Maxed out 🎉"}</span>
        </div>
        <div className="bar" style={{ height: 12 }}>
          <div className="bar-seg" style={{ width: on ? `${pct}%` : "0%", background: "linear-gradient(90deg, var(--gold-2), var(--gold))", transition: "width .9s var(--ease)" }} />
        </div>
        <div className="hint" style={{ marginTop: 8 }}>Earn 10 XP for every approved co-op hour — logged hours level you up.</div>
      </div>
    </div>
  );
}

export default function HoursPage() {
  const router = useRouter();
  const { state, logHours } = useStore();
  const [showLog, setShowLog] = useState(false);

  const sid = state.currentStudentId;
  const requiredHours = currentStudent(state).hoursRequired;
  const placements = placementVMs(state, sid);
  const approved = approvedHours(state, sid);
  const pending = pendingHours(state, sid);
  const left = remainingHours(state, sid);
  const complete = certificateEligible(state, sid);
  const pct = Math.round((approved / requiredHours) * 100);

  return (
    <div className="page">
      <PageHead
        kicker="My hours"
        title="Hours tracker"
        sub="Log weekly hours across your placements. Employers approve them, and we total it all up."
        action={
          <button className="btn btn-primary" onClick={() => setShowLog(true)}>
            <Icon name="plus" size={17} /> Log hours
          </button>
        }
      />

      <div className={`cert-banner ${complete ? "done" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
          <div className="cert-ring">
            <svg width="70" height="70" viewBox="0 0 70 70">
              <circle cx="35" cy="35" r="30" fill="none" stroke="var(--line)" strokeWidth="7" />
              <circle
                cx="35"
                cy="35"
                r="30"
                fill="none"
                stroke={complete ? "var(--green)" : "var(--primary)"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - pct / 100)}
                transform="rotate(-90 35 35)"
                style={{ transition: "stroke-dashoffset .8s var(--ease)" }}
              />
            </svg>
            <span className="cert-ring-num tnum">{pct}%</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Icon name="award" size={20} style={{ color: complete ? "var(--green)" : "var(--primary)" }} />
              <h3 style={{ fontSize: 18 }}>{complete ? "Certificate ready!" : "Completion certificate"}</h3>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6, maxWidth: 420 }}>
              {complete ? (
                `You've completed all ${requiredHours} required hours. Your certificate is ready to view and share.`
              ) : (
                <>
                  You&apos;ve banked{" "}
                  <b style={{ color: "var(--ink)" }}>
                    {approved} of {requiredHours}
                  </b>{" "}
                  approved hours
                  {pending > 0 && <> ({pending} pending)</>}. <b style={{ color: "var(--ink)" }}>{left} to go.</b>
                </>
              )}
            </p>
          </div>
        </div>
        <button className={`btn ${complete ? "btn-success" : "btn-primary"}`} onClick={() => router.push("/student/certificate")}>
          <Icon name="award" size={16} /> {complete ? "View certificate" : "Preview certificate"}
        </button>
      </div>

      <XpPanel approved={approved} />

      <div className="placement-list">
        {placements.map((p) => (
          <PlacementRow key={p.id} p={p} />
        ))}
      </div>

      {showLog && (
        <LogHoursModal
          placements={placements}
          onClose={() => setShowLog(false)}
          onLog={(pid, week, hours, note) => {
            logHours(pid, week, hours, note);
            setShowLog(false);
          }}
        />
      )}
    </div>
  );
}
