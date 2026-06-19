# UGC Implementation Spec — 10 Apps (3 batches)

## Shared components (already built in each app)

```
app/components/ugc/
  PostCard.tsx       - 通用帖子卡片
  Reactions.tsx      - 5 个 emoji 回应
  CommentThread.tsx  - 嵌套回复
  Composer.tsx       - 新建内容输入
  ReviewStars.tsx    - 1-5 星评分
```

## Schema (already migrated)

Each app has its own UGC tables in `app/db/schema.ts` and `drizzle/0000_init.sql`. See `ugc-migrate.mjs` for the list per app.

## Routes to add (per app)

### Batch 1 (P0 + P1, three apps)

**InnerCircle** (`community-membership`):
- `feed.tsx` (layout) + `feed._index.tsx` (global posts) + `feed.new.tsx` (compose) + `posts.$id.tsx` (post detail with comments) + `api.ugc.react.tsx` (reaction toggle)
- Schema tables: `ugc_posts`, `ugc_comments`, `ugc_reactions`

**ClientRoom** (`client-portal`):
- `requests.new.tsx` (create new request composer) + extend `requests.$id.tsx` with message thread
- Add `api.ugc.message.tsx` (post message to request)
- Schema tables: `ugc_request_messages`

**CohortOS** (`cohort-course`):
- `weeks.$n.submit.tsx` (compose deliverable) + `submissions.$id.review.tsx` (peer review form) + `weeks.$n.notes.tsx` (week reflections)
- Add `api.ugc.submit.tsx` + `api.ugc.review.tsx`
- Schema tables: `ugc_submissions`, `ugc_peer_reviews`

### Batch 2 (P2, four apps)

**LessonLoop** (`online-course-membership`):
- `courses.$slug.qa.tsx` (Q&A list + compose) + `qa.$id.tsx` (Q detail with answers)
- Schema tables: `ugc_notes`, `ugc_questions`, `ugc_answers`

**ClinicFlow** (`clinic-booking`):
- Extend `book.$doctorId.tsx` with post-visit review composer
- `messages.tsx` (in-app secure messaging list) + `messages.$doctorId.tsx` (thread)
- Schema tables: `ugc_reviews`, `ugc_messages`

**FlexPass** (`gym-membership`):
- `log.tsx` (workout log + compose) + `log.prs.tsx` (PR board) + extend `classes.$id.tsx` with checkin
- Schema tables: `ugc_workouts`, `ugc_prs`, `ugc_checkins`

**PromptVault** (`prompt-library-membership`):
- Extend `catalog.$slug.tsx` with reviews section
- `catalog.submit.tsx` (compose new pack)
- Schema tables: `ugc_reviews`, `ugc_pack_submissions`

### Batch 3 (P2 + P3, three apps)

**DownloadPort** (`digital-downloads`):
- Extend `library.$id.tsx` with reviews + Q&A
- Schema tables: `ugc_reviews`, `ugc_questions`, `ugc_answers`

**FirstDrop** (`preorder-launch`):
- Extend `drops.$slug.tsx` with reviews + share
- Schema tables: `ugc_reviews`, `ugc_shares`

**BriefClub** (`paid-newsletter`):
- Extend `issues.$number.tsx` with comments
- Schema tables: `ugc_comments`, `ugc_reactions`

## Pattern (use this for every route)

```tsx
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { sql } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcXxx, ugcYyy } from "~/db/schema";
import { requireUserOrRedirect } from "~/lib/auth-flow";
import { PostCard } from "~/components/ugc/PostCard";
import { Composer } from "~/components/ugc/Composer";
import { CommentThread } from "~/components/ugc/CommentThread";
// etc.

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  // SELECT from ugc tables, render seed + DB rows
  const items = await db.select().from(ugcXxx).where(...);
  return json({ user, items });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const formData = await request.formData();
  // Validate
  // INSERT into ugcXxx
  return json({ ok: true });
}

export default function XxxRoute() {
  const { user, items } = useLoaderData<typeof loader>();
  return (
    <div>
      {/* use PostCard / Composer / CommentThread */}
    </div>
  );
}
```

## Convention

- All UGC routes require login (use `requireUserOrRedirect`)
- All bodies are plain text (no markdown rendering) with maxLength 1000
- Reaction emoji: 👍 ❤️ 🎯 🔥 💡 (fixed 5)
- Comment nesting: 1 level only (flat)
- Ratings: 1-5 stars, integer

## Test

Each app must:
- `pnpm typecheck` (or `./node_modules/.bin/tsc --noEmit`) returns 0 errors
- Use SEED data when DB is empty (graceful fallback)

## Don't do

- Don't render markdown (plain text only)
- Don't add real-time updates
- Don't add notification system
- Don't add file upload
- Don't add email notifications
