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
  "appTitle": "D1V DEMO",
  "siteDescription": "D1V DEMO showcase with login, data, pricing, and checkout-ready product flows.",
  "theme": {
    "family": "commerce",
    "layout": "editorial",
    "visualThesis": "An editorial product drop surface with strong merchandising, tighter copy, and entitlement-aware fulfillment cues.",
    "contentPlan": [
      "Hero: the offer and why it deserves attention now",
      "Support: product framing, packaging, and drop mechanics",
      "Detail: what the buyer gets after checkout",
      "Final CTA: convert with one clear purchase path"
    ],
    "interactionThesis": [
      "The first viewport should feel like a campaign poster with utility underneath.",
      "Merchandising details should read like product direction, not filler bullets.",
      "Fulfillment language should reassure the buyer immediately."
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
    "badge": "Launch commerce",
    "headline": "Turn a launch page into a preorder machine.",
    "description": "D1V DEMO is for focused offers: one hero product, one clear price, one route to checkout.",
    "primaryCtaLabel": "View demo pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Enter demo",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Email login for customers and launch followers",
      "Hosted checkout for preorder deposits or full payments",
      "Database base for waitlists, preorders, and fulfillment status"
    ]
  },
  "pricing": {
    "badge": "Preorder",
    "headline": "Reserve the drop for",
    "description": "One offer. One decision. A direct path to launch revenue.",
    "featuredLabel": "Launch access",
    "accessLabel": "Preorder confirmation and launch updates",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Get demo access",
    "loginButtonLabel": "Login for demo access",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "D1V DEMO",
    "defaultProductDescription": "Reserve the launch and stay first in line.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "preorder-launch-template",
    "badge": "Launch flow",
    "headline": "Keep the launch page tight and the fulfillment clear.",
    "description": "Use this starter to collect payments early, then connect launch status, stock, or updates behind the scenes.",
    "bullets": [
      "Add preorder, shipment, and customer update models",
      "Trigger launch emails after checkout or release milestones",
      "Replace placeholder sections with your hero offer and timeline"
    ]
  },
  "heroMetrics": [
    {
      "value": "Launch",
      "label": "Campaign mode",
      "detail": "Build anticipation before inventory or delivery is ready."
    },
    {
      "value": "Deposits",
      "label": "Offer model",
      "detail": "Use checkout for reservations, access, or limited drops."
    },
    {
      "value": "Waitlist",
      "label": "Demand signal",
      "detail": "Collect intent before the full product ships."
    }
  ],
  "showcase": {
    "eyebrow": "Launch console",
    "title": "Make preorder pages feel like a timed release, not a generic pricing screen.",
    "description": "Use this starter for launch campaigns, limited runs, and early-access drops where timing, scarcity, and follow-up matter.",
    "panels": [
      {
        "title": "Early access wave",
        "value": "250 spots",
        "detail": "Scarcity should be explicit and believable.",
        "meta": "Offer cap"
      },
      {
        "title": "Deposit logic",
        "value": "Reserve now",
        "detail": "Use checkout to secure intent before final fulfillment.",
        "meta": "Payment"
      },
      {
        "title": "Launch updates",
        "value": "Weekly",
        "detail": "Keep buyers warm while the product is still coming together.",
        "meta": "Retention"
      },
      {
        "title": "Fulfillment handoff",
        "value": "Ready later",
        "detail": "Move from preorder into delivery without losing buyer history.",
        "meta": "Ops"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Launch sequencing",
    "title": "Use urgency carefully, then follow through with trust.",
    "description": "Preorders work when the buyer understands what they are reserving, what happens next, and how updates will arrive.",
    "steps": [
      {
        "title": "Define reservation state",
        "description": "Track preorder status, deposit amounts, and fulfillment stage."
      },
      {
        "title": "Communicate timing",
        "description": "Show expected release windows and update cadence on the page."
      },
      {
        "title": "Convert reservation into delivery",
        "description": "Move preorder customers into full order or access fulfillment later."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Campaign structure",
      "title": "The page should feel like a launch event.",
      "description": "Lead with the offer, scarcity, and why the buyer should care now.",
      "items": [
        {
          "title": "Release framing",
          "description": "Clarify who this first wave is for and why spots are limited.",
          "meta": "Positioning"
        },
        {
          "title": "Reservation proof",
          "description": "Show what the buyer secures by paying today.",
          "meta": "Offer"
        },
        {
          "title": "Update cadence",
          "description": "Promise how launch news and delivery timing will be communicated.",
          "meta": "Trust"
        }
      ]
    },
    {
      "eyebrow": "Post-checkout",
      "title": "Reserve, then reassure.",
      "description": "Success states should reduce anxiety rather than just confirm payment.",
      "items": [
        {
          "title": "Reservation receipt",
          "description": "Store buyer history with status, amount, and expected next step.",
          "meta": "Order data"
        },
        {
          "title": "Launch digest",
          "description": "Feed product updates and milestone notices back into the account area.",
          "meta": "Lifecycle"
        },
        {
          "title": "Final fulfillment",
          "description": "Transition smoothly into full access or shipment when ready.",
          "meta": "Delivery"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should checkout actually sell?",
      "answer": "A reservation, deposit, or early-access entitlement is usually clearer than pretending the full product already ships today."
    },
    {
      "question": "How do you keep trust high?",
      "answer": "Be explicit about delivery timing, what the payment secures, and how updates will be communicated after purchase."
    },
    {
      "question": "What entities belong in the database?",
      "answer": "Preorders, deposits, release windows, update events, and eventual fulfillment records are the right first layer."
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
