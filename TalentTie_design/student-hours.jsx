/* ============================================================
   TalentTie — Student: My Hours + Profile
   ============================================================ */

/* ---------- Log Hours modal ---------- */
function LogHoursModal({ placements, onClose, onLog }) {
  const active = placements.filter(p => p.status !== "complete");
  const [pid, setPid] = useState(active[0] ? active[0].id : placements[0].id);
  const [week, setWeek] = useState("May 26 – Jun 1");
  const [hours, setHours] = useState(16);

  return (
    <Modal onClose={onClose} max={460}>
      <div style={{ padding: "22px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--tl-50)", color: "var(--primary)", display: "grid", placeItems: "center" }}><Icon name="clock" size={20} /></div>
          <div>
            <h3 style={{ fontSize: 18 }}>Log your hours</h3>
            <p className="hint">Submit a week for employer approval</p>
          </div>
        </div>
        <button className="icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="field">
          <label>Placement</label>
          <select className="selectbox" value={pid} onChange={e => setPid(e.target.value)}>
            {placements.map(p => <option key={p.id} value={p.id} disabled={p.status === "complete"}>{p.company} — {p.role}{p.status === "complete" ? " (complete)" : ""}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Week</label>
          <input className="input" value={week} onChange={e => setWeek(e.target.value)} />
        </div>
        <div className="field">
          <label>Hours worked</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-ghost" style={{ width: 44, padding: 0, flex: "none" }} onClick={() => setHours(h => Math.max(1, h - 1))}><Icon name="x" size={2} style={{ display: "none" }} />−</button>
            <input className="input tnum" style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }} type="number" value={hours} onChange={e => setHours(+e.target.value || 0)} />
            <button className="btn btn-ghost" style={{ width: 44, padding: 0, flex: "none" }} onClick={() => setHours(h => h + 1)}>+</button>
          </div>
          <p className="hint">Hours are submitted as <b>pending</b> until your employer approves them.</p>
        </div>
      </div>
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", display: "flex", gap: 10 }}>
        <button className="btn btn-ghost btn-block" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary btn-block" onClick={() => onLog(pid, week, hours)}>Submit {hours} hrs</button>
      </div>
    </Modal>
  );
}

/* ---------- Certificate modal ---------- */
function CertificateModal({ onClose, name, hours, locked }) {
  return (
    <Modal onClose={onClose} max={560}>
      <div className="cert">
        <div className="cert-top">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={26} />
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-.02em" }}>TalentTie</span>
          </div>
          <span className="tag tag-green"><Icon name="check" size={13} /> Verified</span>
        </div>
        <div className="cert-body">
          <Icon name="award" size={44} style={{ color: "var(--primary)" }} />
          <div className="eyebrow" style={{ marginTop: 14 }}>Certificate of Completion</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", marginTop: 8 }}>{name}</div>
          <p style={{ color: "var(--muted)", marginTop: 10, maxWidth: 380, lineHeight: 1.5 }}>
            has successfully completed <b style={{ color: "var(--ink)" }}>{hours} co-op hours</b> across
            verified placements with local London, Ontario businesses.
          </p>
          <div className="cert-meta">
            <div><div className="cert-meta-k">Placements</div><div className="cert-meta-v">3 businesses</div></div>
            <div><div className="cert-meta-k">Issued</div><div className="cert-meta-v">May 2026</div></div>
            <div><div className="cert-meta-k">Credential ID</div><div className="cert-meta-v">TT-LDN-2026-0418</div></div>
          </div>
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, background: "#fff" }}>
          <button className="btn btn-ghost btn-block" onClick={onClose}>Close</button>
          <button className="btn btn-primary btn-block"><Icon name="download" size={16} /> Download PDF</button>
        </div>
        {locked && <div className="cert-lock"><Icon name="clock" size={15} /> Preview — finish your hours to issue the real certificate</div>}
      </div>
    </Modal>
  );
}

