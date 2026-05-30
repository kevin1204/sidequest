/* ============================================================
   TalentTie — Complete-my-hours planner (student)
   Suggests COMBINATIONS of placements that cover remaining hours.
   ============================================================ */

function byId(id) { return MATCHES.find(m => m.id === id); }

function StackCard({ stack, remaining, interested, onInterestStack, onOpen, featured }) {
  const items = stack.ids.map(byId).filter(Boolean);
  const total = items.reduce((s, m) => s + m.offers, 0);
  const buffer = total - remaining;
  const allInterested = items.every(m => interested.has(m.id));
  return (
    <div className={`stack-card hover-lift ${featured ? "featured" : ""}`}>
      <div className="stack-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontWeight: 700, fontSize: 16.5 }}>{stack.title}</span>
            <span className={`tag ${buffer === 0 ? "tag-green" : "tag-blue"}`} style={{ height: 24 }}>
              {buffer === 0 ? "Covers 100%" : `+${buffer} hr buffer`}
            </span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 5 }}>{stack.note}</p>
        </div>
        <div className="stack-total">
          <div className="tnum" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: "var(--primary)" }}>{total}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em", marginTop: 3 }}>hours</div>
        </div>
      </div>

      {/* combined bar showing each placement's contribution toward the goal */}
      <div className="bar bar-lg" style={{ marginTop: 4 }}>
        {items.map((m, i) => (
          <div key={m.id} className="bar-seg" style={{ width: `${Math.min(100, (m.offers / Math.max(total, remaining)) * 100)}%`, background: getCompanyColor(m.company) }} />
        ))}
      </div>

      <div className="stack-items">
        {items.map((m, i) => (
          <button key={m.id} className="stack-item" onClick={() => onOpen(m)}>
            <CoTile name={m.company} size={38} radius={10} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{m.company}</div>
              <div style={{ color: "var(--muted)", fontSize: 12.5 }}>{m.role}</div>
            </div>
            <span className="tnum" style={{ fontWeight: 800, fontSize: 15 }}>{m.offers}h</span>
            {i < items.length - 1 && <span className="stack-plus">+</span>}
          </button>
        ))}
      </div>

      <button className={`btn ${allInterested ? "btn-success" : "btn-primary"} btn-block`} style={{ marginTop: 16 }}
        onClick={() => onInterestStack(items)} disabled={allInterested}>
        {allInterested ? <><Icon name="check" size={17} /> Interest sent to all</> : <><Icon name="layers" size={16} /> Express interest in this stack</>}
      </button>
    </div>
  );
}

function HoursPlanner({ store, go }) {
  const approved = store.placements.reduce((s, p) => s + p.approved, 0);
  const remaining = Math.max(0, store.requiredHours - approved);

  const stacks = [
    { title: "Exact fit — two short placements", note: "Two focused placements that together land you on exactly 400 hours.", ids: ["m4", "m6"] },
    { title: "Stay in your field", note: "Both marketing & creative — strongest fit for your program.", ids: ["m2", "m6"] },
    { title: "Finish in one place", note: "A single larger placement covers your remaining hours with room to spare.", ids: ["m7"] },
  ];

  return (
    <div className="page">
      <PageHead kicker="Complete my hours" title="Your smart plan to the finish line"
        sub="TalentTie looks at your remaining hours and suggests combinations of London placements that add up to your goal." />

      <div className="planner-hero">
        <div className="planner-hero-left">
          <div style={{ color: "rgba(255,255,255,.8)", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="target" size={15} /> Remaining to your certificate
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <span className="tnum" style={{ fontSize: 54, fontWeight: 800, color: "#fff", lineHeight: .9 }}>{remaining}</span>
            <span style={{ color: "rgba(255,255,255,.75)", fontWeight: 600, fontSize: 17 }}>hours</span>
          </div>
          <p style={{ color: "rgba(255,255,255,.85)", marginTop: 10, fontSize: 14, maxWidth: 320 }}>
            You've banked {approved} of {store.requiredHours}. Pick a stack below — we'll send your interest to every business in it at once.
          </p>
        </div>
        <div className="planner-hero-right">
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.8)", marginBottom: 10 }}>How stacking works</div>
          {[["No single shop needs all your hours", "layers"], ["We total every approved hour for you", "check"], ["Hit your goal → certificate issues", "award"]].map(([t, ic]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontSize: 13.5, fontWeight: 500, marginBottom: 9 }}>
              <Icon name={ic} size={16} style={{ color: "rgba(255,255,255,.9)", flex: "none" }} /> {t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "26px 0 16px" }}>
        <Icon name="sparkle" size={18} style={{ color: "var(--primary)" }} />
        <h3 style={{ fontSize: 18 }}>Suggested stacks</h3>
        <span className="hint">ranked by fit</span>
      </div>

      <div className="stack-grid">
        {stacks.map((s, i) => (
          <StackCard key={i} stack={s} remaining={remaining} featured={i === 0}
            interested={store.interested} onInterestStack={store.expressInterestStack} onOpen={store.openOpportunity} />
        ))}
      </div>

      <div className="planner-foot">
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Prefer to choose yourself?</div>
          <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 3 }}>Browse all {MATCHES.length} ranked matches and build your own combination.</div>
        </div>
        <button className="btn btn-ghost" onClick={() => go("s_matches", "student")}>Browse all matches <Icon name="arrowRight" size={16} /></button>
      </div>
    </div>
  );
}

Object.assign(window, { HoursPlanner });
