/* ============================================================
   SideQuest — Selectors (pure derivations over DataState)
   Everything the UI shows (scores, hours totals, matches,
   candidates, certificate eligibility) is DERIVED here, never
   stored — so any action recomputes every dependent total.
   ============================================================ */

import type {
  DataState,
  Student,
  Employer,
  Opportunity,
  Application,
  MatchVM,
  CandidateVM,
  PlacementVM,
  Certificate,
  Notification,
} from "../types";
import { score } from "../scoring";

export function getStudent(state: DataState, id: string): Student | undefined {
  return state.students.find((s) => s.id === id);
}
export function getEmployer(state: DataState, id: string): Employer | undefined {
  return state.employers.find((e) => e.id === id);
}
export function getOpportunity(state: DataState, id: string): Opportunity | undefined {
  return state.opportunities.find((o) => o.id === id);
}
export function employerForOpportunity(state: DataState, opp: Opportunity): Employer | undefined {
  return getEmployer(state, opp.employerId);
}

export const currentStudent = (state: DataState) => getStudent(state, state.currentStudentId)!;
export const currentEmployer = (state: DataState) => getEmployer(state, state.currentEmployerId)!;

/* ---------- Hours ---------- */
export function placementsForStudent(state: DataState, studentId: string) {
  return state.placements.filter((p) => p.studentId === studentId);
}
export function logsForPlacement(state: DataState, placementId: string) {
  return state.hourLogs.filter((h) => h.placementId === placementId);
}
export function approvedHours(state: DataState, studentId: string): number {
  return placementsForStudent(state, studentId)
    .flatMap((p) => logsForPlacement(state, p.id))
    .filter((h) => h.status === "approved")
    .reduce((s, h) => s + h.hours, 0);
}
export function pendingHours(state: DataState, studentId: string): number {
  return placementsForStudent(state, studentId)
    .flatMap((p) => logsForPlacement(state, p.id))
    .filter((h) => h.status === "pending")
    .reduce((s, h) => s + h.hours, 0);
}
export function remainingHours(state: DataState, studentId: string): number {
  const st = getStudent(state, studentId);
  if (!st) return 0;
  return Math.max(0, st.hoursRequired - approvedHours(state, studentId));
}

/** Required skills covered only via the student's resume-inferred transferable
    skills (i.e. not already directly claimed). Mirrors score()'s `transfer`. */
function transferableHaveFor(student: Student, opp: Opportunity): string[] {
  return opp.requiredSkills.filter(
    (s) => !student.skills.includes(s) && (student.transferableSkills ?? []).includes(s),
  );
}

export function applicationFor(
  state: DataState,
  studentId: string,
  opportunityId: string,
): Application | undefined {
  return state.applications.find(
    (a) => a.studentId === studentId && a.opportunityId === opportunityId,
  );
}

/* ---------- View-model builders (use the shared score()) ---------- */
export function buildMatch(state: DataState, student: Student, opp: Opportunity): MatchVM {
  const employer = employerForOpportunity(state, opp)!;
  const res = score(student, opp, {
    remainingHours: remainingHours(state, student.id),
  });
  const have = opp.requiredSkills.filter((s) => student.skills.includes(s));
  const transferableHave = transferableHaveFor(student, opp);
  const app = applicationFor(state, student.id, opp.id);
  return {
    opportunity: opp,
    employer,
    company: employer.companyName,
    role: opp.title,
    neighbourhood: opp.location,
    score: res.score,
    reasons: res.reasons,
    dimensions: res.dimensions,
    required: opp.requiredSkills,
    have,
    transferableHave,
    offers: opp.hoursOffered,
    sameField: student.field === opp.field,
    about: opp.about,
    blurb: opp.blurb,
    postedDaysAgo: opp.postedDaysAgo,
    applicants: Math.max(opp.seedCandidateCount, state.applications.filter((a) => a.opportunityId === opp.id).length),
    applicationStatus: app?.status ?? null,
  };
}

export function buildCandidate(state: DataState, student: Student, opp: Opportunity): CandidateVM {
  const res = score(student, opp, {
    remainingHours: remainingHours(state, student.id),
  });
  const have = opp.requiredSkills.filter((s) => student.skills.includes(s));
  const transferableHave = transferableHaveFor(student, opp);
  const app = applicationFor(state, student.id, opp.id);
  return {
    student,
    id: student.id,
    name: student.name,
    program: student.program,
    year: student.year,
    neighbourhood: student.location,
    availability: student.availability,
    score: res.score,
    reasons: res.reasons,
    dimensions: res.dimensions,
    required: opp.requiredSkills,
    have,
    transferableHave,
    skills: student.skills,
    certifications: student.certifications,
    hoursLeft: remainingHours(state, student.id),
    sameField: student.field === opp.field,
    applicationStatus: app?.status ?? null,
  };
}

