import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireKetua } from "@/lib/guards";
import {
  listDepartments,
  listStaffWithDepartment,
} from "@/server/queries/dashboard";

import { ApproveStaffButton } from "./approve-staff-button";
import { ManageStaffDialog } from "./manage-staff-dialog";

export const metadata: Metadata = {
  title: "Kelola Staff — Dashboard Organisasi",
};

export default async function StaffPage() {
  await requireKetua();

  const [staff, departments] = await Promise.all([
    listStaffWithDepartment(),
    listDepartments(),
  ]);

  const departmentOptions = departments.map((d) => ({
    id: d.id,
    name: d.name,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kelola Staff</h1>
        <p className="text-muted-foreground">
          Setujui pendaftaran, tetapkan departemen, dan atur role pengguna.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Total {staff.length} pengguna terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada pengguna terdaftar.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.role === "ketua" ? "default" : "secondary"
                        }
                      >
                        {member.role === "ketua" ? "Ketua" : "Staff"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.department?.name ?? (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "active" ? "outline" : "destructive"
                        }
                      >
                        {member.status === "active" ? "Aktif" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {member.status === "pending" && (
                          <ApproveStaffButton
                            userId={member.id}
                            departmentId={member.departmentId}
                          />
                        )}
                        <ManageStaffDialog
                          staff={{
                            id: member.id,
                            name: member.name,
                            email: member.email,
                            role: member.role,
                            status: member.status,
                            departmentId: member.departmentId,
                          }}
                          departments={departmentOptions}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
