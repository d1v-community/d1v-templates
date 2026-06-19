<div align="center">

<img src="https://img.shields.io/badge/category-creator-ec4899?style=for-the-badge&logo=patreon&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-2e1065?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/format-paid%20community-f472b6?style=for-the-badge" alt="format"/>

<br/><br/>

# 🌙 InnerCircle

<h3>Make the membership feel like an active club with rhythm, archive, and perks —<br/>belonging needs structure, or the membership will feel empty.</h3>

<br/>

[**Install**](#-install) · [**Club sections**](#-club-sections) · [**Member rhythm**](#-member-rhythm) · [**Repository**](https://github.com/d1v-community/community-membership-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80&auto=format&fit=crop" alt="Members gathering together" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(236, 72, 153, 0.30);"/>
  </picture>
</p>

<p align="center"><sub><i>🌹 Treat content and community as the product, not as filler around checkout.</i></sub></p>

<br/>

## ◆ What this template is

A **creator community membership** built on `remix-neon-auth-pay`. The hero is the creator's voice and the club's rhythm, not a feature wall. Archive, calendar, and perks live in the first viewport so members know what they are joining.

> **Use contrast and spacing to create taste, not loud gradients.** A membership page that looks like a SaaS dashboard will feel like one.

<br/>

## ▶ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/community-membership-template --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

<br/>

## 🌙 Club sections

<table>
<tr>
<td width="50%" valign="top">

### 📅 Ritual calendar
Show office hours, live sessions, or recurring member moments.
A club without cadence is a chat room with a paywall.

</td>
<td width="50%" valign="top">

### 🗄 Archive depth
Make premium posts, replays, and downloads easy to browse.
The archive is half the value of the membership.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎁 Perk delivery
Bundle templates, chat access, or discounts into the account area.
Perks should be the *small* things members brag about.

</td>
<td width="50%" valign="top">

### 🪪 Founding member angle
Use limited-time positioning without overcomplicating the offer.
Scarcity belongs in framing, not in artificial caps.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⬆️ Upgrade path
Introduce higher tiers later through coaching or small-group access.
Ladder should be visible from day one — even if not yet built.

</td>
<td width="50%" valign="top">

### 🤝 Community support
Blend AI answers with creator touchpoints for routine questions.
The creator's voice should still reach the routine asks.

</td>
</tr>
</table>

<br/>

## ◆ Member rhythm

> **Visual thesis:** A creator-led publishing surface with stronger voice, membership cues, and media-led storytelling. Visual rhythm should feel more like a publication than a dashboard.

```
   Monday           Wednesday           Friday            Sunday
   ──────           ────────            ──────            ──────
   Member note      Office hours        Drop              Member
   (archive)        (live)              (new post)        digest
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

- [ ] Replace the starter club with your real rhythm and voice
- [ ] Define the membership data model: tiers, perks, and access levels
- [ ] Build the calendar surface so members can plan attendance
- [ ] Design the archive browser for posts, replays, and downloads
- [ ] Layer in coaching or small-group tiers as a visible ladder

---

<div align="center">
  <sub>InnerCircle · creator community membership starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
