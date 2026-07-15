# Digital Downloads

Digital download starter with auth, Neon data, and hosted checkout.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `DownloadPort`
- Category: `commerce`
- Repository template path: `d1v-community/digital-downloads-template`
- Default prompt: `Create a digital downloads storefront with database support, member login, and hosted checkout.`

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

- Showcase headline: Stage digital goods like a premium catalog, then deliver them cleanly after checkout.
- Workflow headline: The product page matters, but the download experience closes the trust loop.
- Starter modules:
  - Flagship bundle: Use one dominant product story to anchor the page.
  - What is included: Spell out file types, templates, and bonus assets clearly.
  - Usage rights: Make licensing simple to scan before purchase.
  - Download locker: Give buyers a clean history of purchases and files.
  - Update feed: Ship revised files or new bonus assets without manual support.
  - Cross-sell logic: Suggest bundles or memberships after a successful purchase.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/digital-downloads-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/digital-downloads-template --write-path .env
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real digital downloads workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
