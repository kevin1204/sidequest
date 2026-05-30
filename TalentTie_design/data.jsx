/* ============================================================
   TalentTie — Sample data (iteration 2)
   Fictional but realistic London, Ontario businesses & students.
   ============================================================ */

// Avatar gradient palette (decorative, for people/companies)
const AV_COLORS = [
  ["#1f7a6b", "#5ec2b0"], ["#2a8071", "#7fd3c4"], ["#7c3aed", "#c4b5fd"],
  ["#db2777", "#f9a8d4"], ["#ea580c", "#fdba74"], ["#0891b2", "#67e8f9"],
  ["#4f46e5", "#a5b4fc"], ["#16a34a", "#86efac"],
];
function avatarGradient(seed) {
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  const c = AV_COLORS[h % AV_COLORS.length];
  return `linear-gradient(135deg, ${c[0]}, ${c[1]})`;
}
function initials(name) {
  const p = name.trim().split(/\s+/);
  return (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase();
}

/* ---------- Consistent company → colour mapping ----------
   Used EVERYWHERE: dashboard segmented bar, tracker bars,
   certificate donut, legends. Forest City is always teal, etc. */
const COMPANY_COLORS = {
  "Forest City Roasters": "#1f7a6b",
  "Thames Valley Marketing Group": "#7c5cff",
  "Northern Currents Studio": "#e0892b",
  "Riverbend Design Co.": "#d6457f",
  "Innovation Works": "#2f7fb5",
  "Old East Village Grocer": "#5a9e3b",
  "Powerhouse Brewing Co.": "#c2453b",
  "Westmount Community Centre": "#0e9b8a",
};
const FALLBACK_COLORS = ["#1f7a6b", "#7c5cff", "#e0892b", "#d6457f", "#2f7fb5", "#5a9e3b", "#c2453b"];
function getCompanyColor(name) {
  if (COMPANY_COLORS[name]) return COMPANY_COLORS[name];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
}

/* ---------- The logged-in student ---------- */
const STUDENT = {
  name: "Maya Thompson",
  program: "Business Administration – Fanshawe",
  school: "Fanshawe College",
  year: "Year 2",
  location: "Old East Village, London ON",
  availability: "Mon–Thu · 20 hrs/week",
  email: "test@test.com",
  requiredHours: 400,
  skills: ["Customer Service", "Social Media", "Content Writing", "Canva", "Excel", "Event Planning", "Teamwork", "POS Systems"],
  certifications: ["WHMIS 2015", "Smart Serve Ontario", "Google Digital Marketing"],
};

/* ---------- Student's active placements (My Hours) ---------- */
const PLACEMENTS = [
  {
    id: "p1", company: "Forest City Roasters", role: "Retail & Operations Co-op",
    neighbourhood: "Wortley Village", offered: 120, approved: 120, pending: 0,
    status: "complete", started: "Apr 28",
    logs: [
      { week: "Apr 28 – May 4", hours: 24, state: "approved" },
      { week: "May 5 – May 11", hours: 24, state: "approved" },
      { week: "May 12 – May 18", hours: 24, state: "approved" },
      { week: "May 19 – May 25", hours: 24, state: "approved" },
      { week: "May 26 – Jun 1", hours: 24, state: "approved" },
    ],
  },
  {
    id: "p2", company: "Thames Valley Marketing Group", role: "Marketing Assistant",
    neighbourhood: "Downtown", offered: 150, approved: 90, pending: 20,
    status: "active", started: "May 5",
    logs: [
      { week: "May 5 – May 11", hours: 18, state: "approved" },
      { week: "May 12 – May 18", hours: 18, state: "approved" },
      { week: "May 19 – May 25", hours: 18, state: "approved" },
      { week: "May 26 – Jun 1", hours: 16, state: "approved" },
      { week: "Jun 2 – Jun 8", hours: 20, state: "approved" },
      { week: "Jun 9 – Jun 15", hours: 20, state: "pending" },
    ],
  },
  {
    id: "p3", company: "Northern Currents Studio", role: "Social Content Intern",
    neighbourhood: "SoHo", offered: 100, approved: 40, pending: 0,
    status: "active", started: "May 12",
    logs: [
      { week: "May 12 – May 18", hours: 20, state: "approved" },
      { week: "May 19 – May 25", hours: 20, state: "approved" },
    ],
  },
];

/* ---------- Student's matches (opportunity cards) ----------
   Diversified scores, hours, and reason strings. */
const MATCHES = [
  {
    id: "m1", company: "Riverbend Design Co.", role: "Junior Brand Designer",
    neighbourhood: "SoHo", score: 95, offers: 140, field: true, posted: "2 days ago", applicants: 6,
    blurb: "Boutique studio crafting brand identities for Forest City makers.",
    about: "Riverbend is a six-person brand studio in SoHo working with London restaurants, breweries and non-profits. You'll sit with senior designers and ship real client work.",
    reason: ["4 of 5 skills · top creative fit", "In your field", "2 km away · SoHo"],
    required: ["Canva", "Social Media", "Content Writing", "Brand Design", "Adobe Illustrator"],
    have:     ["Canva", "Social Media", "Content Writing", "Brand Design"],
  },
  {
    id: "m2", company: "Thames Valley Marketing Group", role: "Marketing Assistant",
    neighbourhood: "Downtown", score: 91, offers: 120, field: true, posted: "4 days ago", applicants: 14,
    blurb: "Full-service agency serving downtown London small businesses.",
    about: "A downtown agency running social and campaigns for 30+ local clients. Expect a mix of content, reporting and community management with weekly mentorship.",
    reason: ["Strong content & analytics fit", "Your exact field", "Downtown · 3 km"],
    required: ["Social Media", "Content Writing", "Canva", "Excel", "Analytics"],
    have:     ["Social Media", "Content Writing", "Canva", "Excel"],
  },
  {
    id: "m3", company: "Forest City Roasters", role: "Front-of-House Lead",
    neighbourhood: "Wortley Village", score: 88, offers: 100, field: true, posted: "1 week ago", applicants: 9,
    blurb: "Independent coffee roaster & café on Wortley Road.",
    about: "The Wortley Road café where you already log hours is expanding its team lead programme — extend your placement and pick up customer-experience leadership hours.",
    reason: ["You already work here", "Trusted employer", "Wortley Village"],
    required: ["Customer Service", "POS Systems", "Inventory", "Teamwork"],
    have:     ["Customer Service", "POS Systems", "Teamwork"],
  },
  {
    id: "m4", company: "Innovation Works", role: "Community Coordinator",
    neighbourhood: "Downtown", score: 84, offers: 90, field: true, posted: "3 days ago", applicants: 11,
    blurb: "Social-impact coworking hub at 201 King Street.",
    about: "London's social-impact hub hosts 200+ members and weekly events. You'll coordinate programming, manage the member CRM and run community outreach.",
    reason: ["Builds your CRM & outreach", "Adjacent field", "Downtown"],
    required: ["Event Planning", "Communication", "Social Media", "CRM"],
    have:     ["Event Planning", "Social Media"],
  },
  {
    id: "m5", company: "Old East Village Grocer", role: "Merchandising Intern",
    neighbourhood: "Old East Village", score: 80, offers: 75, field: false, posted: "5 days ago", applicants: 7,
    blurb: "Community grocery championing local Ontario producers.",
    about: "A co-operative grocer two blocks from your home. Help with displays, local-producer onboarding and inventory — flexible shifts around classes.",
    reason: ["Retail & merchandising growth", "Near your home", "Old East Village"],
    required: ["Merchandising", "Excel", "Customer Service", "Inventory"],
    have:     ["Excel", "Customer Service"],
  },
  {
    id: "m6", company: "Powerhouse Brewing Co.", role: "Social Media Intern",
    neighbourhood: "Hyde Park", score: 76, offers: 60, field: true, posted: "6 days ago", applicants: 5,
    blurb: "Craft brewery & taproom in north-west London.",
    about: "A craft taproom in Hyde Park looking for a short, punchy social placement — perfect for topping up the last stretch of your hours.",
    reason: ["Great for a short top-up", "Creative field", "Hyde Park"],
    required: ["Social Media", "Content Writing", "Photography", "Canva"],
    have:     ["Social Media", "Content Writing", "Canva"],
  },
  {
    id: "m7", company: "Westmount Community Centre", role: "Programs Assistant",
    neighbourhood: "Westmount", score: 82, offers: 200, field: true, posted: "1 day ago", applicants: 8,
    blurb: "City recreation centre serving south-west London families.",
    about: "Run youth and senior programmes across a full season. A single, larger placement that could cover most of your remaining hours in one place.",
    reason: ["Covers most hours in one place", "Community field", "Westmount"],
    required: ["Event Planning", "Communication", "Customer Service", "Teamwork"],
    have:     ["Event Planning", "Customer Service", "Teamwork"],
  },
];

/* ---------- Student's applications (My Applications) ---------- */
const APPLICATIONS = [
  { id: "ap1", company: "Riverbend Design Co.", role: "Junior Brand Designer", neighbourhood: "SoHo", score: 95, offers: 140, status: "Shortlisted", date: "May 22" },
  { id: "ap2", company: "Powerhouse Brewing Co.", role: "Social Media Intern", neighbourhood: "Hyde Park", score: 76, offers: 60, status: "Accepted", date: "May 18" },
  { id: "ap3", company: "Innovation Works", role: "Community Coordinator", neighbourhood: "Downtown", score: 84, offers: 90, status: "Interested", date: "May 26" },
  { id: "ap4", company: "Thames Valley Marketing Group", role: "Marketing Assistant", neighbourhood: "Downtown", score: 91, offers: 150, status: "Active placement", date: "Apr 30" },
];
const APP_STATUS_ORDER = ["Interested", "Shortlisted", "Accepted", "Active placement"];

/* ---------- Employer (logged-in) ---------- */
const EMPLOYER = {
  name: "Thames Valley Marketing Group",
  contact: "Daniel Okafor",
  role: "Founder & Managing Director",
  location: "Downtown, London ON",
  email: "test@test.com",
};

/* ---------- Employer postings ---------- */
const POSTINGS = [
  { id: "o1", role: "Marketing Assistant", neighbourhood: "Downtown", offers: 150,
    status: "active", candidates: 14, newCount: 3, views: 212,
    field: "Business / Marketing",
    required: ["Social Media", "Content Writing", "Canva", "Excel", "Analytics"],
    desc: "Support our small-business clients with social content, campaign reporting and community management." },
  { id: "o2", role: "Content & Social Co-op", neighbourhood: "Downtown", offers: 120,
    status: "active", candidates: 9, newCount: 1, views: 138,
    field: "Communications / Media",
    required: ["Social Media", "Content Writing", "Photography", "Canva"],
    desc: "Plan and produce short-form video and graphics across client channels." },
  { id: "o3", role: "Brand Design Intern", neighbourhood: "Downtown", offers: 100,
    status: "draft", candidates: 0, newCount: 0, views: 0,
    field: "Design",
    required: ["Adobe Illustrator", "Brand Design", "Canva"],
    desc: "Help develop visual identities and templates for local clients." },
];

/* ---------- Matched candidates (for the Marketing Assistant posting) ---------- */
const CANDIDATES = [
  { id: "c1", name: "Maya Thompson", program: "Business Administration – Fanshawe", year: "Year 2",
    neighbourhood: "Old East Village", score: 92, field: true,
    availability: "Mon–Thu · 20 hrs/week",
    reason: ["4 of 5 skills · proven content", "In field", "Old East Village"],
    required: ["Social Media", "Content Writing", "Canva", "Excel", "Analytics"],
    have: ["Social Media", "Content Writing", "Canva", "Excel"],
    skills: ["Customer Service", "Social Media", "Content Writing", "Canva", "Excel", "Event Planning", "Teamwork", "POS Systems"],
    certifications: ["WHMIS 2015", "Smart Serve Ontario", "Google Digital Marketing"],
    hoursLeft: 150 },
  { id: "c2", name: "Liam Chen", program: "Computer Science – Western", year: "Year 3",
    neighbourhood: "Masonville", score: 88, field: true,
    availability: "Flexible · 16 hrs/week",
    reason: ["Analytics-strong · 4 of 5", "CS → marketing crossover", "Masonville"],
    required: ["Social Media", "Content Writing", "Canva", "Excel", "Analytics"],
    have: ["Social Media", "Analytics", "Excel", "Content Writing"],
    skills: ["Python", "Analytics", "Excel", "Social Media", "Content Writing", "SQL", "Automation"],
    certifications: ["Google Analytics", "HubSpot Inbound"],
    hoursLeft: 220 },
  { id: "c3", name: "Priya Nair", program: "Advertising & Marketing – Fanshawe", year: "Year 2",
    neighbourhood: "Wortley Village", score: 85, field: true,
    availability: "Tue–Fri · 24 hrs/week",
    reason: ["3 of 5 skills · advertising focus", "Exact field", "Wortley Village"],
    required: ["Social Media", "Content Writing", "Canva", "Excel", "Analytics"],
    have: ["Social Media", "Content Writing", "Canva"],
    skills: ["Social Media", "Content Writing", "Canva", "Copywriting", "Branding", "Photography"],
    certifications: ["Meta Blueprint", "Smart Serve Ontario"],
    hoursLeft: 180 },
  { id: "c4", name: "Jordan Bélanger", program: "Media & Communications – Western", year: "Year 4",
    neighbourhood: "Downtown", score: 80, field: true,
    availability: "Mon–Wed · 18 hrs/week",
    reason: ["2 of 5 · strong writer", "Comms field", "Downtown"],
    required: ["Social Media", "Content Writing", "Canva", "Excel", "Analytics"],
    have: ["Content Writing", "Social Media"],
    skills: ["Content Writing", "Social Media", "Journalism", "Editing", "Communication"],
    certifications: ["WHMIS 2015"],
    hoursLeft: 90 },
  { id: "c5", name: "Aanya Gupta", program: "Graphic Design – Fanshawe", year: "Year 1",
    neighbourhood: "SoHo", score: 76, field: false,
    availability: "Wed–Sat · 20 hrs/week",
    reason: ["Design-led · 2 of 5", "Adjacent field", "SoHo"],
    required: ["Social Media", "Content Writing", "Canva", "Excel", "Analytics"],
    have: ["Canva", "Social Media"],
    skills: ["Canva", "Adobe Illustrator", "Brand Design", "Social Media", "Photography"],
    certifications: ["Adobe Certified"],
    hoursLeft: 320 },
];

/* ---------- Hours-to-approve queue (employer) ---------- */
const APPROVALS = [
  { id: "a1", name: "Maya Thompson", role: "Marketing Assistant", week: "Jun 9 – Jun 15", hours: 20, note: "Client reporting + Wortley BIA campaign drafts." },
  { id: "a2", name: "Priya Nair", role: "Content & Social Co-op", week: "Jun 9 – Jun 15", hours: 16, note: "Filmed & edited 3 reels for taproom client." },
  { id: "a3", name: "Jordan Bélanger", role: "Marketing Assistant", week: "Jun 9 – Jun 15", hours: 12, note: "Community management + newsletter copy." },
];

/* ---------- Notifications ---------- */
const NOTIFS_STUDENT = [
  { id: "n1", icon: "check", tone: "green", title: "Forest City Roasters approved your 24 hrs", time: "2h ago", unread: true },
  { id: "n2", icon: "sparkle", tone: "teal", title: "New 95% match — Riverbend Design Co.", time: "5h ago", unread: true },
  { id: "n3", icon: "star", tone: "amber", title: "Thames Valley Marketing shortlisted you", time: "1d ago", unread: true },
  { id: "n4", icon: "award", tone: "teal", title: "You're 150 hours from your certificate", time: "2d ago", unread: false },
];
const NOTIFS_EMPLOYER = [
  { id: "en1", icon: "clock", tone: "amber", title: "Maya Thompson logged 20 hrs — approve?", time: "1h ago", unread: true },
  { id: "en2", icon: "users", tone: "teal", title: "3 new candidates for Marketing Assistant", time: "4h ago", unread: true },
  { id: "en3", icon: "heart", tone: "rose", title: "Liam Chen expressed interest", time: "1d ago", unread: true },
  { id: "en4", icon: "trending", tone: "teal", title: "Your Marketing Assistant posting hit 200 views", time: "2d ago", unread: false },
];

const SKILL_LIBRARY = [
  "Social Media","Content Writing","Canva","Excel","Analytics","Customer Service",
  "POS Systems","Inventory","Teamwork","Event Planning","Communication","CRM",
  "Brand Design","Adobe Illustrator","Photography","Merchandising","Outreach","Copywriting",
];

const PROGRAMS = [
  "Business Administration – Fanshawe","Advertising & Marketing – Fanshawe","Graphic Design – Fanshawe",
  "Computer Science – Western","Media & Communications – Western","Software Engineering – Western",
  "Hospitality & Tourism – Fanshawe","Nursing – Western","Interactive Media Design – Fanshawe",
];
const NEIGHBOURHOODS = ["Downtown","Old East Village","Wortley Village","SoHo","Hyde Park","Masonville","Byron","Westmount"];
const FIELDS = ["Business / Marketing","Communications / Media","Design","Technology","Hospitality / Retail","Community / Non-profit"];

Object.assign(window, {
  STUDENT, PLACEMENTS, MATCHES, APPLICATIONS, APP_STATUS_ORDER,
  EMPLOYER, POSTINGS, CANDIDATES, APPROVALS,
  NOTIFS_STUDENT, NOTIFS_EMPLOYER, SKILL_LIBRARY, PROGRAMS, NEIGHBOURHOODS, FIELDS,
  COMPANY_COLORS, getCompanyColor, avatarGradient, initials,
});
