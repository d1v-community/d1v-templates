#!/usr/bin/env node

import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  INDUSTRY_DATA_MODELS,
} from "./industry-template.data-models.mjs";
import {
  INDUSTRY_FULFILLMENT_MODELS,
} from "./industry-template.fulfillment-models.mjs";
import {
  CATEGORY_DESIGN_MATRIX,
  LOGIN_EXPERIENCES,
  TEMPLATE_EXPERIENCES,
} from "./industry-template.presets.mjs";

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

const baseSchemaSource = `import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Email verification codes
export const verificationCodes = pgTable(
  "verification_codes",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    purpose: text("purpose").notNull().default("login"),
    expiresAt: timestamp("expires_at", { withTimezone: false }).notNull(),
    used: text("used").notNull().default("false"),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("verification_codes_email_idx").on(table.email),
    emailPurposeIdx: index("verification_codes_email_purpose_idx").on(table.email, table.purpose),
  })
);

// Payment checkout requests
export const paymentCheckoutRequests = pgTable("payment_checkout_requests", {
  id: text("id").primaryKey(),
  appUserId: text("app_user_id").notNull().references(() => users.id),
  externalBuyerUserId: text("external_buyer_user_id").notNull(),
  productId: text("product_id").notNull(),
  checkoutStatus: text("checkout_status").notNull(),
  paymentLinkUrl: text("payment_link_url"),
  successUrl: text("success_url").notNull(),
  cancelUrl: text("cancel_url").notNull(),
  lastTransactionId: text("last_transaction_id"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Payment webhook events
export const paymentWebhookEvents = pgTable("payment_webhook_events", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  transactionId: text("transaction_id"),
  signature: text("signature"),
  payloadJson: text("payload_json").notNull(),
  processingStatus: text("processing_status").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Payment entitlements
export const paymentEntitlements = pgTable("payment_entitlements", {
  id: text("id").primaryKey(),
  appUserId: text("app_user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull(),
  entitlementStatus: text("entitlement_status").notNull(),
  accessLabel: text("access_label").notNull(),
  source: text("source").notNull(),
  lastTransactionId: text("last_transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Payment fulfillment records
export const paymentFulfillments = pgTable("payment_fulfillments", {
  id: text("id").primaryKey(),
  appUserId: text("app_user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull(),
  transactionId: text("transaction_id").notNull(),
  businessEntity: text("business_entity").notNull(),
  businessRecordId: text("business_record_id").notNull(),
  fulfillmentStatus: text("fulfillment_status").notNull(),
  fulfillmentSource: text("fulfillment_source").notNull(),
  summaryLabel: text("summary_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

`;

