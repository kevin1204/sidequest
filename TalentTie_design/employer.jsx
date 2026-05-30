/* ============================================================
   TalentTie — Employer app (Postings, Candidates, Approve, Post)
   ============================================================ */

/* ---------- Candidate card (mirror of student match card) ---------- */
function CandidateCard({ c, shortlisted, interested, onShortlist, onInterest, onOpen }) {
  const isShort = shortlisted.has(c.id);
  const isInt = interested.has(c.id);
  return (
    <div className="match-card hover-lift">
      <div className="match-card-top">
        <button onClick={() => onOpen(c)} style={{ display: "flex", gap: 14, minWidth: 0, textAlign: "left", flex: 1 }}>
          <Avatar name={c.name} size={48} />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 17 }}>{c.name}</h3>
            <div style={{ color: "var(--ink-2)", fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>{c.program}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 12.5, marginTop: 5 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="cap" size={13} /> {c.year}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="mapPin" size={13} /> {c.neighbourhood}</span>
            </div>
          </div>
        </button>
        <MatchBadge score={c.score} />
      </div>

      <div className="match-reason">
        <Icon name="sparkle" size={15} style={{ color: "var(--primary)", flex: "none", marginTop: 1 }} />
        <ReasonLine items={c.reason} />
      </div>

      <SkillMatch required={c.required} have={c.have} />

      <div className="hours-pill">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", color: "var(--primary)", flex: "none", boxShadow: "var(--sh-xs)" }}>
            <Icon name="clock" size={18} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-2)" }}>
            Needs <b style={{ color: "var(--ink)" }}>{c.hoursLeft} more hours</b> to complete co-op
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 9, marginTop: 16 }}>
        <button className={`btn ${isInt ? "btn-success" : "btn-primary"} btn-block`} onClick={() => onInterest(c.id)} disabled={isInt}>
          {isInt ? <><Icon name="check" size={17} /> Interest sent</> : <><Icon name="heart" size={16} /> Express interest</>}
        </button>
        <button className={`btn ${isShort ? "btn-soft" : "btn-ghost"}`} onClick={() => onShortlist(c.id)}>
          <Icon name="star" size={16} style={isShort ? { fill: "var(--primary)" } : {}} /> {isShort ? "Shortlisted" : "Shortlist"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Posting row ---------- */
function PostingRow({ p, onView }) {
  const draft = p.status === "draft";
  return (
    <div className="card card-pad posting-row hover-lift">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, minWidth: 0, flex: 1 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: draft ? "var(--bg-2)" : "var(--tl-50)", color: draft ? "var(--muted)" : "var(--primary)", display: "grid", placeItems: "center", flex: "none" }}>
          <Icon name="briefcase" size={22} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 16.5 }}>{p.role}</h3>
            {draft ? <span className="tag tag-gray">Draft</span> : <span className="tag tag-green"><span className="dot" style={{ background: "var(--green)" }} /> Active</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--muted)", fontSize: 13, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="mapPin" size={13} /> {p.neighbourhood}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={13} /> Offers {p.offers} hrs</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="target" size={13} /> {p.field}</span>
          </div>
        </div>
      </div>

      <div className="posting-stats">
        <div className="pstat"><div className="tnum pstat-n">{p.candidates}</div><div className="pstat-l">Candidates</div></div>
        <div className="pstat"><div className="tnum pstat-n">{p.views}</div><div className="pstat-l">Views</div></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "none" }}>
        <button className="btn btn-primary btn-sm" onClick={onView} disabled={draft} style={{ position: "relative" }}>
          View candidates
          {p.newCount > 0 && <span className="new-pip">{p.newCount} new</span>}
        </button>
        <button className="btn btn-ghost btn-sm">{draft ? "Finish & publish" : "Edit posting"}</button>
      </div>
    </div>
  );
}

/* ---------- Employer: My Postings ---------- */
function EmployerPostings({ store, go }) {
  const active = store.postings.filter(p => p.status === "active");
  const totalCands = store.postings.reduce((s, p) => s + p.candidates, 0);
  const stats = [
    ["Active postings", active.length, "briefcase", "var(--primary)"],
    ["Total candidates", totalCands, "users", "var(--teal)"],
    ["Hours to approve", store.approvals.length, "clock", "var(--amber)"],
  ];
  return (
    <div className="page">
      <PageHead kicker="Dashboard" title={`Welcome back, ${EMPLOYER.contact.split(" ")[0]}`}
        sub={EMPLOYER.name + " · " + EMPLOYER.location}
        action={<button className="btn btn-primary" onClick={() => go("e_post", "employer")}><Icon name="plus" size={17} /> Post an opportunity</button>} />

      <div className="emp-stats">
        {stats.map(([l, n, ic, col]) => (
          <div key={l} className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "color-mix(in srgb," + col + " 12%, #fff)", color: col, display: "grid", placeItems: "center", flex: "none" }}><Icon name={ic} size={22} /></div>
            <div>
              <div className="tnum" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>{n}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, marginTop: 3 }}>{l}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <PageHead title="Your postings" sub={`${active.length} active · ${store.postings.length - active.length} draft`} />
        <div className="placement-list">
          {store.postings.length === 0
            ? <EmptyState icon="briefcase" title="No postings yet" body="Post your first opportunity and we'll start matching London students to it within minutes — partial hours welcome." ctaLabel="Post an opportunity" onCta={() => go("e_post", "employer")} />
            : store.postings.map(p => <PostingRow key={p.id} p={p} onView={() => go("e_candidates", "employer")} />)}
        </div>
      </div>
    </div>
  );
}

