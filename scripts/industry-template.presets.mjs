export const CATEGORY_DESIGN_MATRIX = {
  "ai-tools": {
    family: "ai",
    layout: "command",
    visualThesis:
      "A luminous command surface that feels like operating a live intelligence product, not browsing a generic SaaS landing page.",
    contentPlan: [
      "Hero: operator-grade promise plus immediate paid access CTA",
      "Support: live signal, memory, and usage guardrails",
      "Detail: workspace modules that show how the product gets used every day",
      "Final CTA: move the visitor into pricing or login without friction",
    ],
    interactionThesis: [
      "Telemetry panels should feel layered and live, not boxed and static.",
      "Accent motion should suggest streaming data rather than decorative glow.",
      "Assistant prompts should feel operational and specific to the offer.",
    ],
  },
  business: {
    family: "business",
    layout: "operations",
    visualThesis:
      "A quiet enterprise workstation with clear hierarchy, strong tables, and no marketing-heavy chrome.",
    contentPlan: [
      "Hero: orient the operator around the workspace value immediately",
      "Support: show queues, milestones, and KPI surfaces",
      "Detail: map the service workflow and account operations model",
      "Final CTA: push the buyer into secure access or paid seats",
    ],
    interactionThesis: [
      "Panels should behave like dashboards, not promo cards.",
      "Density should increase confidence without becoming noisy.",
      "The page should reward scanning headings, labels, and states.",
    ],
  },
  commerce: {
    family: "commerce",
    layout: "editorial",
    visualThesis:
      "An editorial product drop surface with strong merchandising, tighter copy, and entitlement-aware fulfillment cues.",
    contentPlan: [
      "Hero: the offer and why it deserves attention now",
      "Support: product framing, packaging, and drop mechanics",
      "Detail: what the buyer gets after checkout",
      "Final CTA: convert with one clear purchase path",
    ],
    interactionThesis: [
      "The first viewport should feel like a campaign poster with utility underneath.",
      "Merchandising details should read like product direction, not filler bullets.",
      "Fulfillment language should reassure the buyer immediately.",
    ],
  },
  creator: {
    family: "creator",
    layout: "editorial",
    visualThesis:
      "A creator-led publishing surface with stronger voice, membership cues, and media-led storytelling.",
    contentPlan: [
      "Hero: creator promise and member access hook",
      "Support: show the cadence, archive, and premium perks",
      "Detail: make post-purchase community or content access tangible",
      "Final CTA: push the visitor into a simple paid join flow",
    ],
    interactionThesis: [
      "Treat content and community as the product, not as filler around checkout.",
      "Visual rhythm should feel more like a publication than a dashboard.",
      "Use contrast and spacing to create taste instead of loud gradients.",
    ],
  },
  education: {
    family: "education",
    layout: "academy",
    visualThesis:
      "A structured learning experience that emphasizes progression, schedules, and instructional trust.",
    contentPlan: [
      "Hero: outcome, cadence, and access path",
      "Support: curriculum, milestones, and learner guidance",
      "Detail: show how the student moves through the product",
      "Final CTA: enroll, log in, or review pricing",
    ],
    interactionThesis: [
      "Progress surfaces should feel calm and instructional.",
      "Sequence and milestones should be more visible than visual effects.",
      "Trust comes from structure and clarity, not hype.",
    ],
  },
  local: {
    family: "local",
    layout: "service",
    visualThesis:
      "A service-first booking and membership surface focused on trust, availability, and action on mobile.",
    contentPlan: [
      "Hero: trust signal, service promise, and immediate booking or plan CTA",
      "Support: hours, plans, availability, and common next actions",
      "Detail: explain what happens before and after a booking or signup",
      "Final CTA: move the visitor into a clear service transaction",
    ],
    interactionThesis: [
      "Make time, staff, and capacity easy to scan.",
      "Trust should come from clarity, not from decorative polish alone.",
      "Primary actions should always feel one tap away.",
    ],
  },
};

