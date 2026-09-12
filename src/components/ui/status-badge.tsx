import type { BookingStatus } from "@/lib/supabase/types";

// Shared between the admin dashboard and the public /track page. Semantic
// colors per UI_DESIGN_BRIEF.md §2.5 — used only for status/validation, per
// that section's own rule, and always paired with a text label (never color
// alone), per §8's accessibility baseline.
const STYLES: Record<BookingStatus, string> = {
  pending_review: "bg-warning-bg text-warning",
  confirmed: "bg-success-bg text-success",
  in_transit: "bg-success-bg text-success",
  delivered: "bg-success-bg text-success",
  rejected: "bg-error-bg text-error",
  cancelled: "bg-error-bg text-error",
};

const LABELS: Record<BookingStatus, string> = {
  pending_review: "Pending Review",
  confirmed: "Confirmed",
  in_transit: "In Transit",
  delivered: "Delivered",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-control)] px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
