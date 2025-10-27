

I'll analyze the codebase structure and provide you with a comprehensive overview.

Action: Creating 5 new todos











Exploring the root directory to understand the project structure.

Action: Listing directory /workspaces/PLAN

Action: Reading file /workspaces/PLAN/package.json

Action: Reading file /workspaces/PLAN/README.md

Action: Reading file /workspaces/PLAN/vite.config.ts

Action: Advancing to next todo item





Analyzing the tech stack from configuration files.

Action: Reading file /workspaces/PLAN/tsconfig.json

Action: Reading file /workspaces/PLAN/tailwind.config.ts

Action: Reading file /workspaces/PLAN/index.html

Action: Advancing to next todo item





Examining the main directories to understand the project organization.

Action: Listing directory /workspaces/PLAN/src

Action: Listing directory /workspaces/PLAN/convex

Action: Listing directory /workspaces/PLAN/docs

Action: Listing directory /workspaces/PLAN/src/routes

Action: Listing directory /workspaces/PLAN/src/ui

Action: Listing directory /workspaces/PLAN/public

Action: Advancing to next todo item





Identifying entry points and key components.

Action: Reading file /workspaces/PLAN/src/main.tsx

Action: Reading file /workspaces/PLAN/src/app.tsx

Action: Reading file /workspaces/PLAN/src/router.tsx

Action: Reading file /workspaces/PLAN/convex/schema.ts

Action: Reading file /workspaces/PLAN/convex/auth.config.ts

Action: Reading file /workspaces/PLAN/src/routes/__root.tsx

Action: Listing directory /workspaces/PLAN/src/routes/_app

Action: Reading file /workspaces/PLAN/types.ts

Action: Reading file /workspaces/PLAN/site.config.ts

Action: Advancing to next todo item





Documenting critical patterns and conventions.

Action: Reading file /workspaces/PLAN/convex/http.ts

Action: Reading file /workspaces/PLAN/convex/stripe.ts

Action: Listing directory /workspaces/PLAN/src/utils

Action: Reading file /workspaces/PLAN/NANOBRAIN-v2.md

Action: Reading file /workspaces/PLAN/docs/HYPERGRAPHIQL.md

Action: Advancing to next todo item



## Codebase Analysis: PLAN (Convex SaaS + AGI-OS Documentation)

### Overview
This is a **dual-purpose repository** combining:
1. A production-ready **SaaS application template** built with Convex
2. Comprehensive **AGI-OS documentation** for the cogpy organization's neuromorphic operating system initiative

---

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **TanStack Router** - File-based routing with type safety
- **TanStack Query** - Server state management
- **TailwindCSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **i18next** - Internationalization

### Backend
- **Convex** - Reactive, type-safe backend platform
  - Real-time database
  - Authentication (@convex-dev/auth)
  - File storage
  - HTTP endpoints
  - Scheduled functions

### Integrations
- **Stripe** - Payment processing and subscriptions
- **Resend** - Transactional emails
- **React Email** - Email templates

---

## Directory Structure

```
/workspaces/PLAN/
├── src/                      # Frontend application code
│   ├── main.tsx             # Entry point
│   ├── app.tsx              # App wrapper with providers
│   ├── router.tsx           # Router configuration
│   ├── routes/              # File-based routes
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Landing page
│   │   ├── hypergraph.tsx   # HyperGraphiQL visualization
│   │   └── _app/            # Protected app routes
│   ├── ui/                  # Reusable UI components
│   └── utils/               # Utility functions
│
├── convex/                   # Backend code (Convex)
│   ├── schema.ts            # Database schema
│   ├── auth.ts              # Authentication logic
│   ├── auth.config.ts       # Auth configuration
│   ├── stripe.ts            # Stripe integration
│   ├── http.ts              # HTTP endpoints (webhooks)
│   ├── init.ts              # Database initialization
│   └── email/               # Email templates
│
├── docs/                     # Documentation
│   ├── HYPERGRAPHIQL.md     # HyperGraphiQL system docs
│   └── agi-os/              # AGI-OS architecture docs
│
├── public/                   # Static assets
│   ├── images/
│   └── locales/             # i18n translations
│
├── types.ts                  # Shared TypeScript types
├── site.config.ts           # Site configuration
└── index.html               # HTML entry point
```

