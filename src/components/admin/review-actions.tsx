"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveBooking, rejectBooking } from "@/app/admin/(dashboard)/orders/[id]/actions";

export function ReviewActions({ bookingId }: { bookingId: string }) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const result = await approveBooking(bookingId);
      if (result.status === "error") setError(result.formError ?? "Something went wrong.");
      else router.refresh();
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      const result = await rejectBooking(bookingId, reason);
      if (result.status === "error") setError(result.formError ?? "Something went wrong.");
      else {
        setShowReject(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-error text-sm">{error}</p>}
      {!showReject ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleApprove}
            disabled={isPending}
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-5 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {isPending ? "Approving…" : "Approve"}
          </button>
          <button
            type="button"
            onClick={() => setShowReject(true)}
            disabled={isPending}
            className="border-error text-error hover:bg-error-bg rounded-[var(--radius-control)] border px-5 py-2 text-sm font-semibold disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="reject-reason" className="text-foreground block text-sm font-medium">
            Rejection reason (required)
          </label>
          <textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="border-border bg-background text-foreground focus-visible:ring-focus-ring w-full rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending || !reason.trim()}
              className="bg-error text-primary-foreground rounded-[var(--radius-control)] px-5 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {isPending ? "Rejecting…" : "Confirm rejection"}
            </button>
            <button
              type="button"
              onClick={() => setShowReject(false)}
              disabled={isPending}
              className="border-border text-foreground hover:bg-surface rounded-[var(--radius-control)] border px-5 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
