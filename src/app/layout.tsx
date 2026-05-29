import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import { client } from "@/sanity/lib/client";
import { BACKGROUND_QUERY } from "@/sanity/lib/queries";
import type { BackgroundImage } from "@/lib/types";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Misericordia di Gello',
    default: 'Misericordia di Gello',
  },
  description: 'Confraternita Misericordia di Gello — volontariato, soccorso e aggregazione sociale dal 1947.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { backgroundImage } = await client.fetch<{ backgroundImage?: BackgroundImage }>(
    BACKGROUND_QUERY,
    {},
    { next: { tags: ['settings'] } }
  )

  const base = process.env.NEXT_PUBLIC_R2_BASE_URL ?? ''
  const bg = backgroundImage ?? {}
  const clean = (s: string) => s.replace(/[\u200B\u200C\u200D\uFEFF]/g, '').trim()
  const bgVars = {
    ...(bg.mobile  && { '--bg-mobile':  `url('${base}/${clean(bg.mobile)}')` }),
    ...(bg.tablet  && { '--bg-tablet':  `url('${base}/${clean(bg.tablet)}')` }),
    ...(bg.desktop && { '--bg-desktop': `url('${base}/${clean(bg.desktop)}')` }),
    ...(bg.wide    && { '--bg-wide':    `url('${base}/${clean(bg.wide)}')` }),
  } as React.CSSProperties

  return (
    <html
      lang="it"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      style={bgVars}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
