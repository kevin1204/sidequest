"use client";

/* TalentTie — Employer: Post an Opportunity (C2), ported from employer-post.jsx.
   Publishing adds an Opportunity to the store that feeds the matching engine. */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, CoTile, MatchBadge, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { currentEmployer } from "@/lib/store/selectors";
import { SKILL_LIBRARY, NEIGHBOURHOODS, FIELDS } from "@/lib/taxonomies";
import type { Field } from "@/lib/types";

function SkillPicker({ selected, setSelected }: { selected: string[]; setSelected: (s: string[]) => void }) {
  const [q, setQ] = useState("");
  const avail = SKILL_LIBRARY.filter((s) => !selected.includes(s) && s.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
        {selected.map((s) => (
          <span key={s} className="chip chip-blue" style={{ paddingRight: 6 }}>
            {s}
            <button onClick={() => setSelected(selected.filter((x) => x !== s))} style={{ display: "grid", placeItems: "center", color: "var(--primary)", marginLeft: 2 }}>
              <Icon name="x" size={13} />
            </button>
          </span>
        ))}
        {selected.length === 0 && <span className="hint">No skills added yet</span>}
      </div>
      <input className="input" placeholder="Search skills to add…" value={q} onChange={(e) => setQ(e.target.value)} />
      {q && (
        <div className="skill-suggest">
          {avail.slice(0, 6).map((s) => (
            <button
              key={s}
              className="skill-suggest-item"
              onClick={() => {
                setSelected([...selected, s]);
                setQ("");
              }}
            >
              <Icon name="plus" size={14} /> {s}
            </button>
          ))}
          {avail.length === 0 && (
            <div className="hint" style={{ padding: 8 }}>
              No matches
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PostPage() {
  const router = useRouter();
  const { state, addPosting } = useStore();
  const employer = currentEmployer(state);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState<string[]>(["Social Media", "Content Writing"]);
  const [neighbourhood, setNeighbourhood] = useState("Downtown");
  const [field, setField] = useState<Field>("Business / Marketing");
  const [hours, setHours] = useState(100);
  const [posted, setPosted] = useState(false);

  function submit(status: "active" | "draft") {
    addPosting({
      title: title || "Untitled role",
      description: desc,
      requiredSkills: skills,
      field,
      location: neighbourhood,
      hoursOffered: hours,
      status,
    });
    if (status === "active") setPosted(true);
    else router.push("/employer/postings");
  }

  if (posted) {
    return (
      <div className="page">
        <div className="post-success">
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "var(--green-bg)", color: "var(--green)", display: "grid", placeItems: "center", margin: "0 auto" }}>
            <Icon name="check" size={38} />
          </div>
          <h2 style={{ fontSize: 26, marginTop: 22 }}>Opportunity posted!</h2>
          <p style={{ color: "var(--muted)", marginTop: 10, maxWidth: 400, marginInline: "auto", lineHeight: 1.5 }}>
            <b style={{ color: "var(--ink)" }}>{title || "Your role"}</b> is now live. We&apos;re already matching it against London
            students — you&apos;ll see ranked candidates within minutes.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26 }}>
            <button className="btn btn-ghost" onClick={() => router.push("/employer/postings")}>
              Back to dashboard
            </button>
            <button className="btn btn-primary" onClick={() => router.push("/employer/candidates")}>
              View matched candidates <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="btn btn-quiet btn-sm" onClick={() => router.push("/employer/postings")} style={{ marginBottom: 14 }}>
        <Icon name="arrowLeft" size={15} /> Back to postings
      </button>
      <PageHead
        kicker="New posting"
        title="Post an opportunity"
        sub="Describe the role and the hours you can offer. Partial hours are welcome — every hour helps a student finish."
      />

      <div className="post-grid">
        <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="field">
            <label>Role title</label>
            <input className="input" placeholder="e.g. Marketing Assistant" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="What will the student work on? What does a typical week look like?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Required skills</label>
            <SkillPicker selected={skills} setSelected={setSkills} />
          </div>
          <div className="post-row-2">
            <div className="field">
              <label>Location</label>
              <select className="selectbox" value={neighbourhood} onChange={(e) => setNeighbourhood(e.target.value)}>
                {NEIGHBOURHOODS.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Field / program fit</label>
              <select className="selectbox" value={field} onChange={(e) => setField(e.target.value as Field)}>
                {FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Hours offered</label>
            <div className="hours-slider-wrap">
              <input type="range" min="20" max="400" step="10" value={hours} onChange={(e) => setHours(+e.target.value)} className="hours-slider" />
              <div className="hours-readout tnum">
                {hours}
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}> hrs</span>
              </div>
            </div>
            <div className="note-box">
              <Icon name="layers" size={16} style={{ color: "var(--teal)", flex: "none" }} />
              <span>
                Partial hours are allowed — you can offer just <b>100 hours</b>. Students combine placements from several
                businesses to reach their requirement.
              </span>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="post-preview">
          <div className="hint" style={{ marginBottom: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", fontSize: 11.5 }}>
            Live preview
          </div>
          <div className="match-card" style={{ boxShadow: "var(--sh-md)" }}>
            <div className="match-card-top">
              <div style={{ display: "flex", gap: 13, minWidth: 0 }}>
                <CoTile name={employer.companyName} size={46} />
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 16 }}>{title || "Role title"}</h3>
                  <div style={{ color: "var(--ink-2)", fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{employer.companyName}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 12.5, marginTop: 4 }}>
                    <Icon name="mapPin" size={13} /> {neighbourhood}, London ON
                  </div>
                </div>
              </div>
              <MatchBadge score={90} />
            </div>
            {skills.length > 0 && (
              <div style={{ marginTop: 4 }}>
                <div className="chip-row">
                  {skills.map((s) => (
                    <span key={s} className="chip chip-blue">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="hours-pill">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", color: "var(--primary)", boxShadow: "var(--sh-xs)" }}>
                  <Icon name="clock" size={18} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>
                  Offers <b style={{ color: "var(--ink)" }}>{hours} hours</b>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary btn-lg btn-block" onClick={() => submit("active")}>
              <Icon name="bolt" size={17} /> Publish opportunity
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => submit("draft")}>
              Save as draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