const baseSqlSource = `-- Users table
create table if not exists users (
  id text primary key,
  username text not null,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Email verification codes
create table if not exists verification_codes (
  id text primary key,
  email text not null,
  code text not null,
  purpose text not null default 'login',
  expires_at timestamp not null,
  used text not null default 'false',
  created_at timestamp not null default now()
);
create index if not exists verification_codes_email_idx on verification_codes(email);
create index if not exists verification_codes_email_purpose_idx on verification_codes(email, purpose);

-- Payment checkout requests
create table if not exists payment_checkout_requests (
  id text primary key,
  app_user_id text not null references users(id),
  external_buyer_user_id text not null,
  product_id text not null,
  checkout_status text not null,
  payment_link_url text,
  success_url text not null,
  cancel_url text not null,
  last_transaction_id text,
  last_error text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Payment webhook events
create table if not exists payment_webhook_events (
  id text primary key,
  event_type text not null,
  transaction_id text,
  signature text,
  payload_json text not null,
  processing_status text not null,
  error_message text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Payment entitlements
create table if not exists payment_entitlements (
  id text primary key,
  app_user_id text not null references users(id),
  product_id text not null,
  entitlement_status text not null,
  access_label text not null,
  source text not null,
  last_transaction_id text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Payment fulfillment records
create table if not exists payment_fulfillments (
  id text primary key,
  app_user_id text not null references users(id),
  product_id text not null,
  transaction_id text not null,
  business_entity text not null,
  business_record_id text not null,
  fulfillment_status text not null,
  fulfillment_source text not null,
  summary_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);
`;

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
  const aiAssistant = template.aiAssistant ?? null;
  const categoryTheme = CATEGORY_DESIGN_MATRIX[template.category];
  const loginExperience = LOGIN_EXPERIENCES[template.id];
  const templateExperience = TEMPLATE_EXPERIENCES[template.id];

  if (!categoryTheme) {
    throw new Error(`Missing category design matrix for ${template.category}.`);
  }

  if (!templateExperience) {
    throw new Error(`Missing template experience preset for ${template.id}.`);
  }

  if (!loginExperience) {
    throw new Error(`Missing login experience preset for ${template.id}.`);
  }

  return deepMerge(
    {
      appTitle: template.appTitle,
      siteDescription: template.siteDescription,
      theme: categoryTheme,
      navigation: {
        pricingLabel: "Pricing",
        loginLabel: "Login",
        assistantLabel: aiAssistant?.assistantName ? "AI Concierge" : undefined,
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
      login: loginExperience,
      heroMetrics: templateExperience.heroMetrics,
      showcase: templateExperience.showcase,
      workflow: templateExperience.workflow,
      featureSections: templateExperience.featureSections,
      faq: templateExperience.faq,
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
      theme: template.theme,
      navigation: template.navigation,
      home: template.home,
      pricing: template.pricing,
      templateSurface: template.templateSurface,
      login: template.login,
      heroMetrics: template.heroMetrics,
      showcase: template.showcase,
      workflow: template.workflow,
      featureSections: template.featureSections,
      faq: template.faq,
      aiAssistant: template.aiAssistant,
      paymentSuccess: template.paymentSuccess,
      paymentCancel: template.paymentCancel,
    },
  );
}

function buildReadme(template) {
  const templateRepo = `d1v-community/${template.repositoryName}`;
  const categoryTheme = CATEGORY_DESIGN_MATRIX[template.category];
  const templateExperience = TEMPLATE_EXPERIENCES[template.id];
  const baseFeatures = [
    "- Remix + Tailwind application based on `remix-neon-auth-pay`",
    "- Passwordless email login",
    "- Neon / PostgreSQL + Drizzle ORM",
    "- Hosted checkout and pricing page",
    "- Live database snapshot route at `/api/template/snapshot`",
    "- Local bootstrap script for pulling project env vars into `.env`",
  ];

  if (template.aiAssistant?.enabled) {
    baseFeatures.splice(
      5,
      0,
      "- Optional on-page AI concierge powered by `D1V_PAI_*`",
    );
  }

  const aiSetupBlock = template.aiAssistant?.enabled
    ? `
Optional AI assistant env:

\`\`\`bash
D1V_PAI_BASE_URL=https://pai.d1v.ai/v1
D1V_PAI_API_KEY=your_project_level_pai_api_key
\`\`\`
`
    : "";

  const aiNextStep = template.aiAssistant?.enabled
    ? `- Tune the built-in AI concierge prompt and connect it to your product workflow\n`
    : "";

  return `# ${template.name}

${template.description}

## What You Start With

${baseFeatures.join("\n")}

## Product Direction

- App title: \`${template.appTitle}\`
- Category: \`${template.category}\`
- Repository template path: \`${templateRepo}\`
- Default prompt: \`${template.prompt}\`

## Design Direction

- Visual thesis: ${categoryTheme.visualThesis}
- Content plan:
${categoryTheme.contentPlan.map((item) => `  - ${item}`).join("\n")}
- Interaction thesis:
${categoryTheme.interactionThesis.map((item) => `  - ${item}`).join("\n")}

## Product Modules

- Showcase headline: ${templateExperience.showcase.title}
- Workflow headline: ${templateExperience.workflow.title}
- Starter modules:
${templateExperience.featureSections
  .flatMap((section) => section.items.map((item) => `  - ${item.title}: ${item.description}`))
  .join("\n")}

## Local Setup

\`\`\`bash
pnpm install
pnpm run env:bootstrap -- --template-repo ${templateRepo} --write-path .env
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
\`\`\`

You can also export env vars into this repository manually:

\`\`\`bash
AUTH_TOKEN=your_token \\
BACKEND_ADMIN_API_BASE=http://localhost:8999 \\
node scripts/bootstrap-local-env.mjs --template-repo ${templateRepo} --write-path .env
\`\`\`
${aiSetupBlock}

## Suggested Next Build Steps

- Replace the starter landing sections with the real ${template.name.toLowerCase()} workflow
- Extend the seeded industry schema with your production entities
- Map successful checkout to entitlements, seats, bookings, or premium access
- Add success-state fulfillment beyond the hosted checkout return pages
${aiNextStep}`;
}

