import type { DeliverySpeed } from "@/lib/supabase/types";

// Mirrors the four pricing_config rows (TRD §3.2, seeded in supabase/seed.sql).
export interface PricingConfigValues {
  rate_per_km: number;
  minimum_charge: number;
  urgent_surcharge: number;
  return_copy_addon_fee: number;
}

export interface PriceBreakdown {
  distanceKm: number;
  basePrice: number;
  surcharge: number;
  addon: number;
  total: number;
}

/**
 * Pure pricing calculation (TRD §4) — takes an already-known distance rather
 * than calling the Google Maps Routes API itself, so this money-handling
 * logic is unit-testable without network I/O. The Maps distance lookup
 * (Phase 4) calls this function once it has resolved distanceKm.
 *
 * Computed once at booking submission and stored on the record — never
 * silently recalculated (TRD §4). All returned amounts are whole-Naira
 * integers (no floating-point currency math).
 */
export function calculatePriceFromDistance(
  distanceKm: number,
  deliverySpeed: DeliverySpeed,
  returnCopyAddon: boolean,
  config: PricingConfigValues,
): PriceBreakdown {
  const basePrice = Math.round(Math.max(distanceKm * config.rate_per_km, config.minimum_charge));

  const surcharge = deliverySpeed === "urgent_express" ? config.urgent_surcharge : 0;
  const addon = returnCopyAddon ? config.return_copy_addon_fee : 0;

  const total = basePrice + surcharge + addon;

  return { distanceKm, basePrice, surcharge, addon, total };
}
