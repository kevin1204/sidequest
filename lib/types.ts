/* ============================================================
   SideQuest — Domain types (normalized in-memory model)
   The spec's Data Model (BUILD_SPEC.md §F) — no real DB.
   ============================================================ */

export type Role = "student" | "employer";

export type Field =
  | "Business / Marketing"
  | "Communications / Media"
  | "Design"
  | "Technology"
  | "Hospitality / Retail"
  | "Community / Non-profit";

/** Internal application status. Display labels live in APP_STATUS_LABEL. */
export type ApplicationStatus = "interested" | "shortlisted" | "accepted" | "active";

export type OpportunityStatus = "draft" | "active";
export type PlacementStatus = "active" | "complete";
export type HourLogStatus = "pending" | "approved" | "rejected";

export interface Student {
  id: string;
  name: string;
  school: string;
  program: string;
  field: Field;
  year: string;
  location: string; // London neighbourhood
  availability: string; // human label, e.g. "Mon–Thu · 20 hrs/week"
  availabilityHours: number; // weekly hours, used for scoring
  skills: string[];
  /** AI-inferred from a resume and student-confirmed. Canonical taxonomy values,
      kept disjoint from `skills` — a skill the student also claims counts as claimed, not transferable. */
  transferableSkills: string[];
  certifications: string[];
  hoursRequired: number;
  profileStrength: number; // 0–100
}

export interface Employer {
  id: string;
  companyName: string;
  location: string;
  field: Field;
  colorTag: string; // hex, consistent company colour
  contact: string;
  contactRole: string;
}

export interface Opportunity {
  id: string;
  employerId: string;
  title: string;
  description: string;
  blurb: string;
  about: string;
  requiredSkills: string[];
  field: Field;
  location: string;
  hoursOffered: number;
  status: OpportunityStatus;
  views: number;
  postedDaysAgo: number;
  /** seed-only vanity count for the dashboard stat; the candidates list is scored live */
  seedCandidateCount: number;
  seedNewCount: number;
}

export interface Application {
  id: string;
  studentId: string;
  opportunityId: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Placement {
  id: string;
  studentId: string;
  opportunityId: string;
  hoursTarget: number;
  status: PlacementStatus;
  started: string;
}

export interface HourLog {
  id: string;
  placementId: string;
  weekRange: string;
  hours: number;
  note: string;
  status: HourLogStatus;
}

export interface Notification {
  id: string;
  userId: string; // student id or employer id
  type: string;
  text: string;
  icon: string; // Icon name
  tone: "green" | "teal" | "amber" | "rose";
  read: boolean;
  createdAt: string; // relative label, e.g. "2h ago"
}

export interface Certificate {
  id: string;
  studentId: string;
  totalHours: number;
  breakdown: { employer: string; role: string; hours: number; dates: string }[];
  issueDate: string;
  verificationId: string;
}

/* ---------- The full in-memory store shape ---------- */
export interface DataState {
  role: Role;
  currentStudentId: string;
  currentEmployerId: string;
  students: Student[];
  employers: Employer[];
  opportunities: Opportunity[];
  applications: Application[];
  placements: Placement[];
  hourLogs: HourLog[];
  notifications: Notification[];
  toast: { msg: string; icon: string } | null;
}

/* ---------- Scoring result ---------- */
export interface ScoreResult {
  score: number; // 0–100
  reasons: string[];
  /** raw dimension scores 0–1, for the detail-page breakdown */
  dimensions: {
    skills: number; // claimed skills (full credit)
    transferable: number; // resume-inferred skills (counted separately at a lower weight)
    field: number;
    hours: number;
  };
}

/* ---------- View models (computed; what the UI renders) ---------- */
export interface MatchVM {
  opportunity: Opportunity;
  employer: Employer;
  company: string;
  role: string;
  neighbourhood: string;
  score: number;
  reasons: string[];
  dimensions: ScoreResult["dimensions"];
  required: string[];
  have: string[]; // required skills the student directly claims
  transferableHave: string[]; // required skills covered only via resume-inferred transferable skills
  offers: number;
  sameField: boolean;
  about: string;
  blurb: string;
  postedDaysAgo: number;
  applicants: number;
  applicationStatus: ApplicationStatus | null;
}

export interface CandidateVM {
  student: Student;
  id: string;
  name: string;
  program: string;
  year: string;
  neighbourhood: string;
  availability: string;
  score: number;
  reasons: string[];
  dimensions: ScoreResult["dimensions"];
  required: string[];
  have: string[]; // required skills the candidate directly claims
  transferableHave: string[]; // required skills covered only via resume-inferred transferable skills
  skills: string[];
  certifications: string[];
  hoursLeft: number;
  sameField: boolean;
  applicationStatus: ApplicationStatus | null;
}

export interface PlacementVM {
  placement: Placement;
  id: string;
  company: string;
  role: string;
  neighbourhood: string;
  offered: number;
  approved: number;
  pending: number;
  status: PlacementStatus;
  started: string;
  colorTag: string;
  logs: HourLog[];
}

/* ---------- Resume extraction (the AI/parse contract) ----------
   What the resume parser returns. `skill` MUST be a SKILL_LIBRARY value
   (a real Claude call enforces this with an enum; the simulated extractor
   only emits taxonomy values). Explicit = stated on the resume; transferable
   = implied by experience the student wouldn't think to list. */
export type ExtractedConfidence = "high" | "medium" | "low";

export interface ExtractedSkill {
  skill: string; // canonical SKILL_LIBRARY value
  kind: "explicit" | "transferable";
  confidence: ExtractedConfidence;
  evidence: string; // the exact resume phrase that justifies it
}

export interface ResumeExtraction {
  profile: {
    name?: string;
    school?: string; // from SCHOOLS
    program?: string; // from PROGRAMS
    field?: Field;
    year?: string; // from YEARS
    availability?: string;
    availabilityHours?: number;
    hoursRequired?: number;
  };
  explicitSkills: ExtractedSkill[];
  transferableSkills: ExtractedSkill[];
  certifications: string[]; // matched to CERT_OPTIONS
  notes?: string;
}
