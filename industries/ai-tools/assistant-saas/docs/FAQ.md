# Frequently Asked Questions (FAQ)

## Table of Contents

- [General Questions](#general-questions)
- [Setup & Installation](#setup--installation)
- [Authentication](#authentication)
- [Payments](#payments)
- [Environment & Deployment](#environment--deployment)
- [Template Customization](#template-customization)
- [Database & Migrations](#database--migrations)
- [Troubleshooting](#troubleshooting)

---

## General Questions

### What is this template for?

This is a **production-ready Remix starter template** for building web applications with:

- **Email verification login**
- **JWT-based authentication**
- **Neon PostgreSQL**
- **Drizzle ORM**
- **Tailwind CSS**
- **Payment Hub integration**
- **AI-friendly project structure and documentation**

It is designed as a **template project** that can be used by your **AI one-click application deployment platform**. The idea is that AI can read the template, understand its structure, and then adapt the implementation into a real project with minimal manual work.

---

### Who should use this template?

This template is a good fit for:

- SaaS products
- AI tools and agent platforms
- Membership or subscription products
- Internal tools with login + payments
- MVPs that need fast delivery
- Teams standardizing project scaffolding for AI-assisted development

---

### Is this meant to be used directly in production?

Yes, but as with any starter template, you should still review:

- environment variable configuration
- payment fulfillment flow
- webhook handling
- access control rules
- logging and monitoring
- rate limiting
- domain/email reputation
- business-specific security requirements

The template is a solid foundation, not a finished business product.

---

### Why does this template emphasize AI-friendly structure?

Because the project is intended to work well with automated coding agents and deployment workflows. That means:

- clear route boundaries
- centralized environment variable handling
- explicit service-layer abstractions
- straightforward API routes
- docs that explain how to customize and deploy the template

This makes it easier for AI to understand what to change when turning the template into a new application.

---

## Setup & Installation

### How do I get started locally?

Basic setup flow:

1. Install dependencies
2. Copy `.env.example` to `.env`
3. Configure required environment variables
4. Run database migrations
5. Start the dev server

Example:

```bash
pnpm install
cp .env.example .env
pnpm run db:migrate:api
pnpm run dev
```

By default, prefer the **API-based database scripts**.

---

### Which package manager should I use?

`pnpm` is recommended because the project scripts and repository guidance are written with `pnpm` in mind.

You can still adapt to other package managers if needed, but the documented workflow assumes:

```bash
pnpm install
pnpm run dev
pnpm run typecheck
```

---

### What are the system requirements?

Recommended minimums:

- **Node.js 20+**
- **pnpm**
- Access to a **PostgreSQL-compatible database** such as Neon
- Optional: **Resend** account for email delivery
- Optional: **Payment Hub** credentials for checkout integration

---

### Do I need email delivery configured in development?

Not necessarily.

If `RESEND_API_KEY` is not set, you can still develop most of the application. Depending on your local flow, verification behavior can be tested without a real production email setup.

For production, configure a real email provider.

---

## Authentication

### How does login work?

This template uses **email verification code login** instead of passwords.

Typical flow:

1. User enters email
2. App sends a verification code
3. User submits the code
4. Server verifies the code
5. App creates an authenticated session using JWT/cookies

This keeps the auth flow simple and works well for template-based applications.

---

### Where is authentication logic implemented?

Authentication-related logic is primarily organized across:

- auth utilities in `app/utils`
- verification/email services in `app/services`
- Remix routes under `app/routes/api.auth.*`

This separation makes it easier for AI or developers to replace pieces independently.

---

### Do frontend requests need to manually attach the token?

Usually no.

For `/api/*` frontend requests, the project follows the convention that a global fetch/auth mechanism handles authorization automatically when appropriate.

Do not manually add `Authorization` headers unless you have a specific exception.

---

### Can I replace email login with another auth method?

Yes.

Common alternatives include:

- magic links
- OAuth
- username/password
- SSO
- organization-based auth
- wallet login

If you replace auth, update:

- login UI
- auth APIs
- user/session handling
- protected route checks
- related docs

---

## Payments

### What payment capability is included in this template?

The template includes a **Payment Hub integration** that lets the app:

- read products from Payment Hub
- render a pricing page
- create checkout/payment links
- redirect users into hosted checkout
- return users to success/cancel pages

This gives you a working starting point for charging users without building a checkout stack from scratch.

---

### Which routes are related to payments?

The main payment-related routes are:

- `/pricing` — product list and checkout entry point
- `/api/pay/create` — create a payment link programmatically
- `/pay/success` — payment success landing page
- `/pay/cancel` — payment cancellation landing page

These routes are intended to be easy to customize when turning the template into a real product.

---

### How does the pricing page work?

The pricing page loads products from Payment Hub and displays:

- product name
- description
- price
- billing type
- active/inactive state

It features the product from `?productId=...` when present. If no query param is provided, it uses the first product returned by the payment backend.

If the user is logged in, they can start checkout directly.
If not, they are prompted to log in first.

---

### How is checkout created?

The built-in pricing page creates checkout by calling `/api/pay/create` after confirming the current user. The server then creates a hosted payment link through the payment service layer and either:

- redirects the user to the checkout URL from the `/pricing` page flow, or
- returns the checkout URL as JSON from `/api/pay/create`

This supports both:

- regular browser flows
- app/API-driven payment initiation

---

### What environment variables are required for payments?

At minimum, payment integration typically needs:

- `PAY_BASE_URL`
- `PAY_API_TOKEN`

You do not need `PAY_DEFAULT_PRODUCT_ID` or `PAY_USER_ID` for this template. Product selection comes from the backend catalog, and buyer identity comes from the authenticated app user.

Optional payment redirect customization:

- `PAY_SUCCESS_URL`
- `PAY_CANCEL_URL`

If the custom redirect URLs are not provided, the app falls back to:

- `APP_URL/pay/success`
- `APP_URL/pay/cancel`

---

### What happens if payment configuration is missing?

The app is designed to fail more gracefully than a hard crash.

Typical behavior includes:

- a warning banner in the UI
- product loading failures surfaced as friendly errors
- payment creation failing with a readable server response

This is helpful in template scenarios where some environments are partially configured.

---

### Does a successful payment automatically grant access to a product?

Not by itself.

The success page is currently a **template handoff point**. In a real application, you usually still need to:

- record the order
- verify payment status
- grant entitlement
- activate a subscription
- credit the user account
- notify internal systems

For real fulfillment, you should usually add **webhook-based confirmation**.

---

### Should I rely only on the success redirect page for fulfillment?

No.

Redirect pages are useful for the user experience, but they are not enough for a trustworthy fulfillment workflow. Users may close the tab, lose connection, or manipulate URLs.

For production payment fulfillment, add:

- server-side order persistence
- webhook verification
- idempotent fulfillment logic
- retry-safe access granting

---

### Can I sell one-time products and subscriptions?

Yes, the pricing model already anticipates both:

- `one_time`
- `recurring`

You can extend the UI and fulfillment flow depending on whether the product is:

- credits
- seats
- subscription plans
- downloadable assets
- API packages
- premium features

---

### Why is there a user ID transformation for payments?

Some payment systems require a specific external user ID shape or length. The template normalizes the application user ID before sending it to Payment Hub so the upstream system receives a stable identifier.

If your billing platform has different requirements, you can change that mapping in the payment service layer.

---

## Environment & Deployment

### Which environment variables are always important?

Core app variables usually include:

- `DATABASE_URL`
- `JWT_SECRET`
- `APP_URL`

Other common variables:

- `RESEND_API_KEY`
- `LOG_LEVEL`
- `PAY_BASE_URL`
- `PAY_API_TOKEN`
- `PAY_SUCCESS_URL`
- `PAY_CANCEL_URL`

Check `docs/ENVIRONMENT.md` for the full breakdown.

---

### What is `APP_URL` used for?

`APP_URL` is the public base URL of your app.

It is important for:

- absolute redirect URLs
- email links
- payment success/cancel fallback URLs
- production-safe environment behavior

Examples:

- `http://localhost:5173` for local development
- `https://your-app.example.com` for production

---

### Can I deploy this on my AI one-click application deployment platform?

Yes. This template is meant to fit that workflow.

A typical AI deployment flow looks like:

1. AI reads the template structure
2. AI updates branding, copy, schema, business logic, and payment behavior
3. Platform injects environment variables
4. Platform runs migrations
5. Platform deploys the app
6. AI or operators verify payment and auth behavior

To make this smooth, ensure your platform can provide:

- application environment variables
- a migration workflow
- secure secret handling
- a way to configure callback URLs
- optional admin/API tokens for database API mode

---

### What should an AI deployment platform customize first?

The most common customizations are:

- app name and branding
- product copy on the homepage and pricing page
- payment success page messaging
- email sender details
- database schema for business data
- feature gating / entitlements
- onboarding flow after payment

That usually gets you from "template" to "project-specific app" quickly.

---

### How should secrets be handled in deployment?

Never hardcode secrets into the repository.

Use your deployment platform's secret management for values like:

- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `PAY_API_TOKEN`
- `AUTH_TOKEN` for API-based DB workflows

Avoid exposing credentials to browser code or logs.

---

## Template Customization

### What parts of the template are intended to be customized?

The most commonly customized areas are:

- `app/constants/app.ts` for app-level branding
- landing page and marketing copy
- login UX
- pricing page product presentation
- post-payment success flow
- database schema
- email templates
- dashboard/business logic

Think of the current implementation as the default scaffold.

---

### How should I turn this template into a project for a specific business?

A practical order is:

1. Update app title, branding, and homepage copy
2. Define your domain model in the database
3. Adjust auth requirements
4. Update pricing/product display
5. Implement post-payment fulfillment
6. Add business dashboards or workflows
7. Refresh docs to match the new app

This sequence works well for both humans and AI agents.

---

### What should I change after integrating payments into a real product?

Usually you should customize:

- pricing copy and plan names
- what happens after successful purchase
- what permissions/features each plan unlocks
- billing support contact text
- transaction history UI
- refund or cancellation flows
- webhook processing

The included success and cancel pages are starter experiences, not the final business UX.

---

### Can I use this template without the payment feature?

Yes.

If your project does not need payments, you can:

- hide or remove the pricing route
- remove the payment service layer
- omit payment environment variables
- adapt docs and navigation accordingly

The template is modular enough for auth-only use cases.

---

### Can I use this template without Neon?

Yes, as long as you use a PostgreSQL-compatible setup and adapt the database configuration where necessary.

Neon is the recommended path because it aligns with the template defaults and docs, but the architecture is not fundamentally locked to Neon.

---

## Database & Migrations

### Which migration workflow should I use?

By default, use the **API-based workflow**:

- `pnpm run db:migrate:api`
- `pnpm run db:seed:api`

This is the preferred mode because it avoids unnecessarily exposing direct database credentials to local Node processes.

Only use direct DB scripts if you intentionally want that workflow.

---

### What is required for API-based migration mode?

You typically need:

- `PROJECT_ID`
- `OPCODE_API_BASE` or `BACKEND_ADMIN_API_BASE`
- `AUTH_TOKEN`

Optional:

- `MIGRATIONS_FOLDER`
- `SEED_FILE`

This mode is especially useful in managed deployment environments and internal automation platforms.

---

### When should I use direct database scripts instead?

Only when you explicitly want direct DB access and understand the tradeoffs.

Direct scripts may be useful for:

- low-level debugging
- local experiments
- environments without the admin API layer

But for normal template workflows, prefer API mode.

---

### Do I need to update the schema for payment features?

Not necessarily for the initial integration shown here.

The current payment integration focuses on:

- product listing from an external payment service
- checkout creation
- user redirect handling

For a real business app, you will usually want your own tables for things like:

- orders
- subscriptions
- entitlements
- invoices
- credits
- webhook events

---

## Troubleshooting

### The pricing page shows an error or no products. Why?

Common causes:

- `PAY_BASE_URL` is incorrect
- `PAY_API_TOKEN` is missing or invalid
- the payment API is unavailable
- the payment account has no active products
- upstream API response shape changed

Start by checking payment-related environment variables and server logs.

---

### The app shows an environment warning banner. What does it mean?

This usually means one or more required environment variables are missing or invalid.

The warning is intentionally user-friendly so that deployments fail visibly instead of crashing immediately.

Verify your deployment environment and compare it with `docs/ENVIRONMENT.md`.

---

### Payment redirect works, but my app does not grant access afterward.

That is expected unless you implement fulfillment.

A redirect to `/pay/success` does not automatically mean:

- your database was updated
- access was granted
- the order was verified
- the subscription was activated

Add server-side business logic and webhook verification for that.

---

### Why does `/api/pay/create` return an error?

Likely reasons include:

- the user is not authenticated
- `productId` is missing
- payment configuration is incomplete
- the upstream payment API returned an error
- the payment service did not return a checkout URL

Check the response body and server logs for the exact message.

---

### I changed the template, but the docs no longer match. What should I update?

At minimum, update:

- `README.md`
- `docs/API.md`
- `docs/ENVIRONMENT.md`
- `docs/DEPLOYMENT.md`
- `docs/PROJECT_STRUCTURE.md`
- this FAQ

A template intended for AI-assisted adaptation is much more effective when the documentation stays current.

---

### What should I document when I fork or clone this template for another project?

Document these items first:

- what the app does
- which environment variables are required
- which payment provider or billing workflow it uses
- what happens after payment
- which migration mode to use
- what an AI agent is expected to customize

This reduces ambiguity for both developers and automated agents.

---

## Final Recommendation

If you are using this repository as a reusable template for an AI-powered deployment platform, keep these principles in mind:

- keep structure predictable
- keep environment handling centralized
- keep route responsibilities clear
- keep docs synchronized with the implementation
- treat payments as a full workflow, not just a redirect
- design the project so AI can safely modify it

That will make the template easier to maintain, easier to deploy, and much more effective as a foundation for real applications.
