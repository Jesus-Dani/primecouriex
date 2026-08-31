export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-2xl font-bold">
        Booking queue
      </h1>
      <p className="text-muted-foreground mt-3">
        The booking queue, detail view, and review workflow are built in Phase 6. Staff
        authentication and route protection are wired up now: seeing this page means you are signed
        in.
      </p>
    </div>
  );
}
