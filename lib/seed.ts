/* ============================================================
   SideQuest — In-memory seed data (no real DB).
   Fictional but realistic London, Ontario businesses & students.
   Normalized to the spec entities; scores/reasons are NOT stored
   here — they're computed by score() in selectors.

   Certificate-demo seeding: Maya has 380 approved + 20 pending of
   her 400 required hours, so approving the one pending block in the
   employer Approve-Hours screen crosses the threshold and unlocks
   her certificate live.
   ============================================================ */

import type {
  Student,
  Employer,
  Opportunity,
  Application,
  Placement,
  HourLog,
  Notification,
  DataState,
} from "./types";
import { COMPANY_COLORS } from "./taxonomies";

/* ---------- Employers ---------- */
export const EMPLOYERS: Employer[] = [
  {
    id: "e_thames",
    companyName: "Thames Valley Marketing Group",
    location: "Downtown",
    field: "Business / Marketing",
    colorTag: COMPANY_COLORS["Thames Valley Marketing Group"],
    contact: "Daniel Okafor",
    contactRole: "Founder & Managing Director",
  },
  {
    id: "e_riverbend",
    companyName: "Riverbend Design Co.",
    location: "SoHo",
    field: "Design",
    colorTag: COMPANY_COLORS["Riverbend Design Co."],
    contact: "Sofia Marchetti",
    contactRole: "Creative Director",
  },
  {
    id: "e_forest",
    companyName: "Forest City Roasters",
    location: "Wortley Village",
    field: "Hospitality / Retail",
    colorTag: COMPANY_COLORS["Forest City Roasters"],
    contact: "Owen Reid",
    contactRole: "Owner",
  },
  {
    id: "e_northern",
    companyName: "Northern Currents Studio",
    location: "SoHo",
    field: "Communications / Media",
    colorTag: COMPANY_COLORS["Northern Currents Studio"],
    contact: "Hana Park",
    contactRole: "Studio Lead",
  },
  {
    id: "e_innov",
    companyName: "Innovation Works",
    location: "Downtown",
    field: "Community / Non-profit",
    colorTag: COMPANY_COLORS["Innovation Works"],
    contact: "Marcus Lefebvre",
    contactRole: "Community Manager",
  },
  {
    id: "e_grocer",
    companyName: "Old East Village Grocer",
    location: "Old East Village",
    field: "Hospitality / Retail",
    colorTag: COMPANY_COLORS["Old East Village Grocer"],
    contact: "Devon Clarke",
    contactRole: "Store Manager",
  },
  {
    id: "e_power",
    companyName: "Powerhouse Brewing Co.",
    location: "Hyde Park",
    field: "Communications / Media",
    colorTag: COMPANY_COLORS["Powerhouse Brewing Co."],
    contact: "Riley Stone",
    contactRole: "Marketing Lead",
  },
  {
    id: "e_westmount",
    companyName: "Westmount Community Centre",
    location: "Westmount",
    field: "Community / Non-profit",
    colorTag: COMPANY_COLORS["Westmount Community Centre"],
    contact: "Grace Adeyemi",
    contactRole: "Programs Director",
  },
];

