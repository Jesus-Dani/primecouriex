import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="bg-background border-border border-b">
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs font-medium sm:text-sm">
        Reviewed within 1 hour, every booking.
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-brand-text shrink-0 font-[family-name:var(--font-heading)] text-lg font-bold"
        >
          Prime Couriex Express
        </Link>
        <nav className="text-muted-foreground hidden flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium xl:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/booking"
            className="bg-primary hover:bg-primary-hover text-primary-foreground focus-visible:ring-focus-ring rounded-[var(--radius-control)] px-5 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
          >
            Book Now
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
