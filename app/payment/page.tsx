"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle2, CreditCard } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import type { OrderResponseBody } from "@paypal/paypal-js";

interface BookingDetails {
  reading: string;
  readingName: string;
  price: number;
  name: string;
  email: string;
  question: string;
  preferredFormat: string;
  deliveryTime: string;
}

interface ScheduleDetails {
  date: string;
  time: string;
  formattedDate: string;
  formattedTime: string;
}

function getSessionData<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(key);
  return stored ? (JSON.parse(stored) as T) : null;
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const readingSlug = searchParams.get("reading");

  const [bookingDetails] = useState<BookingDetails | null>(() =>
    getSessionData<BookingDetails>("bookingDetails"),
  );

  const [schedule] = useState<ScheduleDetails | null>(() =>
    getSessionData<ScheduleDetails>("bookingSchedule"),
  );

  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingDetails) {
    router.push(`/book?reading=${readingSlug ?? "the-glimpse"}`);
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Redirecting...</h1>
      </main>
    );
  }

  const hasSchedule = schedule !== null;

  const handlePayPalSuccess = async (details: OrderResponseBody) => {
    setIsProcessing(true);

    sessionStorage.setItem(
      "bookingConfirmation",
      JSON.stringify({
        ...bookingDetails,
        schedule,
        paymentDate: new Date().toISOString(),
        status: "confirmed",
        paymentMethod: "paypal",
        transactionId: details.id,
      }),
    );

    try {
      const response = await fetch("/api/payment-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: details.id,
          bookingDetails: { ...bookingDetails, schedule },
        }),
      });
      if (!response.ok) console.error("Email sending failed");
    } catch (error) {
      console.error("Email sending error:", error);
    }

    router.push(`/confirmation?reading=${readingSlug}`);
  };

  console.log("PayPal Client ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
      }}
    >
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
        <Link
          href={
            hasSchedule
              ? `/scheduling?reading=${readingSlug}`
              : `/book?reading=${readingSlug}`
          }
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary sm:mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:p-6 md:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-14 sm:w-14">
            <CreditCard size={24} className="sm:h-7 sm:w-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              Complete Your Booking
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Secure payment with PayPal • Your reading will begin after payment
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="flex flex-1 items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground sm:h-8 sm:w-8 sm:text-sm">
              1
            </div>
            <div className="h-px flex-1 bg-primary" />
          </div>
          {hasSchedule && (
            <div className="flex flex-1 items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground sm:h-8 sm:w-8 sm:text-sm">
                2
              </div>
              <div className="h-px flex-1 bg-primary" />
            </div>
          )}
          <div className="flex flex-1 items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground sm:h-8 sm:w-8 sm:text-sm">
              {hasSchedule ? 3 : 2}
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-1 items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground sm:h-8 sm:w-8 sm:text-sm">
              {hasSchedule ? 4 : 3}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="space-y-6 lg:w-2/3">
            <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
              <h2 className="mb-3 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
                Booking Summary
              </h2>
              <div className="space-y-2 text-xs sm:space-y-3 sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reading:</span>
                  <span className="font-medium text-foreground">
                    {bookingDetails.readingName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="text-foreground">{bookingDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="break-all text-foreground">
                    {bookingDetails.email}
                  </span>
                </div>

                {/* Show preferred format for Deep Dive */}
                {bookingDetails.preferredFormat &&
                  bookingDetails.reading === "deep-dive" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="text-foreground">
                        {bookingDetails.preferredFormat === "video"
                          ? "Video Call (Live 1:1 Session)"
                          : "Written Report"}
                      </span>
                    </div>
                  )}

                {schedule && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground">
                        {schedule.formattedDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="text-foreground">
                        {schedule.formattedTime} EST
                      </span>
                    </div>
                  </>
                )}

                {bookingDetails.deliveryTime !== "Scheduled" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="text-foreground">
                      Within {bookingDetails.deliveryTime}
                    </span>
                  </div>
                )}

                <div className="mt-2 border-t border-border pt-2 sm:mt-3 sm:pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">
                      ${bookingDetails.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
              <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-lg font-bold text-primary">P</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">PayPal</p>
                  <p className="text-xs text-muted-foreground">
                    Pay with your PayPal account or use a credit/debit card via
                    PayPal
                  </p>
                </div>
                <CheckCircle2 size={20} className="text-primary" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock size={12} />
                <span>Secure payment processing by PayPal</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-24 rounded-xl border border-border bg-background p-5 shadow-lg sm:p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">
                  ${bookingDetails.price.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {bookingDetails.deliveryTime === "Scheduled"
                    ? "Live video call session"
                    : `Delivery within ${bookingDetails.deliveryTime}`}
                </p>

                <div className="mt-4 sm:mt-6">
                  <div className="flex justify-center">
                    <div className="w-full max-w-70 sm:max-w-[320px]">
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "gold",
                          shape: "rect",
                          label: "pay",
                          height: 40,
                        }}
                        createOrder={(_data, actions) =>
                          actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: bookingDetails.price.toFixed(2),
                                },
                                description: `${bookingDetails.readingName} - ${bookingDetails.name}`,
                              },
                            ],
                          })
                        }
                        onApprove={async (_data, actions) => {
                          const details = await actions.order?.capture();
                          if (details) await handlePayPalSuccess(details);
                        }}
                        onError={(err) => {
                          console.error("PayPal error:", err);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  You&apos;ll receive a confirmation email with all details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PayPalScriptProvider>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
        </main>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
