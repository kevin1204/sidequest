"use client";

/* SideQuest — Opportunity detail (B2), ported from opportunity-detail.jsx.
   The "Why you match" breakdown is driven by the real score() dimensions. */

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon, CoTile, MatchBadge, SkillMatch, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { getOpportunity, buildMatch, currentStudent, remainingHours } from "@/lib/store/selectors";
import type { MatchVM } from "@/lib/types";

function ReasonBreakdown({ m }: { m: MatchVM }) {
  const rows = [
    {
      label: "Skills match",
      value: `${m.have.length} of ${m.required.length} required`,
      pct: Math.round(m.dimensions.skills * 100),
      icon: "check",
    },
    {
      label: "Transferable skills",
      value: m.transferableHave.length
        ? `${m.transferableHave.length} from your experience`
        : "None detected yet",
      pct: Math.round(m.dimensions.transferable * 100),
      icon: "sparkle",
    },
    {
      label: "Field fit",
      value: m.sameField ? "In your field" : m.dimensions.field >= 0.6 ? "Adjacent field" : "New field",
      pct: Math.round(m.dimensions.field * 100),
      icon: "target",
    },
    { label: "Hours fit", value: `Offers ${m.offers} hrs`, pct: Math.round(m.dimensions.hours * 100), icon: "clock" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {rows.map((r) => (
        <div key={r.label}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13.5 }}>
              <Icon name={r.icon} size={15} style={{ color: "var(--primary)" }} /> {r.label}
            </span>
            <span style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>{r.value}</span>
          </div>
          <div className="bar">
            <div className="bar-seg" style={{ width: `${r.pct}%`, background: "var(--primary)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OpportunityDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { state, expressInterest } = useStore();

  const student = currentStudent(state);
  const opp = getOpportunity(state, id);
  if (!opp) {
    return (
      <div className="page">
        <PageHead title="Opportunity not found" sub="This role is no longer available." />
        <button className="btn btn-primary" onClick={() => router.push("/student/matches")}>
          <Icon name="arrowLeft" size={15} /> Back to matches
        </button>
      </div>
    );
  }

  const m = buildMatch(state, student, opp);
  const isInterested = m.applicationStatus !== null;
  const requiredHours = student.hoursRequired;
  const remaining = remainingHours(state, student.id);
  const fits = m.offers <= remaining;
  const posted = `${m.postedDaysAgo} day${m.postedDaysAgo === 1 ? "" : "s"} ago`;

  return (
    <div className="page">
      <button className="btn btn-quiet btn-sm" onClick={() => router.push("/student/matches")} style={{ marginBottom: 14 }}>
        <Icon name="arrowLeft" size={15} /> Back to matches
      </button>

      <div className="detail-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 16, minWidth: 0 }}>
                <CoTile name={m.company} size={60} radius={16} />
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontSize: 24 }}>{m.role}</h2>
                  <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 15, marginTop: 4 }}>{m.company}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--muted)", fontSize: 13.5, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="mapPin" size={14} /> {m.neighbourhood}, London ON
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="calendar" size={14} /> Posted {posted}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="users" size={14} /> {m.applicants} applicants
                    </span>
                  </div>
                </div>
              </div>
              <MatchBadge score={m.score} large />
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 16, marginBottom: 10 }}>About this role</h3>
            <p style={{ color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.6 }}>{m.about}</p>
            <h3 style={{ fontSize: 16, margin: "20px 0 12px" }}>Required skills</h3>
            <SkillMatch required={m.required} have={m.have} transferable={m.transferableHave} />
            <p className="hint" style={{ marginTop: 10 }}>
              <Icon name="check" size={13} style={{ color: "var(--tl-600)", verticalAlign: "-2px" }} /> teal = you have it ·{" "}
              <Icon name="sparkle" size={13} style={{ color: "var(--tl-600)", verticalAlign: "-2px" }} /> from your experience · grey = skill to build
            </p>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Why you match — full breakdown</h3>
            <ReasonBreakdown m={m} />
          </div>
        </div>

        <div className="detail-rail">
          <div className="card card-pad">
            <div className="hours-pill" style={{ marginTop: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", color: "var(--primary)", flex: "none", boxShadow: "var(--sh-xs)" }}>
                  <Icon name="clock" size={18} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>
                  Offers <b style={{ color: "var(--ink)" }}>{m.offers} hours</b>
                </span>
              </div>
              {fits && (
                <span className="tag tag-blue" style={{ height: 26 }}>
                  <Icon name="check" size={13} /> Fits
                </span>
              )}
            </div>
            <p className="hint" style={{ marginTop: 10 }}>
              That&apos;s {Math.round((m.offers / requiredHours) * 100)}% of your {requiredHours}-hour requirement
              {fits ? ` — and fits within the ${remaining} you have left.` : ` (you have ${remaining} left).`}
            </p>
            {isInterested ? (
              <div className="btn btn-success btn-block" style={{ marginTop: 14, pointerEvents: "none" }}>
                <Icon name="check" size={17} /> Interest sent
              </div>
            ) : (
              <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }} onClick={() => expressInterest(m.opportunity.id)}>
                <Icon name="heart" size={17} /> Express interest
              </button>
            )}
            <button className="btn btn-ghost btn-block" style={{ marginTop: 9 }} onClick={() => router.push("/student/applications")}>
              View my applications
            </button>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 10 }}>About {m.company}</h3>
            <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.55 }}>{m.blurb}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, color: "var(--ink-2)", fontSize: 13.5, fontWeight: 600 }}>
              <Icon name="mapPin" size={14} style={{ color: "var(--muted)" }} /> {m.neighbourhood}, London ON
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
