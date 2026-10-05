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
- **Slots.** `SHOW_CONTENT_SLOTS` controls the labelled placeholders. Set it to
  `false` to hide every "goes here" label before launch.

## Quote form email

The quote form posts to `app/api/pelican-quote/route.ts`, which delivers the
request by email through [Resend](https://resend.com). Copy `.env.example` to
`.env.local` and fill in `RESEND_API_KEY` for it to work locally; see the
comments in `.env.example` for how delivery addresses are chosen.

## Project layout

- `data/site.ts` - every piece of business content and the slot switch
- `app/page.tsx` - the one-page site, assembled from section components
- `app/api/pelican-quote/` - quote form delivery (Resend)
- `app/opengraph-image.tsx` - link preview image, generated at build
- `components/sections/` - page sections (hero, services, pricing, FAQ, ...)
- `components/layout/` - header, footer and the mobile call/text bar
- `components/ui/` - photo slot and before/after slider
- `app/globals.css` - color tokens (light and dark) and shared styles
