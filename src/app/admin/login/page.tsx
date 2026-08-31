import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-4">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
        Staff sign in
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">Sign in to review and manage bookings.</p>

      {error && (
        <p className="border-error bg-error-bg text-error mt-4 border px-4 py-3 text-sm">{error}</p>
      )}

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
    </div>
  );
}
