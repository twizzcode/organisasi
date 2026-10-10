"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSignOut() {
    await authClient.signOut();
    startTransition(() => {
      router.push("/sign-in");
      router.refresh();
    });
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Keluar..." : "Keluar"}
    </Button>
  );
}
