"use client";

/* TalentTie — Candidate detail (C4), ported from candidate-detail.jsx.
   Reuses the standardized profile layout; Accept creates a placement. */

import React, { Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Icon, Avatar, MatchBadge, ReasonLine, SkillMatch, SkillChip, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { getStudent, getOpportunity, buildCandidate, employerPostings } from "@/lib/store/selectors";

function CandidateDetailInner() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const { state, shortlist, accept } = useStore();

  const postings = employerPostings(state, state.currentEmployerId).filter((p) => p.status === "active");
  const oppId = params.get("opp") || postings[0]?.id || "o_ma";
  const opp = getOpportunity(state, oppId);
  const student = getStudent(state, id);

  if (!student || !opp) {
    return (
      <div className="page">
        <PageHead title="Candidate not found" />
        <button className="btn btn-primary" onClick={() => router.push("/employer/candidates")}>
          <Icon name="arrowLeft" size={15} /> Back to candidates
        </button>
      </div>
    );
  }

  const c = buildCandidate(state, student, opp);
  const haveSet = new Set(c.have);
  const isShort = c.applicationStatus === "shortlisted";
  const isAccepted = c.applicationStatus === "accepted" || c.applicationStatus === "active";

  return (
    <div className="page">
      <button className="btn btn-quiet btn-sm" onClick={() => router.push(`/employer/candidates?opp=${oppId}`)} style={{ marginBottom: 14 }}>
        <Icon name="arrowLeft" size={15} /> Back to candidates
      </button>

      <div className="detail-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 16, minWidth: 0 }}>
                <Avatar name={c.name} size={64} />
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontSize: 23 }}>{c.name}</h2>
                  <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 14.5, marginTop: 3 }}>{c.program}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--muted)", fontSize: 13, marginTop: 7, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="cap" size={14} /> {c.year}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="mapPin" size={14} /> {c.neighbourhood}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="calendar" size={14} /> {c.availability}
                    </span>
                  </div>
                </div>
              </div>
              <MatchBadge score={c.score} large />
            </div>
            <div className="match-reason" style={{ paddingBottom: 0 }}>
              <Icon name="sparkle" size={15} style={{ color: "var(--primary)", flex: "none", marginTop: 1 }} />
              <ReasonLine items={c.reasons} />
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>Skills for {opp.title}</h3>
            <p className="hint" style={{ marginBottom: 12 }}>
              How this candidate maps to your posting&apos;s required skills
            </p>
            <SkillMatch required={c.required} have={c.have} />

            <h3 style={{ fontSize: 16, margin: "20px 0 10px" }}>All skills</h3>
            <div className="chip-row">
              {c.skills.map((s) => (
                <SkillChip key={s} label={s} state={haveSet.has(s) ? "have" : undefined} />
              ))}
            </div>

            <h3 style={{ fontSize: 16, margin: "20px 0 10px" }}>Certifications</h3>
            <div className="chip-row">
              {c.certifications.map((x) => (
                <span key={x} className="chip">
                  <Icon name="check" size={12} style={{ color: "var(--green)" }} /> {x}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-rail">
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Icon name="clock" size={18} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Hours status</span>
            </div>
            <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 6 }}>
              Needs <b>{c.hoursLeft} more hours</b> to complete their co-op requirement.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 16 }}>
              <button
                className={`btn ${isAccepted ? "btn-success" : "btn-primary"} btn-block btn-lg`}
                onClick={() => accept(c.id, oppId)}
                disabled={isAccepted}
              >
                {isAccepted ? (
                  <>
                    <Icon name="check" size={17} /> Accepted — placement started
                  </>
                ) : (
                  <>
                    <Icon name="checkCircle" size={16} /> Accept &amp; start placement
                  </>
                )}
              </button>
              <button className={`btn ${isShort ? "btn-soft" : "btn-ghost"} btn-block`} onClick={() => shortlist(c.id, oppId)} disabled={isAccepted}>
                <Icon name="star" size={16} style={isShort ? { fill: "var(--primary)" } : {}} /> {isShort ? "Shortlisted" : "Shortlist"}
              </button>
            </div>
          </div>
          <div className="card card-pad" style={{ background: "var(--tl-50)", borderColor: "var(--tl-100)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Icon name="layers" size={18} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 700, fontSize: 14.5 }}>Open to stacking</span>
            </div>
            <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
              This student can split their remaining hours across placements — even a partial offer helps them finish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CandidateDetailPage() {
  return (
    <Suspense fallback={null}>
      <CandidateDetailInner />
    </Suspense>
  );
}
