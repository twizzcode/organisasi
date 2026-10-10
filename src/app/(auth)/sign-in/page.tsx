import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/guards";

import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Masuk — Dashboard Organisasi",
};

export default async function SignInPage() {
  const session = await getSession();
  if (session) {
    redirect(session.user.status === "active" ? "/dashboard" : "/pending");
  }

  return <SignInForm />;
}
