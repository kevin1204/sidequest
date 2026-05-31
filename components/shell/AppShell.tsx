"use client";

/* ============================================================
   SideQuest — App shell (sidebar + top bar), ported from
   shell.jsx and wired to the Next router + shared store.
   ============================================================ */

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon, Logo, Avatar } from "@/components/ui";
import { useStore } from "@/lib/store/StoreProvider";
import { currentStudent, currentEmployer, notificationsFor, pendingApprovals, unreadCount } from "@/lib/store/selectors";
import type { Notification, Role } from "@/lib/types";
import { STUDENT_NAV, EMPLOYER_NAV, NavItem, titleForPath, activeHref } from "./nav";

function SideLink({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`sidelink ${active ? "active" : ""}`}>
      <Icon name={icon} size={19} />
      <span>{label}</span>
      {badge ? <span className="side-badge">{badge}</span> : null}
    </button>
  );
}

function Sidebar({
  role,
  nav,
  active,
  navigate,
  approvals,
}: {
  role: Role;
  nav: NavItem[];
  active: string;
  navigate: (href: string) => void;
  approvals: number;
}) {
  const router = useRouter();
  return (
    <aside className="sidebar">
      <div style={{ padding: "20px 18px 14px" }}>
        <Logo size={28} onClick={() => router.push("/")} />
      </div>
      <nav style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
        {nav.map((n) => (
          <SideLink
            key={n.href}
            icon={n.icon}
            label={n.label}
            badge={n.badgeKey === "approvals" && approvals > 0 ? approvals : undefined}
            active={active === n.href}
            onClick={() => navigate(n.href)}
          />
        ))}
      </nav>

      {role === "employer" && (
        <div style={{ padding: "10px 16px" }}>
          <button className="btn btn-primary btn-block btn-sm" onClick={() => navigate("/employer/post")}>
            <Icon name="plus" size={16} /> Post an opportunity
          </button>
        </div>
      )}

      <div style={{ marginTop: "auto", padding: 12 }}>
        <div className="side-tip">
          <Icon name={role === "student" ? "award" : "trending"} size={18} style={{ color: "var(--primary)" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{role === "student" ? "Almost there" : "Hiring tip"}</div>
            <div style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45, marginTop: 2 }}>
              {role === "student"
                ? "Stack hours across businesses to unlock your certificate."
                : "Postings with 4–5 skills match 2× faster."}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NotifRow({ n }: { n: Notification }) {
  const toneColor =
    { green: "var(--green)", teal: "var(--tl-600)", amber: "var(--amber)", rose: "var(--rose)" }[n.tone] ||
    "var(--tl-600)";
  const toneBg =
    { green: "var(--green-bg)", teal: "var(--tl-50)", amber: "var(--amber-bg)", rose: "var(--rose-bg)" }[n.tone] ||
    "var(--tl-50)";
  return (
    <div className="notif-row">
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: toneBg,
          color: toneColor,
          display: "grid",
          placeItems: "center",
          flex: "none",
        }}
      >
        <Icon name={n.icon} size={17} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35 }}>{n.text}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{n.createdAt}</div>
      </div>
      {!n.read && <span className="dot" style={{ background: "var(--tl-600)", marginTop: 6 }} />}
    </div>
  );
}

