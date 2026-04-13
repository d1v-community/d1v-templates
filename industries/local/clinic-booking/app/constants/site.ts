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
  "appTitle": "ClinicFlow",
  "siteDescription": "Clinic booking and patient portal starter with protected access and hosted checkout.",
  "theme": {
    "family": "local",
    "layout": "service",
    "visualThesis": "A service-first booking and membership surface focused on trust, availability, and action on mobile.",
    "contentPlan": [
      "Hero: trust signal, service promise, and immediate booking or plan CTA",
      "Support: hours, plans, availability, and common next actions",
      "Detail: explain what happens before and after a booking or signup",
      "Final CTA: move the visitor into a clear service transaction"
    ],
    "interactionThesis": [
      "Make time, staff, and capacity easy to scan.",
      "Trust should come from clarity, not from decorative polish alone.",
      "Primary actions should always feel one tap away."
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
    "badge": "Local services",
    "headline": "Handle appointments and deposits on infrastructure that is already live.",
    "description": "ClinicFlow gives local care providers a fast base for patient login, appointment data, and booking payments.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Secure login for patients and staff",
      "Hosted checkout for booking deposits or service plans",
      "Database starter for appointments, intake, and records"
    ]
  },
  "pricing": {
    "badge": "Booking deposit",
    "headline": "Reserve your visit for",
    "description": "Book quickly, collect deposits, and keep visit data organized.",
    "featuredLabel": "Patient access",
    "accessLabel": "Appointments, intake, and booking confirmations",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Visit Deposit",
    "defaultProductDescription": "Reserve a visit and confirm patient access in one flow.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "clinic-booking-template",
    "badge": "Care workflow",
    "headline": "Use the rails for booking, then add your care flow.",
    "description": "Focus the next layer on appointments, provider availability, intake forms, and post-booking follow-up.",
    "bullets": [
      "Create appointment, provider, and intake models",
      "Map deposits to confirmed bookings",
      "Replace placeholder content with scheduling and patient portal views"
    ]
  },
  "heroMetrics": [
    {
      "value": "Fast",
      "label": "Booking path",
      "detail": "Reduce friction from trust to appointment."
    },
    {
      "value": "Clear",
      "label": "Service scope",
      "detail": "Spell out what is booked and what happens next."
    },
    {
      "value": "Reliable",
      "label": "Trust signal",
      "detail": "Availability and process clarity matter more than flourish."
    }
  ],
  "showcase": {
    "eyebrow": "Service desk",
    "title": "Make appointments, plans, and patient questions feel clear from the first tap.",
    "description": "Use the starter for clinics and service practices that need booking, patient communication, and straightforward payment flows.",
    "panels": [
      {
        "title": "Next availability",
        "value": "Tomorrow",
        "detail": "Let visitors orient around the soonest open slot.",
        "meta": "Booking"
      },
      {
        "title": "Visit types",
        "value": "3 plans",
        "detail": "Clarify consultation, follow-up, and membership options.",
        "meta": "Services"
      },
      {
        "title": "Patient prep",
        "value": "Checklist",
        "detail": "Reduce no-shows by explaining what to bring and expect.",
        "meta": "Operations"
      },
      {
        "title": "Concierge answers",
        "value": "Always on",
        "detail": "Use AI to handle routine intake and booking questions.",
        "meta": "Support"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Service flow",
    "title": "Trust is built through timing, clarity, and follow-through.",
    "description": "A good clinic template helps visitors understand availability, what they are booking, and how the practice communicates afterward.",
    "steps": [
      {
        "title": "Model appointment entities",
        "description": "Store services, providers, bookings, and follow-up state."
      },
      {
        "title": "Map plan to service access",
        "description": "Use checkout for consultations, plans, or recurring memberships."
      },
      {
        "title": "Guide patients clearly",
        "description": "Answer routine intake and appointment questions before they become phone calls."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Booking experience",
      "title": "Surface time, service, and next action immediately.",
      "description": "Local-service trust comes from clarity more than visual complexity.",
      "items": [
        {
          "title": "Availability board",
          "description": "Show upcoming slots and provider availability clearly.",
          "meta": "Scheduling"
        },
        {
          "title": "Visit type selector",
          "description": "Differentiate consultations, follow-ups, and memberships.",
          "meta": "Service"
        },
        {
          "title": "Preparation notes",
          "description": "Explain arrival time, required documents, and visit expectations.",
          "meta": "Trust"
        }
      ]
    },
    {
      "eyebrow": "Retention and support",
      "title": "Keep service questions out of the inbox.",
      "description": "Use the account area and assistant to answer the most common questions quickly.",
      "items": [
        {
          "title": "Patient portal",
          "description": "Show bookings, history, and post-visit guidance in one place.",
          "meta": "Experience"
        },
        {
          "title": "Reminder flow",
          "description": "Connect upcoming visits to simple reminder and prep messaging.",
          "meta": "Operations"
        },
        {
          "title": "Plan management",
          "description": "Use recurring payment rails for premium care or membership plans.",
          "meta": "Revenue"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should the page prioritize?",
      "answer": "Availability, service clarity, provider trust, and a simple booking path should come before brand storytelling."
    },
    {
      "question": "How should checkout be used?",
      "answer": "Use it for consultations, deposits, or membership plans, then route patients into clear booking confirmation."
    },
    {
      "question": "How does AI fit here?",
      "answer": "Use it for routine booking, intake, and preparation questions, then escalate only when a human is needed."
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
    "badge": "Patient concierge",
    "title": "Use AI to answer booking questions before the front desk does.",
    "description": "Give patients a fast booking concierge for deposits, appointment prep, and portal access while keeping your API key server-side.",
    "assistantName": "ClinicFlow Concierge",
    "welcomeMessage": "I can help with booking steps, deposits, intake expectations, and common patient access questions.",
    "placeholder": "Ask about appointments, deposits, intake, or patient portal access...",
    "submitLabel": "Ask concierge",
    "resetLabel": "Reset chat",
    "suggestedPrompts": [
      "How should I handle booking deposits?",
      "What should patients see after they book?",
      "Which questions can AI answer before a visit?"
    ],
    "systemPrompt": "You are ClinicFlow Concierge, a concise booking and support assistant for a clinic booking product. Help with scheduling flow, deposits, intake expectations, and patient portal questions. Avoid medical advice and keep answers operational.",
    "model": "kimi-k2.5"
  }
};
