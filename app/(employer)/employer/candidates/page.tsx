"use client";

/* SideQuest — Employer matched candidates (C3), ported from employer.jsx.
   Same score badge + reason format as the student side (symmetry).
   Shortlist / Accept persist and update the student's application status. */

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon, Avatar, MatchBadge, ReasonLine, SkillMatch, EmptyState, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { candidatesForOpportunity, getOpportunity, employerPostings } from "@/lib/store/selectors";
import type { CandidateVM } from "@/lib/types";

function CandidateCard({
  c,
  onShortlist,
  onAccept,
  onOpen,
}: {
  c: CandidateVM;
  onShortlist: (id: string) => void;
  onAccept: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const isShort = c.applicationStatus === "shortlisted";
  const isAccepted = c.applicationStatus === "accepted" || c.applicationStatus === "active";
  return (
    <div className="match-card hover-lift">
      <div className="match-card-top">
        <button onClick={() => onOpen(c.id)} style={{ display: "flex", gap: 14, minWidth: 0, textAlign: "left", flex: 1 }}>
          <Avatar name={c.name} size={48} />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 17 }}>{c.name}</h3>
            <div style={{ color: "var(--ink-2)", fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>{c.program}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 12.5, marginTop: 5 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="cap" size={13} /> {c.year}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="mapPin" size={13} /> {c.neighbourhood}
              </span>
            </div>
          </div>
        </button>
        <MatchBadge score={c.score} />
      </div>

      <div className="match-reason">
        <Icon name="sparkle" size={15} style={{ color: "var(--primary)", flex: "none", marginTop: 1 }} />
        <ReasonLine items={c.reasons} />
      </div>

      <SkillMatch required={c.required} have={c.have} transferable={c.transferableHave} />

      <div className="hours-pill">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", color: "var(--primary)", flex: "none", boxShadow: "var(--sh-xs)" }}>
            <Icon name="clock" size={18} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>
            Needs <b style={{ color: "var(--ink)" }}>{c.hoursLeft} more hours</b> to complete co-op
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 9, marginTop: 16 }}>
        <button className={`btn ${isAccepted ? "btn-success" : "btn-primary"} btn-block`} onClick={() => onAccept(c.id)} disabled={isAccepted}>
          {isAccepted ? (
            <>
              <Icon name="check" size={17} /> Accepted
            </>
          ) : (
            <>
              <Icon name="checkCircle" size={16} /> Accept
            </>
          )}
        </button>
        <button className={`btn ${isShort ? "btn-soft" : "btn-ghost"}`} onClick={() => onShortlist(c.id)} disabled={isAccepted}>
          <Icon name="star" size={16} style={isShort ? { fill: "var(--primary)" } : {}} /> {isShort ? "Shortlisted" : "Shortlist"}
        </button>
      </div>
    </div>
  );
}

function CandidatesInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { state, shortlist, accept } = useStore();

  const postings = employerPostings(state, state.currentEmployerId).filter((p) => p.status === "active");
  const oppId = params.get("opp") || postings[0]?.id || "o_ma";
  const opp = getOpportunity(state, oppId);

  const [onlyShort, setOnlyShort] = useState(false);
  let list = candidatesForOpportunity(state, oppId);
  const shortlistedCount = list.filter((c) => c.applicationStatus === "shortlisted").length;
  if (onlyShort) list = list.filter((c) => c.applicationStatus === "shortlisted");

  return (
    <div className="page">
      <PageHead
        kicker={opp ? `${opp.title} · ${opp.location}` : "Candidates"}
        title="Matched candidates"
        sub={`${candidatesForOpportunity(state, oppId).length} students matched to this posting · ranked by fit`}
      />

      <div className="match-toolbar">
        <div className="seg">
          <button className={`seg-btn ${!onlyShort ? "on" : ""}`} onClick={() => setOnlyShort(false)}>
            All candidates
          </button>
          <button className={`seg-btn ${onlyShort ? "on" : ""}`} onClick={() => setOnlyShort(true)}>
            Shortlisted {shortlistedCount > 0 && `(${shortlistedCount})`}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span className="hint hide-sm">Sorted by match score</span>
          <button className="btn btn-ghost btn-sm">
            <Icon name="filter" size={15} /> Filters
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon="star"
          tint={false}
          title={onlyShort ? "No shortlisted candidates yet" : "No candidates yet"}
          body={
            onlyShort
              ? "Star a candidate to keep your favourites here for easy comparison."
              : "As students match your posting, they'll appear here ranked by fit."
          }
          ctaLabel={onlyShort ? "View all candidates" : undefined}
          onCta={() => setOnlyShort(false)}
        />
      ) : (
        <div className="match-grid">
          {list.map((c) => (
            <CandidateCard
              key={c.id}
              c={c}
              onShortlist={(id) => shortlist(id, oppId)}
              onAccept={(id) => accept(id, oppId)}
              onOpen={(id) => router.push(`/employer/candidate/${id}?opp=${oppId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={null}>
      <CandidatesInner />
    </Suspense>
  );
}
