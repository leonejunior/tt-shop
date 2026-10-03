import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, Compass, Crown, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="mb-10 text-center md:mb-16">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Meet Karma
        </h1>
        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-primary" />
        <p className="mt-4 text-muted-foreground">
          Intuitive tarot reader • Spiritual guide • Truth teller
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        {/* Image Section */}
        <div className="order-2 md:order-1">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src="/images/image2.webp"
              alt="Karma - Tarot Reader"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <div className="h-1.5 w-8 rounded-full bg-primary/40" />
            <div className="h-1.5 w-8 rounded-full bg-primary/60" />
            <div className="h-1.5 w-8 rounded-full bg-primary" />
          </div>
        </div>

        {/* Text Section */}
        <div className="order-1 md:order-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Hi, I&apos;m Karma. 👋
          </h2>
          <p className="mt-4 text-muted-foreground">
            I&apos;ve been reading tarot for over 8 years, helping hundreds find
            clarity in love, career, and life&apos;s big questions. What started
            as a personal curiosity became a calling when I realized how much
            peace and direction these cards could bring to others.
          </p>
          <p className="mt-4 text-muted-foreground">
            My approach is honest, compassionate, and never fear-based. I
            don&apos;t tell you what you want to hear—I tell you what you need
            to hear. The cards are a mirror, and I&apos;m here to help you see
            what&apos;s already within you.
          </p>
          <p className="mt-4 text-muted-foreground">
            Whether you&apos;re heartbroken, curious, or standing at a
            crossroads, you&apos;re welcome here. No judgment. No pressure. Just
            clarity.
          </p>

          {/* Values */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="font-semibold text-foreground">What I Believe</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Honest truth
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Compassionate space
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Your empowerment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  No fear, only clarity
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/readings"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explore Readings
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Fun Fact Section */}
      <div className="mt-16 rounded-xl border border-border bg-muted/30 p-6 text-center md:p-8">
        <p className="text-sm uppercase tracking-wider text-primary">
          A Little Magic
        </p>
        <h3 className="mt-2 text-xl font-semibold text-foreground">
          My Favorite Deck
        </h3>
        <p className="mt-2 text-muted-foreground">
          I work primarily with the Modern Witch Tarot and a collection of
          oracle decks I&apos;ve gathered over the years. Each reading is
          intuitive, never scripted.
        </p>
        <div className="mt-4 flex justify-center gap-1">
          <span className="text-2xl">🃏</span>
          <span className="text-2xl">✨</span>
          <span className="text-2xl">🔮</span>
        </div>
      </div>
    </main>
  );
}
