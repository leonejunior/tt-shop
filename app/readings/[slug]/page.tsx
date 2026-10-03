import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  READINGS_CATALOG,
  READINGS_LIST,
  isValidReadingSlug,
} from "@/lib/readings";

// Generate static params for all readings (for better performance)
export async function generateStaticParams() {
  return READINGS_LIST.map((reading) => ({
    slug: reading.slug,
  }));
}

// The page component
export default async function ReadingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // If the slug doesn't match any reading, show 404
  if (!isValidReadingSlug(slug)) {
    notFound();
  }

  const reading = READINGS_CATALOG[slug];
  const IconComponent = reading.icon;
  const FormatIcon = reading.formatIcon;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12 lg:py-16">
      {/* Back Button */}
      <Link
        href="/readings"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary md:mb-8"
      >
        <ArrowLeft size={16} />
        Back to all readings
      </Link>

      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary md:h-16 md:w-16">
            <IconComponent size={28} className="md:h-8 md:w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              {reading.name}
            </h1>
            <p className="text-2xl font-semibold text-primary md:text-3xl">
              {reading.priceFormatted}
            </p>
          </div>
        </div>

        {/* Key Info Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
            <Clock size={14} />
            <span>{reading.duration}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
            <FormatIcon size={14} />
            <span>{reading.format}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
            <MessageSquare size={14} />
            <span>{reading.questions}</span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="mb-8 rounded-xl border-l-4 border-primary bg-primary/5 p-4 md:p-5">
        <p className="text-base italic text-foreground md:text-lg">
          &quot;{reading.tagline}&quot;
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {/* Left Column - Main Description & Details */}
        <div className="lg:col-span-2">
          {/* Description */}
          <div className="prose prose-gray max-w-none">
            {reading.description.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          {/* What You Get */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground md:text-2xl">
              ✦ What You Get ✦
            </h2>
            <ul className="space-y-2">
              {reading.whatYouGet.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Perfect For */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground md:text-2xl">
              💫 Perfect For
            </h2>
            <ul className="space-y-2">
              {reading.perfectFor.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <span className="text-primary">❤️</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How It Works */}
          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5 md:p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground md:text-2xl">
              📖 How It Works
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {reading.howItWorks.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              After payment, you&apos;ll receive a confirmation email with
              instructions.
            </p>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-background p-5 shadow-lg md:p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">
                {reading.priceFormatted}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {reading.format} • {reading.deliveryTime}
              </p>
              <Link
                href={`/book?reading=${slug}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Book This Reading
                <ArrowLeft size={16} className="rotate-180" />
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">
                Secure payment via PayPal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 border-t border-border pt-8 md:mt-16 md:pt-12">
        <h2 className="mb-6 text-center text-xl font-semibold text-foreground md:text-2xl">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {reading.faq.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-background p-4 md:p-5"
            >
              <h3 className="font-medium text-foreground">{item.q}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Need Help Section */}
      <div className="mt-10 rounded-xl bg-primary/5 p-5 text-center md:p-6">
        <h3 className="font-medium text-foreground">Still have questions?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          I&apos;m happy to help you choose the right reading for your
          situation.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Contact me
          <ArrowLeft size={14} className="rotate-180" />
        </Link>
      </div>
    </main>
  );
}