export const TEMPLATE_EXPERIENCES = {
  "ai-assistant-saas": {
    heroMetrics: [
      { value: "24/7", label: "Copilot availability", detail: "Serve paid members without a support queue." },
      { value: "3", label: "Revenue levers", detail: "Seats, credits, and premium workflows." },
      { value: "<90s", label: "Checkout latency", detail: "Move a signed-in user from pitch to payment fast." },
    ],
    showcase: {
      eyebrow: "Workspace preview",
      title: "Turn pricing, onboarding, and live assistance into one operator surface.",
      description:
        "Use the starter to stage product demos, qualify buyers, and unlock paid assistant access without rebuilding auth or billing.",
      panels: [
        { title: "Conversation queue", value: "18", detail: "Threads waiting for follow-up or automation review.", meta: "Live queue" },
        { title: "Seat coverage", value: "41", detail: "Active member seats with room for team expansion.", meta: "Paid workspaces" },
        { title: "Credit policy", value: "Usage caps", detail: "Gate heavier flows behind credits or premium tiers.", meta: "Monetization" },
        { title: "Handoff flow", value: "Ops ready", detail: "Escalate account issues into human support only when needed.", meta: "Support" },
      ],
    },
    workflow: {
      eyebrow: "Launch flow",
      title: "Structure the product like an assistant business, not a demo bot.",
      description:
        "The starter already covers login and checkout. Focus the next pass on the commercial model around the assistant.",
      steps: [
        { title: "Model workspace entitlements", description: "Tie seats, credits, and premium tools to successful checkout states." },
        { title: "Store threads and context", description: "Persist conversations, feedback, and tool usage for member workspaces." },
        { title: "Instrument support handoff", description: "Track when the assistant should escalate into humans or premium service." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Product modules",
        title: "Give operators real surfaces to work from.",
        description: "These modules make the template feel like a paid AI product immediately.",
        items: [
          { title: "Conversation history", description: "Recent threads, owner assignment, and unresolved flags.", meta: "Core workspace" },
          { title: "Usage guardrails", description: "Seat limits, credit burn, and model policy snapshots.", meta: "Billing aware" },
          { title: "Prompt operations", description: "Starter prompt packs, onboarding scripts, and fallback replies.", meta: "Admin tools" },
        ],
      },
      {
        eyebrow: "Go-to-market",
        title: "Make the purchase path feel inevitable.",
        description: "The paid offer should read as operationally mature from the first screen.",
        items: [
          { title: "Plan framing", description: "Describe exactly what a paid workspace unlocks.", meta: "Conversion" },
          { title: "Activation handoff", description: "Route successful buyers into setup, imports, or kickoff questions.", meta: "Onboarding" },
          { title: "Team expansion", description: "Show how admins can add seats and credits over time.", meta: "Retention" },
        ],
      },
    ],
    faq: [
      { question: "What should happen after checkout?", answer: "Activate the workspace, issue starting credits or seats, and move the buyer into a first-run setup flow." },
      { question: "What should the database model first?", answer: "Threads, workspace memberships, credit balances, and support escalations are the fastest path to a real product." },
      { question: "Where does the AI concierge fit?", answer: "Use it as presales and onboarding support while the product workspace matures behind the paywall." },
    ],
  },
  "ai-prompt-library-membership": {
    heroMetrics: [
      { value: "120+", label: "Starter prompts", detail: "Position packs and workflows as a premium archive." },
      { value: "Weekly", label: "Release cadence", detail: "Keep membership value visible through predictable drops." },
      { value: "2 tiers", label: "Access model", detail: "Mix free discovery with paid depth." },
    ],
    showcase: {
      eyebrow: "Library preview",
      title: "Package prompt knowledge like a premium catalog with guided discovery built in.",
      description:
        "Turn prompt packs, workflows, and release notes into a paid destination with search, membership access, and a smart guide.",
      panels: [
        { title: "Featured pack", value: "Sales OS", detail: "High-conversion prompts for outbound, follow-up, and proposal prep.", meta: "Front shelf" },
        { title: "Member archive", value: "47 packs", detail: "Organize by workflow, persona, and complexity.", meta: "Gated content" },
        { title: "Release notes", value: "Friday drops", detail: "Give members a reason to return every week.", meta: "Retention" },
        { title: "Guide prompts", value: "Smart routing", detail: "Help visitors land on the right pack before they bounce.", meta: "Discovery" },
      ],
    },
    workflow: {
      eyebrow: "Content workflow",
      title: "Treat the catalog like a product line, not a download dump.",
      description:
        "Build around content packaging, search, and member unlock states so the subscription feels alive.",
      steps: [
        { title: "Define pack entities", description: "Store prompt packs, tags, authors, release notes, and preview snippets." },
        { title: "Map paywall boundaries", description: "Decide what stays public, what becomes teaser content, and what is fully members-only." },
        { title: "Guide discovery", description: "Use the assistant to recommend packs based on team role, workflow, or use case." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Member experience",
        title: "Build a library that feels curated.",
        description: "Premium discovery beats a long undifferentiated grid every time.",
        items: [
          { title: "Search by workflow", description: "Group prompts by jobs-to-be-done, not by random titles.", meta: "IA" },
          { title: "Pack previews", description: "Show excerpts, outcomes, and setup notes before the paywall.", meta: "Conversion" },
          { title: "Saved stacks", description: "Let members bookmark packs for teams, launches, or verticals.", meta: "Retention" },
        ],
      },
      {
        eyebrow: "Monetization",
        title: "Keep the offer easy to explain.",
        description: "One strong plan can carry the product if the archive feels deep and current.",
        items: [
          { title: "Membership promise", description: "Everything new is included as long as the member stays active.", meta: "Pricing" },
          { title: "Drop calendar", description: "Use issue-style release notes to keep value visible.", meta: "Lifecycle" },
          { title: "Upsell path", description: "Reserve custom packs or consulting bundles for premium tiers later.", meta: "Expansion" },
        ],
      },
    ],
    faq: [
      { question: "What should users see before paying?", answer: "Show enough previews to prove quality, then gate full packs, updates, and implementation notes." },
      { question: "What keeps members subscribed?", answer: "A clear release cadence, better categorization, and fast discovery usually outperform adding dozens of low-quality prompts." },
      { question: "How should the AI guide behave?", answer: "Recommend packs, explain membership value, and point visitors toward specific workflows instead of generic chat." },
    ],
  },
  "business-internal-dashboard": {
    heroMetrics: [
      { value: "9", label: "Tracked KPIs", detail: "Give operators a working surface immediately." },
      { value: "4 roles", label: "Access layers", detail: "Keep admin, finance, and ops views separate." },
      { value: "Daily", label: "Reporting loop", detail: "Position the template around recurring use." },
    ],
    showcase: {
      eyebrow: "Operator surface",
      title: "Replace the hero mindset with a real reporting and actions workspace.",
      description:
        "This starter should feel like the shell around live metrics, queues, and approvals from the first deploy.",
      panels: [
        { title: "Approval queue", value: "12", detail: "Outstanding reviews across vendors, spend, and launches.", meta: "Action needed" },
        { title: "Health score", value: "93%", detail: "A simple composite signal for leadership and operations.", meta: "Overview" },
        { title: "Finance sync", value: "11:40", detail: "Show freshness so operators trust the numbers.", meta: "Last sync" },
        { title: "Ops notes", value: "5", detail: "Critical context attached to active incidents or blockers.", meta: "Context" },
      ],
    },
    workflow: {
      eyebrow: "Operations flow",
      title: "Start with orientation, freshness, and next action.",
      description:
        "The highest-value dashboard surfaces tell operators what changed, what matters, and what to do next.",
      steps: [
        { title: "Model the operational entities", description: "KPIs, incidents, approvals, and tasks should have explicit ownership and state." },
        { title: "Protect by role", description: "Secure sensitive routes with staff roles or paid seat permissions." },
        { title: "Show freshness", description: "Expose last-sync timestamps so internal users trust the workspace." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Workspace patterns",
        title: "Favor dense clarity over decorative layouts.",
        description: "Operators need scanning surfaces more than branded flourishes.",
        items: [
          { title: "KPI strip", description: "Compact metrics with trend context and timestamping.", meta: "Monitoring" },
          { title: "Queue table", description: "Approvals, owner assignment, and stuck-state visibility.", meta: "Execution" },
          { title: "Incident timeline", description: "A single place for escalation, audit notes, and resolution state.", meta: "Control" },
        ],
      },
      {
        eyebrow: "Commercial model",
        title: "Use payment rails for retainers or premium access.",
        description: "Even internal tools can sell secure admin seats, consulting layers, or managed reporting access.",
        items: [
          { title: "Seat-based access", description: "Map successful checkout to paid operator seats or workspace plans.", meta: "Revenue" },
          { title: "Managed reporting", description: "Monetize dashboards for clients or partner teams later.", meta: "Expansion" },
          { title: "Audit trail", description: "Use Drizzle models to track plan changes and role grants.", meta: "Compliance" },
        ],
      },
    ],
    faq: [
      { question: "What should the homepage emphasize?", answer: "Orientation, KPI health, queue state, and role-aware actions are higher value than broad marketing copy." },
      { question: "Which tables come first?", answer: "Teams, dashboards, metrics, approvals, incidents, and audit events usually provide the strongest base." },
      { question: "How should checkout fit this template?", answer: "Use it for secure admin seats, premium client reporting, or retainer-backed workspace access." },
    ],
  },
  "business-client-portal": {
    heroMetrics: [
      { value: "Shared", label: "Project visibility", detail: "Clients should see progress without asking." },
      { value: "1 hub", label: "Files and milestones", detail: "Keep delivery artifacts in one account surface." },
      { value: "Retainer", label: "Payment mode", detail: "Use paid access as part of the service package." },
    ],
    showcase: {
      eyebrow: "Client workspace",
      title: "Turn service delivery into a portal clients actually want to log into.",
      description:
        "Move project updates, files, approvals, and support questions out of email and into a paid client room.",
      panels: [
        { title: "Current milestone", value: "Design review", detail: "Give the client one obvious place to understand progress.", meta: "Live project" },
        { title: "Pending approvals", value: "3", detail: "Highlight where the client is blocking the timeline.", meta: "Client action" },
        { title: "Deliverable vault", value: "26 files", detail: "Keep every artifact versioned and visible.", meta: "Files" },
        { title: "Support desk", value: "AI + human", detail: "Answer routine client questions before they become meetings.", meta: "Service" },
      ],
    },
    workflow: {
      eyebrow: "Delivery system",
      title: "Use the portal to reduce chaos, not to mirror your inbox.",
      description:
        "The best client portals clarify status, next approvals, and what the buyer is paying for every month.",
      steps: [
        { title: "Model client-facing entities", description: "Projects, milestones, files, comments, and approvals need first-class records." },
        { title: "Map plan to access", description: "Use payments to control client seats, portal depth, or support SLAs." },
        { title: "Automate routine support", description: "Let the assistant answer portal access and project status questions by default." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Portal modules",
        title: "Show the service, not just the invoice.",
        description: "A strong client portal proves value between meetings.",
        items: [
          { title: "Milestone timeline", description: "Display current phase, dependencies, and blockers in one view.", meta: "Visibility" },
          { title: "Deliverable browser", description: "Organize files, drafts, approvals, and final assets cleanly.", meta: "Fulfillment" },
          { title: "Request queue", description: "Track client asks so scope and response time stay visible.", meta: "Support" },
        ],
      },
      {
        eyebrow: "Service economics",
        title: "Make retainers and premium access feel coherent.",
        description: "The portal should explain why the paid relationship continues month after month.",
        items: [
          { title: "Retainer framing", description: "Tie portal access to ongoing updates, file history, and support continuity.", meta: "Offer" },
          { title: "Client onboarding", description: "Use payment success to trigger account setup and project intake.", meta: "Activation" },
          { title: "Expansion path", description: "Add new projects, seats, or premium support over time.", meta: "Growth" },
        ],
      },
    ],
    faq: [
      { question: "What should new clients see right away?", answer: "Current milestone, latest files, next action, and how to request support or approvals." },
      { question: "How does AI fit in a portal?", answer: "Use it to answer routine access questions, explain project states, and route common support tickets." },
      { question: "What data model matters first?", answer: "Clients, projects, milestones, uploads, approvals, and support conversations are the best starting set." },
    ],
  },
  "commerce-digital-downloads": {
    heroMetrics: [
      { value: "Instant", label: "Fulfillment", detail: "The buyer should get value immediately after payment." },
      { value: "Bundles", label: "Packaging", detail: "Sell singles, packs, and premium editions." },
      { value: "Evergreen", label: "Revenue base", detail: "Keep the product discoverable long after launch day." },
    ],
    showcase: {
      eyebrow: "Merchandising surface",
      title: "Stage digital goods like a premium catalog, then deliver them cleanly after checkout.",
      description:
        "Use the starter to sell templates, assets, documents, or kits with a stronger shelf, tighter offer framing, and post-purchase download states.",
      panels: [
        { title: "Featured bundle", value: "Creator kit", detail: "Lead with one strong flagship bundle instead of a noisy grid.", meta: "Hero offer" },
        { title: "Format mix", value: "PDF / ZIP / Notion", detail: "Make delivery expectations obvious before purchase.", meta: "Fulfillment" },
        { title: "License state", value: "Commercial", detail: "Clarify usage rights to reduce refund friction.", meta: "Trust" },
        { title: "Post-purchase vault", value: "Saved access", detail: "Let buyers redownload and review purchase history later.", meta: "Retention" },
      ],
    },
    workflow: {
      eyebrow: "Fulfillment flow",
      title: "The product page matters, but the download experience closes the trust loop.",
      description:
        "After checkout, buyers should instantly understand what they bought, how to use it, and where to retrieve it again.",
      steps: [
        { title: "Model products and bundles", description: "Store SKUs, media, files, licenses, and bundle composition." },
        { title: "Create post-purchase access", description: "Map successful payment to download entitlements and history." },
        { title: "Reduce support load", description: "Answer file access, licensing, and update questions inside the account area." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Shelf design",
        title: "Merchandise fewer things better.",
        description: "The page should feel curated and premium, not crowded.",
        items: [
          { title: "Flagship bundle", description: "Use one dominant product story to anchor the page.", meta: "Conversion" },
          { title: "What is included", description: "Spell out file types, templates, and bonus assets clearly.", meta: "Trust" },
          { title: "Usage rights", description: "Make licensing simple to scan before purchase.", meta: "Clarity" },
        ],
      },
      {
        eyebrow: "Post-purchase",
        title: "Fulfillment is part of the product.",
        description: "Strong download handling increases repeat purchase confidence.",
        items: [
          { title: "Download locker", description: "Give buyers a clean history of purchases and files.", meta: "Account" },
          { title: "Update feed", description: "Ship revised files or new bonus assets without manual support.", meta: "Retention" },
          { title: "Cross-sell logic", description: "Suggest bundles or memberships after a successful purchase.", meta: "Expansion" },
        ],
      },
    ],
    faq: [
      { question: "What should happen on the success page?", answer: "Confirm the purchase, clarify what is included, and route the buyer straight into a persistent download locker." },
      { question: "How should the catalog feel?", answer: "Tight, curated, and premium. A few strong bundles usually outperform a long undifferentiated listing." },
      { question: "What data should be persisted?", answer: "Orders, entitlements, file versions, licenses, and download events provide the best starting point." },
    ],
  },
  "commerce-preorder-launch": {
    heroMetrics: [
      { value: "Launch", label: "Campaign mode", detail: "Build anticipation before inventory or delivery is ready." },
      { value: "Deposits", label: "Offer model", detail: "Use checkout for reservations, access, or limited drops." },
      { value: "Waitlist", label: "Demand signal", detail: "Collect intent before the full product ships." },
    ],
    showcase: {
      eyebrow: "Launch console",
      title: "Make preorder pages feel like a timed release, not a generic pricing screen.",
      description:
        "Use this starter for launch campaigns, limited runs, and early-access drops where timing, scarcity, and follow-up matter.",
      panels: [
        { title: "Early access wave", value: "250 spots", detail: "Scarcity should be explicit and believable.", meta: "Offer cap" },
        { title: "Deposit logic", value: "Reserve now", detail: "Use checkout to secure intent before final fulfillment.", meta: "Payment" },
        { title: "Launch updates", value: "Weekly", detail: "Keep buyers warm while the product is still coming together.", meta: "Retention" },
        { title: "Fulfillment handoff", value: "Ready later", detail: "Move from preorder into delivery without losing buyer history.", meta: "Ops" },
      ],
    },
    workflow: {
      eyebrow: "Launch sequencing",
      title: "Use urgency carefully, then follow through with trust.",
      description:
        "Preorders work when the buyer understands what they are reserving, what happens next, and how updates will arrive.",
      steps: [
        { title: "Define reservation state", description: "Track preorder status, deposit amounts, and fulfillment stage." },
        { title: "Communicate timing", description: "Show expected release windows and update cadence on the page." },
        { title: "Convert reservation into delivery", description: "Move preorder customers into full order or access fulfillment later." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Campaign structure",
        title: "The page should feel like a launch event.",
        description: "Lead with the offer, scarcity, and why the buyer should care now.",
        items: [
          { title: "Release framing", description: "Clarify who this first wave is for and why spots are limited.", meta: "Positioning" },
          { title: "Reservation proof", description: "Show what the buyer secures by paying today.", meta: "Offer" },
          { title: "Update cadence", description: "Promise how launch news and delivery timing will be communicated.", meta: "Trust" },
        ],
      },
      {
        eyebrow: "Post-checkout",
        title: "Reserve, then reassure.",
        description: "Success states should reduce anxiety rather than just confirm payment.",
        items: [
          { title: "Reservation receipt", description: "Store buyer history with status, amount, and expected next step.", meta: "Order data" },
          { title: "Launch digest", description: "Feed product updates and milestone notices back into the account area.", meta: "Lifecycle" },
          { title: "Final fulfillment", description: "Transition smoothly into full access or shipment when ready.", meta: "Delivery" },
        ],
      },
    ],
    faq: [
      { question: "What should checkout actually sell?", answer: "A reservation, deposit, or early-access entitlement is usually clearer than pretending the full product already ships today." },
      { question: "How do you keep trust high?", answer: "Be explicit about delivery timing, what the payment secures, and how updates will be communicated after purchase." },
      { question: "What entities belong in the database?", answer: "Preorders, deposits, release windows, update events, and eventual fulfillment records are the right first layer." },
    ],
  },
  "creator-community-membership": {
    heroMetrics: [
      { value: "Members", label: "Core audience", detail: "Sell belonging and continuity, not just access." },
      { value: "Weekly", label: "Cadence", detail: "Use rituals and recurring drops to anchor the product." },
      { value: "Private", label: "Access model", detail: "Gate the archive, perks, and discussion surface." },
    ],
    showcase: {
      eyebrow: "Community surface",
      title: "Make the membership feel like an active club with rhythm, archive, and perks.",
      description:
        "Use the starter for private communities, premium circles, or niche memberships that combine access, ritual, and belonging.",
      panels: [
        { title: "This week's drop", value: "Workshop replay", detail: "Use fresh moments to signal that the membership is alive.", meta: "Cadence" },
        { title: "Member archive", value: "94 posts", detail: "Give paid members a reason to stay for the back catalog.", meta: "Library" },
        { title: "Upcoming ritual", value: "Friday office hours", detail: "Recurring touchpoints build retention.", meta: "Community" },
        { title: "Perk stack", value: "Templates + chat", detail: "Bundle tangible value with access and belonging.", meta: "Offer" },
      ],
    },
    workflow: {
      eyebrow: "Membership design",
      title: "Belonging needs structure or the membership will feel empty.",
      description:
        "A good community product makes the rhythm, archive, and premium access path obvious from the homepage onward.",
      steps: [
        { title: "Define content and ritual objects", description: "Store sessions, posts, perks, events, and member perks separately." },
        { title: "Map payment to status", description: "Successful checkout should unlock archive access, event rights, and private perks." },
        { title: "Keep the room active", description: "Use weekly rituals, office hours, or member prompts to sustain value." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Member experience",
        title: "Give people reasons to return every week.",
        description: "Retention comes from rhythm plus compounding archive value.",
        items: [
          { title: "Ritual calendar", description: "Show office hours, live sessions, or recurring member moments.", meta: "Cadence" },
          { title: "Archive depth", description: "Make premium posts, replays, and downloads easy to browse.", meta: "Value" },
          { title: "Perk delivery", description: "Bundle templates, chat access, or discounts into the account area.", meta: "Benefits" },
        ],
      },
      {
        eyebrow: "Growth loops",
        title: "Keep the offer compact and personal.",
        description: "The strongest memberships usually sell one clear room for one clear audience.",
        items: [
          { title: "Founding member angle", description: "Use limited-time positioning without overcomplicating the offer.", meta: "Conversion" },
          { title: "Upgrade path", description: "Introduce higher tiers later through coaching or small-group access.", meta: "Expansion" },
          { title: "Community support", description: "Blend AI answers with creator touchpoints for routine questions.", meta: "Support" },
        ],
      },
    ],
    faq: [
      { question: "What should the member get right away?", answer: "Immediate access to the archive, current rituals, and any promised perks or downloads." },
      { question: "How should the homepage feel?", answer: "More like a private publication or club invitation than a generic SaaS pricing page." },
      { question: "What data model matters first?", answer: "Members, posts, sessions, events, perks, and entitlement history create a solid base." },
    ],
  },
  "creator-paid-newsletter": {
    heroMetrics: [
      { value: "Issue-led", label: "Product shape", detail: "Sell paid perspective through a clean archive." },
      { value: "Archive", label: "Retention asset", detail: "Older issues compound the membership value." },
      { value: "Simple", label: "Offer design", detail: "One paid plan is often enough to start." },
    ],
    showcase: {
      eyebrow: "Editorial surface",
      title: "Make the newsletter feel like a publication with a clean member archive and sharp offer.",
      description:
        "Use the template for premium essays, niche analysis, or operator briefings where issue cadence and archive access drive the business.",
      panels: [
        { title: "Latest issue", value: "No. 128", detail: "Lead with the freshest paid thinking or briefing.", meta: "Front page" },
        { title: "Archive depth", value: "3 years", detail: "The archive should feel like an asset, not a forgotten list.", meta: "Value" },
        { title: "Member note", value: "Audio + text", detail: "Layer formats without complicating the offer.", meta: "Format" },
        { title: "Subscriber path", value: "Join in one step", detail: "Keep the conversion flow simple and immediate.", meta: "Checkout" },
      ],
    },
    workflow: {
      eyebrow: "Publishing flow",
      title: "The archive is part of the product, not an afterthought.",
      description:
        "A paid newsletter should make the latest issue, archive depth, and member value obvious before the paywall.",
      steps: [
        { title: "Model issues and access", description: "Store issues, excerpts, formats, and archive visibility rules." },
        { title: "Tie checkout to archive entitlement", description: "Successful payment should unlock the issue archive instantly." },
        { title: "Preserve editorial clarity", description: "Keep the page spare, fast to scan, and centered on the publication itself." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Publication design",
        title: "Let the issue and archive do the selling.",
        description: "Good editorial products feel composed, not busy.",
        items: [
          { title: "Lead issue", description: "Feature one standout issue and one short reason to care.", meta: "Attention" },
          { title: "Archive browser", description: "Browse by topic, date, or series once the member is inside.", meta: "Depth" },
          { title: "Format clarity", description: "Tell readers whether they get text, audio, downloads, or all three.", meta: "Offer" },
        ],
      },
      {
        eyebrow: "Membership value",
        title: "Keep the subscription promise clean.",
        description: "One concise promise beats a stack of generic perks.",
        items: [
          { title: "Paid-only archive", description: "Position the archive as the compounding reason to stay subscribed.", meta: "Retention" },
          { title: "Member extras", description: "Add occasional downloads, notes, or Q&A without bloating the core offer.", meta: "Perks" },
          { title: "Renewal signal", description: "Show issue cadence and editorial consistency clearly.", meta: "Trust" },
        ],
      },
    ],
    faq: [
      { question: "What should the pricing promise be?", answer: "A short explanation of what readers get every issue plus archive access is usually enough." },
      { question: "What should happen after checkout?", answer: "Confirm the subscription and route the user into the archive or the latest premium issue immediately." },
      { question: "How should the page look?", answer: "More like a publication front page than a startup marketing site. Keep it spare and editorial." },
    ],
  },
  "education-cohort-course": {
    heroMetrics: [
      { value: "6 weeks", label: "Cadence", detail: "Make time commitment obvious from the first screen." },
      { value: "Live", label: "Delivery mode", detail: "Highlight sessions, office hours, and cohort rhythm." },
      { value: "Small", label: "Seat model", detail: "Use scarcity and support quality together." },
    ],
    showcase: {
      eyebrow: "Learning system",
      title: "Give the course a cadence, not just a checkout link.",
      description:
        "Use the starter for cohort experiences where schedule, accountability, and live instruction are part of the product promise.",
      panels: [
        { title: "Current cohort", value: "Spring 2026", detail: "Anchor the page around the next active intake.", meta: "Enrollment" },
        { title: "Session plan", value: "12 live calls", detail: "Show the rhythm clearly so buyers understand the commitment.", meta: "Structure" },
        { title: "Assignments", value: "Weekly", detail: "Progress feels real when the learner sees the pace.", meta: "Accountability" },
        { title: "Support layer", value: "Office hours", detail: "Position access to feedback as part of the premium offer.", meta: "Instruction" },
      ],
    },
    workflow: {
      eyebrow: "Course operations",
      title: "Enrollment is only the start of the learning product.",
      description:
        "A cohort course needs schedule clarity, learner progress states, and post-payment onboarding that feels instructional.",
      steps: [
        { title: "Model cohorts and sessions", description: "Store cohort start dates, lesson schedule, and live-session records." },
        { title: "Map payment to enrollment", description: "Successful checkout should create or confirm the learner's seat." },
        { title: "Guide the first week", description: "Use onboarding to collect goals, unlock prep work, and clarify attendance rhythm." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Learner experience",
        title: "Show the path through the program.",
        description: "Students trust structured progression more than broad promises.",
        items: [
          { title: "Week-by-week syllabus", description: "Expose module outcomes, assignments, and live touchpoints.", meta: "Curriculum" },
          { title: "Progress tracking", description: "Track attendance, completion, and deliverables through the cohort.", meta: "Progress" },
          { title: "Support rhythm", description: "Keep office hours, group reviews, and feedback windows visible.", meta: "Coaching" },
        ],
      },
      {
        eyebrow: "Enrollment design",
        title: "Sell the structure and support.",
        description: "The strongest cohort pages clarify exactly what the learner joins and when.",
        items: [
          { title: "Cohort timing", description: "Lead with next start date, session cadence, and seat cap.", meta: "Urgency" },
          { title: "Outcome framing", description: "Promise concrete transformation tied to the syllabus.", meta: "Offer" },
          { title: "Post-payment path", description: "Move learners into prep, orientation, and goal-setting fast.", meta: "Onboarding" },
        ],
      },
    ],
    faq: [
      { question: "What should the pricing page emphasize?", answer: "Seat access, cohort timing, live support, and the depth of the program are the key purchase drivers." },
      { question: "What data model belongs first?", answer: "Cohorts, sessions, learners, assignments, attendance, and enrollment status are the right foundation." },
      { question: "How should onboarding feel?", answer: "Like the start of a guided program, with next session timing and prep work visible immediately after payment." },
    ],
  },
  "education-online-course-membership": {
    heroMetrics: [
      { value: "Library", label: "Core asset", detail: "Evergreen lessons should feel browsable and current." },
      { value: "Self-paced", label: "Learning mode", detail: "Students need progress cues even without live cohorts." },
      { value: "Recurring", label: "Offer shape", detail: "Use membership to keep the library growing." },
    ],
    showcase: {
      eyebrow: "Course library",
      title: "Package lessons, progress, and member access like a real learning product.",
      description:
        "Use this template for paid lesson libraries, academy memberships, or evergreen learning products that need structure and retention.",
      panels: [
        { title: "Featured track", value: "Launch systems", detail: "Lead with one high-value learning path rather than a flat course list.", meta: "Path" },
        { title: "Lesson depth", value: "86 lessons", detail: "Make the library feel substantial without becoming cluttered.", meta: "Library" },
        { title: "Progress", value: "Trackable", detail: "Learners should always know what to watch next.", meta: "Retention" },
        { title: "Member updates", value: "Monthly drops", detail: "Recurring content keeps the membership alive.", meta: "Lifecycle" },
      ],
    },
    workflow: {
      eyebrow: "Learning product flow",
      title: "Build for progression, not just content storage.",
      description:
        "A paid lesson library wins when the path through the material is clear and the membership promise keeps growing.",
      steps: [
        { title: "Model tracks and lessons", description: "Store tracks, lessons, resources, and learner completion state." },
        { title: "Unlock by plan", description: "Use successful payment to open the lesson library or premium tracks." },
        { title: "Surface momentum", description: "Show progress, next lessons, and update cadence clearly after login." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Student experience",
        title: "Make the library feel like a path, not a folder.",
        description: "Structure is what turns content into a learning product.",
        items: [
          { title: "Learning tracks", description: "Group lessons by outcome, difficulty, or role.", meta: "IA" },
          { title: "Progress state", description: "Persist watched, completed, and next-up lesson states.", meta: "Engagement" },
          { title: "Resource shelf", description: "Bundle worksheets, links, or downloads into each track.", meta: "Depth" },
        ],
      },
      {
        eyebrow: "Membership economics",
        title: "Keep the recurring offer simple and compounding.",
        description: "The value comes from library access plus ongoing additions.",
        items: [
          { title: "Core library", description: "Use the archive as the main reason to subscribe.", meta: "Offer" },
          { title: "New lesson drops", description: "Signal freshness with a predictable release rhythm.", meta: "Retention" },
          { title: "Upgrade ladder", description: "Add coaching or cohort layers later without rebuilding the foundation.", meta: "Expansion" },
        ],
      },
    ],
    faq: [
      { question: "What should happen after purchase?", answer: "Create the learner account, unlock the library, and route the student straight into a recommended track." },
      { question: "What tables matter first?", answer: "Tracks, lessons, resources, enrollments, and lesson progress are the strongest base layer." },
      { question: "How should the homepage feel?", answer: "Structured and instructional, with the path through the content clearer than the marketing language." },
    ],
  },
  "local-clinic-booking": {
    heroMetrics: [
      { value: "Fast", label: "Booking path", detail: "Reduce friction from trust to appointment." },
      { value: "Clear", label: "Service scope", detail: "Spell out what is booked and what happens next." },
      { value: "Reliable", label: "Trust signal", detail: "Availability and process clarity matter more than flourish." },
    ],
    showcase: {
      eyebrow: "Service desk",
      title: "Make appointments, plans, and patient questions feel clear from the first tap.",
      description:
        "Use the starter for clinics and service practices that need booking, patient communication, and straightforward payment flows.",
      panels: [
        { title: "Next availability", value: "Tomorrow", detail: "Let visitors orient around the soonest open slot.", meta: "Booking" },
        { title: "Visit types", value: "3 plans", detail: "Clarify consultation, follow-up, and membership options.", meta: "Services" },
        { title: "Patient prep", value: "Checklist", detail: "Reduce no-shows by explaining what to bring and expect.", meta: "Operations" },
        { title: "Concierge answers", value: "Always on", detail: "Use AI to handle routine intake and booking questions.", meta: "Support" },
      ],
    },
    workflow: {
      eyebrow: "Service flow",
      title: "Trust is built through timing, clarity, and follow-through.",
      description:
        "A good clinic template helps visitors understand availability, what they are booking, and how the practice communicates afterward.",
      steps: [
        { title: "Model appointment entities", description: "Store services, providers, bookings, and follow-up state." },
        { title: "Map plan to service access", description: "Use checkout for consultations, plans, or recurring memberships." },
        { title: "Guide patients clearly", description: "Answer routine intake and appointment questions before they become phone calls." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Booking experience",
        title: "Surface time, service, and next action immediately.",
        description: "Local-service trust comes from clarity more than visual complexity.",
        items: [
          { title: "Availability board", description: "Show upcoming slots and provider availability clearly.", meta: "Scheduling" },
          { title: "Visit type selector", description: "Differentiate consultations, follow-ups, and memberships.", meta: "Service" },
          { title: "Preparation notes", description: "Explain arrival time, required documents, and visit expectations.", meta: "Trust" },
        ],
      },
      {
        eyebrow: "Retention and support",
        title: "Keep service questions out of the inbox.",
        description: "Use the account area and assistant to answer the most common questions quickly.",
        items: [
          { title: "Patient portal", description: "Show bookings, history, and post-visit guidance in one place.", meta: "Experience" },
          { title: "Reminder flow", description: "Connect upcoming visits to simple reminder and prep messaging.", meta: "Operations" },
          { title: "Plan management", description: "Use recurring payment rails for premium care or membership plans.", meta: "Revenue" },
        ],
      },
    ],
    faq: [
      { question: "What should the page prioritize?", answer: "Availability, service clarity, provider trust, and a simple booking path should come before brand storytelling." },
      { question: "How should checkout be used?", answer: "Use it for consultations, deposits, or membership plans, then route patients into clear booking confirmation." },
      { question: "How does AI fit here?", answer: "Use it for routine booking, intake, and preparation questions, then escalate only when a human is needed." },
    ],
  },
  "local-gym-membership": {
    heroMetrics: [
      { value: "Recurring", label: "Revenue model", detail: "Membership plans are the core transaction surface." },
      { value: "In-person", label: "Experience", detail: "Schedule and access cues should feel local and immediate." },
      { value: "Habit", label: "Retention loop", detail: "Use plans, classes, and milestones to keep members engaged." },
    ],
    showcase: {
      eyebrow: "Member desk",
      title: "Blend membership sales, class rhythm, and facility trust into one cleaner local product.",
      description:
        "Use the starter for gyms, studios, or training clubs that need simple plan sales, schedules, and member guidance.",
      panels: [
        { title: "Plan mix", value: "Monthly + annual", detail: "Keep the offer ladder simple enough to compare quickly.", meta: "Pricing" },
        { title: "Class schedule", value: "Daily drops", detail: "Show rhythm and activity, not just static membership copy.", meta: "Cadence" },
        { title: "Coach support", value: "On-site", detail: "Use trust and guidance to reinforce the local offer.", meta: "Experience" },
        { title: "Member milestones", value: "Tracked", detail: "Turn attendance and plans into a habit loop.", meta: "Retention" },
      ],
    },
    workflow: {
      eyebrow: "Membership flow",
      title: "Sell the plan, then reinforce the habit.",
      description:
        "The template should make plan comparison, onboarding, class rhythm, and member continuity feel easy from day one.",
      steps: [
        { title: "Model plans and classes", description: "Store memberships, sessions, attendance, and coach assignments." },
        { title: "Map checkout to member status", description: "Successful payment should activate access and starter onboarding." },
        { title: "Keep members engaged", description: "Use classes, milestones, and reminders to maintain retention." },
      ],
    },
    featureSections: [
      {
        eyebrow: "Facility experience",
        title: "Make the location and rhythm tangible.",
        description: "People join local fitness products when the habit feels easy to imagine.",
        items: [
          { title: "Plan comparison", description: "Keep monthly, annual, and premium coaching plans easy to scan.", meta: "Offer" },
          { title: "Class calendar", description: "Show daily sessions and coach highlights near the purchase path.", meta: "Scheduling" },
          { title: "First-week guidance", description: "Use onboarding to direct new members into their first classes or check-in.", meta: "Activation" },
        ],
      },
      {
        eyebrow: "Retention systems",
        title: "The account should reinforce the habit loop.",
        description: "Give members simple reasons to come back and stay subscribed.",
        items: [
          { title: "Attendance history", description: "Show class streaks, visits, or milestone counts.", meta: "Engagement" },
          { title: "Membership management", description: "Let users review plan state, billing, and upgrade options.", meta: "Account" },
          { title: "Community prompts", description: "Blend AI answers with local staff guidance for routine questions.", meta: "Support" },
        ],
      },
    ],
    faq: [
      { question: "What should the homepage make obvious?", answer: "Plan choices, class rhythm, facility trust, and how fast a new member can get started." },
      { question: "What should happen after checkout?", answer: "Activate the membership, confirm the plan, and point the user to first-week classes or check-in instructions." },
      { question: "Which records belong in the database first?", answer: "Plans, members, classes, attendance, billing state, and coach assignments make the template far more real." },
    ],
  },
};
