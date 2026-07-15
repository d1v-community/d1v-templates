# Goal: Repair Production Environment Variables And Database Connectivity

## Background

- Current Vercel project: `remix-neon-auth`
- Public production domain: `https://pay-deme.d0v.xyz`
- Current production response is public, but the page shows `DATABASE_URL` missing and a failed query against `users`
- Vercel `production` environment currently has no configured variables

## Selected Validators

- `@data-schema-qa`
- `@api-backend-qa`
- `@performance-seo-qa`
- `@checkout-monetization-qa`

## Todo List

- [x] Confirm the minimum required production environment variables and compare local availability against Vercel production.
  - Owner: main agent
  - Verification: local variable presence and `vercel env ls production`
  - Status: completed
  - Evidence: local `.env` contains values for `DATABASE_URL`, `RESEND_API_KEY`, `JWT_SECRET`, `PAY_BASE_URL`, and `PAY_API_TOKEN`; `vercel env ls production` initially returned no variables for `remix-neon-auth`.
  - Notes: do not print secret values in logs or handoff.

- [x] Populate Vercel production environment variables needed for app boot, auth, and payment URL generation.
  - Owner: main agent
  - Verification: Vercel CLI shows the expected production variable names exist
  - Status: completed
  - Evidence: added `DATABASE_URL`, `RESEND_API_KEY`, `JWT_SECRET`, `PAY_BASE_URL`, `PAY_API_TOKEN`, `APP_URL`, and `LOG_LEVEL` to Vercel production; follow-up `vercel env ls production` showed all seven names as encrypted production variables.
  - Notes: set `APP_URL` to `https://pay-deme.d0v.xyz` even though it is not in local `.env`.

- [x] Redeploy or promote production so the updated environment variables are active.
  - Owner: main agent
  - Verification: a fresh production deployment is created after env changes
  - Status: completed
  - Evidence: `vercel redeploy dpl_AfxtG7KmYNFsEGUMmgwwkpQ4RccR --target production` created new ready deployment `dpl_WUc8eyNLPBFyCusrBRPnVxQ3Hga2` at `remix-neon-auth-2nnmflq8i-abouthomelovings-projects.vercel.app`.
  - Notes: deployment must occur after env writes because existing deployments do not pick up new vars.

- [x] If the database schema is still missing, run migrations against the configured database and verify a real app/API happy path.
  - Owner: main agent
  - Verification: `pnpm run db:migrate`; direct smoke check proving the homepage or auth path no longer fails on missing DB state
  - Status: completed
  - Evidence: after repointing `pay-deme.d0v.xyz` to the new deployment with `vercel alias set remix-neon-auth-2nnmflq8i-abouthomelovings-projects.vercel.app pay-deme.d0v.xyz`, the homepage returned `200` with no missing-env banner and rendered live snapshot data (`Users` and `Verification codes`); `POST /api/auth/send-code` returned `200 {"success":true,"message":"Verification code sent"}` and `POST /api/auth/verify-login` with an invalid code returned `400 {"success":false,"error":"Invalid or expired verification code"}`. This showed the configured database schema was already present, so no migration run was required.
  - Notes: keep this open if migration fails or if the configured DB is not the intended production database.

## Validator Handoff

### `@data-schema-qa`

- Result: Passed
- Checked: production database-backed homepage snapshot and verification-code persistence path
- Passed: once production env vars were active, the live app loaded database-backed counts and auth-code storage worked, indicating the configured schema already exists
- Failed: no migration was needed, so no migration command output was produced
- Not checked: direct schema diff against migration files
- Risk: the configured `DATABASE_URL` was assumed to be the intended production Neon database because it came from local `.env`
- Plan update: rerun schema validation only if you later switch production to a different database

### `@api-backend-qa`

- Result: Passed
- Checked: auth send-code happy path and verify-login invalid-code path on the live production origin
- Passed: `POST /api/auth/send-code` returned `200` with `{ success: true, message: "Verification code sent" }`; `POST /api/auth/verify-login` with a bad code returned `400` with `{ success: false, error: "Invalid or expired verification code" }`
- Failed: no payment checkout endpoint smoke request was run in this pass
- Not checked: full successful login completion using a real code
- Risk: checkout-specific backend behavior still depends on external payment service configuration and product IDs
- Plan update: run a payment route smoke test when you want to validate monetization end to end

### `@performance-seo-qa`

- Result: Passed
- Checked: public production domain response before and after env remediation
- Passed: `https://pay-deme.d0v.xyz` now returns `200` and no longer shows the missing `DATABASE_URL` or failed-query banners
- Failed: no deeper metadata or performance audit was run
- Not checked: Core Web Vitals and full SEO metadata quality
- Risk: the page is publicly healthy now, but landing-page copy and metadata remain template-grade
- Plan update: run a dedicated content/perf pass only if this is becoming the real public landing page

### `@checkout-monetization-qa`

- Result: Passed with residual risk
- Checked: production payment-related environment inputs and live origin URL configuration
- Passed: `APP_URL` is now set to `https://pay-deme.d0v.xyz`, and payment hub env vars are present in Vercel production
- Failed: no end-to-end checkout creation request was executed
- Not checked: actual payment link creation with a valid signed-in session and product ID
- Risk: payment provider behavior still needs one real signed-in checkout smoke test
- Plan update: validate the pricing-to-checkout path when you are ready to test monetization fully
