# Creator Community Membership

Creator membership starter with login, payments, and Neon-backed member records.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `InnerCircle`
- Category: `creator`
- Repository template path: `d1v-community/community-membership-template`
- Default prompt: `Create a creator community membership product with login, database support, and hosted checkout.`

## Design Direction

- Visual thesis: A creator-led publishing surface with stronger voice, membership cues, and media-led storytelling.
- Content plan:
  - Hero: creator promise and member access hook
  - Support: show the cadence, archive, and premium perks
  - Detail: make post-purchase community or content access tangible
  - Final CTA: push the visitor into a simple paid join flow
- Interaction thesis:
  - Treat content and community as the product, not as filler around checkout.
  - Visual rhythm should feel more like a publication than a dashboard.
  - Use contrast and spacing to create taste instead of loud gradients.

## Product Modules

- Showcase headline: Make the membership feel like an active club with rhythm, archive, and perks.
- Workflow headline: Belonging needs structure or the membership will feel empty.
- Starter modules:
  - Ritual calendar: Show office hours, live sessions, or recurring member moments.
  - Archive depth: Make premium posts, replays, and downloads easy to browse.
  - Perk delivery: Bundle templates, chat access, or discounts into the account area.
  - Founding member angle: Use limited-time positioning without overcomplicating the offer.
  - Upgrade path: Introduce higher tiers later through coaching or small-group access.
  - Community support: Blend AI answers with creator touchpoints for routine questions.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/community-membership-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/community-membership-template --write-path .env
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real creator community membership workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
