import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:py-20">
      <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
        Privacy Policy
      </h1>

      <div className="space-y-6 text-muted-foreground">
        <p>
          Your privacy is important to me. This policy explains how I collect,
          use, and protect your personal information when you use this website
          or book a reading.
        </p>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Information I Collect
          </h2>
          <p>When you book a reading or contact me, I may collect:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
            <li>Your name and email address</li>
            <li>
              Your payment information (processed securely via PayPal)
            </li>
            <li>Your question(s) for the reading</li>
            <li>Any additional context you choose to share</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            How I Use Your Information
          </h2>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>To deliver your tarot reading</li>
            <li>To communicate with you about your booking</li>
            <li>To process payments securely</li>
            <li>To improve my services</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Data Security
          </h2>
          <p>
            All payment transactions are processed through PayPal,
            which uses industry-standard encryption. I do not store your payment
            details on this website.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Sharing Your Information
          </h2>
          <p>
            I never sell or share your personal information with third parties,
            except as required to process your booking (e.g., payment
            processors). Your reading details are strictly confidential.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Cookies
          </h2>
          <p>
            This website may use cookies to improve your browsing experience.
            You can disable cookies in your browser settings at any time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Your Rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time by contacting me at
            karmicapothecary@gmail.com.
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