function buildSchemaColumnSource(column) {
  let expression;

  if (column.kind === "text") {
    expression = `text("${column.dbName}")`;
  } else if (column.kind === "timestamp") {
    expression = `timestamp("${column.dbName}", { withTimezone: false })`;
  } else {
    throw new Error(`Unsupported column kind: ${column.kind}`);
  }

  if (column.primaryKey) {
    expression += ".primaryKey()";
  }

  if (column.defaultNow) {
    expression += ".defaultNow()";
  }

  if (column.notNull && !column.primaryKey) {
    expression += ".notNull()";
  }

  if (column.references) {
    const [tableName, fieldName] = column.references.split(".");
    expression += `.references(() => ${tableName}.${fieldName})`;
  }

  return `  ${column.name}: ${expression},`;
}

function buildSchemaSource(model) {
  const tableBlocks = model.tables.map((table) => {
    const columns = table.columns
      .map((column) => buildSchemaColumnSource(column))
      .join("\n");

    return `// ${table.title}
export const ${table.exportName} = pgTable("${table.tableName}", {
${columns}
});
`;
  }).join("\n");

  const typeExports = [
    'export type User = typeof users.$inferSelect;',
    'export type VerificationCode = typeof verificationCodes.$inferSelect;',
    'export type PaymentCheckoutRequest = typeof paymentCheckoutRequests.$inferSelect;',
    'export type PaymentWebhookEvent = typeof paymentWebhookEvents.$inferSelect;',
    'export type PaymentEntitlement = typeof paymentEntitlements.$inferSelect;',
    'export type PaymentFulfillment = typeof paymentFulfillments.$inferSelect;',
    ...model.tables.map(
      (table) => `export type ${capitalize(table.exportName)}Record = typeof ${table.exportName}.$inferSelect;`,
    ),
  ].join("\n");

  return `${baseSchemaSource}${tableBlocks}${typeExports}\n`;
}

function buildSqlColumnSource(column) {
  const parts = [column.dbName];

  if (column.kind === "text") {
    parts.push("text");
  } else if (column.kind === "timestamp") {
    parts.push("timestamp");
  } else {
    throw new Error(`Unsupported column kind: ${column.kind}`);
  }

  if (column.primaryKey) {
    parts.push("primary key");
  }

  if (column.notNull && !column.primaryKey) {
    parts.push("not null");
  }

  if (column.defaultNow) {
    parts.push("default now()");
  }

  if (column.references) {
    const [tableName, fieldName] = column.references.split(".");
    parts.push(`references ${tableName}(${toSnakeCase(fieldName)})`);
  }

  return `  ${parts.join(" ")}`;
}

function buildSqlSource(model) {
  const tableBlocks = model.tables.map((table) => {
    const columns = table.columns
      .map((column) => buildSqlColumnSource(column))
      .join(",\n");

    return `
-- ${table.title}
create table if not exists ${table.tableName} (
${columns}
);`;
  }).join("\n");

  return `${baseSqlSource}${tableBlocks}\n`;
}

function serializeSeedValue(value) {
  if (value === "__DEMO_USER_ID__") {
    return "DEMO_USER_ID";
  }

  return JSON.stringify(value);
}

