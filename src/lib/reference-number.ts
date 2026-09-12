// Format: PCX-YYYY-NNNNNN (TRD Appendix A). NNNNNN is randomly generated
// rather than sequential — simpler without a shared counter, and the caller
// is expected to retry on a unique-constraint collision (astronomically
// unlikely at this volume, but not impossible) before falling back to this
// generator again.
export function generateReferenceNumber(year: number, random: () => number = Math.random): string {
  const n = Math.floor(random() * 1_000_000);
  return `PCX-${year}-${String(n).padStart(6, "0")}`;
}
