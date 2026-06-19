<div align="center">

<img src="https://img.shields.io/badge/category-local-0ea5e9?style=for-the-badge&logo=health&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-0c4a6e?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/surface-booking%20%2B%20records-38bdf8?style=for-the-badge" alt="surface"/>

<br/><br/>

# 🏥 ClinicFlow

<h3>Handle appointments and deposits on a healthcare surface that is already live —<br/>trust is built through timing, clarity, and follow-through.</h3>

<br/>

[**Install**](#-install) · [**Booking modules**](#-booking-modules) · [**Service discipline**](#-service-discipline) · [**Repository**](https://github.com/d1v-community/clinic-booking-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&auto=format&fit=crop" alt="Healthcare and clinic surface" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(14, 165, 233, 0.30);"/>
  </picture>
</p>

<p align="center"><sub><i>🏥 Time, staff, and capacity should be readable at a glance. Trust is clarity.</i></sub></p>

<br/>

## ◆ What this template is

A **clinic booking** starter built on `remix-neon-auth-pay`. The landing page is a service surface, not a marketing page. Upcoming availability, visit types, and patient reminders are visible in the first viewport.

> **Make time, staff, and capacity easy to scan.** A booking page that hides the next slot behind a form loses the patient at the first tap.

<br/>

## ▶ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/clinic-booking-template --write-path .env
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

## 🏥 Booking modules

<table>
<tr>
<td width="50%" valign="top">

### `01` Availability board
Show upcoming slots and provider availability clearly.
The next available slot is the most important fact on the page.

</td>
<td width="50%" valign="top">

### `02` Visit type selector
Differentiate consultations, follow-ups, and memberships.
Patients should not have to guess which option to pick.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `03` Preparation notes
Explain arrival time, required documents, and visit expectations.
Preparation notes reduce no-shows more than reminders do.

</td>
<td width="50%" valign="top">

### `04` Patient portal
Show bookings, history, and post-visit guidance in one place.
The portal replaces the printed handout and the call-back.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `05` Reminder flow
Connect upcoming visits to simple reminder and prep messaging.
A reminder two hours before the visit is the most-used feature.

</td>
<td width="50%" valign="top">

### `06` Plan management
Use recurring payment rails for premium care or membership plans.
Continuity of care deserves a recurring rail, not a new checkout.

</td>
</tr>
</table>

<br/>

## ◆ Service discipline

> **Visual thesis:** A service-first booking and membership surface focused on trust, availability, and action on mobile. Trust should come from clarity, not from decorative polish alone.

```
   Today          Tomorrow         This week        This month
   ─────          ────────         ─────────        ──────────
   Open slots     Open slots       Open slots       Open slots
   ████░░         ██████░          ██████░          ████░░
   4 left         6 left           5 left           4 left
```

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ concierge hooks (D1V_PAI_*)      ✔ booking-aware copy in site.ts
```

<br/>

## ◆ Make it yours

- [ ] Replace the starter visit types with the real service catalog
- [ ] Model availability: provider, slot, capacity, and visit type
- [ ] Build the patient portal: bookings, history, and post-visit notes
- [ ] Wire the reminder flow before the launch date, not after
- [ ] Define recurring plans for continuity care or premium services

---

<div align="center">
  <sub>ClinicFlow · clinic booking starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
