import { describe, expect, it } from "vitest";
import { generateReferenceNumber } from "@/lib/reference-number";

describe("generateReferenceNumber", () => {
  it("matches the locked PCX-YYYY-NNNNNN format (TRD Appendix A)", () => {
    const ref = generateReferenceNumber(2026, () => 0.123456);
    expect(ref).toMatch(/^PCX-\d{4}-\d{6}$/);
  });

  it("zero-pads the sequence to 6 digits", () => {
    const ref = generateReferenceNumber(2026, () => 0.000001);
    expect(ref).toBe("PCX-2026-000001");
  });

  it("uses the full 6-digit range", () => {
    const ref = generateReferenceNumber(2026, () => 0.999999);
    expect(ref).toBe("PCX-2026-999999");
  });

  it("embeds the given year", () => {
    expect(generateReferenceNumber(2027, () => 0.5)).toContain("PCX-2027-");
  });
});
