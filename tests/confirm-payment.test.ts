import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Same redirect-mocking approach as booking-submission.test.ts — submitBooking
// is reused here purely as a fixture to create a real, fully-valid booking to
// attach a paystack_reference to, rather than hand-building a raw insert that
// would need to track every NOT NULL column by hand.
const redirectMock = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

const { submitBooking } = await import("@/app/booking/actions");
const { createAdminClient } = await import("@/lib/supabase/admin");
const { confirmPayment } = await import("@/lib/confirm-payment");

const supabase = createAdminClient();

function baseFields(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    service_type: "same_day_delivery",
    delivery_speed: "standard",
    customer_name: "Payment Test Customer",
    phone: "08020000001",
    whatsapp_number: "08020000001",
    email: "payment-confirm-test@example.com",
    pickup_district: "Central Business District (CBD)", // standard_fee: 5000
    pickup_address: "1 Test Street, CBD",
    pickup_contact_name: "Pickup Tester",
    pickup_contact_phone: "08020000002",
    delivery_address: "2 Test Close, Garki",
    recipient_name: "Recipient Tester",
    recipient_phone: "08020000003",
    package_description: "A test envelope",
    weight_kg: "0.5",
    package_count: "1",
    preferred_pickup_date: "2026-11-01",
    client_confirmation_accepted: "on",
    data_consent_accepted: "on",
    ...overrides,
  };
}

function toFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

async function createBookingWithPaystackReference(paystackReference: string): Promise<string> {
  let referenceNumber = "";
  try {
    await submitBooking(
      { status: "idle" },
      toFormData(baseFields({ email: `${paystackReference.toLowerCase()}@example.com` })),
    );
    throw new Error("Expected a redirect");
  } catch (e) {
    const match = (e as Error).message.match(/REDIRECT:\/booking\/confirmation\/(PCX-\d{4}-\d{6})/);
    if (!match) throw e;
    referenceNumber = match[1];
  }

  type UpdatableBookingsTable = {
    update: (row: { paystack_reference: string }) => {
      eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }>;
    };
  };
  const { error } = await (supabase.from("bookings") as unknown as UpdatableBookingsTable)
    .update({ paystack_reference: paystackReference })
    .eq("reference_number", referenceNumber);
  if (error) throw new Error(`Failed to attach paystack_reference: ${error.message}`);

  return referenceNumber;
}

async function paymentStatusFor(referenceNumber: string): Promise<string | undefined> {
  const { data } = await supabase
    .from("bookings")
    .select("payment_status")
    .eq("reference_number", referenceNumber)
    .returns<{ payment_status: string }[]>()
    .maybeSingle();
  return data?.payment_status;
}

const createdReferences: string[] = [];

beforeEach(() => {
  redirectMock.mockClear();
});

afterEach(async () => {
  if (createdReferences.length === 0) return;
  await supabase.from("bookings").delete().in("reference_number", createdReferences);
  createdReferences.length = 0;
});

describe("confirmPayment", () => {
  it("marks a booking paid on a successful, amount-matching transaction", async () => {
    const paystackRef = `TEST-PAID-${Date.now()}`;
    const bookingRef = await createBookingWithPaystackReference(paystackRef);
    createdReferences.push(bookingRef);

    const outcome = await confirmPayment(paystackRef, "success", 5000 * 100);

    expect(outcome).toBe("paid");
    expect(await paymentStatusFor(bookingRef)).toBe("paid");
  });

  it("is idempotent — confirming an already-paid booking again is a no-op, not an error", async () => {
    const paystackRef = `TEST-IDEMPOTENT-${Date.now()}`;
    const bookingRef = await createBookingWithPaystackReference(paystackRef);
    createdReferences.push(bookingRef);

    await confirmPayment(paystackRef, "success", 5000 * 100);
    const secondOutcome = await confirmPayment(paystackRef, "success", 5000 * 100);

    expect(secondOutcome).toBe("already_paid");
    expect(await paymentStatusFor(bookingRef)).toBe("paid");
  });

  it("refuses to mark a booking paid when the verified amount doesn't match the stored price", async () => {
    const paystackRef = `TEST-MISMATCH-${Date.now()}`;
    const bookingRef = await createBookingWithPaystackReference(paystackRef);
    createdReferences.push(bookingRef);

    // Booking's total_price is ₦5,000 (500000 kobo) — pass a smaller amount,
    // as if a tampered/incorrect reference tried to pay less than owed.
    const outcome = await confirmPayment(paystackRef, "success", 100);

    expect(outcome).toBe("amount_mismatch");
    expect(await paymentStatusFor(bookingRef)).toBe("unpaid");
  });

  it("does not mark a booking paid for a non-successful transaction status", async () => {
    const paystackRef = `TEST-ABANDONED-${Date.now()}`;
    const bookingRef = await createBookingWithPaystackReference(paystackRef);
    createdReferences.push(bookingRef);

    const outcome = await confirmPayment(paystackRef, "abandoned", 5000 * 100);

    expect(outcome).toBe("not_successful");
    expect(await paymentStatusFor(bookingRef)).toBe("unpaid");
  });

  it("returns not_found for a paystack reference with no matching booking", async () => {
    const outcome = await confirmPayment(`TEST-NONEXISTENT-${Date.now()}`, "success", 500000);
    expect(outcome).toBe("not_found");
  });
});
