## D1V Taro Remix Flutter Auth Template

Minimal reusable foundation for:

- Remix web app and auth API
- Taro client for H5 and mini-program builds
- Flutter client

### Included

- Email verification code login
- Shared `/api/auth/*` endpoints
- Neon + Drizzle schema limited to `users` and `verification_codes`
- Taro login/home flow
- Flutter login/home flow

### Local setup

1. Copy `.env.example` to `.env`
2. You can reuse values from `../remix-neon-auth-pay/.env`
3. Install dependencies:

```bash
pnpm install
pnpm flutter:pub:get
```

4. Run database setup:

```bash
pnpm db:migrate
pnpm db:seed
```

5. Start Remix:

```bash
pnpm dev
```

6. Start Taro:

```bash
pnpm dev:app:h5
pnpm dev:app:weapp
```

7. Start Flutter:

```bash
cd apps/flutter_app
flutter run --dart-define=API_BASE_URL=http://localhost:5173
```

### Shared auth endpoints

- `POST /api/auth/send-code`
- `POST /api/auth/verify-login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
