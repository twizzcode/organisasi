import { eq } from "drizzle-orm";

import { db } from "@/db";
import { departments, user } from "@/db/schema";

export async function getDepartmentById(id: string) {
  const [row] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, id))
    .limit(1);
  return row ?? null;
}

export async function listDepartments() {
  return db.select().from(departments).orderBy(departments.name);
}

export async function listStaffWithDepartment() {
  return db.query.user.findMany({
    with: { department: true },
    orderBy: (u, { asc }) => [asc(u.name)],
  });
}

export async function getUserById(id: string) {
  const [row] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  return row ?? null;
}
