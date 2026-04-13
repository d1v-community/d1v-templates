# AI Assistant SaaS

Subscription AI assistant starter with passwordless auth, Neon data, and hosted checkout.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Optional on-page AI concierge powered by `D1V_PAI_*`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `SignalDesk AI`
- Category: `ai-tools`
- Repository template path: `d1v-community/assistant-saas-template`
- Default prompt: `Create an AI assistant SaaS with database support, member login, and hosted checkout.`

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

- Showcase headline: Turn pricing, onboarding, and live assistance into one operator surface.
- Workflow headline: Structure the product like an assistant business, not a demo bot.
- Starter modules:
  - Conversation history: Recent threads, owner assignment, and unresolved flags.
  - Usage guardrails: Seat limits, credit burn, and model policy snapshots.
  - Prompt operations: Starter prompt packs, onboarding scripts, and fallback replies.
  - Plan framing: Describe exactly what a paid workspace unlocks.
  - Activation handoff: Route successful buyers into setup, imports, or kickoff questions.
  - Team expansion: Show how admins can add seats and credits over time.

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

Optional AI assistant env:

```bash
D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
D1V_PAI_API_KEY=your_project_level_pai_api_key
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real ai assistant saas workflow
- Extend the Drizzle schema for your product entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
- Tune the built-in AI concierge prompt and connect it to your product workflow
