import { describe, expect, it } from "vitest";
import { calculatePriceFromDistance, type PricingConfigValues } from "@/lib/pricing";

// Locked v1 values — PRD §10.1-10.3, TRD §3.2 (supabase/seed.sql).
const CONFIG: PricingConfigValues = {
  rate_per_km: 540,
  minimum_charge: 5000,
  urgent_surcharge: 5000,
  return_copy_addon_fee: 3500,
};

describe("calculatePriceFromDistance — worked examples (PRD §10.4)", () => {
  it("Standard delivery, Wuse to Garki: 3 km falls to the ₦5,000 minimum", () => {
    const result = calculatePriceFromDistance(3, "standard", false, CONFIG);
    expect(result).toEqual({
      distanceKm: 3,
      basePrice: 5000,
      surcharge: 0,
      addon: 0,
      total: 5000,
    });
  });

  it("Urgent legal service, Maitama to Nyanya, with return copy: 22 km", () => {
    const result = calculatePriceFromDistance(22, "urgent_express", true, CONFIG);
    expect(result).toEqual({
      distanceKm: 22,
      basePrice: 11880,
      surcharge: 5000,
      addon: 3500,
      total: 20380,
    });
  });
});

describe("calculatePriceFromDistance — edge cases (TRD §13)", () => {
  it("floors zero distance to the minimum charge", () => {
    const result = calculatePriceFromDistance(0, "standard", false, CONFIG);
    expect(result.basePrice).toBe(5000);
    expect(result.total).toBe(5000);
  });

  it("floors negative distance to the minimum charge (never a negative or zero fee)", () => {
    const result = calculatePriceFromDistance(-12, "standard", false, CONFIG);
    expect(result.basePrice).toBe(5000);
    expect(result.total).toBe(5000);
  });

  it("uses the distance-based fee exactly at the minimum-charge boundary", () => {
    // 5000 / 540 km is exactly where distance*rate equals the minimum charge.
    const boundaryKm = CONFIG.minimum_charge / CONFIG.rate_per_km;
    const result = calculatePriceFromDistance(boundaryKm, "standard", false, CONFIG);
    expect(result.basePrice).toBe(5000);
  });

  it("switches from the floor to the real distance fee just past the boundary", () => {
    const justOverKm = CONFIG.minimum_charge / CONFIG.rate_per_km + 1;
    const result = calculatePriceFromDistance(justOverKm, "standard", false, CONFIG);
    expect(result.basePrice).toBe(Math.round(justOverKm * CONFIG.rate_per_km));
    expect(result.basePrice).toBeGreaterThan(CONFIG.minimum_charge);
  });

  it("stacks the urgent surcharge and return-copy add-on together", () => {
    const result = calculatePriceFromDistance(10, "urgent_express", true, CONFIG);
    // basePrice = max(10*540, 5000) = 5400
    expect(result.basePrice).toBe(5400);
    expect(result.surcharge).toBe(5000);
    expect(result.addon).toBe(3500);
    expect(result.total).toBe(5400 + 5000 + 3500);
  });

  it("applies no surcharge for same_day speed, unlike urgent_express", () => {
    const result = calculatePriceFromDistance(10, "same_day", false, CONFIG);
    expect(result.surcharge).toBe(0);
  });

  it("rounds a fractional base price to a whole-Naira integer", () => {
    const result = calculatePriceFromDistance(12.34, "standard", false, CONFIG);
    expect(Number.isInteger(result.basePrice)).toBe(true);
    expect(result.basePrice).toBe(Math.round(12.34 * 540));
  });
});
