"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setLoading(false);
      toast.error(error.message ?? "Gagal masuk. Periksa email & password.");
      return;
    }

    toast.success("Berhasil masuk");
    startTransition(() => {
      router.push("/dashboard");
      router.refresh();
    });
  }

  const busy = loading || isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Masuk</CardTitle>
        <CardDescription>
          Masuk dengan email dan password akun Anda.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@organisasi.com"
              autoComplete="email"
              required
              disabled={busy}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={busy}
            />
          </div>
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Memproses..." : "Masuk"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">
              Daftar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
