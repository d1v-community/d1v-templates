# D1V Templates Registry

`d1v-templates` is the public registry for D1V foundation starters and industry-ready application templates.

It now serves three practical roles:

- a catalog of published foundation repositories
- a machine-readable registry through [`templates.json`](/Users/apple/project/d1v_sever/d1v-templates/templates.json)
- a workspace that still keeps local copies of the industry templates that have now been promoted into standalone GitHub template repositories

## Repository Structure

```text
d1v-templates/
├── foundations/   # Published base templates and reusable starters
├── industries/    # Runnable industry templates generated from remix-neon-auth-pay
├── docs/          # Workflow and contributor guidance
├── AGENTS.md
├── PLAN.md
└── templates.json
```

## Foundations

Foundation templates are the stable base layer in the D1V catalog.

| Template | Stack | Auth | Payments | Best Fit | Repository |
| --- | --- | --- | --- | --- | --- |
| `remix-neon-auth-pay` | Remix + Neon + Drizzle + Tailwind | Passwordless email | Hosted checkout | SaaS billing, memberships, paid access, AI products | `d1v-community/remix-neon-auth-pay` |
| `remix-neon-auth` | Remix + Neon + Drizzle + Tailwind | Passwordless email | No | internal tools, portals, auth-first MVPs | `d1v-community/remix-neon-auth-template` |
| `sui-nextjs-auth-template` | Next.js + pnpm workspace + Sui Move | Wallet auth | No | Sui ecosystem applications | `d1v-community/sui-nextjs-auth-template` |
| `html-template` | Static HTML | No | No | landing pages and light prototypes | `d1v-community/html-template` |

The current promotion track uses `remix-neon-auth-pay` as the canonical base for all new industry templates so that auth, Neon, pricing, checkout, and local env bootstrap are consistent across categories.

## Industry Templates

The `industries/` tree now contains runnable Remix applications, and each one is also published as its own GitHub template repository in `d1v-community`.

Each directory includes:

- a working app cloned from `remix-neon-auth-pay`
- industry-specific homepage and pricing copy via `app/constants/site.ts`
- template-local `AGENTS.md`
- a `.d1v-template.json` metadata file
- `scripts/bootstrap-local-env.mjs` for creating a D1V project and writing the exported env vars into local `.env`

| Template | Category | Product Shape | GitHub Template Repository |
| --- | --- | --- | --- |
| `assistant-saas` | AI tools | paid AI assistant subscription | `d1v-community/assistant-saas-template` |
| `prompt-library-membership` | AI tools | gated prompt/content membership | `d1v-community/prompt-library-membership-template` |
| `internal-dashboard` | Business | operations dashboard with paid admin access | `d1v-community/internal-dashboard-template` |
| `client-portal` | Business | client portal with account access and delivery visibility | `d1v-community/client-portal-template` |
| `digital-downloads` | Commerce | digital goods checkout and entitlement flow | `d1v-community/digital-downloads-template` |
| `preorder-launch` | Commerce | focused preorder launch funnel | `d1v-community/preorder-launch-template` |
| `community-membership` | Creator | paid creator community access | `d1v-community/community-membership-template` |
| `paid-newsletter` | Creator | premium newsletter membership | `d1v-community/paid-newsletter-template` |
| `cohort-course` | Education | fixed-window cohort enrollment | `d1v-community/cohort-course-template` |
| `online-course-membership` | Education | recurring course membership | `d1v-community/online-course-membership-template` |
| `clinic-booking` | Local | appointment booking with hosted deposits | `d1v-community/clinic-booking-template` |
| `gym-membership` | Local | recurring gym or studio membership | `d1v-community/gym-membership-template` |

## Local Verification Flow

Every payment-based Remix template now supports the same local bootstrap path:

```bash
pnpm install
pnpm run env:bootstrap -- --write-path .env
pnpm run db:migrate
pnpm run dev
```

The bootstrap script calls:

1. `POST /api/projects/create-with-integrations`
2. `GET /api/projects/{project_id}/env-vars/export`
3. writes the exported content into local `.env`

Required inputs:

- `AUTH_TOKEN`
- `BACKEND_ADMIN_API_BASE` or `D1V_API_BASE`
- optional `--template-repo` override

## Registry Model

The canonical machine-readable catalog is [`templates.json`](/Users/apple/project/d1v_sever/d1v-templates/templates.json).

It currently distinguishes:

- `foundation`
- `industry-template`

Each record includes:

- category
- base-template relationship
- repository URL and path
- publication status
- feature summary

## Publishing Model

- Foundation templates are published as standalone GitHub template repositories.
- The first 12 industry templates are also published as standalone GitHub template repositories.
- The root registry continues to keep a local mirror of those industry templates for documentation, generation, and future bulk updates.

## Related Files

- [`foundations/README.md`](/Users/apple/project/d1v_sever/d1v-templates/foundations/README.md)
- [`industries/README.md`](/Users/apple/project/d1v_sever/d1v-templates/industries/README.md)
- [`AGENTS.md`](/Users/apple/project/d1v_sever/d1v-templates/AGENTS.md)
- [`PLAN.md`](/Users/apple/project/d1v_sever/d1v-templates/PLAN.md)
