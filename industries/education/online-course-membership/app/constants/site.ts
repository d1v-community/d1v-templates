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
  "appTitle": "LessonLoop",
  "siteDescription": "Online course membership app with paid access, login, and student data.",
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
    "assistantLabel": "Coach"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "Course membership",
    "headline": "Bundle lessons, progress, and recurring revenue in one starter.",
    "description": "LessonLoop is built for evergreen education products that need member login, billing, and a durable data layer.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Student login for course access",
      "Recurring checkout for learning memberships",
      "Database base for lessons, progress, and unlock states"
    ]
  },
  "pricing": {
    "badge": "Course access",
    "headline": "Start learning for",
    "description": "Join once. Access every lesson. Keep progress synced.",
    "featuredLabel": "Student membership",
    "accessLabel": "Lessons, progress tracking, and member updates",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Course Membership",
    "defaultProductDescription": "Unlock every lesson and track progress in one place.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "online-course-membership-template",
    "badge": "Learning stack",
    "headline": "Connect billing to courses, modules, and progress states.",
    "description": "This starter is ready for curriculum structures, member dashboards, and recurring learning access.",
    "bullets": [
      "Create course, module, and lesson progress models",
      "Gate learning routes by active membership",
      "Replace placeholder content with student dashboard surfaces"
    ]
  },
  "login": {
    "eyebrow": "Learner login",
    "title": "Move students directly into lessons, progress, and the next learning action.",
    "description": "Sign in to resume modules, downloads, and member-only tracks from one calm learning surface.",
    "audience": "Learners paying for evergreen courses and lesson libraries",
    "emailLabel": "Learning email",
    "emailPlaceholder": "learner@academy.com",
    "emailHint": "Use the email attached to your course membership or lesson library access.",
    "trustPoints": [
      "Members can return to progress, next lessons, and resources without friction.",
      "Course access and recurring billing stay connected to the same learner identity.",
      "The entry surface can reassure buyers that structure and continuity are already built in."
    ]
  },
  "heroMetrics": [
    {
      "value": "Library",
      "label": "Core asset",
      "detail": "Evergreen lessons should feel browsable and current."
    },
    {
      "value": "Self-paced",
      "label": "Learning mode",
      "detail": "Students need progress cues even without live cohorts."
    },
    {
      "value": "Recurring",
      "label": "Offer shape",
      "detail": "Use membership to keep the library growing."
    }
  ],
  "showcase": {
    "eyebrow": "Course library",
    "title": "Package lessons, progress, and member access like a real learning product.",
    "description": "Use this template for paid lesson libraries, academy memberships, or evergreen learning products that need structure and retention.",
    "panels": [
      {
        "title": "Featured track",
        "value": "Launch systems",
        "detail": "Lead with one high-value learning path rather than a flat course list.",
        "meta": "Path"
      },
      {
        "title": "Lesson depth",
        "value": "86 lessons",
        "detail": "Make the library feel substantial without becoming cluttered.",
        "meta": "Library"
      },
      {
        "title": "Progress",
        "value": "Trackable",
        "detail": "Learners should always know what to watch next.",
        "meta": "Retention"
      },
      {
        "title": "Member updates",
        "value": "Monthly drops",
        "detail": "Recurring content keeps the membership alive.",
        "meta": "Lifecycle"
      }
    ]
  },
  "workflow": {
    "eyebrow": "Learning product flow",
    "title": "Build for progression, not just content storage.",
    "description": "A paid lesson library wins when the path through the material is clear and the membership promise keeps growing.",
    "steps": [
      {
        "title": "Model tracks and lessons",
        "description": "Store tracks, lessons, resources, and learner completion state."
      },
      {
        "title": "Unlock by plan",
        "description": "Use successful payment to open the lesson library or premium tracks."
      },
      {
        "title": "Surface momentum",
        "description": "Show progress, next lessons, and update cadence clearly after login."
      }
    ]
  },
  "featureSections": [
    {
      "eyebrow": "Student experience",
      "title": "Make the library feel like a path, not a folder.",
      "description": "Structure is what turns content into a learning product.",
      "items": [
        {
          "title": "Learning tracks",
          "description": "Group lessons by outcome, difficulty, or role.",
          "meta": "IA"
        },
        {
          "title": "Progress state",
          "description": "Persist watched, completed, and next-up lesson states.",
          "meta": "Engagement"
        },
        {
          "title": "Resource shelf",
          "description": "Bundle worksheets, links, or downloads into each track.",
          "meta": "Depth"
        }
      ]
    },
    {
      "eyebrow": "Membership economics",
      "title": "Keep the recurring offer simple and compounding.",
      "description": "The value comes from library access plus ongoing additions.",
      "items": [
        {
          "title": "Core library",
          "description": "Use the archive as the main reason to subscribe.",
          "meta": "Offer"
        },
        {
          "title": "New lesson drops",
          "description": "Signal freshness with a predictable release rhythm.",
          "meta": "Retention"
        },
        {
          "title": "Upgrade ladder",
          "description": "Add coaching or cohort layers later without rebuilding the foundation.",
          "meta": "Expansion"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What should happen after purchase?",
      "answer": "Create the learner account, unlock the library, and route the student straight into a recommended track."
    },
    {
      "question": "What tables matter first?",
      "answer": "Tracks, lessons, resources, enrollments, and lesson progress are the strongest base layer."
    },
    {
      "question": "How should the homepage feel?",
      "answer": "Structured and instructional, with the path through the content clearer than the marketing language."
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
    "badge": "Learning concierge",
    "title": "Add an AI coach to your course membership template.",
    "description": "Use a built-in assistant to guide students to the right lessons, answer access questions, and keep the product feeling active.",
    "assistantName": "LessonLoop Coach",
    "welcomeMessage": "I can recommend lessons, explain membership access, and help students understand how to use this course product.",
    "placeholder": "Ask about lessons, student access, progress, or course structure...",
    "submitLabel": "Ask coach",
    "resetLabel": "Reset coach",
    "suggestedPrompts": [
      "How should I structure courses and modules?",
      "What should members see after checkout?",
      "How can an AI coach improve retention?"
    ],
    "systemPrompt": "You are LessonLoop Coach, a concise assistant for an online course membership product. Help with lesson discovery, access questions, onboarding, and retention-oriented product guidance. Stay grounded in the current template surface.",
    "model": "kimi-k2.5"
  }
};
