/**
 * Seed script: creates the first ketua (admin) account and a sample department.
 *
 * Usage:
 *   npx tsx src/db/seed.ts
 *
 * Requires DATABASE_URL in .env. The password is hashed with Better Auth's
 * own hashing so the account can sign in through the normal flow.
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import * as schema from "./schema";

config({ path: ".env" });

const KETUA_EMAIL = process.env.SEED_KETUA_EMAIL ?? "ketua@organisasi.com";
const KETUA_PASSWORD = process.env.SEED_KETUA_PASSWORD ?? "password123";
const KETUA_NAME = process.env.SEED_KETUA_NAME ?? "Ketua Organisasi";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const { auth } = await import("@/lib/auth");

  const db = drizzle({ client: sql, schema });

  const existing = await db.query.user.findFirst({
    where: eq(schema.user.email, KETUA_EMAIL),
  });

  if (existing) {
    console.log(`ℹ️  User ${KETUA_EMAIL} sudah ada, melewati pembuatan.`);
  } else {
    // Create the user via Better Auth so password hashing stays consistent.
    const ctx = await auth.$context;
    const hash = await ctx.password.hash(KETUA_PASSWORD);
    const id = crypto.randomUUID();

    await db.insert(schema.user).values({
      id,
      name: KETUA_NAME,
      email: KETUA_EMAIL,
      emailVerified: true,
      role: "ketua",
      status: "active",
    });

    await db.insert(schema.account).values({
      id: crypto.randomUUID(),
      accountId: id,
      providerId: "credential",
      userId: id,
      password: hash,
    });

    console.log(`✅ Ketua dibuat: ${KETUA_EMAIL} / ${KETUA_PASSWORD}`);
  }

  // Optional: sample department
  const deptName = "Departemen Umum";
  const existingDept = await db.query.departments.findFirst({
    where: eq(schema.departments.name, deptName),
  });
  if (!existingDept) {
    await db.insert(schema.departments).values({
      name: deptName,
      description: "Departemen umum organisasi.",
    });
    console.log(`✅ Departemen contoh dibuat: ${deptName}`);
  } else {
    console.log(`ℹ️  Departemen ${deptName} sudah ada.`);
  }

  console.log("\nSelesai. Silakan login dengan akun ketua di /sign-in");
}

main().catch((err) => {
  console.error("❌ Seed gagal:", err);
  process.exit(1);
});
