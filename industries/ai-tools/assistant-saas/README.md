<div align="center">

<img src="https://img.shields.io/badge/category-ai--tools-22d3ee?style=for-the-badge&logo=robot-framework&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-0a1628?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/runtime-ready_for_product-0ea5e9?style=for-the-badge" alt="runtime"/>

<br/><br/>

# ◢ SignalDesk AI

<h3>Run pricing, onboarding, and live assistance as one operator surface —<br/>not as three disconnected marketing pages.</h3>

<br/>

[**Quickstart**](#-quickstart) · [**Operator modules**](#-operator-modules) · [**Design thesis**](#-design-thesis) · [**Repository**](https://github.com/d1v-community/assistant-saas-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80&auto=format&fit=crop" alt="AI operator console" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(34, 211, 238, 0.25);"/>
  </picture>
</p>

<p align="center"><sub><i>◢ Live, layered, intentionally busy where it should be — quiet where the operator needs focus.</i></sub></p>

<br/>

## ◆ What this template is

A subscription **AI assistant SaaS** built on `remix-neon-auth-pay`. The hero is an operator surface, not a marketing page: paid access, usage guardrails, prompt operations, and account expansion live in the same first viewport.

> **The persona on the other side of the screen** is a paid operator who runs the assistant like a product — not a demo.

<br/>

## ▶ Quickstart

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/assistant-saas-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

> **Optional concierge wiring**
> ```bash
> D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
> D1V_PAI_API_KEY=your_project_level_pai_api_key
> ```

<br/>

## ◢ Operator modules

<table>
<tr>
<td width="50%" valign="top">

### `01` Conversation history
Recent threads · owner · unresolved flags.
The thread is the unit of work, not the chat bubble.

</td>
<td width="50%" valign="top">

### `02` Usage guardrails
Seat limits · credit burn · model policy snapshots.
Operators should see burn *before* the bill.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `03` Prompt operations
Starter packs · onboarding scripts · fallback replies.
Prompts are versioned, not improvised.

</td>
<td width="50%" valign="top">

### `04` Plan framing
What a paid workspace actually unlocks.
Pricing copy should match the offer, not the template.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `05` Activation handoff
Setup, imports, and kickoff after checkout.
First-session quality is the renewal signal.

</td>
<td width="50%" valign="top">

### `06` Team expansion
Admins adding seats and credits over time.
The template grows with the account.

</td>
</tr>
</table>

<br/>

## ◆ Design thesis

> A **luminous command surface** that feels like operating a live intelligence product — not browsing a generic SaaS landing page.

| Layer | Thesis |
|-------|--------|
| **Hero** | Operator-grade promise with an immediate paid-access CTA. No marketing detour. |
| **Support** | Live signal, memory, and usage guardrails on the same canvas as the offer. |
| **Detail** | Workspace modules that show how the product is *used*, not how it is *pitched*. |
| **Final CTA** | Move the visitor into pricing or login without a single modal in between. |

<details>
<summary><b>▸ Interaction notes</b></summary>

<br/>

- Telemetry panels should feel **layered and live**, not boxed and static.
- Accent motion should suggest **streaming data**, not decorative glow.
- Assistant prompts should feel **operational and specific** to the offer.
- Density increases confidence — only when every label still scans.

</details>

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ concierge hooks (D1V_PAI_*)      ✔ local env bootstrap script
```

<br/>

## ◆ Replace and ship

- [ ] Swap starter sections for the real assistant workflow
- [ ] Extend the seeded schema with your production entities (threads, credits, plans)
- [ ] Map successful checkout to entitlements, seats, and credit grants
- [ ] Add success-state fulfillment beyond the hosted return page
- [ ] Tune the concierge prompt and connect it to your product workflow

---

<div align="center">
  <sub>SignalDesk AI · powered by <code>remix-neon-auth-pay</code> · shipped via the d1v community template registry</sub>
</div>
