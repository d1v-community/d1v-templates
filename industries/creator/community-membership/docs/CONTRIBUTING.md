# Contributing Guide

Thank you for your interest in contributing to the Remix + Neon Email Authentication Template!

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Documentation](#documentation)

---

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive
- **Be constructive** in feedback
- **Be collaborative** and help others
- **Focus on the community** and what's best for the project

---

## How to Contribute

There are many ways to contribute:

### 🐛 Report Bugs
- Check if the bug has already been reported
- Use the bug report template
- Include steps to reproduce
- Provide expected vs actual behavior

### 💡 Suggest Features
- Check existing issues first
- Describe the use case
- Explain how it benefits users
- Consider implementation complexity

### 🔧 Submit Pull Requests
- Fix bugs
- Add features
- Improve documentation
- Refactor code
- Add tests

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm, pnpm, or yarn
- Git

### Clone & Install

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/remix-neon-auth.git
cd remix-neon-auth

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# DATABASE_URL=your_neon_url
# JWT_SECRET=your_secret
```

### Database Setup

```bash
# Run migrations
npm run db:migrate

# (Optional) Seed demo data
npm run db:seed
```

### Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173

---

## Coding Standards

### TypeScript

- **Use strict mode** - Enabled in tsconfig.json
- **Define types** - For all functions, variables, and components
- **Use interfaces** - For object shapes
- **Avoid `any`** - Use `unknown` when type is unknown

**Good**:
```typescript
interface User {
  id: string;
  email: string;
  username: string;
}

function getUser(id: string): Promise<User> {
  return db.select().from(users).where(eq(users.id, id));
}
```

**Bad**:
```typescript
function getUser(id: string): any {
  return db.select().from(users).where(eq(users.id, id));
}
```

---

### Code Formatting

We use **Prettier** and **ESLint** for consistent formatting.

**Format your code**:
```bash
# Check formatting
npm run format

# Fix formatting automatically
npm run format:fix

# Lint code
npm run lint

# Fix linting errors
npm run lint:fix
```

**VS Code Users**:
Install recommended extensions:
- ESLint
- Prettier
- TypeScript Importer

Enable format on save:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

### Naming Conventions

- **Files**: kebab-case
  - `email-verification.server.ts`
  - `login-page.tsx`

- **Components**: PascalCase
  - `LoginPage.tsx`

- **Variables & Functions**: camelCase
  - `getUserByEmail`
  - `verificationCode`

- **Constants**: UPPER_SNAKE_CASE
  - `MAX_LOGIN_ATTEMPTS`
  - `TOKEN_EXPIRY`

- **Database Tables**: snake_case
  - `verification_codes`
  - `user_sessions`

---

### Import Organization

**Order imports**:
1. Built-in/node modules
2. Third-party packages
3. Local imports (~/...)

**Example**:
```typescript
import { useState } from "react";           // Third-party
import { json } from "@remix-run/node";     // Third-party
import { z } from "zod";                    // Third-party
import { db } from "~/db/db.server";        // Local
import { users } from "~/db/schema";        // Local
import { requireUser } from "~/utils/auth"; // Local
```

---

### Code Comments

**Use JSDoc** for functions:

```typescript
/**
 * Generates a 6-digit verification code
 *
 * @param email - User's email address
 * @returns The generated verification code
 * @throws If code generation fails
 */
export async function generateVerificationCode(
  email: string
): Promise<string> {
  // Implementation
}
```

**Use inline comments** for complex logic:

```typescript
// Split SQL into individual statements to handle multiple commands
const statements = sql.split(";");

// Execute each statement (Neon doesn't support multi-command queries)
for (const stmt of statements) {
  await neonClient.query(stmt);
}
```

---

### Error Handling

**Use try-catch** for async operations:

```typescript
export async function verifyCode(email: string, code: string) {
  try {
    const result = await db.select()...;
    return result.length > 0;
  } catch (error) {
    console.error("Verification failed:", error);
    throw new Error("Verification failed");
  }
}
```

**Return proper HTTP status codes**:

```typescript
export async function action({ request }: ActionFunctionArgs) {
  try {
    // Process request
    return json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return json({ error: "Invalid input" }, { status: 400 });
    }
    return json({ error: "Server error" }, { status: 500 });
  }
}
```

---

## File Structure

Follow the established structure:

```
app/
├── db/              # Database connection & schema
├── routes/          # File-based routes
├── services/        # Business logic
├── utils/           # Helper functions
└── tailwind.css     # Styles
```

**When adding new features**:
- Create service module for business logic
- Add utilities for reusable functions
- Follow route naming conventions
- Keep components in route files (for this template)

---

## Testing

Currently, the template doesn't include tests, but we recommend adding them for production use.

**Recommended testing setup**:

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Example test**:

```typescript
// tests/verification.test.ts
import { describe, it, expect } from "vitest";
import { generateVerificationCode } from "~/services/verification.server";

describe("generateVerificationCode", () => {
  it("should generate a 6-digit code", async () => {
    const code = await generateVerificationCode("test@example.com");
    expect(code).toMatch(/^\d{6}$/);
  });
});
```

**Run tests**:
```bash
npm test
```

---

## Submitting Changes

### Commit Messages

Use **conventional commits**:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add password reset functionality
fix: resolve database connection timeout issue
docs: update API documentation for /login route
style: format code with prettier
refactor: simplify verification logic
```

**Good commit messages**:
```
feat(email): add custom email template support
fix(auth): prevent JWT token expiration issue
docs: add deployment guide for Vercel
```

**Bad commit messages**:
```
update
fix stuff
wip
asdf
```

---

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make changes**
   - Follow coding standards
   - Write/update documentation
   - Test your changes

3. **Run checks**
   ```bash
   npm run typecheck
   npm run lint
   npm run format
   npm run build
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Use the PR template
   - Describe what and why
   - Include screenshots (if UI changes)
   - Link related issues

7. **Respond to feedback**
   - Make requested changes
   - Re-run checks
   - Update PR if needed

---

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Manual testing
- [ ] Unit tests
- [ ] Integration tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console errors

## Screenshots (if applicable)
```

---

## Documentation

### When to Update Documentation

- ✅ Adding new features
- ✅ Changing existing functionality
- ✅ Fixing bugs that affect users
- ✅ Updating configuration
- ✅ Adding new environment variables

### Where to Document

- **README.md** - Main project documentation
- **docs/** - Detailed guides
- **Code comments** - Complex logic
- **JSDoc** - Function signatures

### Documentation Standards

- Use clear, concise language
- Provide examples
- Include screenshots for UI changes
- Keep documentation up-to-date

---

## Release Process

For maintainers:

1. **Update version**
   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [1.0.0] - 2024-11-03

   ### Added
   - Initial release
   - Email verification login
   - JWT authentication
   ```

3. **Create GitHub release**
   - Tag version
   - Describe changes
   - Link to CHANGELOG

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

---

## Questions?

- 📚 Check [FAQ.md](FAQ.md)
- 💬 Open a [Discussion](https://github.com/YOUR_USERNAME/remix-neon-auth/discussions)
- 🐛 Report a [Bug](https://github.com/YOUR_USERNAME/remix-neon-auth/issues)
- 💡 Suggest a [Feature](https://github.com/YOUR_USERNAME/remix-neon-auth/issues)

---

## Thank You!

Your contributions make this project better for everyone. Whether it's code, documentation, or bug reports, all contributions are valued!

**Happy coding!** 🚀

---

**Last Updated**: November 2024