function buildSeedInsert(table, row) {
  const columns = table.columns
    .filter((column) => !column.defaultNow)
    .map((column) => column.name)
    .filter((name) => row[name] !== undefined);

  const dbColumns = table.columns
    .filter((column) => columns.includes(column.name))
    .map((column) => column.dbName);

  const values = columns
    .map((name) => `\${${serializeSeedValue(row[name])}}`)
    .join(", ");

  return `  await db.execute(sql\`insert into ${table.tableName} (${dbColumns.join(", ")}) values (${values}) on conflict (id) do nothing\`);`;
}

function buildSeedSource(model) {
  const inserts = model.tables.flatMap((table) =>
    table.seedRows.map((row) => buildSeedInsert(table, row)),
  ).join("\n");

  return `import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const neonClient = neon(databaseUrl);
const client = Object.assign(
  (text, params, options) => neonClient.query(text, params, options),
  { transaction: neonClient.transaction?.bind(neonClient) },
);
const db = drizzle(client);

const DEMO_USER_ID = "demo_user_industry_template";

async function main() {
  await db.execute(sql\`insert into users (id, username, display_name, email) values (\${DEMO_USER_ID}, \${"demo"}, \${"Demo User"}, \${"demo@example.com"}) on conflict (id) do nothing\`);
${inserts}
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: ${JSON.stringify(model.tables.map((table) => table.tableName), null, 4)},
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
`;
}

function buildSnapshotDetailExpression(fields) {
  return fields
    .map((field) => `String(row.${field} ?? "")`)
    .join(", ");
}

function buildTemplateDataServiceSource(model) {
  const imports = model.tables.map((table) => table.exportName).join(",\n  ");

  const sectionLoaders = model.tables.map((table) => {
    const detailExpression = buildSnapshotDetailExpression(
      table.snapshot.detailFields,
    );

    return `async function load${capitalize(table.exportName)}Section(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(${table.exportName});
  const rows = await db
    .select()
    .from(${table.exportName})
    .orderBy(desc(${table.exportName}.createdAt))
    .limit(3);

  return {
    key: "${table.exportName}",
    title: ${JSON.stringify(table.title)},
    description: ${JSON.stringify(table.description)},
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: ${JSON.stringify(table.totalLabel)},
    items: rows.map((row) => ({
      title: String(row.${table.snapshot.titleField} ?? ""),
      meta: String(row.${table.snapshot.metaField} ?? ""),
      detail: buildDetail([${detailExpression}]),
    })),
  };
}`;
  }).join("\n\n");

  const sectionCalls = model.tables
    .map((table) => `load${capitalize(table.exportName)}Section()`)
    .join(",\n      ");

  return `import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  ${imports},
} from "~/db/schema";

export type TemplateSnapshotItem = {
  title: string;
  meta: string;
  detail: string;
};

export type TemplateSnapshotSection = {
  key: string;
  title: string;
  description: string;
  total: number;
  totalLabel: string;
  items: TemplateSnapshotItem[];
};

export type TemplateSnapshot = {
  title: string;
  description: string;
  generatedAt: string;
  sections: TemplateSnapshotSection[];
};

function buildDetail(parts: string[]) {
  return parts.filter(Boolean).join(" | ");
}

${sectionLoaders}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: ${JSON.stringify(model.snapshotTitle)},
    description: ${JSON.stringify(model.snapshotDescription)},
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      ${sectionCalls}
    ]),
  };
}
`;
}

