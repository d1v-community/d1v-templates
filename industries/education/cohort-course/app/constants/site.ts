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
    "family": "education",
    "layout": "academy",
    "visualThesis": "A structured learning experience that emphasizes progression, schedules, and instructional trust.",
    "contentPlan": [
      "Hero: outcome, cadence, and access path",
      "Support: curriculum, milestones, and learner guidance",
      "Detail: show how the student moves through the product",
      "Final CTA: enroll, log in, or review pricing"
    ],
    "interactionThesis": [
      "Progress surfaces should feel calm and instructional.",
      "Sequence and milestones should be more visible than visual effects.",
      "Trust comes from structure and clarity, not hype."
    ]
  },
  "navigation": {
    "pricingLabel": "Pricing",
    "loginLabel": "Login",
    "assistantLabel": "Demo AI"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "Education",
    "headline": "Sell the cohort before you build the full course backend.",
    "description": "D1V DEMO gives you enrollment-ready rails for applications, paid access, and student onboarding.",
    "primaryCtaLabel": "View demo pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Enter demo",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Email login for enrolled students",
      "Hosted checkout for tuition or deposits",
      "Database starter for cohorts, sessions, and onboarding"
    ]
  },
  "pricing": {
    "badge": "Enrollment",
    "headline": "Reserve your seat for",
    "description": "Fixed dates. Clear pricing. A direct route into enrollment.",
    "featuredLabel": "Student access",
    "accessLabel": "Enrollment, onboarding, and cohort updates",
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
    "defaultProductDescription": "Reserve your cohort seat and access the student area.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "cohort-course-template",
    "badge": "Enrollment build",
    "headline": "Map checkout to seats, sessions, and student records.",
    "description": "Start with the revenue and auth layers, then build applications, class calendars, and cohort dashboards.",
    "bullets": [
      "Create cohort, lesson, and enrollment tables",
      "Grant student access after successful payment",
      "Replace placeholder content with curriculum and session views"
    ]
  },
  "heroMetrics": [
    {
      "value": "6 weeks",
      "label": "Cadence",
      "detail": "Make time commitment obvious from the first screen."
    },
    {
      "value": "Live",
      "label": "Delivery mode",
      "detail": "Highlight sessions, office hours, and cohort rhythm."
    },
    {
      "value": "Small",
      "label": "Seat model",
      "detail": "Use scarcity and support quality together."
    }
  ],
  "showcase": {
    "eyebrow": "Learning system",
    "title": "Give the course a cadence, not just a checkout link.",
    "description": "Use the starter for cohort experiences where schedule, accountability, and live instruction are part of the product promise.",
    "panels": [
      {
        "title": "Current cohort",
        "value": "Spring 2026",
        "detail": "Anchor the page around the next active intake.",
        "meta": "Enrollment"
      },
      {
        "title": "Session plan",
        "value": "12 live calls",
        "detail": "Show the rhythm clearly so buyers understand the commitment.",
        "meta": "Structure"
      },
      {
        "title": "Assignments",
        "value": "Weekly",
        "detail": "Progress feels real when the learner sees the pace.",
        "meta": "Accountability"
      },
      {
        "title": "Support layer",
        "value": "Office hours",
        "detail": "Position access to feedback as part of the premium offer.",
        "meta": "Instruction"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Course operations",
    "title": "Enrollment is only the start of the learning product.",
    "description": "A cohort course needs schedule clarity, learner progress states, and post-payment onboarding that feels instructional.",
    "steps": [
      {
        "title": "Model cohorts and sessions",
        "description": "Store cohort start dates, lesson schedule, and live-session records."
      },
      {
        "title": "Map payment to enrollment",
        "description": "Successful checkout should create or confirm the learner's seat."
      },
      {
        "title": "Guide the first week",
        "description": "Use onboarding to collect goals, unlock prep work, and clarify attendance rhythm."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Learner experience",
      "title": "Show the path through the program.",
      "description": "Students trust structured progression more than broad promises.",
      "items": [
        {
          "title": "Week-by-week syllabus",
          "description": "Expose module outcomes, assignments, and live touchpoints.",
          "meta": "Curriculum"
        },
        {
          "title": "Progress tracking",
          "description": "Track attendance, completion, and deliverables through the cohort.",
          "meta": "Progress"
        },
        {
          "title": "Support rhythm",
          "description": "Keep office hours, group reviews, and feedback windows visible.",
          "meta": "Coaching"
        }
      ]
    },
    {
      "eyebrow": "Enrollment design",
      "title": "Sell the structure and support.",
      "description": "The strongest cohort pages clarify exactly what the learner joins and when.",
      "items": [
        {
          "title": "Cohort timing",
          "description": "Lead with next start date, session cadence, and seat cap.",
          "meta": "Urgency"
        },
        {
          "title": "Outcome framing",
          "description": "Promise concrete transformation tied to the syllabus.",
          "meta": "Offer"
        },
        {
          "title": "Post-payment path",
          "description": "Move learners into prep, orientation, and goal-setting fast.",
          "meta": "Onboarding"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should the pricing page emphasize?",
      "answer": "Seat access, cohort timing, live support, and the depth of the program are the key purchase drivers."
    },
    {
      "question": "What data model belongs first?",
      "answer": "Cohorts, sessions, learners, assignments, attendance, and enrollment status are the right foundation."
    },
    {
      "question": "How should onboarding feel?",
      "answer": "Like the start of a guided program, with next session timing and prep work visible immediately after payment."
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
    "badge": "Enrollment AI",
    "title": "Explore D1V DEMO with the built-in guide.",
    "description": "Use the assistant to handle curriculum fit, session timing, and payment questions so interested students move faster.",
    "assistantName": "D1V DEMO",
    "welcomeMessage": "I can walk you through D1V DEMO, pricing, access, and what this template includes.",
    "placeholder": "Ask about D1V DEMO, pricing, access, or included flows...",
    "submitLabel": "Ask D1V DEMO",
    "resetLabel": "Reset demo chat",
    "suggestedPrompts": [
      "What should happen after a student pays?",
      "How do I present cohort dates and seat limits?",
      "What student onboarding data should I store?"
    ],
    "systemPrompt": "You are D1V DEMO, the built-in guide for this demo site. Answer using only visible template capabilities, explain pricing, access, and onboarding clearly, and do not invent unsupported features.",
    "model": "kimi-k2.5"
  }
};
