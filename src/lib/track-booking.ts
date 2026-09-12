import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingRow, BookingStatus } from "@/lib/supabase/types";

// TRD §9: rate-limit by IP to prevent brute-force enumeration of reference
// numbers. Thresholds aren't specified in TRD beyond "rate-limit this
// endpoint" — 10 attempts per 15 minutes per IP is a reasonable default for
// a lookup a genuine customer would only need a handful of times.
const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 10;

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export interface TrackResult {
  rateLimited: boolean;
  found: boolean;
  referenceNumber?: string;
  status?: BookingStatus;
}

/**
 * Looks up a booking by reference number, returning only status (PRD §13,
 * TRD §9 — "no other booking fields are exposed"). Rate-limited by IP via
 * the `check_track_rate_limit` Postgres function, which logs the attempt,
 * prunes ones outside the window, and counts — all measured by the
 * database's own `now()`. Doing this as a single RPC (rather than
 * separate delete/insert/count calls comparing against a timestamp
 * computed by the app server's clock) avoids a real failure mode: if the
 * app server and database clocks ever drift, an app-computed window
 * cutoff silently stops matching any row, and the rate limit stops
 * firing without any error. Letting Postgres compute the boundary from
 * its own clock removes that dependency entirely.
 */
export async function trackBooking(referenceNumber: string): Promise<TrackResult> {
  const ip = await getClientIp();
  const admin = createAdminClient();

  // Same @supabase/supabase-js generic-inference limitation documented above
  // submitBooking()'s insert workaround (README "Architecture note"): the
  // .rpc() overload's Args generic collapses rather than picking up this
  // function's declared Args type, so it's called through a narrowly-typed
  // intermediate rather than fighting the inference.
  type RpcClient = {
    rpc: (
      fn: "check_track_rate_limit",
      args: { p_ip_address: string; p_window_minutes: number; p_max_attempts: number },
    ) => PromiseLike<{ data: boolean | null; error: { message: string } | null }>;
  };
  const { data: allowed, error: rpcError } = await (admin as unknown as RpcClient).rpc(
    "check_track_rate_limit",
    {
      p_ip_address: ip,
      p_window_minutes: WINDOW_MINUTES,
      p_max_attempts: MAX_ATTEMPTS,
    },
  );

  if (rpcError) {
    throw new Error(`Rate limit check failed: ${rpcError.message}`);
  }

  if (!allowed) {
    return { rateLimited: true, found: false };
  }

  const trimmed = referenceNumber.trim();
  if (!trimmed) return { rateLimited: false, found: false };

  const { data } = await admin
    .from("bookings")
    .select("reference_number, status")
    .eq("reference_number", trimmed)
    .returns<Pick<BookingRow, "reference_number" | "status">[]>()
    .maybeSingle();

  if (!data) return { rateLimited: false, found: false };
  return {
    rateLimited: false,
    found: true,
    referenceNumber: data.reference_number,
    status: data.status,
  };
}
