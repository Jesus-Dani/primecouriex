import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PriceCalculatorForm } from "@/components/booking/price-calculator-form";
import { getDistrictRates } from "@/lib/get-district-rates";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PricingConfigRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Delivery Price Calculator | Prime Couriex Express",
  description: "Get an instant estimated price for your delivery, no booking required.",
};

// Pricing lives in the database specifically so it can change without a code
// deploy (TRD §3.2) — a statically prerendered page would bake in whatever
// rates existed at build time and silently go stale.
export const dynamic = "force-dynamic";

async function getUrgentSurcharge(): Promise<number> {
  const supabase = createAdminClient();
  // .returns<>() explicitly overrides the inferred row type — Supabase JS's
  // automatic inference for .from(table) has a known issue where, past a
  // certain number of tables in the Database type, type-checking for one
  // specific table's queries can silently collapse to `never` rather than
  // erroring clearly. This is the library's documented escape hatch.
  const { data, error } = await supabase
    .from("pricing_config")
    .select("*")
    .eq("key", "urgent_surcharge")
    .returns<PricingConfigRow[]>();

  if (error) throw new Error(`Failed to load pricing config: ${error.message}`);
  if (!data[0]) throw new Error("pricing_config is missing the urgent_surcharge row");
  return data[0].value;
}

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
