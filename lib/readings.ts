import type { ComponentType } from "react";
import {
  Sparkles,
  Heart,
  Compass,
  Crown,
  Headphones,
  Video,
} from "lucide-react";

export type ReadingSlug =
  | "the-glimpse"
  | "heart-compass"
  | "deep-dive"
  | "vip-session";

export interface ReadingItem {
  slug: ReadingSlug;
  name: string;
  price: number;
  priceFormatted: string;
  format: string;
  deliveryTime: string;
  duration?: string;
  tagline?: string;
  shortDescription: string;
  cards: string;
  questions: string;
  questionHint: string;
  showFormatSelector: boolean;
  icon: ComponentType<{ size?: number | string; className?: string }>;
  formatIcon: ComponentType<{ size?: number | string; className?: string }>;
  description: string;
  thisIsForYou: string[];
  whatYouGet: string[];
  perfectFor: string[];
  howItWorks: string[];
  faq: { q: string; a: string }[];
}

export const READINGS_CATALOG: Record<ReadingSlug, ReadingItem> = {
  "the-glimpse": {
    slug: "the-glimpse",
    name: "The Glimpse",
    price: 11.11,
    priceFormatted: "$11.11",
    format: "Voice Note",
    deliveryTime: "24-48 hours",
    duration: "24-48 hour delivery",
    tagline: "New here? Start with a glimpse.",
    shortDescription:
      "2 burning questions. 5 cards. Clarity delivered within 24-48 hours. Your gentle introduction to tarot.",
    cards: "5 cards",
    questions: "2 questions",
    questionHint:
      "You can ask up to 2 questions. Keep them focused on one situation or topic for the clearest insight.",
    showFormatSelector: false,
    icon: Sparkles,
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
    slug: "heart-compass",
    name: "The Heart Compass",
    price: 22.22,
    priceFormatted: "$22.22",
    format: "Voice Note",
    deliveryTime: "24 hours",
    duration: "24 hour delivery",
    tagline: "Looking to know what's next in love?",
    shortDescription:
      "Love questions answered. 3-4 related questions. 5-7 cards. Clarity on your heart's path within 24 hours.",
    cards: "5-7 cards",
    questions: "3-4 related questions",
    questionHint:
      "Ask 3-4 related questions about your love situation. The more context you share, the clearer the reading.",
    showFormatSelector: false,
    icon: Heart,
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
    slug: "deep-dive",
    name: "The Deep Dive",
    price: 44.44,
    priceFormatted: "$44.44",
    format: "Video Call or Written Report",
    deliveryTime: "48 hours",
    duration: "48 hour delivery",
    tagline: "Feel like you need more clarity than a basic read can deliver?",
    shortDescription:
      "4-6 related questions. 10-12 cards across 2-3 spreads. Complete clarity within 48 hours.",
    cards: "10-12 cards across 2-3 spreads",
    questions: "4-6 related questions",
    questionHint:
      "You can ask 4-6 related questions about your situation. Choose your preferred format below.",
    showFormatSelector: true,
    icon: Compass,
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
    slug: "vip-session",
    name: "The VIP Session",
    price: 77.77,
    priceFormatted: "$77.77",
    format: "Video Call Only",
    deliveryTime: "Scheduled",
    duration: "60-90 minutes",
    tagline:
      "The full experience. For when you're ready to leave no stone unturned.",
    shortDescription:
      "Leave no stone unturned. 60-90 minute live session. Ask anything. Receive everything. Written summary included.",
    cards: "Multiple decks, intuitive pulls",
    questions: "Unlimited",
    questionHint:
      "Ask anything! You'll get a 60-90 minute live video session. I'll contact you within 24 hours to schedule.",
    showFormatSelector: false,
    icon: Crown,
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
        a: "Sessions are typically available within 2-4 days. You can choose your preferred time during booking.",
      },
    ],
  },
};

export const READINGS_LIST: ReadingItem[] = [
  READINGS_CATALOG["the-glimpse"],
  READINGS_CATALOG["heart-compass"],
  READINGS_CATALOG["deep-dive"],
  READINGS_CATALOG["vip-session"],
];

export function isValidReadingSlug(slug: string | null | undefined): slug is ReadingSlug {
  return typeof slug === "string" && slug in READINGS_CATALOG;
}

export function getReadingBySlug(slug: string | null | undefined): ReadingItem {
  if (isValidReadingSlug(slug)) {
    return READINGS_CATALOG[slug];
  }
  return READINGS_CATALOG["the-glimpse"];
}
