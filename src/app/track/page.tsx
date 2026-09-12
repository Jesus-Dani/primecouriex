import type { Metadata } from "next";
import { StatusBadge } from "@/components/ui/status-badge";
import { trackBooking } from "@/lib/track-booking";

export const metadata: Metadata = {
  title: "Track My Booking | Prime Couriex Express",
  description: "Check the current status of your booking by reference number.",
};

// Rate-limiting state lives in the database and depends on the caller's IP
// (TRD §9) — this page can never be cached/prerendered.
export const dynamic = "force-dynamic";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const result = ref ? await trackBooking(ref) : null;

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-3xl font-bold">
        Track My Booking
      </h1>
      <p className="text-muted-foreground mt-3">
        Enter your booking reference number to check its current status.
      </p>

      <form method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="track-ref" className="sr-only">
          Booking reference number
        </label>
        <input
          id="track-ref"
          name="ref"
          type="text"
          defaultValue={ref ?? ""}
          placeholder="e.g. PCX-2026-000123"
          className="border-border bg-background text-foreground placeholder:text-placeholder-foreground focus-visible:ring-focus-ring w-full rounded-[var(--radius-control)] border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover text-primary-foreground shrink-0 rounded-[var(--radius-control)] px-6 py-3 text-sm font-semibold"
        >
          Track
        </button>
      </form>

      {result && (
        <div className="border-border bg-surface mt-6 border p-6">
          {result.rateLimited ? (
            <p className="text-error text-sm">
              Too many lookups from this connection. Please try again in a little while.
            </p>
          ) : !result.found ? (
            <p className="text-muted-foreground text-sm">
              We couldn&apos;t find a booking with that reference number. Double-check it and try
              again, or contact us if you need help.
            </p>
          ) : (
            <>
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                {result.referenceNumber}
              </p>
              <div className="mt-2">
                <StatusBadge status={result.status!} />
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-muted-foreground mt-6 text-sm">
        Need help instead?{" "}
        <a href="/contact" className="text-brand-text underline">
          Contact our team
        </a>
        .
      </p>
    </div>
  );
}
