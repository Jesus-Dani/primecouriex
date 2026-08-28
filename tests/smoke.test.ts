import { describe, expect, it } from "vitest";

describe("environment", () => {
  it("has the required Supabase public env vars set", () => {
    expect(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL is not set — copy .env.example to .env.local",
    ).toBeTruthy();
    expect(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBeTruthy();
  });
});

describe("database connectivity", () => {
  it("reaches the Supabase project's REST endpoint", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key!, Authorization: `Bearer ${key}` },
    });

    // Any structured HTTP response (even an auth-related 401) proves the
    // network path and project reference resolve correctly; a network
    // failure (ECONNREFUSED/ENOTFOUND) would throw before this assertion.
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);
  });
});
