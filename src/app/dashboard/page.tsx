import { Building2, Users } from "lucide-react";

import { requireActiveUser } from "@/lib/guards";
import {
  listDepartments,
  listStaffWithDepartment,
} from "@/server/queries/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await requireActiveUser();
  const isKetua = session.user.role === "ketua";

  const departments = isKetua ? await listDepartments() : [];
  const staff = isKetua ? await listStaffWithDepartment() : [];

  const pendingCount = staff.filter((s) => s.status === "pending").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Selamat datang, {session.user.name}
        </h1>
        <p className="text-muted-foreground">
          {isKetua
            ? "Anda memiliki akses penuh ke seluruh departemen dan staff."
            : "Anda dapat melihat data departemen Anda."}
        </p>
      </div>

      {isKetua && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Departemen
              </CardTitle>
              <Building2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Menunggu Verifikasi
              </CardTitle>
              <Users className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Selanjutnya</CardTitle>
          <CardDescription>
            Fitur program kerja per departemen akan segera ditambahkan.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
