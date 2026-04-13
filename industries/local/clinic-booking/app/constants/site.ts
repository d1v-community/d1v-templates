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
  "appTitle": "ClinicFlow",
  "siteDescription": "Clinic booking and patient portal starter with protected access and hosted checkout.",
  "navigation": {
    "pricingLabel": "Pricing",
    "loginLabel": "Login"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "Local services",
    "headline": "Handle appointments and deposits on infrastructure that is already live.",
    "description": "ClinicFlow gives local care providers a fast base for patient login, appointment data, and booking payments.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Secure login for patients and staff",
      "Hosted checkout for booking deposits or service plans",
      "Database starter for appointments, intake, and records"
    ]
  },
  "pricing": {
    "badge": "Booking deposit",
    "headline": "Reserve your visit for",
    "description": "Book quickly, collect deposits, and keep visit data organized.",
    "featuredLabel": "Patient access",
    "accessLabel": "Appointments, intake, and booking confirmations",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Visit Deposit",
    "defaultProductDescription": "Reserve a visit and confirm patient access in one flow.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "clinic-booking-template",
    "badge": "Care workflow",
    "headline": "Use the rails for booking, then add your care flow.",
    "description": "Focus the next layer on appointments, provider availability, intake forms, and post-booking follow-up.",
    "bullets": [
      "Create appointment, provider, and intake models",
      "Map deposits to confirmed bookings",
      "Replace placeholder content with scheduling and patient portal views"
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
