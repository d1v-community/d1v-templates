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
  "appTitle": "DownloadPort",
  "siteDescription": "Digital product storefront starter with paid access and downloadable fulfillment.",
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
    "badge": "Digital commerce",
    "headline": "Sell files, kits, and templates on rails that are already wired.",
    "description": "DownloadPort gives digital products a faster route to launch by starting with auth, data, and checkout already in place.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Secure login for buyers and download history",
      "Checkout for one-off or recurring digital offers",
      "Database models ready for files, orders, and unlocks"
    ]
  },
  "pricing": {
    "badge": "Digital access",
    "headline": "Buy instant access for",
    "description": "Fast checkout. Clean delivery. No storefront rebuild required.",
    "featuredLabel": "Download access",
    "accessLabel": "Files, updates, and buyer history",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Digital Access",
    "defaultProductDescription": "Unlock your files and future product updates.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "digital-downloads-template",
    "badge": "Fulfillment setup",
    "headline": "Connect checkout to files and entitlements.",
    "description": "The starter already handles the transaction path. Your next layer is file storage, order records, and download delivery.",
    "bullets": [
      "Create order, file, and entitlement tables",
      "Deliver secure links after successful payment",
      "Replace placeholder sections with product galleries"
    ]
  },
  "heroMetrics": [
    {
      "value": "Instant",
      "label": "Fulfillment",
      "detail": "The buyer should get value immediately after payment."
    },
    {
      "value": "Bundles",
      "label": "Packaging",
      "detail": "Sell singles, packs, and premium editions."
    },
    {
      "value": "Evergreen",
      "label": "Revenue base",
      "detail": "Keep the product discoverable long after launch day."
    }
  ],
  "showcase": {
    "eyebrow": "Merchandising surface",
    "title": "Stage digital goods like a premium catalog, then deliver them cleanly after checkout.",
    "description": "Use the starter to sell templates, assets, documents, or kits with a stronger shelf, tighter offer framing, and post-purchase download states.",
    "panels": [
      {
        "title": "Featured bundle",
        "value": "Creator kit",
        "detail": "Lead with one strong flagship bundle instead of a noisy grid.",
        "meta": "Hero offer"
      },
      {
        "title": "Format mix",
        "value": "PDF / ZIP / Notion",
        "detail": "Make delivery expectations obvious before purchase.",
        "meta": "Fulfillment"
      },
      {
        "title": "License state",
        "value": "Commercial",
        "detail": "Clarify usage rights to reduce refund friction.",
        "meta": "Trust"
      },
      {
        "title": "Post-purchase vault",
        "value": "Saved access",
        "detail": "Let buyers redownload and review purchase history later.",
        "meta": "Retention"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Fulfillment flow",
    "title": "The product page matters, but the download experience closes the trust loop.",
    "description": "After checkout, buyers should instantly understand what they bought, how to use it, and where to retrieve it again.",
    "steps": [
      {
        "title": "Model products and bundles",
        "description": "Store SKUs, media, files, licenses, and bundle composition."
      },
      {
        "title": "Create post-purchase access",
        "description": "Map successful payment to download entitlements and history."
      },
      {
        "title": "Reduce support load",
        "description": "Answer file access, licensing, and update questions inside the account area."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Shelf design",
      "title": "Merchandise fewer things better.",
      "description": "The page should feel curated and premium, not crowded.",
      "items": [
        {
          "title": "Flagship bundle",
          "description": "Use one dominant product story to anchor the page.",
          "meta": "Conversion"
        },
        {
          "title": "What is included",
          "description": "Spell out file types, templates, and bonus assets clearly.",
          "meta": "Trust"
        },
        {
          "title": "Usage rights",
          "description": "Make licensing simple to scan before purchase.",
          "meta": "Clarity"
        }
      ]
    },
    {
      "eyebrow": "Post-purchase",
      "title": "Fulfillment is part of the product.",
      "description": "Strong download handling increases repeat purchase confidence.",
      "items": [
        {
          "title": "Download locker",
          "description": "Give buyers a clean history of purchases and files.",
          "meta": "Account"
        },
        {
          "title": "Update feed",
          "description": "Ship revised files or new bonus assets without manual support.",
          "meta": "Retention"
        },
        {
          "title": "Cross-sell logic",
          "description": "Suggest bundles or memberships after a successful purchase.",
          "meta": "Expansion"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should happen on the success page?",
      "answer": "Confirm the purchase, clarify what is included, and route the buyer straight into a persistent download locker."
    },
    {
      "question": "How should the catalog feel?",
      "answer": "Tight, curated, and premium. A few strong bundles usually outperform a long undifferentiated listing."
    },
    {
      "question": "What data should be persisted?",
      "answer": "Orders, entitlements, file versions, licenses, and download events provide the best starting point."
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
