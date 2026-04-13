# AI Assistant SaaS

Subscription AI assistant starter with passwordless auth, Neon data, and hosted checkout.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `SignalDesk AI`
- Category: `ai-tools`
- Repository template path: `d1v-community/assistant-saas-template`
- Default prompt: `Create an AI assistant SaaS with database support, member login, and hosted checkout.`

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/assistant-saas-template --write-path .env
pnpm run db:migrate
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/assistant-saas-template --write-path .env
```

## Suggested Next Build Steps

- Replace the starter landing sections with the real ai assistant saas workflow
- Extend the Drizzle schema for your product entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
