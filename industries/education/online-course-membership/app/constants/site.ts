export type SiteConfig = {
  appTitle: string;
  siteDescription: string;
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
