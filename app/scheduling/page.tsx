"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, ExternalLink, ArrowLeft } from "lucide-react";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/karmicapothecary/new-meeting";

/**
 * /scheduling — Calendly redirect page
 *
 * This page is reached when a client wants to schedule a live session.
 * Rather than showing fake pre-generated time slots (which caused timezone
 * confusion and double-booking), we redirect to Calendly which handles:
 *   ✅ Real availability (you control it in Calendly)
 *   ✅ Automatic timezone conversion for every visitor
 *   ✅ Double-booking prevention
 *   ✅ Calendar invites & reminders
 *
 * For clients arriving from the normal checkout flow, scheduling now happens
 * AFTER payment — the Calendly link is in their confirmation email.
 * This page exists for direct links, old bookmarks, or manual scheduling.
 */
function SchedulingPageContent() {
  const searchParams = useSearchParams();
  const reading = searchParams.get("reading") ?? "";

  // Auto-redirect after a short delay so the user can read the message
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = CALENDLY_URL;
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const readingLabel =
    reading === "vip-session"
      ? "VIP Session (60–90 min)"
      : reading === "deep-dive"
        ? "Deep Dive Session"
        : "Your Session";

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Calendar size={36} className="text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Schedule Your {readingLabel}
        </h1>

        <p className="mt-3 text-muted-foreground">
          You&apos;re being taken to Calendly to pick a real date and time that
          works for you. Calendly automatically shows times in{" "}
          <strong>your local timezone</strong> — no confusion, no double
          bookings.
        </p>

        {/* Auto-redirect progress bar */}
        <div className="mx-auto mt-6 h-1 w-full max-w-xs overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              animation: "progress 4s linear forwards",
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Redirecting automatically in 4 seconds…
        </p>

        <style>{`
          @keyframes progress {
            from { width: 0% }
            to   { width: 100% }
          }
        `}</style>

        {/* Primary CTA */}
        <a
          href={CALENDLY_URL}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Calendar size={16} />
          Open Calendly Now
          <ExternalLink size={14} />
        </a>

        {/* Back link */}
        <Link
          href={reading ? `/book?reading=${reading}` : "/readings"}
          className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} />
          Go back
        </Link>

        {/* What to expect */}
        <div className="mt-10 rounded-xl border border-border bg-card p-5 text-left">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            What to expect on Calendly
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">🌍</span>
              Times shown in <strong>your local timezone</strong> automatically
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">📅</span>
              Only <strong>real available slots</strong> are shown — no
              double-booking possible
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">📩</span>
              You&apos;ll receive a <strong>calendar invite</strong> and reminder
              email instantly
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">🔗</span>
              A <strong>Google Meet link</strong> is included in the invite
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function SchedulingPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Loading…</h1>
        </main>
      }
    >
      <SchedulingPageContent />
    </Suspense>
  );
}
