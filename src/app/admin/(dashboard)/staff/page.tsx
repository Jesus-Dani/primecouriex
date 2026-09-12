import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StaffUserRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const admin = createAdminClient();

  const { data: staff, error } = await admin
    .from("staff_users")
    .select("*")
    .order("created_at", { ascending: true })
    .returns<StaffUserRow[]>();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
        Staff
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Everyone with access to this dashboard. New accounts are created at{" "}
        <Link href="/admin/login?mode=signup" className="text-brand-text underline">
          the staff sign-up page
        </Link>
        , open to anyone with the link — see the README for why.
      </p>

      <div className="border-border mt-8 overflow-x-auto border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {error && (
              <tr>
                <td colSpan={4} className="text-error px-4 py-6">
                  Failed to load staff: {error.message}
                </td>
              </tr>
            )}
            {!error && staff?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted-foreground px-4 py-6">
                  No staff accounts yet.
                </td>
              </tr>
            )}
            {staff?.map((s) => (
              <tr key={s.id}>
                <td className="text-foreground px-4 py-3 font-medium">{s.name}</td>
                <td className="text-muted-foreground px-4 py-3">{s.email}</td>
                <td className="text-muted-foreground px-4 py-3">{s.role}</td>
                <td className="text-muted-foreground px-4 py-3">
                  {new Date(s.created_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
