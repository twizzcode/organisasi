"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

type UserMenuProps = {
  name: string;
  email: string;
  role: string;
  departmentName: string | null;
};

export function UserMenu({
  name,
  email,
  role,
  departmentName,
}: UserMenuProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await authClient.signOut();
    toast.success("Berhasil keluar");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-auto gap-2 px-2" />
        }
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-tight">{name}</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {departmentName ?? (role === "ketua" ? "Ketua" : "Tanpa departemen")}
          </p>
        </div>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span>{name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {email}
              </span>
              <div className="mt-1 flex gap-1">
                <Badge variant={role === "ketua" ? "default" : "secondary"}>
                  {role === "ketua" ? "Ketua" : "Staff"}
                </Badge>
                {departmentName && (
                  <Badge variant="outline">{departmentName}</Badge>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={loading}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          {loading ? "Keluar..." : "Keluar"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
