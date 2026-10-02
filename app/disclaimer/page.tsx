import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:py-20">
      <div className="mb-8 flex items-center gap-3">
        <AlertCircle size={28} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Disclaimer
        </h1>
      </div>

      <div className="space-y-6 text-muted-foreground">
        <p>
          The tarot readings and spiritual guidance provided on this website are
          for entertainment, self-reflection, and personal growth purposes only.
          They are not a substitute for professional advice, including but not
          limited to medical, legal, financial, or psychological services.
        </p>

        <p>By booking a reading, you acknowledge that:</p>

        <ul className="list-inside list-disc space-y-2 pl-2">
          <li>You are at least 18 years of age.</li>
          <li>
            You understand that tarot readings are based on intuitive
            interpretation and are not guarantees of future outcomes.
          </li>
          <li>
            You are responsible for your own decisions and actions based on the
            reading.
          </li>
          <li>
            You will not use this service as a substitute for professional
            mental health care, legal counsel, or financial advice.
          </li>
        </ul>

        <p>
          I do not provide readings on medical conditions, legal matters, or
          financial investments. If you are in crisis or experiencing a medical
          emergency, please contact your local emergency services immediately.
        </p>

        <p>
          All readings are confidential. Your personal information and the
          details of your reading will never be shared without your consent.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm">
            <span className="font-medium text-foreground">Need support?</span>{" "}
            If you&apos;re going through a difficult time, please reach out:
          </p>
          <ul className="mt-2 text-sm list-inside list-disc space-y-1">
            <li>Crisis Lifeline: 988 (US)</li>
            <li>Crisis Text Line: Text HOME to 741741</li>
            <li>
              Find a therapist:{" "}
              <a
                href="https://www.psychologytoday.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Psychology Today
              </a>
            </li>
          </ul>
        </div>

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
