/* ============================================================
   TalentTie — Completion certificate page (unlocked / completed)
   ============================================================ */

const CERT_BREAKDOWN = [
  { company: "Forest City Roasters", role: "Retail & Operations Co-op", hours: 120, range: "Apr 28 – Jun 1, 2026" },
  { company: "Thames Valley Marketing Group", role: "Marketing Assistant", hours: 150, range: "May 5 – Jul 13, 2026" },
  { company: "Northern Currents Studio", role: "Social Content Intern", hours: 100, range: "May 12 – Jul 6, 2026" },
  { company: "Riverbend Design Co.", role: "Junior Brand Designer", hours: 30, range: "Jul 14 – Jul 20, 2026" },
];

function Seal() {
  return (
    <div className="cert-seal">
      <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="var(--tl-50)" stroke="var(--tl-600)" strokeWidth="2" />
        <circle cx="42" cy="42" r="32" fill="none" stroke="var(--tl-300)" strokeWidth="1" strokeDasharray="2 3" />
        <path d="M42 24l3.6 7.3 8 1.2-5.8 5.7 1.4 8-7.2-3.8-7.2 3.8 1.4-8-5.8-5.7 8-1.2L42 24z" fill="var(--tl-600)" />
      </svg>
      <div className="cert-seal-label">Verified by<br/>TalentTie</div>
    </div>
  );
}

function CertificatePage({ store, go }) {
  const total = CERT_BREAKDOWN.reduce((s, b) => s + b.hours, 0);
  return (
    <div className="page">
      <button className="btn btn-quiet btn-sm" onClick={() => go("s_hours", "student")} style={{ marginBottom: 14 }}><Icon name="arrowLeft" size={15} /> Back to hours</button>

      <div className="cert-celebrate">
        <span className="tag tag-green" style={{ height: 28, padding: "0 12px" }}><Icon name="check" size={14} /> Requirement complete</span>
        <h2 style={{ fontSize: 26, marginTop: 12 }}>🎉 You did it, {STUDENT.name.split(" ")[0]}.</h2>
        <p style={{ color: "var(--muted)", marginTop: 6, maxWidth: 480 }}>All {total} required co-op hours are verified. Here's your official TalentTie completion certificate.</p>
      </div>

      {/* The certificate document */}
      <div className="cert-doc-wrap">
        <div className="cert-doc">
          <div className="cert-doc-border" />
          <div className="cert-doc-inner">
            <div className="cert-doc-head">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LogoMark size={28} />
                <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-.02em" }}>TalentTie</span>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                Certificate of<br/>Co-op Completion
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 22 }}>
              <div className="eyebrow">This certifies that</div>
              <div className="cert-name">{STUDENT.name}</div>
              <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 15, marginTop: 6 }}>{STUDENT.program} · {STUDENT.year}</div>
              <p style={{ color: "var(--muted)", marginTop: 14, maxWidth: 460, marginInline: "auto", lineHeight: 1.55 }}>
                has successfully completed <b style={{ color: "var(--ink)" }}>{total} verified co-op hours</b> across
                {" "}{CERT_BREAKDOWN.length} placements with local London, Ontario businesses through the TalentTie platform.
              </p>
            </div>

            {/* big total + seal */}
            <div className="cert-total-row">
              <div className="cert-total-num">
                <div className="tnum" style={{ fontSize: 46, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>{total}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>Verified hours</div>
              </div>
              <Seal />
              <div className="cert-total-num">
                <div className="tnum" style={{ fontSize: 46, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>{CERT_BREAKDOWN.length}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>Placements</div>
              </div>
            </div>

            {/* breakdown table */}
            <div className="cert-table">
              <div className="cert-table-head">
                <span>Employer</span><span className="hide-sm">Role</span><span>Dates</span><span style={{ textAlign: "right" }}>Hours</span>
              </div>
              {CERT_BREAKDOWN.map((b, i) => (
                <div key={i} className="cert-table-row">
                  <span style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, minWidth: 0 }}>
                    <span className="dot" style={{ width: 9, height: 9, background: getCompanyColor(b.company), flex: "none" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.company}</span>
                  </span>
                  <span className="hide-sm" style={{ color: "var(--muted)", fontSize: 13 }}>{b.role}</span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{b.range}</span>
                  <span className="tnum" style={{ textAlign: "right", fontWeight: 800 }}>{b.hours}</span>
                </div>
              ))}
              <div className="cert-table-row total">
                <span style={{ fontWeight: 800 }}>Total verified</span>
                <span className="hide-sm"></span><span></span>
                <span className="tnum" style={{ textAlign: "right", fontWeight: 800, color: "var(--primary)" }}>{total} hrs</span>
              </div>
            </div>

            <div className="cert-doc-foot">
              <div>
                <div className="cert-foot-k">Issued</div>
                <div className="cert-foot-v">July 24, 2026</div>
              </div>
              <div>
                <div className="cert-foot-k">Credential ID</div>
                <div className="cert-foot-v tnum">TT-LDN-2026-0418</div>
              </div>
              <div>
                <div className="cert-foot-k">Verify at</div>
                <div className="cert-foot-v">talenttie.ca/verify</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cert-actions">
        <button className="btn btn-primary btn-lg"><Icon name="download" size={18} /> Download PDF</button>
        <button className="btn btn-ghost btn-lg"><Icon name="users" size={17} /> Share to LinkedIn</button>
        <span className="cert-uni-note"><Icon name="cap" size={15} /> University-recognized — coming soon with Fanshawe &amp; Western</span>
      </div>
    </div>
  );
}

Object.assign(window, { CertificatePage });
