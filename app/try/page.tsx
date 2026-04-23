"use client";

import { useState } from "react";
import Link from "next/link";

type Business = "Dental" | "Salon" | "Law Firm" | "Plumber" | "Vet";

interface Reply {
  match: RegExp;
  text: string;
}

const GREETINGS: Record<Business, string> = {
  Dental: "Thanks for calling Smile Dental. This is the Answeroo assistant. How can I help you today?",
  Salon: "Hi, you've reached Glow Salon. This is our AI assistant. What can I do for you?",
  "Law Firm": "Good day, you've reached Parker & Associates. This is our virtual receptionist. How may I help?",
  Plumber: "Thanks for calling QuickFix Plumbing. This is the after-hours assistant. What's the issue?",
  Vet: "Hi, you've reached Happy Paws Vet Clinic. This is our virtual receptionist. How can I help?",
};

const REPLIES: Record<Business, Reply[]> = {
  Dental: [
    { match: /hour|open|close|time/i, text: "We're open Monday to Friday, 8 AM to 6 PM, and Saturdays 9 AM to 1 PM. Closed on Sundays." },
    { match: /price|cost|how much|fee/i, text: "A standard cleaning starts at $120. X-rays are $75. We accept most insurance plans — want me to check yours?" },
    { match: /book|appointment|schedule|cleaning/i, text: "I can book that for you. I have openings Thursday at 2:15 PM or Friday at 10:30 AM. Which works?" },
    { match: /direction|where|address|location|find/i, text: "We're at 142 Oak Street, Suite 3. There's free parking behind the building." },
    { match: /service|offer|do you do|whitening|filling|crown/i, text: "We offer cleanings, fillings, crowns, whitening, and emergency dental care. Would you like to book something specific?" },
  ],
  Salon: [
    { match: /hour|open|close|time/i, text: "We're open Tuesday to Saturday, 10 AM to 7 PM. Closed Sunday and Monday." },
    { match: /price|cost|how much|fee/i, text: "A women's cut starts at $55, men's at $35. Color starts at $90. Want me to book you in?" },
    { match: /book|appointment|schedule/i, text: "Sure! I have a slot Wednesday at 3 PM or Thursday at 11 AM. Which works best?" },
    { match: /direction|where|address|location|find/i, text: "We're at 28 Main Street, right next to the coffee shop. Street parking available." },
    { match: /service|offer|do you do|color|cut|blowout|nail/i, text: "We do cuts, color, blowouts, nails, and facials. What are you looking for today?" },
  ],
  "Law Firm": [
    { match: /hour|open|close|time/i, text: "Office hours are Monday to Friday, 9 AM to 5:30 PM. We can arrange after-hours calls for urgent matters." },
    { match: /price|cost|how much|fee|consultation/i, text: "Initial consultations are $150 for 30 minutes. We offer payment plans for ongoing cases." },
    { match: /book|appointment|schedule|meeting/i, text: "I can schedule a consultation. We have availability tomorrow at 2 PM or Thursday at 10 AM. Which suits you?" },
    { match: /direction|where|address|location|find/i, text: "We're in the Westfield Tower, 8th floor, 500 Commerce Drive. Visitor parking is in Lot B." },
    { match: /service|practice|area|speciali|handle|case/i, text: "We handle family law, personal injury, estate planning, and small business matters. What do you need help with?" },
  ],
  Plumber: [
    { match: /hour|open|close|time|available/i, text: "We're available 24/7 for emergencies. Standard appointments run Monday to Saturday, 7 AM to 6 PM." },
    { match: /price|cost|how much|fee|rate/i, text: "Service calls start at $85. We quote the full job on-site before starting — no surprises." },
    { match: /book|appointment|schedule|come out/i, text: "I can get someone out tomorrow morning between 8 and 10. Does that window work?" },
    { match: /direction|where|address|location|find/i, text: "We're mobile — we come to you. Just give me your address and we'll confirm a time." },
    { match: /service|offer|do you do|leak|drain|toilet|pipe/i, text: "We handle leaks, drain cleaning, toilet repair, pipe replacement, and water heater installs. What's going on?" },
  ],
  Vet: [
    { match: /hour|open|close|time/i, text: "We're open Monday to Friday, 8 AM to 7 PM, and Saturdays 9 AM to 3 PM. Emergency after-hours is available." },
    { match: /price|cost|how much|fee/i, text: "A standard wellness exam is $65. Vaccinations start at $25 each. Want me to book a visit?" },
    { match: /book|appointment|schedule|visit/i, text: "Sure! I have openings Wednesday at 1 PM or Friday at 9:30 AM. Which works for you and your pet?" },
    { match: /direction|where|address|location|find/i, text: "We're at 310 Elm Avenue, behind the park. There's a pet-friendly waiting area out front." },
    { match: /service|offer|do you do|vaccine|spay|neuter|checkup/i, text: "We offer wellness exams, vaccinations, spay/neuter, dental cleaning, and urgent care. What does your pet need?" },
  ],
};

