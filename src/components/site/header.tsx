import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/service-areas", label: "Abuja Service Areas" },
  { href: "/calculator", label: "Price Calculator" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/corporate", label: "Corporate" },
  { href: "/track", label: "Track My Booking" },
];

export function SiteHeader() {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-brand-text font-[family-name:var(--font-heading)] text-lg font-bold"
        >
          Prime Couriex Express
        </Link>
        <nav className="text-muted-foreground hidden flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/booking"
            className="bg-primary hover:bg-primary-hover text-primary-foreground focus-visible:ring-focus-ring rounded-[var(--radius-control)] px-5 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
