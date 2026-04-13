# PLAN

## Objective

Convert `d1v-templates` into an open-source-ready template registry with:

- stable foundation templates
- industry-oriented derivatives
- machine-readable metadata
- plan-driven, verification-first execution rules

## Current Decisions

- The repository now separates `foundations/` from `industries/`.
- `remix-neon-auth` and `remix-neon-auth-pay` are the two foundation templates.
- The current promotion phase treats `remix-neon-auth-pay` as the canonical base for all new runnable industry templates.
- Existing industry blueprint metadata that still points to `remix-neon-auth` must be normalized to `remix-neon-auth-pay` as part of promotion.
- The registry metadata now uses repo-aware fields such as repository URL, ref, path, category, kind, and `baseTemplateId`.
- Local end-to-end verification should reuse the existing `d1v-server` project creation + env export chain instead of inventing a parallel environment system.
- The current execution order is:
  1. align root and template-level workflow files
  2. publish the root registry repo to `d1v-community`
  3. publish each existing template repo safely and set it as a GitHub template
  4. continue the structural `foundations/` + `industries/` migration on top of the published baseline
  5. promote blueprint directories into runnable industry templates based on `remix-neon-auth-pay`
  6. wire local env bootstrap helpers and backend template-catalog support for the promoted repos
- Foundations remain nested git repositories inside the root registry repository. This is an accepted interim constraint after the path migration.

## Sub-Agent Registry

- `@entry-shell-qa`
  - Scope: repository entry docs, root metadata, navigation integrity, directory naming sanity
  - Owns: root `README.md`, `templates.json`, top-level template discovery surfaces
  - Verification: metadata review, path consistency review, route/file discovery sanity
  - Handoff: checked files, mismatches, unresolved structure risks

- `@context-auth-qa`
  - Scope: auth/session conventions inside foundation templates
  - Owns: login flow assumptions, cookie/token behavior, API auth conventions
  - Verification: route review, auth edge-case review, same-origin behavior checks
  - Handoff: checked flows, auth inconsistencies, residual risks

- `@commerce-flow-qa`
  - Scope: product, pricing, checkout, orders, fulfillment placeholders
  - Owns: payment-enabled template validation and commerce data consistency checks
  - Verification: pricing flow review, checkout path review, success/cancel and follow-up data model review
  - Handoff: flow coverage, missing payment primitives, blocking defects

- `@ui-consistency-qa`
  - Scope: template copy consistency, naming, placeholder quality, docs-to-UI alignment
  - Owns: cross-page wording consistency for touched templates
  - Verification: doc/UI consistency review, naming review, empty-state and CTA review
  - Handoff: inconsistencies, acceptance or rejection, follow-up copy risks

- `@desktop-adaptive-qa`
  - Scope: responsive layout sanity for touched templates
  - Owns: desktop/mobile layout review for changed routes
  - Verification: targeted responsive review
  - Handoff: layout regressions, risk notes

- `@ux-quality-qa`
  - Scope: first-run experience, empty states, setup clarity, deployment ergonomics
  - Owns: install/setup/payment/auth experience review
  - Verification: first-run checklist review, docs completeness review
  - Handoff: friction points, blockers, onboarding gaps

## Active Roadmap

- [x] Bootstrap root workflow files for plan-driven execution
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: root `AGENTS.md`, `PLAN.md`, and `docs/AI_WORKFLOW_TEMPLATE.md` exist and align with the requested workflow rules
  - Status: done
  - Evidence: files created in repository root; repository-level rules now explicitly cover planning, sub-agent usage, and verification-first execution; validator review confirmed the root files capture the requested workflow model
  - Risk / Notes: template-local `AGENTS.md` files still use older defaults and must be aligned in a later phase

