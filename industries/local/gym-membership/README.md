# Gym Membership

Gym membership starter with auth, hosted checkout, and Neon-backed member records.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `FlexPass`
- Category: `local`
- Repository template path: `d1v-community/gym-membership-template`
- Default prompt: `Create a gym membership product with database support, member login, and hosted checkout.`

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

- Showcase headline: Blend membership sales, class rhythm, and facility trust into one cleaner local product.
- Workflow headline: Sell the plan, then reinforce the habit.
- Starter modules:
  - Plan comparison: Keep monthly, annual, and premium coaching plans easy to scan.
  - Class calendar: Show daily sessions and coach highlights near the purchase path.
  - First-week guidance: Use onboarding to direct new members into their first classes or check-in.
  - Attendance history: Show class streaks, visits, or milestone counts.
  - Membership management: Let users review plan state, billing, and upgrade options.
  - Community prompts: Blend AI answers with local staff guidance for routine questions.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/gym-membership-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/gym-membership-template --write-path .env
```

## Suggested Next Build Steps

- Replace the starter landing sections with the real gym membership workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
