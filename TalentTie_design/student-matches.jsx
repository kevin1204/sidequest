/* ============================================================
   TalentTie — Student app (Matches)
   ============================================================ */

/* ---------- Match card (student side) ---------- */
function MatchCard({ m, interested, onInterest, onOpen, requiredHours, remaining }) {
  const isInterested = interested.has(m.id);
  const fits = m.offers <= remaining;
  return (
    <div className="match-card hover-lift">
      <div className="match-card-top">
        <button onClick={() => onOpen(m)} style={{ display: "flex", gap: 14, minWidth: 0, textAlign: "left", flex: 1 }}>
          <CoTile name={m.company} />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 17 }}>{m.role}</h3>
            <div style={{ color: "var(--ink-2)", fontSize: 14, fontWeight: 600, marginTop: 4 }}>{m.company}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 13, marginTop: 5 }}>
              <Icon name="mapPin" size={14} /> {m.neighbourhood}, London ON
            </div>
          </div>
        </button>
        <MatchBadge score={m.score} />
      </div>

      <div className="match-reason">
        <Icon name="sparkle" size={15} style={{ color: "var(--primary)", flex: "none", marginTop: 1 }} />
        <ReasonLine items={m.reason} />
      </div>

      <SkillMatch required={m.required} have={m.have} />

      <div className="hours-pill">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", color: "var(--primary)", flex: "none", boxShadow: "var(--sh-xs)" }}>
            <Icon name="clock" size={18} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>
            Offers <b style={{ color: "var(--ink)" }}>{m.offers} of your {requiredHours}</b> required hours
          </span>
        </div>
        {fits
          ? <span className="tag tag-blue" style={{ height: 26 }}><Icon name="check" size={13} /> Fits</span>
          : <span className="hours-frac tnum">{Math.round((m.offers / requiredHours) * 100)}%</span>}
      </div>

      <div style={{ display: "flex", gap: 9, marginTop: 16 }}>
        <button className={`btn ${isInterested ? "btn-success" : "btn-primary"} btn-block`} onClick={() => onInterest(m.id)} disabled={isInterested}>
          {isInterested ? <><Icon name="check" size={17} /> Interest sent</> : <><Icon name="heart" size={16} /> Express interest</>}
        </button>
        <button className="btn btn-ghost" style={{ flex: "none", width: 46, padding: 0 }} title="View details" onClick={() => onOpen(m)}><Icon name="chevRight" size={18} /></button>
      </div>
    </div>
  );
}

/* ---------- Top pick hero match ---------- */
function TopPick({ m, interested, onInterest, onOpen, requiredHours }) {
  const isInterested = interested.has(m.id);
  return (
    <div className="toppick hover-lift" onClick={() => onOpen(m)}>
      <div className="toppick-glow" aria-hidden="true" />
      <div className="toppick-main">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span className="toppick-tag"><Icon name="bolt" size={13} /> Your best match this week</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <CoTile name={m.company} size={58} radius={16} />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 22, letterSpacing: "-.02em" }}>{m.role}</h3>
            <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 15, marginTop: 3 }}>{m.company}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 13.5, marginTop: 5 }}>
              <Icon name="mapPin" size={14} /> {m.neighbourhood}, London ON
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}><SkillMatch required={m.required} have={m.have} /></div>
        <div className="hours-pill" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", color: "var(--primary)", flex: "none", boxShadow: "var(--sh-xs)" }}><Icon name="clock" size={18} /></div>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>Offers <b style={{ color: "var(--ink)" }}>{m.offers} of your {requiredHours}</b> required hours</span>
          </div>
        </div>
      </div>
      <div className="toppick-side" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center" }}>
          <div className="toppick-score tnum">{m.score}<span style={{ fontSize: 20 }}>%</span></div>
          <div style={{ color: "rgba(255,255,255,.82)", fontWeight: 600, fontSize: 13, marginTop: 2 }}>match score</div>
        </div>
        <p style={{ color: "rgba(255,255,255,.9)", fontSize: 13.5, textAlign: "center", lineHeight: 1.5 }}>{m.reason[0]} · {m.reason[1]}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, width: "100%" }}>
          <button className={`btn ${isInterested ? "btn-success" : "btn-onteal"} btn-block`} onClick={() => onInterest(m.id)} disabled={isInterested}>
            {isInterested ? <><Icon name="check" size={17} /> Interest sent</> : <><Icon name="heart" size={16} /> Express interest</>}
          </button>
          <button className="btn btn-onteal-ghost btn-block" onClick={() => onOpen(m)}>View full role</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hours progress hero panel ---------- */
