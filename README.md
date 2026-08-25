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
the result. The whole site is one page (`app/page.tsx`) composed from the
sections in `components/pelican/`.

## Quote form email

The quote form posts to `app/api/pelican-quote/route.ts`, which delivers the
request by email through [Resend](https://resend.com). Copy `.env.example` to
`.env.local` and fill in `RESEND_API_KEY` for it to work locally; see the
comments in `.env.example` for how delivery addresses are chosen.

## Project layout

- `app/page.tsx` — the one-page site, assembled from section components
- `app/api/pelican-quote/` — quote form delivery (Resend)
- `components/pelican/` — page sections (hero, services, pricing, FAQ, …)
- `components/layout/` — site header and footer
- `data/ventures.ts` — business copy (name, tagline, descriptions)
- `lib/colors.ts` — brand palette
