"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, Logo } from "@/components/ui";
import type { Role, ResumeExtraction, ExtractedConfidence } from "@/lib/types";
import { simulateResumeExtraction } from "@/lib/resume/simulate";

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

/* ============================================================
   Step 0 / 0b — optional résumé upload + transferable-skills review.
   Pre-fills the wizard; skipping leaves the manual flow untouched.
   ============================================================ */

export interface ResumeApplyPayload {
  school?: string;
  program?: string;
  year?: string;
  availability?: string;
  hoursRequired?: number;
  skills: string[]; // confirmed explicit (claimed)
  transferableSkills: string[]; // confirmed transferable (resume-inferred)
  certifications: string[];
}

function ConfidenceDot({ level }: { level: ExtractedConfidence }) {
  const color = level === "high" ? "var(--green)" : level === "medium" ? "var(--amber)" : "var(--muted-2)";
  return (
    <span
      title={`${level} confidence`}
      style={{ width: 8, height: 8, borderRadius: "50%", background: color, flex: "none" }}
    />
  );
}

function toggleSet(set: Set<string>, v: string): Set<string> {
  const next = new Set(set);
  if (next.has(v)) next.delete(v);
  else next.add(v);
  return next;
}

export function ResumePrelude({
  onSkip,
  onApply,
}: {
  onSkip: () => void;
  onApply: (p: ResumeApplyPayload) => void;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<"upload" | "parsing" | "review">("upload");
  const [fileName, setFileName] = useState("");
  const [extraction, setExtraction] = useState<ResumeExtraction | null>(null);
  const [explicitOn, setExplicitOn] = useState<Set<string>>(new Set());
  const [transferOn, setTransferOn] = useState<Set<string>>(new Set());
  const [certOn, setCertOn] = useState<Set<string>>(new Set());

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  }

  async function extract() {
    setStage("parsing");
    const ex = await simulateResumeExtraction({ fileName });
    setExtraction(ex);
    setExplicitOn(new Set(ex.explicitSkills.map((s) => s.skill)));
    setTransferOn(new Set(ex.transferableSkills.map((s) => s.skill)));
    setCertOn(new Set(ex.certifications));
    setStage("review");
  }

  function confirm() {
    if (!extraction) return;
    const skills = [...explicitOn];
    // dedup: a skill chosen as both counts as claimed only
    const transferableSkills = [...transferOn].filter((s) => !explicitOn.has(s));
    onApply({
      school: extraction.profile.school,
      program: extraction.profile.program,
      year: extraction.profile.year,
      availability: extraction.profile.availability,
      hoursRequired: extraction.profile.hoursRequired,
      skills,
      transferableSkills,
      certifications: [...certOn],
    });
  }

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
          {stage === "upload" && (
            <>
              <span className="eyebrow">Student setup · optional</span>
              <h2 style={{ fontSize: 24, marginTop: 10 }}>Have a résumé? Let&apos;s save you some typing.</h2>
              <p style={{ color: "var(--muted)", marginTop: 7 }}>
                We&apos;ll read it, pre-fill your profile, and surface the{" "}
                <b style={{ color: "var(--ink-2)" }}>transferable skills</b> hiding in your experience. You can edit
                everything after.
              </p>

              <label className="resume-drop" style={{ marginTop: 22 }}>
                <input type="file" accept=".pdf,.doc,.docx" onChange={onPick} hidden />
                <span className="resume-drop-icon">
                  <Icon name="download" size={26} />
                </span>
                <span className="resume-drop-main">
                  <span className="resume-drop-title">{fileName || "Drop your résumé here, or tap to browse"}</span>
                  <span className="hint">PDF or Word · stays on your device for this demo</span>
                </span>
                {fileName && <Icon name="check" size={18} style={{ color: "var(--green)", flex: "none" }} />}
              </label>

              <div className="wizard-foot">
                <button className="btn btn-ghost" onClick={onSkip}>
                  Skip — I&apos;ll fill it in myself
                </button>
                <button className="btn btn-primary" onClick={extract} disabled={!fileName}>
                  Extract my profile <Icon name="sparkle" size={16} />
                </button>
              </div>
            </>
          )}

          {stage === "parsing" && (
            <div className="resume-parsing">
              <span className="resume-parsing-icon">
                <Icon name="sparkle" size={26} />
              </span>
              <h2 style={{ fontSize: 22, marginTop: 16 }}>Reading your résumé…</h2>
              <p style={{ color: "var(--muted)", marginTop: 7 }}>Finding your skills and the transferable ones.</p>
              <div className="resume-parsing-bar" style={{ marginTop: 22 }}>
                <span />
              </div>
            </div>
          )}

          {stage === "review" && extraction && (
            <>
              <span className="eyebrow">Review &amp; confirm</span>
              <h2 style={{ fontSize: 23, marginTop: 10 }}>Here&apos;s what we found.</h2>
              <p style={{ color: "var(--muted)", marginTop: 7 }}>
                We&apos;ll pre-fill these — fine-tune anything on the next steps.
              </p>

              {/* Profile summary */}
              <div className="resume-summary">
                {[
                  extraction.profile.program,
                  extraction.profile.school,
                  extraction.profile.year,
                  extraction.profile.hoursRequired ? `${extraction.profile.hoursRequired} hrs required` : undefined,
                ]
                  .filter(Boolean)
                  .map((v) => (
                    <span key={v as string} className="resume-summary-pill">
                      {v}
                    </span>
                  ))}
              </div>

              {/* Explicit skills */}
              <div className="resume-section">
                <div className="resume-section-head">
                  <Icon name="check" size={15} style={{ color: "var(--tl-600)" }} /> Skills you listed
                </div>
                <div className="resume-skill-grid">
                  {extraction.explicitSkills.map((s) => {
                    const on = explicitOn.has(s.skill);
                    return (
                      <button
                        key={s.skill}
                        className={`resume-skill ${on ? "on" : ""}`}
                        onClick={() => setExplicitOn((p) => toggleSet(p, s.skill))}
                      >
                        <span className={`select-check ${on ? "on" : ""}`}>{on && <Icon name="check" size={12} />}</span>
                        <span className="resume-skill-body">
                          <span className="resume-skill-name">
                            {s.skill} <ConfidenceDot level={s.confidence} />
                          </span>
                          <span className="resume-skill-ev">{s.evidence}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Transferable skills — the differentiator */}
              <div className="resume-section">
                <div className="resume-section-head">
                  <Icon name="sparkle" size={15} style={{ color: "var(--tl-600)" }} /> Skills we spotted from your
                  experience
                </div>
                <p className="hint" style={{ marginBottom: 10 }}>
                  These come from what you&apos;ve done, not what you typed. Keep the ones that fit.
                </p>
                <div className="resume-skill-grid">
                  {extraction.transferableSkills.map((s) => {
                    const on = transferOn.has(s.skill);
                    return (
                      <button
                        key={s.skill}
                        className={`resume-skill transfer ${on ? "on" : ""}`}
                        onClick={() => setTransferOn((p) => toggleSet(p, s.skill))}
                      >
                        <span className={`select-check ${on ? "on" : ""}`}>{on && <Icon name="check" size={12} />}</span>
                        <span className="resume-skill-body">
                          <span className="resume-skill-name">
                            {s.skill} <ConfidenceDot level={s.confidence} />
                          </span>
                          <span className="resume-skill-ev">{s.evidence}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Certifications */}
              {extraction.certifications.length > 0 && (
                <div className="resume-section">
                  <div className="resume-section-head">
                    <Icon name="award" size={15} style={{ color: "var(--tl-600)" }} /> Certifications
                  </div>
                  <div className="chip-select" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                    {extraction.certifications.map((cert) => {
                      const on = certOn.has(cert);
                      return (
                        <button
                          key={cert}
                          className={`select-chip ${on ? "on" : ""}`}
                          onClick={() => setCertOn((p) => toggleSet(p, cert))}
                        >
                          <span className={`select-check ${on ? "on" : ""}`}>{on && <Icon name="check" size={12} />}</span>
                          {cert}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="wizard-foot">
                <button className="btn btn-ghost" onClick={onSkip}>
                  <Icon name="x" size={15} /> Skip résumé
                </button>
                <button className="btn btn-primary" onClick={confirm}>
                  Looks good — continue <Icon name="arrowRight" size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