/* ---------- Employer: Candidates ---------- */
function EmployerCandidates({ store }) {
  const [sort, setSort] = useState("match");
  const [onlyShort, setOnlyShort] = useState(false);
  let list = [...CANDIDATES];
  if (onlyShort) list = list.filter(c => store.shortlisted.has(c.id));
  list.sort((a, b) => b.score - a.score);

  return (
    <div className="page">
      <PageHead kicker="Marketing Assistant · Downtown" title="Matched candidates"
        sub={`${CANDIDATES.length} students matched to this posting · ranked by fit`} />

      <div className="match-toolbar">
        <div className="seg">
          <button className={`seg-btn ${!onlyShort ? "on" : ""}`} onClick={() => setOnlyShort(false)}>All candidates</button>
          <button className={`seg-btn ${onlyShort ? "on" : ""}`} onClick={() => setOnlyShort(true)}>
            Shortlisted {store.shortlisted.size > 0 && `(${store.shortlisted.size})`}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span className="hint hide-sm">Sorted by match score</span>
          <button className="btn btn-ghost btn-sm"><Icon name="filter" size={15} /> Filters</button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon="star" tint={false} title={onlyShort ? "No shortlisted candidates yet" : "No candidates yet"}
          body={onlyShort ? "Star a candidate to keep your favourites here for easy comparison." : "As students match your posting, they'll appear here ranked by fit."}
          ctaLabel={onlyShort ? "View all candidates" : null} onCta={() => setOnlyShort(false)} />
      ) : (
        <div className="match-grid">
          {list.map(c => (
            <CandidateCard key={c.id} c={c} shortlisted={store.shortlisted} interested={store.empInterested}
              onShortlist={store.toggleShortlist} onInterest={store.empExpressInterest} onOpen={store.openCandidate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Employer: Approve Hours ---------- */
function ApprovalRow({ a, onApprove, onReject }) {
  const [state, setState] = useState(null); // 'approved' | 'rejected'
  return (
    <div className={`card card-pad approval-row ${state ? "resolved" : ""}`}>
      <div style={{ display: "flex", gap: 13, minWidth: 0, flex: 1, alignItems: "center" }}>
        <Avatar name={a.name} size={44} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 15.5 }}>{a.name}</h3>
            <span className="tag tag-gray">{a.role}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13, marginTop: 5 }}>
            <Icon name="calendar" size={13} /> {a.week}
          </div>
          <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 7, fontStyle: "italic" }}>"{a.note}"</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: "none" }}>
        <div style={{ textAlign: "center" }}>
          <div className="tnum" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>{a.hours}</div>
          <div style={{ color: "var(--muted)", fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>hours</div>
        </div>
        {state ? (
          <span className={`tag ${state === "approved" ? "tag-green" : "tag-gray"}`} style={{ height: 36, padding: "0 14px" }}>
            <Icon name={state === "approved" ? "check" : "x"} size={14} /> {state === "approved" ? "Approved" : "Rejected"}
          </span>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-danger-ghost btn-sm" onClick={() => { setState("rejected"); onReject(a); }}><Icon name="x" size={15} /> Reject</button>
            <button className="btn btn-success btn-sm" onClick={() => { setState("approved"); onApprove(a); }}><Icon name="check" size={15} /> Approve</button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmployerApprove({ store }) {
  const [resolved, setResolved] = useState(0);
  const pendingTotal = store.approvals.reduce((s, a) => s + a.hours, 0);
  return (
    <div className="page">
      <PageHead kicker="Approve hours" title="Hours to approve"
        sub="Students have submitted these weeks for your approval. Approving adds them to their verified total." />

      <div className="emp-stats" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--amber-bg)", color: "var(--amber)", display: "grid", placeItems: "center" }}><Icon name="clock" size={22} /></div>
          <div><div className="tnum" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{store.approvals.length - resolved}</div><div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, marginTop: 3 }}>Awaiting approval</div></div>
        </div>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--tl-50)", color: "var(--primary)", display: "grid", placeItems: "center" }}><Icon name="clock" size={22} /></div>
          <div><div className="tnum" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{pendingTotal}</div><div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, marginTop: 3 }}>Pending hours</div></div>
        </div>
      </div>

      <div className="placement-list" style={{ marginTop: 24 }}>
        {store.approvals.map(a => (
          <ApprovalRow key={a.id} a={a} onApprove={() => setResolved(r => r + 1)} onReject={() => setResolved(r => r + 1)} />
        ))}
      </div>

      {resolved === store.approvals.length && store.approvals.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <EmptyState icon="check" title="All caught up!" body="You've cleared the approval queue. Students have been notified that their hours are verified." />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CandidateCard, EmployerPostings, EmployerCandidates, EmployerApprove });
