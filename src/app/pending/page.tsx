import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";

import { SignOutButton } from "@/components/sign-out-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/guards";

export const metadata: Metadata = {
  title: "Menunggu Verifikasi — Dashboard Organisasi",
};

export default async function PendingPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  if (session.user.status === "active") redirect("/dashboard");

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Clock className="size-5" />
          </div>
          <CardTitle>Menunggu Verifikasi</CardTitle>
          <CardDescription>
            Akun Anda sudah terdaftar, tetapi belum diaktifkan oleh ketua.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Alert>
            <AlertTitle>Halo, {session.user.name}</AlertTitle>
            <AlertDescription>
              Hubungi ketua organisasi untuk menyetujui akun Anda dan
              menetapkan Anda ke sebuah departemen. Setelah disetujui, silakan
              masuk kembali.
            </AlertDescription>
          </Alert>
          <SignOutButton className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
