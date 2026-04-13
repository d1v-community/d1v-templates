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
  "appTitle": "DownloadPort",
  "siteDescription": "Digital product storefront starter with paid access and downloadable fulfillment.",
  "navigation": {
    "pricingLabel": "Pricing",
    "loginLabel": "Login"
  },
  "footer": {
    "line": "Built with D1V"
  },
  "home": {
    "badge": "Digital commerce",
    "headline": "Sell files, kits, and templates on rails that are already wired.",
    "description": "DownloadPort gives digital products a faster route to launch by starting with auth, data, and checkout already in place.",
    "primaryCtaLabel": "Open pricing",
    "primaryCtaHref": "/pricing",
    "secondaryCtaLabel": "Login",
    "secondaryCtaHref": "/login",
    "proofPoints": [
      "Secure login for buyers and download history",
      "Checkout for one-off or recurring digital offers",
      "Database models ready for files, orders, and unlocks"
    ]
  },
  "pricing": {
    "badge": "Digital access",
    "headline": "Buy instant access for",
    "description": "Fast checkout. Clean delivery. No storefront rebuild required.",
    "featuredLabel": "Download access",
    "accessLabel": "Files, updates, and buyer history",
    "checkoutLabel": "Checkout",
    "checkoutUserDescription": "Checkout opens instantly for your signed-in account.",
    "checkoutGuestDescription": "Login first, then return here to create a checkout link instantly.",
    "buyButtonLabel": "Buy now",
    "loginButtonLabel": "Login to purchase",
    "readyLabelPrefix": "Ready to checkout as",
    "loadErrorHint": "Check your Payment Hub API token and make sure your account already has at least one active product.",
    "emptyStateTitle": "No active products yet",
    "emptyStateDescription": "Create products in Payment Hub, then refresh this page to turn checkout on.",
    "defaultProductName": "Digital Access",
    "defaultProductDescription": "Unlock your files and future product updates.",
    "viewDetailsLabel": "View details",
    "viewingDetailsLabel": "Viewing details"
  },
  "templateSurface": {
    "templateId": "digital-downloads-template",
    "badge": "Fulfillment setup",
    "headline": "Connect checkout to files and entitlements.",
    "description": "The starter already handles the transaction path. Your next layer is file storage, order records, and download delivery.",
    "bullets": [
      "Create order, file, and entitlement tables",
      "Deliver secure links after successful payment",
      "Replace placeholder sections with product galleries"
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
