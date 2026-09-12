import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/paystack";
import { confirmPayment } from "@/lib/confirm-payment";
import type { BookingRow } from "@/lib/supabase/types";
import { initiatePayment } from "./actions";

export const dynamic = "force-dynamic";

type ConfirmationBooking = Pick<
  BookingRow,
  "reference_number" | "status" | "total_price" | "payment_status" | "created_at"
>;

// Deliberately minimal, matching the restraint of the public /track lookup
// (TRD §9) — this page is reachable by anyone who has (or guesses) a
// reference number, not just the customer who just submitted it, so it
// avoids re-displaying PII (name, phone, addresses, legal case details)
// even though the customer themselves already has all of that. This is
// also why payment here redirects to Paystack's hosted checkout instead of
// an Inline popup — see the architecture note in README and the comment
// on initiatePayment(): Inline needs the customer's email in the browser,
// which this page deliberately never shows.
export default async function BookingConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ reference?: string; paymentError?: string }>;
}) {
  const { ref } = await params;
  const { reference: returningPaystackRef, paymentError } = await searchParams;
  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("reference_number, status, total_price, payment_status, created_at")
    .eq("reference_number", ref)
    .returns<ConfirmationBooking[]>()
    .maybeSingle();

  if (!booking) notFound();

  let paymentStatus = booking.payment_status;
  let verifyError: string | null = null;

  // Customer just landed back from Paystack's hosted checkout — verify
  // server-side before trusting anything (TRD §6). The webhook
  // (src/app/api/webhooks/paystack/route.ts) covers the case where they
  // close the tab before this ever runs; confirmPayment() is the same
  // idempotent check either way runs.
  if (returningPaystackRef && paymentStatus !== "paid") {
    try {
      const result = await verifyTransaction(returningPaystackRef);
      const outcome = await confirmPayment(returningPaystackRef, result.status, result.amountKobo);
      if (outcome === "paid") {
        paymentStatus = "paid";
      } else if (outcome === "not_successful") {
        verifyError = "Payment wasn't completed.";
      } else if (outcome === "amount_mismatch") {
        verifyError = "Payment amount didn't match — contact us before assuming this is paid.";
      }
    } catch {
      verifyError = "We couldn't confirm your payment automatically — contact us to check.";
    }
  }

  const canPay =
    paymentStatus !== "paid" &&
    booking.total_price !== null &&
    booking.status !== "rejected" &&
    booking.status !== "cancelled";

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

      {paymentStatus === "paid" && (
        <p className="border-success bg-success-bg text-success mt-4 border px-4 py-3 text-sm">
          Payment received. Thank you.
        </p>
      )}
      {(paymentError || verifyError) && (
        <p className="border-error bg-error-bg text-error mt-4 border px-4 py-3 text-sm">
          {paymentError ? decodeURIComponent(paymentError) : verifyError}
        </p>
      )}

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

        {booking.total_price !== null && (
          <div className="border-border mt-4 border-t pt-4">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              Payment
            </p>
            <p className="text-foreground mt-1 font-medium capitalize">
              {paymentStatus === "paid" ? "Paid" : "Not yet paid (optional)"}
            </p>
          </div>
        )}
      </div>

      {canPay && (
        <form action={initiatePayment.bind(null, booking.reference_number)} className="mt-6">
          <p className="text-muted-foreground text-sm">
            Payment is optional — you can also pay by bank transfer or cash on delivery by
            arrangement with our team.
          </p>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-primary-foreground mt-3 rounded-[var(--radius-control)] px-6 py-3 font-semibold"
          >
            Pay ₦{booking.total_price!.toLocaleString()} now
          </button>
        </form>
      )}

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
