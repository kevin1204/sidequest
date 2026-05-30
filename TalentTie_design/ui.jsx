/* ============================================================
   TalentTie — Shared UI primitives
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---------- Icon set (Lucide-style strokes) ---------- */
const PATHS = {
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 18l-6-6 6-6",
  check: "M20 6L9 17l-5-5",
  checkCircle: "M22 11.08V12a10 10 0 1 1-5.93-9.14|M22 4L12 14.01l-3-3",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 6v6l4 2",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z|M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M23 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75",
  sparkle: "M12 3l1.9 5.3L19 10l-5.1 1.7L12 17l-1.9-5.3L5 10l5.1-1.7L12 3z",
  mapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z|M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z|M21 21l-4.35-4.35",
  plus: "M12 5v14M5 12h14",
  chevDown: "M6 9l6 6 6-6",
  chevRight: "M9 18l6-6-6-6",
  menu: "M3 12h18M3 6h18M3 18h18",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 0 1-3.46 0",
  cap: "M22 10L12 5 2 10l10 5 10-5z|M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5",
  building: "M3 21h18|M5 21V7l8-4v18|M19 21V11l-6-4|M9 9v.01M9 12v.01M9 15v.01M9 18v.01",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z",
  x: "M18 6L6 18M6 6l12 12",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4|M16 17l5-5-5-5|M21 12H9",
  swap: "M16 3l4 4-4 4|M20 7H4|M8 21l-4-4 4-4|M4 17h16",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z|M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  calendar: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z|M16 2v4M8 2v4M3 10h18",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z|M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3",
  trending: "M23 6l-9.5 9.5-5-5L1 18|M17 6h6v6",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  layers: "M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21l8.84-8.84a5.5 5.5 0 0 0 0-7.78z",
};
function Icon({ name, size = 18, className = "", style = {} }) {
  const d = PATHS[name] || "";
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={style}>
      {d.split("|").map((seg, i) => <path key={i} d={seg} />)}
    </svg>
  );
}

/* ---------- Logo ---------- */
function LogoMark({ size = 30 }) {
  // Two interlocking rounded squares = a "tie" / link between two sides
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="18" height="18" rx="6" fill="var(--tl-600)" />
      <rect x="12" y="12" width="18" height="18" rx="6" fill="var(--teal)" fillOpacity="0.92" />
      <rect x="12" y="12" width="8" height="8" rx="3" fill="#0c1322" fillOpacity="0.16" />
    </svg>
  );
}
function Logo({ size = 30, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={size} />
      <span style={{ fontWeight: 800, fontSize: size * 0.62, letterSpacing: "-.03em", color: "var(--ink)" }}>
        Talent<span style={{ color: "var(--primary)" }}>Tie</span>
      </span>
    </button>
  );
}

/* ---------- Avatar ---------- */
function Avatar({ name, size = 38 }) {
  return (
    <div className="av" style={{ width: size, height: size, background: avatarGradient(name), fontSize: size * 0.38 }}>
      {initials(name)}
    </div>
  );
}

/* ---------- Match score badge ---------- */
function MatchBadge({ score, large }) {
  const cls = score >= 86 ? "" : score >= 75 ? "mid" : "low";
  return (
    <span className={`match ${cls} ${large ? "match-lg" : ""}`}>
      <Icon name="sparkle" size={large ? 15 : 13} />
      {score}% match
    </span>
  );
}

/* ---------- Skill chips ---------- */
function SkillChip({ label, state }) {
  const cls = state === "have" ? "chip-have" : state === "miss" ? "chip-miss" : "";
  return (
    <span className={`chip ${cls}`}>
      {state === "have" && <Icon name="check" size={12} />}
      {label}
    </span>
  );
}
// Render required skills, highlighting which the candidate has
function SkillMatch({ required, have }) {
  const haveSet = new Set(have);
  return (
    <div className="chip-row">
      {required.map(s => <SkillChip key={s} label={s} state={haveSet.has(s) ? "have" : "miss"} />)}
    </div>
  );
}

/* ---------- Progress bar (multi-segment, animates from 0 on mount) ---------- */
function ProgressBar({ segments, total, large, animate = true }) {
  // segments: [{ value, color }]
  const [on, setOn] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setOn(true), 60);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`bar ${large ? "bar-lg" : ""}`}>
      {segments.map((s, i) => (
        <div key={i} className="bar-seg" style={{ width: on ? `${Math.min(100, (s.value / total) * 100)}%` : "0%", background: s.color }} />
      ))}
    </div>
  );
}

/* ---------- Reason line ---------- */
function ReasonLine({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13.5, fontWeight: 500 }}>
      {items.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: "var(--line)", fontWeight: 700 }}>·</span>}
          <span style={{ color: "var(--ink-2)", whiteSpace: "nowrap" }}>{t}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---------- Modal ---------- */
function Modal({ children, onClose, max = 440 }) {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" style={{ maxWidth: max }} onMouseDown={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ---------- Company tile (background = consistent company colour) ---------- */
function CoTile({ name, size = 48, radius = 13 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: getCompanyColor(name),
      display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: size * 0.34, flex: "none", letterSpacing: "-.02em" }}>
      {initials(name)}
    </div>
  );
}

/* ---------- Status pill (applications) ---------- */
const STATUS_STYLE = {
  "Interested":       { bg: "var(--bg-2)", fg: "var(--muted)", dot: "var(--muted-2)" },
  "Shortlisted":      { bg: "var(--amber-bg)", fg: "var(--amber)", dot: "var(--amber)" },
  "Accepted":         { bg: "var(--tl-50)", fg: "var(--tl-700)", dot: "var(--tl-600)" },
  "Active placement": { bg: "var(--green-bg)", fg: "var(--green)", dot: "var(--green)" },
};
function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE["Interested"];
  return (
    <span className="tag" style={{ background: s.bg, color: s.fg, height: 26, padding: "0 11px" }}>
      <span className="dot" style={{ background: s.dot }} /> {status}
    </span>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({ icon = "sparkle", title, body, ctaLabel, onCta, tint = true }) {
  return (
    <div className="empty">
      <div style={{ width: 60, height: 60, borderRadius: 16, margin: "0 auto",
        background: tint ? "var(--tl-50)" : "var(--bg-2)", color: tint ? "var(--primary)" : "var(--muted)",
        display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={28} />
      </div>
      <h3 style={{ fontSize: 18, marginTop: 16 }}>{title}</h3>
      <p style={{ color: "var(--muted)", marginTop: 8, maxWidth: 380, marginInline: "auto", lineHeight: 1.5 }}>{body}</p>
      {ctaLabel && <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={onCta}>{ctaLabel} <Icon name="arrowRight" size={16} /></button>}
    </div>
  );
}

/* ---------- Toast ---------- */
function Toast({ msg, icon }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)",
      background: "var(--ink)", color: "#fff", padding: "12px 18px", borderRadius: 12,
      display: "flex", alignItems: "center", gap: 9, fontWeight: 600, fontSize: 14,
      boxShadow: "var(--sh-lg)", zIndex: 90, animation: "fadeUp .3s var(--ease)",
    }}>
      <Icon name={icon || "check"} size={17} style={{ color: "var(--tl-300)" }} />
      {msg}
    </div>
  );
}

Object.assign(window, {
  Icon, Logo, LogoMark, Avatar, MatchBadge, SkillChip, SkillMatch,
  ProgressBar, ReasonLine, Modal, Toast, CoTile, StatusPill, EmptyState,
});
