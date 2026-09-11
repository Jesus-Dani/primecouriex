import type { DeliverySpeed } from "@/lib/supabase/types";

// Client-directed override of the distance-based engine (src/lib/pricing.ts),
// "for now" — see supabase/migrations/0002_district_rates.sql. Kept as a
// separate module rather than replacing pricing.ts so reverting later is a
// config swap, not a rebuild.

export interface DistrictRateInput {
  district: string;
  standard_fee: number | null;
  return_copy_addon_fee: number | null;
}

export interface DistrictPriceBreakdown {
  district: string;
  basePrice: number | null;
  surcharge: number;
  addon: number;
  total: number | null;
  /** True when standard_fee (or return_copy_addon_fee, if requested) has no
   * confirmed figure yet (Zuba, Abaji) — price must be quoted by staff. */
  priceOnRequest: boolean;
}

/**
 * Pure district-rate pricing calculation. Unlike calculatePriceFromDistance,
 * the base fee and return-copy add-on are both flat per-district lookups
 * (docs/Internal_Rate_Sheet.docx), not a formula — this function only
 * combines already-looked-up values, it does not query the database.
 *
 * The urgent-express surcharge is unaffected by this change and stays a
 * flat, global figure (pricing_config.urgent_surcharge) — the rate sheet
 * doesn't address delivery speed at all.
 *
 * Computed once at booking submission and stored on the record — never
 * silently recalculated (TRD §4). All returned amounts are whole-Naira
 * integers (no floating-point currency math).
 */
export function calculatePriceForDistrict(
  rate: DistrictRateInput,
  deliverySpeed: DeliverySpeed,
  returnCopyAddon: boolean,
  urgentSurcharge: number,
): DistrictPriceBreakdown {
  const surcharge = deliverySpeed === "urgent_express" ? urgentSurcharge : 0;
  const addonFeeNeeded = returnCopyAddon && rate.return_copy_addon_fee === null;

  if (rate.standard_fee === null || addonFeeNeeded) {
    return {
      district: rate.district,
      basePrice: rate.standard_fee,
      surcharge,
      addon: returnCopyAddon ? (rate.return_copy_addon_fee ?? 0) : 0,
      total: null,
      priceOnRequest: true,
    };
  }

  const addon = returnCopyAddon ? rate.return_copy_addon_fee! : 0;
  const total = rate.standard_fee + surcharge + addon;

  return {
    district: rate.district,
    basePrice: rate.standard_fee,
    surcharge,
    addon,
    total,
    priceOnRequest: false,
  };
}