function TopBar({
  role,
  title,
  who,
  notifs,
  unread,
  onMenu,
  onSwitchRole,
  onMarkRead,
}: {
  role: Role;
  title: string;
  who: { name: string; sub: string; photo?: string };
  notifs: Notification[];
  unread: number;
  onMenu: () => void;
  onSwitchRole: () => void;
  onMarkRead: () => void;
}) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [bell, setBell] = useState(false);
  const otherRole = role === "student" ? "employer" : "student";
  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button className="icon-btn only-mobile" onClick={onMenu}>
          <Icon name="menu" size={20} />
        </button>
        <h1 style={{ fontSize: 19, letterSpacing: "-.02em", whiteSpace: "nowrap", flexShrink: 0 }}>{title}</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button className="role-switch" onClick={onSwitchRole}>
          <Icon name="swap" size={15} />
          <span className="hide-sm">Switch to {otherRole}</span>
          <span className="role-switch-pill">Demo</span>
        </button>

        <button className="icon-btn hide-sm">
          <Icon name="search" size={19} />
        </button>
        <div style={{ position: "relative" }}>
          <button className="icon-btn" style={{ position: "relative" }} onClick={() => setBell((b) => !b)}>
            <Icon name="bell" size={19} />
            {unread > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 7,
                  minWidth: 16,
                  height: 16,
                  padding: "0 4px",
                  borderRadius: 999,
                  background: "var(--primary)",
                  border: "2px solid #fff",
                  color: "#fff",
                  fontSize: 9.5,
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {unread}
              </span>
            )}
          </button>
          {bell && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 30 }} onClick={() => setBell(false)} />
              <div className="notif-panel">
                <div className="notif-head">
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Notifications</span>
                  <span className="tag tag-blue" style={{ height: 22 }}>
                    {unread} new
                  </span>
                </div>
                <div className="notif-list">
                  {notifs.map((n) => (
                    <NotifRow key={n.id} n={n} />
                  ))}
                </div>
                <button
                  className="notif-foot"
                  onClick={() => {
                    onMarkRead();
                    setBell(false);
                  }}
                >
                  Mark all as read
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenu((m) => !m)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "4px 8px 4px 4px",
              borderRadius: 999,
              border: "1px solid var(--line)",
              background: "#fff",
            }}
          >
            <Avatar name={who.name} size={32} src={who.photo} />
            <span className="hide-sm" style={{ fontWeight: 600, fontSize: 13.5 }}>
              {who.name.split(" ")[0]}
            </span>
            <Icon name="chevDown" size={15} style={{ color: "var(--muted)" }} className="hide-sm" />
          </button>
          {menu && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 30 }} onClick={() => setMenu(false)} />
              <div className="usermenu">
                <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{who.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12.5 }}>{who.sub}</div>
                </div>
                <div style={{ padding: 6 }}>
                  <button
                    className="menu-item"
                    onClick={() => {
                      setMenu(false);
                      router.push(role === "student" ? "/student/profile" : "/employer/postings");
                    }}
                  >
                    <Icon name="user" size={16} /> {role === "student" ? "My profile" : "Company profile"}
                  </button>
                  <button
                    className="menu-item"
                    onClick={() => {
                      setMenu(false);
                      onSwitchRole();
                    }}
                  >
                    <Icon name="swap" size={16} /> Switch to {otherRole}
                  </button>
                  <button
                    className="menu-item danger"
                    onClick={() => {
                      setMenu(false);
                      router.push("/");
                    }}
                  >
                    <Icon name="logout" size={16} /> Log out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { state, setRole, markNotifsRead } = useStore();
  const [mobileNav, setMobileNav] = useState(false);

  const nav = role === "student" ? STUDENT_NAV : EMPLOYER_NAV;
  const userId = role === "student" ? state.currentStudentId : state.currentEmployerId;
  const who =
    role === "student"
      ? { name: currentStudent(state).name, sub: currentStudent(state).program, photo: currentStudent(state).photo }
      : { name: currentEmployer(state).contact, sub: currentEmployer(state).companyName, photo: undefined };
  const notifs = notificationsFor(state, userId);
  const unread = unreadCount(state, userId);
  const approvals = pendingApprovals(state, state.currentEmployerId).length;

  const navigate = (href: string) => {
    setMobileNav(false);
    router.push(href);
  };

  const switchRole = () => {
    const other: Role = role === "student" ? "employer" : "student";
    setRole(other);
    router.push(other === "student" ? "/student/matches" : "/employer/postings");
  };

  return (
    <div className="appshell">
      <div className={`sidebar-wrap ${mobileNav ? "open" : ""}`}>
        <Sidebar
          role={role}
          nav={nav}
          active={activeHref(pathname, nav)}
          navigate={navigate}
          approvals={approvals}
        />
      </div>
      {mobileNav && <div className="sidebar-scrim" onClick={() => setMobileNav(false)} />}
      <div className="main-col">
        <TopBar
          role={role}
          title={titleForPath(pathname)}
          who={who}
          notifs={notifs}
          unread={unread}
          onMenu={() => setMobileNav(true)}
          onSwitchRole={switchRole}
          onMarkRead={() => markNotifsRead(userId)}
        />
        <main className="main-scroll">{children}</main>
      </div>
    </div>
  );
}
