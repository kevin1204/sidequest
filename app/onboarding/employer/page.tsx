"use client";

/* SideQuest — Employer onboarding wizard (ported from onboarding.jsx).
   On finish it routes to "post your first opportunity". */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell, ChipSelect } from "@/components/onboarding/Wizard";
import { useStore } from "@/lib/store/StoreProvider";
import { NEIGHBOURHOODS, FIELDS } from "@/lib/taxonomies";
import type { Field } from "@/lib/types";

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const { setRole } = useStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [loc, setLoc] = useState("Downtown");
  const [field, setField] = useState<Field>("Business / Marketing");
  const total = 2;

  const finish = () => {
    setRole("employer");
    router.push("/employer/post");
  };
  const next = () => (step < total ? setStep(step + 1) : finish());
  const back = () => setStep(step - 1);

  let content: React.ReactNode = null;
  let title = "";
  let sub: string | undefined;
  let nextLabel: string | undefined;

  if (step === 1) {
    title = "Tell us about your business";
    sub = "This appears on your postings and candidate matches.";
    content = (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="field">
          <label>Business name</label>
          <input className="input" placeholder="e.g. Forest City Roasters" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Location</label>
          <select className="selectbox" value={loc} onChange={(e) => setLoc(e.target.value)}>
            {NEIGHBOURHOODS.map((n) => (
              <option key={n}>{n}, London ON</option>
            ))}
          </select>
        </div>
      </div>
    );
  } else {
    title = "What's your industry?";
    sub = "We use this to match you with students in the right field.";
    nextLabel = "Post my first opportunity";
    content = <ChipSelect options={FIELDS} selected={[field]} toggle={(v) => setField(v as Field)} columns={2} />;
  }

  return (
    <WizardShell role="employer" step={step} total={total} title={title} sub={sub} nextLabel={nextLabel} onBack={back} onNext={next}>
      {content}
    </WizardShell>
  );
}
