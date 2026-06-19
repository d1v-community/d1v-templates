<div align="center">

<img src="https://img.shields.io/badge/category-creator-b91c1c?style=for-the-badge&logo=substack&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-1c1917?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/format-paid%20newsletter-fef3c7?style=for-the-badge&color=fef3c7" alt="format"/>

<br/><br/>

# 📰 BriefClub

<h3>Make the newsletter feel like a publication with a clean member archive and sharp offer —<br/>the archive is part of the product, not an afterthought.</h3>

<br/>

[**Install**](#-install) · [**Edition sections**](#-edition-sections) · [**Editorial principles**](#-editorial-principles) · [**Repository**](https://github.com/d1v-community/paid-newsletter-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80&auto=format&fit=crop" alt="Editorial newspaper publication" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(185, 28, 28, 0.30);"/>
  </picture>
</p>

<p align="center"><sub><i>📰 Read like a publication. Subscribe like a member.</i></sub></p>

<br/>

## ◆ What this template is

A **paid newsletter** starter built on `remix-neon-auth-pay`. The page reads like the masthead of a small publication, with one standout lead issue and a clearly framed archive.

> **Position the archive as the compounding reason to stay subscribed.** A reader who finds three good past issues renews without a sales call.

<br/>

## ▶ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/paid-newsletter-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

<br/>

## 📰 Edition sections

| # | Section | What it does on the page |
|:-:|---------|--------------------------|
| `01` | **Lead issue** | Feature one standout issue and one short reason to care |
| `02` | **Archive browser** | Browse by topic, date, or series once the member is inside |
| `03` | **Format clarity** | Tell readers whether they get text, audio, downloads, or all three |
| `04` | **Paid-only archive** | Position the archive as the compounding reason to stay subscribed |
| `05` | **Member extras** | Add occasional downloads, notes, or Q&A without bloating the core offer |
| `06` | **Renewal signal** | Show issue cadence and editorial consistency clearly |

<br/>

## ◆ Editorial principles

> **Visual thesis:** A creator-led publishing surface — closer to a small magazine than a SaaS dashboard. Use contrast and spacing to create taste instead of loud gradients.

```
     Masthead
        │
        ▼
   ┌────────────┐
   │ Lead issue │ ◀── one reason to care this week
   └────┬───────┘
        │
        ▼
   ┌────────────┐
   │  Archive   │ ◀── the compounding reason to stay
   └────┬───────┘
        │
        ▼
   ┌────────────┐
   │  Cadence   │ ◀── weekly, biweekly, monthly
   └────────────┘
```

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ local env bootstrap script       ✔ publication-aware copy in site.ts
```

<br/>

## ◆ Make it yours

- [ ] Replace the starter lead issue with a real standout piece
- [ ] Model the archive: issue, date, topic, and series
- [ ] Build the browser so members can search by topic or series
- [ ] Add member extras as occasional drops, not as a constant stream
- [ ] Signal renewal with a clear cadence and recent-issue indicators

---

<div align="center">
  <sub>BriefClub · paid newsletter starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
