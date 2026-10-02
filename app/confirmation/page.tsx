"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Calendar, Mail, Home, AlertCircle } from "lucide-react";

interface ScheduleDetails {
  date: string;
  time: string;
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
  const readingSlug = searchParams.get("reading");

  const [bookingDetails] = useState<BookingConfirmation | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("bookingConfirmation");
    return stored ? (JSON.parse(stored) as BookingConfirmation) : null;
  });

  if (!bookingDetails) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="rounded-xl border border-border bg-background p-8">
          <h1 className="text-2xl font-bold text-foreground">
            No booking found
          </h1>
          <Link
            href="/readings"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
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
          Your {bookingDetails.readingName} has been successfully booked.
        </p>

        {bookingDetails.paymentMethod && (
          <p className="mt-1 text-xs text-muted-foreground">
            Paid via{" "}
            {bookingDetails.paymentMethod === "stripe"
              ? "credit card"
              : "PayPal"}
            {bookingDetails.transactionId &&
              ` • Transaction ID: ${bookingDetails.transactionId.slice(-8)}`}
          </p>
        )}

        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6 text-left">
          <h2 className="mb-4 font-semibold text-foreground">
            What happens next?
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Check your email</p>
                <p className="text-muted-foreground">
                  A confirmation has been sent to{" "}
                  <span className="text-foreground">
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
                    Sometimes our messages like to hide there! Adding
                    hello@karmasapothecary.com to your contacts helps ensure
                    future emails land in your inbox.
                  </p>
                </div>
              </div>
            </div>

            {bookingDetails.schedule ? (
              <div className="flex items-start gap-3">
                <Calendar size={18} className="mt-0.5 text-primary" />
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
                <Calendar size={18} className="mt-0.5 text-primary" />
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
