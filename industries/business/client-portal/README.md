# Client Portal

Client portal starter with passwordless login, Neon persistence, and hosted portal access checkout.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `ClientRoom`
- Category: `business`
- Repository template path: `d1v-community/client-portal-template`
- Default prompt: `Create a client portal product with database support, project updates, and paid portal access.`

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/client-portal-template --write-path .env
pnpm run db:migrate
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/client-portal-template --write-path .env
```

## Suggested Next Build Steps

- Replace the starter landing sections with the real client portal workflow
- Extend the Drizzle schema for your product entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
