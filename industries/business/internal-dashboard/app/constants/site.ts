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
  "appTitle": "OpsCanvas",
  "siteDescription": "Operations dashboard starter for internal teams, retainers, and premium access accounts.",
  "theme": {
    "family": "business",
    "layout": "operations",
    "visualThesis": "A quiet enterprise workstation with clear hierarchy, strong tables, and no marketing-heavy chrome.",
    "contentPlan": [
      "Hero: orient the operator around the workspace value immediately",
      "Support: show queues, milestones, and KPI surfaces",
      "Detail: map the service workflow and account operations model",
      "Final CTA: push the buyer into secure access or paid seats"
    ],
    "interactionThesis": [
      "Panels should behave like dashboards, not promo cards.",
      "Density should increase confidence without becoming noisy.",
      "The page should reward scanning headings, labels, and states."
    ]
  },
  "navigation": {
    "pricingLabel": "Pricing",
    "loginLabel": "Login"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "Business ops",
    "headline": "Run internal operations on a paid, permission-aware shell.",
    "description": "OpsCanvas is for teams that want a solid internal dashboard base with auth, data, and optional paid admin access.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Passwordless staff login out of the box",
      "Neon-backed data layer for pipeline and KPI models",
      "Hosted checkout for paid admin seats or retainers"
    ]
  },
  "pricing": {
    "badge": "Admin seats",
    "headline": "Activate the dashboard for",
    "description": "Secure access for the operators who need it most.",
    "featuredLabel": "Operator access",
    "accessLabel": "Admin seats, reporting, and shared dashboards",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Operations Access",
    "defaultProductDescription": "Enable secure dashboard access for your team.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "internal-dashboard-template",
    "badge": "Operator setup",
    "headline": "Replace the hero with your real reporting surface.",
    "description": "The starter already handles auth and billing. Focus your next pass on metrics, tables, workflows, and team permissions.",
    "bullets": [
      "Add KPI, task, and audit models to the database",
      "Protect routes by staff role or paid workspace access",
      "Turn the placeholder surface into your live dashboard"
    ]
  },
  "heroMetrics": [
    {
      "value": "9",
      "label": "Tracked KPIs",
      "detail": "Give operators a working surface immediately."
    },
    {
      "value": "4 roles",
      "label": "Access layers",
      "detail": "Keep admin, finance, and ops views separate."
    },
    {
      "value": "Daily",
      "label": "Reporting loop",
      "detail": "Position the template around recurring use."
    }
  ],
  "showcase": {
    "eyebrow": "Operator surface",
    "title": "Replace the hero mindset with a real reporting and actions workspace.",
    "description": "This starter should feel like the shell around live metrics, queues, and approvals from the first deploy.",
    "panels": [
      {
        "title": "Approval queue",
        "value": "12",
        "detail": "Outstanding reviews across vendors, spend, and launches.",
        "meta": "Action needed"
      },
      {
        "title": "Health score",
        "value": "93%",
        "detail": "A simple composite signal for leadership and operations.",
        "meta": "Overview"
      },
      {
        "title": "Finance sync",
        "value": "11:40",
        "detail": "Show freshness so operators trust the numbers.",
        "meta": "Last sync"
      },
      {
        "title": "Ops notes",
        "value": "5",
        "detail": "Critical context attached to active incidents or blockers.",
        "meta": "Context"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Operations flow",
    "title": "Start with orientation, freshness, and next action.",
    "description": "The highest-value dashboard surfaces tell operators what changed, what matters, and what to do next.",
    "steps": [
      {
        "title": "Model the operational entities",
        "description": "KPIs, incidents, approvals, and tasks should have explicit ownership and state."
      },
      {
        "title": "Protect by role",
        "description": "Secure sensitive routes with staff roles or paid seat permissions."
      },
      {
        "title": "Show freshness",
        "description": "Expose last-sync timestamps so internal users trust the workspace."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Workspace patterns",
      "title": "Favor dense clarity over decorative layouts.",
      "description": "Operators need scanning surfaces more than branded flourishes.",
      "items": [
        {
          "title": "KPI strip",
          "description": "Compact metrics with trend context and timestamping.",
          "meta": "Monitoring"
        },
        {
          "title": "Queue table",
          "description": "Approvals, owner assignment, and stuck-state visibility.",
          "meta": "Execution"
        },
        {
          "title": "Incident timeline",
          "description": "A single place for escalation, audit notes, and resolution state.",
          "meta": "Control"
        }
      ]
    },
    {
      "eyebrow": "Commercial model",
      "title": "Use payment rails for retainers or premium access.",
      "description": "Even internal tools can sell secure admin seats, consulting layers, or managed reporting access.",
      "items": [
        {
          "title": "Seat-based access",
          "description": "Map successful checkout to paid operator seats or workspace plans.",
          "meta": "Revenue"
        },
        {
          "title": "Managed reporting",
          "description": "Monetize dashboards for clients or partner teams later.",
          "meta": "Expansion"
        },
        {
          "title": "Audit trail",
          "description": "Use Drizzle models to track plan changes and role grants.",
          "meta": "Compliance"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should the homepage emphasize?",
      "answer": "Orientation, KPI health, queue state, and role-aware actions are higher value than broad marketing copy."
    },
    {
      "question": "Which tables come first?",
      "answer": "Teams, dashboards, metrics, approvals, incidents, and audit events usually provide the strongest base."
    },
    {
      "question": "How should checkout fit this template?",
      "answer": "Use it for secure admin seats, premium client reporting, or retainer-backed workspace access."
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
  }
};