function buildTemplateFulfillmentServiceSource(fulfillmentModel) {
  const columnEntries = Object.entries(fulfillmentModel.columns);
  const dbColumns = columnEntries.map(([column]) => column);
  const columnValues = columnEntries
    .map(([, expression]) => "${" + expression + "}")
    .join(", ");
  const updates = fulfillmentModel.updateColumns
    .map((column) => `${column} = excluded.${column}`)
    .concat("updated_at = now()")
    .join(",\n      ");

  return `import { sql } from "drizzle-orm";
import { db } from "~/db/db.server";
import type {
  PaymentFulfillmentContext,
  TemplateFulfillmentResult,
} from "~/services/payment-fulfillment.server";

function displayNameFor(context: PaymentFulfillmentContext) {
  return (
    context.user.displayName ||
    context.user.username ||
    context.user.email ||
    "Paid member"
  );
}

function emailFor(context: PaymentFulfillmentContext) {
  return context.user.email || context.transaction.customerEmail || "member@example.com";
}

function productLabelFor(context: PaymentFulfillmentContext) {
  return context.transaction.productName || "Paid access";
}

function buildBusinessRecordId(prefix: string, context: PaymentFulfillmentContext) {
  return \`\${prefix}_\${context.user.id}_\${context.transaction.productId || "product"}\`
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .slice(0, 120);
}

export async function fulfillTemplateEntitlement(
  context: PaymentFulfillmentContext,
): Promise<TemplateFulfillmentResult> {
  const recordId = buildBusinessRecordId(${JSON.stringify(fulfillmentModel.idPrefix)}, context);
${fulfillmentModel.prelude ? `  ${fulfillmentModel.prelude}\n` : ""}  await db.execute(
    sql\`insert into ${fulfillmentModel.tableName} (${dbColumns.join(", ")}) values (${columnValues}) on conflict (id) do update set
      ${updates}\`,
  );

  return {
    businessEntity: ${JSON.stringify(fulfillmentModel.businessEntity)},
    businessRecordId: recordId,
    accessLabel: ${fulfillmentModel.accessLabel},
    summary: ${fulfillmentModel.summary},
  };
}
`;
}

function capitalize(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toSnakeCase(value) {
  return value.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

async function readOptionalFile(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
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
    const model = INDUSTRY_DATA_MODELS[template.id];
    const fulfillmentFactory = INDUSTRY_FULFILLMENT_MODELS[template.id];

    if (!model) {
      throw new Error(`Missing industry data model for ${template.id}.`);
    }
    if (!fulfillmentFactory) {
      throw new Error(`Missing industry fulfillment model for ${template.id}.`);
    }
    const fulfillmentModel = fulfillmentFactory(model);

    const targetDir = path.join(
      rootDir,
      "industries",
      template.category,
      template.slug,
    );
    const preservedEnv = await readOptionalFile(path.join(targetDir, ".env"));

    await rm(targetDir, { recursive: true, force: true });
    await mkdir(path.dirname(targetDir), { recursive: true });

    await cp(foundationDir, targetDir, {
      recursive: true,
      filter(source) {
        const name = path.basename(source);
        return !skipNames.has(name);
      },
    });

    if (preservedEnv) {
      await writeFile(path.join(targetDir, ".env"), preservedEnv, "utf8");
    }

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
    await writeFile(
      packageJsonPath,
      `${JSON.stringify(packageJson, null, 2)}\n`,
      "utf8",
    );

    const envExamplePath = path.join(targetDir, ".env.example");
    const envExample = await readFile(envExamplePath, "utf8");
    await writeFile(
      envExamplePath,
      envExample.replace("# Remix + Neon + Drizzle", `# ${template.name}`),
      "utf8",
    );

    await writeFile(path.join(targetDir, "README.md"), buildReadme(template), "utf8");
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
      path.join(targetDir, "app", "db", "schema.ts"),
      buildSchemaSource(model),
      "utf8",
    );
    await writeFile(
      path.join(targetDir, "drizzle", "0000_init.sql"),
      buildSqlSource(model),
      "utf8",
    );
    await writeFile(
      path.join(targetDir, "scripts", "seed.mjs"),
      buildSeedSource(model),
      "utf8",
    );
    await writeFile(
      path.join(targetDir, "app", "services", "template-data.server.ts"),
      buildTemplateDataServiceSource(model),
      "utf8",
    );
    await writeFile(
      path.join(targetDir, "app", "services", "template-fulfillment.server.ts"),
      buildTemplateFulfillmentServiceSource(fulfillmentModel),
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
