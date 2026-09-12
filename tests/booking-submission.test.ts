import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// submitBooking calls next/navigation's redirect() on success, which relies
// on Next's request-scoped internals that don't exist when calling a Server
// Action directly from a test. Mocking it to throw a plain, inspectable
// error is the standard way to test a Server Action's "it would redirect
// here" behavior without needing a running Next.js server.
const redirectMock = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

const { submitBooking } = await import("@/app/booking/actions");
const { createAdminClient } = await import("@/lib/supabase/admin");

const supabase = createAdminClient();

function baseFields(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    service_type: "same_day_delivery",
    delivery_speed: "standard",
    customer_name: "Integration Test Customer",
    phone: "08010000001",
    whatsapp_number: "08010000001",
    email: "integration-test@example.com",
    pickup_district: "Central Business District (CBD)",
    pickup_address: "1 Test Street, CBD",
    pickup_contact_name: "Pickup Tester",
    pickup_contact_phone: "08010000002",
    delivery_address: "2 Test Close, Garki",
    recipient_name: "Recipient Tester",
    recipient_phone: "08010000003",
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

/** Runs a submitBooking implementation and, on success, extracts the
 * reference number from the mocked redirect's thrown
 * "REDIRECT:/booking/confirmation/<ref>" error rather than a normal return
 * value (submitBooking never returns on the success path — it redirects). */
async function submitAndGetReference(
  fields: Record<string, string>,
  impl: typeof submitBooking = submitBooking,
): Promise<string> {
  try {
    const result = await impl({ status: "idle" }, toFormData(fields));
    throw new Error(`Expected a redirect, got a form result instead: ${JSON.stringify(result)}`);
  } catch (e) {
    const message = (e as Error).message;
    const match = message.match(/REDIRECT:\/booking\/confirmation\/(PCX-\d{4}-\d{6})/);
    if (!match) throw e;
    return match[1];
  }
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

describe("submitBooking — standard field submission", () => {
  it("submits a standard (non-legal) booking and stores the computed price", async () => {
    const ref = await submitAndGetReference(baseFields());
    createdReferences.push(ref);

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("reference_number", ref)
      .returns<Record<string, unknown>[]>()
      .maybeSingle();

    expect(data).toMatchObject({
      reference_number: ref,
      service_type: "same_day_delivery",
      pickup_district: "Central Business District (CBD)",
      base_price: 5000,
      urgent_surcharge: 0,
      addon_total: 0,
      total_price: 5000,
      status: "pending_review",
      payment_status: "unpaid",
      client_confirmation_accepted: true,
      data_consent_accepted: true,
    });
    expect(data?.data_consent_timestamp).toBeTruthy();
  });
});

describe("submitBooking — legal / process-serving fields", () => {
  it("submits a legal booking with return-copy add-on and stores legal fields + district-specific add-on fee", async () => {
    const ref = await submitAndGetReference(
      baseFields({
        service_type: "process_serving",
        delivery_speed: "urgent_express",
        return_copy_addon: "on",
        legal_court_name: "High Court of the FCT",
        legal_suit_case_number: "FCT/HC/CV/9999/2026",
        legal_process_document: "Originating summons",
      }),
    );
    createdReferences.push(ref);

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("reference_number", ref)
      .returns<Record<string, unknown>[]>()
      .maybeSingle();

    expect(data).toMatchObject({
      service_type: "process_serving",
      legal_court_name: "High Court of the FCT",
      legal_suit_case_number: "FCT/HC/CV/9999/2026",
      legal_process_document: "Originating summons",
      return_copy_addon: true,
      base_price: 5000, // CBD standard fee
      urgent_surcharge: 5000,
      addon_total: 3500, // CBD return-copy add-on fee
      total_price: 13500,
    });
  });

  it("rejects a process-serving booking missing required legal fields", async () => {
    const result = await submitBooking(
      { status: "idle" },
      toFormData(baseFields({ service_type: "process_serving" })),
    );
    expect(result.status).toBe("error");
    expect(result.fieldErrors?.legal_court_name).toBeTruthy();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});

describe("submitBooking — price-on-request districts", () => {
  it("still submits successfully for a district with no confirmed rate (Abaji)", async () => {
    const ref = await submitAndGetReference(baseFields({ pickup_district: "Abaji" }));
    createdReferences.push(ref);

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("reference_number", ref)
      .returns<Record<string, unknown>[]>()
      .maybeSingle();

    expect(data).toMatchObject({
      pickup_district: "Abaji",
      base_price: null,
      total_price: null,
      status: "pending_review",
    });
  });
});

describe("submitBooking — reference number uniqueness", () => {
  it("retries with a new reference number on a collision instead of failing", async () => {
    // Create a real booking first (via the real, Zod-validated path) so a
    // known reference number is genuinely occupied in the database.
    const existingRef = await submitAndGetReference(baseFields());
    createdReferences.push(existingRef);

    // Force the generator to collide with it on the first attempt, then
    // succeed on the second — this exercises actions.ts's actual retry-on-
    // 23505 logic against a real unique-constraint violation. The "fresh"
    // reference is derived at run time, not hardcoded — a fixed literal
    // left a stray row behind after an earlier failed run of this exact
    // test, which then made the *next* run collide against it too.
    const freshRef = `PCX-2026-${String(Math.floor(Date.now() % 900000) + 100000)}`;
    let calls = 0;
    vi.doMock("@/lib/reference-number", () => ({
      generateReferenceNumber: () => {
        calls += 1;
        return calls === 1 ? existingRef : freshRef;
      },
    }));
    vi.resetModules();
    const { submitBooking: submitBookingWithForcedCollision } =
      await import("@/app/booking/actions");

    const newRef = await submitAndGetReference(
      baseFields({ email: "integration-test-collision@example.com" }),
      submitBookingWithForcedCollision,
    );

    expect(newRef).toBe(freshRef);
    expect(newRef).not.toBe(existingRef);
    expect(calls).toBeGreaterThanOrEqual(2);
    createdReferences.push(newRef);

    vi.doUnmock("@/lib/reference-number");
    vi.resetModules();
  });
});
