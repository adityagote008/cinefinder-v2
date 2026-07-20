// Set NEXT_PUBLIC_SITE_URL in your .env.local (and in Vercel's Environment
// Variables) to your real live URL once you know it, e.g.
// https://cinefinder-yourname.vercel.app — this powers the sitemap, robots.txt,
// and Open Graph tags that Google uses to index and preview the site.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://cinefinder.vercel.app";
