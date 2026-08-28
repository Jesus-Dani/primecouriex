import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-[family-name:var(--font-heading)] font-bold text-foreground">
              Prime Couriex Express Ltd
            </p>
            <p className="mt-2">Process serving, courier & document delivery across the FCT, Abuja.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Contact</p>
            <p className="mt-2">+234 907 053 5182</p>
            <p>+234 813 700 3223 (WhatsApp)</p>
            <p>info.legalcouriex.ng@gmail.com</p>
            <p>support.primecouriex.ng@gmail.com</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Legal</p>
            <p className="mt-2">
              <Link href="/terms" className="hover:text-foreground">
                Terms and Conditions
              </Link>
            </p>
            <p>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-6">
          © {new Date().getFullYear()} Prime Couriex Express Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
