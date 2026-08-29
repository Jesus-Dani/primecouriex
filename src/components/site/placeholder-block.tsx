// Minimal placeholder for a section image, used until real photography is
// sourced (UI_DESIGN_BRIEF.md §6). A plain toned block reads as an
// intentional, restrained placeholder rather than a decorative illustration
// competing for attention in every section.
export function PlaceholderBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`border-border aspect-4/3 w-full rounded-[var(--radius-card)] border ${className}`}
      style={{ background: "linear-gradient(135deg, var(--surface), var(--border))" }}
    />
  );
}
