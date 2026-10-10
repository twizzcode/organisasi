"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { approveStaff } from "@/server/actions/staff";

export function ApproveStaffButton({
  userId,
  departmentId,
}: {
  userId: string;
  departmentId: string | null;
}) {
  const [loading, setLoading] = useState(false);

  async function onApprove() {
    setLoading(true);
    const result = await approveStaff(userId, departmentId);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Button
      size="sm"
      variant="default"
      onClick={onApprove}
      disabled={loading}
    >
      <Check className="size-4" />
      {loading ? "..." : "Aktifkan"}
    </Button>
  );
}
