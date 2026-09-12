"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { bookingSchema, formDataToBookingInput } from "@/lib/booking-schema";
import { calculatePriceForDistrict } from "@/lib/pricing-district";
import { generateReferenceNumber } from "@/lib/reference-number";
import { getUrgentSurcharge } from "@/lib/get-urgent-surcharge";
import type { BookingRow, DistrictRateRow } from "@/lib/supabase/types";

export interface BookingActionState {
  status: "idle" | "error";
  fieldErrors?: Record<string, string>;
  formError?: string;
  values?: Record<string, unknown>;
}

const POSTGRES_UNIQUE_VIOLATION = "23505";
const MAX_REFERENCE_ATTEMPTS = 5;

export async function submitBooking(
  _prevState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const raw = formDataToBookingInput(formData);
  const parsed = bookingSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors, values: raw };
  }

  const data = parsed.data;
  const supabase = createAdminClient();

  const { data: rate, error: rateError } = await supabase
    .from("district_rates")
    .select("district, standard_fee, return_copy_addon_fee")
    .eq("district", data.pickup_district)
    .returns<Pick<DistrictRateRow, "district" | "standard_fee" | "return_copy_addon_fee">[]>()
    .maybeSingle();

  if (rateError || !rate) {
    return {
      status: "error",
      formError: "We couldn't find a rate for the selected pickup district. Please try again.",
      values: raw,
    };
  }

  let urgentSurcharge: number;
  try {
    urgentSurcharge = await getUrgentSurcharge();
  } catch {
    return {
      status: "error",
      formError: "We couldn't load pricing configuration. Please try again shortly.",
      values: raw,
    };
  }

  const price = calculatePriceForDistrict(
    rate,
    data.delivery_speed,
    data.return_copy_addon,
    urgentSurcharge,
  );

  // Consent must be timestamped server-side (TRD §10.2) — never trust a
  // client-supplied time for this.
  const dataConsentTimestamp = new Date().toISOString();
  const year = new Date().getFullYear();

  let lastError: string | undefined;

  // @supabase/supabase-js's row-inference for .insert() collapses to `never`
  // specifically for the `bookings` table (by far the widest Row type in
  // this schema — 30+ columns) once the Database type has several tables in
  // it, the same known upstream issue documented on the .returns<>() calls
  // elsewhere in this file. There's no .returns<>()-style override for
  // .insert()'s input type, so bookingRow is typed against the real
  // BookingRow interface (catching field-name typos here) and the client is
  // cast narrowly, only for this one call, to get past the broken inference.
  type InsertableBookingsTable = {
    insert: (
      row: Partial<BookingRow>,
    ) => PromiseLike<{ error: { code?: string; message: string } | null }>;
  };

  for (let attempt = 0; attempt < MAX_REFERENCE_ATTEMPTS; attempt++) {
    const referenceNumber = generateReferenceNumber(year);

    const bookingRow: Partial<BookingRow> = {
      reference_number: referenceNumber,
      service_type: data.service_type,
      delivery_speed: data.delivery_speed,

      customer_name: data.customer_name,
      company_name: data.company_name ?? null,
      phone: data.phone,
      whatsapp_number: data.whatsapp_number,
      email: data.email,

      pickup_district: data.pickup_district,
      pickup_address: data.pickup_address,
      pickup_contact_name: data.pickup_contact_name,
      pickup_contact_phone: data.pickup_contact_phone,

      delivery_address: data.delivery_address,
      recipient_name: data.recipient_name,
      recipient_phone: data.recipient_phone,

      package_description: data.package_description,
      weight_kg: data.weight_kg,
      package_count: data.package_count,
      delivery_instructions: data.delivery_instructions ?? null,
      preferred_pickup_date: data.preferred_pickup_date,
      preferred_delivery_date: data.preferred_delivery_date ?? null,
      additional_notes: data.additional_notes ?? null,

      legal_court_name: data.legal_court_name ?? null,
      legal_suit_case_number: data.legal_suit_case_number ?? null,
      legal_process_document: data.legal_process_document ?? null,
      legal_client_address: data.legal_client_address ?? null,
      legal_company_name: data.legal_company_name ?? null,
      legal_landmark: data.legal_landmark ?? null,
      return_copy_addon: data.return_copy_addon,

      distance_km: null,
      base_price: price.basePrice,
      urgent_surcharge: price.surcharge,
      addon_total: price.addon,
      total_price: price.total,

      payment_status: "unpaid",

      status: "pending_review",

      client_confirmation_accepted: data.client_confirmation_accepted,
      data_consent_accepted: data.data_consent_accepted,
      data_consent_timestamp: dataConsentTimestamp,
    };

    const { error: insertError } = await (
      supabase.from("bookings") as unknown as InsertableBookingsTable
    ).insert(bookingRow);

    if (!insertError) {
      redirect(`/booking/confirmation/${referenceNumber}`);
    }

    if (insertError.code === POSTGRES_UNIQUE_VIOLATION) {
      lastError = insertError.message;
      continue; // reference number collision — try a new one
    }

    return {
      status: "error",
      formError: `Something went wrong submitting your booking: ${insertError.message}`,
      values: raw,
    };
  }

  return {
    status: "error",
    formError: `Couldn't generate a unique reference number after several attempts (${lastError}). Please try again.`,
    values: raw,
  };
}
