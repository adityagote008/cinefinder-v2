import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = "CineFinder — AI-Powered Movie & TV Recommendations";
const description =
  "Discover your perfect watch with AI-powered movie and TV recommendations tailored to your exact mood, genre, platform, and vibe. Built by ASG.";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-ink-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
