# Online Course Membership

Course membership starter with auth, billing, and Neon-backed student progress data.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Optional on-page AI concierge powered by `D1V_PAI_*`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `LessonLoop`
- Category: `education`
- Repository template path: `d1v-community/online-course-membership-template`
- Default prompt: `Create an online course membership product with database support and hosted checkout.`

## Design Direction

- Visual thesis: A structured learning experience that emphasizes progression, schedules, and instructional trust.
- Content plan:
  - Hero: outcome, cadence, and access path
  - Support: curriculum, milestones, and learner guidance
  - Detail: show how the student moves through the product
  - Final CTA: enroll, log in, or review pricing
- Interaction thesis:
  - Progress surfaces should feel calm and instructional.
  - Sequence and milestones should be more visible than visual effects.
  - Trust comes from structure and clarity, not hype.

## Product Modules

- Showcase headline: Package lessons, progress, and member access like a real learning product.
- Workflow headline: Build for progression, not just content storage.
- Starter modules:
  - Learning tracks: Group lessons by outcome, difficulty, or role.
  - Progress state: Persist watched, completed, and next-up lesson states.
  - Resource shelf: Bundle worksheets, links, or downloads into each track.
  - Core library: Use the archive as the main reason to subscribe.
  - New lesson drops: Signal freshness with a predictable release rhythm.
  - Upgrade ladder: Add coaching or cohort layers later without rebuilding the foundation.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/online-course-membership-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
BACKEND_ADMIN_API_BASE=http://localhost:8999 \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/online-course-membership-template --write-path .env
```

Optional AI assistant env:

```bash
D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
D1V_PAI_API_KEY=your_project_level_pai_api_key
```


## Suggested Next Build Steps

- Replace the starter landing sections with the real online course membership workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
- Tune the built-in AI concierge prompt and connect it to your product workflow
