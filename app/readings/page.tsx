import Link from "next/link";
import { Sparkles, Heart, Compass, Crown, Zap } from "lucide-react";

export default function ReadingsPage() {
  const readings = [
    {
      slug: "the-glimpse",
      name: "The Glimpse",
      price: "$11.11",
      icon: Sparkles,
      shortDescription:
        "2 burning questions. 5 cards. Clarity delivered within 24-48 hours. Your gentle introduction to tarot.",
      description: `New here? Start with a glimpse.

Perfect if you're curious about tarot but not ready for a full session. Pick up to 2 burning questions—about love, career, or life direction—and I'll pull 5 cards to give you clarity.

This reading is designed to be quick, affordable, and insightful. It's ideal for those moments when you just need a sign or a nudge in the right direction.

This is for you if:
• You've never had a reading before
• You want to see if my energy vibes with yours
• You have 1-2 specific questions nagging at you
• You want answers without a big time commitment

What you get:
• 5-card tarot pull focused on your questions
• Voice note delivery (5-10 minutes)
• 1-2 specific questions answered with clarity and honesty
• Delivery within 24-48 hours

How it works:
1. Click "Book This Reading" below
2. Share your questions in the order notes at checkout
3. I'll tap in and record your reading
4. You receive your voice note within 24-48 hours

After payment, you'll receive a confirmation email with instructions. Simple, easy, no pressure.`,
      idealFor: [
        '"Does he miss me?"',
        '"Should I take the job?"',
        '"What\'s coming up for me?"',
        "First-time tarot experience",
        '"How does he feel about me?"',
      ],
      whatYouGet: [
        "5-card tarot pull focused on your questions",
        "Voice note delivery (5-10 minutes)",
        "1-2 questions answered with clarity and honesty",
        "Delivery within 24-48 hours",
      ],
      format: "Voice note",
      deliveryTime: "24-48 hours",
      questions: "2 questions",
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
    {
      slug: "heart-compass",
      name: "The Heart Compass",
      price: "$22.22",
      icon: Heart,
      shortDescription:
        "Love questions answered. 3-4 related questions. 5-7 cards. Clarity on your heart's path within 24 hours.",
      description: `Looking to know what's next in love? Wondering who's got their eye on you?

You've come to the right place. We all LOVE love, but it can be a bit messy at times. I'm here to bring forth some clarity and help calm those nerves.

This reading is designed for one specific love situation—whether it's a situationship, no-contact separation, or someone you can't stop thinking about. I'll tap in and give you a sneak peek at what's not being seen in the present.

Perfect for 3-4 related questions like:
• "Does he miss me?"
• "How does they really feel?"
• "What's next for us?"
• "Should I reach out?"
• "Is there someone new coming in?"

What you get:
• Multi-card spread (5-7 cards) focused on your love situation
• Voice note delivery (10-15 minutes)
• 3-4 related questions answered with honest, compassionate insight
• Guidance on what to do next

How it works:
1. Click "Book This Reading" below
2. Share your questions and any context in the order notes
3. I'll tune into your energy and pull cards
4. You receive your voice note within 24 hours

Once you book, feel free to leave your questions in the order notes. The more context, the clearer the reading.`,
      idealFor: [
        '"Does he miss me?"',
        '"How does they really feel?"',
        '"What\'s next for us?"',
        '"Should I reach out?"',
        '"Is there someone new coming in?"',
      ],
      whatYouGet: [
        "Multi-card spread (5-7 cards) focused on your love situation",
        "Voice note delivery (10-15 minutes)",
        "3-4 related questions answered with honesty and compassion",
        "Guidance on what to do next",
      ],
      format: "Voice note",
      deliveryTime: "24 hours",
      questions: "3-4 related questions",
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
    {
      slug: "deep-dive",
      name: "The Deep Dive",
      price: "$44.44",
      icon: Compass,
      shortDescription:
        "4-6 related questions. 10-12 cards across 2-3 spreads. Complete clarity within 48 hours.",
      description: `Feel like you need more clarity than a basic read can deliver?

The Deep Dive is for situations that have layers—where one question leads to another, and you need someone to help you untangle it all.

This isn't a quick yes/no. This is a virtual deep exploration of every corner of what's weighing on you. I'll pull multiple spreads, follow the energy where it leads, and make sure you walk away with real understanding.

This is for:
• Complex love situations with many moving parts
• Career crossroads and life decisions
• Repeated patterns you can't seem to break
• Situations that have been weighing on you for weeks or months
• When you're ready to go deeper than surface-level answers

What you get:
• 10-12 cards across 2-3 spreads for deeper insight
• Exploration of 4-6 related questions on one topic
• Video call or written report (20-45 minutes)
• Practical guidance you can actually use
• One follow-up question included if something needs clarification

How it works:
1. Click "Book This Reading" below
2. Choose your preferred format (video call or written report) in the order notes
3. Share as much detail as you're comfortable with in the order notes
4. I'll spend dedicated time with your situation
5. You receive your reading within 48 hours
6. One follow-up question included if needed

Once you book, leave as much detail as you're comfortable with. The more I know, the deeper I can go.`,
      idealFor: [
        "Complex love situations with many moving parts",
        "Career crossroads and life decisions",
        "Repeated patterns you can't seem to break",
        "Situations that have been weighing on you for weeks or months",
      ],
      whatYouGet: [
        "10-12 cards across 2-3 spreads for deeper insight",
        "Exploration of 4-6 related questions on one topic",
        "Video call or written report (20-45 minutes)",
        "Practical guidance you can actually use",
        "One follow-up question included if something needs clarification",
      ],
      format: "Video call or written report",
      deliveryTime: "48 hours",
      questions: "4-6 related questions",
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
    {
      slug: "vip-session",
      name: "The VIP Session",
      price: "$77.77",
      icon: Crown,
      shortDescription:
        "Leave no stone unturned. 60-90 minute live session. Ask anything. Receive everything. Written summary included.",
      description: `This is the full experience. For when you're ready to leave no stone unturned.

The VIP Session is for the big stuff—life crossroads, repeated patterns, deep healing, or situations that need serious unpacking. This isn't a quick check-in; it's a full spiritual consultation.

I'll use multiple tarot and oracle decks, follow every thread the cards reveal, and make sure you walk away with not just answers, but a plan.

This is for you if:
• You're at a major life crossroads
• You've been through something traumatic and need healing insight
• You keep repeating the same patterns and want to understand why
• You have multiple questions across different areas of life
• You're ready to invest in your clarity and growth

What you get:
• 60-90 minute live video session
• Unlimited questions on your chosen topic or topics
• Multiple decks for layered insight
• Written summary of key points emailed to you
• Follow-up check-in within 1 week
• Priority support if you have questions after

How it works:
1. Click "Book This Reading" below
2. Share any relevant details or questions upfront in the order notes
3. I'll contact you within 24 hours to schedule your session
4. Receive your live video session and walk away with clarity
5. Get your written summary within 24 hours after our call

This session can take up to 90 minutes depending on how much comes through. Book when you have time to fully receive the energy.`,
      idealFor: [
        "Major life crossroads",
        "Healing from trauma",
        "Repeated patterns you can't break",
        "Multiple questions across different areas of life",
        "Deep healing and long-term guidance",
      ],
      whatYouGet: [
        "60-90 minute live video session",
        "Unlimited questions on your chosen topic or topics",
        "Multiple decks for layered insight",
        "Written summary of key points emailed to you",
        "Follow-up check-in within 1 week",
        "Priority support if you have questions after",
      ],
      format: "Video call only",
      deliveryTime: "Scheduled",
      questions: "Unlimited",
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
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      {/* Shop Header - Updated for mobile single line */}
      <div className="mb-12 text-center">
        <h1 className="text-2xl font-bold text-foreground whitespace-nowrap md:text-3xl lg:text-4xl">
          ✨ Welcome to Karma&apos;s Apothecary ✨
        </h1>
        <p className="mt-3 text-muted-foreground">
          In need of some insight? You&apos;re in the right place.
        </p>
        <p className="mt-2 text-muted-foreground">
          Use your intuition to decide which reading calls to you. Each option
          offers a different depth of clarity—trust what feels right for where
          you are right now.
        </p>
        <p className="mt-2 text-muted-foreground">
          Once you book, you&apos;ll have the option to share your question(s)
          in the order notes. The more you share, the more I can tune in.
        </p>
        <p className="mt-3 text-sm italic text-primary">
          Let the cards guide you. 🃏✨
        </p>
      </div>

      {/* Readings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {readings.map((reading) => {
          const Icon = reading.icon;
          return (
            <div
              key={reading.slug}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={28} />
              </div>

              {/* Title & Price */}
              <h2 className="text-xl font-semibold text-foreground">
                {reading.name}
              </h2>
              <p className="mt-1 text-2xl font-bold text-primary">
                {reading.price}
              </p>

              {/* Short Description */}
              <p className="mt-3 text-sm text-muted-foreground">
                {reading.shortDescription}
              </p>

              {/* View Details Button */}
              <Link
                href={`/readings/${reading.slug}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-primary/30 bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 group-hover:border-primary"
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>

      {/* Emergency Pull - Updated to TikTok */}
      <div className="mt-12 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/5 p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <Zap size={20} className="text-amber-500" />
          <h3 className="text-lg font-semibold text-foreground">
            Need Answers Now?
          </h3>
          <Zap size={20} className="text-amber-500" />
        </div>
        <p className="mt-2 text-muted-foreground">
          The Emergency Pull is available for urgent situations—same-day
          delivery.
        </p>
        <p className="text-sm text-muted-foreground">
          DM me on TikTok with the word{" "}
          <span className="font-mono text-primary">&quot;CRISIS&quot;</span> and
          I&apos;ll send you a private link if slots are available.
        </p>
        <Link
          href="https://www.tiktok.com/@readwith.karma"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          DM me on TikTok →
        </Link>
      </div>
    </main>
  );
}
