"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingRow, BookingStatus } from "@/lib/supabase/types";

export interface ActionResult {
  status: "idle" | "error";
  formError?: string;
}

/** The Server Action itself is the authorization boundary (README's
 * documented model), not just the middleware redirect — a Server Action can
 * be invoked directly, not only via the rendered page. Returns the acting
 * staff user's id or throws. */
async function requireStaffId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

async function getCurrentStatus(bookingId: string): Promise<BookingStatus> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("bookings")
    .select("status")
    .eq("id", bookingId)
    .returns<Pick<BookingRow, "status">[]>()
    .maybeSingle();
  if (error || !data) throw new Error("Booking not found");
  return data.status;
}

async function recordStatusChange(
  bookingId: string,
  fromStatus: BookingStatus,
  toStatus: BookingStatus,
  changedByStaffId: string,
  note?: string,
) {
  const admin = createAdminClient();
  type InsertableHistoryTable = {
    insert: (row: {
      booking_id: string;
      from_status: BookingStatus;
      to_status: BookingStatus;
      changed_by_staff_id: string;
      note: string | null;
    }) => PromiseLike<{ error: { message: string } | null }>;
  };
  // Same select-string/insert type-inference limit noted in
  // src/app/booking/actions.ts and the README — narrowly scoped assertion.
  const { error } = await (
    admin.from("booking_status_history") as unknown as InsertableHistoryTable
  ).insert({
    booking_id: bookingId,
    from_status: fromStatus,
    to_status: toStatus,
    changed_by_staff_id: changedByStaffId,
    note: note ?? null,
  });
  if (error) throw new Error(`Failed to record status history: ${error.message}`);
}

function revalidateBooking(bookingId: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/bookings/${bookingId}`);
}

async function transitionStatus(
  bookingId: string,
  toStatus: BookingStatus,
  extraFields: Partial<BookingRow> = {},
  note?: string,
): Promise<ActionResult> {
  try {
    const staffId = await requireStaffId();
    const fromStatus = await getCurrentStatus(bookingId);
    const admin = createAdminClient();

    type UpdatableBookingsTable = {
      update: (row: Partial<BookingRow>) => {
        eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }>;
      };
    };
    const { error } = await (admin.from("bookings") as unknown as UpdatableBookingsTable)
      .update({ status: toStatus, ...extraFields })
      .eq("id", bookingId);
    if (error) throw new Error(error.message);

    await recordStatusChange(bookingId, fromStatus, toStatus, staffId, note);
    revalidateBooking(bookingId);
    return { status: "idle" };
  } catch (e) {
    return { status: "error", formError: (e as Error).message };
  }
}

export async function approveBooking(bookingId: string): Promise<ActionResult> {
  const staffId = await requireStaffId().catch((e: Error) => e);
  if (staffId instanceof Error) return { status: "error", formError: staffId.message };
  return transitionStatus(bookingId, "confirmed", { confirmed_by_staff_id: staffId });
}

export async function rejectBooking(bookingId: string, reason: string): Promise<ActionResult> {
  if (!reason.trim()) return { status: "error", formError: "A rejection reason is required." };
  return transitionStatus(bookingId, "rejected", { rejection_reason: reason }, reason);
}

export async function markInTransit(bookingId: string): Promise<ActionResult> {
  return transitionStatus(bookingId, "in_transit");
}

export async function markDelivered(bookingId: string): Promise<ActionResult> {
  return transitionStatus(bookingId, "delivered");
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<ActionResult> {
  return transitionStatus(bookingId, "cancelled", {}, reason);
}

export async function markNotified(
  bookingId: string,
  channel: string,
  note: string,
): Promise<ActionResult> {
  if (!channel.trim()) return { status: "error", formError: "Select a channel." };
  try {
    const staffId = await requireStaffId();
    const admin = createAdminClient();
    type UpdatableBookingsTable = {
      update: (row: Partial<BookingRow>) => {
        eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }>;
      };
    };
    const { error } = await (admin.from("bookings") as unknown as UpdatableBookingsTable)
      .update({
        notified_at: new Date().toISOString(),
        notified_by_staff_id: staffId,
        notified_channel: channel,
        notified_note: note || null,
      })
      .eq("id", bookingId);
    if (error) throw new Error(error.message);
    revalidateBooking(bookingId);
    return { status: "idle" };
  } catch (e) {
    return { status: "error", formError: (e as Error).message };
  }
}
