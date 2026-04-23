import { NextRequest, NextResponse } from "next/server";

const WAITLIST_API = "https://waitlist-api-sigma.vercel.app/api/waitlist";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  try {
    const upstream = await fetch(WAITLIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, product: "answeroo" }),
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "upstream error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "network error" }, { status: 502 });
  }
}
