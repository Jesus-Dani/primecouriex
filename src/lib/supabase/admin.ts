import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Privileged client using the service-role key, which bypasses Row Level
// Security entirely. `import "server-only"` makes it a build error to
// accidentally import this into client-side code — it must never be
// reachable from the browser (TRD §10.1). All booking writes, admin
// dashboard queries, and the public tracking lookup go through this client
// from within Server Actions / Route Handlers only, which are the actual
// authorization boundary (RLS is a default-deny backstop, not the primary
// gate — see supabase/migrations/0001_init.sql).
export function createAdminClient() {
  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
