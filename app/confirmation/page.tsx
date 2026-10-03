"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Calendar, Mail, Home, AlertCircle, Loader2 } from "lucide-react";

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

function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const txn = searchParams.get("txn");

  const [bookingDetails, setBookingDetails] = useState<BookingConfirmation | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("bookingConfirmation");
    return stored ? (JSON.parse(stored) as BookingConfirmation) : null;
  });

  const [isLoading, setIsLoading] = useState(() => !bookingDetails && Boolean(txn));

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

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="rounded-xl border border-border bg-background p-8 text-center md:p-12">
        <div className="flex justify-center">
          <CheckCircle2 size={64} className="text-primary" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
          Booking Confirmed! ✨
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your {bookingDetails.readingName} has been successfully booked and recorded.
        </p>

        {bookingDetails.paymentMethod && (
          <p className="mt-1 text-xs text-muted-foreground">
            Paid via PayPal
            {bookingDetails.transactionId &&
              ` • Transaction ID: ${bookingDetails.transactionId}`}
          </p>
        )}

        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6 text-left">
          <h2 className="mb-4 font-semibold text-foreground">
            What happens next?
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-foreground">Check your email</p>
                <p className="text-muted-foreground">
                  A confirmation has been sent to{" "}
                  <span className="text-foreground font-medium">
                    {bookingDetails.email}
                  </span>
                </p>
                <div className="mt-2 flex items-start gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <p>
                    💌 <span className="font-medium">Tip:</span> If you
                    don&apos;t see the email in your inbox within a few minutes,
                    please check your{" "}
                    <span className="font-medium">spam or junk folder</span>.
                    Adding{" "}
                    <span className="font-medium font-mono">karmicapothecary@gmail.com</span> to
                    your contacts helps ensure future emails land in your inbox.
                  </p>
                </div>
              </div>
            </div>

            {bookingDetails.schedule ? (
              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    Your session is scheduled
                  </p>
                  <p className="text-muted-foreground">
                    {bookingDetails.schedule.formattedDate} at{" "}
                    {bookingDetails.schedule.formattedTime} EST
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    A Google Meet link will be sent in your confirmation email.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    Your reading is in progress
                  </p>
                  <p className="text-muted-foreground">
                    You&apos;ll receive your reading within{" "}
                    {bookingDetails.deliveryTime}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/readings"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home size={16} />
            Browse More Readings
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Have questions?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact me
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
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
        </main>
      }
    >
      <ConfirmationPageContent />
    </Suspense>
  );
}
