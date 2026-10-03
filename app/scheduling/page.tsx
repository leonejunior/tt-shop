"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ChevronRight, Video } from "lucide-react";

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

interface TimeSlot {
  value: string;
  display: string;
}

interface DateOption {
  value: string;
  display: string;
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    slots.push({ value: `${hour}:00`, display: `${displayHour}:00 ${period}` });
  }
  return slots;
};

const generateDates = (): DateOption[] => {
  const dates: DateOption[] = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push({
      value: date.toISOString().split("T")[0],
      display: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    });
  }
  return dates;
};

const timeSlots = generateTimeSlots();

function SchedulingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const readingSlug = searchParams.get("reading");

  const [bookingDetails] = useState<BookingDetails | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("bookingDetails");
    if (!stored) return null;
    return JSON.parse(stored) as BookingDetails;
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const dates = generateDates();

  if (!bookingDetails) {
    router.push(`/book?reading=${readingSlug ?? "the-glimpse"}`);
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Redirecting...</h1>
      </main>
    );
  }

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

    sessionStorage.setItem(
      "bookingSchedule",
      JSON.stringify({
        date: selectedDate,
        time: selectedTime,
        formattedDate: dates.find((d) => d.value === selectedDate)?.display,
        formattedTime: timeSlots.find((t) => t.value === selectedTime)?.display,
      }),
    );

    router.push(`/payment?reading=${readingSlug}`);
  };

  const isSchedulingForVIP = readingSlug === "vip-session";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Link
        href={`/book?reading=${readingSlug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to details
      </Link>

      <div className="mb-8 flex items-center gap-4 rounded-xl border border-border bg-background p-6 md:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Calendar size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Schedule Your {isSchedulingForVIP ? "VIP" : "Deep Dive"} Session
          </h1>
          <p className="text-muted-foreground">
            {bookingDetails.readingName} • Select a date and time for your live
            video call
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-1 items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            1
          </div>
          <div className="h-px flex-1 bg-primary" />
        </div>
        <div className="flex flex-1 items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            2
          </div>
          <div className="h-px flex-1 bg-primary" />
        </div>
        <div className="flex flex-1 items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            3
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6 md:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Video size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Choose Your Time
          </h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Select a date and time for your live video call. All times are in EST.
          You&apos;ll receive a Google Meet link in your confirmation email.
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Select Date
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {dates.map((date) => (
                <button
                  key={date.value}
                  type="button"
                  onClick={() => setSelectedDate(date.value)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    selectedDate === date.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {date.display}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Select Time
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setSelectedTime(slot.value)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    selectedTime === slot.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  <Clock size={14} className="mr-1 inline" />
                  {slot.display}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm text-foreground">
                <span className="font-medium">
                  Your{" "}
                  {isSchedulingForVIP ? "VIP session" : "Deep Dive video call"}{" "}
                  is scheduled for:
                </span>
                <br />
                {dates.find((d) => d.value === selectedDate)?.display} at{" "}
                {timeSlots.find((t) => t.value === selectedTime)?.display} EST
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                You&apos;ll receive a confirmation email with the Google Meet
                link within 24 hours.
                {isSchedulingForVIP &&
                  " A written summary will be emailed within 24 hours after our session."}
              </p>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Payment
            <ChevronRight size={16} />
          </button>
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
          <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
        </main>
      }
    >
      <SchedulingPageContent />
    </Suspense>
  );
}
