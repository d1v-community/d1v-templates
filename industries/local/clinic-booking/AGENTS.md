# Agent Guide (AGENTS.md)

Use this file as the execution contract for work in this template.

## Planning First

- Every non-trivial task must start by pruning stale or already-compressed completed items from `PLAN.md`, then writing the current goal, background, selected validators, and todo list before editing.
- `PLAN.md` is the source of truth for scope, order, verification, evidence, and residual risk.
- Keep at most one todo `in_progress` per execution thread unless work was intentionally delegated in parallel.

## Checkoff Rule

- Do not check off a todo until its assigned validators have passed and the evidence is written into `PLAN.md`.
- If verification fails, keep the todo open, record the failure, and add the corrective next step.
- Never mark work done based on implementation alone.

## Minimum Verification Before Checkoff

- `@api-backend-qa`: before checking off an API or backend todo, run at least one local smoke request that proves the happy path works, auth/error handling is correct, and returned data matches the expected shape.
- `@frontend-ui-qa`: before checking off a UI or interaction todo, relevant loading, empty, and error states must exist, the layout and motion must fit the target user, and `pnpm run lint` must pass.
- `@cro-copy-qa`: before checking off a copy todo, rewrite against the CRO-copy standard: ICP + pain + desire, feature-to-benefit framing, and Promise / Proof / Push with short, scannable CTAs.

## Default Commands

- `pnpm run db:migrate`
- `pnpm run db:seed`
- `pnpm run typecheck`
- `pnpm run lint`

Treat failing `typecheck` or `lint` as blockers and record any environment blocker in `PLAN.md`.

## Validator Registry

- `@api-backend-qa`: routes, server logic, DTOs, auth gating, error handling, response shape
- `@frontend-ui-qa`: page structure, forms, interaction quality, loading/empty/error states
- `@cro-copy-qa`: hero copy, proof blocks, CTA hierarchy, onboarding copy, risk-reversal copy
- `@auth-state-qa`: signed-out, signed-in, session expiry, protected routes, account-state edges
- `@data-schema-qa`: schema, migrations, seeds, env assumptions, data integrity
- `@checkout-monetization-qa`: pricing, checkout, entitlements, success/cancel, paywall messaging
- `@responsive-accessibility-qa`: desktop/mobile layout, keyboard reachability, contrast, hierarchy clarity
- `@performance-seo-qa`: metadata, above-the-fold clarity, asset discipline, landing-page scanability

## Working Rules

- Keep diffs focused. Avoid unrelated refactors.
- Prefer existing scripts and patterns over new tooling.
- Do not hardcode secrets or commit `.env`, build output, caches, or deployment metadata.
- Prefer `rg` for search and read files in small chunks.
- If a route needs a special auth or header exception, record it in `PLAN.md` before relying on it.

## Handoff Format

- Each validator handoff must include `Result`, `Checked`, `Passed`, `Failed`, `Not checked`, `Risk`, and `Plan update`.
