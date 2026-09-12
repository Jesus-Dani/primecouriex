import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 text-center text-sm sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} Prime Couriex Express Ltd. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-foreground">
            Terms and Conditions
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
