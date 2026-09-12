import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/booking-form";
import { getDistrictRates } from "@/lib/get-district-rates";
import { getUrgentSurcharge } from "@/lib/get-urgent-surcharge";
import { SERVICE_TYPES } from "@/lib/booking-schema";
import type { ServiceType } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Online Booking | Prime Couriex Express",
  description:
    "Book a courier, process serving, or registry liaison service across the FCT, Abuja.",
};

// Pricing must always reflect the live database (TRD §3.2) — a statically
// prerendered page would bake in whatever rates existed at build time.
export const dynamic = "force-dynamic";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const defaultServiceType = SERVICE_TYPES.includes(service as ServiceType)
    ? (service as ServiceType)
    : undefined;

  const [districts, urgentSurcharge] = await Promise.all([
    getDistrictRates(),
    getUrgentSurcharge(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
        Book a service
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Fill in the details below. We review every booking, typically within 1 hour, and you&apos;ll
        get a reference number immediately so you can track progress. No file uploads — describe
        what needs to move in the text fields.
      </p>

      <div className="mt-10">
        <BookingForm
          districts={districts}
          urgentSurcharge={urgentSurcharge}
          defaultServiceType={defaultServiceType}
        />
      </div>
    </div>
  );
}
