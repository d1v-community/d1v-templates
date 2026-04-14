# Clinic Booking

Clinic booking starter with secure login, deposits, and Neon-backed patient records.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Optional on-page AI concierge powered by `D1V_PAI_*`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `ClinicFlow`
- Category: `local`
- Repository template path: `d1v-community/clinic-booking-template`
- Default prompt: `Create a clinic booking product with database support, secure login, and hosted payment for deposits.`

## Design Direction

- Visual thesis: A service-first booking and membership surface focused on trust, availability, and action on mobile.
- Content plan:
  - Hero: trust signal, service promise, and immediate booking or plan CTA
  - Support: hours, plans, availability, and common next actions
  - Detail: explain what happens before and after a booking or signup
  - Final CTA: move the visitor into a clear service transaction
- Interaction thesis:
  - Make time, staff, and capacity easy to scan.
  - Trust should come from clarity, not from decorative polish alone.
  - Primary actions should always feel one tap away.

## Product Modules

- Showcase headline: Make appointments, plans, and patient questions feel clear from the first tap.
- Workflow headline: Trust is built through timing, clarity, and follow-through.
- Starter modules:
  - Availability board: Show upcoming slots and provider availability clearly.
  - Visit type selector: Differentiate consultations, follow-ups, and memberships.
  - Preparation notes: Explain arrival time, required documents, and visit expectations.
  - Patient portal: Show bookings, history, and post-visit guidance in one place.
  - Reminder flow: Connect upcoming visits to simple reminder and prep messaging.
  - Plan management: Use recurring payment rails for premium care or membership plans.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/clinic-booking-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/clinic-booking-template --write-path .env
```

Optional AI assistant env:

```bash
D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
D1V_PAI_API_KEY=your_project_level_pai_api_key
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real clinic booking workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
- Tune the built-in AI concierge prompt and connect it to your product workflow
