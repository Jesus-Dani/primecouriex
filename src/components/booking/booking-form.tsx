"use client";

import { useActionState, useMemo, useState } from "react";
import { submitBooking, type BookingActionState } from "@/app/booking/actions";
import { calculatePriceForDistrict } from "@/lib/pricing-district";
import type { PublicDistrictRate } from "@/lib/get-district-rates";
import type { DeliverySpeed, ServiceType } from "@/lib/supabase/types";

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "process_serving", label: "Process Serving & Legal Documents" },
  { value: "registry_liaison", label: "Registry Liaison & Document Retrieval" },
  { value: "corporate_courier", label: "Corporate & Institutional Courier" },
  { value: "same_day_delivery", label: "Same-day Document Delivery" },
  { value: "filing_compliance", label: "Filing & Compliance" },
];

const SPEED_OPTIONS: { value: DeliverySpeed; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "same_day", label: "Same-day" },
  { value: "urgent_express", label: "Urgent / Express (+₦5,000)" },
];

const inputClass =
  "border-border bg-background text-foreground placeholder:text-placeholder-foreground focus-visible:ring-focus-ring mt-1.5 w-full rounded-[var(--radius-control)] border px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:outline-none";

function Field({
  name,
  label,
  error,
  required,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-foreground block text-sm font-medium">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-error mt-1 text-xs">{error}</p>}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
      {children}
    </h2>
  );
}

const initialState: BookingActionState = { status: "idle" };

