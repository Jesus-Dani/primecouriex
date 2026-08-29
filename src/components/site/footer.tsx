import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <div className="text-muted-foreground mx-auto max-w-7xl px-4 py-10 text-sm sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-foreground font-[family-name:var(--font-heading)] font-bold">
              Prime Couriex Express Ltd
            </p>
            <p className="mt-2">
              Process serving, courier & document delivery across the FCT, Abuja.
            </p>
          </div>
          <div>
            <p className="text-foreground font-semibold">Contact</p>
            <p className="mt-2">+234 907 053 5182</p>
            <p>+234 813 700 3223 (WhatsApp)</p>
            <p>info.legalcouriex.ng@gmail.com</p>
            <p>support.primecouriex.ng@gmail.com</p>
          </div>
          <div>
            <p className="text-foreground font-semibold">Legal</p>
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
        <p className="border-border mt-8 border-t pt-6">
          © {new Date().getFullYear()} Prime Couriex Express Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
