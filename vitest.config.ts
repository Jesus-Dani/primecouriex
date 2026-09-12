import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
    setupFiles: ["./vitest.setup.ts"],
    // Several tests do real network round trips against the live Supabase
    // project (no mocking layer exists for the DB). Observed latency from
    // this environment runs ~5s per round trip, and a single booking
    // submission makes 3-4 sequential calls (district rate, pricing config,
    // insert, plus the test's own verification select) — 20s wasn't enough
    // headroom under slower conditions.
    testTimeout: 45000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