export function BookingForm({
  districts,
  urgentSurcharge,
  defaultServiceType,
}: {
  districts: PublicDistrictRate[];
  urgentSurcharge: number;
  defaultServiceType?: ServiceType;
}) {
  const [state, formAction, isPending] = useActionState(submitBooking, initialState);

  const values = state.values ?? {};
  const v = (name: string, fallback = "") =>
    typeof values[name] === "string" ? (values[name] as string) : fallback;

  const [serviceType, setServiceType] = useState<ServiceType>(
    (v("service_type", defaultServiceType ?? "same_day_delivery") as ServiceType) ||
      "same_day_delivery",
  );
  const [speed, setSpeed] = useState<DeliverySpeed>(
    (v("delivery_speed", "standard") as DeliverySpeed) || "standard",
  );
  const [pickupDistrict, setPickupDistrict] = useState(
    v("pickup_district", districts[0]?.district ?? ""),
  );
  const [returnCopy, setReturnCopy] = useState(values.return_copy_addon === true);

  const isLegal = serviceType === "process_serving";

  const rate = useMemo(
    () => districts.find((d) => d.district === pickupDistrict),
    [districts, pickupDistrict],
  );
  const price = useMemo(() => {
    if (!rate) return null;
    return calculatePriceForDistrict(rate, speed, isLegal && returnCopy, urgentSurcharge);
  }, [rate, speed, isLegal, returnCopy, urgentSurcharge]);

  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
      <div className="space-y-12">
        {state.formError && (
          <p className="border-error bg-error-bg text-error border px-4 py-3 text-sm">
            {state.formError}
          </p>
        )}

        <section className="space-y-5">
          <SectionHeading>Service</SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="service_type" label="Service type" required error={err.service_type}>
              <select
                id="service_type"
                name="service_type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className={inputClass}
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field name="delivery_speed" label="Delivery speed" required error={err.delivery_speed}>
              <select
                id="delivery_speed"
                name="delivery_speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value as DeliverySpeed)}
                className={inputClass}
              >
                {SPEED_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading>Contact</SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="customer_name" label="Full name" required error={err.customer_name}>
              <input
                id="customer_name"
                name="customer_name"
                defaultValue={v("customer_name")}
                className={inputClass}
              />
            </Field>
            <Field name="company_name" label="Company / organisation" error={err.company_name}>
              <input
                id="company_name"
                name="company_name"
                defaultValue={v("company_name")}
                className={inputClass}
              />
            </Field>
            <Field name="phone" label="Phone number" required error={err.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={v("phone")}
                className={inputClass}
              />
            </Field>
            <Field
              name="whatsapp_number"
              label="WhatsApp number"
              required
              error={err.whatsapp_number}
            >
              <input
                id="whatsapp_number"
                name="whatsapp_number"
                type="tel"
                defaultValue={v("whatsapp_number")}
                className={inputClass}
              />
            </Field>
            <Field name="email" label="Email address" required error={err.email}>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={v("email")}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading>Pickup</SectionHeading>
          <p className="text-muted-foreground -mt-3 text-sm">
            Price is based on the pickup district you select.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              name="pickup_district"
              label="Pickup district"
              required
              error={err.pickup_district}
            >
              <select
                id="pickup_district"
                name="pickup_district"
                value={pickupDistrict}
                onChange={(e) => setPickupDistrict(e.target.value)}
                className={inputClass}
              >
                {districts.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district}
                  </option>
                ))}
              </select>
            </Field>
            <Field name="pickup_address" label="Pickup address" required error={err.pickup_address}>
              <input
                id="pickup_address"
                name="pickup_address"
                placeholder="Street, building, landmark"
                defaultValue={v("pickup_address")}
                className={inputClass}
              />
            </Field>
            <Field
              name="pickup_contact_name"
              label="Pickup contact name"
              required
              error={err.pickup_contact_name}
            >
              <input
                id="pickup_contact_name"
                name="pickup_contact_name"
                defaultValue={v("pickup_contact_name")}
                className={inputClass}
              />
            </Field>
            <Field
              name="pickup_contact_phone"
              label="Pickup contact phone"
              required
              error={err.pickup_contact_phone}
            >
              <input
                id="pickup_contact_phone"
                name="pickup_contact_phone"
                type="tel"
                defaultValue={v("pickup_contact_phone")}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading>Delivery</SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              name="delivery_address"
              label="Delivery address"
              required
              error={err.delivery_address}
            >
              <input
                id="delivery_address"
                name="delivery_address"
                placeholder="Street, building, landmark"
                defaultValue={v("delivery_address")}
                className={inputClass}
              />
            </Field>
            <Field name="recipient_name" label="Recipient name" required error={err.recipient_name}>
              <input
                id="recipient_name"
                name="recipient_name"
                defaultValue={v("recipient_name")}
                className={inputClass}
              />
            </Field>
            <Field
              name="recipient_phone"
              label="Recipient phone"
              required
              error={err.recipient_phone}
            >
              <input
                id="recipient_phone"
                name="recipient_phone"
                type="tel"
                defaultValue={v("recipient_phone")}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading>Package details</SectionHeading>
          <div>
            <Field
              name="package_description"
              label="Document / package description"
              required
              error={err.package_description}
            >
              <textarea
                id="package_description"
                name="package_description"
                rows={3}
                placeholder="Describe what needs to be delivered — no file uploads, just a description"
                defaultValue={v("package_description")}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="weight_kg" label="Weight (kg)" required error={err.weight_kg}>
              <input
                id="weight_kg"
                name="weight_kg"
                type="number"
                step="0.1"
                min="0"
                defaultValue={v("weight_kg")}
                className={inputClass}
              />
            </Field>
            <Field name="package_count" label="Number of items" required error={err.package_count}>
              <input
                id="package_count"
                name="package_count"
                type="number"
                min="1"
                step="1"
                defaultValue={v("package_count", "1")}
                className={inputClass}
              />
            </Field>
            <Field
              name="preferred_pickup_date"
              label="Preferred pickup date"
              required
              error={err.preferred_pickup_date}
            >
              <input
                id="preferred_pickup_date"
                name="preferred_pickup_date"
                type="date"
                defaultValue={v("preferred_pickup_date")}
                className={inputClass}
              />
            </Field>
            <Field
              name="preferred_delivery_date"
              label="Preferred delivery date"
              error={err.preferred_delivery_date}
            >
              <input
                id="preferred_delivery_date"
                name="preferred_delivery_date"
                type="date"
                defaultValue={v("preferred_delivery_date")}
                className={inputClass}
              />
            </Field>
          </div>
          <Field
            name="delivery_instructions"
            label="Delivery instructions"
            error={err.delivery_instructions}
          >
            <textarea
              id="delivery_instructions"
              name="delivery_instructions"
              rows={2}
              defaultValue={v("delivery_instructions")}
              className={inputClass}
            />
          </Field>
          <Field
            name="additional_notes"
            label="Additional information"
            error={err.additional_notes}
          >
            <textarea
              id="additional_notes"
              name="additional_notes"
              rows={2}
              defaultValue={v("additional_notes")}
              className={inputClass}
            />
          </Field>

          {isLegal && (
            <label className="flex items-start gap-2.5 pt-2 text-sm">
              <input
                type="checkbox"
                name="return_copy_addon"
                checked={returnCopy}
                onChange={(e) => setReturnCopy(e.target.checked)}
                className="border-border mt-0.5 rounded-[var(--radius-control)]"
              />
              <span>
                <span className="text-foreground font-medium">
                  Return copy add-on (+₦{rate?.return_copy_addon_fee?.toLocaleString() ?? "—"})
                </span>
                <span className="text-muted-foreground block text-xs">
                  A signed copy of the served document is brought back to you.
                </span>
              </span>
            </label>
          )}
        </section>

        {isLegal && (
          <section className="space-y-5">
            <SectionHeading>Legal details</SectionHeading>
            <p className="text-muted-foreground -mt-3 text-sm">
              Required for process serving & legal document bookings.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                name="legal_court_name"
                label="Court name"
                required
                error={err.legal_court_name}
              >
                <input
                  id="legal_court_name"
                  name="legal_court_name"
                  defaultValue={v("legal_court_name")}
                  className={inputClass}
                />
              </Field>
              <Field
                name="legal_suit_case_number"
                label="Suit / case number"
                required
                error={err.legal_suit_case_number}
              >
                <input
                  id="legal_suit_case_number"
                  name="legal_suit_case_number"
                  defaultValue={v("legal_suit_case_number")}
                  className={inputClass}
                />
              </Field>
              <Field
                name="legal_company_name"
                label="Company name (if applicable)"
                error={err.legal_company_name}
              >
                <input
                  id="legal_company_name"
                  name="legal_company_name"
                  defaultValue={v("legal_company_name")}
                  className={inputClass}
                />
              </Field>
              <Field
                name="legal_landmark"
                label="Landmark (if applicable)"
                error={err.legal_landmark}
              >
                <input
                  id="legal_landmark"
                  name="legal_landmark"
                  defaultValue={v("legal_landmark")}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field
              name="legal_client_address"
              label="Client address"
              error={err.legal_client_address}
            >
              <input
                id="legal_client_address"
                name="legal_client_address"
                defaultValue={v("legal_client_address")}
                className={inputClass}
              />
            </Field>
            <Field
              name="legal_process_document"
              label="Process / document to be served"
              required
              error={err.legal_process_document}
            >
              <textarea
                id="legal_process_document"
                name="legal_process_document"
                rows={2}
                placeholder="Describe the process/document — no file uploads, just a description"
                defaultValue={v("legal_process_document")}
                className={inputClass}
              />
            </Field>
          </section>
        )}

        <section className="border-border space-y-4 border-t pt-8">
          <label className="flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              name="client_confirmation_accepted"
              defaultChecked={values.client_confirmation_accepted === true}
              className="border-border mt-0.5 rounded-[var(--radius-control)]"
            />
            <span className="text-foreground">
              I confirm the information provided is accurate. Prime Couriex Express is not liable
              for an unsuccessful service caused by incorrect address or other details I&apos;ve
              supplied.
            </span>
          </label>
          {err.client_confirmation_accepted && (
            <p className="text-error text-xs">{err.client_confirmation_accepted}</p>
          )}

          <label className="flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              name="data_consent_accepted"
              defaultChecked={values.data_consent_accepted === true}
              className="border-border mt-0.5 rounded-[var(--radius-control)]"
            />
            <span className="text-foreground">
              I consent to Prime Couriex Express processing my personal data to fulfil this booking,
              in line with the{" "}
              <a
                href="/privacy"
                className="text-brand-text underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {err.data_consent_accepted && (
            <p className="text-error text-xs">{err.data_consent_accepted}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary-hover text-primary-foreground mt-2 w-full rounded-[var(--radius-control)] px-6 py-3 font-semibold disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Submitting…" : "Submit Booking"}
          </button>
        </section>
      </div>

      <aside className="border-border bg-surface sticky top-6 border p-6">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
          Price estimate
        </p>
        {!price || price.priceOnRequest ? (
          <>
            <p className="text-foreground mt-2 text-2xl font-bold">Price on request</p>
            <p className="text-muted-foreground mt-2 text-sm">
              We don&apos;t have a confirmed rate for {pickupDistrict || "this district"} yet. Your
              booking will still submit — our team will quote you directly.
            </p>
          </>
        ) : (
          <>
            <p className="text-foreground mt-2 text-3xl font-bold">
              ₦{price.total!.toLocaleString()}
            </p>
            <dl className="text-muted-foreground mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt>Base fee</dt>
                <dd>₦{price.basePrice!.toLocaleString()}</dd>
              </div>
              {price.surcharge > 0 && (
                <div className="flex justify-between">
                  <dt>Urgent surcharge</dt>
                  <dd>₦{price.surcharge.toLocaleString()}</dd>
                </div>
              )}
              {price.addon > 0 && (
                <div className="flex justify-between">
                  <dt>Return copy add-on</dt>
                  <dd>₦{price.addon.toLocaleString()}</dd>
                </div>
              )}
            </dl>
          </>
        )}
        <p className="text-muted-foreground mt-6 text-xs">
          This price is calculated and locked in at submission. It won&apos;t change afterward.
        </p>
      </aside>
    </form>
  );
}