const BUSINESSES: Business[] = ["Dental", "Salon", "Law Firm", "Plumber", "Vet"];

const SUGGESTIONS: Record<Business, string[]> = {
  Dental: ["What are your hours?", "How much is a cleaning?", "I'd like to book an appointment", "What services do you offer?", "Where are you located?"],
  Salon: ["What are your hours?", "How much is a haircut?", "I'd like to book an appointment", "What services do you offer?", "Where are you located?"],
  "Law Firm": ["What are your hours?", "How much is a consultation?", "I'd like to schedule a meeting", "What areas do you practice?", "Where is your office?"],
  Plumber: ["Are you available 24/7?", "How much is a service call?", "Can someone come out today?", "Do you fix leaks?", "Where are you located?"],
  Vet: ["What are your hours?", "How much is a checkup?", "I'd like to book a visit", "What services do you offer?", "Where is the clinic?"],
};

interface Message {
  who: "caller" | "ai";
  text: string;
}

export default function TryPage() {
  const [business, setBusiness] = useState<Business>("Dental");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);

  function startCall() {
    setMessages([{ who: "ai", text: GREETINGS[business] }]);
    setStarted(true);
  }

  function handleBusinessChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setBusiness(e.target.value as Business);
    setMessages([]);
    setInput("");
    setStarted(false);
  }

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const callerMsg: Message = { who: "caller", text: text.trim() };
    const replies = REPLIES[business];
    const matched = replies.find((r) => r.match.test(text));
    const aiMsg: Message = {
      who: "ai",
      text: matched
        ? matched.text
        : "I'm not sure about that one — let me take a message and have someone call you back. Can I get your name and number?",
    };

    setMessages((prev) => [...prev, callerMsg, aiMsg]);
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleRestart() {
    setMessages([]);
    setInput("");
    setStarted(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
          Answeroo
        </Link>
        <Link
          href="/#waitlist"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Get early access
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
              Phone call demo
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Call any business. See how Answeroo handles it.
            </h1>
          </div>
          <select
            value={business}
            onChange={handleBusinessChange}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10"
          >
            {BUSINESSES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-cyan-50 px-5 py-3">
            <div className="flex items-center gap-2 text-sm">
              {started && (
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
              <span className="font-medium text-cyan-900">
                {started ? `Live call · ${business === "Law Firm" ? "Parker & Associates" : business === "Dental" ? "Smile Dental" : business === "Salon" ? "Glow Salon" : business === "Plumber" ? "QuickFix Plumbing" : "Happy Paws Vet"}` : `Call · ${business}`}
              </span>
            </div>
            {started && (
              <button
                onClick={handleRestart}
                className="text-xs text-neutral-500 hover:text-neutral-700"
              >
                End call
              </button>
            )}
          </div>

          <div className="p-5 space-y-3 min-h-[280px] text-sm">
            {!started ? (
              <div className="flex flex-col items-center justify-center min-h-[280px] gap-4">
                <p className="text-neutral-500">Pick a business type above, then start the call.</p>
                <button
                  onClick={startCall}
                  className="rounded-full bg-cyan-600 px-7 py-3.5 font-medium text-white transition hover:bg-cyan-700"
                >
                  Start call
                </button>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.who === "ai"
                        ? "rounded-xl bg-cyan-50 p-3 text-cyan-900"
                        : "rounded-xl bg-neutral-100 p-3 text-neutral-800"
                    }
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider mr-2">
                      {msg.who === "ai" ? "AI" : "You"}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </>
            )}
          </div>

          {started && (
            <div className="border-t border-neutral-200 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {SUGGESTIONS[business].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600 transition hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type what you'd say on the phone..."
                  className="flex-1 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10"
                />
                <button
                  type="submit"
                  className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          This is a v0 preview with mocked replies.{" "}
          <Link href="/#waitlist" className="underline hover:text-neutral-600">
            Join the waitlist
          </Link>{" "}
          for the real AI-powered experience.
        </p>
      </div>
    </div>
  );
}
