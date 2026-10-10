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
import { listDepartments, listStaffWithDepartment } from "@/server/queries/dashboard";

import { DeleteDepartmentButton } from "./delete-department-button";
import { DepartmentForm } from "./department-form";

export const metadata: Metadata = {
  title: "Departemen — Dashboard Organisasi",
};

export default async function DepartemenPage() {
  await requireKetua();

  const [departments, staff] = await Promise.all([
    listDepartments(),
    listStaffWithDepartment(),
  ]);

  const memberCount = (departmentId: string) =>
    staff.filter((s) => s.departmentId === departmentId).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Departemen</h1>
          <p className="text-muted-foreground">
            Kelola departemen organisasi.
          </p>
        </div>
        <DepartmentForm mode="create" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Departemen</CardTitle>
          <CardDescription>
            Total {departments.length} departemen terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {departments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada departemen. Tambahkan departemen pertama Anda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Deskripsi
                  </TableHead>
                  <TableHead>Anggota</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell className="hidden max-w-xs truncate text-muted-foreground sm:table-cell">
                      {dept.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {memberCount(dept.id)} staff
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <DepartmentForm mode="edit" department={dept} />
                        <DeleteDepartmentButton id={dept.id} name={dept.name} />
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
