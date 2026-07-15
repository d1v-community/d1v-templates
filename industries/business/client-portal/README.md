# Client Portal

Client portal starter with passwordless login, Neon persistence, and hosted portal access checkout.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Optional on-page AI concierge powered by `D1V_PAI_*`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `ClientRoom`
- Category: `business`
- Repository template path: `d1v-community/client-portal-template`
- Default prompt: `Create a client portal product with database support, project updates, and paid portal access.`

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

- Showcase headline: Turn service delivery into a portal clients actually want to log into.
- Workflow headline: Use the portal to reduce chaos, not to mirror your inbox.
- Starter modules:
  - Milestone timeline: Display current phase, dependencies, and blockers in one view.
  - Deliverable browser: Organize files, drafts, approvals, and final assets cleanly.
  - Request queue: Track client asks so scope and response time stay visible.
  - Retainer framing: Tie portal access to ongoing updates, file history, and support continuity.
  - Client onboarding: Use payment success to trigger account setup and project intake.
  - Expansion path: Add new projects, seats, or premium support over time.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/client-portal-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/client-portal-template --write-path .env
```

Optional AI assistant env:

```bash
D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
D1V_PAI_API_KEY=your_project_level_pai_api_key
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real client portal workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
- Tune the built-in AI concierge prompt and connect it to your product workflow
