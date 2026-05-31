"use client";

/* SideQuest — Student profile (B7), ported from student-hours.jsx.
   Editable required-hours field + verified-hours summary + history. */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, Avatar, SkillChip, PageHead } from "@/components/ui";
import { CoTile } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { currentStudent, placementVMs, approvedHours } from "@/lib/store/selectors";
import { getCompanyColor } from "@/lib/taxonomies";

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { state, setRequiredHours } = useStore();
  const s = currentStudent(state);
  const placements = placementVMs(state, s.id);
  const approved = approvedHours(state, s.id);
  const pct = Math.round((approved / s.hoursRequired) * 100);

  const [editingHours, setEditingHours] = useState(false);
  const [hoursVal, setHoursVal] = useState(s.hoursRequired);

  return (
    <div className="page">
      <PageHead
        kicker="My profile"
        title="Your standardized profile"
        sub="Every employer reads this the same way — that's what makes matching fair and fast."
        action={
          <button className="btn btn-ghost">
            <Icon name="edit" size={16} /> Edit profile
          </button>
        }
      />

      <div className="profile-grid">
        {/* Identity card */}
        <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar name={s.name} size={68} />
            <div>
              <h3 style={{ fontSize: 21 }}>{s.name}</h3>
              <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 14, marginTop: 3 }}>{s.program}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 13, marginTop: 5 }}>
                <Icon name="mapPin" size={13} /> {s.location}, London ON
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: "var(--line)" }} />
          <div className="profile-fields">
            <ProfileField label="School">{s.school}</ProfileField>
            <ProfileField label="Year">{s.year}</ProfileField>
            <ProfileField label="Availability">{s.availability}</ProfileField>
            <ProfileField label="Email">test@test.com</ProfileField>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>Skills</div>
            <div className="chip-row">
              {s.skills.map((sk) => (
                <SkillChip key={sk} label={sk} state="have" />
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>Certifications</div>
            <div className="chip-row">
              {s.certifications.map((c) => (
                <span key={c} className="chip">
                  <Icon name="check" size={12} style={{ color: "var(--green)" }} /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Side: hours requirement + completeness */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>Hours required</div>
              <button
                className="btn btn-quiet btn-sm"
                style={{ height: 28, padding: "0 8px" }}
                onClick={() => {
                  setEditingHours((e) => !e);
                  setHoursVal(s.hoursRequired);
                }}
              >
                <Icon name="edit" size={14} /> {editingHours ? "Cancel" : "Edit"}
              </button>
            </div>
            {editingHours ? (
              <div style={{ marginTop: 12 }}>
                <input
                  className="input tnum"
                  type="number"
                  value={hoursVal}
                  onChange={(e) => setHoursVal(+e.target.value || 0)}
                  style={{ fontSize: 22, fontWeight: 800, height: 52 }}
                />
                <p className="hint" style={{ marginTop: 8 }}>
                  Set by your program&apos;s co-op requirement.
                </p>
                <button
                  className="btn btn-primary btn-block btn-sm"
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    setRequiredHours(hoursVal);
                    setEditingHours(false);
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div className="tnum" style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.03em", marginTop: 8 }}>
                  {s.hoursRequired} <span style={{ fontSize: 18, color: "var(--muted)", fontWeight: 600 }}>hours</span>
                </div>
                <p className="hint" style={{ marginTop: 2 }}>
                  Co-op requirement for your program
                </p>
              </>
            )}
          </div>

          <div className="card card-pad" style={{ background: "var(--tl-50)", borderColor: "var(--tl-100)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="sparkle" size={20} style={{ color: "var(--primary)" }} />
              <div style={{ fontWeight: 700, fontSize: 15 }}>Profile strength</div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="bar">
                <div className="bar-seg" style={{ width: `${s.profileStrength}%`, background: "var(--primary)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12.5, fontWeight: 600 }}>
                <span style={{ color: "var(--primary)" }}>{s.profileStrength}% complete</span>
                <span style={{ color: "var(--muted)" }}>{s.profileStrength >= 80 ? "Strong" : "Building"}</span>
              </div>
            </div>
            <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
              Add a portfolio link to reach 100% and rank higher in employer searches.
            </p>
          </div>
        </div>
      </div>

      {/* Verified hours summary + placement history */}
      <div className="profile-lower">
        <div className="card card-pad">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            <h3 style={{ fontSize: 17 }}>Verified hours summary</h3>
            <button className="btn btn-soft btn-sm" onClick={() => router.push("/student/certificate")}>
              <Icon name="award" size={15} /> Certificate progress
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="tnum" style={{ fontSize: 34, fontWeight: 800, color: "var(--primary)" }}>
              {approved}
            </span>
            <span style={{ color: "var(--muted)", fontWeight: 600 }}>
              of {s.hoursRequired} verified · {pct}%
            </span>
          </div>
          <div className="bar bar-lg" style={{ marginTop: 12 }}>
            {placements.map((p) => (
              <div key={p.id} className="bar-seg" style={{ width: `${(p.approved / s.hoursRequired) * 100}%`, background: getCompanyColor(p.company) }} />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 14 }}>
            {placements.map((p) => (
              <span key={p.id} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>
                <span className="dot" style={{ width: 9, height: 9, background: getCompanyColor(p.company) }} /> {p.company}{" "}
                <span className="tnum" style={{ color: "var(--muted)" }}>· {p.approved}h</span>
              </span>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 17, marginBottom: 14 }}>Placement history</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {placements.map((p) => (
              <div key={p.id} className="hist-row">
                <CoTile name={p.company} size={40} radius={11} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.role}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12.5 }}>
                    {p.company} · since {p.started}
                  </div>
                </div>
                {p.status === "complete" ? (
                  <span className="tag tag-green" style={{ height: 24 }}>
                    <Icon name="check" size={12} /> Complete
                  </span>
                ) : (
                  <span className="tag tag-blue" style={{ height: 24 }}>
                    <span className="dot" style={{ background: "var(--primary)" }} /> Active
                  </span>
                )}
                <span className="tnum" style={{ fontWeight: 800, fontSize: 14, minWidth: 42, textAlign: "right" }}>
                  {p.approved}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
