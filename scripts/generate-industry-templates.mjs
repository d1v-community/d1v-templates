#!/usr/bin/env node

import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const foundationDir = path.join(rootDir, "foundations", "remix-neon-auth-pay");
const configPath = path.join(__dirname, "industry-templates.config.json");
const skipNames = new Set([
  ".git",
  ".env",
  ".vercel",
  ".claude",
  "node_modules",
  "build",
  "dist",
  ".cache",
]);

function deepMerge(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override ?? base;
  }

  if (
    base &&
    typeof base === "object" &&
    override &&
    typeof override === "object"
  ) {
    const merged = { ...base };
    for (const [key, value] of Object.entries(override)) {
      merged[key] = deepMerge(base[key], value);
    }
    return merged;
  }

  return override ?? base;
}

function buildSiteConfig(template) {
  const pricingLabel = template.pricing?.badge || "Membership";

  return deepMerge(
    {
      appTitle: template.appTitle,
      siteDescription: template.siteDescription,
      navigation: {
        pricingLabel: "Pricing",
        loginLabel: "Login",
      },
      footer: {
        line: "Built with D1V",
      },
      home: {
        badge: template.name,
        headline: `Launch ${template.name.toLowerCase()} with login, data, and checkout already wired.`,
        description: template.description,
        primaryCtaLabel: "Open pricing",
        primaryCtaHref: "/pricing",
        secondaryCtaLabel: "Login",
        secondaryCtaHref: "/login",
        proofPoints: [
          "Passwordless login for secure member access",
          "Neon-backed persistence for product data",
          "Hosted checkout for subscriptions and paid upgrades",
        ],
      },
      pricing: {
        badge: pricingLabel,
        headline: "Start now for",
        description: "One clear price. Instant access. Checkout in seconds.",
        featuredLabel: "Member access",
        accessLabel: "Paid access enabled",
        checkoutLabel: "Checkout",
        checkoutUserDescription:
          "Checkout opens instantly for your signed-in account.",
        checkoutGuestDescription:
          "Login first, then return here to create a checkout link instantly.",
        buyButtonLabel: "Buy now",
        loginButtonLabel: "Login to purchase",
        readyLabelPrefix: "Ready to checkout as",
        loadErrorHint:
          "Check your Payment Hub API token and make sure your account already has at least one active product.",
        emptyStateTitle: "No active products yet",
        emptyStateDescription:
          "Create products in Payment Hub, then refresh this page to turn checkout on.",
        defaultProductName: pricingLabel,
        defaultProductDescription: template.description,
        viewDetailsLabel: "View details",
        viewingDetailsLabel: "Viewing details",
      },
      templateSurface: {
        templateId: template.slug,
        badge: "Template surface",
        headline: `Replace this starter with your ${template.name.toLowerCase()} workflow.`,
        description:
          "Keep auth, database, and billing in place while you build the actual product experience.",
        bullets: [
          "Model your product data in Drizzle and Neon",
          "Connect successful checkout to entitlements or seats",
          "Replace placeholder sections with your core workflow",
        ],
      },
      paymentSuccess: {
        eyebrow: "Payment completed",
        title: "Payment received",
        description:
          "Use this page to move the buyer into onboarding, account setup, or the paid experience.",
        nextStepsTitle: "Suggested next steps",
        nextSteps: [
          "Persist the order in your own database",
          "Grant access after successful checkout",
          "Show payment history in the account area",
          "Add webhook verification for fulfillment",
        ],
        primaryButtonLabel: "View pricing",
        secondaryButtonLabel: "Back to home",
      },
      paymentCancel: {
        eyebrow: "Checkout cancelled",
        title: "Payment was not completed",
        description:
          "The buyer exited checkout before finishing payment. They can return to pricing and try again.",
        reasonsTitle: "Common reasons you might see this page:",
        reasons: [
          "The buyer clicked back during checkout.",
          "The hosted payment page was closed.",
          "The payment method was not confirmed.",
          "The buyer intentionally cancelled before paying.",
        ],
        primaryButtonLabel: "Return to pricing",
        secondaryButtonLabel: "Go to homepage",
      },
    },
    {
      home: template.home,
      pricing: template.pricing,
      templateSurface: template.templateSurface,
      paymentSuccess: template.paymentSuccess,
      paymentCancel: template.paymentCancel,
    },
  );
}