- [x] Align foundation-template `AGENTS.md` files with the new repository workflow
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: compare root rules against `foundations/remix-neon-auth/AGENTS.md` and `foundations/remix-neon-auth-pay/AGENTS.md`; update conflicting defaults and confirm consistency
  - Status: done
  - Evidence: both template-local `AGENTS.md` files were rewritten to use direct DB workflow by default and to require plan-driven execution, structured sub-agent handoff, and verification-before-complete behavior
  - Risk / Notes: future template-specific exceptions must still be documented explicitly when they differ from the root workflow

- [x] Add or align workflow files in every existing template directory
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: each current template directory has an `AGENTS.md` aligned with the root workflow or an explicitly documented equivalent; naming mismatches such as `AGENT.md` are resolved
  - Status: done
  - Evidence: added `AGENTS.md` to `foundations/html-template` and `foundations/sui-nextjs-auth-template`; kept `foundations/sui-nextjs-auth-template/AGENT.md` as a compatibility pointer; updated ignore rules in every existing template
  - Risk / Notes: the HTML template intentionally uses a lighter verification model because it has no formal build or typecheck pipeline

- [x] Publish the root `d1v-templates` registry repository baseline to `d1v-community`
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: root repo status is clean for intended files, secrets are not staged, remote push succeeds, published branch reflects workflow docs and metadata changes
  - Status: done
  - Evidence: committed and pushed root workflow files, registry metadata updates, and gitlink pointers to `d1v-community/d1v-templates`; confirmed the repo remains public on branch `main`
  - Risk / Notes: the root repo currently tracks nested template repos as gitlinks rather than normal directories, so the future `foundations/` + `industries/` migration still needs a deliberate repository-layout change

- [x] Publish `html-template` to `d1v-community/html-template` and enable GitHub template mode
  - Owner: main agent, validated by `@ux-quality-qa`
  - Verification: repo has safe ignore rules, no `.env` is tracked, remote push succeeds, `gh repo edit --template` succeeds
  - Status: done
  - Evidence: committed `AGENTS.md` and ignore-rule updates, pushed `main` to `d1v-community/html-template`, and confirmed `isTemplate: true`
  - Risk / Notes: verification is documentation- and status-based because this template has no automated build pipeline

- [x] Publish `remix-neon-auth` to `d1v-community/remix-neon-auth-template` and enable GitHub template mode
  - Owner: main agent, validated by `@context-auth-qa` and `@ux-quality-qa`
  - Verification: local-only files are excluded, workflow docs aligned, remote points to the desired org/repo, push succeeds, template mode enabled
  - Status: done
  - Evidence: origin remote was retargeted to `d1v-community/remix-neon-auth-template`; workflow/ignore updates were committed and pushed; GitHub reports `isTemplate: true`
  - Risk / Notes: repo naming still uses the older `-template` suffix and may be normalized later when registry metadata is upgraded

- [x] Publish `remix-neon-auth-pay` to `d1v-community/remix-neon-auth-pay` and enable GitHub template mode
  - Owner: main agent, validated by `@commerce-flow-qa`, `@context-auth-qa`, and `@ux-quality-qa`
  - Verification: local-only files are excluded, workflow docs aligned, push succeeds, template mode enabled
  - Status: done
  - Evidence: `pnpm run typecheck` passed; pricing/auth/doc/workflow changes were committed and pushed; GitHub reports `isTemplate: true`
  - Risk / Notes: the repo now contains the latest pricing-flow changes and should be treated as the new publication baseline

- [x] Publish `sui-nextjs-auth-template` to `d1v-community/sui-nextjs-auth-template` and enable GitHub template mode
  - Owner: main agent, validated by `@entry-shell-qa` and `@ux-quality-qa`
  - Verification: `AGENT.md` naming is normalized or documented, local-only files are excluded, push succeeds, template mode enabled
  - Status: done
  - Evidence: added canonical `AGENTS.md`, converted `AGENT.md` into a compatibility pointer, expanded ignore rules, pushed `main`, and confirmed `isTemplate: true`
  - Risk / Notes: monorepo verification remains environment-dependent because local Sui/Suibase tooling may not exist everywhere

