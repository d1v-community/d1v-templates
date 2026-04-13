# API Documentation

This document describes the server endpoints and request/response patterns exposed by the template.

The project currently includes two main API areas:

1. **Authentication APIs** for email verification login
2. **Payment APIs** for creating hosted checkout links through the payment platform

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Conventions](#response-conventions)
- [Auth Endpoints](#auth-endpoints)
  - [Send Verification Code](#send-verification-code)
  - [Verify Login](#verify-login)
  - [Logout](#logout)
  - [Get Current User](#get-current-user)
  - [Sync Auth Cookie](#sync-auth-cookie)
- [Payment Endpoints](#payment-endpoints)
  - [Create Payment Link](#create-payment-link)
- [Page-Level Payment Flow](#page-level-payment-flow)
- [Error Codes](#error-codes)
- [Examples](#examples)
  - [Authentication Examples](#authentication-examples)
  - [Payment Examples](#payment-examples)
- [Integration Notes for Template-Based AI Deployment](#integration-notes-for-template-based-ai-deployment)

---

## Base URL

```text
Development: http://localhost:5173
Production: https://your-domain.com
```

All examples below use relative paths such as `/api/auth/me`.

---

## Authentication

Authentication is based on JWT login plus server-side cookies.

### How it works

1. The user submits their email to receive a verification code
2. The user submits the code to log in
3. The server returns the authenticated user and issues a token
4. The browser stores auth state for subsequent requests
5. Same-origin frontend requests to `/api/*` use the project's auth mechanism automatically

### Important client behavior

- Frontend API calls are same-origin
- The project uses a global fetch interceptor for `/api/*`
- Normal page requests can rely on the session cookie
- The built-in `/pricing` page also restores auth from local `auth-token` and sends `Authorization: Bearer ...` to `/api/auth/me`, `/api/auth/sync-cookie`, and `/api/pay/create`

### Payment auth requirement

Payment link creation requires a logged-in user because the checkout link is generated for the current authenticated account.

---

## Response Conventions

Most endpoints return JSON with one of the following patterns:

### Success

```json
{
  "success": true
}
```

Or an extended success payload:

```json
{
  "success": true,
  "data": {}
}
```

### Failure

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

Some validation failures may also include structured details.

---

## Auth Endpoints

## Send Verification Code

Send a 6-digit verification code to the user's email address.

```http
POST /api/auth/send-code
Content-Type: application/json
```

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Success Response

**Status: `200 OK`**

```json
{
  "success": true,
  "message": "Verification code sent"
}
```

### Error Responses

**Status: `400 Bad Request`**

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**Status: `503 Service Unavailable`**

```json
{
  "success": false,
  "error": "Verification service database is unavailable."
}
```

Or in development when the database is not ready:

```json
{
  "success": false,
  "error": "Database unavailable for verification flow: <database error>. Check DATABASE_URL and run the database migration."
}
```

**Status: `502 Bad Gateway`**

```json
{
  "success": false,
  "error": "Failed to send verification email."
}
```

### Notes

- In local development, if email delivery is not configured, the verification code may be logged server-side instead of being delivered through an email provider.
- In production, configure your email provider before exposing login to real users.

---

## Verify Login

Verify the email verification code and sign the user in.

```http
POST /api/auth/verify-login
Content-Type: application/json
```

### Request Body

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### Success Response

**Status: `200 OK`**

```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "username": "username",
    "email": "user@example.com",
    "displayName": "Display Name",
    "avatarUrl": null
  },
  "token": "jwt-token-string"
}
```

### Notes

- The login flow also establishes authenticated session state used by the app.
- The token may be used by the client-side auth layer, while HTTP-only cookie/session behavior supports server-rendered flows.

### Error Responses

**Status: `400 Bad Request`**

```json
{
  "success": false,
  "error": "Invalid or expired verification code"
}
```

**Status: `400 Bad Request`**

```json
{
  "success": false,
  "error": "Invalid input"
}
```

**Status: `503 Service Unavailable`**

```json
{
  "success": false,
  "error": "Login database is unavailable."
}
```

---

## Logout

Log the user out and clear the active authentication state.

```http
POST /api/auth/logout
```

### Success Response

**Status: `200 OK`**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Notes

- Client-side integrations should also clear any mirrored local auth token if they store one.
- The pricing page and success page in this template already follow that pattern.

---

## Get Current User

Retrieve the current authenticated user.

```http
GET /api/auth/me
```

### Authenticated Response

**Status: `200 OK`**

```json
{
  "authenticated": true,
  "user": {
    "id": "uuid-string",
    "username": "username",
    "email": "user@example.com",
    "displayName": "Display Name",
    "avatarUrl": null
  }
}
```

### Not Authenticated Response

**Status: `200 OK`**

```json
{
  "authenticated": false
}
```

### Usage

Use this endpoint when you need to:

- check whether the user is logged in
- hydrate app state after a refresh
- gate client-side purchase actions

---

## Sync Auth Cookie

Re-issue the auth cookie from a valid bearer token.

```http
POST /api/auth/sync-cookie
Authorization: Bearer <jwt-token>
```

### Success Response

**Status: `200 OK`**

```json
{
  "success": true
}
```

### Error Response

**Status: `401 Unauthorized`**

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Usage

Use this endpoint when you need to:

- convert a locally stored token back into a cookie-backed session
- restore server-rendered auth behavior after client hydration
- keep same-origin page loads and authenticated API calls aligned

---

## Payment Endpoints

The payment integration is built around creation of hosted checkout links.

The template currently exposes one app-facing payment API route:

- `POST /api/pay/create`

Under the hood, the server talks to the payment backend using environment-based credentials such as `PAY_BASE_URL` and `PAY_API_TOKEN`.

## Create Payment Link

Create a hosted checkout link for the current authenticated user.

```http
POST /api/pay/create
Content-Type: application/json
Authorization: handled by the app's same-origin auth flow
```

### Purpose

This endpoint is intended for custom frontend integrations where you want to:

- create a checkout link from JavaScript
- open checkout in a new tab
- redirect programmatically
- embed the pricing selection flow into another UI

### Authentication

**Required**

If the user is not logged in, the request will fail because the route requires the current authenticated user.

### Request Body

```json
{
  "productId": "prod_123",
  "successUrl": "https://your-domain.com/pay/success",
  "cancelUrl": "https://your-domain.com/pay/cancel",
  "requireBuyerEmail": true,
  "requireBuyerName": false
}
```

### Request Fields

| Field               | Type      | Required | Description                                 |
| ------------------- | --------- | -------- | ------------------------------------------- |
| `productId`         | `string`  | Yes      | The payment platform product ID             |
| `successUrl`        | `string`  | No       | Override success redirect URL               |
| `cancelUrl`         | `string`  | No       | Override cancel redirect URL                |
| `requireBuyerEmail` | `boolean` | No       | Whether checkout should require buyer email |
| `requireBuyerName`  | `boolean` | No       | Whether checkout should require buyer name  |

### Default Behavior

If `successUrl` and `cancelUrl` are omitted:

- success URL defaults to `PAY_SUCCESS_URL` if configured, otherwise `APP_URL/pay/success`
- cancel URL defaults to `PAY_CANCEL_URL` if configured, otherwise `APP_URL/pay/cancel`

The endpoint also maps the authenticated app user into a payment-platform-compatible user ID before generating the checkout link.

### Success Response

**Status: `200 OK`**

```json
{
  "success": true,
  "checkoutUrl": "https://pay.example.com/checkout/abc123",
  "paymentLink": {
    "url": "https://pay.example.com/checkout/abc123",
    "id": "plink_123",
    "active": true,
    "metadata": {
      "userId": "user_abc0000000",
      "productId": "prod_123",
      "createdAt": "2025-01-01T12:00:00.000Z"
    },
    "product": {
      "id": "prod_123",
      "name": "Pro Plan",
      "description": "Monthly subscription"
    },
    "price": {
      "amount": "29.00",
      "currency": "USD",
      "interval": "month"
    }
  }
}
```

### Validation Error Response

**Status: `400 Bad Request`**

```json
{
  "success": false,
  "error": "Invalid request body",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "productId": ["productId is required"]
    }
  }
}
```

### Upstream/Configuration Error Response

**Status: `4xx` / `5xx`**

```json
{
  "success": false,
  "error": "Missing PAY_BASE_URL or PAY_API_TOKEN environment variable."
}
```

Or, if the payment backend returns an error:

```json
{
  "success": false,
  "error": "Payment Hub request failed with status 500"
}
```

Or, if no checkout URL is returned:

```json
{
  "success": false,
  "error": "Payment Hub did not return a checkout url."
}
```

### Notes

- This endpoint is useful for custom AI-generated product UIs.
- The built-in `/pricing` page already calls this API from the browser after login is confirmed.
- If you are building a custom client flow, call this route and then navigate to `checkoutUrl`.

---

## Page-Level Payment Flow

In addition to JSON endpoints, the template includes page routes that form the out-of-the-box payment experience.

### `GET /pricing`

Displays product cards loaded from the payment backend.

Behavior:

- fetches products from the payment service
- highlights the requested `?productId=...` when present
- otherwise features the first returned product
- shows warning banners when payment env variables are missing
- restores auth state from the local token when needed
- lets logged-in users create checkout through `/api/pay/create`
- sends anonymous users to `/login`

### `POST /pricing`

Optional server-side fallback that creates a payment link and redirects immediately to hosted checkout.

The current built-in UI does not submit a form to this route, but the action remains available if you want a no-JavaScript or server-driven checkout variant.

### `GET /pay/success`

Success landing page shown after checkout completes.

This page:

- reads optional query parameters from the payment redirect
- displays values like `id`, `payment_link_id`, `productId`, `session_id`, or `userId` when present
- acts as the place to guide users into post-purchase fulfillment

Typical next steps after success:

- grant access to paid features
- create or update an order record
- activate a subscription
- trigger entitlement provisioning
- verify payment completion via webhook/server-side reconciliation

### `GET /pay/cancel`

Cancellation page shown when the user exits checkout before completion.

This page is useful for:

- returning the buyer to pricing
- prompting them to retry checkout
- explaining that no payment was completed

---

## Error Codes

| Code  | Description                                                                           |
| ----- | ------------------------------------------------------------------------------------- |
| `200` | Success                                                                               |
| `400` | Bad request, validation error, or malformed input                                     |
| `401` | Not authenticated                                                                     |
| `402` | Payment-required semantics may be returned by upstream systems in custom integrations |
| `422` | Request accepted but rejected by business validation in upstream payment systems      |
| `500` | Internal server error                                                                 |
| `502` | Upstream payment integration returned an unusable response                            |

---

## Examples

## Authentication Examples

### cURL: Send Verification Code

```bash
curl -X POST http://localhost:5173/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### cURL: Verify Login

```bash
curl -X POST http://localhost:5173/api/auth/verify-login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"123456"}' \
  -c cookies.txt
```

### cURL: Get Current User

```bash
curl http://localhost:5173/api/auth/me \
  -b cookies.txt
```

### cURL: Logout

```bash
curl -X POST http://localhost:5173/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

### JavaScript: Verify Login

```javascript
const response = await fetch('/api/auth/verify-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    code: '123456',
  }),
});

const data = await response.json();
```

---

## Payment Examples

### cURL: Create Payment Link

Use this pattern when testing from a browser-authenticated environment or another same-origin integration layer.

```bash
curl -X POST http://localhost:5173/api/pay/create \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_SESSION_COOKIE" \
  -d '{
    "productId": "prod_123",
    "requireBuyerEmail": true,
    "requireBuyerName": false
  }'
```

### JavaScript: Create Payment Link and Redirect

```javascript
const response = await fetch('/api/pay/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId: 'prod_123',
    requireBuyerEmail: true,
    requireBuyerName: false,
  }),
});

const data = await response.json();

if (!response.ok || !data.success) {
  throw new Error(data.error || 'Failed to create payment link');
}

window.location.href = data.checkoutUrl;
```

### Remix Form Flow on `/pricing`

The current built-in pricing page uses a client-driven checkout flow:

1. user logs in
2. page restores auth with `/api/auth/me` when needed
3. user clicks **Buy membership**
4. browser posts to `/api/pay/create`
5. client redirects to hosted checkout

The checkout link is still created server-side, but the page no longer depends on a form post or a fixed env-driven product id.

---

## Integration Notes for Template-Based AI Deployment

This repository is intended to be used as a template that an AI deployment platform can transform into a real project implementation.

When generating a new app from this template, keep these API conventions in mind:

### 1. Preserve auth endpoints unless your login model changes

Many generated projects can keep:

- `/api/auth/send-code`
- `/api/auth/verify-login`
- `/api/auth/logout`
- `/api/auth/me`

If the generated product uses the same passwordless login model, these routes can remain stable.

### 2. Reuse `/api/pay/create` for productized checkout

If the generated app sells:

- subscriptions
- credits
- digital goods
- onboarding packages
- one-time services

then `/api/pay/create` can remain the standard purchase entry point while the UI, pricing copy, and fulfillment logic change per project.

### 3. Keep payment fulfillment separate from checkout-link creation

`/api/pay/create` only creates a checkout URL.

Real business fulfillment should happen through additional logic such as:

- webhooks
- order syncing
- entitlement updates
- subscription activation
- admin reconciliation jobs

### 4. Prefer same-origin API calls

Generated frontends should continue using same-origin `/api/*` requests so they benefit from the existing auth conventions.

### 5. Make success/cancel URLs explicit in production

For deployment environments and generated projects, ensure these values are correct:

- `APP_URL`
- `PAY_SUCCESS_URL` or the default `/pay/success`
- `PAY_CANCEL_URL` or the default `/pay/cancel`

This prevents broken redirect flows after checkout.

---

## Summary

The template currently exposes:

### Authentication APIs

- `POST /api/auth/send-code`
- `POST /api/auth/verify-login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/sync-cookie`

### Payment API

- `POST /api/pay/create`

### Payment Pages

- `GET /pricing`
- `GET /pay/success`
- `GET /pay/cancel`

Optional server-side fallback:

- `POST /pricing`

These endpoints provide a strong default foundation for AI-driven template expansion: authentication, payment initiation, and post-checkout routing are already in place, while project-specific business logic can be layered on top.
