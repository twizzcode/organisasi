import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/guards";

import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Daftar — Dashboard Organisasi",
};

export default async function SignUpPage() {
  const session = await getSession();
  if (session) {
    redirect(session.user.status === "active" ? "/dashboard" : "/pending");
  }

  return <SignUpForm />;
}
