/* Navigation config + path → title/active mapping for the app shell. */

export interface NavItem {
  href: string;
  icon: string;
  label: string;
  badgeKey?: "approvals";
}

export const STUDENT_NAV: NavItem[] = [
  { href: "/student/matches", icon: "sparkle", label: "Matches" },
  { href: "/student/planner", icon: "layers", label: "Plan Hours" },
  { href: "/student/applications", icon: "heart", label: "Applications" },
  { href: "/student/hours", icon: "clock", label: "My Hours" },
  { href: "/student/profile", icon: "user", label: "My Profile" },
];

export const EMPLOYER_NAV: NavItem[] = [
  { href: "/employer/postings", icon: "briefcase", label: "My Postings" },
  { href: "/employer/candidates", icon: "users", label: "Candidates" },
  { href: "/employer/approve", icon: "clock", label: "Approve Hours", badgeKey: "approvals" },
];

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/student/matches", title: "Matches" },
  { prefix: "/student/planner", title: "Plan My Hours" },
  { prefix: "/student/applications", title: "My Applications" },
  { prefix: "/student/hours", title: "My Hours" },
  { prefix: "/student/profile", title: "My Profile" },
  { prefix: "/student/opportunity", title: "Opportunity" },
  { prefix: "/student/certificate", title: "Certificate" },
  { prefix: "/employer/postings", title: "Dashboard" },
  { prefix: "/employer/candidates", title: "Candidates" },
  { prefix: "/employer/candidate", title: "Candidate" },
  { prefix: "/employer/approve", title: "Approve Hours" },
  { prefix: "/employer/post", title: "Post an Opportunity" },
];

export function titleForPath(pathname: string): string {
  return TITLES.find((t) => pathname.startsWith(t.prefix))?.title ?? "";
}

/** Which nav item should be highlighted for the current path. */
export function activeHref(pathname: string, nav: NavItem[]): string {
  // detail pages map back to their list
  if (pathname.startsWith("/student/opportunity") || pathname.startsWith("/student/matches"))
    return "/student/matches";
  if (pathname.startsWith("/student/certificate") || pathname.startsWith("/student/hours"))
    return "/student/hours";
  if (pathname.startsWith("/employer/candidate")) return "/employer/candidates";
  if (pathname.startsWith("/employer/post")) return "/employer/postings";
  return nav.find((n) => pathname.startsWith(n.href))?.href ?? "";
}
