import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="bg-background border-border border-b">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 sm:text-sm">
          <p className="hidden font-medium sm:block">Secure. Confidential. On Time.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="tel:+2349070535182" className="flex items-center gap-1.5 hover:underline">
              <Phone className="size-3.5" aria-hidden="true" />
              +234 907 053 5182
            </a>
            <a
              href="https://wa.me/2348137003223"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              <MessageCircle className="size-3.5" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href="mailto:support.primecouriex.ng@gmail.com"
              className="hidden items-center gap-1.5 hover:underline md:flex"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              support.primecouriex.ng@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
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
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
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
