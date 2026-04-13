# Internal Dashboard

Internal operations dashboard starter with auth, database connectivity, and monetization-ready account rails.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `OpsCanvas`
- Category: `business`
- Repository template path: `d1v-community/internal-dashboard-template`
- Default prompt: `Create an internal dashboard product with database support, secure login, and a paid admin access plan.`

## Design Direction

- Visual thesis: A quiet enterprise workstation with clear hierarchy, strong tables, and no marketing-heavy chrome.
- Content plan:
  - Hero: orient the operator around the workspace value immediately
  - Support: show queues, milestones, and KPI surfaces
  - Detail: map the service workflow and account operations model
  - Final CTA: push the buyer into secure access or paid seats
- Interaction thesis:
  - Panels should behave like dashboards, not promo cards.
  - Density should increase confidence without becoming noisy.
  - The page should reward scanning headings, labels, and states.

## Product Modules

- Showcase headline: Replace the hero mindset with a real reporting and actions workspace.
- Workflow headline: Start with orientation, freshness, and next action.
- Starter modules:
  - KPI strip: Compact metrics with trend context and timestamping.
  - Queue table: Approvals, owner assignment, and stuck-state visibility.
  - Incident timeline: A single place for escalation, audit notes, and resolution state.
  - Seat-based access: Map successful checkout to paid operator seats or workspace plans.
  - Managed reporting: Monetize dashboards for clients or partner teams later.
  - Audit trail: Use Drizzle models to track plan changes and role grants.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/internal-dashboard-template --write-path .env
pnpm run db:migrate
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/internal-dashboard-template --write-path .env
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real internal dashboard workflow
- Extend the Drizzle schema for your product entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