- [x] Design and apply the root repository migration from flat layout to `foundations/` + `industries/`
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: migration spec written, target paths listed, template IDs and slugs mapped, backward-compatibility notes recorded
  - Status: done
  - Evidence: moved all current template gitlinks under `foundations/`; added `foundations/README.md` and `industries/README.md`; root `README.md` and `templates.json` now reference the new layout
  - Risk / Notes: any downstream tooling that assumed flat root paths must now be updated to use the new registry structure

- [x] Upgrade `templates.json` into a public-registry-friendly schema
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: schema fields defined and applied consistently to all templates
  - Status: done
  - Evidence: replaced the old flat array with a `registryVersion` object and repo-aware records covering foundations plus industry blueprints; JSON parsing verification passed
  - Risk / Notes: downstream consumers that still expect the old array shape must be updated before they can read the new registry format

- [x] Clean foundation templates for open-source publication
  - Owner: main agent, validated by `@ux-quality-qa`
  - Verification: remove local-only artifacts from tracked template output and confirm safe `.env.example` usage
  - Status: done
  - Evidence: added publication-safe ignore rules at the root and template levels; verified no `.env`, `node_modules`, `.pnpm-store`, `.vercel`, `build`, `dist`, `.cache`, or `.claude` entries appear in template `git status`; confirmed only `.env.example` remains tracked in the Remix foundations
  - Risk / Notes: local cache directories still exist on disk for development, but they are now excluded from publication by ignore rules

- [x] Raise `remix-neon-auth` to a stronger auth-only foundation
  - Owner: main agent, validated by `@context-auth-qa` and `@ux-quality-qa`
  - Verification: auth flow review, setup review, naming cleanup, package metadata review
  - Status: done
  - Evidence: aligned workflow rules, improved ignore rules, renamed `package.json` identity to `d1v-remix-neon-auth`, added template description, and verified `pnpm run typecheck` passes
  - Risk / Notes: future work can still modernize README tone and onboarding copy further, but the foundation is no longer template-generic at the package level

- [x] Raise `remix-neon-auth-pay` to a stronger payment foundation
  - Owner: main agent, validated by `@commerce-flow-qa`, `@context-auth-qa`, and `@ux-quality-qa`
  - Verification: payment flow review, fulfillment placeholders review, setup review, naming cleanup
  - Status: done
  - Evidence: published the pricing/auth/doc improvements, aligned workflow rules, renamed `package.json` identity to `d1v-remix-neon-auth-pay`, added template description, and verified `pnpm run typecheck` passes
  - Risk / Notes: checkout and pricing are in good shape, but a later maturity pass should still add stronger order/subscription/webhook primitives

- [x] Define the first wave of industry templates
  - Owner: main agent, validated by `@entry-shell-qa` and `@ux-quality-qa`
  - Verification: starter list finalized with category, base template, and business model fit
  - Status: done
  - Evidence: added 12 industry blueprint directories across `ai-tools`, `business`, `commerce`, `creator`, `education`, and `local`; each blueprint now documents its base foundation, product surface, and follow-up work
  - Risk / Notes: these are blueprint templates rather than standalone repos today, so the next promotion decision should focus on which blueprints deserve their own published repositories

- [ ] Update registry planning and metadata for the runnable-template promotion phase
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: `PLAN.md`, `README.md`, and `templates.json` all describe industry templates as `remix-neon-auth-pay` derivatives with a clear published-vs-generated distinction
  - Status: done
  - Evidence: updated `PLAN.md`; rewrote root `README.md`; converted `templates.json` industry records from blueprint metadata to runnable `industry-template` records with `status: generated` and `baseTemplateId: foundation-remix-neon-auth-pay`
  - Risk / Notes: this is the control point for the remaining work and must be kept current as templates graduate

