# D1V 工作台设计规格 v2.0

> 12 个 industry 模板登录后的工作台,统一改为 **Layout + Tabs + 多子页面** 结构。
> 版本: v2.0
> 状态: 实施中
> 适用范围: 全部 12 个 d1v-templates/industries/*/* 应用

---

## 1. 设计动机

### 1.1 v1.0 的问题(被否决)

上一版设计把"5 模块工作台"塞到单页:

```
/console → PageHeader + greeting + 4 metrics + todos + resume + recent (全在一屏)
```

问题:
- **信息架构错误**:所有功能堆在一页,无视觉层次
- **无法深链**:子页面无法独立分享 / 收藏
- **移动端体验差**:5 模块纵向堆,屏幕外内容被切
- **不符合现代 SaaS 标准**:Notion / Linear / Stripe Dashboard 都用 tabs + 子页面

### 1.2 v2.0 的核心改动

**从"5 模块单页" → "Layout + Tabs + N 个独立子页面"**

每个工作台 = 1 个父布局(layout,渲染 tabs + outlet)+ N 个 tab 子页面(每个独立 loader / 独立 SEED / 独立 URL)。

---

## 2. 通用架构

### 2.1 URL 模式

两种路由模式(12 个应用各自选择合适的):

#### 模式 A: 嵌套路由(适合工作台层级清晰)

```
/console                       # layout + outlet
/console                       # overview (default)
/console/threads               # threads tab
/console/threads/:id           # thread detail
/console/prompts               # prompts tab
/console/prompts/:id           # prompt detail
/console/billing               # billing tab
```

#### 模式 B: 平级路由(适合工作台入口已经在 url 根)

```
/requests                      # layout + outlet
/requests                      # all (default)
/requests/awaiting             # awaiting tab
/requests/in-progress          # in-progress tab
/requests/closed               # closed tab
```

**实际选择**:
- **嵌套型**(5):SignalDesk(/console), OpsCanvas(/dashboard), CohortOS(/weeks + /weeks/:n/lesson), LessonLoop(/courses + /courses/:slug), FlexPass(/plans)
- **平级型**(7):ClientRoom(/requests), PromptVault(/catalog), DownloadPort(/library), FirstDrop(/drops), InnerCircle(/rooms), BriefClub(/issues), ClinicFlow(/book)

### 2.2 视觉骨架(全行业一致)

```
┌────────────────────────────────────────────────────┐
│  AppHeader (顶栏:logo + nav + user)               │
├────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌─────────────────────────────────┐ │
│  │ Sidebar  │ │ PageHeader (eyebrow + title)    │ │
│  │ ──────── │ ├─────────────────────────────────┤ │
│  │ ◉ Over.. │ │                                 │ │
│  │ ○ Thre.. │ │  Outlet (子页面内容)            │ │
│  │ ○ Prom.. │ │                                 │ │
│  │ ○ Bill.. │ │                                 │ │
│  │          │ │                                 │ │
│  │ ──────── │ │                                 │ │
│  │ Plan     │ │                                 │ │
│  │ status   │ │                                 │ │
│  └──────────┘ └─────────────────────────────────┘ │
├────────────────────────────────────────────────────┤
│  AppFooter                                         │
└────────────────────────────────────────────────────┘
```

**为什么 sidebar 而非 top tabs?**
- 5+ tabs 时 sidebar 节省垂直空间
- sidebar 在 SaaS 工作台是行业标准
- mobile 时 sidebar 折叠为顶部横向 scroll tabs
- sidebar 同时承载"plan status / 退出"等辅助区

### 2.3 子页面内容规约

每个 tab 子页面有自己的 loader,返回自己的 SEED 数据 + 自己的 PageHeader。**不与 overview 共享"5 模块"结构**。

```
tab 子页面:
- PageHeader (eyebrow + title + description)
- 主体内容(列表 / 卡片 / 网格)
- 可选 EmptyState
- 可选 CTA / Filter / Search
```

---

## 3. 共享组件契约

### 3.1 `<WorkspaceLayout>`

```ts
interface WorkspaceTab {
  label: string;             // "Overview"
  to: string;                // "/console" 或 "/console/threads"
  end?: boolean;             // 精确匹配(用于 overview)
  badge?: number | string;   // "3" 待办数
  hint?: string;             // 副标题(可选)
}

interface WorkspaceLayoutProps {
  tabs: WorkspaceTab[];
  activePath: string;        // 当前 pathname
  eyebrow: string;            // "Operator console"
  title: string;
  description: string;
  trailing?: ReactNode;       // 右上角额外元素(如 New 按钮)
  sidebarFooter?: ReactNode;   // sidebar 底部 plan status
  children: ReactNode;        // Outlet 内容
}
```

### 3.2 `<WorkspaceTabBar>` (被 Layout 内部使用)

- 当前激活态高亮(用 `theme.subEyebrow`)
- badge 数字小圆点
- 移动端转横向 scroll
- Link 跳转,Remix `<NavLink>` 风格

### 3.3 TypeScript 站点配置

`site.ts.industry.workspaceTabs` 字段,12 个应用每个 3-4 个 tab 配置。

```ts
workspaceTabs: WorkspaceTab[];
```

`WorkspaceTab` 类型在 `site.ts` 内导出,供 layout 使用。

---

## 4. 12 个工作台详细设计

### 4.1 SignalDesk AI — `/console`(Operator)

| Tab | Path | 内容 |
|-----|------|------|
| Overview | `/console` | greeting + 4 metrics + 跳到 Threads/Prompts 入口 |
| Threads | `/console/threads` | threads 列表 |
| Prompts | `/console/prompts` | prompts 列表(带 priority filter) |
| Billing | `/console/billing` | plan info + 跳 /pricing |

**路由文件**:
- `console.tsx` — layout
- `console._index.tsx` — overview(新建)
- `console.threads._index.tsx` (= 原 threads._index.tsx 迁移)
- `console.threads.$id.tsx` (= 原 threads.$id.tsx 迁移)
- `console.prompts._index.tsx` (新建)
- `console.prompts.$id.tsx` (新建,可选)
- `console.billing._index.tsx` (新建)

**SEED 切分**:
- Overview metrics: TELEMETRY 4 个直接复用
- Overview todo cards: threads + prompts 各取 3
- Threads tab: threads 全部
- Prompts tab: prompts 全部,UI 顶部加 priority filter

---

### 4.2 PromptVault — `/catalog`(Member)

| Tab | Path | 内容 |
|-----|------|------|
| Browse | `/catalog` | 全部 packs(原有) |
| My Library | `/catalog/library` | savedStacks + 进度 |
| Drops | `/catalog/drops` | 本月新 + 即将到来 |

**路由文件**(平级型,layout 直接放在 /catalog):
- `catalog.tsx` — layout
- `catalog._index.tsx` — overview (= 原 catalog._index 改)
- `catalog.library._index.tsx` (新建)
- `catalog.drops._index.tsx` (新建)

**SEED 切分**:
- Overview metrics: 3 个数字(owned / new / saved)
- Browse tab: 已有 PACKS 列表
- Library tab: 新增 SAVED_STACKS 数据
- Drops tab: 新增 DROPS 数据

---

### 4.3 ClientRoom — `/requests`(Client)

| Tab | Path | 内容 |
|-----|------|------|
| All | `/requests` | 全部 |
| Awaiting Me | `/requests/awaiting` | 过滤 `status === 'Awaiting client'` |
| In Progress | `/requests/in-progress` | 过滤 `status === 'In progress'` |
| Closed | `/requests/closed` | 过滤 `status === 'Closed'` |

**路由文件**:
- `requests.tsx` — layout
- `requests._index.tsx` — All(原内容改)
- `requests.awaiting._index.tsx` (新)
- `requests.in-progress._index.tsx` (新)
- `requests.closed._index.tsx` (新)

**SEED 切分**:
- 每个 tab 是 `requests.filter(r => r.status === X)`
- badge: 实时计算每个 tab 数量

---

### 4.4 OpsCanvas — `/dashboard`(Internal team)

| Tab | Path | 内容 |
|-----|------|------|
| KPI | `/dashboard` | 4 大 metrics(原 dashboard.tsx 内容) |
| Reports | `/dashboard/reports` | reports 列表 |
| Alerts | `/dashboard/alerts` | on-call 列表 |

**路由文件**:
- `dashboard.tsx` — layout
- `dashboard._index.tsx` — KPI(原 dashboard.tsx 内容迁移)
- `dashboard.reports._index.tsx` (= 原 reports._index 迁移)
- `dashboard.reports.$id.tsx` (= 原 reports.$id 迁移)
- `dashboard.alerts._index.tsx` (新)

---

### 4.5 DownloadPort — `/library`(Buyer)

| Tab | Path | 内容 |
|-----|------|------|
| Owned | `/library` | 已拥有 bundles |
| Updates | `/library/updates` | 过滤 `hasUpdate === true` |
| Browse | `/library/browse` | 全部 bundles |

**路由文件**:
- `library.tsx` — layout
- `library._index.tsx` — Owned(原 library._index 改)
- `library.updates._index.tsx` (新)
- `library.browse._index.tsx` (新)
- `library.$id.tsx` (保留,作为 detail)

---

### 4.6 FirstDrop — `/drops`(Pre-order buyer)

| Tab | Path | 内容 |
|-----|------|------|
| Live | `/drops` | TIER 1 |
| Pre-launch | `/drops/prelaunch` | TIER 2 |
| Announced | `/drops/announced` | TIER 3 |

**路由文件**:
- `drops.tsx` — layout
- `drops._index.tsx` — Live(原 drops._index 改)
- `drops.prelaunch._index.tsx` (新)
- `drops.announced._index.tsx` (新)
- `drops.$slug.tsx` (保留,作为 detail)

---

### 4.7 InnerCircle — `/rooms`(Community member)

| Tab | Path | 内容 |
|-----|------|------|
| This Week | `/rooms` | when 含这周 |
| Live | `/rooms/live` | 过滤 status === 'Live' |
| Upcoming | `/rooms/upcoming` | when > 今天 |
| Past | `/rooms/past` | when < 今天 |

**路由文件**:
- `rooms.tsx` — layout
- `rooms._index.tsx` — This Week(原内容改)
- `rooms.live._index.tsx` (新)
- `rooms.upcoming._index.tsx` (新)
- `rooms.past._index.tsx` (新)
- `rooms.$id.tsx` (保留)

---

### 4.8 BriefClub — `/issues`(Newsletter subscriber)

| Tab | Path | 内容 |
|-----|------|------|
| Latest | `/issues` | 最新 issue |
| Saved | `/issues/saved` | saved 列表 |
| Archive | `/issues/archive` | 全部 issues |

**路由文件**:
- `issues.tsx` — layout
- `issues._index.tsx` — Latest(原内容改)
- `issues.saved._index.tsx` (新)
- `issues.archive._index.tsx` (新)
- `issues.$number.tsx` (保留)

---

### 4.9 CohortOS — `/weeks`(Cohort student)

| Tab | Path | 内容 |
|-----|------|------|
| This Week | `/weeks` | current week 详情 |
| Upcoming | `/weeks/upcoming` | n > currentWeek |
| Past | `/weeks/past` | n < currentWeek |
| Syllabus | `/weeks/syllabus` | 完整 8 周表 |

**路由文件**:
- `weeks.tsx` — layout
- `weeks._index.tsx` — This Week(原内容改)
- `weeks.upcoming._index.tsx` (新)
- `weeks.past._index.tsx` (新)
- `weeks.syllabus._index.tsx` (= 原 weeks._index 全部内容迁移)
- `weeks.$n.tsx` (保留)
- `weeks.$n.lesson.tsx` (新,可选)

---

### 4.10 LessonLoop — `/courses`(Library student)

| Tab | Path | 内容 |
|-----|------|------|
| In Progress | `/courses` | progress ∈ (0, 100) |
| Completed | `/courses/completed` | progress === 100 |
| Browse | `/courses/browse` | 全部 courses |

**路由文件**:
- `courses.tsx` — layout
- `courses._index.tsx` — In Progress(原内容改)
- `courses.completed._index.tsx` (新)
- `courses.browse._index.tsx` (新)
- `courses.$slug.tsx` (保留)

---

### 4.11 ClinicFlow — `/book`(Patient)

| Tab | Path | 内容 |
|-----|------|------|
| My Visits | `/book` | appointments 列表 |
| New Booking | `/book/new` | 选 doctor + slot |
| Doctors | `/book/doctors` | doctors 列表 |

**路由文件**:
- `book.tsx` — layout
- `book._index.tsx` — My Visits(新建)
- `book.new._index.tsx` (= 原 book._index 内容迁移)
- `book.doctors._index.tsx` (新,或简化)
- `book.$doctorId.tsx` (保留)

---

### 4.12 FlexPass — `/plans`(Gym member)

| Tab | Path | 内容 |
|-----|------|------|
| My Plan | `/plans` | 当前 plan 详情 + 用量 |
| Classes | `/plans/classes` | 全部 classes |
| Schedule | `/plans/schedule` | 本周课表 |

**路由文件**:
- `plans.tsx` — layout
- `plans._index.tsx` — My Plan(改写)
- `plans.classes._index.tsx` (= 原 plans.tsx 迁移 classes 部分)
- `plans.schedule._index.tsx` (新)
- `classes.$id.tsx` (保留)

---

## 5. 数据契约

### 5.1 SEED 字段增量(共 16 个,全部可选)

```ts
type WorkspaceBaseEntity = {
  id: string;
  title: string;
  updatedAt: string;
  status?: string;
  priority?: 'high' | 'med' | 'low';
  ownerId?: string;
  progress?: number;          // 0-100
  context?: Record<string, string>;
};
```

具体应用增量:

| 应用 | 新增字段 |
|------|----------|
| SignalDesk | `prompts[].priority` |
| PromptVault | `savedStacks` 新数组(per-user),`PACKS[].progress` |
| ClientRoom | `requests[].priority` |
| OpsCanvas | `reports[].assignedToMe` |
| DownloadPort | `bundles[].hasUpdate`,`bundles[].lastOpenedAt` |
| FirstDrop | `drops[].userStatus` (per-user) |
| InnerCircle | `rooms[].userActionRequired`,`rooms[].lastAttendedAt` |
| BriefClub | `issues[].isNew`,`issues[].isSaved`,`issues[].readProgress` |
| CohortOS | `weeks[].userAction`,`weeks[].delivered` |
| LessonLoop | `courses[].lastTouchedAt` |
| ClinicFlow | `appointments[].userAction` |
| FlexPass | `membership` per-user object |

### 5.2 loader 切分规则

每个 tab loader 用同样的纯函数风格:

```ts
function buildRequestsWorkspace(requests: Request[]): WorkspaceData {
  return {
    greeting: { ... },
    metrics: [
      { label: 'Open', value: requests.filter(r => r.status !== 'Closed').length },
      { label: 'Awaiting me', value: requests.filter(r => r.status === 'Awaiting client').length },
      { label: 'Closed', value: requests.filter(r => r.status === 'Closed').length },
    ],
    todos: requests.filter(r => r.priority === 'high').slice(0, 3).map(...),
    resume: requests.sort('updatedAt')[0],
    recent: requests,
  };
}
```

**真实后端接入**:只需替换 loader 的 SEED 来源为 DB query,切分函数不变。

---

## 6. 共享组件实现要点

### 6.1 `<WorkspaceLayout>` 视觉要点

- **sidebar**:width 256px,sticky,scroll 独立
- **mobile (<md)**:sidebar 转横向 scroll tabs,顶部固定
- **active state**:左边 4px 高亮条 + 主题色背景
- **badge**:右上角小圆点(12px 圆,数字)
- **trailing 槽**:PageHeader 右上(如 "New request" 按钮)— 按需使用

### 6.2 `<WorkspaceTabBar>` Props

```ts
interface WorkspaceTabBarProps {
  tabs: WorkspaceTab[];
  activePath: string;        // 用 useResolvedPath + NavLink className
  layout?: 'sidebar' | 'top'; // 默认 sidebar
}
```

### 6.3 type 字段扩展

`site.ts` SiteConfig 类型加:

```ts
workspaceTabs: Array<{
  label: string;
  to: string;
  end?: boolean;
  badgeHint?: string;  // "Awaiting" / "Live" 等提示文本
}>;
```

---

## 7. 落地实施步骤

### 7.1 准备阶段(1 步)
- [ ] 写 `WorkspaceLayout.tsx` 共享组件
- [ ] 写 `WorkspaceTabBar.tsx` 共享组件
- [ ] 扩展 `site.ts` SiteConfig 类型 + 注入 12 个应用的 `workspaceTabs` 配置

### 7.2 改造阶段(12 步,逐个应用)
- [ ] SignalDesk AI:console.tsx + console._index + console.threads + console.prompts + console.billing
- [ ] PromptVault:catalog.tsx + catalog._index + catalog.library + catalog.drops
- [ ] ClientRoom:requests.tsx + 4 个子路由
- [ ] OpsCanvas:dashboard.tsx + dashboard._index + dashboard.reports + dashboard.alerts
- [ ] DownloadPort:library.tsx + 3 个子路由
- [ ] FirstDrop:drops.tsx + 3 个子路由
- [ ] InnerCircle:rooms.tsx + 4 个子路由
- [ ] BriefClub:issues.tsx + 3 个子路由
- [ ] CohortOS:weeks.tsx + 4 个子路由
- [ ] LessonLoop:courses.tsx + 3 个子路由
- [ ] ClinicFlow:book.tsx + 3 个子路由
- [ ] FlexPass:plans.tsx + 3 个子路由

### 7.3 验证阶段(12 步)
- [ ] 每个应用跑 pnpm typecheck,修复所有 0 错误
- [ ] 关键页面 dev server 启动验证(可选,选 1-2 个)
- [ ] 关键跳转路径手动核对(login → workspace → 各 tab)

---

## 8. 风险与回退

### 8.1 风险
- **嵌套 URL 变化**:SignalDesk 的 /threads 改为 /console/threads,可能影响现有用户书签
- **平级 URL 不变**:其他应用 URL 保持平级,无影响
- **loader 重复**:每个 tab 独立 loader,可能有重复 query

### 8.2 回退策略
- 平级型应用(`/requests` 等)URL 不变,影响最小
- 嵌套型应用(/threads 等)改路径,但旧文件保留作为重定向目标

### 8.3 不在范围
- ❌ 不改 onboarding / login / pricing / pay.success(已完工)
- ❌ 不改 AppHeader(已完工)
- ❌ 不改 README

---

## 9. 验收标准

每个应用满足:
- [ ] 工作台父路由是 layout(渲染 `<WorkspaceLayout>` + `<Outlet />`)
- [ ] 至少 3 个 tab(overview + 2 个分类)
- [ ] 每个 tab 独立路由,独立 SEED,独立 URL
- [ ] sidebar 视觉一致,激活态高亮
- [ ] mobile (<md) sidebar 转横向 scroll
- [ ] tsc --noEmit 0 错误
- [ ] 已登录访问子路由:正常渲染
- [ ] 未登录访问子路由:redirect /login?returnTo=...

---

**本文档版本: v2.0** · 实施状态: 启动中 · 维护: 持续更新
