/* ============================================================
   TalentTie — Opportunity detail (student-facing)
   ============================================================ */

function ReasonBreakdown({ m }) {
  const skillPct = Math.round((m.have.length / m.required.length) * 100);
  const rows = [
    { label: "Skills match", value: `${m.have.length} of ${m.required.length} required`, pct: skillPct, icon: "check" },
    { label: "Field fit", value: m.field ? "In your field" : "Adjacent field", pct: m.field ? 100 : 60, icon: "target" },
    { label: "Location", value: `${m.neighbourhood} · in London`, pct: 90, icon: "mapPin" },
    { label: "Hours fit", value: `Offers ${m.offers} hrs`, pct: Math.min(100, Math.round((m.offers / 150) * 100)), icon: "clock" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {rows.map(r => (
        <div key={r.label}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13.5 }}>
              <Icon name={r.icon} size={15} style={{ color: "var(--primary)" }} /> {r.label}
            </span>
            <span style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>{r.value}</span>
          </div>
          <div className="bar"><div className="bar-seg" style={{ width: `${r.pct}%`, background: "var(--primary)" }} /></div>
        </div>
      ))}
    </div>
  );
}

function OpportunityDetail({ store, go }) {
  const m = store.currentOpp;
  if (!m) { go("s_matches", "student"); return null; }
  const isInterested = store.interested.has(m.id);
  const remaining = Math.max(0, store.requiredHours - store.placements.reduce((s, p) => s + p.approved, 0));
  const fits = m.offers <= remaining;

  return (
    <div className="page">
      <button className="btn btn-quiet btn-sm" onClick={() => go("s_matches", "student")} style={{ marginBottom: 14 }}><Icon name="arrowLeft" size={15} /> Back to matches</button>

      <div className="detail-grid">
        {/* main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 16, minWidth: 0 }}>
                <CoTile name={m.company} size={60} radius={16} />
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontSize: 24 }}>{m.role}</h2>
                  <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 15, marginTop: 4 }}>{m.company}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--muted)", fontSize: 13.5, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="mapPin" size={14} /> {m.neighbourhood}, London ON</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="calendar" size={14} /> Posted {m.posted}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="users" size={14} /> {m.applicants} applicants</span>
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
            <SkillMatch required={m.required} have={m.have} />
            <p className="hint" style={{ marginTop: 10 }}>
              <Icon name="check" size={13} style={{ color: "var(--tl-600)", verticalAlign: "-2px" }} /> teal = you have it · grey = skill to build
            </p>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Why you match — full breakdown</h3>
            <ReasonBreakdown m={m} />
          </div>
        </div>

        {/* sticky action rail */}
        <div className="detail-rail">
          <div className="card card-pad">
            <div className="hours-pill" style={{ marginTop: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", color: "var(--primary)", flex: "none", boxShadow: "var(--sh-xs)" }}><Icon name="clock" size={18} /></div>
                <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>Offers <b style={{ color: "var(--ink)" }}>{m.offers} hours</b></span>
              </div>
              {fits && <span className="tag tag-blue" style={{ height: 26 }}><Icon name="check" size={13} /> Fits</span>}
            </div>
            <p className="hint" style={{ marginTop: 10 }}>
              That's {Math.round((m.offers / store.requiredHours) * 100)}% of your {store.requiredHours}-hour requirement
              {fits ? " — and fits within the " + remaining + " you have left." : ` (you have ${remaining} left).`}
            </p>
            {isInterested ? (
              <div className="btn btn-success btn-block" style={{ marginTop: 14, pointerEvents: "none" }}><Icon name="check" size={17} /> Interest sent</div>
            ) : (
              <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }} onClick={() => store.expressInterest(m.id)}><Icon name="heart" size={17} /> Express interest</button>
            )}
            <button className="btn btn-ghost btn-block" style={{ marginTop: 9 }} onClick={() => go("s_applications", "student")}>View my applications</button>
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

Object.assign(window, { OpportunityDetail, ReasonBreakdown });
