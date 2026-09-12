import { createAdminClient } from "@/lib/supabase/admin";
import { DistrictRateRowForm } from "@/components/admin/district-rate-row";
import { UrgentSurchargeForm } from "@/components/admin/urgent-surcharge-form";
import type { DistrictRateRow, PricingConfigRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const admin = createAdminClient();

  const [{ data: rates, error: ratesError }, { data: surchargeRows }] = await Promise.all([
    admin.from("district_rates").select("*").order("district").returns<DistrictRateRow[]>(),
    admin
      .from("pricing_config")
      .select("*")
      .eq("key", "urgent_surcharge")
      .returns<PricingConfigRow[]>(),
  ]);

  const urgentSurcharge = surchargeRows?.[0]?.value ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
        Pricing
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Flat per-district rates are the active pricing model (see README) — leave a field blank for
        &quot;price on request&quot; rather than guessing a number for a district without a
        confirmed fee.
      </p>

      <section className="border-border bg-surface mt-8 border p-6">
        <h2 className="text-foreground font-semibold">Urgent / express surcharge</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Flat amount added on top of the base fee when a customer selects urgent/express delivery,
          regardless of district.
        </p>
        <div className="mt-4">
          <UrgentSurchargeForm value={urgentSurcharge} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-foreground font-semibold">District rates</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Rider rate is internal cost only — never shown to customers. Standard fee and return-copy
          add-on fee are what customers see and pay.
        </p>
        <div className="border-border mt-4 overflow-x-auto border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">District</th>
                <th className="px-4 py-3 font-semibold">
                  Rider rate (internal) / Standard fee / Return-copy add-on
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {ratesError && (
                <tr>
                  <td colSpan={2} className="text-error px-4 py-6">
                    Failed to load district rates: {ratesError.message}
                  </td>
                </tr>
              )}
              {rates?.map((rate) => (
                <DistrictRateRowForm key={rate.id} rate={rate} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
