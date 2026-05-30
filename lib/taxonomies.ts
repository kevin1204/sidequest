/* ============================================================
   TalentTie — Fixed taxonomies (define once, reuse everywhere)
   Students PICK from these; never free-type — free text breaks
   matching (BUILD_SPEC.md §F).
   ============================================================ */

import type { Field } from "./types";

export const FIELDS: Field[] = [
  "Business / Marketing",
  "Communications / Media",
  "Design",
  "Technology",
  "Hospitality / Retail",
  "Community / Non-profit",
];

export const SCHOOLS = ["Fanshawe College", "Western University"] as const;

export const NEIGHBOURHOODS = [
  "Downtown",
  "Old East Village",
  "Wortley Village",
  "SoHo",
  "Hyde Park",
  "Masonville",
  "Byron",
  "Westmount",
] as const;

export const SKILL_LIBRARY = [
  "Social Media",
  "Content Writing",
  "Canva",
  "Excel",
  "Analytics",
  "Customer Service",
  "POS Systems",
  "Inventory",
  "Teamwork",
  "Event Planning",
  "Communication",
  "CRM",
  "Brand Design",
  "Adobe Illustrator",
  "Photography",
  "Merchandising",
  "Outreach",
  "Copywriting",
];

export const CERT_OPTIONS = [
  "WHMIS 2015",
  "Smart Serve Ontario",
  "Google Digital Marketing",
  "Google Analytics",
  "Meta Blueprint",
  "HubSpot Inbound",
  "Adobe Certified",
  "First Aid / CPR",
];

export const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4"];

export const AVAILABILITY_OPTIONS = [
  { label: "Mon–Thu · 20 hrs/week", hours: 20 },
  { label: "Tue–Fri · 24 hrs/week", hours: 24 },
  { label: "Flexible · 16 hrs/week", hours: 16 },
  { label: "Weekends · 12 hrs/week", hours: 12 },
];

/** Programs mapped to their field (BUILD_SPEC.md §F). */
export const PROGRAMS: { name: string; field: Field }[] = [
  { name: "Business Administration – Fanshawe", field: "Business / Marketing" },
  { name: "Advertising & Marketing – Fanshawe", field: "Business / Marketing" },
  { name: "Graphic Design – Fanshawe", field: "Design" },
  { name: "Interactive Media Design – Fanshawe", field: "Design" },
  { name: "Computer Science – Western", field: "Technology" },
  { name: "Software Engineering – Western", field: "Technology" },
  { name: "Media & Communications – Western", field: "Communications / Media" },
  { name: "Hospitality & Tourism – Fanshawe", field: "Hospitality / Retail" },
  { name: "Nursing – Western", field: "Community / Non-profit" },
];

export function fieldForProgram(program: string): Field {
  return PROGRAMS.find((p) => p.name === program)?.field ?? "Business / Marketing";
}

/** Fields that count as "adjacent" for partial field-fit credit. */
const FIELD_ADJACENCY: Record<Field, Field[]> = {
  "Business / Marketing": ["Communications / Media", "Design"],
  "Communications / Media": ["Business / Marketing", "Design"],
  Design: ["Communications / Media", "Business / Marketing"],
  Technology: ["Business / Marketing", "Communications / Media"],
  "Hospitality / Retail": ["Business / Marketing", "Community / Non-profit"],
  "Community / Non-profit": ["Hospitality / Retail", "Communications / Media"],
};

export function fieldAffinity(a: Field, b: Field): number {
  if (a === b) return 1;
  if (FIELD_ADJACENCY[a]?.includes(b)) return 0.6;
  return 0.3;
}

/* ---------- Consistent company → colour mapping ----------
   Used EVERYWHERE: dashboard bar, tracker bars, certificate. */
export const COMPANY_COLORS: Record<string, string> = {
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

export function getCompanyColor(name: string): string {
  if (COMPANY_COLORS[name]) return COMPANY_COLORS[name];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
}

/* ---------- Avatar helpers ---------- */
const AV_COLORS = [
  ["#1f7a6b", "#5ec2b0"],
  ["#2a8071", "#7fd3c4"],
  ["#7c3aed", "#c4b5fd"],
  ["#db2777", "#f9a8d4"],
  ["#ea580c", "#fdba74"],
  ["#0891b2", "#67e8f9"],
  ["#4f46e5", "#a5b4fc"],
  ["#16a34a", "#86efac"],
];

export function avatarGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  const c = AV_COLORS[h % AV_COLORS.length];
  return `linear-gradient(135deg, ${c[0]}, ${c[1]})`;
}

export function initials(name: string): string {
  const p = name.trim().split(/\s+/);
  return (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase();
}

/** Display labels for application statuses (the StatusPill copy). */
export const APP_STATUS_LABEL: Record<string, string> = {
  interested: "Interested",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  active: "Active placement",
};

export const APP_STATUS_ORDER = ["interested", "shortlisted", "accepted", "active"] as const;
