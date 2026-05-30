import { AppShell } from "@/components/shell/AppShell";
import { RoleSync } from "@/components/shell/RoleSync";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoleSync role="student" />
      <AppShell role="student">{children}</AppShell>
    </>
  );
}
