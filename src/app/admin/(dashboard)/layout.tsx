import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-background flex min-h-svh flex-col">
      <header className="border-border border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="text-foreground font-[family-name:var(--font-heading)] font-bold">
            Prime Couriex Express — Staff Dashboard
          </p>
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-muted-foreground text-sm">Signed in as {user.email}</span>
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
  );
}
