import { vi } from "vitest";
import { config } from "dotenv";

config({ path: ".env.local" });

// "server-only" enforces its guard under Vite's module resolution (unlike
// plain Node/tsx, where it's a no-op) — tests that import server-side
// modules (e.g. src/lib/supabase/admin.ts) need it stubbed out.
vi.mock("server-only", () => ({}));
