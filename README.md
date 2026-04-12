# D1V Templates Registry

`d1v-templates` is the public registry repository for D1V starter kits, foundation templates, and industry-specific blueprint templates.

It serves two roles:

- a **catalog repository** that explains what exists and how to choose it
- a **registry repository** that describes templates in a machine-readable way through [`templates.json`](/Users/apple/project/d1v_sever/d1v-templates/templates.json)

## Repository Structure

```text
d1v-templates/
├── foundations/   # Published base templates and reusable starters
├── industries/    # Industry-specific blueprint templates built on top of foundations
├── docs/          # Workflow and contributor guidance
├── AGENTS.md
├── PLAN.md
└── templates.json
```

## Foundations

Foundation templates are the starting points that can be cloned directly or used as the base layer for industry derivatives.

| Template | Stack | Auth | Payments | Best Fit | Repository |
| --- | --- | --- | --- | --- | --- |
| `remix-neon-auth-pay` | Remix + Neon + Drizzle + Tailwind | Passwordless email | Hosted checkout | membership, SaaS billing, paid access, AI products | `d1v-community/remix-neon-auth-pay` |
| `remix-neon-auth` | Remix + Neon + Drizzle + Tailwind | Passwordless email | No | auth-first apps, internal tools, dashboards, lead capture | `d1v-community/remix-neon-auth-template` |
| `sui-nextjs-auth-template` | Next.js + pnpm workspace + Sui Move | Wallet auth | No | Sui ecosystem products, web3 onboarding, chain-integrated apps | `d1v-community/sui-nextjs-auth-template` |
| `html-template` | Static HTML | No | No | landing pages, quick prototypes, minimal marketing pages | `d1v-community/html-template` |

### Foundation Details

#### `remix-neon-auth-pay`

Primary strengths:

- passwordless login
- Neon/Postgres persistence
- `/pricing` product listing
- hosted checkout integration
- deployment-friendly environment handling

Recommended when you need:

- subscription or membership flows
- paid AI tools
- creator monetization products
- lightweight SaaS checkout without building billing from scratch

#### `remix-neon-auth`

Primary strengths:

- passwordless login
- clean server/client auth boundaries
- Neon/Postgres persistence
- a lighter product surface than the payment-enabled variant

Recommended when you need:

- authenticated dashboards
- internal tools
- MVPs that are not monetized yet
- a clean auth foundation for later product-specific work

#### `sui-nextjs-auth-template`

Primary strengths:

- pnpm monorepo layout
- frontend + backend package split
- wallet-oriented product shape
- Sui deployment and environment conventions

Recommended when you need:

- Sui dApps
- wallet-driven onboarding
- chain-aware product prototypes
- a Next.js instead of Remix starting point

#### `html-template`

Primary strengths:

- minimal footprint
- no framework lock-in
- fast iteration for demos and microsites

Recommended when you need:

- launch pages
- static campaign pages
- quick design spikes
- a no-backend starting point

## Industry Blueprints

Industry blueprints are structured starting points that document how a product in a specific category should extend one of the foundations.

They are intentionally kept in this registry repo as blueprint directories while the foundation repos remain the canonical executable templates.

| Blueprint | Category | Base Foundation | Product Shape |
| --- | --- | --- | --- |
| `assistant-saas` | AI tools | `remix-neon-auth-pay` | paid AI assistant subscription |
| `prompt-library-membership` | AI tools | `remix-neon-auth-pay` | gated prompt/content library |
| `internal-dashboard` | Business | `remix-neon-auth` | authenticated operations dashboard |
| `client-portal` | Business | `remix-neon-auth` | customer login and project/status portal |
| `digital-downloads` | Commerce | `remix-neon-auth-pay` | paid file/product delivery |
| `preorder-launch` | Commerce | `remix-neon-auth-pay` | one-product preorder or waitlist + payment |
| `community-membership` | Creator | `remix-neon-auth-pay` | paid membership/community access |
| `paid-newsletter` | Creator | `remix-neon-auth-pay` | subscriber access and gated posts |
| `cohort-course` | Education | `remix-neon-auth-pay` | fixed-time paid cohort program |
| `online-course-membership` | Education | `remix-neon-auth-pay` | ongoing course membership |
| `clinic-booking` | Local services | `remix-neon-auth` | appointment and patient portal starter |
| `gym-membership` | Local services | `remix-neon-auth-pay` | paid membership and renewal entry point |

## How To Use The Registry

### If you want a runnable starter now

Use one of the published foundation repositories directly:

- `d1v-community/remix-neon-auth-pay`
- `d1v-community/remix-neon-auth-template`
- `d1v-community/sui-nextjs-auth-template`
- `d1v-community/html-template`

### If you want a business-specific direction

Start from the industry blueprint under [`industries/`](/Users/apple/project/d1v_sever/d1v-templates/industries), then apply that blueprint on top of the matching foundation.

## Registry File

The canonical machine-readable catalog is [`templates.json`](/Users/apple/project/d1v_sever/d1v-templates/templates.json).

The registry now distinguishes:

- `foundation` templates
- `industry-blueprint` templates

Each record includes:

- category
- base template relationship
- repository URL
- branch/ref
- path
- publication status
- feature summary

## Current Publishing Model

- The root `d1v-templates` repository is the public registry and documentation hub.
- Foundation templates are published as their own repositories in `d1v-community`.
- Industry blueprints currently live as directories inside this registry repository.
- The next major structural step is to keep expanding industry blueprints and decide which ones should graduate into standalone published template repositories.

## Related Files

- [`foundations/README.md`](/Users/apple/project/d1v_sever/d1v-templates/foundations/README.md)
- [`industries/README.md`](/Users/apple/project/d1v_sever/d1v-templates/industries/README.md)
- [`AGENTS.md`](/Users/apple/project/d1v_sever/d1v-templates/AGENTS.md)
- [`PLAN.md`](/Users/apple/project/d1v_sever/d1v-templates/PLAN.md)
