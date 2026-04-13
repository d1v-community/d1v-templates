# Agent Guide (AGENTS.md)

These instructions apply to the entire `internal-dashboard-template` template repository.

Repository-level workflow guidance also exists at the parent `d1v-templates/AGENTS.md`. If the two guides disagree, record the conflict in a local `PLAN.md` or in the root `d1v-templates/PLAN.md` before proceeding.

## Default Database Workflow

Use direct database scripts by default:

- `pnpm run db:migrate`
- `pnpm run db:seed`

These scripts require `DATABASE_URL` in `.env`.

The `:api` variants still exist for platform-managed workflows, but they are exceptions rather than the default.

## Type Checking (Mandatory)

After every code change, run TypeScript checks and fix all reported issues:

- `pnpm run typecheck`
- `pnpm run typecheck:watch`

Treat type errors as build blockers and resolve them before handoff.

## Coding & Tooling

- Keep diffs minimal and focused on the task. Avoid unrelated refactors.
- Match the existing code style. Use `pnpm run lint` / `pnpm run format` if needed.
- Do not add dependencies unless strictly necessary and approved by the user.
- Prefer `rg` for search and read files in small chunks.

## Auth Conventions (Client)

- Frontend API calls are same-origin and should prefer the existing auth conventions for `/api/*` routes.
- Do not manually append `Authorization` headers unless a concrete route requires a documented exception.
- Documented exception: the built-in `/pricing` flow currently restores auth from local `auth-token` and explicitly sends `Authorization: Bearer <token>` to `/api/auth/me`, `/api/auth/sync-cookie`, and `/api/pay/create`.

## Security

- Do not print or hardcode secrets.
- Respect HTTP-only cookies for SSR, and use localStorage token only for client-side concerns.
- Do not commit `.env`, build output, or local deployment caches.

## Plan-Driven Execution

- For any non-trivial task, create or update a written plan before editing code.
- Treat the plan as the source of truth for execution order, verification state, and remaining risks.
- Every meaningful todo should include:
  - target outcome
  - owner, including any sub-agent
  - verification method
  - current status
- Do not mark a todo complete until required verification has passed.

## Sub-Agent Construction

- Define sub-agents by responsibility rather than vague role names.
- Each sub-agent assignment should state:
  - scope and boundaries
  - owned files, routes, or modules
  - expected output
  - required checks
  - handoff format
- Sub-agents must report what passed, what failed, what was not checked, and remaining risk.

## Operational

- Do not run `git commit` or create branches unless explicitly asked.
- When environment-specific values are unclear, ask instead of guessing.

---

中文提示（简要）：

- 默认使用 `db:migrate` / `db:seed`。
- 每次改代码后必须跑 `pnpm run typecheck`。
- `/pricing` 相关客户端请求目前是一个明确的 Bearer token 例外。
- 非简单任务先写计划，再执行。
