import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PriceCalculatorForm } from "@/components/booking/price-calculator-form";
import { getDistrictRates } from "@/lib/get-district-rates";
import { getUrgentSurcharge } from "@/lib/get-urgent-surcharge";

export const metadata: Metadata = {
  title: "Delivery Price Calculator | Prime Couriex Express",
  description: "Get an instant estimated price for your delivery, no booking required.",
};

// Pricing lives in the database specifically so it can change without a code
// deploy (TRD §3.2) — a statically prerendered page would bake in whatever
// rates existed at build time and silently go stale.
export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
  const [districts, urgentSurcharge] = await Promise.all([
    getDistrictRates(),
    getUrgentSurcharge(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Price calculator"
        title="Get an instant estimate"
        intro="No booking required — pick your pickup district and delivery speed to see the price."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <PriceCalculatorForm districts={districts} urgentSurcharge={urgentSurcharge} />
      </section>
    </>
  );
}
