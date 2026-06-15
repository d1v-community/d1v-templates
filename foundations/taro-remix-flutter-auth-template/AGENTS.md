# Agent Guide (AGENTS.md)

These instructions apply to the entire repository. Follow them when making changes or running tasks as an automated agent.

## Default Database Workflow
- Direct DB scripts are acceptable in this repository when environment is already configured:
  - `pnpm run db:migrate`
  - `pnpm run db:seed`
- API-based scripts are also available:
  - `pnpm run db:migrate:api`
  - `pnpm run db:seed:api`
- Required environment for direct DB mode:
  - `DATABASE_URL`
- Required environment for API mode:
  - `PROJECT_ID`
  - `OPCODE_API_BASE` (e.g. `http://localhost:9191/api`) or `BACKEND_ADMIN_API_BASE`
  - `AUTH_TOKEN` (Bearer token), or pass a token via `--token`, `--token-file`, or STDIN.
- Optional environment:
  - `MIGRATIONS_FOLDER` (defaults to `drizzle`)
  - `SEED_FILE` (defaults to `drizzle/0001_init.sql`)

Note for AI: either workflow is acceptable. Match the environment actually available in the task.

## Type Checking (Mandatory)
- After every code change, run TypeScript checks and fix all reported issues:
  - `pnpm run typecheck` (single run)
  - `pnpm run typecheck:watch` (continuous during development)
- Treat type errors as build blockers and resolve them before handing off.

## Coding & Tooling
- Keep diffs minimal and focused on the task. Avoid unrelated refactors.
- Match the existing code style. Use `pnpm run lint` / `pnpm run format` if needed (do not introduce new tooling without approval).
- Do not add dependencies unless strictly necessary and approved by the user.
- Prefer `rg` for search and read files in small chunks (≤250 lines) to avoid truncated output.

## Auth Conventions (Client)
- Frontend API calls are same-origin and use a global fetch interceptor to inject `Authorization: Bearer <token>` for `/api/*` paths.
- Do not manually append `Authorization` headers unless there is a specific exception.

## Security
- Do not print or hardcode secrets. Avoid exposing `DATABASE_URL` when possible (hence API mode by default).
- Respect HTTP-only cookies for SSR, and use localStorage token only for client-side concerns.

## Operational
- Do not run `git commit` or create branches unless explicitly asked by the user.
- When unsure about environment-specific values, ask the user for clarification instead of guessing.

---

中文提示（简要）：
- 直连数据库脚本和 API 模式都可用；优先使用当前环境最直接可执行的方式。
- 每次修改后必须运行 `pnpm run typecheck` 并修复类型错误。
- 保持变更最小化，遵循现有代码风格；非必要不要新增依赖。
