# Answeroo

The AI receptionist that never sleeps. Dentists, salons, law firms, trades — an AI that answers every call, books appointments, and sends reminders.

**Status:** v0 skeleton — landing page + mocked phone-call demo. Full AI not yet wired.

**Landing:** https://answeroo.vercel.app

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind v4 |
| Fonts | Inter via `next/font/google` |
| Hosting | Vercel (zero config) |
| Waitlist | https://waitlist-api-sigma.vercel.app |

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Deploy

Push to `main` — Vercel picks it up automatically. No environment variables required.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page (original copy + design preserved) |
| `/try` | v0 phone-call demo — pick a business, type a prompt, get a mocked receptionist reply |
| `/api/waitlist` | `POST { email }` → forwards to waitlist-api-sigma with `product: "answeroo"` |

## What's next

- Wire real AI (voice model + call handling) behind `/try`
- Calendar integration for live booking
- SMS confirmation + reminder pipeline
