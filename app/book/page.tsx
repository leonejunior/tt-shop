"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Heart,
  Compass,
  Crown,
  ChevronRight,
} from "lucide-react";

type ReadingSlug =
  | "the-glimpse"
  | "heart-compass"
  | "deep-dive"
  | "vip-session";

interface ReadingData {
  name: string;
  price: number;
  icon: React.ElementType;
  format: string;
  deliveryTime: string;
  questions: string;
  questionHint: string;
  showFormatSelector: boolean;
}

const readingsData: Record<ReadingSlug, ReadingData> = {
  "the-glimpse": {
    name: "The Glimpse",
    price: 11.11,
    icon: Sparkles,
    format: "Voice Note",
    deliveryTime: "24-48 hours",
    questions: "2 questions",
    questionHint:
      "You can ask up to 2 questions. Keep them focused on one situation or topic for the clearest insight.",
    showFormatSelector: false,
  },
  "heart-compass": {
    name: "The Heart Compass",
    price: 22.22,
    icon: Heart,
    format: "Voice Note",
    deliveryTime: "24 hours",
    questions: "3-4 related questions",
    questionHint:
      "Ask 3-4 related questions about your love situation. The more context you share, the clearer the reading.",
    showFormatSelector: false,
  },
  "deep-dive": {
    name: "The Deep Dive",
    price: 44.44,
    icon: Compass,
    format: "Video Call or Written Report",
    deliveryTime: "48 hours",
    questions: "4-6 related questions",
    questionHint:
      "You can ask 4-6 related questions about your situation. Choose your preferred format below.",
    showFormatSelector: true,
  },
  "vip-session": {
    name: "The VIP Session",
    price: 77.77,
    icon: Crown,
    format: "Video Call Only",
    deliveryTime: "Scheduled",
    questions: "Unlimited",
    questionHint:
      "Ask anything! After payment you'll receive a Calendly link to pick your preferred session date and time.",
    showFormatSelector: false,
  },
};

const isValidReadingSlug = (slug: string | null): slug is ReadingSlug =>
  slug !== null && slug in readingsData;

// Component that uses useSearchParams
function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const readingSlug = searchParams.get("reading");

  const reading = isValidReadingSlug(readingSlug)
    ? readingsData[readingSlug]
    : readingsData["the-glimpse"];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
    preferredFormat: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sessionStorage.setItem(
      "bookingDetails",
      JSON.stringify({
        reading: readingSlug,
        readingName: reading.name,
        price: reading.price,
        name: formData.name,
        email: formData.email,
        question: formData.question,
        preferredFormat: formData.preferredFormat,
        deliveryTime: reading.deliveryTime,
      }),
    );

    // All readings go directly to payment.
    // VIP and Deep Dive (video) clients receive a Calendly scheduling link
    // in their post-payment confirmation email to book their real session time.
    router.push(`/payment?reading=${readingSlug}`);
  };

  const isFormValid = () => {
    if (!formData.name || !formData.email || !formData.question) return false;

    // For Deep Dive, format selection is required
    if (reading.showFormatSelector && !formData.preferredFormat) return false;

    return true;
  };

  const IconComponent = reading.icon;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      {/* Back Link */}
      <Link
        href={`/readings/${readingSlug || "the-glimpse"}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to {reading.name}
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-center gap-4 rounded-xl border border-border bg-background p-6 md:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary md:h-16 md:w-16">
          <IconComponent size={28} className="md:h-8 md:w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Book Your Reading
          </h1>
          <p className="text-muted-foreground">
            {reading.name} • ${reading.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress Steps — Step 1 active */}
      <div className="mb-8 flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          1
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
          2
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
          3
        </div>
      </div>

      {/* Details Form */}
      <div className="rounded-xl border border-border bg-background p-6 md:p-8">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Your Details
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          This information is confidential and will only be used for your
          reading.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="How should I address you?"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Where to send your reading"
            />
          </div>

          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-foreground"
            >
              Your Question(s)
            </label>
            <textarea
              id="question"
              rows={4}
              value={formData.question}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={`Tell me what you need clarity on. ${reading.questions}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              ✨ {reading.questionHint}
            </p>
          </div>

          {/* Format Selector - Only for Deep Dive */}
          {reading.showFormatSelector && (
            <div>
              <label
                htmlFor="preferredFormat"
                className="block text-sm font-medium text-foreground"
              >
                Preferred Format
              </label>
              <select
                id="preferredFormat"
                value={formData.preferredFormat}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a format</option>
                <option value="video">Video Call (Live 1:1 Session)</option>
                <option value="written">
                  Written Report (Detailed Document)
                </option>
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                ✨ Video calls are live 1:1 sessions where we connect in
                real-time. Written reports are detailed documents you can
                reference later.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
            <ChevronRight size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}

// Wrap with Suspense boundary
export default function BookPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
        </main>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
