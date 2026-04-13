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
  "appTitle": "ClientRoom",
  "siteDescription": "Client portal for agencies and service businesses with member access and project data.",
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
    "loginLabel": "Login",
    "assistantLabel": "Support"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "Client delivery",
    "headline": "Give every client a portal that feels like part of the service.",
    "description": "ClientRoom combines login, data, and payments so agencies can sell premium access, retainers, and delivery visibility.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Passwordless client login for project access",
      "Checkout flow for retainers or premium portal plans",
      "Database foundation for files, milestones, and updates"
    ]
  },
  "pricing": {
    "badge": "Portal plan",
    "headline": "Open your client portal for",
    "description": "One portal. Shared files. Clear delivery visibility.",
    "featuredLabel": "Portal access",
    "accessLabel": "Milestones, files, and account updates",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Client Portal Access",
    "defaultProductDescription": "Secure client access to projects, files, and updates.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "client-portal-template",
    "badge": "Delivery setup",
    "headline": "Ship the service layer your clients actually log into.",
    "description": "Use the starter as the base for project rooms, deliverables, and account history without rebuilding account access.",
    "bullets": [
      "Model clients, projects, milestones, and uploads",
      "Map successful payments to active portal accounts",
      "Replace placeholder blocks with project dashboards"
    ]
  },
  "heroMetrics": [
    {
      "value": "Shared",
      "label": "Project visibility",
      "detail": "Clients should see progress without asking."
    },
    {
      "value": "1 hub",
      "label": "Files and milestones",
      "detail": "Keep delivery artifacts in one account surface."
    },
    {
      "value": "Retainer",
      "label": "Payment mode",
      "detail": "Use paid access as part of the service package."
    }
  ],
  "showcase": {
    "eyebrow": "Client workspace",
    "title": "Turn service delivery into a portal clients actually want to log into.",
    "description": "Move project updates, files, approvals, and support questions out of email and into a paid client room.",
    "panels": [
      {
        "title": "Current milestone",
        "value": "Design review",
        "detail": "Give the client one obvious place to understand progress.",
        "meta": "Live project"
      },
      {
        "title": "Pending approvals",
        "value": "3",
        "detail": "Highlight where the client is blocking the timeline.",
        "meta": "Client action"
      },
      {
        "title": "Deliverable vault",
        "value": "26 files",
        "detail": "Keep every artifact versioned and visible.",
        "meta": "Files"
      },
      {
        "title": "Support desk",
        "value": "AI + human",
        "detail": "Answer routine client questions before they become meetings.",
        "meta": "Service"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Delivery system",
    "title": "Use the portal to reduce chaos, not to mirror your inbox.",
    "description": "The best client portals clarify status, next approvals, and what the buyer is paying for every month.",
    "steps": [
      {
        "title": "Model client-facing entities",
        "description": "Projects, milestones, files, comments, and approvals need first-class records."
      },
      {
        "title": "Map plan to access",
        "description": "Use payments to control client seats, portal depth, or support SLAs."
      },
      {
        "title": "Automate routine support",
        "description": "Let the assistant answer portal access and project status questions by default."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Portal modules",
      "title": "Show the service, not just the invoice.",
      "description": "A strong client portal proves value between meetings.",
      "items": [
        {
          "title": "Milestone timeline",
          "description": "Display current phase, dependencies, and blockers in one view.",
          "meta": "Visibility"
        },
        {
          "title": "Deliverable browser",
          "description": "Organize files, drafts, approvals, and final assets cleanly.",
          "meta": "Fulfillment"
        },
        {
          "title": "Request queue",
          "description": "Track client asks so scope and response time stay visible.",
          "meta": "Support"
        }
      ]
    },
    {
      "eyebrow": "Service economics",
      "title": "Make retainers and premium access feel coherent.",
      "description": "The portal should explain why the paid relationship continues month after month.",
      "items": [
        {
          "title": "Retainer framing",
          "description": "Tie portal access to ongoing updates, file history, and support continuity.",
          "meta": "Offer"
        },
        {
          "title": "Client onboarding",
          "description": "Use payment success to trigger account setup and project intake.",
          "meta": "Activation"
        },
        {
          "title": "Expansion path",
          "description": "Add new projects, seats, or premium support over time.",
          "meta": "Growth"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should new clients see right away?",
      "answer": "Current milestone, latest files, next action, and how to request support or approvals."
    },
    {
      "question": "How does AI fit in a portal?",
      "answer": "Use it to answer routine access questions, explain project states, and route common support tickets."
    },
    {
      "question": "What data model matters first?",
      "answer": "Clients, projects, milestones, uploads, approvals, and support conversations are the best starting set."
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
    "badge": "Client support",
    "title": "Add a smart support desk to the client experience.",
    "description": "Use the built-in assistant to answer project questions, route common support requests, and reduce manual client handoffs.",
    "assistantName": "ClientRoom Support",
    "welcomeMessage": "I can help with portal access, project updates, and common delivery questions.",
    "placeholder": "Ask about portal access, milestones, files, or support requests...",
    "submitLabel": "Ask support",
    "resetLabel": "New thread",
    "suggestedPrompts": [
      "How should a client portal handle milestones and files?",
      "What support questions should be automated first?",
      "How do I map payment to portal access?"
    ],
    "systemPrompt": "You are ClientRoom Support, a concise assistant for a premium client portal. Focus on client access, delivery visibility, and support triage. Offer practical guidance and keep answers aligned with the current starter's capabilities.",
    "model": "kimi-k2.5"
  }
};
