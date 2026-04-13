export type SiteThemeFamily =
  | "ai"
  | "business"
  | "commerce"
  | "creator"
  | "education"
  | "local";

export type SiteThemeLayout =
  | "command"
  | "operations"
  | "editorial"
  | "academy"
  | "service";

export type SiteMetric = {
  value: string;
  label: string;
  detail: string;
};

export type SiteExperiencePanel = {
  title: string;
  value: string;
  detail: string;
  meta: string;
};

export type SiteExperienceItem = {
  title: string;
  description: string;
  meta?: string;
};

export type SiteConfig = {
  appTitle: string;
  siteDescription: string;
  theme: {
    family: SiteThemeFamily;
    layout: SiteThemeLayout;
    visualThesis: string;
    contentPlan: string[];
    interactionThesis: string[];
  };
  navigation: {
    pricingLabel: string;
    loginLabel: string;
    assistantLabel?: string;
  };
  footer: {
    line: string;
  };
  home: {
    badge: string;
    headline: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    proofPoints: string[];
  };
  pricing: {
    badge: string;
    headline: string;
    description: string;
    featuredLabel: string;
    accessLabel: string;
    checkoutLabel: string;
    checkoutUserDescription: string;
    checkoutGuestDescription: string;
    buyButtonLabel: string;
    loginButtonLabel: string;
    readyLabelPrefix: string;
    loadErrorHint: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
    defaultProductName: string;
    defaultProductDescription: string;
    viewDetailsLabel: string;
    viewingDetailsLabel: string;
  };
  templateSurface: {
    templateId: string;
    badge: string;
    headline: string;
    description: string;
    bullets: string[];
  };
  heroMetrics: SiteMetric[];
  showcase: {
    eyebrow: string;
    title: string;
    description: string;
    panels: SiteExperiencePanel[];
  };
  workflow: {
    eyebrow: string;
    title: string;
    description: string;
    steps: SiteExperienceItem[];
  };
  featureSections: Array<{
    eyebrow: string;
    title: string;
    description: string;
    items: SiteExperienceItem[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  aiAssistant?: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    assistantName: string;
    welcomeMessage: string;
    placeholder: string;
    submitLabel: string;
    resetLabel: string;
    suggestedPrompts: string[];
    systemPrompt: string;
    model?: string;
  };
  paymentSuccess: {
    eyebrow: string;
    title: string;
    description: string;
    nextStepsTitle: string;
    nextSteps: string[];
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
  };
  paymentCancel: {
    eyebrow: string;
    title: string;
    description: string;
    reasonsTitle: string;
    reasons: string[];
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
  };
};

export const SITE_CONFIG: SiteConfig = {
  "appTitle": "PromptVault",
  "siteDescription": "Prompt membership app with gated content access and recurring billing.",
  "theme": {
    "family": "ai",
    "layout": "command",
    "visualThesis": "A luminous command surface that feels like operating a live intelligence product, not browsing a generic SaaS landing page.",
    "contentPlan": [
      "Hero: operator-grade promise plus immediate paid access CTA",
      "Support: live signal, memory, and usage guardrails",
      "Detail: workspace modules that show how the product gets used every day",
      "Final CTA: move the visitor into pricing or login without friction"
    ],
    "interactionThesis": [
      "Telemetry panels should feel layered and live, not boxed and static.",
      "Accent motion should suggest streaming data rather than decorative glow.",
      "Assistant prompts should feel operational and specific to the offer."
    ]
  },
  "navigation": {
    "pricingLabel": "Pricing",
    "loginLabel": "Login",
    "assistantLabel": "Guide"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "AI library",
    "headline": "Package your best prompts like a premium product.",
    "description": "PromptVault gives creators a clean paid-access shell for prompt packs, workflows, and member-only resources.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Member login for gated prompt access",
      "Recurring checkout for library subscriptions",
      "Database foundation for packs, tags, and unlock history"
    ]
  },
  "pricing": {
    "badge": "Library access",
    "headline": "Join the vault for",
    "description": "One plan. Every prompt pack. New drops included.",
    "featuredLabel": "Vault access",
    "accessLabel": "Prompt packs, updates, and premium workflows",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "PromptVault Membership",
    "defaultProductDescription": "Get every prompt pack and member-only update.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "prompt-library-membership-template",
    "badge": "Build surface",
    "headline": "Publish prompts without rebuilding auth and billing.",
    "description": "Use the starter to ship a premium content library fast, then add browsing, search, and unlock states.",
    "bullets": [
      "Create tables for prompt packs, authors, and release notes",
      "Map paid members to content entitlements",
      "Replace placeholder sections with searchable library pages"
    ]
  },
  "heroMetrics": [
    {
      "value": "120+",
      "label": "Starter prompts",
      "detail": "Position packs and workflows as a premium archive."
    },
    {
      "value": "Weekly",
      "label": "Release cadence",
      "detail": "Keep membership value visible through predictable drops."
    },
    {
      "value": "2 tiers",
      "label": "Access model",
      "detail": "Mix free discovery with paid depth."
    }
  ],
  "showcase": {
    "eyebrow": "Library preview",
    "title": "Package prompt knowledge like a premium catalog with guided discovery built in.",
    "description": "Turn prompt packs, workflows, and release notes into a paid destination with search, membership access, and a smart guide.",
    "panels": [
      {
        "title": "Featured pack",
        "value": "Sales OS",
        "detail": "High-conversion prompts for outbound, follow-up, and proposal prep.",
        "meta": "Front shelf"
      },
      {
        "title": "Member archive",
        "value": "47 packs",
        "detail": "Organize by workflow, persona, and complexity.",
        "meta": "Gated content"
      },
      {
        "title": "Release notes",
        "value": "Friday drops",
        "detail": "Give members a reason to return every week.",
        "meta": "Retention"
      },
      {
        "title": "Guide prompts",
        "value": "Smart routing",
        "detail": "Help visitors land on the right pack before they bounce.",
        "meta": "Discovery"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Content workflow",
    "title": "Treat the catalog like a product line, not a download dump.",
    "description": "Build around content packaging, search, and member unlock states so the subscription feels alive.",
    "steps": [
      {
        "title": "Define pack entities",
        "description": "Store prompt packs, tags, authors, release notes, and preview snippets."
      },
      {
        "title": "Map paywall boundaries",
        "description": "Decide what stays public, what becomes teaser content, and what is fully members-only."
      },
      {
        "title": "Guide discovery",
        "description": "Use the assistant to recommend packs based on team role, workflow, or use case."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Member experience",
      "title": "Build a library that feels curated.",
      "description": "Premium discovery beats a long undifferentiated grid every time.",
      "items": [
        {
          "title": "Search by workflow",
          "description": "Group prompts by jobs-to-be-done, not by random titles.",
          "meta": "IA"
        },
        {
          "title": "Pack previews",
          "description": "Show excerpts, outcomes, and setup notes before the paywall.",
          "meta": "Conversion"
        },
        {
          "title": "Saved stacks",
          "description": "Let members bookmark packs for teams, launches, or verticals.",
          "meta": "Retention"
        }
      ]
    },
    {
      "eyebrow": "Monetization",
      "title": "Keep the offer easy to explain.",
      "description": "One strong plan can carry the product if the archive feels deep and current.",
      "items": [
        {
          "title": "Membership promise",
          "description": "Everything new is included as long as the member stays active.",
          "meta": "Pricing"
        },
        {
          "title": "Drop calendar",
          "description": "Use issue-style release notes to keep value visible.",
          "meta": "Lifecycle"
        },
        {
          "title": "Upsell path",
          "description": "Reserve custom packs or consulting bundles for premium tiers later.",
          "meta": "Expansion"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should users see before paying?",
      "answer": "Show enough previews to prove quality, then gate full packs, updates, and implementation notes."
    },
    {
      "question": "What keeps members subscribed?",
      "answer": "A clear release cadence, better categorization, and fast discovery usually outperform adding dozens of low-quality prompts."
    },
    {
      "question": "How should the AI guide behave?",
      "answer": "Recommend packs, explain membership value, and point visitors toward specific workflows instead of generic chat."
    }
  ],
  "paymentSuccess": {
    "eyebrow": "Payment completed",
    "title": "Payment received",
    "description": "Use this page to move the buyer into onboarding, account setup, or the paid experience.",
    "nextStepsTitle": "Suggested next steps",
    "nextSteps": [
      "Persist the order in your own database",
      "Grant access after successful checkout",
      "Show payment history in the account area",
      "Add webhook verification for fulfillment"
    ],
    "primaryButtonLabel": "View pricing",
    "secondaryButtonLabel": "Back to home"
  },
  "paymentCancel": {
    "eyebrow": "Checkout cancelled",
    "title": "Payment was not completed",
    "description": "The buyer exited checkout before finishing payment. They can return to pricing and try again.",
    "reasonsTitle": "Common reasons you might see this page:",
    "reasons": [
      "The buyer clicked back during checkout.",
      "The hosted payment page was closed.",
      "The payment method was not confirmed.",
      "The buyer intentionally cancelled before paying."
    ],
    "primaryButtonLabel": "Return to pricing",
    "secondaryButtonLabel": "Go to homepage"
  },
  "aiAssistant": {
    "enabled": true,
    "badge": "Member guide",
    "title": "Turn your prompt catalog into a guided buying experience.",
    "description": "Give visitors a short, strong assistant that recommends packs, explains access, and helps members find the right workflows.",
    "assistantName": "PromptVault Guide",
    "welcomeMessage": "I can help visitors understand the library, recommend prompt packs, and explain membership access.",
    "placeholder": "Ask which prompts fit your workflow or what membership includes...",
    "submitLabel": "Ask guide",
    "resetLabel": "Clear thread",
    "suggestedPrompts": [
      "What kinds of prompt packs should I launch first?",
      "How can I explain membership value quickly?",
      "What content should be free vs members-only?"
    ],
    "systemPrompt": "You are PromptVault Guide, a concise assistant for a paid prompt library. Help users understand pack structure, membership value, and discovery strategy. Keep answers practical, concise, and grounded in the visible template.",
    "model": "kimi-k2.5"
  }
};
