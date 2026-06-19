<div align="center">

<img src="https://img.shields.io/badge/category-business-475569?style=for-the-badge&logo=datadog&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-18181b?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/role-operator%20shell-f97316?style=for-the-badge" alt="role"/>

<br/><br/>

# 📊 OpsCanvas

<h3>Run internal operations on a paid, permission-aware shell —<br/>replace the hero mindset with a real reporting and actions workspace.</h3>

<br/>

[**Quickstart**](#-quickstart) · [**Mission modules**](#-mission-modules) · [**Operator rules**](#-operator-rules) · [**Repository**](https://github.com/d1v-community/internal-dashboard-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80&auto=format&fit=crop" alt="Operations control surface" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(249, 115, 22, 0.30);"/>
  </picture>
</p>

<p align="center"><sub><i>📡 Panels behave like dashboards, not promo cards. Density increases confidence without becoming noisy.</i></sub></p>

<br/>

## ◆ What this template is

An **internal operations dashboard** built on `remix-neon-auth-pay`. It is intentionally un-marketing — the landing page is a workspace you would actually log into at the start of a shift, not a pitch for the workspace.

> **Start with orientation, freshness, and next action.** If the hero doesn't tell the operator what to do first, the dashboard is already failing.

<br/>

## ▶ Quickstart

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/internal-dashboard-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

<br/>

## 📡 Mission modules

<table>
<tr>
<td width="50%" valign="top">

### `01` KPI strip
Compact metrics with trend context and timestamping.
*"Is this number still fresh?"* is the only question that matters.

</td>
<td width="50%" valign="top">

### `02` Queue table
Approvals, owner assignment, stuck-state visibility.
The queue is the page — the page is not the queue.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `03` Incident timeline
A single place for escalation, audit notes, and resolution state.
The story of an incident is one scroll, not five tabs.

</td>
<td width="50%" valign="top">

### `04` Seat-based access
Map successful checkout to paid operator seats or workspace plans.
A dashboard without seat math is a screenshot, not a product.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `05` Managed reporting
Monetize dashboards for clients or partner teams later.
The same data layer should sell to multiple audiences.

</td>
<td width="50%" valign="top">

### `06` Audit trail
Use Drizzle models to track plan changes and role grants.
Compliance is a feature, not a settings page.

</td>
</tr>
</table>

<br/>

## ◆ Operator rules

> **Visual thesis:** Replace the hero mindset with a real reporting and actions workspace. Panels should behave like dashboards, not promo cards.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   FAVOR density over decoration                          │
│   FAVOR labels over icons                                │
│   FAVOR timestamps over freshness badges                 │
│   FAVOR one-glance status over animated loaders          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ local env bootstrap script       ✔ role/permission scaffolding
```

<br/>

## ◆ Replace and ship

- [ ] Replace starter dashboard sections with the real internal workflow
- [ ] Extend the seeded schema with your actual entity model
- [ ] Map successful checkout to operator seats, workspace plans, or admin tiers
- [ ] Add an audit-friendly log layer for plan and role changes
- [ ] Plan for managed-reporting monetization from the start, not as a v2

---

<div align="center">
  <sub>OpsCanvas · internal dashboard starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
