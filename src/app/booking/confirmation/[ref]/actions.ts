"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { initializeTransaction } from "@/lib/paystack";
import type { BookingRow } from "@/lib/supabase/types";

// PRD §11/TRD §6: payment is optional and never required to submit a
// booking. This kicks off Paystack's redirect-based Standard Checkout
// rather than the Inline popup TRD §6 describes — see README's Paystack
// architecture note for why: Inline needs the customer's email in the
// browser, and this confirmation page is deliberately reachable by anyone
// with the reference number with no PII shown (see the comment on the page
// component), so putting an email there would undo that. A redirect still
// supports both card and bank transfer with identical server-side
// verification guarantees.
export async function initiatePayment(referenceNumber: string) {
  const admin = createAdminClient();

  const { data: booking } = await admin
    .from("bookings")
    .select("id, email, total_price, payment_status, status")
    .eq("reference_number", referenceNumber)
    .returns<Pick<BookingRow, "id" | "email" | "total_price" | "payment_status" | "status">[]>()
    .maybeSingle();

  if (!booking) {
    redirect(`/booking/confirmation/${referenceNumber}?paymentError=Booking+not+found`);
  }
  if (booking.payment_status === "paid") {
    redirect(`/booking/confirmation/${referenceNumber}`);
  }
  if (booking.total_price === null) {
    redirect(
      `/booking/confirmation/${referenceNumber}?paymentError=${encodeURIComponent(
        "This booking's price is still being confirmed by our team — payment isn't available yet.",
      )}`,
    );
  }
  if (booking.status === "rejected" || booking.status === "cancelled") {
    redirect(
      `/booking/confirmation/${referenceNumber}?paymentError=${encodeURIComponent(
        "This booking is no longer active.",
      )}`,
    );
  }

  const paystackReference = `${referenceNumber}-${Date.now()}`;
  const host = (await headers()).get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const callbackUrl = `${protocol}://${host}/booking/confirmation/${referenceNumber}`;

  type UpdatableBookingsTable = {
    update: (row: Partial<BookingRow>) => {
      eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }>;
    };
  };
  await (admin.from("bookings") as unknown as UpdatableBookingsTable)
    .update({ paystack_reference: paystackReference })
    .eq("id", booking.id);

  // redirect() works by throwing internally, so the success redirect below
  // must sit outside this try/catch — otherwise this function's own catch
  // would swallow it as if initializeTransaction had thrown.
  let authorizationUrl: string;
  try {
    const result = await initializeTransaction({
      email: booking.email,
      amountKobo: Math.round(booking.total_price * 100),
      reference: paystackReference,
      callbackUrl,
      metadata: { booking_reference: referenceNumber },
    });
    authorizationUrl = result.authorizationUrl;
  } catch (e) {
    redirect(
      `/booking/confirmation/${referenceNumber}?paymentError=${encodeURIComponent((e as Error).message)}`,
    );
  }

  redirect(authorizationUrl);
}
