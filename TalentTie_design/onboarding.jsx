/* ============================================================
   TalentTie — Onboarding wizards (student + employer)
   ============================================================ */

const CERT_OPTIONS = ["WHMIS 2015", "Smart Serve Ontario", "Google Digital Marketing", "Meta Blueprint", "First Aid / CPR", "Google Analytics", "Adobe Certified", "Forklift License"];
const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4"];
const AVAIL = ["10 hrs/week", "15 hrs/week", "20 hrs/week", "Full-time (summer)"];

function WizardShell({ role, step, total, title, sub, children, onBack, onNext, nextLabel, canNext = true, go }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="wizard">
      <div className="wizard-top">
        <Logo size={26} onClick={() => go("landing")} />
        <button className="btn btn-quiet btn-sm" onClick={() => go("landing")}><Icon name="x" size={16} /> Exit</button>
      </div>
      <div className="wizard-body">
        <div className="wizard-card fade-up">
          <div className="wizard-progress">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span className="eyebrow">{role === "student" ? "Student setup" : "Employer setup"}</span>
              <span className="hint tnum" style={{ fontWeight: 700 }}>Step {step} of {total}</span>
            </div>
            <div className="bar"><div className="bar-seg" style={{ width: `${pct}%`, background: "var(--primary)" }} /></div>
          </div>
          <h2 style={{ fontSize: 24, marginTop: 22 }}>{title}</h2>
          {sub && <p style={{ color: "var(--muted)", marginTop: 7 }}>{sub}</p>}
          <div style={{ marginTop: 22 }}>{children}</div>
          <div className="wizard-foot">
            {step > 1 ? <button className="btn btn-ghost" onClick={onBack}><Icon name="arrowLeft" size={15} /> Back</button> : <span />}
            <button className="btn btn-primary" onClick={onNext} disabled={!canNext}>{nextLabel || "Continue"} <Icon name="arrowRight" size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipSelect({ options, selected, toggle, columns }) {
  return (
    <div className="chip-select" style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {}}>
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button key={o} className={`select-chip ${on ? "on" : ""}`} onClick={() => toggle(o)}>
            <span className={`select-check ${on ? "on" : ""}`}>{on && <Icon name="check" size={12} />}</span>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function StudentOnboarding({ go, store }) {
  const [step, setStep] = useState(1);
  const [school, setSchool] = useState("Fanshawe College");
  const [program, setProgram] = useState(PROGRAMS[0]);
  const [year, setYear] = useState("Year 2");
  const [avail, setAvail] = useState("20 hrs/week");
  const [skills, setSkills] = useState(["Social Media", "Canva"]);
  const [certs, setCerts] = useState(["Smart Serve Ontario"]);
  const [hours, setHours] = useState(400);
  const total = 5;
  const next = () => step < total ? setStep(step + 1) : go("s_matches", "student");
  const back = () => setStep(step - 1);
  const toggle = (arr, set) => (v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  let content, title, sub, canNext = true, nextLabel;
  if (step === 1) {
    title = "Where do you study?"; sub = "We use this to match you with placements your program recognizes.";
    content = (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="field"><label>School</label>
          <div style={{ display: "flex", gap: 10 }}>
            {["Fanshawe College", "Western University"].map(s => (
              <button key={s} className={`big-radio ${school === s ? "on" : ""}`} onClick={() => setSchool(s)}>
                <Icon name="cap" size={20} /> {s}
              </button>
            ))}
          </div>
        </div>
        <div className="field"><label>Program</label>
          <select className="selectbox" value={program} onChange={e => setProgram(e.target.value)}>{PROGRAMS.map(p => <option key={p}>{p}</option>)}</select>
        </div>
      </div>
    );
  } else if (step === 2) {
    title = "Your year & availability"; sub = "Helps employers see when you can work.";
    content = (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="field"><label>Year of study</label><ChipSelect options={YEARS} selected={[year]} toggle={setYear} columns={4} /></div>
        <div className="field"><label>Weekly availability</label><ChipSelect options={AVAIL} selected={[avail]} toggle={setAvail} columns={2} /></div>
      </div>
    );
  } else if (step === 3) {
    title = "What are your skills?"; sub = "Pick the ones you're confident in — choose at least 3."; canNext = skills.length >= 3;
    content = <ChipSelect options={SKILL_LIBRARY} selected={skills} toggle={toggle(skills, setSkills)} />;
  } else if (step === 4) {
    title = "Any certifications?"; sub = "Optional, but they boost your match scores.";
    content = <ChipSelect options={CERT_OPTIONS} selected={certs} toggle={toggle(certs, setCerts)} columns={2} />;
  } else {
    title = "How many co-op hours do you need?"; sub = "Set by your program. You can change this anytime."; nextLabel = "Finish & see my matches";
    content = (
      <div>
        <div className="hours-slider-wrap">
          <input type="range" min="100" max="600" step="20" value={hours} onChange={e => setHours(+e.target.value)} className="hours-slider" />
          <div className="hours-readout tnum">{hours}<span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}> hrs</span></div>
        </div>
        <div className="note-box" style={{ marginTop: 16 }}>
          <Icon name="layers" size={16} style={{ color: "var(--teal)", flex: "none" }} />
          <span>You can complete these across several local businesses — TalentTie tracks the total and issues your certificate.</span>
        </div>
      </div>
    );
  }

  return (
    <WizardShell role="student" step={step} total={total} title={title} sub={sub} canNext={canNext} nextLabel={nextLabel}
      onBack={back} onNext={next} go={go}>{content}</WizardShell>
  );
}

function EmployerOnboarding({ go, store }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [loc, setLoc] = useState("Downtown");
  const [field, setField] = useState("Business / Marketing");
  const total = 2;
  const next = () => step < total ? setStep(step + 1) : go("e_post", "employer");
  const back = () => setStep(step - 1);

  let content, title, sub, nextLabel;
  if (step === 1) {
    title = "Tell us about your business"; sub = "This appears on your postings and candidate matches.";
    content = (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="field"><label>Business name</label><input className="input" placeholder="e.g. Forest City Roasters" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="field"><label>Location</label>
          <select className="selectbox" value={loc} onChange={e => setLoc(e.target.value)}>{NEIGHBOURHOODS.map(n => <option key={n}>{n}, London ON</option>)}</select>
        </div>
      </div>
    );
  } else {
    title = "What's your industry?"; sub = "We use this to match you with students in the right field."; nextLabel = "Post my first opportunity";
    content = <ChipSelect options={FIELDS} selected={[field]} toggle={setField} columns={2} />;
  }
  return (
    <WizardShell role="employer" step={step} total={total} title={title} sub={sub} nextLabel={nextLabel}
      onBack={back} onNext={next} go={go}>{content}</WizardShell>
  );
}

Object.assign(window, { StudentOnboarding, EmployerOnboarding });
