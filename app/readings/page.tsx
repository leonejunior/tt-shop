import Link from "next/link";
import { Zap } from "lucide-react";
import { READINGS_LIST } from "@/lib/readings";

export default function ReadingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      {/* Shop Header */}
      <div className="mb-12 text-center">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {READINGS_LIST.map((reading) => {
          const Icon = reading.icon;
          return (
            <div
              key={reading.slug}
              className="group flex flex-col justify-between rounded-xl border border-border bg-background p-6 transition-all hover:shadow-lg"
            >
              <div>
                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={28} />
                </div>

                {/* Title & Price */}
                <h2 className="text-xl font-semibold text-foreground">
                  {reading.name}
                </h2>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {reading.priceFormatted}
                </p>

                {/* Short Description */}
                <p className="mt-3 text-sm text-muted-foreground">
                  {reading.shortDescription}
                </p>
              </div>

              {/* View Details Button */}
              <Link
                href={`/readings/${reading.slug}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-primary/30 bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 group-hover:border-primary"
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>

      {/* Emergency Pull */}
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
