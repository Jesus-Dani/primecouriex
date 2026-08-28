export default function BookingPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col items-start justify-center px-4 py-16 sm:px-6">
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground">
        Online Booking
      </h1>
      <p className="mt-3 text-muted-foreground">
        The full booking form and live pricing engine are built in Phase 4.
      </p>
      <a href="/" className="mt-6 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">
        ← Back to Home
      </a>
    </div>
  );
}
