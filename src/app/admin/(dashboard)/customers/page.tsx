import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

type CustomerBookingRow = Pick<
  BookingRow,
  "email" | "customer_name" | "phone" | "whatsapp_number" | "company_name" | "created_at"
>;

interface Customer {
  email: string;
  customerName: string;
  phone: string;
  whatsappNumber: string;
  companyName: string | null;
  bookingCount: number;
  firstBookingAt: string;
  lastBookingAt: string;
}

/** Bookings don't carry a customer_id — there's no separate customers table
 * (PRD §5.2 puts customer accounts out of scope). This page derives one
 * customer per distinct email, using each customer's most recent booking
 * for display fields (name/phone can drift between bookings; the latest is
 * the most likely to be current). */
function groupByCustomer(rows: CustomerBookingRow[]): Customer[] {
  const byEmail = new Map<string, CustomerBookingRow[]>();
  for (const row of rows) {
    const list = byEmail.get(row.email) ?? [];
    list.push(row);
    byEmail.set(row.email, list);
  }

  const customers: Customer[] = [];
  for (const [email, bookings] of byEmail) {
    const sorted = [...bookings].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const latest = sorted[0];
    const oldest = sorted[sorted.length - 1];
    customers.push({
      email,
      customerName: latest.customer_name,
      phone: latest.phone,
      whatsappNumber: latest.whatsapp_number,
      companyName: latest.company_name,
      bookingCount: bookings.length,
      firstBookingAt: oldest.created_at,
      lastBookingAt: latest.created_at,
    });
  }

  return customers.sort(
    (a, b) => new Date(b.lastBookingAt).getTime() - new Date(a.lastBookingAt).getTime(),
  );
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("bookings")
    .select("email, customer_name, phone, whatsapp_number, company_name, created_at")
    .order("created_at", { ascending: false })
    .returns<CustomerBookingRow[]>();

  let customers = data ? groupByCustomer(data) : [];

  if (q) {
    const needle = q.trim().toLowerCase();
    customers = customers.filter(
      (c) =>
        c.customerName.toLowerCase().includes(needle) ||
        c.email.toLowerCase().includes(needle) ||
        c.phone.includes(needle) ||
        (c.companyName?.toLowerCase().includes(needle) ?? false),
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
        All customers
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        One row per email address across all bookings — there&apos;s no separate customer account
        system, so this is derived from booking contact details.
      </p>

      <form method="get" className="mt-6 flex gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, email, phone, or company"
          className="border-border bg-background text-foreground placeholder:text-placeholder-foreground focus-visible:ring-focus-ring w-full max-w-md rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-4 py-2 text-sm font-semibold"
        >
          Search
        </button>
        {q && (
          <Link
            href="/admin/customers"
            className="border-border text-foreground hover:bg-surface rounded-[var(--radius-control)] border px-4 py-2 text-sm font-semibold"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="border-border mt-8 overflow-x-auto border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Bookings</th>
              <th className="px-4 py-3 font-semibold">Last booking</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {error && (
              <tr>
                <td colSpan={5} className="text-error px-4 py-6">
                  Failed to load customers: {error.message}
                </td>
              </tr>
            )}
            {!error && customers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted-foreground px-4 py-6">
                  No customers match this search.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.email} className="hover:bg-surface">
                <td className="text-foreground px-4 py-3 font-medium">{c.customerName}</td>
                <td className="text-muted-foreground px-4 py-3">
                  <p>{c.phone}</p>
                  <p>{c.email}</p>
                </td>
                <td className="text-muted-foreground px-4 py-3">{c.companyName ?? "—"}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders?customer=${encodeURIComponent(c.email)}`}
                    className="text-brand-text font-medium hover:underline"
                  >
                    {c.bookingCount} {c.bookingCount === 1 ? "booking" : "bookings"}
                  </Link>
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {new Date(c.lastBookingAt).toLocaleString("en-NG", {
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
