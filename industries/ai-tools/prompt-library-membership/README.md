<div align="center">

<img src="https://img.shields.io/badge/category-ai--tools-14b8a6?style=for-the-badge&logo=openai&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-064e3b?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/membership-paid%20catalog-f59e0b?style=for-the-badge" alt="membership"/>

<br/><br/>

# 📚 PromptVault

<h3><i>Package prompt knowledge like a premium catalog with guided discovery built in.</i></h3>

<br/>

[**Install**](#-install) · [**Vault sections**](#-vault-sections) · [**Curation model**](#-curation-model) · [**Repository**](https://github.com/d1v-community/prompt-library-membership-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80&auto=format&fit=crop" alt="Library shelves with curated books" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(245, 158, 11, 0.25);"/>
  </picture>
</p>

<p align="center"><sub><i>📖 The catalog reads like a curated product line — not a download dump.</i></sub></p>

<br/>

> **Treat the catalog like a product line, not a download dump.** Members don't want files. They want a way to find the right prompt for the next job.

<br/>

## ◆ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/prompt-library-membership-template --write-path .env
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

## ▤ Vault sections

<table>
<tr>
<td width="33%" valign="top" align="center">

### 🔍
**Search by workflow**
Prompts grouped by *jobs-to-be-done*, not by random titles.

</td>
<td width="33%" valign="top" align="center">

### 👁
**Pack previews**
Excerpts, outcomes, and setup notes before the paywall.

</td>
<td width="33%" valign="top" align="center">

### 🔖
**Saved stacks**
Bookmark packs for teams, launches, or verticals.

</td>
</tr>
<tr>
<td width="33%" valign="top" align="center">

### ♾️
**Membership promise**
Everything new is included while the member stays active.

</td>
<td width="33%" valign="top" align="center">

### 📅
**Drop calendar**
Issue-style release notes that keep value visible.

</td>
<td width="33%" valign="top" align="center">

### ⬆️
**Upsell path**
Custom packs and consulting reserved for premium tiers.

</td>
</tr>
</table>

<br/>

## ◆ Curation model

```
            ┌─────────────────────────────────────┐
            │  Curated by a single voice, not     │
            │  scraped from the community feed    │
            └─────────────┬───────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Workflow lens     Outcome lens      Author lens
   "What job?"       "What result?"    "Whose taste?"
        │                 │                 │
        └────────┬────────┴────────┬────────┘
                 ▼                 ▼
         Stack of packs    Member collection
```

<br/>

## ◆ Editorial style

> **Visual thesis:** A creator-led catalog surface — closer to a small magazine than a SaaS dashboard. Spacing does the work, gradients stay out of the way, and every pack has a *reason* on the page, not just a price.

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ concierge hooks (D1V_PAI_*)      ✔ local env bootstrap script
✔ catalog-aware copy in site.ts    ✔ member entitlement model
```

<br/>

## ◆ Make it yours

- [ ] Replace the starter catalog with your real prompt line
- [ ] Define pack metadata: workflow, outcome, difficulty, role
- [ ] Wire member entitlement to *all current + future drops*
- [ ] Add a tasting flow: 1 free pack per week for non-members
- [ ] Layer in custom-pack requests as a premium tier later

---

<div align="center">
  <sub>PromptVault · paid prompt library starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
