"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DEMO_LINES = [
  { who: "caller" as const, text: "Hi, is this Smile Dental? I need to book a cleaning." },
  { who: "ai" as const, text: "You've reached Smile Dental, this is our assistant. Happy to help you book a cleaning. May I get your name?" },
  { who: "caller" as const, text: "Priya Mehta." },
  { who: "ai" as const, text: "Thanks Priya. I have openings Thursday at 2:15 or Friday at 10:30. Which works?" },
  { who: "caller" as const, text: "Friday 10:30." },
  { who: "ai" as const, text: "Booked. I'll text you a confirmation. Anything else?" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < DEMO_LINES.length) {
      const timer = setTimeout(() => setVisibleLines((n) => n + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setSubmitted(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Non-fatal: UX stays happy even if network fails.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
          Answeroo
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <a href="#demo" className="hidden sm:inline hover:opacity-70">
            See a demo
          </a>
          <Link
            href="/try"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:border-neutral-900 hidden sm:inline-block"
          >
            Try it
          </Link>
          <a
            href="#waitlist"
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Get early access
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-cyan-100 via-cyan-50 to-transparent opacity-60" />
        <div className="mx-auto max-w-4xl px-6 pt-20 pb-20 text-center sm:pt-28">
          <p className="mb-5 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            Small business
          </p>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-7xl">
            The AI receptionist that never sleeps.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
            Dentists, salons, law firms, trades. An AI that answers every call, books appointments,
            and sends reminders.
          </p>

          {submitted ? (
            <p className="mt-12 text-sm font-medium text-cyan-700">
              Thanks. We will ping you the day we launch.
            </p>
          ) : (
            <form
              id="waitlist"
              onSubmit={handleWaitlist}
              className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                placeholder="you@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-neutral-300 bg-white px-5 py-3.5 text-base placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 sm:w-80"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-neutral-900 px-7 py-3.5 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60"
              >
                Join the waitlist
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-neutral-400">
            Early access list is open. First 100 get in free forever.
          </p>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="border-y border-neutral-200 bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-600">
              Live preview
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See it in action</h2>
          </div>
          <div className="mt-12">
            <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 bg-cyan-50 px-5 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-medium text-cyan-900">Live call &middot; Smile Dental</span>
                </div>
                <span className="text-xs text-neutral-500">0:42</span>
              </div>
              <div className="p-5 space-y-3 min-h-[220px] text-sm">
                {DEMO_LINES.slice(0, visibleLines).map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.who === "ai"
                        ? "rounded-xl bg-cyan-50 p-3 text-cyan-900"
                        : "rounded-xl bg-neutral-100 p-3 text-neutral-800"
                    }
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider mr-2">
                      {line.who === "ai" ? "AI" : "Caller"}
                    </span>
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/try"
              className="inline-block rounded-full bg-cyan-600 px-7 py-3.5 font-medium text-white transition hover:bg-cyan-700"
            >
              Try a call yourself →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What you get</h2>
          </div>
          <div className="mt-12 grid gap-12 sm:grid-cols-3">
            <div>
              <div className="text-3xl">📞</div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Answers in one ring</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Never miss a lead again. 24 hours a day, every day of the year.
              </p>
            </div>
            <div>
              <div className="text-3xl">📅</div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Books appointments</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Integrates with your calendar and sends SMS confirmations automatically.
              </p>
            </div>
            <div>
              <div className="text-3xl">🗣️</div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Sounds human</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">
                Natural voice. Understands accents. Handles interruptions gracefully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-600">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps. No learning curve.
            </h2>
          </div>
          <div className="mt-12 grid gap-12 sm:grid-cols-3">
            {[
              {
                n: 1,
                title: "Connect your number",
                body: "Port, forward, or use ours. Five minute setup, no IT required.",
              },
              {
                n: 2,
                title: "We watch for a week",
                body: "Learn your tone, your hours, your top questions. Then go live.",
              },
              {
                n: 3,
                title: "Wake up to bookings",
                body: "Every missed call becomes a booked appointment. Check the morning summary.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="relative">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                  {n}
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Be the first in line.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-neutral-600">
          Early access starts soon. Get on the list and we will reach out the moment we open the
          doors.
        </p>
        <a
          href="#waitlist"
          className="mt-8 inline-block rounded-full bg-cyan-600 px-7 py-3.5 font-medium text-white transition hover:bg-cyan-700"
        >
          Reserve my spot
        </a>
      </section>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-neutral-500">
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-500" />
            Answeroo
          </p>
          <p>&copy; 2026</p>
        </div>
      </footer>
    </>
  );
}
