"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { departments } from "@/db/schema";
import { requireKetua } from "@/lib/guards";

export type ActionResult = {
  success: boolean;
  message: string;
};

const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama departemen minimal 2 karakter.")
    .max(100, "Nama departemen maksimal 100 karakter."),
  description: z
    .string()
    .trim()
    .max(500, "Deskripsi maksimal 500 karakter.")
    .optional()
    .or(z.literal("")),
});

export async function createDepartment(
  formData: FormData,
): Promise<ActionResult> {
  await requireKetua();

  const parsed = departmentSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { name, description } = parsed.data;

  const existing = await db
    .select({ id: departments.id })
    .from(departments)
    .where(eq(departments.name, name))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, message: "Nama departemen sudah digunakan." };
  }

  await db.insert(departments).values({
    name,
    description: description || null,
  });

  revalidatePath("/dashboard/departemen");
  revalidatePath("/dashboard");
  return { success: true, message: "Departemen berhasil dibuat." };
}

export async function updateDepartment(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireKetua();

  const parsed = departmentSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { name, description } = parsed.data;

  const existing = await db
    .select({ id: departments.id })
    .from(departments)
    .where(eq(departments.name, name))
    .limit(1);

  if (existing.length > 0 && existing[0].id !== id) {
    return { success: false, message: "Nama departemen sudah digunakan." };
  }

  const updated = await db
    .update(departments)
    .set({ name, description: description || null })
    .where(eq(departments.id, id))
    .returning({ id: departments.id });

  if (updated.length === 0) {
    return { success: false, message: "Departemen tidak ditemukan." };
  }

  revalidatePath("/dashboard/departemen");
  revalidatePath("/dashboard");
  return { success: true, message: "Departemen berhasil diperbarui." };
}

export async function deleteDepartment(id: string): Promise<ActionResult> {
  await requireKetua();

  const deleted = await db
    .delete(departments)
    .where(eq(departments.id, id))
    .returning({ id: departments.id });

  if (deleted.length === 0) {
    return { success: false, message: "Departemen tidak ditemukan." };
  }

  revalidatePath("/dashboard/departemen");
  revalidatePath("/dashboard");
  return { success: true, message: "Departemen berhasil dihapus." };
}
