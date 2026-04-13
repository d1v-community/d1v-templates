# D1V Templates Registry

`d1v-templates` is the public registry for D1V foundation starters and industry-ready application templates.

It now serves three practical roles:

- a catalog of published foundation repositories
- a machine-readable registry through [`templates.json`](/Users/apple/project/d1v_sever/d1v-templates/templates.json)
- a workspace for generating runnable industry templates before they are promoted into standalone GitHub template repositories

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

## Runnable Industry Templates

The `industries/` tree now contains runnable Remix applications, not README-only blueprints.

Each directory includes:

- a working app cloned from `remix-neon-auth-pay`
- industry-specific homepage and pricing copy via `app/constants/site.ts`
- template-local `AGENTS.md`
- a `.d1v-template.json` metadata file
- `scripts/bootstrap-local-env.mjs` for creating a D1V project and writing the exported env vars into local `.env`

| Template | Category | Product Shape | Directory |
| --- | --- | --- | --- |
| `assistant-saas` | AI tools | paid AI assistant subscription | `industries/ai-tools/assistant-saas` |
| `prompt-library-membership` | AI tools | gated prompt/content membership | `industries/ai-tools/prompt-library-membership` |
| `internal-dashboard` | Business | operations dashboard with paid admin access | `industries/business/internal-dashboard` |
| `client-portal` | Business | client portal with account access and delivery visibility | `industries/business/client-portal` |
| `digital-downloads` | Commerce | digital goods checkout and entitlement flow | `industries/commerce/digital-downloads` |
| `preorder-launch` | Commerce | focused preorder launch funnel | `industries/commerce/preorder-launch` |
| `community-membership` | Creator | paid creator community access | `industries/creator/community-membership` |
| `paid-newsletter` | Creator | premium newsletter membership | `industries/creator/paid-newsletter` |
| `cohort-course` | Education | fixed-window cohort enrollment | `industries/education/cohort-course` |
| `online-course-membership` | Education | recurring course membership | `industries/education/online-course-membership` |
| `clinic-booking` | Local | appointment booking with hosted deposits | `industries/local/clinic-booking` |
| `gym-membership` | Local | recurring gym or studio membership | `industries/local/gym-membership` |

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

- Foundation templates are already published as standalone GitHub template repositories.
- Industry templates are generated locally inside this registry first.
- After verification, each industry template can be pushed to `d1v-community/<name>-template` and promoted into its own GitHub template repository.

## Related Files

- [`foundations/README.md`](/Users/apple/project/d1v_sever/d1v-templates/foundations/README.md)
- [`industries/README.md`](/Users/apple/project/d1v_sever/d1v-templates/industries/README.md)
- [`AGENTS.md`](/Users/apple/project/d1v_sever/d1v-templates/AGENTS.md)
- [`PLAN.md`](/Users/apple/project/d1v_sever/d1v-templates/PLAN.md)
