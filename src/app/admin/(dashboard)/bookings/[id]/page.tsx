import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/ui/status-badge";
import { CopyField } from "@/components/admin/copy-field";
import { ReviewActions } from "@/components/admin/review-actions";
import { StatusTransitionActions } from "@/components/admin/status-transition-actions";
import { NotifyForm } from "@/components/admin/notify-form";
import type { BookingRow, BookingStatusHistoryRow, StaffUserRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
        {label}
      </p>
      <p className="text-foreground mt-1 text-sm">{value}</p>
    </div>
  );
}

function money(n: number | null) {
  return n === null ? "To be confirmed" : `₦${n.toLocaleString()}`;
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: booking } = await admin
    .from("bookings")
    .select("*")
    .eq("id", id)
    .returns<BookingRow[]>()
    .maybeSingle();

  if (!booking) notFound();

  const { data: history } = await admin
    .from("booking_status_history")
    .select("*")
    .eq("booking_id", id)
    .order("created_at", { ascending: false })
    .returns<BookingStatusHistoryRow[]>();

  const staffIds = Array.from(new Set((history ?? []).map((h) => h.changed_by_staff_id)));
  let staffById = new Map<string, StaffUserRow>();
  if (staffIds.length > 0) {
    const { data: staff } = await admin
      .from("staff_users")
      .select("*")
      .in("id", staffIds)
      .returns<StaffUserRow[]>();
    staffById = new Map((staff ?? []).map((s) => [s.id, s]));
  }

  const isLegal = booking.service_type === "process_serving";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/admin" className="text-brand-text text-sm font-semibold hover:underline">
        ← Back to queue
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
            {booking.reference_number}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Submitted{" "}
            {new Date(booking.created_at).toLocaleString("en-NG", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <section className="border-border bg-surface border p-6">
            <h2 className="text-foreground font-semibold">Review actions</h2>
            <div className="mt-4 space-y-6">
              {booking.status === "pending_review" && <ReviewActions bookingId={booking.id} />}
              <StatusTransitionActions bookingId={booking.id} status={booking.status} />
              {booking.rejection_reason && (
                <p className="text-error text-sm">Rejection reason: {booking.rejection_reason}</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
              Service &amp; pricing
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Service type" value={booking.service_type.replace(/_/g, " ")} />
              <Field label="Delivery speed" value={booking.delivery_speed.replace(/_/g, " ")} />
              <Field label="Payment status" value={booking.payment_status} />
              <Field label="Pickup district" value={booking.pickup_district} />
              <Field label="Base fee" value={money(booking.base_price)} />
              <Field label="Urgent surcharge" value={money(booking.urgent_surcharge)} />
              <Field label="Return copy add-on" value={money(booking.addon_total)} />
              <Field label="Total price" value={money(booking.total_price)} />
            </div>
          </section>

          <section>
            <h2 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
              Pickup
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Address" value={booking.pickup_address} />
              <Field label="Contact name" value={booking.pickup_contact_name} />
              <Field label="Contact phone" value={booking.pickup_contact_phone} />
              <Field label="Preferred pickup date" value={booking.preferred_pickup_date} />
            </div>
          </section>

          <section>
            <h2 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
              Delivery
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Address" value={booking.delivery_address} />
              <Field label="Recipient name" value={booking.recipient_name} />
              <Field label="Recipient phone" value={booking.recipient_phone} />
              <Field label="Preferred delivery date" value={booking.preferred_delivery_date} />
            </div>
          </section>

          <section>
            <h2 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
              Package details
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Description" value={booking.package_description} />
              <Field label="Weight (kg)" value={booking.weight_kg} />
              <Field label="Item count" value={booking.package_count} />
              <Field label="Delivery instructions" value={booking.delivery_instructions} />
              <Field label="Additional notes" value={booking.additional_notes} />
            </div>
          </section>

          {isLegal && (
            <section>
              <h2 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
                Legal details
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field label="Court name" value={booking.legal_court_name} />
                <Field label="Suit / case number" value={booking.legal_suit_case_number} />
                <Field label="Process / document" value={booking.legal_process_document} />
                <Field label="Client address" value={booking.legal_client_address} />
                <Field label="Company name" value={booking.legal_company_name} />
                <Field label="Landmark" value={booking.legal_landmark} />
                <Field
                  label="Return copy add-on"
                  value={booking.return_copy_addon ? "Yes" : "No"}
                />
              </div>
            </section>
          )}

          <section>
            <h2 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
              Consent
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field
                label="Accuracy confirmation"
                value={booking.client_confirmation_accepted ? "Accepted" : "Not accepted"}
              />
              <Field
                label="NDPR data consent"
                value={
                  booking.data_consent_accepted
                    ? `Accepted ${new Date(booking.data_consent_timestamp).toLocaleString("en-NG")}`
                    : "Not accepted"
                }
              />
            </div>
          </section>

          <section>
            <h2 className="text-foreground font-[family-name:var(--font-heading)] text-lg font-semibold">
              Status history
            </h2>
            {!history || history.length === 0 ? (
              <p className="text-muted-foreground mt-3 text-sm">No status changes recorded yet.</p>
            ) : (
              <div className="border-border divide-border mt-4 divide-y border-t">
                {history.map((h) => (
                  <div key={h.id} className="grid gap-1 py-4 sm:grid-cols-3">
                    <p className="text-foreground text-sm font-medium">
                      {h.from_status ? `${h.from_status.replace(/_/g, " ")} → ` : ""}
                      {h.to_status.replace(/_/g, " ")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {staffById.get(h.changed_by_staff_id)?.name ?? "Unknown staff"} ·{" "}
                      {new Date(h.created_at).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="text-muted-foreground text-sm">{h.note}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border-border bg-surface border p-6">
            <h2 className="text-foreground font-semibold">Contact</h2>
            <div className="mt-4 space-y-4">
              <CopyField label="Reference number" value={booking.reference_number} />
              <CopyField label="Customer name" value={booking.customer_name} />
              <CopyField label="Phone" value={booking.phone} />
              <CopyField label="WhatsApp" value={booking.whatsapp_number} />
              <CopyField label="Email" value={booking.email} />
              {booking.company_name && <CopyField label="Company" value={booking.company_name} />}
            </div>
          </section>

          <section className="border-border bg-surface border p-6">
            <h2 className="text-foreground font-semibold">Mark as notified</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              For internal tracking only — no message is sent automatically.
            </p>
            <div className="mt-4">
              <NotifyForm
                bookingId={booking.id}
                notifiedAt={booking.notified_at}
                notifiedChannel={booking.notified_channel}
                notifiedNote={booking.notified_note}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
