"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { getReadingBySlug } from "@/lib/readings";

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
  const [processingStep, setProcessingStep] = useState<0 | 1 | 2>(0);
  const [errorMessage, setErrorMessage] = useState("");

  if (!bookingDetails) {
    router.push(`/book?reading=${readingSlug ?? "the-glimpse"}`);
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Redirecting...</h1>
      </main>
    );
  }

  // Server-verified reading package & pricing
  const verifiedReading = getReadingBySlug(bookingDetails.reading);
  const hasSchedule = schedule !== null;
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <main className="relative mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
        {/* ── Processing Overlay ──────────────────────────────────────────
             Shown while capture-order API call is in flight (2-4 seconds).
             Three animated steps prevent user from thinking nothing happened.
             beforeunload is registered in onApprove to guard against refresh.
        ─────────────────────────────────────────────────────────────────── */}
        {isProcessing && (() => {
          const steps = [
            { icon: "🔒", label: "Verifying payment with PayPal" },
            { icon: "📋", label: "Securing your booking" },
            { icon: "✉️",  label: "Sending your confirmation email" },
          ];
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
              <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">

                {/* Pulsing icon */}
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                  <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-primary/20" />
                  <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-primary/10" style={{ animationDelay: "0.3s" }} />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 size={28} className="animate-spin text-primary" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-foreground">Processing Payment</h2>
                <p className="mt-1 text-xs text-amber-600 font-medium">
                  ⚠️ Please don&apos;t close, refresh, or navigate away
                </p>

                {/* Step indicators */}
                <div className="mt-6 space-y-3 text-left">
                  {steps.map((step, i) => {
                    const done   = processingStep > i;
                    const active = processingStep === i;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-500 ${
                          active  ? "bg-primary/10 text-foreground font-medium" :
                          done    ? "opacity-60 text-muted-foreground" :
                          "opacity-30 text-muted-foreground"
                        }`}
                      >
                        <span className="shrink-0 text-base">
                          {done   ? "✅" :
                           active ? step.icon :
                                    "⬜"}
                        </span>
                        <span className="flex-1">{step.label}</span>
                        {active && (
                          <Loader2 size={14} className="animate-spin shrink-0 text-primary" />
                        )}
                        {done && (
                          <CheckCircle2 size={14} className="shrink-0 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Security badge */}
                <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70">
                  <ShieldCheck size={13} className="text-primary" />
                  <span>256-bit SSL encrypted checkout</span>
                </div>
              </div>
            </div>
          );
        })()}

        <Link
          href={
            hasSchedule
              ? `/scheduling?reading=${readingSlug}`
              : `/book?reading=${readingSlug}`
          }
          aria-disabled={isProcessing}
          tabIndex={isProcessing ? -1 : 0}
          onClick={(e) => { if (isProcessing) e.preventDefault(); }}
          className={`mb-4 inline-flex items-center gap-1 text-sm transition-colors sm:mb-6 ${
            isProcessing
              ? "pointer-events-none text-muted-foreground/30"
              : "text-muted-foreground hover:text-primary"
          }`}
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

        {/* Progress Steps (always 3: Details → Payment → Confirmation) */}
        <div className="mb-6 flex items-center sm:mb-8">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground sm:h-8 sm:w-8 sm:text-sm">1</div>
          <div className="h-px flex-1 bg-primary" />
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground sm:h-8 sm:w-8 sm:text-sm">2</div>
          <div className="h-px flex-1 bg-border" />
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground sm:h-8 sm:w-8 sm:text-sm">3</div>
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
                    {verifiedReading.name}
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

                {verifiedReading.deliveryTime !== "Scheduled" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="text-foreground">
                      Within {verifiedReading.deliveryTime}
                    </span>
                  </div>
                )}

                <div className="mt-2 border-t border-border pt-2 sm:mt-3 sm:pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-primary font-bold">
                      ${verifiedReading.price.toFixed(2)}
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
                    Pay with your PayPal account or use a debit/credit card via PayPal
                  </p>
                </div>
                <CheckCircle2 size={20} className="text-primary" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock size={12} />
                <span>Verified server-side secure payment processing</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-24 rounded-xl border border-border bg-background p-5 shadow-lg sm:p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">
                  ${verifiedReading.price.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {verifiedReading.deliveryTime === "Scheduled"
                    ? "Live video call session"
                    : `Delivery within ${verifiedReading.deliveryTime}`}
                </p>

                {/* Inline Error Message */}
                {errorMessage && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-left text-xs text-destructive">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

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
                        disabled={isProcessing}
                        createOrder={async () => {
                          setErrorMessage("");
                          try {
                            const res = await fetch("/api/paypal/create-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                readingSlug: verifiedReading.slug,
                              }),
                            });
                            const data = (await res.json()) as {
                              orderId?: string;
                              error?: string;
                            };
                            if (!res.ok || !data.orderId) {
                              throw new Error(
                                data.error || "Failed to initialize secure order.",
                              );
                            }
                            return data.orderId;
                          } catch (err) {
                            const msg =
                              err instanceof Error
                                ? err.message
                                : "Unable to initiate payment.";
                            setErrorMessage(msg);
                            throw err;
                          }
                        }}
                        onApprove={async (data) => {
                          // Guard against refresh/close during the critical payment window
                          const handleUnload = (e: BeforeUnloadEvent) => {
                            e.preventDefault();
                          };
                          window.addEventListener("beforeunload", handleUnload);

                          setIsProcessing(true);
                          setProcessingStep(0); // "Verifying payment with PayPal"
                          setErrorMessage("");

                          try {
                            const res = await fetch("/api/paypal/capture-order", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                orderId: data.orderID,
                                readingSlug: verifiedReading.slug,
                                bookingDetails: {
                                  ...bookingDetails,
                                  price: verifiedReading.price,
                                  readingName: verifiedReading.name,
                                  schedule,
                                },
                              }),
                            });

                            setProcessingStep(1); // "Securing your booking"

                            const captureResult = (await res.json()) as {
                              success?: boolean;
                              error?: string;
                              transactionId?: string;
                            };
                            if (!res.ok || !captureResult.success) {
                              throw new Error(
                                captureResult.error || "Payment verification failed",
                              );
                            }

                            setProcessingStep(2); // "Sending your confirmation email"

                            // Save confirmed booking in session storage for the confirmation receipt
                            sessionStorage.setItem(
                              "bookingConfirmation",
                              JSON.stringify({
                                ...bookingDetails,
                                price: verifiedReading.price,
                                readingName: verifiedReading.name,
                                schedule,
                                paymentDate: new Date().toISOString(),
                                status: "confirmed",
                                paymentMethod: "paypal",
                                transactionId: captureResult.transactionId,
                              }),
                            );

                            // Brief pause so the user sees the final step complete
                            await new Promise((r) => setTimeout(r, 700));

                            window.removeEventListener("beforeunload", handleUnload);
                            router.push(
                              `/confirmation?reading=${verifiedReading.slug}&txn=${captureResult.transactionId}`,
                            );
                          } catch (err) {
                            window.removeEventListener("beforeunload", handleUnload);
                            console.error("Payment capture error:", err);
                            const msg =
                              err instanceof Error
                                ? err.message
                                : "Payment verification failed. Please contact support.";
                            setErrorMessage(msg);
                            setIsProcessing(false);
                            setProcessingStep(0);
                          }
                        }}
                        onError={(err) => {
                          console.error("PayPal error:", err);
                          setErrorMessage(
                            "PayPal encountered an error. Please try again.",
                          );
                          setIsProcessing(false);
                        }}
                        onCancel={() => {
                          setErrorMessage("Payment was cancelled.");
                          setIsProcessing(false);
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