/** Ranked opportunities for a student (discovery): active, not already placed. */
export function matchesForStudent(state: DataState, studentId: string): MatchVM[] {
  const student = getStudent(state, studentId);
  if (!student) return [];
  const placedOppIds = new Set(placementsForStudent(state, studentId).map((p) => p.opportunityId));
  return state.opportunities
    .filter((o) => o.status === "active" && !placedOppIds.has(o.id))
    .map((o) => buildMatch(state, student, o))
    .sort((a, b) => b.score - a.score);
}

/** Ranked students for an opportunity (employer side) — same score() call. */
export function candidatesForOpportunity(state: DataState, opportunityId: string): CandidateVM[] {
  const opp = getOpportunity(state, opportunityId);
  if (!opp) return [];
  return state.students
    .map((s) => buildCandidate(state, s, opp))
    .sort((a, b) => b.score - a.score);
}

/* ---------- Placements (tracker view) ---------- */
export function placementVMs(state: DataState, studentId: string): PlacementVM[] {
  return placementsForStudent(state, studentId).map((p) => {
    const opp = getOpportunity(state, p.opportunityId)!;
    const employer = getEmployer(state, opp.employerId)!;
    const logs = logsForPlacement(state, p.id);
    const approved = logs.filter((l) => l.status === "approved").reduce((s, l) => s + l.hours, 0);
    const pending = logs.filter((l) => l.status === "pending").reduce((s, l) => s + l.hours, 0);
    return {
      placement: p,
      id: p.id,
      company: employer.companyName,
      role: opp.title,
      neighbourhood: opp.location,
      offered: p.hoursTarget,
      approved,
      pending,
      status: approved >= p.hoursTarget ? "complete" : "active",
      started: p.started,
      colorTag: employer.colorTag,
      logs,
    };
  });
}

/* ---------- Applications (student pipeline view) ---------- */
export interface ApplicationVM {
  application: Application;
  company: string;
  role: string;
  neighbourhood: string;
  offers: number;
  score: number;
  status: Application["status"];
  date: string;
}
export function applicationVMs(state: DataState, studentId: string): ApplicationVM[] {
  const student = getStudent(state, studentId)!;
  return state.applications
    .filter((a) => a.studentId === studentId)
    .map((a) => {
      const opp = getOpportunity(state, a.opportunityId)!;
      const employer = getEmployer(state, opp.employerId)!;
      const res = score(student, opp, { remainingHours: remainingHours(state, studentId) });
      return {
        application: a,
        company: employer.companyName,
        role: opp.title,
        neighbourhood: opp.location,
        offers: opp.hoursOffered,
        score: res.score,
        status: a.status,
        date: a.createdAt,
      };
    });
}

/* ---------- Certificate ---------- */
export function certificateEligible(state: DataState, studentId: string): boolean {
  const st = getStudent(state, studentId);
  return !!st && approvedHours(state, studentId) >= st.hoursRequired;
}

export function buildCertificate(state: DataState, studentId: string): Certificate {
  const breakdown = placementVMs(state, studentId)
    .filter((p) => p.approved > 0)
    .map((p) => {
      const approvedLogs = p.logs.filter((l) => l.status === "approved");
      const first = approvedLogs[0]?.weekRange.split("–")[0]?.trim();
      const last = approvedLogs[approvedLogs.length - 1]?.weekRange.split("–")[1]?.trim();
      const dates = first && last ? `${first} – ${last}, 2026` : `since ${p.started}`;
      return { employer: p.company, role: p.role, hours: p.approved, dates };
    });
  const total = breakdown.reduce((s, b) => s + b.hours, 0);
  return {
    id: `cert_${studentId}`,
    studentId,
    totalHours: total,
    breakdown,
    issueDate: "Jun 2026",
    verificationId: `TT-${studentId.slice(2, 6).toUpperCase()}-${total}`,
  };
}

/* ---------- Employer-side ---------- */
export function employerPostings(state: DataState, employerId: string): Opportunity[] {
  return state.opportunities.filter((o) => o.employerId === employerId);
}

export interface ApprovalVM {
  log: { id: string; weekRange: string; hours: number; note: string };
  studentName: string;
  studentPhoto?: string;
  role: string;
  company: string;
}
export function pendingApprovals(state: DataState, employerId: string): ApprovalVM[] {
  const result: ApprovalVM[] = [];
  for (const log of state.hourLogs) {
    if (log.status !== "pending") continue;
    const placement = state.placements.find((p) => p.id === log.placementId);
    if (!placement) continue;
    const opp = getOpportunity(state, placement.opportunityId);
    if (!opp || opp.employerId !== employerId) continue;
    const student = getStudent(state, placement.studentId);
    const employer = getEmployer(state, employerId);
    result.push({
      log: { id: log.id, weekRange: log.weekRange, hours: log.hours, note: log.note },
      studentName: student?.name ?? "Student",
      studentPhoto: student?.photo,
      role: opp.title,
      company: employer?.companyName ?? "",
    });
  }
  return result;
}

export function notificationsFor(state: DataState, userId: string): Notification[] {
  return state.notifications.filter((n) => n.userId === userId);
}
export function unreadCount(state: DataState, userId: string): number {
  return notificationsFor(state, userId).filter((n) => !n.read).length;
}
