"use client";

import { Toast } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";

/** Renders the global toast from shared state; mounted once in the root layout. */
export function ToastHost() {
  const { state } = useStore();
  return <Toast msg={state.toast?.msg} icon={state.toast?.icon} />;
}
