import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Browser client, scoped to the anon/publishable key. Used only for staff
// auth session management (login form) — never for reading/writing booking
// data, which stays server-side per TRD §10.1.
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
