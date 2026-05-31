"use client";

/* SideQuest — Completion certificate (B4), ported from certificate-page.jsx.
   Locked until approved hours ≥ requirement; unlocks with a celebration.
   The breakdown is generated from the student's real approved placements. */

import React from "react";
import { useRouter } from "next/navigation";
import { Icon, LogoMark } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { buildCertificate, certificateEligible, approvedHours, remainingHours, currentStudent } from "@/lib/store/selectors";
import { getCompanyColor } from "@/lib/taxonomies";

function Seal() {
  return (
    <div className="cert-seal">
      <svg width="84" height="84" viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="var(--tl-50)" stroke="var(--tl-600)" strokeWidth="2" />
        <circle cx="42" cy="42" r="32" fill="none" stroke="var(--tl-300)" strokeWidth="1" strokeDasharray="2 3" />
        <path d="M42 24l3.6 7.3 8 1.2-5.8 5.7 1.4 8-7.2-3.8-7.2 3.8 1.4-8-5.8-5.7 8-1.2L42 24z" fill="var(--tl-600)" />
      </svg>
      <div className="cert-seal-label">
        Verified by
        <br />
        SideQuest
      </div>
    </div>
  );
}

export default function CertificatePage() {
  const router = useRouter();
  const { state } = useStore();
  const sid = state.currentStudentId;
  const student = currentStudent(state);
  const eligible = certificateEligible(state, sid);
  const cert = buildCertificate(state, sid);
  const approved = approvedHours(state, sid);
  const left = remainingHours(state, sid);
  const total = cert.totalHours;

  // Opens LinkedIn's real "Add licenses & certifications" flow, pre-filled
  // with the SideQuest certificate — tangible to show live in the demo.
  const shareToLinkedIn = () => {
    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: `${student.hoursRequired}-Hour Co-op Completion Certificate`,
      organizationName: "SideQuest",
      issueYear: "2026",
      issueMonth: "5",
      certId: cert.verificationId,
    });
    window.open(`https://www.linkedin.com/profile/add?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  const back = (
    <button className="btn btn-quiet btn-sm" onClick={() => router.push("/student/hours")} style={{ marginBottom: 14 }}>
      <Icon name="arrowLeft" size={15} /> Back to hours
    </button>
  );

  return (
    <div className="page">
      {back}

      <div className="cert-celebrate">
        {eligible ? (
          <>
            <span className="tag tag-green" style={{ height: 28, padding: "0 12px" }}>
              <Icon name="check" size={14} /> Requirement complete
            </span>
            <h2 style={{ fontSize: 26, marginTop: 12 }}>🎉 You did it, {student.name.split(" ")[0]}.</h2>
            <p style={{ color: "var(--muted)", marginTop: 6, maxWidth: 480, marginInline: "auto" }}>
              All {student.hoursRequired} required co-op hours are verified. Here&apos;s your official SideQuest completion
              certificate.
            </p>
          </>
        ) : (
          <>
            <span className="tag tag-amber" style={{ height: 28, padding: "0 12px" }}>
              <Icon name="clock" size={14} /> {left} hours to go
            </span>
            <h2 style={{ fontSize: 26, marginTop: 12 }}>Almost there, {student.name.split(" ")[0]}.</h2>
            <p style={{ color: "var(--muted)", marginTop: 6, maxWidth: 480, marginInline: "auto" }}>
              You&apos;ve banked {approved} of {student.hoursRequired} verified hours. This is a preview — finish your hours to
              issue the real certificate.
            </p>
          </>
        )}
      </div>

      <div className="cert-doc-wrap">
        <div className="cert-doc" style={eligible ? {} : { opacity: 0.85 }}>
          <div className="cert-doc-border" />
          <div className="cert-doc-inner">
            <div className="cert-doc-head">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LogoMark size={28} />
                <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-.02em" }}>SideQuest</span>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                Certificate of
                <br />
                Co-op Completion
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 22 }}>
              <div className="eyebrow">This certifies that</div>
              <div className="cert-name">{student.name}</div>
              <div style={{ color: "var(--ink-2)", fontWeight: 600, fontSize: 15, marginTop: 6 }}>
                {student.program} · {student.year}
              </div>
              <p style={{ color: "var(--muted)", marginTop: 14, maxWidth: 460, marginInline: "auto", lineHeight: 1.55 }}>
                has {eligible ? "successfully completed" : "completed so far"}{" "}
                <b style={{ color: "var(--ink)" }}>{total} verified co-op hours</b> across {cert.breakdown.length} placements
                with local London, Ontario businesses through the SideQuest platform.
              </p>
            </div>

            <div className="cert-total-row">
              <div className="cert-total-num">
                <div className="tnum" style={{ fontSize: 46, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                  {total}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>
                  Verified hours
                </div>
              </div>
              <Seal />
              <div className="cert-total-num">
                <div className="tnum" style={{ fontSize: 46, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                  {cert.breakdown.length}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em", marginTop: 4 }}>
                  Placements
                </div>
              </div>
            </div>

            <div className="cert-table">
              <div className="cert-table-head">
                <span>Employer</span>
                <span className="hide-sm">Role</span>
                <span>Dates</span>
                <span style={{ textAlign: "right" }}>Hours</span>
              </div>
              {cert.breakdown.map((b, i) => (
                <div key={i} className="cert-table-row">
                  <span style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, minWidth: 0 }}>
                    <span className="dot" style={{ width: 9, height: 9, background: getCompanyColor(b.employer), flex: "none" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.employer}</span>
                  </span>
                  <span className="hide-sm" style={{ color: "var(--muted)", fontSize: 13 }}>
                    {b.role}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{b.dates}</span>
                  <span className="tnum" style={{ textAlign: "right", fontWeight: 800 }}>
                    {b.hours}
                  </span>
                </div>
              ))}
              <div className="cert-table-row total">
                <span style={{ fontWeight: 800 }}>Total verified</span>
                <span className="hide-sm"></span>
                <span></span>
                <span className="tnum" style={{ textAlign: "right", fontWeight: 800, color: "var(--primary)" }}>
                  {total} hrs
                </span>
              </div>
            </div>

            <div className="cert-doc-foot">
              <div>
                <div className="cert-foot-k">Issued</div>
                <div className="cert-foot-v">{eligible ? cert.issueDate : "—"}</div>
              </div>
              <div>
                <div className="cert-foot-k">Credential ID</div>
                <div className="cert-foot-v tnum">{eligible ? cert.verificationId : "Pending"}</div>
              </div>
              <div>
                <div className="cert-foot-k">Verify at</div>
                <div className="cert-foot-v">sidequest.ca/verify</div>
              </div>
            </div>
          </div>
          {!eligible && (
            <div className="cert-lock">
              <Icon name="clock" size={15} /> Preview — finish your hours to issue the real certificate
            </div>
          )}
        </div>
      </div>

      <div className="cert-actions">
        <button className="btn btn-primary btn-lg" disabled={!eligible} onClick={() => window.print()}>
          <Icon name="download" size={18} /> Download PDF
        </button>
        <button className="btn btn-ghost btn-lg" disabled={!eligible} onClick={shareToLinkedIn}>
          <Icon name="linkedin" size={17} /> Share to LinkedIn
        </button>
        <span className="cert-uni-note">
          <Icon name="cap" size={15} /> University-recognized — coming soon with Fanshawe &amp; Western
        </span>
      </div>
    </div>
  );
}