- [ ] Add reusable industry-template scaffolding and local env bootstrap tooling
  - Owner: main agent, validated by `@ux-quality-qa`
  - Verification: scripts exist under `d1v-templates/scripts/`, can generate runnable industry directories from `foundations/remix-neon-auth-pay`, and can fetch/export project env vars into a local `.env` without hardcoding secrets
  - Status: done
  - Evidence: added `scripts/industry-templates.config.json` and `scripts/generate-industry-templates.mjs`; added `scripts/bootstrap-local-env.mjs` to the foundation and generated templates; added `.d1v-template.json` metadata files so bootstrap can infer template repo and default prompt
  - Risk / Notes: the helper should lean on `POST /api/projects/create-with-integrations` and `GET /api/projects/{project_id}/env-vars/export` with `Authorization: Bearer <token>`

- [ ] Expand backend template selection to support payment-first industry templates
  - Owner: main agent, validated by `@entry-shell-qa` and `@commerce-flow-qa`
  - Verification: `backend_admin` template catalog includes `d1v-community/remix-neon-auth-pay` plus promoted industry repos; tests for `/api/projects/templates` and explicit template creation pass
  - Status: in_progress
  - Evidence: updated `backend_admin/utils/quickly_llm/project_meta_generator.py` to include the payment foundation plus 12 industry repos; changed `DEFAULT_TEMPLATE_REPO` to `d1v-community/remix-neon-auth-pay`; updated the template-list API tests to compare against `TEMPLATE_CATALOG`; live `GET /api/projects/templates` verification with a real JWT returned `code: 0` and `count: 16`; `poetry run pytest backend_admin/tests/test_project_templates_api.py -q` passed
  - Risk / Notes: `backend_admin/tests/test_user_project_apis.py` still contains broader expectation drift unrelated to the new template catalog (for example legacy `code == 200` assertions, routes that now 404, and balance-guard failures in create-project tests), so the backend catalog work is verified for template discovery but not yet for the entire legacy user-project test suite

- [ ] Promote the first batch of industry blueprints into runnable templates
  - Owner: main agent, validated by `@ui-consistency-qa`, `@commerce-flow-qa`, and `@desktop-adaptive-qa`
  - Verification: each current industry directory contains a runnable Remix app, template-local `AGENTS.md`, industry-specific copy, and passes `pnpm run typecheck`
  - Status: done
  - Evidence: generated 12 runnable directories under `industries/`; each now contains app code, docs, `AGENTS.md`, `.d1v-template.json`, and package metadata; the initial promotion wave passed `pnpm install --frozen-lockfile` + `pnpm run typecheck` in all 12 industry directories; each directory was published to `d1v-community/<name>-template` and GitHub template mode was enabled; a later regeneration pass deepened the shared landing surface so every template now exposes offer shape, shipped starter capabilities, workflow/data hooks, and fulfillment-path blocks derived from its site config
  - Risk / Notes: local directory copies and published repos must be kept in sync on future updates, so follow-up automation should treat the root registry as the source of truth for regeneration

- [ ] Verify local database-backed setup flow for promoted templates
  - Owner: main agent, validated by `@context-auth-qa` and `@ux-quality-qa`
  - Verification: at least one promoted template completes the documented flow of project creation, env export to local `.env`, migration, seed, and app startup without manual secret editing beyond user auth token and server base URL
  - Status: done
  - Evidence: patched `opcode-api/src/services/github.rs` so GitHub template clones tolerate propagation delay; rebuilt and restarted the local `opcode-container`; real `POST /api/projects/create-with-integrations` succeeded for `template_repo: d1v-community/assistant-saas-template` and produced backend project `ai_commerce_platform_5spkc00512` plus GitHub repo `d1v-community/ai_commerce_platform_736139`; exported env vars into `industries/ai-tools/assistant-saas/.env` via `pnpm run env:bootstrap`; ran `pnpm run db:migrate`, `pnpm run db:seed`, `pnpm run typecheck`, and `pnpm run build`; started the app with `pnpm exec remix vite:dev --host 127.0.0.1 --port 4273` and confirmed `GET /` and `GET /pricing` both returned `200`
  - Risk / Notes: the local Docker run currently needs `OPCODE__SERVER__IP_WHITELIST=all` to allow host-to-container traffic on macOS Docker Desktop; if local-hardening remains important, that whitelist behavior should be revisited separately from template generation

