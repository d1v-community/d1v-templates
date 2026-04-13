# Project Structure Guide

This document explains the structure of the Remix + Neon authentication template, including the recently added payment flow and the conventions that make it suitable for AI-assisted customization and deployment.

## Table of Contents

- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Directory Tree](#directory-tree)
- [Root Files](#root-files)
- [App Directory](#app-directory)
- [Routes](#routes)
- [Services](#services)
- [Utilities](#utilities)
- [Database](#database)
- [Documentation](#documentation)
- [Scripts](#scripts)
- [How This Template Supports AI-Driven Delivery](#how-this-template-supports-ai-driven-delivery)
- [Customization Guide](#customization-guide)

---

## Overview

This project is a **Remix full-stack template** built for:

- **Passwordless email authentication**
- **Neon/PostgreSQL-backed persistence**
- **JWT-based session handling**
- **Payment integration through a hosted payment platform**
- **AI-assisted project generation and deployment workflows**

The codebase is organized to keep concerns separate:

- **Routes** handle UI and HTTP request entry points
- **Services** contain business logic and external API integration
- **Utilities** centralize shared helpers and environment access
- **Database files** define schema and migration workflow
- **Docs** explain setup, deployment, API behavior, and operational conventions

This structure makes it easier for engineers and AI agents to understand the template, extend it, and adapt it into real products.

---

## High-Level Architecture

At a high level, the application is split into four main layers:

1. **UI Layer**
   - Remix routes render pages like login, home, pricing, payment success, and payment cancellation.

2. **API Layer**
   - Remix route actions expose backend endpoints such as authentication APIs and payment link creation.

3. **Service Layer**
   - Server-side modules handle integration with external systems such as:
     - JWT token generation/verification
     - verification code delivery
     - hosted payment provider APIs

4. **Persistence Layer**
   - Drizzle + PostgreSQL store users, verification codes, and any future application data.

This separation is intentional so you can replace or extend one subsystem without rewriting the whole app.

---

## Directory Tree

```text
remix-neon-auth-pay/
│
├── app/                                # Main application source
│   ├── components/                     # Shared UI components
│   ├── constants/                      # App-wide constants
│   │   └── app.ts                      # Application title and related constants
│   │
│   ├── db/                             # Database setup and schema
│   │   ├── db.server.ts                # Database connection/bootstrap
│   │   └── schema.ts                   # Drizzle table definitions
│   │
│   ├── routes/                         # Remix file-based routes
│   │   ├── _index.tsx                  # Landing page (/)
│   │   ├── login.tsx                   # Login page (/login)
│   │   ├── pricing.tsx                 # Pricing + checkout entry page (/pricing)
│   │   ├── pay.success.tsx             # Payment success page (/pay/success)
│   │   ├── pay.cancel.tsx              # Payment cancellation page (/pay/cancel)
│   │   ├── favicon.ico.ts              # Favicon route
│   │   ├── api.auth.send-code.ts       # Send email verification code
│   │   ├── api.auth.verify-login.ts    # Verify code and sign in user
│   │   ├── api.auth.logout.ts          # Logout endpoint
│   │   ├── api.auth.me.ts              # Current user endpoint
│   │   ├── api.auth.sync-cookie.ts     # Re-issue auth cookie from bearer token
│   │   └── api.pay.create.ts           # Create hosted payment link
│   │
│   ├── services/                       # Business logic and third-party integrations
│   │   ├── jwt.server.ts               # JWT creation and verification
│   │   ├── verification.server.ts      # Verification code generation and email delivery
│   │   └── payment.server.ts           # Payment provider API integration
│   │
│   ├── utils/                          # Shared helpers
│   │   ├── auth.server.ts              # Auth/session helpers
│   │   ├── env.server.ts               # Environment parsing and warnings
│   │   └── logger.server.ts            # Logging utilities
│   │
│   ├── entry.client.tsx                # Browser entry
│   ├── entry.server.tsx                # Server render entry
│   ├── root.tsx                        # Root layout and app shell
│   └── tailwind.css                    # Global Tailwind styles
│
├── docs/                               # Project documentation
│   ├── API.md                          # API documentation
│   ├── CONTRIBUTING.md                 # Contribution guide
│   ├── DEPLOYMENT.md                   # Deployment instructions
│   ├── ENVIRONMENT.md                  # Environment variable reference
│   ├── FAQ.md                          # Frequently asked questions
│   ├── PAYMENTS.md                     # Payment integration guide
│   └── PROJECT_STRUCTURE.md            # This file
│
├── drizzle/                            # SQL migrations
│   ├── 0000_init.sql                   # Initial migration
│   └── meta/                           # Drizzle migration metadata
│
├── public/                             # Static assets
├── scripts/                            # Operational scripts
│   ├── migrate.mjs                     # Direct database migration script
│   ├── migrate_via_api.mjs             # API-based migration script
│   ├── seed.mjs                        # Direct database seed script
│   └── seed_via_api.mjs                # API-based seed script
│
├── .env.example                        # Example environment variables
├── AGENTS.md                           # Rules and workflow guidance for automated agents
├── drizzle.config.ts                   # Drizzle configuration
├── package.json                        # Scripts and dependencies
├── tailwind.config.ts                  # Tailwind CSS config
├── tsconfig.json                       # TypeScript config
├── vite.config.ts                      # Vite + Remix config
└── README.md                           # Main project overview
```

---

## Root Files

### `package.json`

**Purpose**: Declares dependencies and project scripts.

**What lives here**:

- Remix build/dev commands
- TypeScript checking
- Linting and formatting
- Database migration/seed commands
- API-mode migration/seed commands for safer deployment workflows

**Why it matters**:
This is the operational entry point for both local developers and automation.

---

### `.env.example`

**Purpose**: Documents the environment variables needed by the app.

**Includes variables for**:

- database access
- authentication
- app URL configuration
- email delivery
- payment platform integration

**Why it matters**:
This is the quickest way to understand what must be configured in local development and deployment platforms.

---

### `AGENTS.md`

**Purpose**: Defines repository-specific rules for automated coding agents.

**Examples of conventions captured here**:

- prefer API-based database scripts by default
- always run type checks after code changes
- avoid exposing credentials unnecessarily
- keep diffs minimal and focused

**Why it matters**:
Since this template is intended for AI-assisted project generation and deployment, these rules act as operational guardrails.

---

### `README.md`

**Purpose**: Provides the main project introduction and quick-start workflow.

**Typically covers**:

- what the template is for
- key features
- install/setup steps
- available scripts
- links to detailed docs

---

### `drizzle.config.ts`

**Purpose**: Configures schema and migration output for Drizzle.

**Defines**:

- where schema files live
- where generated migrations are stored
- how the database connection is resolved

---

### `vite.config.ts`

**Purpose**: Configures the Vite bundler and Remix integration.

**Common responsibilities**:

- dev server behavior
- build pipeline integration
- path alias support

---

### `tsconfig.json`

**Purpose**: Controls TypeScript compilation behavior.

**Important features**:

- strict typing
- module resolution
- JSX settings
- app-level path aliases

---

## App Directory

The `app/` folder contains the application itself.

### `app/components/`

**Purpose**: Reusable UI building blocks.

Examples may include:

- navigation/header
- footer
- auth-related display components
- layout fragments

**Why it matters**:
Keeping visual building blocks separate reduces duplication across routes.

---

### `app/constants/`

**Purpose**: Centralized constants used across the application.

#### `app/constants/app.ts`

Contains application-level constants such as:

- application title
- metadata-related values
- labels reused across pages

---

### `app/db/`

**Purpose**: Database access layer setup.

#### `app/db/db.server.ts`

Responsible for:

- creating the database client
- configuring the connection
- exporting reusable DB access for services and routes

#### `app/db/schema.ts`

Defines:

- tables
- columns
- constraints
- TypeScript-friendly schema metadata

This is where you extend the data model when adapting the template into a real product.

---

### `app/routes/`

**Purpose**: Remix file-based routing layer.

This is where page routes and backend API endpoints live.

---

## Routes

### Page Routes

#### `app/routes/_index.tsx`

**Route**: `/`

**Purpose**:

- landing page
- product intro / template overview
- entry point to login and application flows

---

#### `app/routes/login.tsx`

**Route**: `/login`

**Purpose**:

- start passwordless login
- collect email
- verify code
- establish user session

**Related backend APIs**:

- `/api/auth/send-code`
- `/api/auth/verify-login`

---

#### `app/routes/pricing.tsx`

**Route**: `/pricing`

**Purpose**:

- display products retrieved from the payment platform
- show price and billing information
- allow logged-in users to begin checkout
- redirect authenticated buyers to a hosted payment page

**Key responsibilities**:

- loads product catalog from the payment service
- features the requested `productId` or defaults to the first product
- shows environment/payment warnings when configuration is incomplete
- restores auth from local token when needed
- requires authentication before purchase
- creates payment links through `/api/pay/create`

**Why it matters**:
This route is the main UI entry point for the newly added payment system.

---

#### `app/routes/pay.success.tsx`

**Route**: `/pay/success`

**Purpose**:

- payment success callback page
- display success state after hosted checkout completes
- show useful query parameter details when provided
- suggest next fulfillment steps

**Typical next-step integrations**:

- create order records
- grant access to a digital product
- activate a subscription
- reconcile checkout state with your own backend

---

#### `app/routes/pay.cancel.tsx`

**Route**: `/pay/cancel`

**Purpose**:

- payment cancellation fallback page
- explain that checkout did not complete
- guide users back to pricing or home

**Why it matters**:
Hosted checkout flows should always have a clear cancellation path.

---

#### `app/routes/favicon.ico.ts`

**Route**: `/favicon.ico`

**Purpose**:
Serves the site favicon through Remix routing conventions.

---

### API Routes

#### `app/routes/api.auth.send-code.ts`

**Route**: `/api/auth/send-code`

**Purpose**:

- accept user email
- generate/send verification code
- support passwordless login initiation
- return a `503` when the verification store is unavailable

---

#### `app/routes/api.auth.verify-login.ts`

**Route**: `/api/auth/verify-login`

**Purpose**:

- validate submitted verification code
- create user session
- return auth information to the client
- return a `503` when the login store is unavailable

---

#### `app/routes/api.auth.logout.ts`

**Route**: `/api/auth/logout`

**Purpose**:

- clear authentication state
- remove token/cookie-based session data

---

#### `app/routes/api.auth.me.ts`

**Route**: `/api/auth/me`

**Purpose**:

- return current authenticated user
- support session-aware UI initialization
- support `/pricing` client-side auth restoration

---

#### `app/routes/api.auth.sync-cookie.ts`

**Route**: `/api/auth/sync-cookie`

**Purpose**:

- accept a bearer token from the current app session
- re-issue cookie-based auth headers
- keep client-restored auth aligned with server-rendered requests

---

#### `app/routes/api.pay.create.ts`

**Route**: `/api/pay/create`

**Purpose**:

- create a hosted checkout/payment link server-side
- require an authenticated user
- validate request payload with Zod
- return a checkout URL plus provider response metadata

**Expected use cases**:

- built-in `/pricing` checkout button
- custom frontend checkout button
- AI-generated flows that need a direct API integration path
- decoupled purchase initiation from a non-form client

**Why it matters**:
This endpoint makes the payment system accessible not only from the built-in `/pricing` page but also from future custom clients.

---

## Services

### `app/services/jwt.server.ts`

**Purpose**:

- sign JWTs
- verify JWTs
- encapsulate token behavior in one place

**Why it matters**:
Auth logic remains centralized and easier to replace if your session strategy changes.

---

### `app/services/verification.server.ts`

**Purpose**:

- generate verification codes
- persist/validate them as needed
- send emails via the configured email provider
- support passwordless login UX

---

### `app/services/payment.server.ts`

**Purpose**:
Centralizes all payment provider communication.

**Main responsibilities**:

- verify payment-related environment configuration
- build authenticated API requests
- normalize product data returned by the provider
- fetch product lists
- fetch transactions and metrics
- create hosted payment links
- derive a provider-compatible user ID format

**Why it matters**:
This file is the integration boundary between the template and your payment platform.

By isolating payment logic here, you can:

- switch providers later
- add new payment endpoints
- introduce webhook verification
- sync transactions to your own database

---

## Utilities

### `app/utils/auth.server.ts`

**Purpose**:

- session/user extraction from requests
- authentication guards
- helpers like `requireUser()`

**Why it matters**:
Routes can stay small and declarative while auth behavior remains reusable.

---

### `app/utils/env.server.ts`

**Purpose**:

- parse environment variables
- apply defaults
- generate friendly warning messages
- expose helpers for payment success/cancel URLs

**Important payment-related values**:

- app base URL
- payment API base URL
- payment API token
- custom success URL
- custom cancel URL

**Why it matters**:
Instead of crashing immediately on bad config, the app can surface helpful warnings in the UI.

That makes this template more resilient for AI-generated and platform-managed deployments.

---

### `app/utils/logger.server.ts`

**Purpose**:

- centralized server logging behavior
- configurable log levels
- a single place to improve observability later

---

## Database

### `drizzle/`

**Purpose**:
Contains SQL migration files and metadata.

#### `drizzle/0000_init.sql`

The initial schema migration.

#### `drizzle/meta/`

Stores Drizzle migration tracking information.

---

### Current Data Model

The template currently focuses on authentication-first functionality, with database support for things like:

- users
- verification codes
- future product/order/subscription records

The payment integration currently uses the external payment platform as the source of truth for products and checkout session creation. In many real projects, the next step is to add your own tables for:

- orders
- subscriptions
- entitlements
- billing events
- webhook audit logs

---

## Documentation

### `docs/API.md`

Describes:

- auth endpoints
- payment-related endpoints
- request/response examples

---

### `docs/ENVIRONMENT.md`

Explains:

- required and optional environment variables
- how to configure them safely
- payment-specific env setup

---

### `docs/DEPLOYMENT.md`

Covers:

- platform deployment strategy
- env configuration
- migration/seeding workflow
- operational notes for production

---

### `docs/FAQ.md`

Answers:

- common setup issues
- auth questions
- payment integration questions
- deployment troubleshooting

---

### `docs/PAYMENTS.md`

Explains:

- hosted checkout flow
- payment-related routes
- payment environment variables
- how to adapt the template for real billing workflows

---

### `docs/CONTRIBUTING.md`

Documents:

- contribution workflow
- coding conventions
- local setup expectations

---

### `docs/PROJECT_STRUCTURE.md`

This file.

Its job is to help both humans and AI systems quickly build a mental model of the repository.

---

## Scripts

### Migration and Seed Scripts

#### `scripts/migrate.mjs`

Direct database migration script.

#### `scripts/seed.mjs`

Direct database seed script.

These are useful in environments where direct DB credentials are intentionally available.

---

#### `scripts/migrate_via_api.mjs`

API-based migration workflow.

#### `scripts/seed_via_api.mjs`

API-based seed workflow.

These are the preferred scripts in environments where you want to avoid exposing raw database credentials to Node processes.

**Why this matters**:
This template is designed to work well with managed deployment platforms and AI-driven operational flows.

---

## How This Template Supports AI-Driven Delivery

This repository is structured so an AI system can reliably inspect, modify, and extend it.

### Why the structure is AI-friendly

- **Clear route boundaries** make it easy to add new pages and APIs
- **Centralized services** reduce guesswork about where external integrations live
- **Environment handling** is explicit and self-documented
- **Docs folder** provides task-specific references
- **Operational scripts** support automated deployment workflows

### Typical AI customization flow

A platform or agent can:

1. Start from this template
2. Update branding and content
3. Add domain-specific tables and business logic
4. Extend `/pricing` or payment APIs
5. Configure deployment environment variables
6. Run type checks and deploy

This is one of the main reasons the repository intentionally favors explicit naming and separation of concerns over overly clever abstractions.

---

## Customization Guide

### If you want to change authentication

Start with:

- `app/routes/login.tsx`
- `app/routes/api.auth.*.ts`
- `app/services/verification.server.ts`
- `app/services/jwt.server.ts`
- `app/utils/auth.server.ts`

---

### If you want to change payment behavior

Start with:

- `app/routes/pricing.tsx`
- `app/routes/api.pay.create.ts`
- `app/routes/pay.success.tsx`
- `app/routes/pay.cancel.tsx`
- `app/services/payment.server.ts`
- `app/utils/env.server.ts`

Common customizations:

- change purchase CTA wording
- add product filtering/grouping
- implement order fulfillment
- store successful purchases in your own database
- add webhook verification
- support subscriptions or credits

---

### If you want to extend the database

Start with:

- `app/db/schema.ts`
- `drizzle/`
- `scripts/migrate_via_api.mjs`
- `scripts/seed_via_api.mjs`

Good next additions for a production product:

- `orders`
- `subscriptions`
- `customer_profiles`
- `payment_events`
- `feature_usage`

---

### If you want to adapt the UI

Start with:

- `app/components/`
- `app/routes/`
- `app/tailwind.css`
- `tailwind.config.ts`

---

### If you want to adapt it for your own deployment platform

Review:

- `AGENTS.md`
- `docs/DEPLOYMENT.md`
- `docs/ENVIRONMENT.md`
- `scripts/`
- `app/utils/env.server.ts`

These files define the conventions that matter most when this template is used as the base for one-click or AI-assisted project delivery.

---

## Summary

The repository is organized around a few practical principles:

- **Remix routes for entry points**
- **services for backend integrations**
- **utilities for shared server concerns**
- **explicit environment handling**
- **clear operational scripts**
- **documentation that supports both humans and AI systems**

The addition of payment-related files extends the template from an auth starter into a more complete foundation for building SaaS, digital product, and AI-generated application flows.
