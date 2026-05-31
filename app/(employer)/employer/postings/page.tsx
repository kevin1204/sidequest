"use client";

/* SideQuest — Employer dashboard (C1), ported from employer.jsx. */

import { useRouter } from "next/navigation";
import { Icon, EmptyState, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { employerPostings, pendingApprovals, currentEmployer } from "@/lib/store/selectors";
import type { Opportunity } from "@/lib/types";

function PostingRow({ p, onView }: { p: Opportunity; onView: () => void }) {
  const draft = p.status === "draft";
  return (
    <div className="card card-pad posting-row hover-lift">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, minWidth: 0, flex: 1 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: draft ? "var(--bg-2)" : "var(--tl-50)",
            color: draft ? "var(--muted)" : "var(--primary)",
            display: "grid",
            placeItems: "center",
            flex: "none",
          }}
        >
          <Icon name="briefcase" size={22} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 16.5 }}>{p.title}</h3>
            {draft ? (
              <span className="tag tag-gray">Draft</span>
            ) : (
              <span className="tag tag-green">
                <span className="dot" style={{ background: "var(--green)" }} /> Active
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--muted)", fontSize: 13, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="mapPin" size={13} /> {p.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="clock" size={13} /> Offers {p.hoursOffered} hrs
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="target" size={13} /> {p.field}
            </span>
          </div>
        </div>
      </div>

      <div className="posting-stats">
        <div className="pstat">
          <div className="tnum pstat-n">{p.seedCandidateCount}</div>
          <div className="pstat-l">Candidates</div>
        </div>
        <div className="pstat">
          <div className="tnum pstat-n">{p.views}</div>
          <div className="pstat-l">Views</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "none" }}>
        <button className="btn btn-primary btn-sm" onClick={onView} disabled={draft} style={{ position: "relative" }}>
          View candidates
          {p.seedNewCount > 0 && <span className="new-pip">{p.seedNewCount} new</span>}
        </button>
        <button className="btn btn-ghost btn-sm">{draft ? "Finish & publish" : "Edit posting"}</button>
      </div>
    </div>
  );
}

export default function PostingsPage() {
  const router = useRouter();
  const { state } = useStore();
  const employer = currentEmployer(state);
  const postings = employerPostings(state, employer.id);
  const active = postings.filter((p) => p.status === "active");
  const totalCands = postings.reduce((s, p) => s + p.seedCandidateCount, 0);
  const approvals = pendingApprovals(state, employer.id).length;

  const stats: [string, number, string, string][] = [
    ["Active postings", active.length, "briefcase", "var(--primary)"],
    ["Total candidates", totalCands, "users", "var(--teal)"],
    ["Hours to approve", approvals, "clock", "var(--amber)"],
  ];

  return (
    <div className="page">
      <PageHead
        kicker="Dashboard"
        title={`Welcome back, ${employer.contact.split(" ")[0]}`}
        sub={`${employer.companyName} · ${employer.location}, London ON`}
        action={
          <button className="btn btn-primary" onClick={() => router.push("/employer/post")}>
            <Icon name="plus" size={17} /> Post an opportunity
          </button>
        }
      />

      <div className="emp-stats">
        {stats.map(([l, n, ic, col]) => (
          <div key={l} className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: `color-mix(in srgb, ${col} 12%, #fff)`, color: col, display: "grid", placeItems: "center", flex: "none" }}>
              <Icon name={ic} size={22} />
            </div>
            <div>
              <div className="tnum" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>
                {n}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, marginTop: 3 }}>{l}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <PageHead title="Your postings" sub={`${active.length} active · ${postings.length - active.length} draft`} />
        <div className="placement-list">
          {postings.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="No postings yet"
              body="Post your first opportunity and we'll start matching London students to it within minutes — partial hours welcome."
              ctaLabel="Post an opportunity"
              onCta={() => router.push("/employer/post")}
            />
          ) : (
            postings.map((p) => <PostingRow key={p.id} p={p} onView={() => router.push(`/employer/candidates?opp=${p.id}`)} />)
          )}
        </div>
      </div>
    </div>
  );
}
