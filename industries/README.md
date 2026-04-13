# Industry Templates

The `industries/` tree now contains runnable application templates generated from `foundations/remix-neon-auth-pay`.

These directories are intended to be:

- locally runnable
- ready for database-backed verification
- ready to be promoted into standalone GitHub template repositories after review

## Categories

- `ai-tools`
- `business`
- `commerce`
- `creator`
- `education`
- `local`

## What Every Industry Template Includes

- passwordless auth
- Neon / PostgreSQL + Drizzle
- hosted checkout and `/pricing`
- local env bootstrap via `scripts/bootstrap-local-env.mjs`
- template-local `AGENTS.md`
- industry copy in `app/constants/site.ts`

## Promotion Workflow

1. Generate the industry directory from `remix-neon-auth-pay`.
2. Pull a real `.env` from `d1v-server` into the template.
3. Run migrations, typecheck, and targeted app verification.
4. Push the verified directory to `d1v-community/<name>-template`.
5. Enable GitHub template mode for that repository.
