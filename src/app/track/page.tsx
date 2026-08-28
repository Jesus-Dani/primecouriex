import Link from "next/link";

export default function TrackPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col items-start justify-center px-4 py-16 sm:px-6">
      <h1 className="text-foreground font-[family-name:var(--font-heading)] text-3xl font-bold">
        Track My Booking
      </h1>
      <p className="text-muted-foreground mt-3">
        Public reference-number lookup is built in Phase 7.
      </p>
      <Link
        href="/"
        className="text-brand-600 dark:text-brand-300 mt-6 text-sm font-semibold hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
