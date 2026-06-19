<div align="center">

<img src="https://img.shields.io/badge/category-commerce-dc2626?style=for-the-badge&logo=vercel&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-0c0a09?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/mode-limited%20release-ef4444?style=for-the-badge" alt="mode"/>

<br/><br/>

# 🚀 FirstDrop

<h3>Make preorder pages feel like a timed release, not a generic pricing screen —<br/>use urgency carefully, then follow through with trust.</h3>

<br/>

[**Install**](#-install) · [**Release sections**](#-release-sections) · [**Launch discipline**](#-launch-discipline) · [**Repository**](https://github.com/d1v-community/preorder-launch-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop" alt="Limited release product" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(220, 38, 38, 0.35);"/>
  </picture>
</p>

<p align="center"><sub><i>⏱ The page is a campaign — the receipt, the follow-through, and the membership ladder are the product.</i></sub></p>

<br/>

## ◆ What this template is

A **preorder launch** starter built on `remix-neon-auth-pay`. The page is intentionally campaign-shaped: one release, one wave, one clear reservation path. Behind the curtain, the same data model feeds receipts, launch digests, and the final fulfillment.

> **Show what the buyer secures by paying today.** Preorder copy is not "buy this when it ships" — it is "this is what is locked in the moment you reserve."

<br/>

## ▶ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/preorder-launch-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

<br/>

## 🚀 Release sections

| # | Section | What it does on the page |
|:-:|---------|--------------------------|
| `01` | **Release framing** | Clarify who this first wave is for and why spots are limited |
| `02` | **Reservation proof** | Show what the buyer secures by paying today |
| `03` | **Update cadence** | Promise how launch news and delivery timing will be communicated |
| `04` | **Reservation receipt** | Store buyer history with status, amount, and expected next step |
| `05` | **Launch digest** | Feed product updates and milestone notices back into the account area |
| `06` | **Final fulfillment** | Transition smoothly into full access or shipment when ready |

<br/>

## ◆ Launch discipline

> **Visual thesis:** An editorial product drop surface with strong merchandising, tighter copy, and entitlement-aware fulfillment cues. The first viewport should feel like a campaign poster with utility underneath.

```
    Preorder page
         │
         ▼
    ┌──────────┐    Receipt      ┌──────────────┐
    │ Reserved │ ───────────────▶│ Buyer ledger │
    └────┬─────┘                  └──────┬───────┘
         │                               │
         │       Wave updates            │
         └──────────────────────────────▶│
                                         ▼
                                  ┌──────────────┐
                                  │  Fulfillment │
                                  └──────────────┘
```

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ local env bootstrap script       ✔ reservation-aware copy in site.ts
```

<br/>

## ◆ Make it yours

- [ ] Replace the starter release with your real preorder campaign
- [ ] Define the wave, the cap, and the cutoff in the data model
- [ ] Build the buyer ledger: status, amount, and next expected step
- [ ] Add a launch digest route that pushes updates into the account area
- [ ] Plan the final fulfillment handoff before the campaign starts

---

<div align="center">
  <sub>FirstDrop · preorder launch starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
