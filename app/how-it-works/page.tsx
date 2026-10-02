import Link from "next/link";
import {
  ShoppingBag,
  Calendar,
  MessageSquare,
  Mail,
  ArrowRight,
  Video,
  Headphones,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: ShoppingBag,
      title: "Choose Your Reading",
      description:
        "Browse the readings page and pick the package that feels right for your situation. The Glimpse (2 questions, 5 cards), The Heart Compass (3-4 love questions, 5-7 cards), The Deep Dive (4-6 questions, 10-12 cards across 2-3 spreads), or The VIP Session (unlimited questions, live 60-90 minute session).",
    },
    {
      number: 2,
      icon: Calendar,
      title: "Book & Share Your Details",
      description:
        "Fill out your name, email, and your questions. For The Deep Dive, you can choose between a live video call or written report. For The VIP Session, it's a live video call only. The more context you share, the clearer your reading will be.",
    },
    {
      number: 3,
      icon: MessageSquare,
      title: "Schedule (If Applicable)",
      description:
        "If you chose a live session (The VIP Session or Deep Dive video call), you'll select a date and time that works for you. All times are in EST. You'll receive a Google Meet link in your confirmation email.",
    },
    {
      number: 4,
      icon: Mail,
      title: "Complete Payment & Receive",
      description:
        "Complete your secure payment via PayPal. For asynchronous readings (The Glimpse, Heart Compass, Deep Dive written report), you'll receive your reading within the promised timeframe. For live sessions, you'll join your scheduled video call and receive a written summary afterward.",
    },
  ];

  const readingDetails = [
    {
      name: "The Glimpse",
      price: "$11.11",
      questions: "2 questions",
      cards: "5 cards",
      format: "Voice note",
      delivery: "24-48 hours",
      icon: Headphones,
    },
    {
      name: "The Heart Compass",
      price: "$22.22",
      questions: "3-4 related questions",
      cards: "5-7 cards",
      format: "Voice note",
      delivery: "24 hours",
      icon: Headphones,
    },
    {
      name: "The Deep Dive",
      price: "$44.44",
      questions: "4-6 related questions",
      cards: "10-12 cards across 2-3 spreads",
      format: "Video call or written report",
      delivery: "48 hours",
      icon: Video,
    },
    {
      name: "The VIP Session",
      price: "$77.77",
      questions: "Unlimited",
      cards: "Multiple decks, intuitive pulls",
      format: "Live video call only",
      delivery: "Scheduled (60-90 min)",
      icon: Video,
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-12 lg:py-16">
      {/* Header */}
      <div className="mb-8 text-center md:mb-12">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
          How It Works
        </h1>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-primary md:mt-3 md:w-20" />
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Simple steps to the clarity you&apos;re seeking
        </p>
      </div>

      {/* Steps - Mobile Optimized */}
      <div className="space-y-6 md:space-y-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative rounded-xl border border-border bg-background p-5 md:p-6"
            >
              <div className="flex gap-4">
                {/* Number & Icon - Side by side on mobile, stacked on desktop */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground md:h-12 md:w-12 md:text-base">
                    {step.number}
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary md:h-10 md:w-10">
                    <Icon size={16} className="md:h-5 md:w-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-foreground md:text-lg">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground md:mt-2 md:text-sm">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line - Hidden on mobile */}
              {idx < steps.length - 1 && (
                <div className="absolute -bottom-3 left-[1.625rem] hidden h-6 w-px bg-border md:block md:-bottom-4 md:left-8" />
              )}
            </div>
          );
        })}
      </div>

      {/* Reading Details - Mobile Optimized Card View */}
      <div className="mt-10 rounded-xl border border-border bg-background p-5 md:mt-12 md:p-6">
        <h2 className="text-center text-lg font-semibold text-foreground md:text-xl">
          Reading Options at a Glance
        </h2>

        {/* Mobile: Card View */}
        <div className="mt-4 space-y-3 md:hidden">
          {readingDetails.map((reading) => {
            const Icon = reading.icon;
            return (
              <div
                key={reading.name}
                className="rounded-lg border border-border bg-muted/20 p-3"
              >
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Icon size={14} className="text-primary" />
                  <span className="font-medium text-foreground">
                    {reading.name}
                  </span>
                  <span className="ml-auto text-sm font-semibold text-primary">
                    {reading.price}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="text-foreground">{reading.questions}</span>
                  <span className="text-muted-foreground">Cards:</span>
                  <span className="text-foreground">{reading.cards}</span>
                  <span className="text-muted-foreground">Format:</span>
                  <span className="text-foreground">{reading.format}</span>
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="text-foreground">{reading.delivery}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Table View */}
        <div className="mt-6 hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Reading
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Price
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Questions
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Cards
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Format
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Delivery
                </th>
              </tr>
            </thead>
            <tbody>
              {readingDetails.map((reading, idx) => {
                const Icon = reading.icon;
                return (
                  <tr
                    key={reading.name}
                    className={
                      idx < readingDetails.length - 1
                        ? "border-b border-border/50"
                        : ""
                    }
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-primary" />
                        <span className="font-medium text-foreground">
                          {reading.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-foreground">
                      {reading.price}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {reading.questions}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {reading.cards}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {reading.format}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {reading.delivery}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery & Format Details - Mobile Optimized */}
      <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-muted/30 p-4 md:p-5">
          <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground md:text-lg">
            <Headphones size={18} className="text-primary md:h-5 md:w-5" />
            Asynchronous Readings
          </h3>
          <p className="text-xs text-muted-foreground md:text-sm">
            <span className="font-medium text-foreground">
              The Glimpse & Heart Compass:
            </span>{" "}
            Receive a private voice note delivered to your email. Listen
            anytime, anywhere.
          </p>
          <p className="mt-2 text-xs text-muted-foreground md:text-sm">
            <span className="font-medium text-foreground">
              The Deep Dive (Written):
            </span>{" "}
            Get a detailed written report you can reference again and again.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 md:p-5">
          <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground md:text-lg">
            <Video size={18} className="text-primary md:h-5 md:w-5" />
            Live Sessions
          </h3>
          <p className="text-xs text-muted-foreground md:text-sm">
            <span className="font-medium text-foreground">
              The Deep Dive (Video):
            </span>{" "}
            A recorded 20-45 minute session you can watch anytime.
          </p>
          <p className="mt-2 text-xs text-muted-foreground md:text-sm">
            <span className="font-medium text-foreground">
              The VIP Session:
            </span>{" "}
            A live 60-90 minute 1:1 video call. Written summary emailed within
            24 hours.
          </p>
        </div>
      </div>

      {/* FAQ Teaser & CTA */}
      <div className="mt-8 text-center md:mt-10">
        <p className="text-xs text-muted-foreground md:text-sm">
          Still have questions about the process?
        </p>
        <Link
          href="/contact"
          className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline md:mt-2 md:text-sm"
        >
          Contact me
          <ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
        </Link>
      </div>

      <div className="mt-8 rounded-xl bg-primary/5 p-5 text-center md:mt-10 md:p-6">
        <h2 className="text-base font-semibold text-foreground md:text-lg">
          Ready to find your clarity?
        </h2>
        <Link
          href="/readings"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:mt-4 md:px-6 md:py-2.5 md:text-sm"
        >
          Explore Readings
          <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}
