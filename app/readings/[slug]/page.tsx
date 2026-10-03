import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Heart,
  Compass,
  Crown,
  CheckCircle2,
  Clock,
  MessageSquare,
  Video,
  Headphones,
} from "lucide-react";

// Define your reading packages data
const readingsData = {
  "the-glimpse": {
    name: "The Glimpse",
    price: 11.11,
    icon: Sparkles,
    tagline: "New here? Start with a glimpse.",
    duration: "24-48 hour delivery",
    format: "Voice note",
    questions: "2 questions",
    deliveryTime: "24-48 hours",
    formatIcon: Headphones,
    description: `Perfect if you're curious about tarot but not ready for a full session. Pick up to 2 burning questions—about love, career, or life direction—and I'll pull 5 cards to give you clarity.

This reading is designed to be quick, affordable, and insightful. It's ideal for those moments when you just need a sign or a nudge in the right direction.`,
    thisIsForYou: [
      "You've never had a reading before",
      "You want to see if my energy vibes with yours",
      "You have 1-2 specific questions nagging at you",
      "You want answers without a big time commitment",
    ],
    whatYouGet: [
      "5-card tarot pull focused on your questions",
      "Voice note delivery (5-10 minutes)",
      "1-2 questions answered with clarity and honesty",
      "Delivery within 24-48 hours",
    ],
    perfectFor: [
      '"Does he miss me?"',
      '"Should I take the job?"',
      '"What\'s coming up for me?"',
      "First-time tarot experience",
      '"How does he feel about me?"',
    ],
    howItWorks: [
      "Click 'Book This Reading' below",
      "Share your questions in the order notes at checkout",
      "I'll tap in and record your reading",
      "You receive your voice note within 24-48 hours",
    ],
    faq: [
      {
        q: "What if I have more than two questions?",
        a: "This reading is for up to 2 questions. For more questions, consider The Deep Dive.",
      },
      {
        q: "Is this live or recorded?",
        a: "Recorded. You'll receive a private voice note via email.",
      },
      {
        q: "What if I don't like the reading?",
        a: "Contact me within 48 hours and I'll make it right.",
      },
      {
        q: "How detailed should my questions be?",
        a: "The more context you share, the clearer the reading. Feel free to share names, situations, and what's weighing on you.",
      },
    ],
  },
  "heart-compass": {
    name: "The Heart Compass",
    price: 22.22,
    icon: Heart,
    tagline: "Looking to know what's next in love?",
    duration: "24 hour delivery",
    format: "Voice note",
    questions: "3-4 related questions",
    deliveryTime: "24 hours",
    formatIcon: Headphones,
    description: `You've come to the right place. We all LOVE love, but it can be a bit messy at times. I'm here to bring forth some clarity and help calm those nerves.

This reading is designed for one specific love situation—whether it's a situationship, no-contact separation, or someone you can't stop thinking about. I'll tap in and give you a sneak peek at what's not being seen in the present.`,
    thisIsForYou: [
      "You're navigating a confusing love situation",
      "You can't stop thinking about someone",
      "You need clarity on where things are headed",
      "You're healing from heartbreak",
    ],
    whatYouGet: [
      "Multi-card spread (5-7 cards) focused on your love situation",
      "Voice note delivery (10-15 minutes)",
      "3-4 related questions answered with honesty and compassion",
      "Guidance on what to do next",
    ],
    perfectFor: [
      '"Does he miss me?"',
      '"How does they really feel?"',
      '"What\'s next for us?"',
      '"Should I reach out?"',
      '"Is there someone new coming in?"',
    ],
    howItWorks: [
      "Click 'Book This Reading' below",
      "Share your questions and any context in the order notes",
      "I'll tune into your energy and pull cards",
      "You receive your voice note within 24 hours",
    ],
    faq: [
      {
        q: "Can I ask about an ex?",
        a: "Yes. This reading is perfect for ex, twin flame, or current partner questions.",
      },
      {
        q: "What if my situation is complicated?",
        a: "The more context you share, the clearer the reading. If it's very complex, consider The Deep Dive.",
      },
      {
        q: "Will you tell me what I want to hear?",
        a: "No. I give honest, compassionate truth—not just what you want to hear.",
      },
      {
        q: "Can I ask about multiple people?",
        a: "This reading is best focused on one main love situation. For multiple people or topics, consider The Deep Dive.",
      },
    ],
  },
  "deep-dive": {
    name: "The Deep Dive",
    price: 44.44,
    icon: Compass,
    tagline: "Feel like you need more clarity than a basic read can deliver?",
    duration: "48 hour delivery",
    format: "Video call or written report",
    questions: "4-6 related questions",
    deliveryTime: "48 hours",
    formatIcon: Video,
    description: `The Deep Dive is for situations that have layers—where one question leads to another, and you need someone to help you untangle it all.

This isn't a quick yes/no. This is a virtual deep exploration of every corner of what's weighing on you. I'll pull multiple spreads, follow the energy where it leads, and make sure you walk away with real understanding.`,
    thisIsForYou: [
      "Your situation has many moving parts",
      "You've been stuck in the same pattern for a while",
      "You have 4-6 related questions",
      "You're ready to go deeper than surface-level answers",
    ],
    whatYouGet: [
      "10-12 cards across 2-3 spreads for deeper insight",
      "Exploration of 4-6 related questions on one topic",
      "Video call or written report (20-45 minutes)",
      "Practical guidance you can actually use",
      "One follow-up question included if something needs clarification",
    ],
    perfectFor: [
      "Complex love situations with many moving parts",
      "Career crossroads and life decisions",
      "Repeated patterns you can't seem to break",
      "Situations that have been weighing on you for weeks or months",
    ],
    howItWorks: [
      "Click 'Book This Reading' below",
      "Choose your preferred format (video call or written report) in the order notes",
      "Share as much detail as you're comfortable with in the order notes",
      "I'll spend dedicated time with your situation",
      "You receive your reading within 48 hours",
      "One follow-up question included if needed",
    ],
    faq: [
      {
        q: "Can I ask about multiple topics?",
        a: "This reading is focused on one main situation with related questions. If you have unrelated topics, consider The VIP Session.",
      },
      {
        q: "How do I know if I need this vs The VIP Session?",
        a: "The Deep Dive is a recorded session (video call or written report). The VIP Session is a live call for real-time conversation and unlimited questions.",
      },
      {
        q: "What if I need it sooner than 48 hours?",
        a: "If you're in crisis, DM me for emergency availability.",
      },
      {
        q: "What's the difference between video call and written report?",
        a: "Video call is a recorded session you can watch anytime. Written report is a detailed document you can reference later. Both contain the same depth of insight.",
      },
    ],
  },
  "vip-session": {
    name: "The VIP Session",
    price: 77.77,
    icon: Crown,
    tagline:
      "The full experience. For when you're ready to leave no stone unturned.",
    duration: "60-90 minutes",
    format: "Video call only",
    questions: "Unlimited",
    deliveryTime: "Scheduled",
    formatIcon: Video,
    description: `The VIP Session is for the big stuff—life crossroads, repeated patterns, deep healing, or situations that need serious unpacking. This isn't a quick check-in; it's a full spiritual consultation.

I'll use multiple tarot and oracle decks, follow every thread the cards reveal, and make sure you walk away with not just answers, but a plan.`,
    thisIsForYou: [
      "You're at a major life crossroads",
      "You've been through something traumatic and need healing insight",
      "You keep repeating the same patterns and want to understand why",
      "You have multiple questions across different areas of life",
      "You're ready to invest in your clarity and growth",
    ],
    whatYouGet: [
      "60-90 minute live video session",
      "Unlimited questions on your chosen topic or topics",
      "Multiple decks for layered insight",
      "Written summary of key points emailed to you",
      "Follow-up check-in within 1 week",
      "Priority support if you have questions after",
    ],
    perfectFor: [
      "Major life crossroads",
      "Healing from trauma",
      "Repeated patterns you can't break",
      "Multiple questions across different areas of life",
      "Deep healing and long-term guidance",
    ],
    howItWorks: [
      "Click 'Book This Reading' below",
      "Share any relevant details or questions upfront in the order notes",
      "I'll contact you within 24 hours to schedule your session",
      "Receive your live video session and walk away with clarity",
      "Get your written summary within 24 hours after our call",
    ],
    faq: [
      {
        q: "What happens during a live video session?",
        a: "We'll connect via Zoom/Google Meet for a real-time conversation. You can ask anything, and I'll pull cards live as we explore your situation together.",
      },
      {
        q: "Can I ask about multiple unrelated topics?",
        a: "Yes. This reading is for anything weighing on you—love, career, family, life purpose, all of it.",
      },
      {
        q: "What if I need to reschedule?",
        a: "You can reschedule up to 24 hours before your session via the confirmation email.",
      },
      {
        q: "How soon can I book?",
        a: "I typically have availability within 3-7 days. For urgent needs, DM me for emergency options.",
      },
      {
        q: "Will the session be recorded?",
        a: "The session is live and not recorded, but you'll receive a written summary of key points within 24 hours.",
      },
    ],
  },
};

// Generate static params for all readings (for better performance)
export async function generateStaticParams() {
  return Object.keys(readingsData).map((slug) => ({
    slug: slug,
  }));
}

// The page component
export default async function ReadingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reading = readingsData[slug as keyof typeof readingsData];

  // If the slug doesn't match any reading, show 404
  if (!reading) {
    notFound();
  }

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
              ${reading.price.toFixed(2)}
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
                ${reading.price.toFixed(2)}
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
                Secure payment via Stripe or PayPal
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
