# Prompt Library Membership

Paid prompt library starter with auth, Neon persistence, and member checkout.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `PromptVault`
- Category: `ai-tools`
- Repository template path: `d1v-community/prompt-library-membership-template`
- Default prompt: `Create a paid prompt library membership product with database support and hosted checkout.`

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/prompt-library-membership-template --write-path .env
pnpm run db:migrate
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/prompt-library-membership-template --write-path .env
```

## Suggested Next Build Steps

- Replace the starter landing sections with the real prompt library membership workflow
- Extend the Drizzle schema for your product entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