/* ---------- Students ---------- */
export const STUDENTS: Student[] = [
  {
    id: "s_maya",
    name: "Maya Thompson",
    school: "Fanshawe College",
    program: "Business Administration – Fanshawe",
    field: "Business / Marketing",
    year: "Year 2",
    location: "Old East Village",
    availability: "Mon–Thu · 20 hrs/week",
    availabilityHours: 20,
    skills: [
      "Customer Service",
      "Social Media",
      "Content Writing",
      "Canva",
      "Excel",
      "Event Planning",
      "Teamwork",
      "POS Systems",
    ],
    transferableSkills: ["Communication", "CRM"],
    certifications: ["WHMIS 2015", "Smart Serve Ontario", "Google Digital Marketing"],
    hoursRequired: 400,
    profileStrength: 85,
  },
  {
    id: "s_liam",
    name: "Liam Chen",
    school: "Western University",
    program: "Computer Science – Western",
    field: "Technology",
    year: "Year 3",
    location: "Masonville",
    availability: "Flexible · 16 hrs/week",
    availabilityHours: 16,
    skills: ["Analytics", "Excel", "Social Media", "Content Writing", "CRM", "Communication"],
    transferableSkills: ["Canva", "Teamwork"],
    certifications: ["Google Analytics", "HubSpot Inbound"],
    hoursRequired: 420,
    profileStrength: 72,
  },
  {
    id: "s_priya",
    name: "Priya Nair",
    school: "Fanshawe College",
    program: "Advertising & Marketing – Fanshawe",
    field: "Business / Marketing",
    year: "Year 2",
    location: "Wortley Village",
    availability: "Tue–Fri · 24 hrs/week",
    availabilityHours: 24,
    skills: ["Social Media", "Content Writing", "Canva", "Copywriting", "Photography", "Brand Design"],
    transferableSkills: ["Customer Service", "Event Planning"],
    certifications: ["Meta Blueprint", "Smart Serve Ontario"],
    hoursRequired: 300,
    profileStrength: 78,
  },
  {
    id: "s_jordan",
    name: "Jordan Bélanger",
    school: "Western University",
    program: "Media & Communications – Western",
    field: "Communications / Media",
    year: "Year 4",
    location: "Downtown",
    availability: "Mon–Wed · 18 hrs/week",
    availabilityHours: 18,
    skills: ["Content Writing", "Social Media", "Communication", "Outreach"],
    transferableSkills: ["Canva", "Event Planning"],
    certifications: ["WHMIS 2015"],
    hoursRequired: 240,
    profileStrength: 66,
  },
  {
    id: "s_aanya",
    name: "Aanya Gupta",
    school: "Fanshawe College",
    program: "Graphic Design – Fanshawe",
    field: "Design",
    year: "Year 1",
    location: "SoHo",
    availability: "Wed–Sat · 20 hrs/week",
    availabilityHours: 20,
    skills: ["Canva", "Adobe Illustrator", "Brand Design", "Social Media", "Photography"],
    transferableSkills: ["Content Writing", "Teamwork"],
    certifications: ["Adobe Certified"],
    hoursRequired: 400,
    profileStrength: 60,
  },
];

/* ---------- Opportunities ----------
   o_ma is the logged-in employer's flagship posting AND Maya's
   match m2 — the same record powers both sides (intentional). */
