<div align="center">

<img src="https://img.shields.io/badge/category-education-059669?style=for-the-badge&logo=coursera&logoColor=white" alt="category"/>
<img src="https://img.shields.io/badge/foundation-remix--neon--auth--pay-14532d?style=for-the-badge&logo=remix&logoColor=white" alt="foundation"/>
<img src="https://img.shields.io/badge/format-cohort%20based-10b981?style=for-the-badge" alt="format"/>

<br/><br/>

# 🎓 CohortOS

<h3>Sell the cohort before you build the full course backend —<br/>give the course a cadence, not just a checkout link.</h3>

<br/>

[**Install**](#-install) · [**Cohort modules**](#-cohort-modules) · [**Academic discipline**](#-academic-discipline) · [**Repository**](https://github.com/d1v-community/cohort-course-template)

</div>

---

<br/>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80&auto=format&fit=crop"/>
    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80&auto=format&fit=crop" alt="Cohort-based group learning" width="100%" style="border-radius: 12px; box-shadow: 0 24px 48px -12px rgba(16, 185, 129, 0.30);"/>
  </picture>
</p>

<p align="center"><sub><i>🎓 Enrollment is only the start of the learning product. Sequence is the value.</i></sub></p>

<br/>

## ◆ What this template is

A **cohort course** starter built on `remix-neon-auth-pay`. The page is structured around a real cohort, not a perpetual catalog. Lead date, weekly outcomes, and seat cap all live in the first viewport.

> **Trust comes from structure and clarity, not hype.** Show the schedule, the deliverables, and the seat cap. The student will decide.

<br/>

## ▶ Install

```bash
pnpm install
pnpm run env:bootstrap -- --template-repo d1v-community/cohort-course-template --write-path .env
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

## 🎓 Cohort modules

<table>
<tr>
<td width="50%" valign="top">

### `W1` Week-by-week syllabus
Expose module outcomes, assignments, and live touchpoints.
The syllabus is the product surface, not a PDF.

</td>
<td width="50%" valign="top">

### `W2` Progress tracking
Track attendance, completion, and deliverables through the cohort.
Progress is what students ask for in week two.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `W3` Support rhythm
Keep office hours, group reviews, and feedback windows visible.
A schedule without office hours is just a video list.

</td>
<td width="50%" valign="top">

### `W4` Cohort timing
Lead with next start date, session cadence, and seat cap.
The next date is the most important line on the page.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### `W5` Outcome framing
Promise concrete transformation tied to the syllabus.
Outcomes are tied to assignments, not adjectives.

</td>
<td width="50%" valign="top">

### `W6` Post-payment path
Move learners into prep, orientation, and goal-setting fast.
First-week momentum is the renewal signal for the next cohort.

</td>
</tr>
</table>

<br/>

## ◆ Academic discipline

> **Visual thesis:** A structured learning experience that emphasizes progression, schedules, and instructional trust. Sequence and milestones should be more visible than visual effects.

```
  Week 1     Week 2     Week 3     Week 4     Week 5     Week 6
  ─────      ─────      ─────      ─────      ─────      ─────
  Diagnose   Frame      Build      Critique   Ship       Reflect
  │          │          │          │          │          │
  ▼          ▼          ▼          ▼          ▼          ▼
  Goals     Plan       v1         Feedback   Final      Cohort
            │          │          │          delivery   retro
            ▼          ▼          ▼          ▼          ▼
            Syllabus  Module 1   Module 2   Module 3   Outcome
```

<br/>

## ◆ What's already wired

```
✔ passwordless email auth         ✔ hosted checkout + /pricing
✔ Neon / PostgreSQL + Drizzle      ✔ live snapshot at /api/template/snapshot
✔ concierge hooks (D1V_PAI_*)      ✔ cohort-aware copy in site.ts
```

<br/>

## ◆ Make it yours

- [ ] Replace the starter syllabus with the real cohort structure
- [ ] Model cohort entities: starts_on, seat_cap, week_outcomes
- [ ] Build the progress surface so learners can see week state
- [ ] Define office hours and group review rhythm in the data layer
- [ ] Plan post-payment prep, orientation, and goal-setting from day one

---

<div align="center">
  <sub>CohortOS · cohort course starter · <code>remix-neon-auth-pay</code> foundation</sub>
</div>
