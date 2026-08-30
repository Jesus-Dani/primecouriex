import Link from "next/link";

export default function BookingPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col items-start justify-center px-4 py-16 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-3xl font-bold">
        Online Booking
      </h1>
      <p className="text-muted-foreground mt-3">
        The full booking form and live pricing engine are built in Phase 4.
      </p>
      <Link href="/" className="text-brand-text mt-6 text-sm font-semibold hover:underline">
        ← Back to Home
      </Link>
    </div>
  );
}
