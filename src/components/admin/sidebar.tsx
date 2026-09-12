"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  IdCard,
  Tag,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "All Orders", icon: Package },
  { href: "/admin/customers", label: "All Customers", icon: Users },
  { href: "/admin/staff", label: "Staff", icon: IdCard },
  { href: "/admin/pricing", label: "Pricing", icon: Tag },
];

const COLLAPSE_KEY = "admin-sidebar-collapsed";

function NavLinks({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium ${
              isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-surface"
            }`}
          >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

/** Persistent desktop sidebar, collapsible to icon-only width (state kept in
 * localStorage). Hidden below the xl breakpoint — see AdminMobileNav for the
 * small-screen equivalent. */
export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Deliberately deferred to an effect rather than a lazy useState
    // initializer: localStorage isn't available during SSR, so reading it
    // eagerly would make the client's first render disagree with the
    // server-rendered HTML and trigger a hydration mismatch. Setting state
    // once, post-mount, is the standard fix, even though it's what this
    // lint rule normally warns against.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // localStorage unavailable (private browsing, etc.) — default expanded.
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <aside
      className={`border-border bg-background sticky top-0 hidden h-svh shrink-0 flex-col border-r transition-[width] duration-150 xl:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="border-border flex h-[65px] items-center border-b px-3">
        {!collapsed && (
          <span className="text-foreground truncate pl-2 text-sm font-semibold">
            Staff Dashboard
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavLinks collapsed={collapsed} pathname={pathname} />
      </div>
      <button
        type="button"
        onClick={toggleCollapsed}
        className="border-border text-muted-foreground hover:bg-surface hover:text-foreground flex items-center gap-2 border-t px-3 py-3 text-sm"
      >
        {collapsed ? (
          <ChevronsRight className="size-5" aria-hidden="true" />
        ) : (
          <>
            <ChevronsLeft className="size-5" aria-hidden="true" />
            <span>Collapse</span>
          </>
        )}
      </button>
    </aside>
  );
}

/** Mobile equivalent: a header trigger button plus an off-canvas drawer.
 * Hidden at/above the xl breakpoint, where AdminSidebar takes over. */
export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="border-border text-foreground flex size-10 items-center justify-center rounded-[var(--radius-control)] border"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="border-border bg-background relative flex h-full w-72 max-w-[80vw] flex-col border-r">
            <div className="border-border flex h-16 items-center justify-between border-b px-4">
              <span className="text-foreground text-sm font-semibold">Staff Dashboard</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="border-border text-foreground flex size-9 items-center justify-center rounded-[var(--radius-control)] border"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavLinks collapsed={false} pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
