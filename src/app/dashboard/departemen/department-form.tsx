"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createDepartment,
  updateDepartment,
} from "@/server/actions/departments";

type DepartmentFormProps =
  | { mode: "create" }
  | {
      mode: "edit";
      department: { id: string; name: string; description: string | null };
    };

export function DepartmentForm(props: DepartmentFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = props.mode === "edit";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    const result = isEdit
      ? await updateDepartment(props.department.id, formData)
      : await createDepartment(formData);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon-sm" />
          ) : (
            <Button />
          )
        }
      >
        {isEdit ? (
          <Pencil className="size-4" />
        ) : (
          <>
            <Plus className="size-4" />
            Tambah Departemen
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Departemen" : "Tambah Departemen"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Ubah informasi departemen."
                : "Buat departemen baru untuk organisasi."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Departemen</Label>
              <Input
                id="name"
                name="name"
                placeholder="Contoh: Departemen Teknologi"
                defaultValue={isEdit ? props.department.name : ""}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi (opsional)</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Deskripsi singkat departemen"
                defaultValue={isEdit ? props.department.description ?? "" : ""}
                disabled={loading}
                rows={3}
                className="flex min-h-16 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
