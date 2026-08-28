export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
        Legal courier &amp; process serving — FCT, Abuja
      </p>
      <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-heading)] text-4xl font-bold text-foreground sm:text-5xl">
        We deliver documents. You get results.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Project scaffold running. Full Home page content, hero imagery, and service
        highlights are built out in Phase 3.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="/booking"
          className="rounded-[var(--radius-control)] bg-brand-900 px-6 py-3 font-semibold text-white hover:bg-brand-800 dark:bg-brand-500 dark:hover:bg-brand-400"
        >
          Book a Service
        </a>
        <a
          href="/track"
          className="rounded-[var(--radius-control)] border border-brand-900 px-6 py-3 font-semibold text-brand-900 hover:bg-surface dark:border-brand-300 dark:text-brand-100"
        >
          Track a Delivery
        </a>
      </div>

      <section className="mt-16 rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">
          Design token check (Direction A — Deep Navy)
        </h2>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => (
            <div key={step} className="text-center">
              <div
                className="h-10 w-full rounded-[var(--radius-control)] border border-border"
                style={{ backgroundColor: `var(--brand-${step})` }}
              />
              <span className="mt-1 block text-xs text-muted-foreground">{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-success-bg px-3 py-1 font-medium text-success">Confirmed</span>
          <span className="rounded-full bg-warning-bg px-3 py-1 font-medium text-warning">Pending Review</span>
          <span className="rounded-full bg-error-bg px-3 py-1 font-medium text-error">Rejected</span>
        </div>
      </section>
    </div>
  );
}
