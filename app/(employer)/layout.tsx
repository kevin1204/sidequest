import { AppShell } from "@/components/shell/AppShell";
import { RoleSync } from "@/components/shell/RoleSync";

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoleSync role="employer" />
      <AppShell role="employer">{children}</AppShell>
    </>
  );
}
