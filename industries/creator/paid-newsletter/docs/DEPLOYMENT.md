# Deployment Guide

This guide explains how to deploy the Remix template in a way that works well with your AI-driven one-click application deployment platform, while also covering the newly added Payment Hub integration.

## Table of Contents

- [Overview](#overview)
- [Deployment Modes](#deployment-modes)
- [Recommended Platform Workflow](#recommended-platform-workflow)
- [Required Environment Variables](#required-environment-variables)
- [Payment Setup](#payment-setup)
- [Database Setup](#database-setup)
- [Build and Runtime](#build-and-runtime)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Platform-Specific Notes](#platform-specific-notes)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project is a **template application** designed to be consumed by your AI deployment platform.

A typical workflow looks like this:

1. The AI reads this template repository.
2. It customizes the app based on the target business scenario.
3. The platform injects environment variables.
4. The platform runs database migration and optional seed tasks.
5. The app is deployed as a Remix server application.
6. Payment-related pages and APIs are connected to your Payment Hub service.

In other words, this repository is not just a demo app. It is meant to act as a **base template** for generating real projects on your deployment platform.

---

## Deployment Modes

There are two practical deployment modes for this template.

### 1. AI Platform Deployment (Recommended)

Use this mode when your internal AI platform is responsible for:

- creating the project
- writing environment variables
- running migrations
- deploying the app
- connecting external services such as email and payment

This is the **recommended mode** for this repository.

### 2. Standard Manual Deployment

Use this mode when deploying manually to a generic Node.js hosting platform such as:

- Vercel
- Railway
- Fly.io
- Docker-based infrastructure
- self-hosted Node.js servers

The manual mode works too, but this template is optimized for automated provisioning.

---

## Recommended Platform Workflow

For your AI deployment platform, the recommended deployment sequence is:

### Step 1: Provision environment variables

At minimum, configure:

- database connection
- JWT secret
- app public URL
- optional email service
- payment service settings

### Step 2: Run database migrations

Prefer the API-based migration flow:

- `pnpm run db:migrate:api`

Do not default to direct database migration scripts unless your workflow explicitly requires direct database access.

### Step 3: Optionally seed initial data

If your generated app needs default data, run:

- `pnpm run db:seed:api`

### Step 4: Build the Remix app

Run:

- `pnpm run build`

### Step 5: Start the production server

Run:

- `pnpm run start`

### Step 6: Verify payment flow

After deployment, confirm that:

- `/pricing` loads products correctly
- authenticated users can create checkout links
- success and cancel redirects work
- the payment API token is valid
- the public app URL matches callback expectations

---

## Required Environment Variables

The following variables matter during deployment.

### Core application variables

#### `DATABASE_URL`

PostgreSQL connection string used by the app and direct DB workflows.

Example:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

#### `JWT_SECRET`

Secret used to sign and verify JWTs.

Requirements:

- use a strong random secret
- use different values per environment
- never commit it to the repository

Example:

```env
JWT_SECRET=replace-with-a-long-random-secret
```

#### `APP_URL`

Public base URL of the deployed application.

This value is important because it is used to derive default payment return URLs.

Example:

```env
APP_URL=https://your-app.example.com
```

#### `NODE_ENV`

Runtime mode.

Typical value in production:

```env
NODE_ENV=production
```

#### `LOG_LEVEL`

Optional log verbosity.

Example:

```env
LOG_LEVEL=info
```

### Email-related variable

#### `RESEND_API_KEY`

Optional, but recommended in production if you want real verification emails to be sent.

If not set, local or server-side development flows may fall back to console logging behavior depending on implementation.

Example:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Payment Setup

This template now includes payment integration through your payment service.

### Payment-related variables

#### `PAY_BASE_URL`

Base URL of the payment service API.

Default behavior in code expects an API base such as:

```env
PAY_BASE_URL=https://pay.d1v.ai/api
```

#### `PAY_API_TOKEN`

Bearer token used by the server to access the payment API.

Example:

```env
PAY_API_TOKEN=replace-with-server-side-payment-token
```

#### `PAY_SUCCESS_URL`

Optional explicit success callback URL.

If not set, the app falls back to:

- `APP_URL/pay/success`

Example:

```env
PAY_SUCCESS_URL=https://your-app.example.com/pay/success
```

#### `PAY_CANCEL_URL`

Optional explicit cancel callback URL.

If not set, the app falls back to:

- `APP_URL/pay/cancel`

Example:

```env
PAY_CANCEL_URL=https://your-app.example.com/pay/cancel
```

### What the payment integration does

The current implementation adds:

- a pricing page at `/pricing`
- a server API endpoint at `/api/pay/create`
- a success page at `/pay/success`
- a cancel page at `/pay/cancel`
- a payment service wrapper for the remote payment API

### Payment flow

The deployed flow works like this:

1. The app loads products from the payment service.
2. `/pricing` features the requested `productId` or defaults to the first returned product.
3. A logged-in user clicks a purchase button on `/pricing`.
4. The browser calls `/api/pay/create`.
5. The server creates a hosted checkout link through the payment API.
6. The user is redirected to the hosted checkout page.
7. After checkout, the payment platform redirects back to:
   - `/pay/success`, or
   - `/pay/cancel`

### Deployment requirements for payment

To make payment work in production:

- `PAY_BASE_URL` must point to the correct payment API
- `PAY_API_TOKEN` must be valid
- `APP_URL` must match the real public domain
- success and cancel URLs must be reachable from the payment provider
- outbound server requests to the payment API must be allowed by your infrastructure

### Important security notes

- Never expose `PAY_API_TOKEN` to the client.
- Only configure it as a server-side environment variable.
- Do not hardcode payment tokens in source code.
- Keep return URLs aligned with the deployed domain to avoid broken redirects.

---

## Database Setup

This repository supports two database workflows.

### API mode (default)

Preferred for automated deployments.

Use:

- `pnpm run db:migrate:api`
- `pnpm run db:seed:api`

Required environment for API mode:

- `PROJECT_ID`
- `OPCODE_API_BASE` or `BACKEND_ADMIN_API_BASE`
- `AUTH_TOKEN`

Optional:

- `MIGRATIONS_FOLDER`
- `SEED_FILE`

This mode is recommended because it avoids passing the direct database connection into every migration execution context.

### Direct DB mode

Use only when explicitly needed.

Commands:

- `pnpm run db:migrate`
- `pnpm run db:seed`

This mode requires `DATABASE_URL` to be available to the process.

### Recommendation for AI platform deployments

For your one-click deployment platform, prefer this sequence:

1. provision `PROJECT_ID`
2. provision backend admin/API endpoint
3. provision auth token securely
4. run `db:migrate:api`
5. optionally run `db:seed:api`

This keeps the workflow safer and more consistent with the template conventions.

---

## Build and Runtime

### Install dependencies

Recommended package manager:

- `pnpm`

Command:

```bash
pnpm install
```

### Build

```bash
pnpm run build
```

### Start

```bash
pnpm run start
```

### Type checking

After any generated or manual code change, run:

```bash
pnpm run typecheck
```

Type errors should be treated as deployment blockers.

### Runtime expectation

This app is a server-rendered Remix application and expects:

- Node.js 20+
- access to required server-side environment variables
- a reachable PostgreSQL database
- optional access to Resend
- access to the payment API if payment is enabled

---

## Post-Deployment Checklist

After deployment, verify the following:

### Core app

- [ ] The home page loads
- [ ] Login works
- [ ] Verification email flow works
- [ ] Authenticated session is preserved correctly

### Database

- [ ] Database migrations completed successfully
- [ ] Required tables exist
- [ ] Seed data exists if expected

### Payment

- [ ] `/pricing` renders without server errors
- [ ] Product list is returned from the payment API
- [ ] Clicking purchase creates a checkout link
- [ ] Hosted checkout opens successfully
- [ ] Success redirect lands on `/pay/success`
- [ ] Cancel redirect lands on `/pay/cancel`

### Configuration

- [ ] `APP_URL` matches the actual production domain
- [ ] `PAY_SUCCESS_URL` and `PAY_CANCEL_URL` are correct if overridden
- [ ] `PAY_API_TOKEN` is set only on the server
- [ ] `JWT_SECRET` is unique and secure in production

---

## Platform-Specific Notes

## AI Deployment Platform

This template is especially suitable for an AI-driven deployment platform that:

- clones the template
- modifies branding, copy, and business logic
- injects environment variables from a control plane
- runs migration jobs automatically
- deploys the built Remix server
- wires external services like payment and email

Recommended platform responsibilities:

- generate a strong `JWT_SECRET`
- set `APP_URL` automatically from the assigned domain
- inject payment configuration only for projects that enable payments
- validate required env vars before build
- run `pnpm run typecheck` before final deployment
- run database API-mode migrations as part of provisioning

### Vercel

If deploying to Vercel manually:

- set all environment variables in the project settings
- ensure the server runtime can reach the database and payment API
- verify that the deployed domain is reflected in `APP_URL`

### Railway

Railway is a good fit for this app because it supports long-lived Node services and environment variables easily.

Be sure to:

- configure `APP_URL` to the actual Railway public domain or custom domain
- set payment env vars in the service settings
- run migration jobs before exposing the app

### Fly.io

Fly.io works well if you want more control over runtime networking.

Be sure to:

- expose the correct HTTP port
- configure secrets through Fly
- confirm outbound connectivity to payment and email services

### Docker / Self-Hosted

For container deployments:

- inject env vars at runtime, not in the image
- run migrations as a separate deployment step
- expose the Remix server port correctly
- make sure reverse proxy settings preserve HTTPS and host headers as needed

---

## Troubleshooting

### `/pricing` shows no products

Possible causes:

- `PAY_BASE_URL` is incorrect
- `PAY_API_TOKEN` is missing or invalid
- the payment API is unreachable from the deployed server
- the payment account has no active products

### Payment creation fails

Possible causes:

- user is not authenticated
- `productId` is missing
- payment API returned an error
- callback URLs are invalid
- the payment token lacks permission

### Success or cancel pages do not redirect correctly

Possible causes:

- `APP_URL` is wrong
- `PAY_SUCCESS_URL` or `PAY_CANCEL_URL` points to the wrong domain
- the payment service is configured with stale callback settings

### Email login works locally but not in production

Possible causes:

- `RESEND_API_KEY` is missing
- sender domain is not configured correctly
- environment variables were not applied to the production runtime

### Migration jobs fail on the platform

Possible causes:

- API mode variables are missing
- project ID is wrong
- auth token is invalid
- the migration folder path was overridden incorrectly

---

## Suggested Production Defaults

For most deployments, a solid baseline is:

```env
NODE_ENV=production
APP_URL=https://your-app.example.com
LOG_LEVEL=info

DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

PAY_BASE_URL=https://pay.d1v.ai/api
PAY_API_TOKEN=replace-with-server-side-payment-token
PAY_SUCCESS_URL=https://your-app.example.com/pay/success
PAY_CANCEL_URL=https://your-app.example.com/pay/cancel
```

If you are deploying through your internal AI platform, the platform should ideally generate and inject these values automatically.

---

## Final Recommendation

For this repository, the best production approach is:

1. use the template as the base project for AI generation
2. inject environment variables through the deployment platform
3. run database tasks in API mode by default
4. deploy the Remix server
5. validate the payment flow on `/pricing`
6. extend `/pay/success` with your own fulfillment logic later

That gives you a clean separation between:

- template code
- AI-generated business customization
- platform-managed secrets
- external services such as database, email, and payment
