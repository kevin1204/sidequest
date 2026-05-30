/* ============================================================
   TalentTie — Candidate detail (employer-facing)
   Reuses the standardized student-profile layout + actions.
   ============================================================ */

function CandidateDetail({ store, go }) {
  const c = store.currentCandidate;
  if (!c) { go("e_candidates", "employer"); return null; }
  const isShort = store.shortlisted.has(c.id);
  const isInt = store.empInterested.has(c.id);
  const haveSet = new Set(c.have);

  return (
    <div className="page">
      <button className="btn btn-quiet btn-sm" onClick={() => go("e_candidates", "employer")} style={{ marginBottom: 14 }}><Icon name="arrowLeft" size={15} /> Back to candidates</button>

      <div className="detail-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* identity */}
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 16, minWidth: 0 }}>
                <Avatar name={c.name} size={64} />
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontSize: 23 }}>{c.name}</h2>
                  <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 14.5, marginTop: 3 }}>{c.program}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--muted)", fontSize: 13, marginTop: 7, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="cap" size={14} /> {c.year}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="mapPin" size={14} /> {c.neighbourhood}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon name="calendar" size={14} /> {c.availability}</span>
                  </div>
                </div>
              </div>
              <MatchBadge score={c.score} large />
            </div>
            <div className="match-reason" style={{ paddingBottom: 0 }}>
              <Icon name="sparkle" size={15} style={{ color: "var(--primary)", flex: "none", marginTop: 1 }} />
              <ReasonLine items={c.reason} />
            </div>
          </div>

          {/* skills vs this posting */}
          <div className="card card-pad">
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>Skills for Marketing Assistant</h3>
            <p className="hint" style={{ marginBottom: 12 }}>How this candidate maps to your posting's required skills</p>
            <SkillMatch required={c.required} have={c.have} />

            <h3 style={{ fontSize: 16, margin: "20px 0 10px" }}>All skills</h3>
            <div className="chip-row">
              {c.skills.map(s => <SkillChip key={s} label={s} state={haveSet.has(s) ? "have" : "neutral"} />)}
            </div>

            <h3 style={{ fontSize: 16, margin: "20px 0 10px" }}>Certifications</h3>
            <div className="chip-row">{c.certifications.map(x => <span key={x} className="chip"><Icon name="check" size={12} style={{ color: "var(--green)" }} /> {x}</span>)}</div>
          </div>
        </div>

        {/* action rail */}
        <div className="detail-rail">
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Icon name="clock" size={18} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Hours status</span>
            </div>
            <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 6 }}>Needs <b>{c.hoursLeft} more hours</b> to complete their co-op requirement.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 16 }}>
              <button className={`btn ${isInt ? "btn-success" : "btn-primary"} btn-block btn-lg`} onClick={() => store.empExpressInterest(c.id)} disabled={isInt}>
                {isInt ? <><Icon name="check" size={17} /> Interest sent</> : <><Icon name="heart" size={16} /> Express interest</>}
              </button>
              <button className={`btn ${isShort ? "btn-soft" : "btn-ghost"} btn-block`} onClick={() => store.toggleShortlist(c.id)}>
                <Icon name="star" size={16} style={isShort ? { fill: "var(--primary)" } : {}} /> {isShort ? "Shortlisted" : "Shortlist"}
              </button>
            </div>
          </div>
          <div className="card card-pad" style={{ background: "var(--tl-50)", borderColor: "var(--tl-100)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Icon name="layers" size={18} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 700, fontSize: 14.5 }}>Open to stacking</span>
            </div>
            <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>This student can split their remaining hours across placements — even a partial offer helps them finish.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CandidateDetail });
