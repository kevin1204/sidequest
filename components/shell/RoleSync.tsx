"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store/StoreProvider";
import type { Role } from "@/lib/types";

/** Keeps the store's current role in sync with the route group the user is in. */
export function RoleSync({ role }: { role: Role }) {
  const { state, setRole } = useStore();
  useEffect(() => {
    if (state.role !== role) setRole(role);
  }, [role, state.role, setRole]);
  return null;
}
