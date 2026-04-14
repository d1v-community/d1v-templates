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
    "loginLabel": "Login"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "Membership business",
    "headline": "Sell memberships with a stack that is already ready to collect them.",
    "description": "D1V DEMO is a clean base for gyms, studios, and local fitness memberships with login and billing built in.",
    "primaryCtaLabel": "View demo pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Enter demo",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Member login for account and renewal access",
      "Hosted checkout for passes, memberships, or drop-ins",
      "Database foundation for plans, visits, and member status"
    ]
  },
  "pricing": {
    "badge": "Membership pass",
    "headline": "Join the gym for",
    "description": "Simple signup. Fast checkout. A membership account from day one.",
    "featuredLabel": "Member pass",
    "accessLabel": "Membership status, plans, and visit history",
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
    "defaultProductDescription": "Start your membership and unlock member access.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "gym-membership-template",
    "badge": "Studio setup",
    "headline": "Connect checkout to plans, visits, and renewals.",
    "description": "You already have auth and billing. Next, add plan logic, facility updates, and member self-service routes.",
    "bullets": [
      "Create plan, check-in, and renewal models",
      "Map successful checkout to active memberships",
      "Replace placeholder content with class, plan, and account views"
    ]
  },
  "heroMetrics": [
    {
      "value": "Recurring",
      "label": "Revenue model",
      "detail": "Membership plans are the core transaction surface."
    },
    {
      "value": "In-person",
      "label": "Experience",
      "detail": "Schedule and access cues should feel local and immediate."
    },
    {
      "value": "Habit",
      "label": "Retention loop",
      "detail": "Use plans, classes, and milestones to keep members engaged."
    }
  ],
  "showcase": {
    "eyebrow": "Member desk",
    "title": "Blend membership sales, class rhythm, and facility trust into one cleaner local product.",
    "description": "Use the starter for gyms, studios, or training clubs that need simple plan sales, schedules, and member guidance.",
    "panels": [
      {
        "title": "Plan mix",
        "value": "Monthly + annual",
        "detail": "Keep the offer ladder simple enough to compare quickly.",
        "meta": "Pricing"
      },
      {
        "title": "Class schedule",
        "value": "Daily drops",
        "detail": "Show rhythm and activity, not just static membership copy.",
        "meta": "Cadence"
      },
      {
        "title": "Coach support",
        "value": "On-site",
        "detail": "Use trust and guidance to reinforce the local offer.",
        "meta": "Experience"
      },
      {
        "title": "Member milestones",
        "value": "Tracked",
        "detail": "Turn attendance and plans into a habit loop.",
        "meta": "Retention"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Membership flow",
    "title": "Sell the plan, then reinforce the habit.",
    "description": "The template should make plan comparison, onboarding, class rhythm, and member continuity feel easy from day one.",
    "steps": [
      {
        "title": "Model plans and classes",
        "description": "Store memberships, sessions, attendance, and coach assignments."
      },
      {
        "title": "Map checkout to member status",
        "description": "Successful payment should activate access and starter onboarding."
      },
      {
        "title": "Keep members engaged",
        "description": "Use classes, milestones, and reminders to maintain retention."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Facility experience",
      "title": "Make the location and rhythm tangible.",
      "description": "People join local fitness products when the habit feels easy to imagine.",
      "items": [
        {
          "title": "Plan comparison",
          "description": "Keep monthly, annual, and premium coaching plans easy to scan.",
          "meta": "Offer"
        },
        {
          "title": "Class calendar",
          "description": "Show daily sessions and coach highlights near the purchase path.",
          "meta": "Scheduling"
        },
        {
          "title": "First-week guidance",
          "description": "Use onboarding to direct new members into their first classes or check-in.",
          "meta": "Activation"
        }
      ]
    },
    {
      "eyebrow": "Retention systems",
      "title": "The account should reinforce the habit loop.",
      "description": "Give members simple reasons to come back and stay subscribed.",
      "items": [
        {
          "title": "Attendance history",
          "description": "Show class streaks, visits, or milestone counts.",
          "meta": "Engagement"
        },
        {
          "title": "Membership management",
          "description": "Let users review plan state, billing, and upgrade options.",
          "meta": "Account"
        },
        {
          "title": "Community prompts",
          "description": "Blend AI answers with local staff guidance for routine questions.",
          "meta": "Support"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should the homepage make obvious?",
      "answer": "Plan choices, class rhythm, facility trust, and how fast a new member can get started."
    },
    {
      "question": "What should happen after checkout?",
      "answer": "Activate the membership, confirm the plan, and point the user to first-week classes or check-in instructions."
    },
    {
      "question": "Which records belong in the database first?",
      "answer": "Plans, members, classes, attendance, billing state, and coach assignments make the template far more real."
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
