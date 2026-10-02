import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:py-20">
      <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
        Terms & Refund Policy
      </h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Booking Terms
          </h2>
          <p>
            By booking a reading, you agree to these terms. All readings are
            provided for entertainment and self-reflection purposes only.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Refund Policy
          </h2>
          <ul className="list-inside list-disc space-y-2 pl-2">
            <li>
              <span className="font-medium text-foreground">
                Before Reading is Delivered:
              </span>{" "}
              Full refund available within 24 hours of booking if the reading
              has not yet been started.
            </li>
            <li>
              <span className="font-medium text-foreground">
                After Reading is Delivered:
              </span>{" "}
              Due to the nature of the service, refunds are generally not
              offered. However, if you feel the reading did not resonate, please
              contact me within 48 hours and I will make it right—this may
              include a partial refund or a follow-up clarification.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Satisfaction Guarantee:
              </span>{" "}
              For The Deep Dive and The VIP Session, if you are genuinely
              unsatisfied, contact me and we&apos;ll find a resolution together.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Cancellation Policy
          </h2>
          <ul className="list-inside list-disc space-y-2 pl-2">
            <li>
              <span className="font-medium text-foreground">
                The Glimpse, Heart Compass, Deep Dive:
              </span>{" "}
              These are asynchronous readings—no scheduling required. If you
              need to cancel, please do so before I begin your reading.
            </li>
            <li>
              <span className="font-medium text-foreground">
                The VIP Session (Live):
              </span>{" "}
              You may reschedule up to 24 hours before your session.
              Cancellations with less than 24 hours notice are not eligible for
              a refund.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Delivery Times
          </h2>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>The Glimpse: 24-48 hours</li>
            <li>The Heart Compass: 24 hours</li>
            <li>The Deep Dive: 48 hours</li>
            <li>The VIP Session: Scheduled within 3-7 days</li>
          </ul>
          <p className="mt-2">
            If you need a reading urgently, please DM me on Instagram with the
            word &quot;CRISIS&quot; to check emergency availability.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Contact for Issues
          </h2>
          <p>
            If you have any questions about your reading or these terms, please
            contact me at karmicapothecary@gmail.com. or DM me on TikTok.
          </p>
        </section>

        <div className="mt-6 border-t border-border pt-4 text-xs">
          <p>
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <Link
            href="/"
            className="mt-2 inline-block text-primary hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
