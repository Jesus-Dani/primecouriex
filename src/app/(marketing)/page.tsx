export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-brand-text font-semibold tracking-wide uppercase">
        Legal courier &amp; process serving — FCT, Abuja
      </p>
      <h1 className="text-foreground mt-3 max-w-2xl font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
        We deliver documents. You get results.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl">
        Project scaffold running. Full Home page content, hero imagery, and service highlights are
        built out in Phase 3.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="/booking"
          className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[var(--radius-control)] px-6 py-3 font-semibold"
        >
          Book a Service
        </a>
        <a
          href="/track"
          className="border-brand-text text-brand-text hover:bg-surface rounded-[var(--radius-control)] border px-6 py-3 font-semibold"
        >
          Track a Delivery
        </a>
      </div>

      <section className="border-border bg-card mt-16 rounded-[var(--radius-card)] border p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">
          Design token check (Direction A — Deep Navy)
        </h2>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => (
            <div key={step} className="text-center">
              <div
                className="border-border h-10 w-full rounded-[var(--radius-control)] border"
                style={{ backgroundColor: `var(--brand-${step})` }}
              />
              <span className="text-muted-foreground mt-1 block text-xs">{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="bg-success-bg text-success rounded-full px-3 py-1 font-medium">
            Confirmed
          </span>
          <span className="bg-warning-bg text-warning rounded-full px-3 py-1 font-medium">
            Pending Review
          </span>
          <span className="bg-error-bg text-error rounded-full px-3 py-1 font-medium">
            Rejected
          </span>
        </div>
      </section>
    </div>
  );
}
