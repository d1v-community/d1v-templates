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
  "appTitle": "SignalDesk AI",
  "siteDescription": "AI assistant membership app with login, workspace billing, and paid access.",
  "navigation": {
    "pricingLabel": "Pricing",
    "loginLabel": "Login",
    "assistantLabel": "Assistant"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "AI tools",
    "headline": "Charge for your assistant before you scale your agent stack.",
    "description": "SignalDesk AI is a payment-ready SaaS shell for private assistants, premium copilots, and member-only workflows.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Email login for paid assistant accounts",
      "Hosted checkout for monthly or annual access",
      "Neon-backed schema layer for threads, credits, and seats"
    ]
  },
  "pricing": {
    "badge": "Pro assistant",
    "headline": "Unlock the assistant for",
    "description": "One subscription. Faster answers. Team-ready workflows.",
    "featuredLabel": "Assistant access",
    "accessLabel": "Unlimited prompts and workspace history",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Pro Assistant",
    "defaultProductDescription": "Unlimited assistant access for your team.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "assistant-saas-template",
    "badge": "Launch checklist",
    "headline": "Turn this starter into a paid assistant product.",
    "description": "Replace the marketing layer with your workflow, then connect billing events to credits, seats, or premium tools.",
    "bullets": [
      "Model conversations, credits, and tool runs in your database",
      "Grant assistant entitlements after successful checkout",
      "Swap the placeholder UI for your chat workspace"
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
    "badge": "Embedded AI",
    "title": "Offer a live assistant from day one.",
    "description": "Use the built-in concierge to demo your product, qualify buyers, or answer member questions without exposing upstream secrets.",
    "assistantName": "SignalDesk Copilot",
    "welcomeMessage": "I can explain plans, demo workflows, or answer product questions. Ask me anything about your assistant offer.",
    "placeholder": "Ask about plans, workflows, or how this assistant product works...",
    "submitLabel": "Send message",
    "resetLabel": "Reset chat",
    "suggestedPrompts": [
      "What does the Pro Assistant plan include?",
      "How should I structure credits and seats?",
      "What should happen after a successful checkout?"
    ],
    "systemPrompt": "You are SignalDesk Copilot, a concise presales and onboarding assistant for an AI assistant SaaS. Answer in clear product language, focus on pricing, setup, and workflow design, and avoid making claims about features that are not visible in the current template.",
    "model": "kimi-k2.5"
  }
};