export const OPPORTUNITIES: Opportunity[] = [
  // Thames Valley Marketing Group (logged-in employer) postings
  {
    id: "o_ma",
    employerId: "e_thames",
    title: "Marketing Assistant",
    description:
      "Support our small-business clients with social content, campaign reporting and community management.",
    blurb: "Full-service agency serving downtown London small businesses.",
    about:
      "A downtown agency running social and campaigns for 30+ local clients. Expect a mix of content, reporting and community management with weekly mentorship.",
    requiredSkills: ["Social Media", "Content Writing", "Canva", "Excel", "Analytics"],
    field: "Business / Marketing",
    location: "Downtown",
    hoursOffered: 150,
    status: "active",
    views: 212,
    postedDaysAgo: 4,
    seedCandidateCount: 14,
    seedNewCount: 3,
  },
  {
    id: "o_cs",
    employerId: "e_thames",
    title: "Content & Social Co-op",
    description: "Plan and produce short-form video and graphics across client channels.",
    blurb: "Short-form content and social production for local clients.",
    about:
      "Join our content pod producing reels, graphics and newsletters for taprooms, cafés and retailers across London.",
    requiredSkills: ["Social Media", "Content Writing", "Photography", "Canva"],
    field: "Communications / Media",
    location: "Downtown",
    hoursOffered: 120,
    status: "active",
    views: 138,
    postedDaysAgo: 6,
    seedCandidateCount: 9,
    seedNewCount: 1,
  },
  {
    id: "o_bd",
    employerId: "e_thames",
    title: "Brand Design Intern",
    description: "Help develop visual identities and templates for local clients.",
    blurb: "Visual identity and template work for small-business clients.",
    about:
      "Work alongside our designers building brand systems, social templates and pitch decks for London small businesses.",
    requiredSkills: ["Adobe Illustrator", "Brand Design", "Canva"],
    field: "Design",
    location: "Downtown",
    hoursOffered: 100,
    status: "draft",
    views: 0,
    postedDaysAgo: 1,
    seedCandidateCount: 0,
    seedNewCount: 0,
  },
  // Other employers' open opportunities (Maya's matches)
  {
    id: "o_rb",
    employerId: "e_riverbend",
    title: "Junior Brand Designer",
    description: "Ship real client work alongside senior designers in a boutique studio.",
    blurb: "Boutique studio crafting brand identities for Forest City makers.",
    about:
      "Riverbend is a six-person brand studio in SoHo working with London restaurants, breweries and non-profits. You'll sit with senior designers and ship real client work.",
    requiredSkills: ["Canva", "Social Media", "Content Writing", "Brand Design", "Adobe Illustrator"],
    field: "Design",
    location: "SoHo",
    hoursOffered: 140,
    status: "active",
    views: 96,
    postedDaysAgo: 2,
    seedCandidateCount: 6,
    seedNewCount: 2,
  },
  {
    id: "o_fcl",
    employerId: "e_forest",
    title: "Front-of-House Lead",
    description: "Extend your placement and pick up customer-experience leadership hours.",
    blurb: "Independent coffee roaster & café on Wortley Road.",
    about:
      "The Wortley Road café is expanding its team-lead programme — pick up customer-experience leadership hours close to home.",
    requiredSkills: ["Customer Service", "POS Systems", "Inventory", "Teamwork"],
    field: "Hospitality / Retail",
    location: "Wortley Village",
    hoursOffered: 100,
    status: "active",
    views: 64,
    postedDaysAgo: 7,
    seedCandidateCount: 9,
    seedNewCount: 0,
  },
  {
    id: "o_iw",
    employerId: "e_innov",
    title: "Community Coordinator",
    description: "Coordinate programming, manage the member CRM and run community outreach.",
    blurb: "Social-impact coworking hub at 201 King Street.",
    about:
      "London's social-impact hub hosts 200+ members and weekly events. You'll coordinate programming, manage the member CRM and run community outreach.",
    requiredSkills: ["Event Planning", "Communication", "Social Media", "CRM"],
    field: "Community / Non-profit",
    location: "Downtown",
    hoursOffered: 90,
    status: "active",
    views: 88,
    postedDaysAgo: 3,
    seedCandidateCount: 11,
    seedNewCount: 1,
  },
  {
    id: "o_grocer",
    employerId: "e_grocer",
    title: "Merchandising Intern",
    description: "Help with displays, local-producer onboarding and inventory.",
    blurb: "Community grocery championing local Ontario producers.",
    about:
      "A co-operative grocer two blocks from your home. Help with displays, local-producer onboarding and inventory — flexible shifts around classes.",
    requiredSkills: ["Merchandising", "Excel", "Customer Service", "Inventory"],
    field: "Hospitality / Retail",
    location: "Old East Village",
    hoursOffered: 75,
    status: "active",
    views: 52,
    postedDaysAgo: 5,
    seedCandidateCount: 7,
    seedNewCount: 0,
  },
  {
    id: "o_power",
    employerId: "e_power",
    title: "Social Media Intern",
    description: "A short, punchy social placement — perfect for topping up your hours.",
    blurb: "Craft brewery & taproom in north-west London.",
    about:
      "A craft taproom in Hyde Park looking for a short, punchy social placement — perfect for topping up the last stretch of your hours.",
    requiredSkills: ["Social Media", "Content Writing", "Photography", "Canva"],
    field: "Communications / Media",
    location: "Hyde Park",
    hoursOffered: 60,
    status: "active",
    views: 41,
    postedDaysAgo: 6,
    seedCandidateCount: 5,
    seedNewCount: 0,
  },
  {
    id: "o_west",
    employerId: "e_westmount",
    title: "Programs Assistant",
    description: "Run youth and senior programmes across a full season.",
    blurb: "City recreation centre serving south-west London families.",
    about:
      "Run youth and senior programmes across a full season. A single, larger placement that could cover most of your remaining hours in one place.",
    requiredSkills: ["Event Planning", "Communication", "Customer Service", "Teamwork"],
    field: "Community / Non-profit",
    location: "Westmount",
    hoursOffered: 200,
    status: "active",
    views: 73,
    postedDaysAgo: 1,
    seedCandidateCount: 8,
    seedNewCount: 1,
  },
  // Maya's accepted placements track their own opportunities
  {
    id: "o_fc_retail",
    employerId: "e_forest",
    title: "Retail & Operations Co-op",
    description: "Front-of-house service, POS and inventory at the Wortley Road café.",
    blurb: "Independent coffee roaster & café on Wortley Road.",
    about: "Maya's completed placement: retail and operations at Forest City Roasters.",
    requiredSkills: ["Customer Service", "POS Systems", "Teamwork", "Inventory"],
    field: "Hospitality / Retail",
    location: "Wortley Village",
    hoursOffered: 120,
    status: "active",
    views: 0,
    postedDaysAgo: 40,
    seedCandidateCount: 0,
    seedNewCount: 0,
  },
  {
    id: "o_nc_social",
    employerId: "e_northern",
    title: "Social Content Intern",
    description: "Plan and shoot social content for local brands.",
    blurb: "Independent content studio in SoHo.",
    about: "Maya's placement: social content production at Northern Currents Studio.",
    requiredSkills: ["Social Media", "Content Writing", "Canva", "Photography"],
    field: "Communications / Media",
    location: "SoHo",
    hoursOffered: 120,
    status: "active",
    views: 0,
    postedDaysAgo: 30,
    seedCandidateCount: 0,
    seedNewCount: 0,
  },
];

