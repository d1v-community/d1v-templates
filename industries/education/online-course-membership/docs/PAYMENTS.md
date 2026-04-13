# Payment Integration Guide

This document explains how the template's payment system works, how to configure it, and how to extend it when turning this repository into a real product on your AI-driven deployment platform.

## Table of Contents

- [Overview](#overview)
- [What This Template Includes](#what-this-template-includes)
- [Supported Payment Flow](#supported-payment-flow)
- [Routes Involved in Payment](#routes-involved-in-payment)
- [Environment Variables](#environment-variables)
- [Server-Side Payment Service](#server-side-payment-service)
- [How Checkout Link Creation Works](#how-checkout-link-creation-works)
- [Built-In Pricing Page Flow](#built-in-pricing-page-flow)
- [Programmatic Payment Flow via API](#programmatic-payment-flow-via-api)
- [Success and Cancel Pages](#success-and-cancel-pages)
- [How to Adapt This for Real Projects](#how-to-adapt-this-for-real-projects)
- [Recommended Production Architecture](#recommended-production-architecture)
- [AI Deployment Platform Notes](#ai-deployment-platform-notes)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Implementation Checklist](#implementation-checklist)

---

## Overview

This template includes a hosted checkout integration designed to work with your payment platform.

The current implementation is intentionally lightweight and template-friendly:

- products are fetched from the payment backend
- logged-in users can start checkout
- the app creates a hosted payment link server-side
- users are redirected to the hosted checkout page
- users are returned to success or cancel pages afterward

This gives you a practical default payment foundation without coupling the template too tightly to one specific business model.

It is especially useful in your AI one-click deployment workflow, where:

1. the AI reads the template
2. adapts branding and product logic
3. injects environment-aware configuration
4. deploys the application
5. verifies the payment flow

---

## What This Template Includes

The payment integration currently covers these capabilities:

### 1. Product listing

The app can load products from the payment backend and render them on the pricing page.

### 2. Hosted checkout link creation

The server can request a hosted checkout link for the current authenticated user.

### 3. Redirect-based checkout flow

The user is redirected to a hosted payment page rather than completing payment directly inside the app.

### 4. Payment return pages

The app includes:

- a success page at `/pay/success`
- a cancel page at `/pay/cancel`

### 5. Configuration-aware warnings

The app can surface warnings when payment configuration is incomplete instead of failing with an opaque crash.

---

## Supported Payment Flow

The built-in payment flow is:

1. user logs in
2. user opens `/pricing`
3. app loads products from the payment service
4. `/pricing` features `?productId=...` when present, otherwise the first product
5. user clicks **Buy membership**
6. app calls `/api/pay/create`
7. server creates a payment link
8. user is redirected to hosted checkout
9. payment platform redirects user to:
   - `/pay/success`, or
   - `/pay/cancel`

This is a good default flow for template-based applications because:

- checkout complexity stays server-side
- pricing UI stays simple
- redirect URLs are configurable
- the same backend flow can be reused by AI-generated project variations

---

## Routes Involved in Payment

### `GET /pricing`

Displays product cards retrieved from the payment platform.

Main responsibilities:

- load products
- render pricing information
- feature the requested product or default to the first returned product
- show missing-config warnings
- restore auth state when a local token is present
- let authenticated users initiate checkout
- prompt anonymous users to log in

### `POST /pricing`

Handles optional form-based checkout creation.

Main responsibilities:

- require authenticated user
- read selected `productId`
- create payment link
- redirect to hosted checkout URL

The current built-in UI uses `/api/pay/create` instead, but this server action remains available as a fallback pattern.

### `POST /api/pay/create`

Creates a checkout link programmatically and returns JSON.

Use this when you want:

- a custom payment button flow
- client-driven redirect logic
- a more app-like purchase experience
- generated UIs that need a reusable backend endpoint

### `GET /pay/success`

Success landing page after checkout.

This page is intended as the handoff point for business-specific post-payment logic.

### `GET /pay/cancel`

Cancellation landing page when a user exits checkout without completing payment.

This page is intended to safely guide the user back into the purchase flow.

---

## Environment Variables

Payment behavior is controlled by environment variables.

### `PAY_BASE_URL`

Base URL of the payment API.

Example:

```env
PAY_BASE_URL=https://pay.d1v.ai/api
```

Used for:

- loading products
- creating payment links
- accessing other payment backend resources

### `PAY_API_TOKEN`

Server-side Bearer token for payment API access.

Example:

```env
PAY_API_TOKEN=your_server_side_payment_token
```

Used for:

- authenticating server-to-server payment requests

Important:

- keep this secret
- never expose it to browser code
- do not hardcode it in source files

### `PAY_SUCCESS_URL`

Optional absolute success redirect URL.

Example:

```env
PAY_SUCCESS_URL=https://your-app.example.com/pay/success
```

If omitted, the app falls back to:

```text
{APP_URL}/pay/success
```

### `PAY_CANCEL_URL`

Optional absolute cancel redirect URL.

Example:

```env
PAY_CANCEL_URL=https://your-app.example.com/pay/cancel
```

If omitted, the app falls back to:

```text
{APP_URL}/pay/cancel
```

### `APP_URL`

Even though this is not payment-specific, it is critical to payment redirects.

Example:

```env
APP_URL=https://your-app.example.com
```

If `PAY_SUCCESS_URL` or `PAY_CANCEL_URL` are not explicitly set, `APP_URL` is used to build them.

---

## Server-Side Payment Service

The template keeps payment logic in a dedicated service module.

### Why this matters

Centralizing payment integration in one server-side layer makes it easier to:

- swap payment providers later
- normalize inconsistent upstream response shapes
- add logging and error handling
- add transactions, metrics, and reporting calls
- keep route handlers thin

### What the payment service is responsible for

The payment service typically handles:

- payment config validation
- authenticated requests to the payment API
- safe JSON parsing
- product normalization
- listing products
- creating payment links
- optional transaction and dashboard data retrieval
- user ID transformation for provider compatibility

### Design principle

Routes should focus on request/response behavior.

The service should focus on payment provider communication.

This separation is important in an AI-modified codebase because it keeps the integration boundary obvious.

---

## How Checkout Link Creation Works

A checkout link is created server-side using:

- the selected product ID
- the authenticated application user
- success and cancel redirect URLs
- buyer field requirements

Typical server-side input includes:

- `productId`
- `userId`
- optional `buyerEmail`
- optional `successUrl`
- optional `cancelUrl`
- `requireBuyerEmail`
- `requireBuyerName`

The payment backend returns a response that usually contains:

- checkout URL
- link ID
- product metadata
- price metadata

The template then either:

- redirects directly to the returned URL, or
- returns that URL to the client as JSON

---

## Built-In Pricing Page Flow

The built-in pricing page gives you a default checkout flow without requiring a fixed product id in environment variables.

### How it works

1. page loader fetches products from payment backend
2. the page features the requested `productId` or defaults to the first product
3. client-side auth is refreshed when a local token exists
4. user clicks **Buy membership**
5. browser calls `/api/pay/create`
6. server creates payment link
7. browser redirects to hosted checkout

### Why this is a good template default

It keeps payment link creation on the server, which is beneficial because:

- secrets stay server-side
- there is less client complexity
- redirects are simpler
- generated apps can keep this flow even if branding changes

### When to keep this flow

Use the built-in pricing page flow if you want:

- a simple hosted checkout integration
- low frontend complexity
- product selection from the backend catalog
- a stable default for AI-generated project variants

---

## Programmatic Payment Flow via API

The template also exposes a JSON API for creating payment links.

### Endpoint

`POST /api/pay/create`

### Use cases

Use this endpoint when you want to:

- create checkout from custom UI logic
- open checkout in a new tab
- run pre-checkout confirmation dialogs
- build SPA-style purchase flows
- let AI-generated pages trigger payment in non-form ways

### Request shape

Typical request body:

```json
{
  "productId": "prod_123",
  "successUrl": "https://your-app.example.com/pay/success",
  "cancelUrl": "https://your-app.example.com/pay/cancel",
  "requireBuyerEmail": true,
  "requireBuyerName": false
}
```

### Response shape

Typical success response:

```json
{
  "success": true,
  "checkoutUrl": "https://payment.example.com/checkout/abc123",
  "paymentLink": {
    "id": "plink_123",
    "url": "https://payment.example.com/checkout/abc123"
  }
}
```

### When to prefer this API over the form flow

Prefer `/api/pay/create` if your generated product needs:

- advanced client interactions
- mobile-app-style flows
- custom pre-checkout selection UX
- reusable payment link creation from multiple pages

---

## Success and Cancel Pages

### Success page: `/pay/success`

The success page is intentionally generic.

It is designed to:

- confirm checkout completion to the user
- display some query parameter details if provided
- act as a placeholder for future fulfillment logic

Possible query params include:

- `id`
- `payment_link_id`
- `paymentLinkId`
- `productId`
- `product_id`
- `session_id`
- `sessionId`
- `userId`
- `user_id`

### Cancel page: `/pay/cancel`

The cancel page is also intentionally generic.

It is designed to:

- reassure the user that payment did not complete
- explain possible reasons
- guide them back to pricing or home

### Important limitation

These pages are part of the user experience, but they are not a complete payment fulfillment system.

They should not be treated as the only source of truth for payment completion.

---

## How to Adapt This for Real Projects

When converting this template into a production business app, you will usually want to add more than redirect-based checkout.

### Common next steps

#### 1. Store order records

Create your own database tables for:

- orders
- subscriptions
- invoices
- purchase attempts
- entitlements

#### 2. Add webhook verification

Use payment webhooks to verify successful payment independently of browser redirects.

#### 3. Make fulfillment idempotent

Ensure your post-payment logic can safely run more than once without duplicating side effects.

Examples:

- granting access
- crediting balances
- upgrading subscriptions
- sending welcome emails

#### 4. Add user-facing billing history

Expose transaction and billing history in a dashboard.

#### 5. Handle plan-specific business logic

Examples:

- subscription activation
- feature unlocking
- API credit grants
- digital asset delivery
- team seat expansion

---

## Recommended Production Architecture

For a real project built from this template, a safer architecture is:

### Checkout initiation

Handled by:

- `/pricing` form post, or
- `POST /api/pay/create`

### Payment completion source of truth

Handled by:

- provider webhook events
- server-side reconciliation jobs
- optional admin reporting endpoints

### User experience

Handled by:

- `/pay/success`
- `/pay/cancel`

### Internal data ownership

Handled by your own database tables such as:

- `orders`
- `subscriptions`
- `payment_events`
- `entitlements`

### Why this matters

Browser redirect success is useful UX.

Webhook-confirmed payment state is useful truth.

You usually want both.

---

## AI Deployment Platform Notes

This repository is intended to work well with an AI-driven project generation and deployment platform.

### Why payment docs matter for AI

AI systems modifying the template need clear answers to:

- where payment logic lives
- which environment variables are required
- which routes are purchase-critical
- what is safe to customize
- what should remain server-side
- what is still missing for production fulfillment

### Recommended platform responsibilities

Your deployment platform should ideally:

1. inject payment environment variables securely
2. set `APP_URL` correctly for the assigned domain
3. optionally set `PAY_SUCCESS_URL` and `PAY_CANCEL_URL`
4. validate config before deployment
5. support preview and production domains
6. run type checks after generated changes
7. keep secrets out of generated client code

### Good AI customization targets

When generating a project from this template, the AI can safely adapt:

- pricing page copy
- plan naming
- product presentation
- success page messaging
- cancel page messaging
- post-payment onboarding flow
- order/subscription schema additions

### Things AI should not hardcode

Do not hardcode:

- `PAY_API_TOKEN`
- `DATABASE_URL`
- production callback domains
- secret internal API values

These should remain platform-managed environment values.

---

## Security Considerations

### 1. Keep payment tokens server-side only

`PAY_API_TOKEN` must never be exposed in browser bundles, client logs, or public config.

### 2. Do not trust only browser redirects

A success redirect is not equivalent to verified payment state.

Always prefer webhook or server-side verification for business fulfillment.

### 3. Validate inputs

When creating payment links, validate:

- product ID presence
- redirect URL format
- user authentication state

### 4. Use environment-driven callback URLs

This is safer than hardcoding URLs because it supports:

- local development
- preview environments
- staging
- production
- AI-generated deployments on new domains

### 5. Log carefully

Do not log secrets.

If you log payment errors, prefer:

- error message
- status code
- non-sensitive metadata

Avoid logging:

- tokens
- sensitive payloads
- personal data unnecessarily

---

## Troubleshooting

### Pricing page loads but shows no products

Possible causes:

- `PAY_BASE_URL` is incorrect
- `PAY_API_TOKEN` is missing
- payment API is unavailable
- payment account has no active products
- upstream response shape changed

### Payment link creation fails

Possible causes:

- user is not logged in
- `productId` is missing
- payment backend returned an error
- payment configuration is incomplete
- redirect URL is invalid

### Success page loads but nothing happens in the app

That usually means fulfillment has not been implemented yet.

The template confirms the redirect and displays context, but it does not automatically grant business entitlements unless you add that logic.

### Cancel page appears unexpectedly

Possible causes:

- user closed hosted checkout
- user clicked back
- payment method was not completed
- payment provider redirected to cancel URL on interruption

### Redirects go to the wrong domain

Possible causes:

- `APP_URL` is incorrect
- `PAY_SUCCESS_URL` is incorrect
- `PAY_CANCEL_URL` is incorrect
- deployment platform did not update env vars after assigning a new domain

### Payment works locally but not in production

Check:

- production env vars
- outbound connectivity to payment API
- public callback URL correctness
- whether production token differs from dev token
- whether deployment platform actually applied new secrets

---

## Implementation Checklist

Use this checklist when enabling payments in a project generated from this template.

### Configuration

- [ ] `APP_URL` is set correctly
- [ ] `PAY_BASE_URL` is set correctly
- [ ] `PAY_API_TOKEN` is configured server-side
- [ ] `PAY_SUCCESS_URL` is correct or intentionally omitted
- [ ] `PAY_CANCEL_URL` is correct or intentionally omitted

### UI

- [ ] `/pricing` shows the right products
- [ ] product names and descriptions match the business
- [ ] plan/pricing copy is customized
- [ ] success page messaging matches the product
- [ ] cancel page messaging matches the product

### Backend

- [ ] checkout link creation works
- [ ] auth is required before purchase
- [ ] error handling is readable
- [ ] payment secrets are server-only

### Business logic

- [ ] order persistence exists if needed
- [ ] webhook verification exists if needed
- [ ] entitlement/subscription logic exists if needed
- [ ] payment success is reconciled with internal records

### Deployment

- [ ] preview environment works
- [ ] production environment works
- [ ] redirect URLs use the correct domain
- [ ] platform secret injection is verified

---

## Final Recommendation

Treat the current payment integration as a strong template baseline:

- it is enough to demonstrate and initiate hosted checkout
- it is enough for AI to understand the intended payment architecture
- it is not yet the full fulfillment system for a production business app

For production-ready payment behavior built on top of this template, you should typically add:

- webhook verification
- internal order/subscription storage
- entitlement fulfillment
- transaction visibility
- support and billing operations

That gives you the best of both worlds:

- a simple template payment flow for fast AI-generated delivery
- a robust backend payment architecture for real business use
