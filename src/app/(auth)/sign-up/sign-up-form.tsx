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

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message ?? "Gagal mendaftar. Coba lagi.");
      return;
    }

    toast.success("Pendaftaran berhasil. Menunggu verifikasi ketua.");
    startTransition(() => {
      router.push("/pending");
      router.refresh();
    });
  }

  const busy = loading || isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Akun</CardTitle>
        <CardDescription>
          Buat akun baru. Akun perlu disetujui ketua sebelum bisa digunakan.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nama Anda"
              autoComplete="name"
              required
              disabled={busy}
            />
          </div>
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
              autoComplete="new-password"
              minLength={8}
              required
              disabled={busy}
            />
            <p className="text-xs text-muted-foreground">Minimal 8 karakter.</p>
          </div>
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Memproses..." : "Daftar"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
              Masuk
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
