import Link from "next/link";
import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; mode?: string }>;
}) {
  const { error, mode } = await searchParams;
  const isSignup = mode === "signup";

  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-4">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
        {isSignup ? "Create a staff account" : "Staff sign in"}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        {isSignup
          ? "Set up a new staff account to review and manage bookings."
          : "Sign in to review and manage bookings."}
      </p>

      {error && (
        <p className="border-error bg-error-bg text-error mt-4 border px-4 py-3 text-sm">{error}</p>
      )}

      {isSignup ? (
        <form action={signup} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="text-foreground block text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="border-border bg-background text-foreground focus-visible:ring-focus-ring mt-1 w-full rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-foreground block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border-border bg-background text-foreground focus-visible:ring-focus-ring mt-1 w-full rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-foreground block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="border-border bg-background text-foreground focus-visible:ring-focus-ring mt-1 w-full rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            <p className="text-muted-foreground mt-1 text-xs">At least 8 characters.</p>
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-primary-foreground w-full rounded-[var(--radius-control)] px-4 py-2.5 text-sm font-semibold"
          >
            Create account
          </button>
        </form>
      ) : (
        <form action={login} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-foreground block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border-border bg-background text-foreground focus-visible:ring-focus-ring mt-1 w-full rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-foreground block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border-border bg-background text-foreground focus-visible:ring-focus-ring mt-1 w-full rounded-[var(--radius-control)] border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-primary-foreground w-full rounded-[var(--radius-control)] px-4 py-2.5 text-sm font-semibold"
          >
            Sign in
          </button>
        </form>
      )}

      <p className="text-muted-foreground mt-6 text-center text-sm">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/admin/login" className="text-brand-text underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New staff member?{" "}
            <Link href="/admin/login?mode=signup" className="text-brand-text underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </main>
  );
}
