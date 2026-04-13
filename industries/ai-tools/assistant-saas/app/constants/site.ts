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
  "appTitle": "SignalDesk AI",
  "siteDescription": "AI assistant membership app with login, workspace billing, and paid access.",
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
    "assistantLabel": "Assistant"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "AI tools",
    "headline": "Charge for your assistant before you scale your agent stack.",
    "description": "SignalDesk AI is a payment-ready SaaS shell for private assistants, premium copilots, and member-only workflows.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Email login for paid assistant accounts",
      "Hosted checkout for monthly or annual access",
      "Neon-backed schema layer for threads, credits, and seats"
    ]
  },
  "pricing": {
    "badge": "Pro assistant",
    "headline": "Unlock the assistant for",
    "description": "One subscription. Faster answers. Team-ready workflows.",
    "featuredLabel": "Assistant access",
    "accessLabel": "Unlimited prompts and workspace history",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Pro Assistant",
    "defaultProductDescription": "Unlimited assistant access for your team.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "assistant-saas-template",
    "badge": "Launch checklist",
    "headline": "Turn this starter into a paid assistant product.",
    "description": "Replace the marketing layer with your workflow, then connect billing events to credits, seats, or premium tools.",
    "bullets": [
      "Model conversations, credits, and tool runs in your database",
      "Grant assistant entitlements after successful checkout",
      "Swap the placeholder UI for your chat workspace"
    ]
  },
  "heroMetrics": [
    {
      "value": "24/7",
      "label": "Copilot availability",
      "detail": "Serve paid members without a support queue."
    },
    {
      "value": "3",
      "label": "Revenue levers",
      "detail": "Seats, credits, and premium workflows."
    },
    {
      "value": "<90s",
      "label": "Checkout latency",
      "detail": "Move a signed-in user from pitch to payment fast."
    }
  ],
  "showcase": {
    "eyebrow": "Workspace preview",
    "title": "Turn pricing, onboarding, and live assistance into one operator surface.",
    "description": "Use the starter to stage product demos, qualify buyers, and unlock paid assistant access without rebuilding auth or billing.",
    "panels": [
      {
        "title": "Conversation queue",
        "value": "18",
        "detail": "Threads waiting for follow-up or automation review.",
        "meta": "Live queue"
      },
      {
        "title": "Seat coverage",
        "value": "41",
        "detail": "Active member seats with room for team expansion.",
        "meta": "Paid workspaces"
      },
      {
        "title": "Credit policy",
        "value": "Usage caps",
        "detail": "Gate heavier flows behind credits or premium tiers.",
        "meta": "Monetization"
      },
      {
        "title": "Handoff flow",
        "value": "Ops ready",
        "detail": "Escalate account issues into human support only when needed.",
        "meta": "Support"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Launch flow",
    "title": "Structure the product like an assistant business, not a demo bot.",
    "description": "The starter already covers login and checkout. Focus the next pass on the commercial model around the assistant.",
    "steps": [
      {
        "title": "Model workspace entitlements",
        "description": "Tie seats, credits, and premium tools to successful checkout states."
      },
      {
        "title": "Store threads and context",
        "description": "Persist conversations, feedback, and tool usage for member workspaces."
      },
      {
        "title": "Instrument support handoff",
        "description": "Track when the assistant should escalate into humans or premium service."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Product modules",
      "title": "Give operators real surfaces to work from.",
      "description": "These modules make the template feel like a paid AI product immediately.",
      "items": [
        {
          "title": "Conversation history",
          "description": "Recent threads, owner assignment, and unresolved flags.",
          "meta": "Core workspace"
        },
        {
          "title": "Usage guardrails",
          "description": "Seat limits, credit burn, and model policy snapshots.",
          "meta": "Billing aware"
        },
        {
          "title": "Prompt operations",
          "description": "Starter prompt packs, onboarding scripts, and fallback replies.",
          "meta": "Admin tools"
        }
      ]
    },
    {
      "eyebrow": "Go-to-market",
      "title": "Make the purchase path feel inevitable.",
      "description": "The paid offer should read as operationally mature from the first screen.",
      "items": [
        {
          "title": "Plan framing",
          "description": "Describe exactly what a paid workspace unlocks.",
          "meta": "Conversion"
        },
        {
          "title": "Activation handoff",
          "description": "Route successful buyers into setup, imports, or kickoff questions.",
          "meta": "Onboarding"
        },
        {
          "title": "Team expansion",
          "description": "Show how admins can add seats and credits over time.",
          "meta": "Retention"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should happen after checkout?",
      "answer": "Activate the workspace, issue starting credits or seats, and move the buyer into a first-run setup flow."
    },
    {
      "question": "What should the database model first?",
      "answer": "Threads, workspace memberships, credit balances, and support escalations are the fastest path to a real product."
    },
    {
      "question": "Where does the AI concierge fit?",
      "answer": "Use it as presales and onboarding support while the product workspace matures behind the paywall."
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
    "badge": "Embedded AI",
    "title": "Offer a live assistant from day one.",
    "description": "Use the built-in concierge to demo your product, qualify buyers, or answer member questions without exposing upstream secrets.",
    "assistantName": "SignalDesk Copilot",
    "welcomeMessage": "I can explain plans, demo workflows, or answer product questions. Ask me anything about your assistant offer.",
    "placeholder": "Ask about plans, workflows, or how this assistant product works...",
    "submitLabel": "Send message",
    "resetLabel": "Reset chat",
    "suggestedPrompts": [
      "What does the Pro Assistant plan include?",
      "How should I structure credits and seats?",
      "What should happen after a successful checkout?"
    ],
    "systemPrompt": "You are SignalDesk Copilot, a concise presales and onboarding assistant for an AI assistant SaaS. Answer in clear product language, focus on pricing, setup, and workflow design, and avoid making claims about features that are not visible in the current template.",
    "model": "kimi-k2.5"
  }
};
