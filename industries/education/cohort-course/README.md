# Cohort Course

Cohort course starter with payments, auth, and Neon-backed enrollment data.

## What You Start With

- Remix + Tailwind application based on `remix-neon-auth-pay`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Live database snapshot route at `/api/template/snapshot`
- Optional on-page AI concierge powered by `D1V_PAI_*`
- Local bootstrap script for pulling project env vars into `.env`

## Product Direction

- App title: `CohortOS`
- Category: `education`
- Repository template path: `d1v-community/cohort-course-template`
- Default prompt: `Create a cohort course product with database support, email login, and hosted checkout.`

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

- Showcase headline: Give the course a cadence, not just a checkout link.
- Workflow headline: Enrollment is only the start of the learning product.
- Starter modules:
  - Week-by-week syllabus: Expose module outcomes, assignments, and live touchpoints.
  - Progress tracking: Track attendance, completion, and deliverables through the cohort.
  - Support rhythm: Keep office hours, group reviews, and feedback windows visible.
  - Cohort timing: Lead with next start date, session cadence, and seat cap.
  - Outcome framing: Promise concrete transformation tied to the syllabus.
  - Post-payment path: Move learners into prep, orientation, and goal-setting fast.

## Local Setup

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/cohort-course-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

You can also export env vars into this repository manually:

```bash
AUTH_TOKEN=your_token \
node scripts/bootstrap-local-env.mjs --template-repo d1v-community/cohort-course-template --write-path .env
```

Optional AI assistant env:

```bash
D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
D1V_PAI_API_KEY=your_project_level_pai_api_key
```

## Suggested Next Build Steps

- Replace the starter landing sections with the real cohort course workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
- Tune the built-in AI concierge prompt and connect it to your product workflow
