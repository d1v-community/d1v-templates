# Paid Newsletter

Paid newsletter starter with authentication, checkout, and Neon-backed subscriber data.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `BriefClub`
- Category: `creator`
- Repository template path: `d1v-community/paid-newsletter-template`
- Default prompt: `Create a paid newsletter membership product with database support and hosted checkout.`

## Design Direction

- Visual thesis: A creator-led publishing surface with stronger voice, membership cues, and media-led storytelling.
- Content plan:
  - Hero: creator promise and member access hook
  - Support: show the cadence, archive, and premium perks
  - Detail: make post-purchase community or content access tangible
  - Final CTA: push the visitor into a simple paid join flow
- Interaction thesis:
  - Treat content and community as the product, not as filler around checkout.
  - Visual rhythm should feel more like a publication than a dashboard.
  - Use contrast and spacing to create taste instead of loud gradients.

## Product Modules

- Showcase headline: Make the newsletter feel like a publication with a clean member archive and sharp offer.
- Workflow headline: The archive is part of the product, not an afterthought.
- Starter modules:
  - Lead issue: Feature one standout issue and one short reason to care.
  - Archive browser: Browse by topic, date, or series once the member is inside.
  - Format clarity: Tell readers whether they get text, audio, downloads, or all three.
  - Paid-only archive: Position the archive as the compounding reason to stay subscribed.
  - Member extras: Add occasional downloads, notes, or Q&A without bloating the core offer.
  - Renewal signal: Show issue cadence and editorial consistency clearly.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/paid-newsletter-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/paid-newsletter-template --write-path .env
```

## Suggested Next Build Steps

- Replace the starter landing sections with the real paid newsletter workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