function buildReadme(template) {
  const templateRepo = `d1v-community/${template.repositoryName}`;

  return `# ${template.name}

${template.description}

## What You Start With

- Remix + Tailwind application based on \`remix-neon-auth-pay\`
- Passwordless email login
- Neon / PostgreSQL + Drizzle ORM
- Hosted checkout and pricing page
- Local bootstrap script for pulling project env vars into \`.env\`

## Product Direction

- App title: \`${template.appTitle}\`
- Category: \`${template.category}\`
- Repository template path: \`${templateRepo}\`
- Default prompt: \`${template.prompt}\`

## Local Setup

\`\`\`bash
pnpm install
pnpm run env:bootstrap -- --template-repo ${templateRepo} --write-path .env
pnpm run db:migrate
pnpm run dev
\`\`\`

You can also export env vars into this repository manually:

\`\`\`bash
AUTH_TOKEN=your_token \\
BACKEND_ADMIN_API_BASE=http://localhost:8999 \\
node scripts/bootstrap-local-env.mjs --template-repo ${templateRepo} --write-path .env
\`\`\`

## Suggested Next Build Steps

- Replace the starter landing sections with the real ${template.name.toLowerCase()} workflow
- Extend the Drizzle schema for your product entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
`;
}

async function main() {
  const templates = JSON.parse(await readFile(configPath, "utf8"));
  const foundationAgents = await readFile(
    path.join(foundationDir, "AGENTS.md"),
    "utf8",
  );
  const foundationSiteSource = await readFile(
    path.join(foundationDir, "app", "constants", "site.ts"),
    "utf8",
  );
  const sitePrefix = foundationSiteSource.split(
    "export const SITE_CONFIG: SiteConfig =",
  )[0];

  for (const template of templates) {
    const targetDir = path.join(rootDir, "industries", template.category, template.slug);
    await rm(targetDir, { recursive: true, force: true });
    await mkdir(path.dirname(targetDir), { recursive: true });

    await cp(foundationDir, targetDir, {
      recursive: true,
      filter(source) {
        const name = path.basename(source);
        return !skipNames.has(name);
      },
    });

    const siteConfig = buildSiteConfig(template);
    const siteSource = `${sitePrefix}export const SITE_CONFIG: SiteConfig = ${JSON.stringify(
      siteConfig,
      null,
      2,
    )};\n`;

    const packageJsonPath = path.join(targetDir, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
    packageJson.name = template.packageName;
    packageJson.description = template.description;
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");

    const envExamplePath = path.join(targetDir, ".env.example");
    const envExample = await readFile(envExamplePath, "utf8");
    await writeFile(
      envExamplePath,
      envExample.replace("# Remix + Neon + Drizzle", `# ${template.name}`),
      "utf8",
    );

    await writeFile(
      path.join(targetDir, "README.md"),
      buildReadme(template),
      "utf8",
    );
    await writeFile(
      path.join(targetDir, "AGENTS.md"),
      foundationAgents.replaceAll("remix-neon-auth-pay", template.repositoryName),
      "utf8",
    );
    await writeFile(
      path.join(targetDir, "app", "constants", "site.ts"),
      siteSource,
      "utf8",
    );
    await writeFile(
      path.join(targetDir, ".d1v-template.json"),
      `${JSON.stringify(
        {
          templateId: template.id,
          templateRepo: `d1v-community/${template.repositoryName}`,
          prompt: template.prompt,
          category: template.category,
          foundation: "d1v-community/remix-neon-auth-pay",
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
  }

  console.log(
    `Generated ${templates.length} runnable industry templates from remix-neon-auth-pay.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
