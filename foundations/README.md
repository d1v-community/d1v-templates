# Foundations

Foundation templates are the executable base repositories in the D1V catalog.

They are designed to be:

- directly clonable from GitHub template repositories
- stable enough to support multiple industry variants
- opinionated about infrastructure, but generic about business logic

The current industry promotion phase standardizes new runnable templates on top of `remix-neon-auth-pay`.

## Current Foundations

- `remix-neon-auth-pay`
  - Type: published foundation
  - Stack: Remix, Neon/Postgres, Drizzle, Tailwind
  - Best for: paid SaaS, memberships, creator products, commerce flows

- `remix-neon-auth`
  - Type: published foundation
  - Stack: Remix, Neon/Postgres, Drizzle, Tailwind
  - Best for: auth-first dashboards, portals, internal tools, pre-monetization apps

- `sui-nextjs-auth-template`
  - Type: published foundation
  - Stack: Next.js, pnpm monorepo, Sui Move
  - Best for: Sui ecosystem applications and wallet-driven flows

- `html-template`
  - Type: published foundation
  - Stack: static HTML
  - Best for: marketing pages, launch pages, and ultra-light prototypes

## Current Constraint

These foundations are currently tracked in the root registry repository as nested git repositories. That is acceptable for the current publication model, but it is a deliberate constraint that should be considered before future layout consolidation work.
