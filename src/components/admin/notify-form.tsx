"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markNotified } from "@/app/admin/(dashboard)/bookings/[id]/actions";

const CHANNELS = ["Phone call", "WhatsApp", "Email", "SMS"];

export function NotifyForm({
  bookingId,
  notifiedAt,
  notifiedChannel,
  notifiedNote,
}: {
  bookingId: string;
  notifiedAt: string | null;
  notifiedChannel: string | null;
  notifiedNote: string | null;
}) {
  const [channel, setChannel] = useState(notifiedChannel ?? CHANNELS[0]);
  const [note, setNote] = useState(notifiedNote ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await markNotified(bookingId, channel, note);
      if (result.status === "error") setError(result.formError ?? "Something went wrong.");
      else router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {notifiedAt && (
        <p className="text-muted-foreground text-sm">
          Last notified{" "}
          {new Date(notifiedAt).toLocaleString("en-NG", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          {notifiedChannel && ` via ${notifiedChannel}`}.
        </p>
      )}
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="border-border bg-background text-foreground focus-visible:ring-focus-ring rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          {CHANNELS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border-border bg-background text-foreground placeholder:text-placeholder-foreground focus-visible:ring-focus-ring rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="border-border text-foreground hover:bg-surface rounded-[var(--radius-control)] border px-5 py-2 text-sm font-semibold disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Mark as Notified"}
      </button>
    </div>
  );
}
