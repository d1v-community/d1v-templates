# AI Workflow Template

This document is a reusable template for repositories that want AI agents to work in a plan-driven, verification-first way.

Use it together with:

- `AGENTS.md`: repository-level execution rules
- `PLAN.md`: current task or project plan
- `Sub-Agent Registry`: a stable list of reusable agent roles and their validation responsibilities

## Core Rules

- Create or update a written plan before starting any non-trivial implementation.
- Break work into small todos that have an owner, a verification method, and a status.
- Do not mark a todo complete until the required verification passes.
- Update the plan immediately after each verification result.
- Compress the plan periodically so it stays useful to the next agent.

## Recommended File Roles

- `AGENTS.md`
  - Defines repository-wide rules
  - Defines mandatory checks
  - Defines how plans and sub-agents must be used

- `PLAN.md`
  - Tracks the current roadmap, active phase, todos, verification evidence, blockers, and decisions
  - Must be updated during execution, not only at the end

- `Sub-Agent Registry`
  - Defines named agent roles that can be reused across tasks
  - Gives each role a clear scope and validation standard

## What A Good Todo Looks Like

Each todo should be a small unit that can be verified.

Recommended fields:

- `Todo`
- `Owner`
- `Verification`
- `Status`
- `Evidence`
- `Risk / Notes`

Example:

```md
- [ ] Build resident checkout address selector
  - Owner: `@commerce-flow-qa`
  - Verification: `pnpm run typecheck`, manual checkout flow review, empty-state check
  - Status: `in_progress`
  - Evidence: pending
  - Risk / Notes: depends on shared address loader
```

After verification passes:

```md
- [x] Build resident checkout address selector
  - Owner: `@commerce-flow-qa`
  - Verification: `pnpm run typecheck`, manual checkout flow review, empty-state check
  - Status: `done`
  - Evidence: `pnpm run typecheck` passed; checked default address, no-address empty state, and switch-address flow
  - Risk / Notes: desktop layout still needs later polish
```

## Sub-Agent Registry

### Purpose

The registry is a stable dictionary of agent roles. It prevents vague delegation and makes validation repeatable.

It answers:

- which sub-agent should own which kind of work
- what that sub-agent is allowed to touch
- how that sub-agent proves completion
- what must be handed back to the main agent

### Important Distinction

The sub-agent mechanism in Codex is reusable across projects.
The registry you define in a repository is not automatically global.

That means:

- agent spawning capability is shared
- registry role names and standards are repository conventions
- to reuse them across projects, copy the registry into each new repository or maintain a shared template

### Registry Template

Use a section like this in `PLAN.md` or a dedicated workflow doc:

```md
## Sub-Agent Registry

- `@entry-shell-qa`
  - Scope: entry points, app shell, route transitions, navigation integrity, safe-area behavior
  - Owns: shell layout, route wiring, entry buttons, nav state checks
  - Verification: route traversal, active-nav correctness, responsive shell review
  - Handoff: summary of checked routes, failures, remaining risks

- `@commerce-flow-qa`
  - Scope: product, cart, checkout, payment, orders
  - Owns: commerce flow validation and data consistency checks
  - Verification: add-to-cart, checkout, totals, payment result, order detail review
  - Handoff: flow coverage, mismatches, blocking defects

- `@ui-consistency-qa`
  - Scope: spacing, typography, component consistency, feedback states
  - Owns: UI review across touched pages
  - Verification: visual consistency review, state coverage review
  - Handoff: inconsistencies, screenshots if needed, acceptance or rejection
```

## How To Use The Registry

### 1. Define Roles Before Delegation

Do not invent ad hoc sub-agent names in the middle of execution unless the work is truly new.

Prefer a stable registry with:

- role name
- scope
- owned surfaces
- verification method
- handoff contract

### 2. Tag Todos With Registry Owners

Every meaningful todo should name its responsible registry role.

Example:

```md
- [ ] Implement order detail timeline. `@commerce-flow-qa` `@ui-consistency-qa`
```

This means:

- one role validates business flow correctness
- one role validates UI consistency

### 3. Delegate By Responsibility, Not By Generic Labor

Bad:

```md
- ask one sub-agent to look around
```

Good:

```md
- ask `@context-auth-qa` to verify redirect, re-entry, and permission edges for `/resident/*`
```

### 4. Require Structured Handoffs

Every sub-agent result should include:

- what was checked
- what passed
- what failed
- what was not checked
- remaining risk
- whether the todo can be marked done

Suggested format:

```md
Result: pass | fail | partial
Checked:
- ...
Passed:
- ...
Failed:
- ...
Not checked:
- ...
Risk:
- ...
Plan update:
- keep open | mark done | split follow-up todo
```

### 5. Update The Plan Only After Verification

A sub-agent can implement or review work, but the todo should be updated to `done` only when the required checks have passed and the result has been recorded in the plan.

If verification fails:

- keep the todo open
- write the failure into the plan
- add the corrective next step

### 6. Use Multiple Registry Roles On One Todo When Needed

Complex work often needs more than one validation angle.

Example:

```md
- [ ] Finish support center page. `@account-service-qa` `@ux-quality-qa` `@ui-consistency-qa`
```

This means the todo is not truly complete until:

- the business module works
- the experience quality is acceptable
- the UI matches the rest of the product

### 7. Do Not Let The Registry Become Decorative

If a registry role is attached to todos but never used to guide verification, the registry is just labeling noise.

To keep it useful:

- each role must have a real validation standard
- each completed todo should leave evidence tied to its role
- stale or overlapping roles should be merged or removed

## Plan Compression Rules

When the plan grows too large:

- keep active todos in full detail
- keep blockers, decisions, and risks in full detail
- compress completed work into short verified summaries
- delete stale speculative notes

Good compression keeps the execution history useful without forcing future agents to read every past detail.

## Minimal Cross-Project Starter Pack

If you want to reuse this workflow in a new repository, start with:

1. `AGENTS.md` with plan-driven and verification-first rules
2. `PLAN.md` with milestone-based todos
3. `Sub-Agent Registry` with 4-8 stable roles
4. required checks such as typecheck, tests, and manual flow review

## Suggested Default Registry Set

This set works well as a starting point for many web product repositories:

- `@entry-shell-qa`
- `@context-auth-qa`
- `@commerce-flow-qa`
- `@account-service-qa`
- `@assistant-flow-qa`
- `@desktop-adaptive-qa`
- `@ui-consistency-qa`
- `@ux-quality-qa`

Adapt the names only when the product domain truly changes.
