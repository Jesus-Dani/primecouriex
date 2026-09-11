import { describe, expect, it } from "vitest";
import { calculatePriceForDistrict, type DistrictRateInput } from "@/lib/pricing-district";

// docs/Internal_Rate_Sheet.docx — Central Business District (CBD) row.
const CBD: DistrictRateInput = {
  district: "Central Business District (CBD)",
  standard_fee: 5000,
  return_copy_addon_fee: 3500,
};

// Highest-tier district, for a distinctly different worked example.
const GWAGWALADA: DistrictRateInput = {
  district: "Gwagwalada",
  standard_fee: 12500,
  return_copy_addon_fee: 12500,
};

// No confirmed client-facing figures at all (Abaji, per the source doc).
const ABAJI: DistrictRateInput = {
  district: "Abaji",
  standard_fee: null,
  return_copy_addon_fee: null,
};

// Rider rate known, but client fees not yet set (Zuba, per the source doc).
const ZUBA: DistrictRateInput = {
  district: "Zuba",
  standard_fee: null,
  return_copy_addon_fee: null,
};

const URGENT_SURCHARGE = 5000;

describe("calculatePriceForDistrict — worked examples (Internal_Rate_Sheet.docx)", () => {
  it("CBD, standard delivery: just the standard fee", () => {
    const result = calculatePriceForDistrict(CBD, "standard", false, URGENT_SURCHARGE);
    expect(result).toEqual({
      district: CBD.district,
      basePrice: 5000,
      surcharge: 0,
      addon: 0,
      total: 5000,
      priceOnRequest: false,
    });
  });

  it("CBD, with return copy: standard fee + district-specific add-on", () => {
    const result = calculatePriceForDistrict(CBD, "standard", true, URGENT_SURCHARGE);
    expect(result.total).toBe(5000 + 3500);
  });

  it("Gwagwalada, urgent + return copy: highest-tier district stacks correctly", () => {
    const result = calculatePriceForDistrict(GWAGWALADA, "urgent_express", true, URGENT_SURCHARGE);
    expect(result).toEqual({
      district: GWAGWALADA.district,
      basePrice: 12500,
      surcharge: 5000,
      addon: 12500,
      total: 12500 + 5000 + 12500,
      priceOnRequest: false,
    });
  });
});

describe("calculatePriceForDistrict — districts with no confirmed rate", () => {
  it("Abaji has no fixed rate at all: price on request", () => {
    const result = calculatePriceForDistrict(ABAJI, "standard", false, URGENT_SURCHARGE);
    expect(result.priceOnRequest).toBe(true);
    expect(result.total).toBeNull();
    expect(result.basePrice).toBeNull();
  });

  it("Zuba has no client-facing fee yet: price on request", () => {
    const result = calculatePriceForDistrict(ZUBA, "urgent_express", false, URGENT_SURCHARGE);
    expect(result.priceOnRequest).toBe(true);
    expect(result.total).toBeNull();
  });

  it("a district with a known base fee but unknown return-copy fee is on-request only when return copy is actually selected", () => {
    const partial: DistrictRateInput = {
      district: "Hypothetical",
      standard_fee: 6000,
      return_copy_addon_fee: null,
    };

    const withoutAddon = calculatePriceForDistrict(partial, "standard", false, URGENT_SURCHARGE);
    expect(withoutAddon.priceOnRequest).toBe(false);
    expect(withoutAddon.total).toBe(6000);

    const withAddon = calculatePriceForDistrict(partial, "standard", true, URGENT_SURCHARGE);
    expect(withAddon.priceOnRequest).toBe(true);
    expect(withAddon.total).toBeNull();
    expect(withAddon.basePrice).toBe(6000);
  });
});

describe("calculatePriceForDistrict — delivery speed", () => {
  it("applies no surcharge for same_day, unlike urgent_express", () => {
    const result = calculatePriceForDistrict(CBD, "same_day", false, URGENT_SURCHARGE);
    expect(result.surcharge).toBe(0);
  });

  it("applies the flat urgent surcharge on top of the district fee", () => {
    const result = calculatePriceForDistrict(CBD, "urgent_express", false, URGENT_SURCHARGE);
    expect(result.surcharge).toBe(URGENT_SURCHARGE);
    expect(result.total).toBe(5000 + URGENT_SURCHARGE);
  });
});