---

## Key Entry Points

### Frontend
1. **`index.html`** → **`src/main.tsx`** → **`src/app.tsx`**
   - Sets up React root with providers:
     - `ConvexAuthProvider` - Authentication
     - `QueryClientProvider` - React Query
     - `HelmetProvider` - Meta tags
     - `RouterProvider` - Routing

2. **`src/router.tsx`**
   - Creates TanStack Router instance
   - Auto-generated route tree from `src/routes/`

3. **`src/routes/__root.tsx`**
   - Root layout component
   - Dynamic page titles via Helmet
   - TanStack Router DevTools (dev only)

### Backend (Convex)
1. **`convex/schema.ts`**
   - Database schema definition
   - Tables: `users`, `plans`, `subscriptions`
   - Auth tables from `@convex-dev/auth`

2. **`convex/http.ts`**
   - HTTP router for webhooks
   - Stripe webhook handlers
   - Auth routes

3. **`convex/init.ts`**
   - Database initialization
   - Seed data for plans

---

## Critical Patterns & Conventions

### 1. **Path Aliases**
```typescript
"@"   → "./src"
"@cvx" → "./convex"
"~"   → root directory
```

### 2. **Convex Functions**
- **Queries**: Read-only, reactive
- **Mutations**: Write operations
- **Actions**: External API calls (Stripe, Resend)
- **Internal functions**: Prefixed with `PREAUTH_` or `UNAUTH_`
  - Used for scheduled functions without authenticated user context
  - Must be internal-only for security

### 3. **Authentication Flow**
- Email OTP (One-Time Password)
- Social logins (configurable)
- Session management via Convex Auth
- User data stored in `users` table

### 4. **Subscription Management**
- Free and Pro plans defined in schema
- Stripe integration for payments
- Webhook handlers for subscription lifecycle
- Customer portal for self-service

### 5. **Routing Convention**
- File-based routing with TanStack Router
- `_app/` prefix for protected routes
- `_auth/` for authentication routes
- Auto-generated route tree in `routeTree.gen.ts`

### 6. **Styling**
- TailwindCSS with custom theme
- CSS variables for theming (light/dark mode)
- Radix UI for accessible components
- `class-variance-authority` for component variants

### 7. **Type Safety**
- Convex generates types from schema
- TanStack Router generates route types
- Zod for runtime validation
- Shared types in `types.ts`

---

## Special Features

### HyperGraphiQL System
- Interactive repository visualization at `/hypergraph`
- Fetches cogpy organization repos from GitHub API
- Graph and list views
- Language-based clustering
- Requires `GITHUB_TOKEN` for private repos (optional)

### AGI-OS Documentation
- Comprehensive docs in `docs/agi-os/`
- Maps ~120 repositories into unified architecture
- Neuromorphic OS kernel documentation
- ReZoKeRNN implementation roadmap in `NANOBRAIN-v2.md`

---

## Development Workflow

### Start Development
```bash
npm run dev
# Runs both frontend (Vite) and backend (Convex) concurrently
```

### Build for Production
```bash
npm run build
# TypeScript compilation + Vite build
```

### Type Checking
```bash
npm run typecheck
# Checks app, node, and convex TypeScript
```

### Linting
```bash
npm run lint
# ESLint with TypeScript support
```

---

## Environment Variables

Required for full functionality:
- `VITE_CONVEX_URL` - Convex deployment URL
- `CONVEX_SITE_URL` - Site URL for auth
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `GITHUB_TOKEN` - (Optional) For HyperGraphiQL private repos

---

## Important Notes for Developers

1. **Convex-First Architecture**: Backend logic lives in `convex/`, not traditional API routes
2. **Real-time by Default**: All queries are reactive and update automatically
3. **Type Generation**: Run `convex dev` to generate types from schema
4. **File-based Routing**: Add files to `src/routes/` to create new routes
5. **Dual Purpose**: This is both a SaaS template AND AGI-OS documentation hub
6. **Deployment**: Configured for Netlify (see `netlify.toml`)
