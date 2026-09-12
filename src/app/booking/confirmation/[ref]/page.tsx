import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

// Deliberately minimal, matching the restraint of the public /track lookup
// (TRD §9) — this page is reachable by anyone who has (or guesses) a
// reference number, not just the customer who just submitted it, so it
// avoids re-displaying PII (name, phone, addresses, legal case details)
// even though the customer themselves already has all of that.
export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("reference_number, status, total_price, created_at")
    .eq("reference_number", ref)
    .returns<Pick<BookingRow, "reference_number" | "status" | "total_price" | "created_at">[]>()
    .maybeSingle();

  if (!booking) notFound();

  return (
    <div className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-4 py-16 sm:px-6">
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
        Booking submitted
      </p>
      <h1 className="text-foreground mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
        Thank you.
      </h1>
      <p className="text-muted-foreground mt-4">
        Your booking reference is below. Our team reviews every booking, typically within 1 hour,
        and will contact you directly to confirm.
      </p>

      <div className="border-border bg-surface mt-8 border p-6">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
          Reference number
        </p>
        <p className="text-foreground mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold">
          {booking.reference_number}
        </p>

        <div className="border-border mt-4 border-t pt-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
            Status
          </p>
          <p className="text-foreground mt-1 font-medium capitalize">
            {booking.status.replace(/_/g, " ")}
          </p>
        </div>

        <div className="border-border mt-4 border-t pt-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
            Price
          </p>
          <p className="text-foreground mt-1 font-medium">
            {booking.total_price === null
              ? "To be confirmed by our team"
              : `₦${booking.total_price.toLocaleString()}`}
          </p>
        </div>
      </div>

      <p className="text-muted-foreground mt-6 text-sm">
        Save this reference number — you can check your booking&apos;s status any time on our{" "}
        <Link href={`/track?ref=${booking.reference_number}`} className="text-brand-text underline">
          Track My Booking
        </Link>{" "}
        page.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/"
          className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-6 py-3 font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
