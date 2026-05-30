/* ============================================================
   TalentTie — Reducer. Every action persists into shared state
   (the spec's "golden rule"): Express Interest writes an
   Application both sides see; Approve Hours moves pending →
   approved so every derived total updates at once.
   ============================================================ */

import type { DataState, Role, Application, Placement, HourLog, Notification } from "../types";
import { getOpportunity, getStudent, getEmployer } from "./selectors";

let _seq = 0;
function uid(prefix: string): string {
  _seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${_seq}`;
}

export type Action =
  | { type: "SET_ROLE"; role: Role }
  | { type: "SHOW_TOAST"; msg: string; icon: string }
  | { type: "CLEAR_TOAST" }
  | { type: "EXPRESS_INTEREST"; studentId: string; opportunityId: string }
  | { type: "EXPRESS_INTEREST_STACK"; studentId: string; opportunityIds: string[] }
  | { type: "EMPLOYER_SHORTLIST"; studentId: string; opportunityId: string }
  | { type: "EMPLOYER_ACCEPT"; studentId: string; opportunityId: string }
  | { type: "LOG_HOURS"; placementId: string; weekRange: string; hours: number; note: string }
  | { type: "APPROVE_HOURS"; hourLogId: string }
  | { type: "REJECT_HOURS"; hourLogId: string }
  | {
      type: "ADD_POSTING";
      posting: {
        title: string;
        description: string;
        requiredSkills: string[];
        field: DataState["opportunities"][number]["field"];
        location: string;
        hoursOffered: number;
        status: "draft" | "active";
      };
    }
  | { type: "SET_REQUIRED_HOURS"; studentId: string; hours: number }
  | { type: "MARK_NOTIFS_READ"; userId: string }
  | { type: "UPDATE_STUDENT"; studentId: string; patch: Partial<DataState["students"][number]> };

function toast(state: DataState, msg: string, icon: string): DataState {
  return { ...state, toast: { msg, icon } };
}

function notify(
  state: DataState,
  n: Omit<Notification, "id" | "read" | "createdAt">,
): Notification[] {
  return [
    { ...n, id: uid("n"), read: false, createdAt: "Just now" },
    ...state.notifications,
  ];
}

const STATUS_RANK: Record<Application["status"], number> = {
  interested: 0,
  shortlisted: 1,
  accepted: 2,
  active: 3,
};

function ensureApplication(
  apps: Application[],
  studentId: string,
  opportunityId: string,
  status: Application["status"],
): Application[] {
  const existing = apps.find((a) => a.studentId === studentId && a.opportunityId === opportunityId);
  if (existing) {
    // never downgrade the pipeline (e.g. shortlisting an already-accepted candidate)
    const next = STATUS_RANK[status] > STATUS_RANK[existing.status] ? status : existing.status;
    return apps.map((a) => (a === existing ? { ...a, status: next } : a));
  }
  return [
    { id: uid("ap"), studentId, opportunityId, status, createdAt: "Today" },
    ...apps,
  ];
}

export function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.role };

    case "SHOW_TOAST":
      return toast(state, action.msg, action.icon);

    case "CLEAR_TOAST":
      return { ...state, toast: null };

    case "EXPRESS_INTEREST": {
      const opp = getOpportunity(state, action.opportunityId);
      const employer = opp && getEmployer(state, opp.employerId);
      const student = getStudent(state, action.studentId);
      const applications = ensureApplication(
        state.applications,
        action.studentId,
        action.opportunityId,
        "interested",
      );
      const notifications =
        opp && employer && student
          ? notify(state, {
              userId: employer.id,
              type: "interest",
              icon: "heart",
              tone: "rose",
              text: `${student.name} expressed interest in ${opp.title}`,
            })
          : state.notifications;
      return {
        ...state,
        applications,
        notifications,
        toast: employer ? { msg: `Interest sent to ${employer.companyName}`, icon: "heart" } : state.toast,
      };
    }

    case "EXPRESS_INTEREST_STACK": {
      let applications = state.applications;
      for (const oppId of action.opportunityIds) {
        applications = ensureApplication(applications, action.studentId, oppId, "interested");
      }
      const n = action.opportunityIds.length;
      return {
        ...state,
        applications,
        toast: { msg: `Interest sent to ${n} ${n === 1 ? "business" : "businesses"}`, icon: "layers" },
      };
    }

    case "EMPLOYER_SHORTLIST": {
      const applications = ensureApplication(
        state.applications,
        action.studentId,
        action.opportunityId,
        "shortlisted",
      );
      const student = getStudent(state, action.studentId);
      const notifications = student
        ? notify(state, {
            userId: action.studentId,
            type: "shortlisted",
            icon: "star",
            tone: "amber",
            text: `You were shortlisted for ${getOpportunity(state, action.opportunityId)?.title ?? "a role"}`,
          })
        : state.notifications;
      return {
        ...state,
        applications,
        notifications,
        toast: student ? { msg: `${student.name} shortlisted`, icon: "star" } : state.toast,
      };
    }

    case "EMPLOYER_ACCEPT": {
      const opp = getOpportunity(state, action.opportunityId);
      const student = getStudent(state, action.studentId);
      if (!opp || !student) return state;
      const applications = ensureApplication(
        state.applications,
        action.studentId,
        action.opportunityId,
        "active",
      );
      // accept creates a Placement (now tracking hours)
      const hasPlacement = state.placements.some(
        (p) => p.studentId === action.studentId && p.opportunityId === action.opportunityId,
      );
      const placements: Placement[] = hasPlacement
        ? state.placements
        : [
            ...state.placements,
            {
              id: uid("pl"),
              studentId: action.studentId,
              opportunityId: action.opportunityId,
              hoursTarget: opp.hoursOffered,
              status: "active",
              started: "Today",
            },
          ];
      const notifications = notify(state, {
        userId: action.studentId,
        type: "accepted",
        icon: "checkCircle",
        tone: "green",
        text: `${getEmployer(state, opp.employerId)?.companyName ?? "An employer"} accepted you for ${opp.title}`,
      });
      return {
        ...state,
        applications,
        placements,
        notifications,
        toast: { msg: `${student.name} accepted — placement created`, icon: "checkCircle" },
      };
    }

    case "LOG_HOURS": {
      const placement = state.placements.find((p) => p.id === action.placementId);
      const log: HourLog = {
        id: uid("hl"),
        placementId: action.placementId,
        weekRange: action.weekRange,
        hours: action.hours,
        note: action.note,
        status: "pending",
      };
      let notifications = state.notifications;
      if (placement) {
        const opp = getOpportunity(state, placement.opportunityId);
        const student = getStudent(state, placement.studentId);
        if (opp && student) {
          notifications = notify(state, {
            userId: opp.employerId,
            type: "hours_logged",
            icon: "clock",
            tone: "amber",
            text: `${student.name} logged ${action.hours} hrs — approve?`,
          });
        }
      }
      return {
        ...state,
        hourLogs: [...state.hourLogs, log],
        notifications,
        toast: { msg: `${action.hours} hours submitted for approval`, icon: "clock" },
      };
    }

    case "APPROVE_HOURS": {
      const log = state.hourLogs.find((h) => h.id === action.hourLogId);
      if (!log) return state;
      const hourLogs = state.hourLogs.map((h) =>
        h.id === action.hourLogId ? { ...h, status: "approved" as const } : h,
      );
      const placement = state.placements.find((p) => p.id === log.placementId);
      const opp = placement && getOpportunity(state, placement.opportunityId);
      const employer = opp && getEmployer(state, opp.employerId);
      const notifications =
        placement && employer
          ? notify(state, {
              userId: placement.studentId,
              type: "hours_approved",
              icon: "check",
              tone: "green",
              text: `${employer.companyName} approved your ${log.hours} hrs`,
            })
          : state.notifications;
      return {
        ...state,
        hourLogs,
        notifications,
        toast: { msg: `Approved ${log.hours} hours`, icon: "check" },
      };
    }

    case "REJECT_HOURS": {
      const log = state.hourLogs.find((h) => h.id === action.hourLogId);
      if (!log) return state;
      const hourLogs = state.hourLogs.map((h) =>
        h.id === action.hourLogId ? { ...h, status: "rejected" as const } : h,
      );
      return { ...state, hourLogs, toast: { msg: `Rejected ${log.hours} hours`, icon: "x" } };
    }

    case "ADD_POSTING": {
      const opp = {
        id: uid("o"),
        employerId: state.currentEmployerId,
        title: action.posting.title || "Untitled opportunity",
        description: action.posting.description,
        blurb: action.posting.description.slice(0, 80),
        about: action.posting.description,
        requiredSkills: action.posting.requiredSkills,
        field: action.posting.field,
        location: action.posting.location,
        hoursOffered: action.posting.hoursOffered,
        status: action.posting.status,
        views: 0,
        postedDaysAgo: 0,
        seedCandidateCount: 0,
        seedNewCount: 0,
      };
      return {
        ...state,
        opportunities: [opp, ...state.opportunities],
        toast: {
          msg: action.posting.status === "active" ? "Opportunity published" : "Saved as draft",
          icon: "bolt",
        },
      };
    }

    case "SET_REQUIRED_HOURS": {
      const students = state.students.map((s) =>
        s.id === action.studentId ? { ...s, hoursRequired: action.hours } : s,
      );
      return { ...state, students, toast: { msg: `Required hours updated to ${action.hours}`, icon: "check" } };
    }

    case "MARK_NOTIFS_READ": {
      const notifications = state.notifications.map((n) =>
        n.userId === action.userId ? { ...n, read: true } : n,
      );
      return { ...state, notifications };
    }

    case "UPDATE_STUDENT": {
      const students = state.students.map((s) =>
        s.id === action.studentId ? { ...s, ...action.patch } : s,
      );
      return { ...state, students };
    }

    default:
      return state;
  }
}