/* ---------- Placement row ---------- */
function PlacementRow({ p, idx }) {
  const color = getCompanyColor(p.company);
  const pct = Math.round((p.approved / p.offered) * 100);
  return (
    <div className="card card-pad placement-row">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 13, minWidth: 0 }}>
          <CoTile name={p.company} size={46} />
          <div>
            <h3 style={{ fontSize: 16 }}>{p.role}</h3>
            <div style={{ color: "var(--ink-2)", fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{p.company}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 12.5, marginTop: 4 }}>
              <Icon name="mapPin" size={13} /> {p.neighbourhood}
            </div>
          </div>
        </div>
        {p.status === "complete"
          ? <span className="tag tag-green"><Icon name="check" size={13} /> Hours complete</span>
          : <span className="tag tag-blue"><span className="dot" style={{ background: "var(--primary)" }} /> Active</span>}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
          <span className="tnum" style={{ fontWeight: 700 }}>{p.approved} <span style={{ color: "var(--muted)", fontWeight: 600 }}>/ {p.offered} hrs</span>
            {p.pending > 0 && <span style={{ color: "var(--amber)", fontWeight: 700 }}> · {p.pending} pending</span>}
          </span>
          <span className="tnum" style={{ color: "var(--muted)", fontWeight: 600 }}>{pct}%</span>
        </div>
        <ProgressBar total={p.offered} segments={[{ value: p.approved, color }, { value: p.pending, color: "repeating-linear-gradient(45deg," + color + "55," + color + "55 5px, transparent 5px, transparent 10px)" }]} />
      </div>

      <div className="logtable">
        {p.logs.map((l, i) => (
          <div key={i} className="logrow">
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-2)", fontWeight: 600, fontSize: 13 }}>
              <Icon name="calendar" size={14} style={{ color: "var(--muted-2)" }} /> {l.week}
            </span>
            <span className="tnum" style={{ fontWeight: 700, fontSize: 13 }}>{l.hours} hrs</span>
            {l.state === "approved"
              ? <span className="tag tag-green" style={{ height: 22 }}><Icon name="check" size={12} /> Approved</span>
              : <span className="tag tag-amber" style={{ height: 22 }}><Icon name="clock" size={12} /> Pending</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Student: My Hours page ---------- */
function StudentHours({ store, go }) {
  const [showLog, setShowLog] = useState(false);
  const approved = store.placements.reduce((s, p) => s + p.approved, 0);
  const pending = store.placements.reduce((s, p) => s + p.pending, 0);
  const complete = approved >= store.requiredHours;
  const left = Math.max(0, store.requiredHours - approved);
  const pct = Math.round((approved / store.requiredHours) * 100);

  return (
    <div className="page">
      <PageHead kicker="My hours" title="Hours tracker"
        sub="Log weekly hours across your placements. Employers approve them, and we total it all up."
        action={<button className="btn btn-primary" onClick={() => setShowLog(true)}><Icon name="plus" size={17} /> Log hours</button>} />

      {/* Certificate / summary card */}
      <div className={`cert-banner ${complete ? "done" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
          <div className="cert-ring">
            <svg width="70" height="70" viewBox="0 0 70 70">
              <circle cx="35" cy="35" r="30" fill="none" stroke="var(--line)" strokeWidth="7" />
              <circle cx="35" cy="35" r="30" fill="none" stroke={complete ? "var(--green)" : "var(--primary)"} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 30} strokeDashoffset={2 * Math.PI * 30 * (1 - pct / 100)} transform="rotate(-90 35 35)" style={{ transition: "stroke-dashoffset .8s var(--ease)" }} />
            </svg>
            <span className="cert-ring-num tnum">{pct}%</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Icon name="award" size={20} style={{ color: complete ? "var(--green)" : "var(--primary)" }} />
              <h3 style={{ fontSize: 18 }}>{complete ? "Certificate ready!" : "Completion certificate"}</h3>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6, maxWidth: 420 }}>
              {complete
                ? `You've completed all ${store.requiredHours} required hours. Your certificate is ready to view and share.`
                : <>You've banked <b style={{ color: "var(--ink)" }}>{approved} of {store.requiredHours}</b> approved hours{pending > 0 && <> ({pending} pending)</>}. <b style={{ color: "var(--ink)" }}>{left} to go.</b></>}
            </p>
          </div>
        </div>
        <button className={`btn ${complete ? "btn-success" : "btn-primary"}`} onClick={() => go("s_certificate", "student")}>
          <Icon name="award" size={16} /> {complete ? "View certificate" : "Preview certificate"}
        </button>
      </div>

      <div className="placement-list">
        {store.placements.map((p, i) => <PlacementRow key={p.id} p={p} idx={i} />)}
      </div>

      {showLog && <LogHoursModal placements={store.placements} onClose={() => setShowLog(false)}
        onLog={(pid, week, hours) => { store.logHours(pid, week, hours); setShowLog(false); }} />}
    </div>
  );
}

/* ---------- Student: Profile page ---------- */
function ProfileField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{children}</div>
    </div>
  );
}

function StudentProfile({ store, go }) {
  const [editingHours, setEditingHours] = useState(false);
  const [hoursVal, setHoursVal] = useState(store.requiredHours);
  const s = STUDENT;
  const approved = store.placements.reduce((a, p) => a + p.approved, 0);
  const pct = Math.round((approved / store.requiredHours) * 100);

  return (
    <div className="page">
      <PageHead kicker="My profile" title="Your standardized profile"
        sub="Every employer reads this the same way — that's what makes matching fair and fast."
        action={<button className="btn btn-ghost"><Icon name="edit" size={16} /> Edit profile</button>} />

      <div className="profile-grid">
        {/* Identity card */}
        <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar name={s.name} size={68} />
            <div>
              <h3 style={{ fontSize: 21 }}>{s.name}</h3>
              <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 14, marginTop: 3 }}>{s.program}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 13, marginTop: 5 }}>
                <Icon name="mapPin" size={13} /> {s.location}
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: "var(--line)" }} />
          <div className="profile-fields">
            <ProfileField label="School">{s.school}</ProfileField>
            <ProfileField label="Year">{s.year}</ProfileField>
            <ProfileField label="Availability">{s.availability}</ProfileField>
            <ProfileField label="Email">{s.email}</ProfileField>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>Skills</div>
            <div className="chip-row">{s.skills.map(sk => <SkillChip key={sk} label={sk} state="have" />)}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>Certifications</div>
            <div className="chip-row">{s.certifications.map(c => <span key={c} className="chip"><Icon name="check" size={12} style={{ color: "var(--green)" }} /> {c}</span>)}</div>
          </div>
        </div>

        {/* Side: hours requirement + completeness */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>Hours required</div>
              <button className="btn btn-quiet btn-sm" style={{ height: 28, padding: "0 8px" }} onClick={() => { setEditingHours(e => !e); setHoursVal(store.requiredHours); }}>
                <Icon name="edit" size={14} /> {editingHours ? "Cancel" : "Edit"}
              </button>
            </div>
            {editingHours ? (
              <div style={{ marginTop: 12 }}>
                <input className="input tnum" type="number" value={hoursVal} onChange={e => setHoursVal(+e.target.value || 0)} style={{ fontSize: 22, fontWeight: 800, height: 52 }} />
                <p className="hint" style={{ marginTop: 8 }}>Set by your program's co-op requirement.</p>
                <button className="btn btn-primary btn-block btn-sm" style={{ marginTop: 12 }} onClick={() => { store.setRequiredHours(hoursVal); setEditingHours(false); }}>Save</button>
              </div>
            ) : (
              <>
                <div className="tnum" style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.03em", marginTop: 8 }}>{store.requiredHours} <span style={{ fontSize: 18, color: "var(--muted)", fontWeight: 600 }}>hours</span></div>
                <p className="hint" style={{ marginTop: 2 }}>Co-op requirement for your program</p>
              </>
            )}
          </div>

          <div className="card card-pad" style={{ background: "var(--tl-50)", borderColor: "var(--tl-100)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="sparkle" size={20} style={{ color: "var(--primary)" }} />
              <div style={{ fontWeight: 700, fontSize: 15 }}>Profile strength</div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="bar"><div className="bar-seg" style={{ width: "85%", background: "var(--primary)" }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12.5, fontWeight: 600 }}>
                <span style={{ color: "var(--primary)" }}>85% complete</span>
                <span style={{ color: "var(--muted)" }}>Strong</span>
              </div>
            </div>
            <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>Add a portfolio link to reach 100% and rank higher in employer searches.</p>
          </div>
        </div>
      </div>

      {/* Verified hours summary + placement history (fills the lower space) */}
      <div className="profile-lower">
        <div className="card card-pad">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            <h3 style={{ fontSize: 17 }}>Verified hours summary</h3>
            <button className="btn btn-soft btn-sm" onClick={() => go("s_certificate", "student")}><Icon name="award" size={15} /> Certificate progress</button>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="tnum" style={{ fontSize: 34, fontWeight: 800, color: "var(--primary)" }}>{approved}</span>
            <span style={{ color: "var(--muted)", fontWeight: 600 }}>of {store.requiredHours} verified · {pct}%</span>
          </div>
          <div className="bar bar-lg" style={{ marginTop: 12 }}>
            {store.placements.map(p => <div key={p.id} className="bar-seg" style={{ width: `${(p.approved / store.requiredHours) * 100}%`, background: getCompanyColor(p.company) }} />)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 14 }}>
            {store.placements.map(p => (
              <span key={p.id} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>
                <span className="dot" style={{ width: 9, height: 9, background: getCompanyColor(p.company) }} /> {p.company} <span className="tnum" style={{ color: "var(--muted)" }}>· {p.approved}h</span>
              </span>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 17, marginBottom: 14 }}>Placement history</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {store.placements.map(p => (
              <div key={p.id} className="hist-row">
                <CoTile name={p.company} size={40} radius={11} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.role}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12.5 }}>{p.company} · since {p.started}</div>
                </div>
                {p.status === "complete"
                  ? <span className="tag tag-green" style={{ height: 24 }}><Icon name="check" size={12} /> Complete</span>
                  : <span className="tag tag-blue" style={{ height: 24 }}><span className="dot" style={{ background: "var(--primary)" }} /> Active</span>}
                <span className="tnum" style={{ fontWeight: 800, fontSize: 14, minWidth: 42, textAlign: "right" }}>{p.approved}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StudentHours, StudentProfile, LogHoursModal, CertificateModal });
