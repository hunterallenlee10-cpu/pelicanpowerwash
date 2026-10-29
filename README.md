# Pelican Power Wash

Marketing site for Pelican Power Wash — professional power washing and
exterior cleaning for residential and commercial properties.

Built with [Next.js](https://nextjs.org) (App Router), Tailwind CSS v4, and
TypeScript. Extracted from the Lee Enterprises Unlimited multi-venture site
([hunterallenlee10-cpu/leu](https://github.com/hunterallenlee10-cpu/leu)) into
its own standalone repository.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see
the result. The site is one page (`app/page.tsx`) composed from the sections in
`components/sections/`, plus a privacy page.

## Editing content

All business content lives in **`data/site.ts`**: phone, email, services,
prices, FAQ, service towns, reviews, photos and social links. Components read
from it, so most edits never touch a component.

- **Photos.** Put files in `public/photos/` and set the matching `src` in
  `data/site.ts`. Empty photo slots show a labelled placeholder frame.
- **Reviews.** Paste real reviews into `reviews`. Until then the section shows
  labelled slots.
- **Slots.** `SHOW_CONTENT_SLOTS` controls the labelled placeholders. It is
  `false` for the live site, so empty slots stay hidden. Set it to `true`
  locally to see every spot that still needs content.
- **Icons.** `app/icon.png` (browser tab) and `app/apple-icon.png` (phone home
  screen) are small copies of the logo. Regenerate them if the logo changes.

## Quote form email

The quote form posts to `app/api/pelican-quote/route.ts`, which delivers the
request by email through [Resend](https://resend.com). Copy `.env.example` to
`.env.local` and fill in `RESEND_API_KEY` for it to work locally; see the
comments in `.env.example` for how delivery addresses are chosen.

## Scroll story, instant price, gauge and game

The homepage opens with "The Wash", a scroll-driven story that cleans a house
chapter by chapter, followed by a tap-to-price builder, the before/after
gallery, a pressure gauge and a "wash this driveway" game.

- **Assets.** Drop Higgsfield downloads into `assets-inbox/` (filenames in
  `assets-inbox/README.md`), then run `pnpm assets`. It writes web-ready
  images and video frames to `public/story/` and `data/story-manifest.json`.
  Missing files become labelled placeholders, so the site always builds.
- **Copy and timing** for the story: `data/story.ts`.
- **Prices** come from `pricing` in `data/site.ts`. The builder's logic is
  `lib/pricing.ts` (tests: `pnpm test`). Items with no price show "Quoted
  within 24 hrs".
- **Pin positions** on the price builder house: `data/hotspots.ts`. Open the
  site with `?hotspots=edit` to drag pins and copy the numbers.
- **PSI ranges** for the gauge: `data/surfaces.ts` (`confirmed: false` until
  the crew checks them).
- **QA screenshots:** `pnpm build && pnpm start -p 3100`, then
  `node qa/shoot.mjs` writes `qa/screenshots/`.

## Project layout

- `data/site.ts` - every piece of business content and the slot switch
- `app/page.tsx` - the one-page site, assembled from section components
- `app/api/pelican-quote/` - quote form delivery (Resend)
- `app/opengraph-image.tsx` - link preview image, generated at build
- `components/sections/` - page sections (services, pricing, FAQ, ...)
- `components/story/` - scroll story, instant price, method gauge, wash game
- `components/layout/` - header, footer and the quote bar
- `components/ui/` - photo slot and before/after slider
- `app/globals.css` - color tokens (light and dark) and shared styles
