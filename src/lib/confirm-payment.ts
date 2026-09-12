import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingRow } from "@/lib/supabase/types";

export type ConfirmPaymentOutcome =
  "paid" | "already_paid" | "amount_mismatch" | "not_found" | "not_successful";

/**
 * Marks a booking paid after Paystack confirms a transaction succeeded.
 * Shared by the confirmation-page verify call and the webhook handler
 * (src/app/api/webhooks/paystack/route.ts) — both eventually get a
 * verified transaction and need the same idempotent, amount-checked
 * update, so the logic lives in one place rather than being duplicated.
 */
export async function confirmPayment(
  paystackReference: string,
  status: string,
  amountKobo: number,
): Promise<ConfirmPaymentOutcome> {
  if (status !== "success") return "not_successful";

  const admin = createAdminClient();
  const { data: booking } = await admin
    .from("bookings")
    .select("id, total_price, payment_status")
    .eq("paystack_reference", paystackReference)
    .returns<Pick<BookingRow, "id" | "total_price" | "payment_status">[]>()
    .maybeSingle();

  if (!booking) return "not_found";
  if (booking.payment_status === "paid") return "already_paid";
  if (booking.total_price === null || Math.round(booking.total_price * 100) !== amountKobo) {
    return "amount_mismatch";
  }

  type UpdatableBookingsTable = {
    update: (row: Partial<BookingRow>) => {
      eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }>;
    };
  };
  const { error } = await (admin.from("bookings") as unknown as UpdatableBookingsTable)
    .update({ payment_status: "paid" })
    .eq("id", booking.id);

  if (error) throw new Error(`Failed to mark booking paid: ${error.message}`);
  return "paid";
}
