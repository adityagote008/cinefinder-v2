# CineFinder — by ASG

AI-powered movie/TV recommendation engine. Next.js 15 + TypeScript + Tailwind CSS + Framer Motion, backed by the Gemini API. Built to run entirely on free tiers — no domain purchase, no hosting cost, no paid API required.

## 1. Get two free API keys

**Gemini (for recommendations)**
1. Go to https://aistudio.google.com
2. Sign in with a Google account (no credit card needed)
3. Click **Get API key** → **Create API key** → copy it

The app uses `gemini-2.5-flash-lite`, which has the most generous free-tier daily quota. Exact numbers change over time — check the live limit for your project inside AI Studio before you rely on it.

**TMDB (for movie/show poster thumbnails)**
1. Go to https://www.themoviedb.org and create a free account
2. Go to **Settings → API → Create → Developer**, fill the short form
3. Copy the **API Key (v3 auth)** value (not the Read Access Token)

Both are free forever, no credit card.

## 2. Run locally

```bash
npm install
cp .env.local.example .env.local
# paste both keys into .env.local
npm run dev
```

Open http://localhost:3000.

## 3. Deploy for free (Vercel)

1. Push this project to a new GitHub repo (public or private, both free)
2. Go to https://vercel.com → **New Project** → import the repo
3. In **Environment Variables**, add both:
   - `GEMINI_API_KEY` = your Gemini key
   - `TMDB_API_KEY` = your TMDB key
4. Click **Deploy**

You'll get a free URL like `cinefinder-yourname.vercel.app` — no domain purchase required. Netlify works the same way if you'd rather use that.

## Why the key is safe

The Gemini key is only ever read on the server, inside `app/api/recommend/route.ts` (`process.env.GEMINI_API_KEY`, no `NEXT_PUBLIC_` prefix). It's never sent to the browser, so it can't be scraped out of your site's network tab.

## Project structure

```
app/
  page.tsx              — screen router (home / filters / results)
  api/recommend/route.ts — server-side Gemini call + basic rate limiting
components/              — Header, Hero, QuickPick, FilterChip, MovieCard, etc.
hooks/useFilters.ts       — filter selection state
lib/constants.ts          — mood/genre/category/style option lists
lib/gemini.ts              — Gemini prompt building + fetch
types/index.ts             — shared TypeScript types
```

## Notes on the free tier

- Requests are capped client-side per IP (8/minute) as a courtesy guard against burst usage — it's best-effort only (resets on server cold start), not a hard limit.
- If you hit a `429` from Gemini, it means the daily/per-minute quota was reached — wait for the reset (daily quotas reset at midnight Pacific time) or reduce request volume.
- Don't enable billing on the same Google Cloud project unless you want to lose the free tier for it — use a separate project if you ever need to go paid.
