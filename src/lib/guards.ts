import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/lib/auth";

export type Role = "ketua" | "staff";
export type Status = "pending" | "active";

/**
 * Returns the current session or null.
 * Awaits `connection()` so it is always rendered dynamically.
 */
export async function getSession() {
  await connection();
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Requires an authenticated user. Redirects to /sign-in if not logged in.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

/**
 * Requires an authenticated & active user.
 * Redirects pending users to /pending.
 */
export async function requireActiveUser() {
  const session = await requireAuth();
  if (session.user.status !== "active") redirect("/pending");
  return session;
}

/**
 * Requires the `ketua` role. Redirects staff to the dashboard.
 */
export async function requireKetua() {
  const session = await requireActiveUser();
  if (session.user.role !== "ketua") redirect("/dashboard");
  return session;
}

/**
 * Verifies that the current user can access the given department.
 * - ketua: always allowed
 * - staff: only their own department
 */
export function canAccessDepartment(
  session: { user: { role?: string | null; departmentId?: string | null } },
  departmentId: string,
): boolean {
  if (session.user.role === "ketua") return true;
  return session.user.departmentId === departmentId;
}

/**
 * Throws if the current user cannot access the given department.
 */
export function assertDepartmentAccess(
  session: { user: { role?: string | null; departmentId?: string | null } },
  departmentId: string,
): void {
  if (!canAccessDepartment(session, departmentId)) {
    throw new Error("Anda tidak memiliki akses ke departemen ini.");
  }
}