- [x] Add reusable AI concierge/chat support to relevant industry templates
  - Owner: main agent, validated by `@ui-consistency-qa`, `@ux-quality-qa`, and `@desktop-adaptive-qa`
  - Verification: `foundations/remix-neon-auth-pay` exposes an OpenAI-compatible server route backed by `D1V_PAI_*`, relevant industry configs enable the feature with domain-specific copy, regenerated templates compile, and targeted chat-related tests/type checks pass
  - Status: done
  - Evidence: added optional `D1V_PAI_BASE_URL` / `D1V_PAI_API_KEY` handling plus `/api/ai/chat`, `AiAssistantPanel`, and homepage/header wiring in `foundations/remix-neon-auth-pay`; updated `.env.example` and `README.md`; extended `scripts/generate-industry-templates.mjs` to pass through `aiAssistant` and AI-aware README content; enabled domain-specific AI assistant configs for `assistant-saas`, `prompt-library-membership`, `client-portal`, `cohort-course`, `online-course-membership`, and `clinic-booking`; regenerated all 12 industry templates; `pnpm run typecheck` passed in `foundations/remix-neon-auth-pay` and in the six AI-enabled generated templates after fresh `pnpm install --frozen-lockfile`
  - Risk / Notes: the feature should not force AI UI onto every industry template; first-sync behavior must avoid charging historical upstream logs and docs must explain optional `D1V_PAI_*` setup clearly

- [ ] Bootstrap real project envs into every industry template and verify local full-stack flows
  - Owner: main agent, validated by `@context-auth-qa`, `@commerce-flow-qa`, and `@ux-quality-qa`
  - Verification: each `industries/*/*` template writes a fresh `.env` via `scripts/bootstrap-local-env.mjs` backed by a real `create-with-integrations` project, then passes `pnpm run db:migrate`, `pnpm run db:seed`, `pnpm run build`, and targeted HTTP smoke checks for `/`, `/pricing`, and auth/payment-related routes where applicable
  - Status: done
  - Evidence: minted a local JWT for the funded test user `template.e2e@example.com`; used each template-local `scripts/bootstrap-local-env.mjs` against real `POST /api/projects/create-with-integrations` + env export to write fresh `.env` files into all 12 `industries/*/*` directories; transient opcode 500s affected `prompt-library-membership` and `digital-downloads` on the first pass but both succeeded on retry; all 12 templates then passed `pnpm install --frozen-lockfile`, `pnpm run db:migrate`, `pnpm run db:seed`, and `pnpm run build`; runtime smoke using `remix-serve` with dotenv-loaded `.env` returned `200` for `/` and `/pricing` plus successful `POST /api/auth/send-code` in all 12 templates; direct upstream checks confirmed `GET /v1/models` and `POST /v1/chat/completions` work with project-level `D1V_PAI_API_KEY`; switching the shared AI client from server `fetch` to `https.request` and standardizing AI-enabled templates on `kimi-k2.5` restored successful `/api/ai/chat` responses in runtime verification for `assistant-saas`
  - Risk / Notes: requires a valid user JWT with positive balance; project creation consumes upstream integrations and may hit provider-side rate limits; the remaining AI-enabled templates still need the same runtime route sweep before publication so template repos and root-generated copies stay in lockstep

- [ ] Publish the regenerated foundation and industry repos after the AI runtime fix
  - Owner: main agent, validated by `@entry-shell-qa`, `@ux-quality-qa`, and `@ui-consistency-qa`
  - Verification: `foundations/remix-neon-auth-pay` is committed and pushed first; root `d1v-templates` updates the gitlink plus regenerated industry files; all touched published repos stay free of local secrets and match the verified local source
  - Status: in_progress
  - Evidence: pending
  - Risk / Notes: publication must happen in dependency order because the root registry points at the foundation gitlink; `.env` must remain untracked across the entire release pass

