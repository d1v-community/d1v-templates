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
- Industry templates should derive from one of those foundations rather than becoming independent bases.
- The registry metadata now uses repo-aware fields such as repository URL, ref, path, category, kind, and `baseTemplateId`.
- The current execution order is:
  1. align root and template-level workflow files
  2. publish the root registry repo to `d1v-community`
  3. publish each existing template repo safely and set it as a GitHub template
  4. continue the structural `foundations/` + `industries/` migration on top of the published baseline
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

## Immediate Next Step

Decide which industry blueprints should be promoted into standalone published template repositories and which should remain registry-only blueprints.
