"use client";

/* SideQuest — Employer Approve Hours (C5), ported from employer.jsx.
   Approving moves a pending HourLog → approved, which recomputes the
   student's totals, progress bars and certificate eligibility everywhere. */

import React, { useState } from "react";
import { Icon, Avatar, EmptyState, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { pendingApprovals, type ApprovalVM } from "@/lib/store/selectors";

function ApprovalRow({
  a,
  onApprove,
  onReject,
}: {
  a: ApprovalVM;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [resolvedState, setResolvedState] = useState<"approved" | "rejected" | null>(null);
  return (
    <div className={`card card-pad approval-row ${resolvedState ? "resolved" : ""}`}>
      <div style={{ display: "flex", gap: 13, minWidth: 0, flex: 1, alignItems: "center" }}>
        <Avatar name={a.studentName} size={44} src={a.studentPhoto} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 15.5 }}>{a.studentName}</h3>
            <span className="tag tag-gray">{a.role}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13, marginTop: 5 }}>
            <Icon name="calendar" size={13} /> {a.log.weekRange}
          </div>
          <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 7, fontStyle: "italic" }}>&quot;{a.log.note}&quot;</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: "none" }}>
        <div style={{ textAlign: "center" }}>
          <div className="tnum" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>
            {a.log.hours}
          </div>
          <div style={{ color: "var(--muted)", fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>hours</div>
        </div>
        {resolvedState ? (
          <span className={`tag ${resolvedState === "approved" ? "tag-green" : "tag-gray"}`} style={{ height: 36, padding: "0 14px" }}>
            <Icon name={resolvedState === "approved" ? "check" : "x"} size={14} /> {resolvedState === "approved" ? "Approved" : "Rejected"}
          </span>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-danger-ghost btn-sm"
              onClick={() => {
                setResolvedState("rejected");
                onReject();
              }}
            >
              <Icon name="x" size={15} /> Reject
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                setResolvedState("approved");
                onApprove();
              }}
            >
              <Icon name="check" size={15} /> Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApprovePage() {
  const { state, approveHours, rejectHours } = useStore();
  // snapshot the queue on mount so resolved rows stay visible with their badge
  const [queue] = useState<ApprovalVM[]>(() => pendingApprovals(state, state.currentEmployerId));
  const [resolved, setResolved] = useState(0);
  const pendingTotal = queue.reduce((s, a) => s + a.log.hours, 0);

  return (
    <div className="page">
      <PageHead
        kicker="Approve hours"
        title="Hours to approve"
        sub="Students have submitted these weeks for your approval. Approving adds them to their verified total."
      />

      <div className="emp-stats" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--amber-bg)", color: "var(--amber)", display: "grid", placeItems: "center" }}>
            <Icon name="clock" size={22} />
          </div>
          <div>
            <div className="tnum" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
              {queue.length - resolved}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, marginTop: 3 }}>Awaiting approval</div>
          </div>
        </div>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--tl-50)", color: "var(--primary)", display: "grid", placeItems: "center" }}>
            <Icon name="clock" size={22} />
          </div>
          <div>
            <div className="tnum" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
              {pendingTotal}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, marginTop: 3 }}>Pending hours</div>
          </div>
        </div>
      </div>

      {queue.length === 0 ? (
        <div style={{ marginTop: 24 }}>
          <EmptyState icon="check" title="No pending hours" body="When students log hours against your placements, they'll show up here for approval." />
        </div>
      ) : (
        <div className="placement-list" style={{ marginTop: 24 }}>
          {queue.map((a) => (
            <ApprovalRow
              key={a.log.id}
              a={a}
              onApprove={() => {
                approveHours(a.log.id);
                setResolved((r) => r + 1);
              }}
              onReject={() => {
                rejectHours(a.log.id);
                setResolved((r) => r + 1);
              }}
            />
          ))}
        </div>
      )}

      {resolved === queue.length && queue.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <EmptyState icon="check" title="All caught up!" body="You've cleared the approval queue. Students have been notified that their hours are verified." />
        </div>
      )}
    </div>
  );
}
