import { createClient } from "@/lib/supabase/server";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/sidebar";
import { logout } from "../login/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-background flex min-h-svh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background sticky top-0 z-40 border-b">
          <div className="flex h-[65px] items-center justify-between gap-4 px-4 sm:px-6">
            <AdminMobileNav />
            <p className="text-foreground hidden font-[family-name:var(--font-heading)] font-bold xl:block">
              Prime Couriex Express — Staff Dashboard
            </p>
            <div className="flex items-center gap-4">
              {user?.email && (
                <span className="text-muted-foreground hidden text-sm sm:inline">
                  Signed in as {user.email}
                </span>
              )}
              <form action={logout}>
                <button
                  type="submit"
                  className="border-border text-foreground hover:bg-surface rounded-[var(--radius-control)] border px-3 py-1.5 text-sm font-medium"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
