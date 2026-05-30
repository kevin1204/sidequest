/* ============================================================
   TalentTie — App router + global store (iteration 2)
   ============================================================ */

const STUDENT_NAV = [
  { route: "s_matches", icon: "sparkle", label: "Matches" },
  { route: "s_planner", icon: "layers", label: "Plan Hours" },
  { route: "s_applications", icon: "heart", label: "Applications" },
  { route: "s_hours", icon: "clock", label: "My Hours" },
  { route: "s_profile", icon: "user", label: "My Profile" },
];
const EMPLOYER_NAV = [
  { route: "e_postings", icon: "briefcase", label: "My Postings" },
  { route: "e_candidates", icon: "users", label: "Candidates" },
  { route: "e_approve", icon: "clock", label: "Approve Hours", badge: 3 },
];

// route → which nav item is "active"
const ACTIVE_MAP = {
  s_opportunity: "s_matches", s_certificate: "s_hours",
  e_candidate: "e_candidates", e_post: "e_postings",
};
const TITLES = {
  s_matches: "Matches", s_planner: "Plan My Hours", s_applications: "My Applications",
  s_hours: "My Hours", s_profile: "My Profile", s_opportunity: "Opportunity", s_certificate: "Certificate",
  e_postings: "Dashboard", e_candidates: "Candidates", e_candidate: "Candidate", e_approve: "Approve Hours", e_post: "Post an Opportunity",
};

function App() {
  const [route, setRoute] = useState("landing");
  const [role, setRole] = useState(null);
  const [loginRole, setLoginRole] = useState("student");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // student state
  const [interested, setInterested] = useState(new Set());
  const [placements, setPlacements] = useState(PLACEMENTS.map(p => ({ ...p, logs: [...p.logs] })));
  const [requiredHours, setRequiredHours] = useState(STUDENT.requiredHours);
  const [applications, setApplications] = useState(APPLICATIONS);
  const [currentOpp, setCurrentOpp] = useState(null);

  // employer state
  const [shortlisted, setShortlisted] = useState(new Set());
  const [empInterested, setEmpInterested] = useState(new Set());
  const [postings, setPostings] = useState(POSTINGS);
  const [currentCandidate, setCurrentCandidate] = useState(null);

  function showToast(msg, icon) {
    setToast({ msg, icon });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }
  function go(r, ro) {
    if (ro) setRole(ro);
    if (r === "login" && ro) setLoginRole(ro);
    if (r === "landing") setRole(null);
    setRoute(r);
    window.scrollTo(0, 0);
    document.querySelector(".main-scroll")?.scrollTo(0, 0);
  }

  function addApplication(m) {
    setApplications(apps => apps.some(a => a.company === m.company && a.role === m.role)
      ? apps
      : [{ id: "ap" + Date.now(), company: m.company, role: m.role, neighbourhood: m.neighbourhood, score: m.score, offers: m.offers, status: "Interested", date: "Today" }, ...apps]);
  }

  const store = {
    interested,
    expressInterest: (id) => {
      setInterested(s => new Set(s).add(id));
      const m = MATCHES.find(x => x.id === id);
      if (m) { addApplication(m); showToast(`Interest sent to ${m.company}`, "heart"); }
    },
    expressInterestStack: (items) => {
      setInterested(s => { const n = new Set(s); items.forEach(m => n.add(m.id)); return n; });
      items.forEach(addApplication);
      showToast(`Interest sent to ${items.length} ${items.length === 1 ? "business" : "businesses"}`, "layers");
    },
    placements, requiredHours,
    setRequiredHours: (h) => { setRequiredHours(h); showToast(`Required hours updated to ${h}`, "check"); },
    logHours: (pid, week, hours) => {
      setPlacements(ps => ps.map(p => p.id === pid ? { ...p, pending: p.pending + hours, logs: [...p.logs, { week, hours, state: "pending" }] } : p));
      showToast(`${hours} hours submitted for approval`, "clock");
    },
    applications,
    currentOpp, openOpportunity: (m) => { setCurrentOpp(m); go("s_opportunity", "student"); },
    // employer
    shortlisted, toggleShortlist: (id) => { setShortlisted(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); const c = CANDIDATES.find(x => x.id === id); if (c && !shortlisted.has(id)) showToast(`${c.name} shortlisted`, "star"); },
    empInterested, empExpressInterest: (id) => { setEmpInterested(s => new Set(s).add(id)); const c = CANDIDATES.find(x => x.id === id); showToast(`Interest sent to ${c.name}`, "heart"); },
    postings, addPosting: (p) => { setPostings(ps => [p, ...ps]); showToast("Opportunity published", "bolt"); },
    approvals: APPROVALS,
    currentCandidate, openCandidate: (c) => { setCurrentCandidate(c); go("e_candidate", "employer"); },
  };

  // full-bleed routes
  if (route === "landing") return <><LandingPage go={go} /><Toast msg={toast?.msg} icon={toast?.icon} /></>;
  if (route === "login") return <><LoginPage go={go} initialRole={loginRole} /><Toast msg={toast?.msg} icon={toast?.icon} /></>;
  if (route === "onboard_student") return <><StudentOnboarding go={go} store={store} /><Toast msg={toast?.msg} icon={toast?.icon} /></>;
  if (route === "onboard_employer") return <><EmployerOnboarding go={go} store={store} /><Toast msg={toast?.msg} icon={toast?.icon} /></>;

  const isStudent = role === "student";
  const nav = isStudent ? STUDENT_NAV : EMPLOYER_NAV;
  const who = isStudent ? { name: STUDENT.name, sub: STUDENT.program } : { name: EMPLOYER.contact, sub: EMPLOYER.name };
  const notifs = isStudent ? NOTIFS_STUDENT : NOTIFS_EMPLOYER;

  let body = null;
  if (route === "s_matches") body = <StudentMatches store={store} go={go} />;
  else if (route === "s_planner") body = <HoursPlanner store={store} go={go} />;
  else if (route === "s_applications") body = <StudentApplications store={store} go={go} />;
  else if (route === "s_hours") body = <StudentHours store={store} go={go} />;
  else if (route === "s_profile") body = <StudentProfile store={store} go={go} />;
  else if (route === "s_opportunity") body = <OpportunityDetail store={store} go={go} />;
  else if (route === "s_certificate") body = <CertificatePage store={store} go={go} />;
  else if (route === "e_postings") body = <EmployerPostings store={store} go={go} />;
  else if (route === "e_candidates") body = <EmployerCandidates store={store} />;
  else if (route === "e_candidate") body = <CandidateDetail store={store} go={go} />;
  else if (route === "e_approve") body = <EmployerApprove store={store} />;
  else if (route === "e_post") body = <EmployerPost store={store} go={go} />;

  return (
    <>
      <AppShell role={role} current={ACTIVE_MAP[route] || route} go={go} title={TITLES[route] || ""} nav={nav} who={who} notifs={notifs}>
        {body}
      </AppShell>
      <Toast msg={toast?.msg} icon={toast?.icon} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
