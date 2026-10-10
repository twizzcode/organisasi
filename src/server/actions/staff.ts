"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { user } from "@/db/schema";
import { requireKetua } from "@/lib/guards";
import type { ActionResult } from "@/server/actions/departments";

const updateStaffSchema = z.object({
  role: z.enum(["ketua", "staff"]),
  status: z.enum(["pending", "active"]),
  departmentId: z.string().uuid().nullable(),
});

export async function updateStaff(
  userId: string,
  input: {
    role: "ketua" | "staff";
    status: "pending" | "active";
    departmentId: string | null;
  },
): Promise<ActionResult> {
  const session = await requireKetua();

  const parsed = updateStaffSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { role, status, departmentId } = parsed.data;

  // Prevent the ketua from demoting themselves (avoids locking out the org).
  if (userId === session.user.id && role !== "ketua") {
    return {
      success: false,
      message: "Anda tidak dapat mengubah role Anda sendiri.",
    };
  }

  const updated = await db
    .update(user)
    .set({ role, status, departmentId })
    .where(eq(user.id, userId))
    .returning({ id: user.id });

  if (updated.length === 0) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard");
  return { success: true, message: "Data staff berhasil diperbarui." };
}

export async function approveStaff(
  userId: string,
  departmentId: string | null,
): Promise<ActionResult> {
  await requireKetua();

  const updated = await db
    .update(user)
    .set({ status: "active", departmentId })
    .where(eq(user.id, userId))
    .returning({ id: user.id });

  if (updated.length === 0) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard");
  return { success: true, message: "Staff berhasil diaktifkan." };
}
