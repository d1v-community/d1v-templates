# PLAN

## Objective

Convert `d1v-templates` into an open-source-ready template registry with:

- stable foundation templates
- industry-oriented derivatives
- machine-readable metadata
- plan-driven, verification-first execution rules

## Current Decisions

- The repository will separate `foundations/` from `industries/`.
- `remix-neon-auth` and `remix-neon-auth-pay` are the two foundation templates.
- Industry templates should derive from one of those foundations rather than becoming independent bases.
- Template metadata should eventually move beyond local-only `path` values toward repo-aware fields such as `repo`, `ref`, `path`, `category`, and `baseTemplate`.
- The current execution order is:
  1. align root and template-level workflow files
  2. publish the root registry repo to `d1v-community`
  3. publish each existing template repo safely and set it as a GitHub template
  4. continue the structural `foundations/` + `industries/` migration on top of the published baseline
- Existing template directories are still nested git repositories today; publication work must respect that layout until a later consolidation step.

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

- [ ] Align foundation-template `AGENTS.md` files with the new repository workflow
- [x] Align foundation-template `AGENTS.md` files with the new repository workflow
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: compare root rules against `remix-neon-auth/AGENTS.md` and `remix-neon-auth-pay/AGENTS.md`; update conflicting defaults and confirm consistency
  - Status: done
  - Evidence: both template-local `AGENTS.md` files were rewritten to use direct DB workflow by default and to require plan-driven execution, structured sub-agent handoff, and verification-before-complete behavior
  - Risk / Notes: future template-specific exceptions must still be documented explicitly when they differ from the root workflow

- [x] Add or align workflow files in every existing template directory
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: each current template directory has an `AGENTS.md` aligned with the root workflow or an explicitly documented equivalent; naming mismatches such as `AGENT.md` are resolved
  - Status: done
  - Evidence: added `AGENTS.md` to `html-template` and `sui-nextjs-auth-template`; kept `sui-nextjs-auth-template/AGENT.md` as a compatibility pointer; updated ignore rules in every existing template
  - Risk / Notes: the HTML template intentionally uses a lighter verification model because it has no formal build or typecheck pipeline

- [ ] Publish the root `d1v-templates` registry repository baseline to `d1v-community`
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: root repo status is clean for intended files, secrets are not staged, remote push succeeds, published branch reflects workflow docs and metadata changes
  - Status: pending
  - Evidence: pending
  - Risk / Notes: the root repo currently tracks only registry-level files, not the nested template repositories

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

- [ ] Design the final repository directory migration from flat layout to `foundations/` + `industries/`
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: migration spec written, target paths listed, template IDs and slugs mapped, backward-compatibility notes recorded
  - Status: pending
  - Evidence: pending
  - Risk / Notes: existing local tooling may assume current flat paths

- [ ] Upgrade `templates.json` into a public-registry-friendly schema
  - Owner: main agent, validated by `@entry-shell-qa`
  - Verification: schema fields defined and applied consistently to all templates
  - Status: pending
  - Evidence: pending
  - Risk / Notes: downstream consumers may still depend on current `path`-only shape

- [ ] Clean foundation templates for open-source publication
  - Owner: main agent, validated by `@ux-quality-qa`
  - Verification: remove local-only artifacts from tracked template output and confirm safe `.env.example` usage
  - Status: pending
  - Evidence: pending
  - Risk / Notes: nested `.git`, local caches, build artifacts, and lockfile strategy need review

- [ ] Raise `remix-neon-auth` to a stronger auth-only foundation
  - Owner: main agent, validated by `@context-auth-qa` and `@ux-quality-qa`
  - Verification: auth flow review, setup review, naming cleanup, package metadata review
  - Status: pending
  - Evidence: pending
  - Risk / Notes: current package identity and onboarding quality are still template-generic

- [ ] Raise `remix-neon-auth-pay` to a stronger payment foundation
  - Owner: main agent, validated by `@commerce-flow-qa`, `@context-auth-qa`, and `@ux-quality-qa`
  - Verification: payment flow review, fulfillment placeholders review, setup review, naming cleanup
  - Status: pending
  - Evidence: pending
  - Risk / Notes: checkout entry exists, but standard order/subscription/webhook primitives still need a clean foundation story

- [ ] Define the first wave of industry templates
  - Owner: main agent, validated by `@entry-shell-qa` and `@ux-quality-qa`
  - Verification: starter list finalized with category, base template, and business model fit
  - Status: pending
  - Evidence: pending
  - Risk / Notes: avoid overproducing low-differentiation templates before the foundations are stable

## Immediate Next Step

Normalize `AGENTS.md` coverage across all existing templates, then publish the root registry baseline before pushing the individual template repositories.
