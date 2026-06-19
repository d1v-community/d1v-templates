<div align="center">

<img src="https://img.shields.io/badge/category-business-64748b?style=for-the-badge&logo=briefcase&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-1e293b?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/access-client%20only-0ea5e9?style=for-the-badge" alt="access"/>

<br/><br/>

# 🏛 ClientRoom

<h3>Give every client a portal that feels like part of the service —<br/>not a separate inbox they have to remember to check.</h3>

<br/>

[**Quickstart**](#-quickstart) · [**Portal modules**](#-portal-modules) · [**Service discipline**](#-service-discipline) · [**Repository**](https://github.com/d1v-community/client-portal-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop" alt="Modern office workspace" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(100, 116, 139, 0.35);"/>
  </picture>
</p>

<p align="center"><sub><i>🏛 A quiet enterprise workstation — clear hierarchy, strong tables, no marketing-heavy chrome.</i></sub></p>

<br/>

## ◆ What this template is

A **client portal** built on `remix-neon-auth-pay`. The landing page orients the operator around the workspace value immediately, then routes clients into a portal that feels like part of the service.

> **Use the portal to reduce chaos, not to mirror your inbox.** A portal that looks like email defeats the point.

<br/>

## ▶ Quickstart

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/client-portal-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

> Optional concierge wiring:
> ```bash
> D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
> D1V_PAI_API_KEY=your_project_level_pai_api_key
> ```

<br/>

## 🏛 Portal modules

<table>
<tr>
<th align="left">Module</th>
<th align="left">What it does for the service</th>
</tr>
<tr>
<td><b>Milestone timeline</b></td>
<td>Display current phase, dependencies, and blockers in one view.</td>
</tr>
<tr>
<td><b>Deliverable browser</b></td>
<td>Organize files, drafts, approvals, and final assets cleanly.</td>
</tr>
<tr>
<td><b>Request queue</b></td>
<td>Track client asks so scope and response time stay visible.</td>
</tr>
<tr>
<td><b>Retainer framing</b></td>
<td>Tie portal access to ongoing updates, file history, and support continuity.</td>
</tr>
<tr>
<td><b>Client onboarding</b></td>
<td>Use payment success to trigger account setup and project intake.</td>
</tr>
<tr>
<td><b>Expansion path</b></td>
<td>Add new projects, seats, or premium support over time.</td>
</tr>
</table>

<br/>

## ◆ Service discipline

> **Visual thesis:** A quiet enterprise workstation with clear hierarchy, strong tables, and no marketing-heavy chrome. Density should increase confidence without becoming noisy.

| Principle | In practice |
|-----------|-------------|
| **Orientation first** | The hero answers *"what is this for me, today?"* — not *"what does the company do?"* |
| **State over color** | Status uses labels, not gradients. Operators scan headings and pills, not pretty cards. |
| **Reduce inbox mirroring** | Conversations move to the portal or stay out of the product entirely. |
| **Tie access to retainer** | A logged-in client is a paying client — or about to be one. |

<details>
<summary><b>▸ What the landing page should NOT do</b></summary>

<br/>

- Talk about the agency, agency values, or founder story.
- Show animated metrics that aren't on the actual portal surface.
- Treat the portal as a hidden section behind three clicks.

</details>

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ concierge hooks (D1V_PAI_*)      ✔ local env bootstrap script
✔ client-aware navigation          ✔ service-tier copy in site.ts
```

<br/>

## ◆ Replace and ship

- [ ] Replace starter portal sections with your real service workflow
- [ ] Extend the seeded schema with project, milestone, and deliverable models
- [ ] Map successful checkout to portal access, project seats, or retainer tiers
- [ ] Add a client onboarding flow after the hosted return page
- [ ] Tune the concierge prompt to deflect routine support questions

---

<div align="center">
  <sub>ClientRoom · client portal starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
