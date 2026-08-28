// Placeholder for real Abuja courier/process-serving photography (UI_DESIGN_BRIEF.md
// §6 — photography sourcing is a separate, budget-relevant task). An abstract brand
// illustration rather than a stock photo, so nothing here is mistaken for the real thing.
export function HeroGraphic() {
  return (
    <div className="border-border bg-primary relative aspect-4/3 w-full overflow-hidden rounded-[var(--radius-card)] border">
      <svg
        viewBox="0 0 480 360"
        className="h-full w-full"
        role="img"
        aria-labelledby="hero-graphic-title"
      >
        <title id="hero-graphic-title">
          Illustration of a delivery route across the Federal Capital Territory, Abuja
        </title>
        <defs>
          <linearGradient id="hg-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-800)" />
            <stop offset="100%" stopColor="var(--brand-900)" />
          </linearGradient>
        </defs>
        <rect width="480" height="360" fill="url(#hg-bg)" />

        {/* Faint district grid, evoking a city map without being a literal one */}
        <g stroke="var(--brand-700)" strokeWidth="1" opacity="0.5">
          <path d="M0 90 H480" />
          <path d="M0 180 H480" />
          <path d="M0 270 H480" />
          <path d="M120 0 V360" />
          <path d="M240 0 V360" />
          <path d="M360 0 V360" />
        </g>

        {/* Delivery route */}
        <path
          d="M70 260 C 140 230, 150 150, 210 140 S 330 90, 400 100"
          fill="none"
          stroke="var(--brand-300)"
          strokeWidth="3"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />

        {/* Pickup point */}
        <circle cx="70" cy="260" r="7" fill="var(--brand-300)" />
        <circle
          cx="70"
          cy="260"
          r="12"
          fill="none"
          stroke="var(--brand-300)"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Destination pin */}
        <path
          d="M400 60 C 415 60 427 72 427 87 C 427 108 400 132 400 132 C 400 132 373 108 373 87 C 373 72 385 60 400 60 Z"
          fill="var(--primary-foreground)"
        />
        <circle cx="400" cy="87" r="9" fill="var(--brand-700)" />

        {/* Document card */}
        <g transform="translate(150 190)">
          <rect width="120" height="88" rx="10" fill="var(--primary-foreground)" opacity="0.96" />
          <rect x="16" y="18" width="60" height="8" rx="4" fill="var(--brand-800)" />
          <rect x="16" y="36" width="88" height="6" rx="3" fill="var(--brand-300)" />
          <rect x="16" y="50" width="88" height="6" rx="3" fill="var(--brand-300)" />
          <rect x="16" y="64" width="52" height="6" rx="3" fill="var(--brand-300)" />
        </g>
      </svg>
    </div>
  );
}
