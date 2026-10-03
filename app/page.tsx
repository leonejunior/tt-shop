import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Heart, Compass, Crown } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-background via-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-32">
          <div className="grid gap-8 md:gap-12 lg:gap-16 md:grid-cols-2">
            {/* Hero Text */}
            <div className="flex flex-col justify-center text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-6xl">
                Clarity When You
                <span className="block text-primary">Need It Most</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg lg:text-xl">
                Tarot readings for love, life, and everything in between.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-start md:justify-start">
                <Link
                  href="/readings"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-6 sm:py-3"
                >
                  Explore Readings
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:px-6 sm:py-3"
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary/20 bg-muted md:h-80 md:w-80 lg:h-96 lg:w-96">
                {/* Replace with actual creator photo */}
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
                  <span className="text-4xl text-muted-foreground"></span>
                </div>
                {/* Uncomment when you have the image: */}
                <Image
                  src="/images/image1.webp"
                  alt="Karma - Tarot Reader"
                  fill
                  sizes="(max-width: 768px) 224px, (max-width: 1024px) 320px, 384px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Short Intro Section - Reduced spacing for mobile */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 lg:py-16">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            Hi, I&apos;m Karma. 👋
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-base lg:text-lg">
            I&apos;ve been reading tarot for over 8 years, helping hundreds find
            clarity in love, career, and life&apos;s big questions. Whether
            you&apos;re heartbroken, curious, or standing at a crossroads—
            I&apos;m here to help you see what&apos;s not being seen.
          </p>
          <div className="mt-4 flex justify-center gap-1">
            <Sparkles size={16} className="text-primary" />
            <Sparkles size={16} className="text-primary/70" />
            <Sparkles size={16} className="text-primary/40" />
          </div>
        </div>
      </section>

      {/* Services Snapshot Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            Choose Your Reading
          </h2>
          <p className="mt-1 text-sm text-muted-foreground md:mt-2">
            Trust your intuition. Pick what feels right.
          </p>
        </div>

        <div className="grid gap-5 md:gap-6 lg:gap-6 md:grid-cols-3">
          {/* The Glimpse */}
          <div className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-lg md:p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary md:mb-4 md:h-12 md:w-12">
              <Sparkles size={20} className="md:h-6 md:w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground md:text-xl">
              The Glimpse
            </h3>
            <p className="mt-1 text-xl font-bold text-primary md:text-2xl">
              $11.11
            </p>
            <p className="mt-2 text-xs text-muted-foreground md:text-sm">
              2 burning questions. 5 cards. Clarity delivered within 24-48
              hours. Your gentle introduction to tarot.
            </p>
            <Link
              href="/readings/the-glimpse"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline md:mt-4 md:text-sm"
            >
              Learn More
              <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
            </Link>
          </div>

          {/* The Heart Compass */}
          <div className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-lg md:p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary md:mb-4 md:h-12 md:w-12">
              <Heart size={20} className="md:h-6 md:w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground md:text-xl">
              The Heart Compass
            </h3>
            <p className="mt-1 text-xl font-bold text-primary md:text-2xl">
              $22.22
            </p>
            <p className="mt-2 text-xs text-muted-foreground md:text-sm">
              Love questions answered. 3-4 related questions. 5-7 cards. Clarity
              on your heart&apos;s path within 24 hours.
            </p>
            <Link
              href="/readings/heart-compass"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline md:mt-4 md:text-sm"
            >
              Learn More
              <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
            </Link>
          </div>

          {/* The Deep Dive */}
          <div className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-lg md:p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary md:mb-4 md:h-12 md:w-12">
              <Compass size={20} className="md:h-6 md:w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground md:text-xl">
              The Deep Dive
            </h3>
            <p className="mt-1 text-xl font-bold text-primary md:text-2xl">
              $44.44
            </p>
            <p className="mt-2 text-xs text-muted-foreground md:text-sm">
              4-6 related questions. 10-12 cards across 2-3 spreads. Complete
              clarity within 48 hours.
            </p>
            <Link
              href="/readings/deep-dive"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline md:mt-4 md:text-sm"
            >
              Learn More
              <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
            </Link>
          </div>
        </div>

        {/* VIP Session - Premium Option */}
        <div className="mt-6 rounded-xl border-2 border-primary/30 bg-linear-to-r from-primary/5 to-transparent p-5 md:mt-8 md:p-6 lg:p-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground md:h-12 md:w-12">
                <Crown size={20} className="md:h-6 md:w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground md:text-xl">
                  The VIP Session
                </h3>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Leave no stone unturned. 60-90 minute live session. Ask
                  anything. Receive everything. Written summary included.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <p className="text-xl font-bold text-primary md:text-2xl">
                $77.77
              </p>
              <Link
                href="/readings/vip-session"
                className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:px-5 md:py-2 md:text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-xl font-semibold text-foreground md:mb-10 md:text-2xl lg:text-3xl">
            What Clients Are Saying
          </h2>
          <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Sarah's Testimonial */}
            <div className="rounded-xl border border-border bg-background p-5 md:p-6">
              <p className="text-sm text-muted-foreground md:text-base">
                &quot;Karma&apos;s reading gave me the clarity I needed to
                finally move forward. I&apos;m so grateful.&quot;
              </p>
              <div className="mt-3 flex items-center gap-2 md:mt-4">
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-primary/20 md:h-8 md:w-8">
                  <Image
                    src="/images/Sarah.webp"
                    alt="Sarah"
                    fill
                    sizes="(max-width: 768px) 28px, 32px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground md:text-sm">
                    Sarah
                  </p>
                  <p className="text-[10px] text-muted-foreground md:text-xs">
                    The Glimpse
                  </p>
                </div>
              </div>
            </div>

            {/* Michael's Testimonial */}
            <div className="rounded-xl border border-border bg-background p-5 md:p-6">
              <p className="text-sm text-muted-foreground md:text-base">
                &quot;I was skeptical at first, but her reading was incredibly
                accurate. It helped me make a decision I&apos;d been avoiding
                for months.&quot;
              </p>
              <div className="mt-3 flex items-center gap-2 md:mt-4">
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-primary/20 md:h-8 md:w-8">
                  <Image
                    src="/images/Michael.webp"
                    alt="Michael"
                    fill
                    sizes="(max-width: 768px) 28px, 32px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground md:text-sm">
                    Michael
                  </p>
                  <p className="text-[10px] text-muted-foreground md:text-xs">
                    The Deep Dive
                  </p>
                </div>
              </div>
            </div>

            {/* Jessica's Testimonial */}
            <div className="rounded-xl border border-border bg-background p-5 md:p-6">
              <p className="text-sm text-muted-foreground md:text-base">
                &quot;The Heart Compass reading was spot on. She picked up on
                things I had&apos;t even told her. Highly recommend.&quot;
              </p>
              <div className="mt-3 flex items-center gap-2 md:mt-4">
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-primary/20 md:h-8 md:w-8">
                  <Image
                    src="/images/Jessica.webp"
                    alt="Jessica"
                    fill
                    sizes="(max-width: 768px) 28px, 32px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground md:text-sm">
                    Jessica
                  </p>
                  <p className="text-[10px] text-muted-foreground md:text-xs">
                    The Heart Compass
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 lg:py-20">
        <h2 className="mb-8 text-center text-xl font-semibold text-foreground md:mb-10 md:text-2xl lg:text-3xl">
          How It Works
        </h2>
        <div className="grid gap-6 md:gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground md:mb-4 md:h-12 md:w-12 md:text-base">
              1
            </div>
            <h3 className="text-sm font-semibold text-foreground md:text-base">
              Choose Your Reading
            </h3>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Browse the offerings and pick what feels right
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground md:mb-4 md:h-12 md:w-12 md:text-base">
              2
            </div>
            <h3 className="text-sm font-semibold text-foreground md:text-base">
              Book Your Time
            </h3>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Select a time that works for you
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground md:mb-4 md:h-12 md:w-12 md:text-base">
              3
            </div>
            <h3 className="text-sm font-semibold text-foreground md:text-base">
              Share Your Question
            </h3>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Tell me what you need clarity on
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground md:mb-4 md:h-12 md:w-12 md:text-base">
              4
            </div>
            <h3 className="text-sm font-semibold text-foreground md:text-base">
              Receive Clarity
            </h3>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Get your reading and walk away with answers
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-primary/5 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            Ready for Clarity?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Your answers are waiting. Trust the pull.
          </p>
          <Link
            href="/readings"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:mt-6 md:px-8 md:py-3"
          >
            Find Your Clarity
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
