import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/ui/status-badge";
import type { BookingRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

type RecentRow = Pick<
  BookingRow,
  "id" | "reference_number" | "customer_name" | "status" | "created_at"
>;

export default async function DashboardPage() {
  const admin = createAdminClient();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  const [
    { count: totalCount },
    { count: pendingCount },
    { count: todayCount },
    { count: weekCount },
    { data: recent },
  ] = await Promise.all([
    admin.from("bookings").select("*", { count: "exact", head: true }),
    admin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_review"),
    admin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),
    admin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfWeek.toISOString()),
    admin
      .from("bookings")
      .select("id, reference_number, customer_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8)
      .returns<RecentRow[]>(),
  ]);

  const stats = [
    {
      label: "Pending review",
      value: pendingCount ?? 0,
      href: "/admin/orders?status=pending_review",
    },
    { label: "Booked today", value: todayCount ?? 0, href: "/admin/orders" },
    { label: "Booked this week", value: weekCount ?? 0, href: "/admin/orders" },
    { label: "Total bookings", value: totalCount ?? 0, href: "/admin/orders" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
        Dashboard
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="border-border hover:bg-surface block border p-5"
          >
            <p className="text-foreground font-[family-name:var(--font-heading)] text-3xl font-bold">
              {s.value}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground font-semibold">Recent bookings</h2>
          <Link
            href="/admin/orders"
            className="text-brand-text text-sm font-semibold hover:underline"
          >
            View all orders →
          </Link>
        </div>
        <div className="border-border mt-4 overflow-x-auto border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {(!recent || recent.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-muted-foreground px-4 py-6">
                    No bookings yet.
                  </td>
                </tr>
              )}
              {recent?.map((b) => (
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
    </div>
  );
}
