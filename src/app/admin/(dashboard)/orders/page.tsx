import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/ui/status-badge";
import type { BookingRow, BookingStatus, ServiceType } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS: BookingStatus[] = [
  "pending_review",
  "confirmed",
  "in_transit",
  "delivered",
  "rejected",
  "cancelled",
];

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "process_serving", label: "Process Serving & Legal Documents" },
  { value: "registry_liaison", label: "Registry Liaison & Document Retrieval" },
  { value: "corporate_courier", label: "Corporate & Institutional Courier" },
  { value: "same_day_delivery", label: "Same-day Document Delivery" },
  { value: "filing_compliance", label: "Filing & Compliance" },
];

type QueueRow = Pick<
  BookingRow,
  | "id"
  | "reference_number"
  | "customer_name"
  | "phone"
  | "email"
  | "service_type"
  | "status"
  | "created_at"
>;

const selectClass =
  "border-border bg-background text-foreground focus-visible:ring-focus-ring w-full rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    service_type?: string;
    from?: string;
    to?: string;
    customer?: string;
  }>;
}) {
  const { status, service_type, from, to, customer } = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("bookings")
    .select("id, reference_number, customer_name, phone, email, service_type, status, created_at")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (service_type) query = query.eq("service_type", service_type);
  if (from) query = query.gte("created_at", `${from}T00:00:00.000Z`);
  if (to) query = query.lte("created_at", `${to}T23:59:59.999Z`);
  if (customer) query = query.eq("email", customer);

  const { data: bookings, error } = await query.returns<QueueRow[]>();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
        All orders
      </h1>

      {customer && (
        <p className="text-muted-foreground mt-2 text-sm">
          Showing orders for <span className="text-foreground font-medium">{customer}</span> ·{" "}
          <Link href="/admin/orders" className="text-brand-text underline">
            Clear
          </Link>
        </p>
      )}

      <form method="get" className="mt-6 grid gap-4 sm:grid-cols-4">
        <select name="status" defaultValue={status ?? ""} className={selectClass}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select name="service_type" defaultValue={service_type ?? ""} className={selectClass}>
          <option value="">All services</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input type="date" name="from" defaultValue={from ?? ""} className={selectClass} />
        <input type="date" name="to" defaultValue={to ?? ""} className={selectClass} />
        {customer && <input type="hidden" name="customer" value={customer} />}
        <div className="flex gap-2 sm:col-span-4">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-4 py-2 text-sm font-semibold"
          >
            Filter
          </button>
          <Link
            href="/admin/orders"
            className="border-border text-foreground hover:bg-surface rounded-[var(--radius-control)] border px-4 py-2 text-sm font-semibold"
          >
            Clear
          </Link>
        </div>
      </form>

      <div className="border-border mt-8 overflow-x-auto border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {error && (
              <tr>
                <td colSpan={6} className="text-error px-4 py-6">
                  Failed to load bookings: {error.message}
                </td>
              </tr>
            )}
            {!error && bookings?.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted-foreground px-4 py-6">
                  No bookings match these filters.
                </td>
              </tr>
            )}
            {bookings?.map((b) => (
              <tr key={b.id} className="hover:bg-surface">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${b.id}`}
                    className="text-brand-text font-medium hover:underline"
                  >
                    {b.reference_number}
                  </Link>
                </td>
                <td className="text-foreground px-4 py-3">{b.customer_name}</td>
                <td className="text-muted-foreground px-4 py-3">
                  <p>{b.phone}</p>
                  <p>{b.email}</p>
                </td>
                <td className="text-foreground px-4 py-3">{b.service_type.replace(/_/g, " ")}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {new Date(b.created_at).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
