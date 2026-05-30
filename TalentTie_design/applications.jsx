/* ============================================================
   TalentTie — My Applications (student)
   ============================================================ */

function PipelineDots({ status }) {
  const idx = APP_STATUS_ORDER.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {APP_STATUS_ORDER.map((s, i) => (
        <React.Fragment key={s}>
          <span title={s} style={{ width: 9, height: 9, borderRadius: "50%", flex: "none",
            background: i <= idx ? "var(--tl-600)" : "var(--line)" }} />
          {i < APP_STATUS_ORDER.length - 1 && <span style={{ width: 14, height: 2, borderRadius: 2, background: i < idx ? "var(--tl-600)" : "var(--line)" }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function ApplicationRow({ a, onOpen }) {
  return (
    <div className="card card-pad app-row hover-lift">
      <div style={{ display: "flex", gap: 14, minWidth: 0, flex: 1, alignItems: "center" }}>
        <CoTile name={a.company} size={46} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 16 }}>{a.role}</h3>
          </div>
          <div style={{ color: "var(--ink-2)", fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{a.company}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--muted)", fontSize: 12.5, marginTop: 5, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="mapPin" size={13} /> {a.neighbourhood}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={13} /> {a.offers} hrs</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="calendar" size={13} /> Applied {a.date}</span>
          </div>
        </div>
      </div>
      <div className="app-row-right">
        <div className="hide-sm"><PipelineDots status={a.status} /></div>
        <StatusPill status={a.status} />
        <MatchBadge score={a.score} />
      </div>
    </div>
  );
}

function StudentApplications({ store, go }) {
  const [tab, setTab] = useState("all");
  const apps = store.applications;
  const counts = {
    all: apps.length,
    active: apps.filter(a => a.status === "Interested" || a.status === "Shortlisted").length,
    placed: apps.filter(a => a.status === "Accepted" || a.status === "Active placement").length,
  };
  let list = apps;
  if (tab === "active") list = apps.filter(a => a.status === "Interested" || a.status === "Shortlisted");
  if (tab === "placed") list = apps.filter(a => a.status === "Accepted" || a.status === "Active placement");

  return (
    <div className="page">
      <PageHead kicker="My applications" title="Where you stand"
        sub="Every opportunity you've expressed interest in, and how each one is progressing." />

      <div className="match-toolbar">
        <div className="seg">
          {[["all", `All (${counts.all})`], ["active", `In progress (${counts.active})`], ["placed", `Placed (${counts.placed})`]].map(([k, l]) => (
            <button key={k} className={`seg-btn ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        <div className="app-legend hide-sm">
          {APP_STATUS_ORDER.map(s => <span key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}><span className="dot" style={{ background: "var(--tl-400)" }} /> {s}</span>)}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="heart" title="No applications here yet"
          body="When you express interest in a placement, it shows up here so you can track every step from interested to placed."
          ctaLabel="Browse matches" onCta={() => go("s_matches", "student")} />
      ) : (
        <div className="placement-list">
          {list.map(a => <ApplicationRow key={a.id} a={a} onOpen={() => go("s_matches", "student")} />)}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { StudentApplications, PipelineDots, ApplicationRow });
