# Prompt Library Membership

Paid prompt library starter with auth, Neon persistence, and member checkout.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Optional on-page AI concierge powered by `D1V_PAI_*`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `PromptVault`
- Category: `ai-tools`
- Repository template path: `d1v-community/prompt-library-membership-template`
- Default prompt: `Create a paid prompt library membership product with database support and hosted checkout.`

## Design Direction

- Visual thesis: A luminous command surface that feels like operating a live intelligence product, not browsing a generic SaaS landing page.
- Content plan:
  - Hero: operator-grade promise plus immediate paid access CTA
  - Support: live signal, memory, and usage guardrails
  - Detail: workspace modules that show how the product gets used every day
  - Final CTA: move the visitor into pricing or login without friction
- Interaction thesis:
  - Telemetry panels should feel layered and live, not boxed and static.
  - Accent motion should suggest streaming data rather than decorative glow.
  - Assistant prompts should feel operational and specific to the offer.

## Product Modules

- Showcase headline: Package prompt knowledge like a premium catalog with guided discovery built in.
- Workflow headline: Treat the catalog like a product line, not a download dump.
- Starter modules:
  - Search by workflow: Group prompts by jobs-to-be-done, not by random titles.
  - Pack previews: Show excerpts, outcomes, and setup notes before the paywall.
  - Saved stacks: Let members bookmark packs for teams, launches, or verticals.
  - Membership promise: Everything new is included as long as the member stays active.
  - Drop calendar: Use issue-style release notes to keep value visible.
  - Upsell path: Reserve custom packs or consulting bundles for premium tiers later.

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

Optional AI assistant env:

```bash
D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
D1V_PAI_API_KEY=your_project_level_pai_api_key
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real prompt library membership workflow
- Extend the Drizzle schema for your product entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
- Tune the built-in AI concierge prompt and connect it to your product workflow
