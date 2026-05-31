"use client";

/* SideQuest — Employer dashboard (C1). Two-column cockpit:
   postings + action-needed banner on the left, stats & activity rail right. */

import { useRouter } from "next/navigation";
import { Icon, EmptyState, Avatar } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import {
  employerPostings,
  pendingApprovals,
  currentEmployer,
  candidatesForOpportunity,
  notificationsFor,
} from "@/lib/store/selectors";
import type { Opportunity } from "@/lib/types";

function PostingRow({ p, topName, topScore, onView }: { p: Opportunity; topName?: string; topScore?: number; onView: () => void }) {
  const draft = p.status === "draft";
  const { showToast } = useStore();
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
          {!draft && topName && (
            <div className="posting-topmatch">
              <Icon name="sparkle" size={13} style={{ color: "var(--primary)" }} /> Top match: <b>{topName}</b>
              <span className="match mid" style={{ height: 22, fontSize: 11.5, padding: "0 8px" }}>
                {topScore}%
              </span>
            </div>
          )}
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
          {p.seedNewCount > 0 && <span className="new-pip gold">{p.seedNewCount} new</span>}
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => showToast(draft ? "Draft publishing is coming soon" : "Posting editor is coming soon", "edit")}
        >
          {draft ? "Finish & publish" : "Edit posting"}
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, color, n, label, alert, onClick }: { icon: string; color: string; n: number; label: string; alert?: boolean; onClick?: () => void }) {
  return (
    <button className={`card card-pad stat-card ${onClick ? "clickable" : ""} ${alert ? "alert" : ""}`} onClick={onClick} disabled={!onClick}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: `color-mix(in srgb, ${color} 12%, #fff)`, color, display: "grid", placeItems: "center", flex: "none" }}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div className="tnum" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>{n}</div>
        <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, marginTop: 3 }}>{label}</div>
      </div>
      {onClick && <Icon name="chevRight" size={16} className="stat-arrow" />}
    </button>
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
  const newCandidates = active.reduce((s, p) => s + p.seedNewCount, 0);
  const activity = notificationsFor(state, employer.id).slice(0, 4);
  const hasAction = approvals > 0 || newCandidates > 0;

  const topMatch = (oppId: string) => {
    const c = candidatesForOpportunity(state, oppId)[0];
    return c ? { name: c.name, score: c.score } : undefined;
  };

  return (
    <div className="page page-wide">
      <div
        style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Dashboard</div>
          <h2 className="display dash-title">Welcome back, {employer.contact.split(" ")[0]}</h2>
          <p style={{ color: "var(--muted)", marginTop: 6, fontSize: 14.5 }}>
            {employer.companyName} · {employer.location}, London ON
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => router.push("/employer/post")}>
          <Icon name="plus" size={17} /> Post an opportunity
        </button>
      </div>

      {hasAction && (
        <div className="action-banner" style={{ marginBottom: 20 }}>
          <div className="action-banner-ic">
            <Icon name="bolt" size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>You have things waiting on you</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Keep students moving — a quick review goes a long way.</div>
          </div>
          <div className="action-chips">
            {approvals > 0 && (
              <button className="action-chip" onClick={() => router.push("/employer/approve")}>
                <Icon name="clock" size={15} /> <b>{approvals}</b> hour log{approvals === 1 ? "" : "s"} to approve
              </button>
            )}
            {newCandidates > 0 && (
              <button className="action-chip" onClick={() => router.push("/employer/candidates")}>
                <Icon name="users" size={15} /> <b>{newCandidates}</b> new candidate{newCandidates === 1 ? "" : "s"}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="dash-grid">
        {/* MAIN — postings */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 18 }}>Your postings</h3>
            <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 4 }}>
              {active.length} active · {postings.length - active.length} draft
            </p>
          </div>
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
              postings.map((p) => {
                const tm = p.status === "active" ? topMatch(p.id) : undefined;
                return (
                  <PostingRow
                    key={p.id}
                    p={p}
                    topName={tm?.name}
                    topScore={tm?.score}
                    onView={() => router.push(`/employer/candidates?opp=${p.id}`)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* RAIL — stats + activity */}
        <div className="dash-rail">
          <StatCard icon="briefcase" color="var(--primary)" n={active.length} label="Active postings" />
          <StatCard icon="users" color="var(--teal)" n={totalCands} label="Total candidates" onClick={() => router.push("/employer/candidates")} />
          <StatCard icon="clock" color="var(--gold)" n={approvals} label="Hours to approve" alert={approvals > 0} onClick={() => router.push("/employer/approve")} />

          <div className="rail-card">
            <div className="rail-head">
              <Icon name="bell" size={16} style={{ color: "var(--primary)" }} /> Recent activity
            </div>
            {activity.length === 0 ? (
              <p className="hint">No activity yet.</p>
            ) : (
              activity.map((n) => (
                <div key={n.id} className="rail-row">
                  <Avatar name={n.text.split(" ").slice(0, 2).join(" ")} size={30} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.8, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35 }}>{n.text}</div>
                    <div className="hint" style={{ marginTop: 2 }}>{n.createdAt}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rail-card" style={{ background: "var(--tl-50)", borderColor: "var(--tl-100)" }}>
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <Icon name="trending" size={18} style={{ color: "var(--primary)", flex: "none", marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>Hiring tip</div>
                <p style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.45, marginTop: 3 }}>
                  Postings with 4–5 required skills match students 2× faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
