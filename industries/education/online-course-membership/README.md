<div align="center">

<img src="https://img.shields.io/badge/category-education-0ea5e9?style=for-the-badge&logo=udemy&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-0c1e3e?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/format-membership%20library-38bdf8?style=for-the-badge" alt="format"/>

<br/><br/>

# 📘 LessonLoop

<h3>Package lessons, progress, and member access like a real learning product —<br/>build for progression, not just content storage.</h3>

<br/>

[**Install**](#-install) · [**Library sections**](#-library-sections) · [**Learning principles**](#-learning-principles) · [**Repository**](https://github.com/d1v-community/online-course-membership-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80&auto=format&fit=crop" alt="Online learning library" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(56, 189, 248, 0.30);"/>
  </picture>
</p>

<p align="center"><sub><i>📚 A library with a progress bar beats a library with a star rating.</i></sub></p>

<br/>

## ◆ What this template is

An **online course membership** starter built on `remix-neon-auth-pay`. The page reads like a learning library, not a video dump. Tracks, progress, and member access are visible in the first viewport so the value of the membership is obvious before the price.

> **Use the archive as the main reason to subscribe.** Members stay because the next lesson is reachable, not because the first lesson was great.

<br/>

## ▶ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/online-course-membership-template --write-path .env
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

## 📘 Library sections

<table>
<tr>
<td width="33%" valign="top" align="center">

### 🛤
**Learning tracks**
Group lessons by outcome, difficulty, or role.
A member opens the library looking for a path, not a video.

</td>
<td width="33%" valign="top" align="center">

### ✅
**Progress state**
Persist watched, completed, and next-up lesson states.
Progress is the most underrated member benefit.

</td>
<td width="33%" valign="top" align="center">

### 📎
**Resource shelf**
Bundle worksheets, links, or downloads into each track.
A lesson without a worksheet is a TED talk with a paywall.

</td>
</tr>
<tr>
<td width="33%" valign="top" align="center">

### 🏛
**Core library**
Use the archive as the main reason to subscribe.
The deeper the library, the longer the membership.

</td>
<td width="33%" valign="top" align="center">

### 🆕
**New lesson drops**
Signal freshness with a predictable release rhythm.
Cadence beats surprise for retention.

</td>
<td width="33%" valign="top" align="center">

### 🪜
**Upgrade ladder**
Add coaching or cohort layers later without rebuilding the foundation.
Build the ladder shape first — even if only two rungs exist today.

</td>
</tr>
</table>

<br/>

## ◆ Learning principles

> **Visual thesis:** A structured learning experience that emphasizes progression, schedules, and instructional trust. Progress surfaces should feel calm and instructional.

```
   Onboard
     │
     ▼
   Pick a track
     │
     ├─── Beginners
     ├─── Practitioners
     └─── Operators
              │
              ▼
         Watch lesson ──▶ Mark complete ──▶ Next lesson
                                                       │
                                                       ▼
                                              Next-up surfaced
                                                       │
                                                       ▼
                                              Drop notification
```

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ concierge hooks (D1V_PAI_*)      ✔ library-aware copy in site.ts
```

<br/>

## ◆ Make it yours

- [ ] Replace the starter tracks with the real curriculum map
- [ ] Model lesson progress: watched, completed, next-up per member
- [ ] Build the resource shelf per track
- [ ] Define the drop cadence and the next-up notification
- [ ] Plan the upgrade ladder (coaching, cohort, certification) early

---

<div align="center">
  <sub>LessonLoop · online course membership starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
