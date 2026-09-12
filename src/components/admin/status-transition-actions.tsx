"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  markInTransit,
  markDelivered,
  cancelBooking,
} from "@/app/admin/(dashboard)/bookings/[id]/actions";
import type { BookingStatus } from "@/lib/supabase/types";

const ACTIONS: Partial<
  Record<
    BookingStatus,
    { label: string; fn: (id: string) => Promise<{ status: string; formError?: string }> }[]
  >
> = {
  confirmed: [{ label: "Mark In Transit", fn: markInTransit }],
  in_transit: [{ label: "Mark Delivered", fn: markDelivered }],
};

const CANCELLABLE_FROM: BookingStatus[] = ["pending_review", "confirmed", "in_transit"];

export function StatusTransitionActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const actions = ACTIONS[status] ?? [];
  const canCancel = CANCELLABLE_FROM.includes(status);

  function run(fn: (id: string) => Promise<{ status: string; formError?: string }>, label: string) {
    setError(null);
    setPendingLabel(label);
    startTransition(async () => {
      const result = await fn(bookingId);
      if (result.status === "error") setError(result.formError ?? "Something went wrong.");
      else router.refresh();
    });
  }

  if (actions.length === 0 && !canCancel) return null;

  return (
    <div className="space-y-3">
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => run(a.fn, a.label)}
            disabled={isPending}
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-5 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {isPending && pendingLabel === a.label ? "Saving…" : a.label}
          </button>
        ))}
        {canCancel && (
          <button
            type="button"
            onClick={() => run(cancelBooking, "Cancel booking")}
            disabled={isPending}
            className="border-error text-error hover:bg-error-bg rounded-[var(--radius-control)] border px-5 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {isPending && pendingLabel === "Cancel booking" ? "Cancelling…" : "Cancel booking"}
          </button>
        )}
      </div>
    </div>
  );
}
