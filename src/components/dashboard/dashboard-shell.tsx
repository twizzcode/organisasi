import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserMenu } from "@/components/dashboard/user-menu";

type DashboardShellProps = {
  user: {
    name: string;
    email: string;
    role: string;
    departmentId: string | null;
  };
  departmentName?: string | null;
  children: React.ReactNode;
};

export function DashboardShell({
  user,
  departmentName,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            O
          </div>
          <span className="font-semibold">Organisasi</span>
        </div>
        <div className="flex-1 py-4">
          <SidebarNav role={user.role} />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              O
            </div>
            <span className="font-semibold">Organisasi</span>
          </div>
          <div className="hidden md:block" />
          <UserMenu
            name={user.name}
            email={user.email}
            role={user.role}
            departmentName={departmentName ?? null}
          />
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
