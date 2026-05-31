"use client";

/* SideQuest — Student onboarding wizard (ported from onboarding.jsx).
   On finish it writes the profile onto the current student and routes
   to the matches dashboard. */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui";
import { WizardShell, ChipSelect, ResumePrelude, type ResumeApplyPayload } from "@/components/onboarding/Wizard";
import { useStore } from "@/lib/store/StoreProvider";
import { PROGRAMS, SKILL_LIBRARY, CERT_OPTIONS, YEARS, SCHOOLS, fieldForProgram } from "@/lib/taxonomies";

const AVAIL = ["10 hrs/week", "15 hrs/week", "20 hrs/week", "Full-time (summer)"];
function availHours(label: string): number {
  if (label.startsWith("Full")) return 40;
  const m = label.match(/\d+/);
  return m ? +m[0] : 20;
}

export default function StudentOnboardingPage() {
  const router = useRouter();
  const { state, dispatch, setRole } = useStore();
  const [mode, setMode] = useState<"prelude" | "wizard">("prelude");
  const [step, setStep] = useState(1);
  const [school, setSchool] = useState<string>("Fanshawe College");
  const [program, setProgram] = useState<string>(PROGRAMS[0].name);
  const [year, setYear] = useState("Year 2");
  const [avail, setAvail] = useState("20 hrs/week");
  const [skills, setSkills] = useState<string[]>(["Social Media", "Canva"]);
  const [transferableSkills, setTransferableSkills] = useState<string[]>([]);
  const [certs, setCerts] = useState<string[]>(["Smart Serve Ontario"]);
  const [hours, setHours] = useState(400);
  const total = 5;

  const toggle = (arr: string[], set: (v: string[]) => void) => (v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  /** Step 0b confirm → seed the wizard, then drop into the (now pre-filled) steps. */
  function applyResume(p: ResumeApplyPayload) {
    if (p.school && SCHOOLS.includes(p.school as (typeof SCHOOLS)[number])) setSchool(p.school);
    if (p.program && PROGRAMS.some((pr) => pr.name === p.program)) setProgram(p.program);
    if (p.year && YEARS.includes(p.year)) setYear(p.year);
    if (p.availability && AVAIL.includes(p.availability)) setAvail(p.availability);
    if (p.hoursRequired) setHours(p.hoursRequired);
    if (p.skills.length) setSkills(p.skills);
    setTransferableSkills(p.transferableSkills);
    setCerts(p.certifications);
    setMode("wizard");
    setStep(1);
  }

  function finish() {
    dispatch({
      type: "UPDATE_STUDENT",
      studentId: state.currentStudentId,
      patch: {
        school,
        program,
        field: fieldForProgram(program),
        year,
        availability: avail,
        availabilityHours: availHours(avail),
        skills,
        transferableSkills,
        certifications: certs,
        hoursRequired: hours,
      },
    });
    setRole("student");
    router.push("/student/matches");
  }

  if (mode === "prelude") {
    return <ResumePrelude onSkip={() => setMode("wizard")} onApply={applyResume} />;
  }

  const next = () => (step < total ? setStep(step + 1) : finish());
  const back = () => setStep(step - 1);

  let content: React.ReactNode = null;
  let title = "";
  let sub: string | undefined;
  let canNext = true;
  let nextLabel: string | undefined;

  if (step === 1) {
    title = "Where do you study?";
    sub = "We use this to match you with placements your program recognizes.";
    content = (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="field">
          <label>School</label>
          <div style={{ display: "flex", gap: 10 }}>
            {SCHOOLS.map((s) => (
              <button key={s} className={`big-radio ${school === s ? "on" : ""}`} onClick={() => setSchool(s)}>
                <Icon name="cap" size={20} /> {s}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Program</label>
          <select className="selectbox" value={program} onChange={(e) => setProgram(e.target.value)}>
            {PROGRAMS.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  } else if (step === 2) {
    title = "Your year & availability";
    sub = "Helps employers see when you can work.";
    content = (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="field">
          <label>Year of study</label>
          <ChipSelect options={YEARS} selected={[year]} toggle={setYear} columns={4} />
        </div>
        <div className="field">
          <label>Weekly availability</label>
          <ChipSelect options={AVAIL} selected={[avail]} toggle={setAvail} columns={2} />
        </div>
      </div>
    );
  } else if (step === 3) {
    title = "What are your skills?";
    sub = "Pick the ones you're confident in — choose at least 3.";
    canNext = skills.length >= 3;
    content = (
      <div>
        <ChipSelect options={SKILL_LIBRARY} selected={skills} toggle={toggle(skills, setSkills)} />
        {transferableSkills.length > 0 && (
          <div className="note-box" style={{ marginTop: 16 }}>
            <Icon name="sparkle" size={16} style={{ color: "var(--teal)", flex: "none" }} />
            <span>
              Plus <b>{transferableSkills.length} transferable skill{transferableSkills.length === 1 ? "" : "s"}</b> from
              your résumé ({transferableSkills.join(", ")}) — counted in your matches at a lighter weight.
            </span>
          </div>
        )}
      </div>
    );
  } else if (step === 4) {
    title = "Any certifications?";
    sub = "Optional, but they boost your match scores.";
    content = <ChipSelect options={CERT_OPTIONS} selected={certs} toggle={toggle(certs, setCerts)} columns={2} />;
  } else {
    title = "How many co-op hours do you need?";
    sub = "Set by your program. You can change this anytime.";
    nextLabel = "Finish & see my matches";
    content = (
      <div>
        <div className="hours-slider-wrap">
          <input
            type="range"
            min="100"
            max="600"
            step="20"
            value={hours}
            onChange={(e) => setHours(+e.target.value)}
            className="hours-slider"
          />
          <div className="hours-readout tnum">
            {hours}
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}> hrs</span>
          </div>
        </div>
        <div className="note-box" style={{ marginTop: 16 }}>
          <Icon name="layers" size={16} style={{ color: "var(--teal)", flex: "none" }} />
          <span>
            You can complete these across several local businesses — SideQuest tracks the total and issues your certificate.
          </span>
        </div>
      </div>
    );
  }

  return (
    <WizardShell
      role="student"
      step={step}
      total={total}
      title={title}
      sub={sub}
      canNext={canNext}
      nextLabel={nextLabel}
      onBack={back}
      onNext={next}
    >
      {content}
    </WizardShell>
  );
}
