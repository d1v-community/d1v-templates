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
  "appTitle": "ClientRoom",
  "siteDescription": "Client portal for agencies and service businesses with member access and project data.",
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
