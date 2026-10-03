import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-5">
        {/* Legal Links + Copyright */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <Link
            href="/disclaimer"
            className="hover:text-primary transition-colors"
          >
            Disclaimer
          </Link>
          <span>•</span>
          <Link
            href="/privacy-policy"
            className="hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms & Refunds
          </Link>
          {/* Hide dot on mobile, show on larger screens */}
          <span className="hidden sm:inline">•</span>
          <span>© {currentYear} Karma&apos;s Apothecary</span>
        </div>

        {/* Disclaimer Line */}
        <p className="mt-3 text-center text-[11px] text-muted-foreground/60">
          For entertainment purposes only. Not a substitute for professional
          advice.
        </p>
      </div>
    </footer>
  );
}
