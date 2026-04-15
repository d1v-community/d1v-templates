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
  login: {
    eyebrow: string;
    title: string;
    description: string;
    audience: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailHint: string;
    trustPoints: string[];
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
  "appTitle": "InnerCircle",
  "siteDescription": "Creator membership app for private communities, perks, and paid access.",
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
    "badge": "Creator membership",
    "headline": "Sell belonging, not just content.",
    "description": "InnerCircle is a clean base for creators who want paid community access, member updates, and premium perks.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Passwordless member login",
      "Recurring checkout for private community plans",
      "Database base for perks, member tiers, and updates"
    ]
  },
  "pricing": {
    "badge": "Community access",
    "headline": "Join the circle for",
    "description": "Members-only access, drops, and private updates in one plan.",
    "featuredLabel": "Member access",
    "accessLabel": "Private community, drops, and member perks",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "InnerCircle Membership",
    "defaultProductDescription": "Join the private community and unlock member perks.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "community-membership-template",
    "badge": "Membership build",
    "headline": "Map checkout to perks, tiers, and member-only areas.",
    "description": "Start with the rails, then layer in posts, perks, events, and protected community surfaces.",
    "bullets": [
      "Model members, tiers, perks, and activity history",
      "Grant community access after successful payment",
      "Replace the starter surface with your member hub"
    ]
  },
  "login": {
    "eyebrow": "Member circle login",
    "title": "Make joining the private community feel like entering the product, not a utility step.",
    "description": "Sign in to reach member posts, events, perks, and the weekly rhythm that keeps the subscription valuable.",
    "audience": "Creators and members paying for belonging, perks, and archive access",
    "emailLabel": "Member email",
    "emailPlaceholder": "member@community.com",
    "emailHint": "Use the email linked to your community membership or paid tier.",
    "trustPoints": [
      "The login page can reinforce belonging before members even enter the archive.",
      "Private posts, live sessions, and perks stay tied to one recurring membership account.",
      "New buyers can move from checkout into welcome rituals without a separate onboarding tool."
    ]
  },
  "heroMetrics": [
    {
      "value": "Members",
      "label": "Core audience",
      "detail": "Sell belonging and continuity, not just access."
    },
    {
      "value": "Weekly",
      "label": "Cadence",
      "detail": "Use rituals and recurring drops to anchor the product."
    },
    {
      "value": "Private",
      "label": "Access model",
      "detail": "Gate the archive, perks, and discussion surface."
    }
  ],
  "showcase": {
    "eyebrow": "Community surface",
    "title": "Make the membership feel like an active club with rhythm, archive, and perks.",
    "description": "Use the starter for private communities, premium circles, or niche memberships that combine access, ritual, and belonging.",
    "panels": [
      {
        "title": "This week's drop",
        "value": "Workshop replay",
        "detail": "Use fresh moments to signal that the membership is alive.",
        "meta": "Cadence"
      },
      {
        "title": "Member archive",
        "value": "94 posts",
        "detail": "Give paid members a reason to stay for the back catalog.",
        "meta": "Library"
      },
      {
        "title": "Upcoming ritual",
        "value": "Friday office hours",
        "detail": "Recurring touchpoints build retention.",
        "meta": "Community"
      },
      {
        "title": "Perk stack",
        "value": "Templates + chat",
        "detail": "Bundle tangible value with access and belonging.",
        "meta": "Offer"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Membership design",
    "title": "Belonging needs structure or the membership will feel empty.",
    "description": "A good community product makes the rhythm, archive, and premium access path obvious from the homepage onward.",
    "steps": [
      {
        "title": "Define content and ritual objects",
        "description": "Store sessions, posts, perks, events, and member perks separately."
      },
      {
        "title": "Map payment to status",
        "description": "Successful checkout should unlock archive access, event rights, and private perks."
      },
      {
        "title": "Keep the room active",
        "description": "Use weekly rituals, office hours, or member prompts to sustain value."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Member experience",
      "title": "Give people reasons to return every week.",
      "description": "Retention comes from rhythm plus compounding archive value.",
      "items": [
        {
          "title": "Ritual calendar",
          "description": "Show office hours, live sessions, or recurring member moments.",
          "meta": "Cadence"
        },
        {
          "title": "Archive depth",
          "description": "Make premium posts, replays, and downloads easy to browse.",
          "meta": "Value"
        },
        {
          "title": "Perk delivery",
          "description": "Bundle templates, chat access, or discounts into the account area.",
          "meta": "Benefits"
        }
      ]
    },
    {
      "eyebrow": "Growth loops",
      "title": "Keep the offer compact and personal.",
      "description": "The strongest memberships usually sell one clear room for one clear audience.",
      "items": [
        {
          "title": "Founding member angle",
          "description": "Use limited-time positioning without overcomplicating the offer.",
          "meta": "Conversion"
        },
        {
          "title": "Upgrade path",
          "description": "Introduce higher tiers later through coaching or small-group access.",
          "meta": "Expansion"
        },
        {
          "title": "Community support",
          "description": "Blend AI answers with creator touchpoints for routine questions.",
          "meta": "Support"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should the member get right away?",
      "answer": "Immediate access to the archive, current rituals, and any promised perks or downloads."
    },
    {
      "question": "How should the homepage feel?",
      "answer": "More like a private publication or club invitation than a generic SaaS pricing page."
    },
    {
      "question": "What data model matters first?",
      "answer": "Members, posts, sessions, events, perks, and entitlement history create a solid base."
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
