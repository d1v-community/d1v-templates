# Agent Guide (AGENTS.md)

These instructions apply to the entire `d1v-templates` repository unless a deeper `AGENTS.md` adds stricter task-local rules.

Reusable cross-project workflow guidance lives in `docs/AI_WORKFLOW_TEMPLATE.md`, including a standard way to define and use a Sub-Agent Registry.

## Repository Intent

- Treat `d1v-templates` as an open-template workspace, not as a single app.
- Prefer changes that improve template reusability, open-source readiness, and machine-readable metadata.
- The target foundation template locations are:
  - `foundations/remix-neon-auth`
  - `foundations/remix-neon-auth-pay`
- Until the directory migration is complete, the current source directories remain:
  - `remix-neon-auth`
  - `remix-neon-auth-pay`
- Industry templates should build on one of those foundations rather than inventing a third base layer.

## Default Database Workflow

When working inside a template that includes direct database scripts, use direct database mode by default:

- `pnpm run db:migrate`
- `pnpm run db:seed`

These scripts require `DATABASE_URL` in `.env`.

If a template still ships API-mode migration scripts or legacy instructions, record any exception in `PLAN.md` before using it.

## Type Checking (Mandatory)

After every code change in a TypeScript template, run TypeScript checks and fix all reported issues:

- `pnpm run typecheck`
- `pnpm run typecheck:watch`

Treat type errors as build blockers and resolve them before handoff.

For non-TypeScript-only edits such as metadata or markdown changes, use a relevant lightweight verification step instead of running typecheck mechanically.

## Coding & Tooling

- Keep diffs minimal and focused on the task. Avoid unrelated refactors.
- Match the existing code style. Use `pnpm run lint` / `pnpm run format` if needed.
- Do not add dependencies unless strictly necessary and approved by the user.
- Prefer `rg` for search and read files in small chunks to avoid truncated output.
- Do not commit `.env`, `node_modules`, build artifacts, nested `.git` state, or local deployment cache into published template output.

## Auth Conventions (Client)

- Frontend API calls are same-origin and may use a global fetch interceptor to inject `Authorization: Bearer <token>` for `/api/*` paths.
- Do not manually append `Authorization` headers unless there is a specific exception documented in the template.

## Security

- Do not print or hardcode secrets.
- Respect HTTP-only cookies for SSR, and use localStorage token only for client-side concerns.
- Keep example env files safe for public distribution.

## Plan-Driven Execution

- For any non-trivial task, create or update a written plan before editing code.
- The default plan file for cross-template work is `PLAN.md` at the repository root.
- Independent template-local work may use a task-specific plan file, but the root `PLAN.md` should still link to it or mention the split.
- Treat the plan as the source of truth for execution order, current status, verification state, and remaining risks.
- Every meaningful todo must be written down in the plan.
- Structure todos as small verifiable units. Each todo should include:
  - the target outcome or deliverable
  - the owner, including any relevant sub-agent
  - the verification method
  - the completion status
- Keep at most one todo actively in progress per execution thread unless parallel work is intentionally delegated.

## Sub-Agent Construction

- When using sub-agents, define them by responsibility, not by vague role names alone.
- Each sub-agent assignment must state:
  - scope and boundaries
  - files, routes, or modules it is responsible for
  - expected output or artifact
  - required checks or review criteria
  - handoff format back to the main agent
- Sub-agents must not mark work as done based only on implementation.
- Sub-agents must report what was verified, what passed, what was not checked, and any residual risk.
- Prefer reusable validation-oriented sub-agents described in the registry inside `PLAN.md`.

## Verification Before Status Updates

- Do not mark a todo as complete until its required verification has passed.
- Verification can include type checks, targeted tests, manual flow review, route checks, metadata validation, or data consistency checks.
- If verification fails, update the plan with the failure, keep the todo open, and record the next corrective action.
- After a todo passes verification, immediately update the plan so status reflects checked reality.
- When reporting completion, include concise evidence such as commands run, files reviewed, or constraints confirmed.

## Plan Maintenance And Compression

- Update the plan continuously as work progresses.
- When a phase is complete or the plan becomes long:
  - keep active todos, blockers, decisions, and remaining risks in full detail
  - compress completed items into short outcome summaries with essential evidence
  - remove stale brainstorming that no longer affects execution
- Compression must preserve decisions, unresolved issues, and anything needed for the next agent to resume safely.

## Operational

- Do not run `git commit` or create branches unless explicitly asked by the user.
- When unsure about environment-specific values, ask the user for clarification instead of guessing.
- If root instructions and template-local instructions disagree, record the conflict in `PLAN.md` before proceeding.

---


