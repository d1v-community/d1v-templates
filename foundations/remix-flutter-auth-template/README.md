## D1V Remix Flutter Auth Template

Minimal reusable foundation for:

- Remix web app and auth API
- Flutter mobile client
- Flutter Web embedded under the same domain as Remix

### Included

- Email verification code login
- Shared `/api/auth/*` endpoints
- Flutter native and Flutter Web using the same Remix backend
- Neon + Drizzle schema limited to `users` and `verification_codes`
- Vercel deployment config that serves Remix from `/` and Flutter Web from `/app`

### Architecture

- Remix serves landing pages and `/api/auth/*`
- Flutter Web is built to static assets and deployed under `/app`
- Flutter mobile uses `--dart-define=API_BASE_URL=...` to hit the same backend

### Local setup

1. Copy `.env.example` to `.env`
2. You can reuse values from `../remix-neon-auth-pay/.env`
3. Install dependencies:

```bash
pnpm install
pnpm flutter:pub:get
```

4. Prepare database:

```bash
pnpm db:migrate
pnpm db:seed
```

5. Run Remix locally:

```bash
pnpm dev
```

6. Run Flutter app locally:

```bash
cd apps/flutter_app
flutter run --dart-define=API_BASE_URL=http://localhost:5173
```

7. Build Flutter Web for embedding:

```bash
pnpm build:flutter:web
```

### Shared auth endpoints

- `POST /api/auth/send-code`
- `POST /api/auth/verify-login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
