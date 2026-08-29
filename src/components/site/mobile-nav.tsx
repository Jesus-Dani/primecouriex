"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NAV_LINKS } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="border-border text-foreground focus-visible:ring-focus-ring flex size-10 items-center justify-center rounded-[var(--radius-control)] border focus-visible:ring-2 focus-visible:outline-none"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
      </button>

      {open && (
        <nav
          id="mobile-nav-menu"
          className="border-border bg-background absolute inset-x-0 top-full border-t px-4 py-4 shadow-[var(--shadow-card)] sm:px-6"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground hover:bg-surface block rounded-[var(--radius-control)] px-3 py-2.5 font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
            <a href="tel:+2349070535182" className="text-foreground text-sm font-medium">
              +234 907 053 5182
            </a>
            <ThemeToggle />
          </div>
        </nav>
      )}
    </div>
  );
}
