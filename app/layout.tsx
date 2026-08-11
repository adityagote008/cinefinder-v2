import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = "CineFinder — Witness the Cinema";
const description =
  "Picks that actually get your taste. Discover your perfect watch across mood, genre, platform, and vibe. Built by ASG.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s | CineFinder",
  },
  description,
  keywords: [
    "movie recommendations",
    "AI movie finder",
    "what to watch",
    "TV show recommendations",
    "CineFinder",
    "movie recommendation engine",
  ],
  applicationName: "CineFinder",
  authors: [{ name: "Aditya Gote" }],
  creator: "Aditya Gote",
  // Tells search engines it's fine to index and follow links on this site.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "CineFinder",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "hTIFUPzDJRniQnW5lgitd6W5v0xeoaRVoNv_kEkfWjo",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

// Structured data (JSON-LD) — tells search engines exactly what this site
// is in a format they can parse directly, rather than guessing from page
// text. Only factual, verifiable fields are included here — no fabricated
// ratings or review counts, since Google penalizes structured data that
// can't be backed up on the actual page.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CineFinder",
  alternateName: "CineFinder by ASG",
  description,
  url: SITE_URL,
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Aditya Gote",
  },
  creator: {
    "@type": "Person",
    name: "Aditya Gote",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-ink-primary antialiased min-h-screen">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
