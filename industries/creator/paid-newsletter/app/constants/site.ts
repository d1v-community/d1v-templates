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
  "appTitle": "BriefClub",
  "siteDescription": "Paid newsletter product for premium posts, member access, and subscriber billing.",
  "theme": {
    "family": "creator",
    "layout": "editorial",
    "visualThesis": "A creator-led publishing surface with stronger voice, membership cues, and media-led storytelling.",
    "contentPlan": [
      "Hero: creator promise and member access hook",
      "Support: show the cadence, archive, and premium perks",
      "Detail: make post-purchase community or content access tangible",
      "Final CTA: push the visitor into a simple paid join flow"
    ],
    "interactionThesis": [
      "Treat content and community as the product, not as filler around checkout.",
      "Visual rhythm should feel more like a publication than a dashboard.",
      "Use contrast and spacing to create taste instead of loud gradients."
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
    "badge": "Creator publishing",
    "headline": "Turn premium writing into a product with real access control.",
    "description": "BriefClub is a paid newsletter shell built for gated archives, premium issues, and member-only updates.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Subscriber login for archive access",
      "Checkout for premium subscription plans",
      "Database foundation for posts, issues, and member status"
    ]
  },
  "pricing": {
    "badge": "Premium issues",
    "headline": "Subscribe for",
    "description": "One membership. Every premium issue. Full archive access.",
    "featuredLabel": "Subscriber access",
    "accessLabel": "Premium posts and archive access",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Premium Newsletter",
    "defaultProductDescription": "Unlock premium issues and the full member archive.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "paid-newsletter-template",
    "badge": "Publishing setup",
    "headline": "Connect billing to archives, issues, and access windows.",
    "description": "The starter handles the sensitive parts already. Your work is now about posts, archives, and subscriber experience.",
    "bullets": [
      "Create issue, archive, and release models",
      "Gate premium content by subscriber state",
      "Replace the starter surface with archive and issue routes"
    ]
  },
  "heroMetrics": [
    {
      "value": "Issue-led",
      "label": "Product shape",
      "detail": "Sell paid perspective through a clean archive."
    },
    {
      "value": "Archive",
      "label": "Retention asset",
      "detail": "Older issues compound the membership value."
    },
    {
      "value": "Simple",
      "label": "Offer design",
      "detail": "One paid plan is often enough to start."
    }
  ],
  "showcase": {
    "eyebrow": "Editorial surface",
    "title": "Make the newsletter feel like a publication with a clean member archive and sharp offer.",
    "description": "Use the template for premium essays, niche analysis, or operator briefings where issue cadence and archive access drive the business.",
    "panels": [
      {
        "title": "Latest issue",
        "value": "No. 128",
        "detail": "Lead with the freshest paid thinking or briefing.",
        "meta": "Front page"
      },
      {
        "title": "Archive depth",
        "value": "3 years",
        "detail": "The archive should feel like an asset, not a forgotten list.",
        "meta": "Value"
      },
      {
        "title": "Member note",
        "value": "Audio + text",
        "detail": "Layer formats without complicating the offer.",
        "meta": "Format"
      },
      {
        "title": "Subscriber path",
        "value": "Join in one step",
        "detail": "Keep the conversion flow simple and immediate.",
        "meta": "Checkout"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Publishing flow",
    "title": "The archive is part of the product, not an afterthought.",
    "description": "A paid newsletter should make the latest issue, archive depth, and member value obvious before the paywall.",
    "steps": [
      {
        "title": "Model issues and access",
        "description": "Store issues, excerpts, formats, and archive visibility rules."
      },
      {
        "title": "Tie checkout to archive entitlement",
        "description": "Successful payment should unlock the issue archive instantly."
      },
      {
        "title": "Preserve editorial clarity",
        "description": "Keep the page spare, fast to scan, and centered on the publication itself."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Publication design",
      "title": "Let the issue and archive do the selling.",
      "description": "Good editorial products feel composed, not busy.",
      "items": [
        {
          "title": "Lead issue",
          "description": "Feature one standout issue and one short reason to care.",
          "meta": "Attention"
        },
        {
          "title": "Archive browser",
          "description": "Browse by topic, date, or series once the member is inside.",
          "meta": "Depth"
        },
        {
          "title": "Format clarity",
          "description": "Tell readers whether they get text, audio, downloads, or all three.",
          "meta": "Offer"
        }
      ]
    },
    {
      "eyebrow": "Membership value",
      "title": "Keep the subscription promise clean.",
      "description": "One concise promise beats a stack of generic perks.",
      "items": [
        {
          "title": "Paid-only archive",
          "description": "Position the archive as the compounding reason to stay subscribed.",
          "meta": "Retention"
        },
        {
          "title": "Member extras",
          "description": "Add occasional downloads, notes, or Q&A without bloating the core offer.",
          "meta": "Perks"
        },
        {
          "title": "Renewal signal",
          "description": "Show issue cadence and editorial consistency clearly.",
          "meta": "Trust"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should the pricing promise be?",
      "answer": "A short explanation of what readers get every issue plus archive access is usually enough."
    },
    {
      "question": "What should happen after checkout?",
      "answer": "Confirm the subscription and route the user into the archive or the latest premium issue immediately."
    },
    {
      "question": "How should the page look?",
      "answer": "More like a publication front page than a startup marketing site. Keep it spare and editorial."
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
