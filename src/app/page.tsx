import { redirect } from "next/navigation";

import { getSession } from "@/lib/guards";

export default async function HomePage() {
  const session = await getSession();

  if (!session) redirect("/sign-in");
  if (session.user.status !== "active") redirect("/pending");

  redirect("/dashboard");
}

