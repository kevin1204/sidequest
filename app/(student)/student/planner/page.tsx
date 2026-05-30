"use client";

/* TalentTie — Complete-my-hours planner (B6), ported from planner.jsx.
   The signature differentiator: given the student's REMAINING hours, it
   computes combinations of London placements that add up to the goal,
   then one-tap expresses interest in the whole stack. */

import React from "react";
import { useRouter } from "next/navigation";
import { Icon, CoTile, EmptyState, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { matchesForStudent, approvedHours, remainingHours, currentStudent } from "@/lib/store/selectors";
import { getCompanyColor } from "@/lib/taxonomies";
import type { MatchVM } from "@/lib/types";

interface Stack {
  title: string;
  note: string;
  items: MatchVM[];
}

/** Greedily pick the fewest placements (smallest-first) whose hours cover the gap. */
function coveringStack(cands: MatchVM[], remaining: number): MatchVM[] {
  const sorted = [...cands].sort((a, b) => a.offers - b.offers);
  const picked: MatchVM[] = [];
  let sum = 0;
  for (const m of sorted) {
    if (sum >= remaining) break;
    picked.push(m);
    sum += m.offers;
  }
  return picked;
}

function sameItems(a: MatchVM[], b: MatchVM[]): boolean {
  if (a.length !== b.length) return false;
  const ids = new Set(a.map((m) => m.opportunity.id));
  return b.every((m) => ids.has(m.opportunity.id));
}

function computeStacks(matches: MatchVM[], remaining: number): Stack[] {
  if (remaining <= 0 || matches.length === 0) return [];
  const stacks: Stack[] = [];

  const fewest = coveringStack(matches, remaining);
  if (fewest.length) {
    stacks.push({
      title: fewest.length === 1 ? "Finish in one placement" : `Cover it in ${fewest.length} placements`,
      note: "The leanest way to land on your goal — fewest businesses, least overlap.",
      items: fewest,
    });
  }

  const fieldOnly = coveringStack(matches.filter((m) => m.sameField), remaining);
  if (fieldOnly.length && !stacks.some((s) => sameItems(s.items, fieldOnly))) {
    stacks.push({
      title: "Stay in your field",
      note: "Every placement matches your program — strongest fit and most relevant hours.",
      items: fieldOnly,
    });
  }

  // single placement that covers the remaining with the least buffer
  const singles = matches.filter((m) => m.offers >= remaining).sort((a, b) => a.offers - b.offers);
  const single = singles[0] ? [singles[0]] : [[...matches].sort((a, b) => b.offers - a.offers)[0]];
  if (single[0] && !stacks.some((s) => sameItems(s.items, single))) {
    stacks.push({
      title: "One bigger placement",
      note: "Prefer to stay in one place? This single placement covers most of your remaining hours.",
      items: single,
    });
  }

  return stacks;
}

function StackCard({
  stack,
  remaining,
  featured,
  onInterestStack,
  onOpen,
}: {
  stack: Stack;
  remaining: number;
  featured?: boolean;
  onInterestStack: (items: MatchVM[]) => void;
  onOpen: (id: string) => void;
}) {
  const items = stack.items;
  const total = items.reduce((s, m) => s + m.offers, 0);
  const buffer = total - remaining;
  const allInterested = items.every((m) => m.applicationStatus !== null);
  return (
    <div className={`stack-card hover-lift ${featured ? "featured" : ""}`}>
      <div className="stack-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 16.5 }}>{stack.title}</span>
            <span className={`tag ${buffer <= 0 ? "tag-green" : "tag-blue"}`} style={{ height: 24 }}>
              {buffer <= 0 ? "Covers 100%" : `+${buffer} hr buffer`}
            </span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 5 }}>{stack.note}</p>
        </div>
        <div className="stack-total">
          <div className="tnum" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: "var(--primary)" }}>
            {total}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em", marginTop: 3 }}>
            hours
          </div>
        </div>
      </div>

      <div className="bar bar-lg" style={{ marginTop: 4 }}>
        {items.map((m) => (
          <div
            key={m.opportunity.id}
            className="bar-seg"
            style={{ width: `${Math.min(100, (m.offers / Math.max(total, remaining)) * 100)}%`, background: getCompanyColor(m.company) }}
          />
        ))}
      </div>

      <div className="stack-items">
        {items.map((m, i) => (
          <button key={m.opportunity.id} className="stack-item" onClick={() => onOpen(m.opportunity.id)}>
            <CoTile name={m.company} size={38} radius={10} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{m.company}</div>
              <div style={{ color: "var(--muted)", fontSize: 12.5 }}>{m.role}</div>
            </div>
            <span className="tnum" style={{ fontWeight: 800, fontSize: 15 }}>
              {m.offers}h
            </span>
            {i < items.length - 1 && <span className="stack-plus">+</span>}
          </button>
        ))}
      </div>

      <button
        className={`btn ${allInterested ? "btn-success" : "btn-primary"} btn-block`}
        style={{ marginTop: 16 }}
        onClick={() => onInterestStack(items)}
        disabled={allInterested}
      >
        {allInterested ? (
          <>
            <Icon name="check" size={17} /> Interest sent to all
          </>
        ) : (
          <>
            <Icon name="layers" size={16} /> Express interest in this stack
          </>
        )}
      </button>
    </div>
  );
}

