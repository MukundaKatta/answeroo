import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Answeroo — The AI receptionist that never sleeps.",
  description:
    "Dentists, salons, law firms, trades. An AI that answers every call, books appointments, and sends reminders.",
  openGraph: {
    title: "Answeroo — The AI receptionist that never sleeps.",
    description:
      "Dentists, salons, law firms, trades. An AI that answers every call, books appointments, and sends reminders.",
    images: [
      {
        url: "https://waitlist-api-sigma.vercel.app/api/og?title=Answeroo&accent=cyan&category=Small%20business",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://waitlist-api-sigma.vercel.app/api/og?title=Answeroo&accent=cyan&category=Small%20business",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-neutral-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