/* ---------- Applications (Maya's pipeline + employer candidate signals) ---------- */
export const APPLICATIONS: Application[] = [
  { id: "ap_maya_rb", studentId: "s_maya", opportunityId: "o_rb", status: "shortlisted", createdAt: "May 22" },
  { id: "ap_maya_power", studentId: "s_maya", opportunityId: "o_power", status: "accepted", createdAt: "May 18" },
  { id: "ap_maya_iw", studentId: "s_maya", opportunityId: "o_iw", status: "interested", createdAt: "May 26" },
  { id: "ap_maya_ma", studentId: "s_maya", opportunityId: "o_ma", status: "active", createdAt: "Apr 30" },
  // other candidates who expressed interest in the logged-in employer's posting
  { id: "ap_liam_ma", studentId: "s_liam", opportunityId: "o_ma", status: "interested", createdAt: "May 24" },
  { id: "ap_jordan_ma", studentId: "s_jordan", opportunityId: "o_ma", status: "interested", createdAt: "May 25" },
  { id: "ap_priya_cs", studentId: "s_priya", opportunityId: "o_cs", status: "shortlisted", createdAt: "May 20" },
];

/* ---------- Placements (Maya tracking hours across 3 businesses) ---------- */
export const PLACEMENTS: Placement[] = [
  { id: "pl1", studentId: "s_maya", opportunityId: "o_fc_retail", hoursTarget: 120, status: "complete", started: "Apr 28" },
  { id: "pl2", studentId: "s_maya", opportunityId: "o_ma", hoursTarget: 160, status: "active", started: "May 5" },
  { id: "pl3", studentId: "s_maya", opportunityId: "o_nc_social", hoursTarget: 120, status: "complete", started: "May 12" },
];

/* ---------- Hour logs (approved/pending derive from these) ----------
   pl1: 120 approved · pl2: 140 approved + 20 pending · pl3: 120 approved
   → 380 approved, 20 pending, of 400 required. */
