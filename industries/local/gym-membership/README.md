<div align="center">

<img src="https://img.shields.io/badge/category-local-f97316?style=for-the-badge&logo=strava&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-0a0a0a?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/format-membership%20%2B%20classes-fb923c?style=for-the-badge" alt="format"/>

<br/><br/>

# 💪 FlexPass

<h3>Sell memberships with a stack that is already ready to collect them —<br/>blend membership sales, class rhythm, and facility trust into one cleaner local product.</h3>

<br/>

[**Install**](#-install) · [**Membership modules**](#-membership-modules) · [**Habit loop**](#-habit-loop) · [**Repository**](https://github.com/d1v-community/gym-membership-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop" alt="Gym and fitness facility" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(249, 115, 22, 0.35);"/>
  </picture>
</p>

<p align="center"><sub><i>🔥 Sell the plan, then reinforce the habit. Attendance is the renewal signal.</i></sub></p>

<br/>

## ◆ What this template is

A **gym membership** starter built on `remix-neon-auth-pay`. The page leads with plans, classes, and the first-week experience — not with facility photography. After checkout, attendance history and class streaks keep members coming back.

> **Use onboarding to direct new members into their first classes or check-in.** The first week of attendance predicts the next twelve months of renewals.

<br/>

## ▶ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/gym-membership-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

<br/>

## 💪 Membership modules

<table>
<tr>
<td width="50%" valign="top">

### `01` Plan comparison
Keep monthly, annual, and premium coaching plans easy to scan.
Three plans, three prices, one click each.

</td>
<td width="50%" valign="top">

### `02` Class calendar
Show daily sessions and coach highlights near the purchase path.
A member who books class one visits week two.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `03` First-week guidance
Use onboarding to direct new members into their first classes or check-in.
The first week is the renewal signal for month thirteen.

</td>
<td width="50%" valign="top">

### `04` Attendance history
Show class streaks, visits, or milestone counts.
Streaks turn attendance from a chore into a small win.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `05` Membership management
Let users review plan state, billing, and upgrade options.
Billing clarity is the difference between a renewal and a chargeback.

</td>
<td width="50%" valign="top">

### `06` Community prompts
Blend AI answers with local staff guidance for routine questions.
Members should feel the staff, not the chatbot.

</td>
</tr>
</table>

<br/>

## ◆ Habit loop

> **Visual thesis:** A service-first booking and membership surface focused on trust, availability, and action on mobile. Make time, staff, and capacity easy to scan.

```
   Plan chosen
       │
       ▼
   First class booked ◀── onboarding nudges this
       │
       ▼
   Class attended
       │
       ▼
   Streak counted
       │
       ▼
   Renewal notice
       │
       ▼
   (loop continues)
```

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ local env bootstrap script       ✔ member-aware copy in site.ts
```

<br/>

## ◆ Make it yours

- [ ] Replace the starter plans with the real membership tiers
- [ ] Model the class calendar: coach, time, capacity, and slots
- [ ] Build the first-week onboarding flow into the data layer
- [ ] Track attendance and surface streaks in the member area
- [ ] Plan upgrades: coaching, small group, premium access

---

<div align="center">
  <sub>FlexPass · gym membership starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
