"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStaff } from "@/server/actions/staff";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  departmentId: string | null;
};

type Department = { id: string; name: string };

const NO_DEPARTMENT = "none";

export function ManageStaffDialog({
  staff,
  departments,
}: {
  staff: StaffMember;
  departments: Department[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(staff.role);
  const [status, setStatus] = useState(staff.status);
  const [departmentId, setDepartmentId] = useState(
    staff.departmentId ?? NO_DEPARTMENT,
  );

  function reset() {
    setRole(staff.role);
    setStatus(staff.status);
    setDepartmentId(staff.departmentId ?? NO_DEPARTMENT);
  }

  async function onSave() {
    setLoading(true);
    const result = await updateStaff(staff.id, {
      role: role as "ketua" | "staff",
      status: status as "pending" | "active",
      departmentId: departmentId === NO_DEPARTMENT ? null : departmentId,
    });
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Settings2 className="size-4" />
        Kelola
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Staff</DialogTitle>
          <DialogDescription>
            {staff.name} — {staff.email}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value ?? "staff")}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="ketua">Ketua</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value ?? "pending")}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Departemen</Label>
            <Select
              value={departmentId}
              onValueChange={(value) => setDepartmentId(value ?? NO_DEPARTMENT)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_DEPARTMENT}>Tanpa Departemen</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