function HoursHero({ store, onPlanner }) {
  const { placements, requiredHours } = store;
  const approved = placements.reduce((s, p) => s + p.approved, 0);
  const pending = placements.reduce((s, p) => s + p.pending, 0);
  const left = Math.max(0, requiredHours - approved);
  const pct = Math.round((approved / requiredHours) * 100);
  const segs = placements.map(p => ({ value: p.approved, color: getCompanyColor(p.company) }));

  return (
    <div className="hours-hero">
      <div className="hh-left">
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,.78)", fontWeight: 600, fontSize: 13 }}>
          <Icon name="target" size={16} /> Hours progress
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 12, whiteSpace: "nowrap" }}>
          <span className="tnum" style={{ fontSize: 52, fontWeight: 800, color: "#fff", lineHeight: .9, letterSpacing: "-.03em" }}>{approved}</span>
          <span style={{ color: "rgba(255,255,255,.7)", fontWeight: 600, fontSize: 18, marginBottom: 4, whiteSpace: "nowrap" }}>/ {requiredHours} hrs</span>
        </div>
        <p style={{ color: "rgba(255,255,255,.85)", marginTop: 10, fontSize: 14.5 }}>
          <b style={{ color: "#fff" }}>{left} hours to go</b> until your completion certificate
          {pending > 0 && <span style={{ color: "rgba(255,255,255,.7)" }}> · {pending} pending approval</span>}
        </p>
        <div style={{ marginTop: 18 }}>
          <div className="bar bar-lg" style={{ background: "rgba(255,255,255,.18)" }}>
            {segs.map((s, i) => <div key={i} className="bar-seg" style={{ width: `${(s.value / requiredHours) * 100}%`, background: s.color }} />)}
            {pending > 0 && <div className="bar-seg" style={{ width: `${(pending / requiredHours) * 100}%`, background: "repeating-linear-gradient(45deg, rgba(255,255,255,.55), rgba(255,255,255,.55) 5px, rgba(255,255,255,.28) 5px, rgba(255,255,255,.28) 10px)" }} />}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: "rgba(255,255,255,.7)", fontSize: 12.5, fontWeight: 600 }}>
            <span>{pct}% complete</span>
            <span>{requiredHours} hrs goal</span>
          </div>
        </div>
        <button className="hh-plan-btn" onClick={onPlanner}>
          <Icon name="layers" size={16} /> Plan my remaining {left} hours <Icon name="arrowRight" size={15} />
        </button>
      </div>
      <div className="hh-right">
        <div style={{ fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,.78)", marginBottom: 12 }}>By placement</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {placements.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 9, color: "#fff", fontSize: 13.5, fontWeight: 600, minWidth: 0 }}>
                <span className="dot" style={{ width: 9, height: 9, background: getCompanyColor(p.company), flex: "none", boxShadow: "0 0 0 2px rgba(255,255,255,.25)" }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.company}</span>
              </span>
              <span className="tnum" style={{ color: "rgba(255,255,255,.85)", fontWeight: 700, fontSize: 13.5, flex: "none", whiteSpace: "nowrap" }}>{p.approved} hrs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Student: Matches page ---------- */
function StudentMatches({ store, go }) {
  const [sort, setSort] = useState("match");
  const [filter, setFilter] = useState("all");
  const approved = store.placements.reduce((s, p) => s + p.approved, 0);
  const remaining = Math.max(0, store.requiredHours - approved);

  let list = [...MATCHES];
  if (filter === "field") list = list.filter(m => m.field);
  if (filter === "big") list = list.filter(m => m.offers >= 120);
  if (filter === "fits") list = list.filter(m => m.offers <= remaining);
  list.sort((a, b) => sort === "match" ? b.score - a.score : b.offers - a.offers);

  const topPick = [...MATCHES].sort((a, b) => b.score - a.score)[0];
  const rest = list.filter(m => m.id !== topPick.id || filter !== "all" || sort !== "match");
  const showTop = filter === "all" && sort === "match";
  const gridList = showTop ? list.filter(m => m.id !== topPick.id) : list;

  const open = (m) => store.openOpportunity(m);

  return (
    <div className="page">
      <HoursHero store={store} onPlanner={() => go("s_planner", "student")} />

      <div style={{ marginTop: 30 }}>
        <PageHead kicker="Your matches" title="Opportunities ranked for you"
          sub={`${MATCHES.length} placements in London matched to your profile`} />

        {showTop && (
          <div style={{ marginBottom: 18 }}>
            <TopPick m={topPick} interested={store.interested} onInterest={store.expressInterest} onOpen={open} requiredHours={store.requiredHours} />
          </div>
        )}

        <div className="match-toolbar">
          <div className="seg seg-wrap">
            {[["all", "All"], ["field", "In my field"], ["big", "120+ hrs"], ["fits", "Fits my remaining hours"]].map(([k, l]) => (
              <button key={k} className={`seg-btn ${filter === k ? "on" : ""}`} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span className="hint hide-sm">Sort by</span>
            <div className="seg">
              <button className={`seg-btn ${sort === "match" ? "on" : ""}`} onClick={() => setSort("match")}>Match</button>
              <button className={`seg-btn ${sort === "hours" ? "on" : ""}`} onClick={() => setSort("hours")}>Hours</button>
            </div>
          </div>
        </div>

        {gridList.length === 0 ? (
          <EmptyState icon="search" title="No matches with these filters"
            body="Try widening your filters — or update your skills and required hours on your profile to surface more London placements."
            ctaLabel="Clear filters" onCta={() => { setFilter("all"); setSort("match"); }} />
        ) : (
          <div className="match-grid">
            {gridList.map(m => (
              <MatchCard key={m.id} m={m} requiredHours={store.requiredHours} remaining={remaining}
                interested={store.interested} onInterest={store.expressInterest} onOpen={open} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MatchCard, TopPick, HoursHero, StudentMatches });
