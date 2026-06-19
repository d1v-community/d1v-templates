<div align="center">

<img src="https://img.shields.io/badge/category-commerce-f59e0b?style=for-the-badge&logo=shopify&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-1e1b4b?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/storefront-downloads-facc15?style=for-the-badge" alt="storefront"/>

<br/><br/>

# 🎁 DownloadPort

<h3>Stage digital goods like a premium catalog, then deliver them cleanly after checkout —<br/>the product page matters, but the download experience closes the trust loop.</h3>

<br/>

[**Install**](#-install) · [**Catalog sections**](#-catalog-sections) · [**Editorial direction**](#-editorial-direction) · [**Repository**](https://github.com/d1v-community/digital-downloads-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1600&q=80&auto=format&fit=crop" alt="Premium digital product drop" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(250, 204, 21, 0.35);"/>
  </picture>
</p>

<p align="center"><sub><i>🎨 The first viewport should feel like a campaign poster with utility underneath.</i></sub></p>

<br/>

## ◆ What this template is

A **digital downloads storefront** built on `remix-neon-auth-pay`. The landing page reads like an editorial product drop, not a generic pricing screen: one flagship bundle, clear packaging, and a download locker waiting after checkout.

> **Merchandising details should read like product direction, not filler bullets.** The buyer wants a reason to commit, not a feature checklist.

<br/>

## ▶ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/digital-downloads-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

<br/>

## 🎁 Catalog sections

<table>
<tr>
<td width="33%" valign="top" align="center">

### 🏆
**Flagship bundle**
Use one dominant product story to anchor the page. The bundle is the headline, not the price.

</td>
<td width="33%" valign="top" align="center">

### 📦
**What is included**
Spell out file types, templates, and bonus assets clearly. Surprise is for gifts, not for orders.

</td>
<td width="33%" valign="top" align="center">

### 📜
**Usage rights**
Make licensing simple to scan before purchase. Ambiguity is the most expensive support ticket.

</td>
</tr>
<tr>
<td width="33%" valign="top" align="center">

### 🔐
**Download locker**
Give buyers a clean history of purchases and files. The "where is my file?" moment should not exist.

</td>
<td width="33%" valign="top" align="center">

### 🆕
**Update feed**
Ship revised files or new bonus assets without manual support. Versioning belongs to the seller, not the buyer.

</td>
<td width="33%" valign="top" align="center">

### 🔁
**Cross-sell logic**
Suggest bundles or memberships after a successful purchase. The next offer is part of the same order, not a popup.

</td>
</tr>
</table>

<br/>

## ◆ Editorial direction

> **Visual thesis:** An editorial product drop surface with strong merchandising, tighter copy, and entitlement-aware fulfillment cues. Fulfillment language should reassure the buyer immediately.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  CAMPAIGN POSTER     →     PRODUCT COPY     →    FILES   │
│  (hero)                   (what + rights)       (locker) │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ local env bootstrap script       ✔ download-aware copy in site.ts
```

<br/>

## ◆ Make it yours

- [ ] Replace the starter bundle with your real flagship product
- [ ] Map checkout success to a per-buyer download entitlement
- [ ] Build the download locker: history, files, and re-download links
- [ ] Add an update feed so revised files reach previous buyers
- [ ] Define cross-sell rules for bundles and membership upsell

---

<div align="center">
  <sub>DownloadPort · digital downloads starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
