# Environment Variables Guide

This guide explains the environment variables used by the Remix template, including authentication, database access, email delivery, Payment Hub integration, and deployment on your AI one-click application deployment platform.

## Table of Contents

- [Overview](#overview)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Payment Variables](#payment-variables)
- [AI Deployment Platform Notes](#ai-deployment-platform-notes)
- [Development Example](#development-example)
- [Production Example](#production-example)
- [Validation Behavior](#validation-behavior)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

This template is designed to be used as a reusable project scaffold.

You can use it in two main ways:

1. **As a local starter project**
   - You clone the repository
   - Configure `.env`
   - Run migrations
   - Start development

2. **As a template for your AI deployment platform**
   - The AI generates or adapts a business project based on this template
   - Your platform injects environment variables during deployment
   - The app validates configuration at runtime and surfaces friendly warnings when possible

The application currently supports these areas of configuration:

- **Database** via PostgreSQL / Neon
- **Authentication** via JWT
- **Email verification** via Resend
- **Payments** via Payment Hub-compatible API
- **Deployment URL handling** for redirects and hosted checkout return flows

---

## Required Variables

These variables are required for the core app to work correctly.

### `DATABASE_URL`

**Description**: PostgreSQL connection string used by the server and Drizzle migration scripts.

**Required**: Yes

**Example**:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

**Used for**:

- User data
- Verification code storage
- Application persistence
- Direct database migrations when not using API mode

**Notes**:

- Use `?sslmode=require` for Neon and most cloud PostgreSQL providers
- Never expose this variable to client-side code
- Treat it as a secret

---

### `JWT_SECRET`

**Description**: Secret used to sign and verify JWT tokens.

**Required**: Yes

**Example**:

```env
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
```

**Used for**:

- Login session tokens
- Server-side authentication verification

**Recommendations**:

- Use a long random value
- Use different values for development, staging, and production
- Rotate it if you suspect it was exposed

---

## Optional Variables

These variables are optional but strongly recommended depending on your environment.

### `APP_URL`

**Description**: Public base URL of the deployed application.

**Required**: Optional, but strongly recommended in production

**Default**:

```env
APP_URL=http://localhost:5173
```

**Examples**:

```env
APP_URL=http://localhost:5173
APP_URL=https://your-app.example.com
APP_URL=https://your-project.d1v.app
```

**Used for**:

- Building absolute URLs
- Payment success redirect fallback
- Payment cancel redirect fallback
- Email links and other absolute references

**Why it matters**:
If this is wrong in production, redirect URLs may point to the wrong domain.

---

### `RESEND_API_KEY`

**Description**: API key for sending login verification emails through Resend.

**Required**: Optional

**Example**:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

**Used for**:

- Sending verification codes to users

**If omitted**:

- Email sending is skipped or falls back to development behavior depending on the implementation
- Useful for local development and UI testing

**Recommended when**:

- You want real users to receive login codes
- You are validating the full authentication flow in staging or production

---

### `NODE_ENV`

**Description**: Standard Node.js runtime mode.

**Required**: Optional

**Allowed values**:

- `development`
- `test`
- `production`

**Default**:

```env
NODE_ENV=development
```

**Used for**:

- Runtime behavior
- Logging and diagnostics
- Build/deployment conventions

**Notes**:
Your hosting platform usually sets this automatically.

---

### `LOG_LEVEL`

**Description**: Minimum log verbosity.

**Required**: Optional

**Default**:

```env
LOG_LEVEL=info
```

**Common values**:

- `debug`
- `info`
- `warn`
- `error`

**Use cases**:

- `debug` for troubleshooting
- `info` for normal application logging
- `warn` or `error` for quieter production logs

---

## Payment Variables

These variables control the hosted payment flow.

The payment integration in this template supports:

- Product listing from Payment Hub
- Creating hosted checkout links
- Redirecting buyers to success or cancel pages
- Rendering warnings when payment configuration is incomplete

### `PAY_BASE_URL`

**Description**: Base URL of the Payment Hub API.

**Required**: Optional for the auth-only template, required if you want payment features enabled

**Default**:

```env
PAY_BASE_URL=https://pay.d1v.ai/api
```

**Examples**:

```env
PAY_BASE_URL=https://pay.d1v.ai/api
PAY_BASE_URL=https://your-payment-gateway.example.com/api
```

**Used for**:

- Listing products
- Creating payment links
- Fetching payment-related resources from the payment provider

**Notes**:

- The application trims trailing slashes automatically
- This must be a full URL

---

### `PAY_API_TOKEN`

**Description**: Bearer token used to authenticate with the payment API.

**Required**: Required if payment features are enabled

**Example**:

```env
PAY_API_TOKEN=your_server_side_payment_api_token
```

**Used for**:

- Server-to-server authentication with Payment Hub

**Not used for**:

- selecting a default product
- storing an app-side payment user id

**Important**:

- Keep this secret
- Never expose it in browser code
- Inject it only in server runtime environments
- The built-in `/pricing` page reads products dynamically, so `PAY_DEFAULT_PRODUCT_ID` and `PAY_USER_ID` are not required

---

### `PAY_SUCCESS_URL`

**Description**: Absolute URL to send the buyer to after a successful hosted checkout.

**Required**: Optional

**Fallback behavior**:
If not provided, the app uses:

```text
{APP_URL}/pay/success
```

**Example**:

```env
PAY_SUCCESS_URL=https://your-app.example.com/pay/success
```

**Used for**:

- Payment provider redirect after checkout success

**When to set explicitly**:

- Your public app URL differs from internal deployment URL
- Your AI platform uses custom domains
- You want a dedicated post-payment flow route

---

### `PAY_CANCEL_URL`

**Description**: Absolute URL to send the buyer to if checkout is cancelled or not completed.

**Required**: Optional

**Fallback behavior**:
If not provided, the app uses:

```text
{APP_URL}/pay/cancel
```

**Example**:

```env
PAY_CANCEL_URL=https://your-app.example.com/pay/cancel
```

**Used for**:

- Payment provider redirect after checkout cancellation

**When to set explicitly**:

- Your deployment platform handles domains dynamically
- You want full control over payment return URLs
- You need a separate cancellation UX per environment

---

## AI Deployment Platform Notes

This template is intended to work well in an AI-driven deployment workflow.

### Recommended platform behavior

When your platform generates an app from this template, it should do the following:

1. **Inject required secrets at deploy time**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PAY_API_TOKEN` if payment is enabled
   - `RESEND_API_KEY` if email sending is enabled

2. **Set the public application URL**
   - `APP_URL`
   - Optionally also set:
     - `PAY_SUCCESS_URL`
     - `PAY_CANCEL_URL`

3. **Enable or disable features by configuration**
   - Auth-only projects can omit payment variables
   - Payment-enabled projects should configure `PAY_BASE_URL` and `PAY_API_TOKEN`

4. **Avoid baking secrets into generated source code**
   - Put secrets in environment configuration only
   - Do not hardcode them into route files, service files, or client bundles

### Recommended variable groups for your platform

You can think in terms of feature packs:

#### Base web app

```env
DATABASE_URL=...
JWT_SECRET=...
APP_URL=...
NODE_ENV=production
```

#### Email login

```env
RESEND_API_KEY=...
```

#### Payment-enabled project

```env
PAY_BASE_URL=https://pay.d1v.ai/api
PAY_API_TOKEN=...
PAY_SUCCESS_URL=https://your-app.example.com/pay/success
PAY_CANCEL_URL=https://your-app.example.com/pay/cancel
```

### Friendly runtime warnings

This template is designed to avoid crashing immediately for some configuration problems.

Examples:

- Invalid environment values may be logged on the server
- The UI can show warnings for missing payment config
- Pricing pages can surface a useful message instead of failing silently

This is helpful for AI-generated projects because:

- The platform can preview partially configured apps
- Developers can quickly see what is missing
- Environment mistakes are easier to diagnose

---

## Development Example

A typical local `.env` might look like this:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/remix_app?sslmode=require
JWT_SECRET=dev-secret-change-me-in-production
APP_URL=http://localhost:5173
NODE_ENV=development
LOG_LEVEL=debug

# Optional email
RESEND_API_KEY=

# Optional payments
PAY_BASE_URL=https://pay.d1v.ai/api
PAY_API_TOKEN=
PAY_SUCCESS_URL=http://localhost:5173/pay/success
PAY_CANCEL_URL=http://localhost:5173/pay/cancel
```

### Local development advice

- If you are only working on auth, you can leave payment variables empty
- If you are testing the pricing and checkout flow, configure `PAY_API_TOKEN`
- Make sure `APP_URL` matches your local port
- If your payment provider requires exact redirect allowlists, set explicit success/cancel URLs

---

## Production Example

A typical production setup might look like this:

```env
DATABASE_URL=postgresql://prod_user:prod_password@prod-host:5432/prod_db?sslmode=require
JWT_SECRET=use-a-long-random-production-secret
APP_URL=https://your-app.example.com
NODE_ENV=production
LOG_LEVEL=info
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx

PAY_BASE_URL=https://pay.d1v.ai/api
PAY_API_TOKEN=prod_payment_token
PAY_SUCCESS_URL=https://your-app.example.com/pay/success
PAY_CANCEL_URL=https://your-app.example.com/pay/cancel
```

### Production advice

- Always use real secrets
- Do not rely on development defaults
- Verify all public callback URLs
- Confirm your payment provider can redirect to your production domain
- Store secrets in your deployment platform's secret manager

---

## Validation Behavior

The server validates environment variables at runtime.

### Current behavior

- `NODE_ENV` is validated against allowed values
- URL-based settings such as `APP_URL`, `PAY_BASE_URL`, `PAY_SUCCESS_URL`, and `PAY_CANCEL_URL` must be valid URLs
- Missing or invalid values can trigger warning messages
- Payment-specific warnings can be shown when payment configuration is incomplete

### Important nuance

The template is intentionally tolerant in some places:

- It logs configuration errors instead of always throwing immediately
- Route loaders can decide how to present configuration problems to the user
- This makes the app more usable in partially configured deployment previews

---

## Security Best Practices

### 1. Never commit secrets

Do not commit real values for:

- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `PAY_API_TOKEN`

Only commit examples or placeholders.

---

### 2. Keep server-only variables on the server

These values must never be exposed to browser code:

- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `PAY_API_TOKEN`

---

### 3. Use different values per environment

Use separate values for:

- local development
- staging
- production

This is especially important for:

- JWT signing
- payment tokens
- database credentials

---

### 4. Treat payment redirects as configuration, not hardcoded constants

Prefer environment variables for:

- `APP_URL`
- `PAY_SUCCESS_URL`
- `PAY_CANCEL_URL`

This makes the template safer for:

- preview deployments
- custom domains
- AI-generated project variants
- multi-environment rollouts

---

### 5. Rotate secrets if exposed

If a token or secret leaks:

- revoke it if supported
- generate a new value
- update your deployment platform immediately

---

## Troubleshooting

### I see a warning about invalid environment variables

Check:

- Missing required values
- Incorrect URL format
- Typo in variable names
- Old values left over from another environment

---

### Pricing page loads but payment does not work

Check:

- `PAY_BASE_URL`
- `PAY_API_TOKEN`
- payment API availability
- whether the current environment allows outbound requests to the payment service

---

### Payment success or cancel redirects go to the wrong domain

Check:

- `APP_URL`
- `PAY_SUCCESS_URL`
- `PAY_CANCEL_URL`

In AI deployment scenarios, this usually means the platform deployed the app on a new domain but did not sync the redirect variables.

---

### Auth works locally but email codes are not delivered

Check:

- `RESEND_API_KEY`
- your sending domain configuration in Resend
- whether your environment should send real emails or only support local testing

---

### The generated project works in preview but fails in production

Check:

- whether production secrets were actually injected
- whether the public domain differs from preview
- whether payment redirect URLs still point to preview domains
- whether the production database is reachable

---

## Summary

For most projects, start with this set:

```env
DATABASE_URL=...
JWT_SECRET=...
APP_URL=...
NODE_ENV=production
```

Add email support when needed:

```env
RESEND_API_KEY=...
```

Add payment support when needed:

```env
PAY_BASE_URL=https://pay.d1v.ai/api
PAY_API_TOKEN=...
PAY_SUCCESS_URL=https://your-app.example.com/pay/success
PAY_CANCEL_URL=https://your-app.example.com/pay/cancel
```

If this template is used inside your AI deployment platform, the most important rule is simple:

**let the platform inject environment variables dynamically, and keep secrets out of generated source code.**