export default function PlannerPage() {
  const router = useRouter();
  const { state, expressInterestStack } = useStore();
  const sid = state.currentStudentId;
  const requiredHours = currentStudent(state).hoursRequired;
  const approved = approvedHours(state, sid);
  const remaining = remainingHours(state, sid);
  const matches = matchesForStudent(state, sid);
  const stacks = computeStacks(matches, remaining);

  const open = (id: string) => router.push(`/student/opportunity/${id}`);

  return (
    <div className="page">
      <PageHead
        kicker="Complete my hours"
        title="Your smart plan to the finish line"
        sub="TalentTie looks at your remaining hours and suggests combinations of London placements that add up to your goal."
      />

      <div className="planner-hero">
        <div className="planner-hero-left">
          <div style={{ color: "rgba(255,255,255,.8)", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="target" size={15} /> Remaining to your certificate
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <span className="tnum" style={{ fontSize: 54, fontWeight: 800, color: "#fff", lineHeight: 0.9 }}>
              {remaining}
            </span>
            <span style={{ color: "rgba(255,255,255,.75)", fontWeight: 600, fontSize: 17 }}>hours</span>
          </div>
          <p style={{ color: "rgba(255,255,255,.85)", marginTop: 10, fontSize: 14, maxWidth: 320 }}>
            You&apos;ve banked {approved} of {requiredHours}. Pick a stack below — we&apos;ll send your interest to every business
            in it at once.
          </p>
        </div>
        <div className="planner-hero-right">
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.8)", marginBottom: 10 }}>How stacking works</div>
          {([
            ["No single shop needs all your hours", "layers"],
            ["We total every approved hour for you", "check"],
            ["Hit your goal → certificate issues", "award"],
          ] as [string, string][]).map(([t, ic]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontSize: 13.5, fontWeight: 500, marginBottom: 9 }}>
              <Icon name={ic} size={16} style={{ color: "rgba(255,255,255,.9)", flex: "none" }} /> {t}
            </div>
          ))}
        </div>
      </div>

      {remaining <= 0 ? (
        <div style={{ marginTop: 26 }}>
          <EmptyState
            icon="award"
            title="You've hit your goal! 🎉"
            body="All your required hours are verified — there's nothing left to plan. Head to your certificate to view and share it."
            ctaLabel="View my certificate"
            onCta={() => router.push("/student/certificate")}
          />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "26px 0 16px" }}>
            <Icon name="sparkle" size={18} style={{ color: "var(--primary)" }} />
            <h3 style={{ fontSize: 18 }}>Suggested stacks</h3>
            <span className="hint">ranked by fit</span>
          </div>

          <div className="stack-grid">
            {stacks.map((s, i) => (
              <StackCard
                key={i}
                stack={s}
                remaining={remaining}
                featured={i === 0}
                onInterestStack={(items) => expressInterestStack(items.map((m) => m.opportunity.id))}
                onOpen={open}
              />
            ))}
          </div>

          <div className="planner-foot">
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Prefer to choose yourself?</div>
              <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 3 }}>
                Browse all {matches.length} ranked matches and build your own combination.
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => router.push("/student/matches")}>
              Browse all matches <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
