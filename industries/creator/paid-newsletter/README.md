# Paid Newsletter

Paid newsletter starter with authentication, checkout, and Neon-backed subscriber data.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `BriefClub`
- Category: `creator`
- Repository template path: `d1v-community/paid-newsletter-template`
- Default prompt: `Create a paid newsletter membership product with database support and hosted checkout.`

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/paid-newsletter-template --write-path .env
pnpm run db:migrate
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/paid-newsletter-template --write-path .env
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real paid newsletter workflow
- Extend the Drizzle schema for your product entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