export const HOUR_LOGS: HourLog[] = [
  // pl1 — Forest City Roasters (complete, 120)
  { id: "hl1", placementId: "pl1", weekRange: "Apr 28 – May 4", hours: 24, note: "Open & close, POS training", status: "approved" },
  { id: "hl2", placementId: "pl1", weekRange: "May 5 – May 11", hours: 24, note: "Bar service + inventory count", status: "approved" },
  { id: "hl3", placementId: "pl1", weekRange: "May 12 – May 18", hours: 24, note: "Customer service, restock", status: "approved" },
  { id: "hl4", placementId: "pl1", weekRange: "May 19 – May 25", hours: 24, note: "Weekend lead shifts", status: "approved" },
  { id: "hl5", placementId: "pl1", weekRange: "May 26 – Jun 1", hours: 24, note: "Team onboarding support", status: "approved" },
  // pl2 — Thames Valley Marketing Assistant (140 approved + 20 pending)
  { id: "hl6", placementId: "pl2", weekRange: "May 5 – May 11", hours: 24, note: "Client social calendar", status: "approved" },
  { id: "hl7", placementId: "pl2", weekRange: "May 12 – May 18", hours: 24, note: "Campaign reporting", status: "approved" },
  { id: "hl8", placementId: "pl2", weekRange: "May 19 – May 25", hours: 24, note: "Community management", status: "approved" },
  { id: "hl9", placementId: "pl2", weekRange: "May 26 – Jun 1", hours: 24, note: "Content writing + Canva", status: "approved" },
  { id: "hl10", placementId: "pl2", weekRange: "Jun 2 – Jun 8", hours: 24, note: "Analytics dashboards", status: "approved" },
  { id: "hl11", placementId: "pl2", weekRange: "Jun 9 – Jun 15", hours: 20, note: "Wortley BIA campaign drafts", status: "approved" },
  { id: "hl12", placementId: "pl2", weekRange: "Jun 16 – Jun 22", hours: 20, note: "Client reporting + Wortley BIA campaign drafts.", status: "pending" },
  // pl3 — Northern Currents Studio (complete, 120)
  { id: "hl13", placementId: "pl3", weekRange: "May 12 – May 18", hours: 20, note: "Reel shoots", status: "approved" },
  { id: "hl14", placementId: "pl3", weekRange: "May 19 – May 25", hours: 20, note: "Content calendar", status: "approved" },
  { id: "hl15", placementId: "pl3", weekRange: "May 26 – Jun 1", hours: 20, note: "Graphics + captions", status: "approved" },
  { id: "hl16", placementId: "pl3", weekRange: "Jun 2 – Jun 8", hours: 20, note: "Photo editing", status: "approved" },
  { id: "hl17", placementId: "pl3", weekRange: "Jun 9 – Jun 15", hours: 20, note: "Brand social templates", status: "approved" },
  { id: "hl18", placementId: "pl3", weekRange: "Jun 16 – Jun 22", hours: 20, note: "Final handoff", status: "approved" },
];

/* ---------- Notifications ---------- */
export const NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "s_maya", type: "hours_approved", icon: "check", tone: "green", text: "Forest City Roasters approved your 24 hrs", read: false, createdAt: "2h ago" },
  { id: "n2", userId: "s_maya", type: "match", icon: "sparkle", tone: "teal", text: "New top match — Riverbend Design Co.", read: false, createdAt: "5h ago" },
  { id: "n3", userId: "s_maya", type: "shortlisted", icon: "star", tone: "amber", text: "Thames Valley Marketing shortlisted you", read: false, createdAt: "1d ago" },
  { id: "n4", userId: "s_maya", type: "cert", icon: "award", tone: "teal", text: "You're 20 hours from your certificate", read: true, createdAt: "2d ago" },
  { id: "en1", userId: "e_thames", type: "hours_logged", icon: "clock", tone: "amber", text: "Maya Thompson logged 20 hrs — approve?", read: false, createdAt: "1h ago" },
  { id: "en2", userId: "e_thames", type: "candidates", icon: "users", tone: "teal", text: "3 new candidates for Marketing Assistant", read: false, createdAt: "4h ago" },
  { id: "en3", userId: "e_thames", type: "interest", icon: "heart", tone: "rose", text: "Liam Chen expressed interest", read: false, createdAt: "1d ago" },
  { id: "en4", userId: "e_thames", type: "views", icon: "trending", tone: "teal", text: "Your Marketing Assistant posting hit 200 views", read: true, createdAt: "2d ago" },
];

export function createInitialState(): DataState {
  return {
    role: "student",
    currentStudentId: "s_maya",
    currentEmployerId: "e_thames",
    students: STUDENTS.map((s) => ({
      ...s,
      skills: [...s.skills],
      transferableSkills: [...s.transferableSkills],
      certifications: [...s.certifications],
    })),
    employers: EMPLOYERS.map((e) => ({ ...e })),
    opportunities: OPPORTUNITIES.map((o) => ({ ...o, requiredSkills: [...o.requiredSkills] })),
    applications: APPLICATIONS.map((a) => ({ ...a })),
    placements: PLACEMENTS.map((p) => ({ ...p })),
    hourLogs: HOUR_LOGS.map((h) => ({ ...h })),
    notifications: NOTIFICATIONS.map((n) => ({ ...n })),
    toast: null,
  };
}
