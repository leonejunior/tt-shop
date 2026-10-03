"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Mail,
  Home,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";

interface ScheduleDetails {
  date?: string;
  time?: string;
  formattedDate: string;
  formattedTime: string;
}

interface BookingConfirmation {
  reading: string;
  readingName: string;
  price: number;
  name: string;
  email: string;
  question: string;
  preferredFormat: string;
  deliveryTime: string;
  schedule?: ScheduleDetails;
  paymentDate: string;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
}

const OFFICIAL_SENDER_EMAIL = "karmicapothecary@gmail.com";
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/karmicapothecary/new-meeting";

function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const txn = searchParams.get("txn");

  const [bookingDetails, setBookingDetails] = useState<BookingConfirmation | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("bookingConfirmation");
    return stored ? (JSON.parse(stored) as BookingConfirmation) : null;
  });

  const [isLoading, setIsLoading] = useState(() => !bookingDetails && Boolean(txn));
  const [copiedEmail, setCopiedEmail] = useState(false);

  // If sessionStorage is empty (e.g. page refreshed or opened in new tab), look up from Cloudflare D1
  useEffect(() => {
    let isMounted = true;
    if (!bookingDetails && txn) {
      fetch(`/api/orders/lookup?txn=${encodeURIComponent(txn)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Order not found");
          return res.json() as Promise<{ order?: BookingConfirmation }>;
        })
        .then((data) => {
          if (isMounted && data.order) {
            setBookingDetails(data.order);
            sessionStorage.setItem("bookingConfirmation", JSON.stringify(data.order));
          }
        })
        .catch((err) => {
          console.error("Order lookup error:", err);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [bookingDetails, txn]);

  const copySenderEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_SENDER_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-12">
          <Loader2 size={36} className="animate-spin text-primary" />
          <h1 className="mt-4 text-xl font-semibold text-foreground">
            Loading your booking confirmation...
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Retrieving verified order from database
          </p>
        </div>
      </main>
    );
  }

  if (!bookingDetails) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="rounded-xl border border-border bg-background p-8">
          <h1 className="text-2xl font-bold text-foreground">
            No booking found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t find an active booking session. If you recently completed a payment, please check your email for your confirmation receipt.
          </p>
          <Link
            href="/readings"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Browse Readings
          </Link>
        </div>
      </main>
    );
  }

  const isVip = bookingDetails.readingName.toLowerCase().includes("vip");
  const isDeepDiveVideo =
    bookingDetails.readingName.toLowerCase().includes("deep dive") &&
    bookingDetails.preferredFormat === "video";
  const needsCalendlyScheduling = isVip || isDeepDiveVideo;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="rounded-2xl border border-border bg-background p-8 text-center shadow-sm md:p-12">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 size={44} />
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-foreground md:text-3xl">
          Booking Confirmed! ✨
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your <strong className="font-semibold text-foreground">{bookingDetails.readingName}</strong> has been secured and recorded.
        </p>

        {bookingDetails.paymentMethod && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Paid via PayPal
            {bookingDetails.transactionId && (
              <span className="font-mono"> • ID: {bookingDetails.transactionId}</span>
            )}
          </p>
        )}

        {/* Live Call Scheduling CTA for VIP & Deep Dive Video */}
        {needsCalendlyScheduling && (
          <div className="mt-8 rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <Calendar size={22} className="mt-0.5 shrink-0 text-primary" />
              <div className="flex-1">
                <h2 className="text-base font-semibold text-foreground">
                  Step 2: Pick Your Time on the Live Calendar
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a slot that fits your schedule. Calendly will automatically convert to your local timezone and send your Google Meet invite.
                </p>
                <div className="mt-4">
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
                  >
                    <span>Schedule on Calendly</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What happens next box */}
        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 text-left">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            What happens next?
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Check your email</p>
                <p className="text-muted-foreground">
                  A receipt and full booking summary has been sent to{" "}
                  <span className="font-medium text-foreground">
                    {bookingDetails.email}
                  </span>
                </p>

                {/* Whitelist Warning Box with Correct Email */}
                <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-foreground">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900 dark:text-amber-200">
                        📬 Important: Whitelist Our Email
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Your reading, booking confirmation, and session links are sent directly from:
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded bg-background/80 px-2.5 py-1 font-mono font-semibold text-foreground border border-border">
                          {OFFICIAL_SENDER_EMAIL}
                        </span>
                        <button
                          type="button"
                          onClick={copySenderEmail}
                          className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                        >
                          {copiedEmail ? (
                            <>
                              <Check size={13} className="text-green-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        Add this address to your contacts or mark it as &ldquo;Not Spam&rdquo; so your reading is never lost in junk or spam folders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!needsCalendlyScheduling && (
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Your reading is in progress
                  </p>
                  <p className="text-muted-foreground">
                    Karma is preparing your personalized reading ({bookingDetails.preferredFormat} format). You will receive it within{" "}
                    <strong className="font-medium text-foreground">{bookingDetails.deliveryTime}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/readings"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow"
          >
            <Sparkles size={16} />
            Browse More Readings
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Have questions or need assistance?{" "}
          <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact Karma
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-12">
            <Loader2 size={36} className="animate-spin text-primary" />
            <h1 className="mt-4 text-xl font-semibold text-foreground">
              Loading confirmation...
            </h1>
          </div>
        </main>
      }
    >
      <ConfirmationPageContent />
    </Suspense>
  );
}
