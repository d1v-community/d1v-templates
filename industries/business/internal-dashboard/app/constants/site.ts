export type SiteConfig = {
  appTitle: string;
  siteDescription: string;
  navigation: {
    pricingLabel: string;
    loginLabel: string;
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
  "appTitle": "OpsCanvas",
  "siteDescription": "Operations dashboard starter for internal teams, retainers, and premium access accounts.",
  "navigation": {
    "pricingLabel": "Pricing",
    "loginLabel": "Login"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "Business ops",
    "headline": "Run internal operations on a paid, permission-aware shell.",
    "description": "OpsCanvas is for teams that want a solid internal dashboard base with auth, data, and optional paid admin access.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Passwordless staff login out of the box",
      "Neon-backed data layer for pipeline and KPI models",
      "Hosted checkout for paid admin seats or retainers"
    ]
  },
  "pricing": {
    "badge": "Admin seats",
    "headline": "Activate the dashboard for",
    "description": "Secure access for the operators who need it most.",
    "featuredLabel": "Operator access",
    "accessLabel": "Admin seats, reporting, and shared dashboards",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Operations Access",
    "defaultProductDescription": "Enable secure dashboard access for your team.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "internal-dashboard-template",
    "badge": "Operator setup",
    "headline": "Replace the hero with your real reporting surface.",
    "description": "The starter already handles auth and billing. Focus your next pass on metrics, tables, workflows, and team permissions.",
    "bullets": [
      "Add KPI, task, and audit models to the database",
      "Protect routes by staff role or paid workspace access",
      "Turn the placeholder surface into your live dashboard"
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
  }
};
