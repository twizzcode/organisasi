import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireActiveUser } from "@/lib/guards";
import { getDepartmentById } from "@/server/queries/dashboard";

export const metadata: Metadata = {
  title: "Dashboard Organisasi",
};

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const session = await requireActiveUser();

  const departmentId = session.user.departmentId ?? null;
  const department = departmentId ? await getDepartmentById(departmentId) : null;

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role ?? "staff",
        departmentId,
      }}
      departmentName={department?.name ?? null}
    >
      {children}
    </DashboardShell>
  );
}
