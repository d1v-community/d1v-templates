# Preorder Launch

Focused preorder launch starter with hosted checkout, auth, and Neon-backed lead capture.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `FirstDrop`
- Category: `commerce`
- Repository template path: `d1v-community/preorder-launch-template`
- Default prompt: `Create a preorder launch page with database support, email login, and hosted checkout.`

## Design Direction

- Visual thesis: An editorial product drop surface with strong merchandising, tighter copy, and entitlement-aware fulfillment cues.
- Content plan:
  - Hero: the offer and why it deserves attention now
  - Support: product framing, packaging, and drop mechanics
  - Detail: what the buyer gets after checkout
  - Final CTA: convert with one clear purchase path
- Interaction thesis:
  - The first viewport should feel like a campaign poster with utility underneath.
  - Merchandising details should read like product direction, not filler bullets.
  - Fulfillment language should reassure the buyer immediately.

## Product Modules

- Showcase headline: Make preorder pages feel like a timed release, not a generic pricing screen.
- Workflow headline: Use urgency carefully, then follow through with trust.
- Starter modules:
  - Release framing: Clarify who this first wave is for and why spots are limited.
  - Reservation proof: Show what the buyer secures by paying today.
  - Update cadence: Promise how launch news and delivery timing will be communicated.
  - Reservation receipt: Store buyer history with status, amount, and expected next step.
  - Launch digest: Feed product updates and milestone notices back into the account area.
  - Final fulfillment: Transition smoothly into full access or shipment when ready.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/preorder-launch-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/preorder-launch-template --write-path .env
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real preorder launch workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