- [ ] Run an AI runtime verification and publication sweep for every AI-enabled template
  - Owner: main agent, validated by `@context-auth-qa`, `@desktop-adaptive-qa`, and `@ux-quality-qa`
  - Verification: each AI-enabled template starts with its bootstrapped `.env`, returns success from `POST /api/ai/chat`, and is then published so the remote repo matches the working local copy
  - Status: pending
  - Evidence: `assistant-saas` already returns a successful `/api/ai/chat` response after the `https.request` + `kimi-k2.5` fix; the remaining AI-enabled templates still need the same runtime check
  - Risk / Notes: failures here are expected to reveal per-template config drift, stale generated files, or upstream account funding gaps rather than shared foundation issues

## Next-Phase Industry Optimization Map

- [ ] Push the AI-tools category toward a chat-first product surface
  - Owner: main agent, validated by `@ui-consistency-qa`, `@ux-quality-qa`, and `@commerce-flow-qa`
  - Verification: `assistant-saas` and `prompt-library-membership` gain distinct visual direction, stronger conversion copy, and real product modules such as conversation history, saved prompts, packs, or usage/seat states without regressing auth and checkout flows
  - Status: pending
  - Evidence: pending
  - Risk / Notes: these templates should feel like operator products, not generic SaaS landing pages; design can skew more cinematic and control-room-like than the other categories

- [ ] Push the business category toward service operations and client delivery
  - Owner: main agent, validated by `@ui-consistency-qa`, `@context-auth-qa`, and `@desktop-adaptive-qa`
  - Verification: `client-portal` and `internal-dashboard` gain clearer workspace IA, table/timeline/detail patterns, and domain entities such as projects, milestones, tickets, tasks, or KPI cards
  - Status: pending
  - Evidence: pending
  - Risk / Notes: these templates should favor sober enterprise design, stronger information density, and clearer role-based flows over marketing-heavy presentation

- [ ] Push the commerce and creator categories toward editorial selling and fulfillment
  - Owner: main agent, validated by `@commerce-flow-qa`, `@ui-consistency-qa`, and `@ux-quality-qa`
  - Verification: `digital-downloads`, `preorder-launch`, `community-membership`, and `paid-newsletter` gain differentiated merchandising layouts plus post-purchase fulfillment surfaces such as downloads, prelaunch reservations, issue archives, perks, or member feeds
  - Status: pending
  - Evidence: pending
  - Risk / Notes: these templates need stronger product storytelling, media hierarchy, and entitlement-aware post-checkout experiences rather than just a pricing page and thank-you page

- [ ] Push the education and local-service categories toward scheduling, progress, and trust
  - Owner: main agent, validated by `@desktop-adaptive-qa`, `@ux-quality-qa`, and `@context-auth-qa`
  - Verification: `cohort-course`, `online-course-membership`, `clinic-booking`, and `gym-membership` gain domain-specific flows such as syllabus/progress tracking, lesson libraries, booking availability, appointment states, plans, and service FAQs
  - Status: pending
  - Evidence: pending
  - Risk / Notes: these templates should feel operational and trustworthy on mobile first; local-service templates in particular need stronger time, capacity, and contact affordances

- [ ] Establish a category-level design system matrix before deeper template divergence
  - Owner: main agent, validated by `@ui-consistency-qa` and `@desktop-adaptive-qa`
  - Verification: `PLAN.md` and generation inputs define a clear visual system per category covering typography, palette, layout rhythm, motion tone, and component emphasis so future regeneration preserves intentional differences
  - Status: pending
  - Evidence: pending
  - Risk / Notes: without a category matrix, repeated regeneration will collapse the templates back toward one shared look and erase industry differentiation

## Immediate Next Step

Commit and push the AI-capable foundation plus regenerated root registry changes, then run the AI-enabled template runtime/publication sweep before starting category-by-category design and functionality divergence.
