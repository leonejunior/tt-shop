"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Sending to: /api/contact");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        let errorMessage = "Failed to send message";
        try {
          const errorData = (await response.json()) as any;
          errorMessage = errorData?.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      await response.json();
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 md:py-16 lg:py-20">
        <div className="rounded-xl border border-border bg-background p-8 text-center md:p-12">
          <div className="flex justify-center">
            <CheckCircle2 size={48} className="text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-foreground md:text-3xl">
            Message Sent! ✨
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for reaching out. I&apos;ll get back to you within 24-48
            hours.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="mb-10 text-center md:mb-12">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Contact
        </h1>
        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-primary" />
        <p className="mt-4 text-muted-foreground">
          Have questions? I&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Contact Form */}
        <div className="order-2 md:order-1">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={formState.message}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="What would you like to know?"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="order-1 md:order-2">
          <h2 className="text-xl font-semibold text-foreground">
            Connect With Me
          </h2>
          <p className="mt-2 text-muted-foreground">
            For quick questions or urgent reading requests, DM me on social
            media.
          </p>

          <div className="mt-6 space-y-4">
            {/* TikTok Link */}
            <a
              href="https://www.tiktok.com/@readwith.karma"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="font-medium text-foreground">TikTok</p>
                <p className="text-sm text-muted-foreground">@readwith.karma</p>
              </div>
            </a>

            {/* Email Link - opens mail client */}
            <a
              href="mailto:karmicapothecary@gmail.com?subject=Question%20about%20readings&body=Hi%20Karma%2C%0A%0A"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">
                  karmicapothecary@gmail.com
                </p>
              </div>
            </a>
          </div>

          {/* Updated Urgent Message - Now mentions TikTok */}
          <div className="mt-6 rounded-lg bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">⚡ Urgent?</span> If
              you need a same-day reading, DM me on TikTok with the word
              &quot;CRISIS&quot; and I&apos;ll send you a private link if slots
              are available.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
