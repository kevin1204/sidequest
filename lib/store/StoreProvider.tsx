"use client";

/* ============================================================
   SideQuest — Shared in-memory store (React Context + useReducer)
   Mounted once in the root layout so it survives client-side
   navigation across both the student and employer views.
   ============================================================ */

import React, { createContext, useContext, useEffect, useReducer, useMemo, useCallback } from "react";
import type { DataState, Role } from "../types";
import { createInitialState } from "../seed";
import { reducer, type Action } from "./reducer";

interface StoreApi {
  state: DataState;
  dispatch: React.Dispatch<Action>;
  // bound helpers (use the current student/employer where sensible)
  setRole: (role: Role) => void;
  expressInterest: (opportunityId: string) => void;
  expressInterestStack: (opportunityIds: string[]) => void;
  shortlist: (studentId: string, opportunityId: string) => void;
  accept: (studentId: string, opportunityId: string) => void;
  logHours: (placementId: string, weekRange: string, hours: number, note: string) => void;
  approveHours: (hourLogId: string) => void;
  rejectHours: (hourLogId: string) => void;
  addPosting: (posting: Extract<Action, { type: "ADD_POSTING" }>["posting"]) => void;
  setRequiredHours: (hours: number) => void;
  markNotifsRead: (userId: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  // auto-dismiss the toast
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 2600);
    return () => clearTimeout(t);
  }, [state.toast]);

  const setRole = useCallback((role: Role) => dispatch({ type: "SET_ROLE", role }), []);
  const expressInterest = useCallback(
    (opportunityId: string) =>
      dispatch({ type: "EXPRESS_INTEREST", studentId: state.currentStudentId, opportunityId }),
    [state.currentStudentId],
  );
  const expressInterestStack = useCallback(
    (opportunityIds: string[]) =>
      dispatch({ type: "EXPRESS_INTEREST_STACK", studentId: state.currentStudentId, opportunityIds }),
    [state.currentStudentId],
  );
  const shortlist = useCallback(
    (studentId: string, opportunityId: string) =>
      dispatch({ type: "EMPLOYER_SHORTLIST", studentId, opportunityId }),
    [],
  );
  const accept = useCallback(
    (studentId: string, opportunityId: string) =>
      dispatch({ type: "EMPLOYER_ACCEPT", studentId, opportunityId }),
    [],
  );
  const logHours = useCallback(
    (placementId: string, weekRange: string, hours: number, note: string) =>
      dispatch({ type: "LOG_HOURS", placementId, weekRange, hours, note }),
    [],
  );
  const approveHours = useCallback((hourLogId: string) => dispatch({ type: "APPROVE_HOURS", hourLogId }), []);
  const rejectHours = useCallback((hourLogId: string) => dispatch({ type: "REJECT_HOURS", hourLogId }), []);
  const addPosting = useCallback(
    (posting: Extract<Action, { type: "ADD_POSTING" }>["posting"]) =>
      dispatch({ type: "ADD_POSTING", posting }),
    [],
  );
  const setRequiredHours = useCallback(
    (hours: number) => dispatch({ type: "SET_REQUIRED_HOURS", studentId: state.currentStudentId, hours }),
    [state.currentStudentId],
  );
  const markNotifsRead = useCallback((userId: string) => dispatch({ type: "MARK_NOTIFS_READ", userId }), []);
  const showToast = useCallback((msg: string, icon = "check") => dispatch({ type: "SHOW_TOAST", msg, icon }), []);

  const api = useMemo<StoreApi>(
    () => ({
      state,
      dispatch,
      setRole,
      expressInterest,
      expressInterestStack,
      shortlist,
      accept,
      logHours,
      approveHours,
      rejectHours,
      addPosting,
      setRequiredHours,
      markNotifsRead,
      showToast,
    }),
    [
      state,
      setRole,
      expressInterest,
      expressInterestStack,
      shortlist,
      accept,
      logHours,
      approveHours,
      rejectHours,
      addPosting,
      setRequiredHours,
      markNotifsRead,
      showToast,
    ],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
