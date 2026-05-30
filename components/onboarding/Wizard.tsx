"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Icon, Logo } from "@/components/ui";
import type { Role } from "@/lib/types";

export function WizardShell({
  role,
  step,
  total,
  title,
  sub,
  children,
  onBack,
  onNext,
  nextLabel,
  canNext = true,
}: {
  role: Role;
  step: number;
  total: number;
  title: string;
  sub?: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  canNext?: boolean;
}) {
  const router = useRouter();
  const pct = Math.round((step / total) * 100);
  return (
    <div className="wizard">
      <div className="wizard-top">
        <Logo size={26} onClick={() => router.push("/")} />
        <button className="btn btn-quiet btn-sm" onClick={() => router.push("/")}>
          <Icon name="x" size={16} /> Exit
        </button>
      </div>
      <div className="wizard-body">
        <div className="wizard-card fade-up">
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span className="eyebrow">{role === "student" ? "Student setup" : "Employer setup"}</span>
              <span className="hint tnum" style={{ fontWeight: 700 }}>
                Step {step} of {total}
              </span>
            </div>
            <div className="bar">
              <div className="bar-seg" style={{ width: `${pct}%`, background: "var(--primary)" }} />
            </div>
          </div>
          <h2 style={{ fontSize: 24, marginTop: 22 }}>{title}</h2>
          {sub && <p style={{ color: "var(--muted)", marginTop: 7 }}>{sub}</p>}
          <div style={{ marginTop: 22 }}>{children}</div>
          <div className="wizard-foot">
            {step > 1 ? (
              <button className="btn btn-ghost" onClick={onBack}>
                <Icon name="arrowLeft" size={15} /> Back
              </button>
            ) : (
              <span />
            )}
            <button className="btn btn-primary" onClick={onNext} disabled={!canNext}>
              {nextLabel || "Continue"} <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChipSelect({
  options,
  selected,
  toggle,
  columns,
}: {
  options: readonly string[];
  selected: string[];
  toggle: (v: string) => void;
  columns?: number;
}) {
  return (
    <div className="chip-select" style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {}}>
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button key={o} className={`select-chip ${on ? "on" : ""}`} onClick={() => toggle(o)}>
            <span className={`select-check ${on ? "on" : ""}`}>{on && <Icon name="check" size={12} />}</span>
            {o}
          </button>
        );
      })}
    </div>
  );
}
