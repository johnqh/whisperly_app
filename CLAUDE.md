# CLAUDE.md - whisperly_app

## Project Overview
`@sudobility/whisperly_app` is the main React frontend application for Whisperly, a localization SaaS platform. It provides the user interface for managing translation projects, glossaries, subscriptions, and analytics.

## Platform Support
- **Web App**: Yes
- **React Native**: No (web frontend only)
- **Backend (Node.js/Bun)**: No (frontend only)

This is a web-only application built with Vite and React. Tests use jsdom environment for DOM simulation.

## Tech Stack
- **Runtime**: Bun
- **Build Tool**: Vite 7.x
- **Framework**: React 19.x
- **Routing**: React Router DOM 7.x
- **State**: Zustand (via whisperly_lib) + TanStack Query
- **Styling**: Tailwind CSS 3.x
- **i18n**: i18next with react-i18next
- **Auth**: Firebase
- **UI Components**: @sudobility/components, Radix UI
- **Charts**: Recharts
- **Testing**: Vitest

## Package Manager
**IMPORTANT**: This project uses **Bun**, not npm or yarn.
- Install dependencies: `bun install`
- Run scripts: `bun run <script>`
- Add dependencies: `bun add <package>` or `bun add -d <package>` for dev

## Project Structure
```
src/
├── App.tsx               # Root component with routing
├── main.tsx              # Application entry point
├── i18n.ts               # i18next configuration
├── vite-env.d.ts         # Vite type declarations
├── components/
│   ├── Button.tsx        # Reusable button
│   ├── Layout.tsx        # Main layout wrapper
│   ├── Loading.tsx       # Loading spinner
│   ├── layout/
│   │   ├── TopBar.tsx        # Navigation bar
│   │   ├── DashboardLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── LocalizedLink.tsx
│   │   ├── LanguageValidator.tsx
│   │   └── ...
│   └── providers/
│       └── AuthProviderWrapper.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── Glossaries.tsx
│   ├── Analytics.tsx
│   ├── Subscription.tsx
│   ├── Settings.tsx
│   ├── RateLimits.tsx
│   ├── Members.tsx
│   └── ...
├── context/
│   ├── ApiContext.tsx    # API client context
│   ├── ToastContext.tsx  # Toast notifications
│   ├── ThemeContext.tsx  # Theme provider
│   └── LayoutContext.tsx # Layout state
├── hooks/
│   ├── useApi.ts         # API context hook
│   ├── useToast.ts       # Toast hook
│   ├── useBreadcrumbs.ts # Breadcrumb generation
│   └── useLocalizedNavigate.ts
├── config/
│   ├── firebase.ts       # Firebase initialization
│   ├── auth-config.ts    # Auth configuration
│   ├── constants.ts      # App constants
│   └── entityClient.ts   # Entity client config
├── utils/
│   └── auth.ts           # Firebase error utilities
├── test/
│   └── setup.ts          # Vitest setup
└── styles/
    └── ...               # Global styles
```

## Key Scripts
```bash
bun run dev          # Start Vite dev server
bun run build        # TypeScript check + Vite build
bun run preview      # Preview production build
bun run typecheck    # Run TypeScript type checking
bun run lint         # Run ESLint
bun run test         # Run tests in watch mode
bun run test:run     # Run tests once
```

## Environment Variables
Create `.env.local` with:
```
VITE_API_BASE_URL=https://api.whisperly.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Routing Structure
```
/                           # Home page
/login                      # Login page
/settings                   # Global settings
/pricing                    # Pricing page
/docs                       # Documentation
/dashboard                  # Dashboard redirect
/dashboard/:entitySlug      # Entity dashboard
  /projects                 # Projects list
  /projects/:projectId      # Project detail
  /glossaries               # Glossaries
  /analytics                # Analytics
  /subscription             # Subscription
  /rate-limits              # Rate limits
  /settings                 # Entity settings
  /members                  # Team members
```

## Development Guidelines

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add translations in `public/locales/`
4. Update navigation if needed

### Protected Routes
Use `ProtectedRoute` for authenticated pages:
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="dashboard" element={<Dashboard />} />
</Route>
```

### Using API Context
```tsx
import { useApi } from '../hooks/useApi';

function MyComponent() {
  const { client, isAuthenticated } = useApi();

  // Use client for API calls
  const projects = await client.getProjects();
}
```

### Using Managers (from whisperly_lib)
Managers follow entity-centric patterns and require scope parameters:

**Entity-scoped managers** (projects, analytics, glossaries):
```tsx
import { useProjectManager, useAnalyticsManager } from '@sudobility/whisperly_lib';
import { useWhisperly } from '../contexts/WhisperlyContext';
import { useEntity } from '../contexts/EntityContext';

function Projects() {
  const client = useWhisperly();
  const { currentEntity } = useEntity();
  const entitySlug = currentEntity?.entitySlug ?? '';

  const { projects, isLoading, createProject } = useProjectManager(client, entitySlug);
  const { aggregate, byProject } = useAnalyticsManager(client, entitySlug, options);
}
```

**User-scoped managers** (settings, subscription):
```tsx
import { useSettingsManager, useSubscriptionManager } from '@sudobility/whisperly_lib';
import { useWhisperly } from '../contexts/WhisperlyContext';
import { useAuth } from '../contexts/AuthContext';

function Settings() {
  const client = useWhisperly();
  const { user } = useAuth();
  const userId = user?.uid ?? '';

  const { settings, updateSettings } = useSettingsManager(client, userId);
  const { subscription, tier } = useSubscriptionManager(client, userId);
}
```

### Toast Notifications
```tsx
import { useToast } from '../hooks/useToast';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({ type: 'success', message: 'Saved!' });
  };
}
```

### i18n / Translations
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  return <h1>{t('nav.dashboard')}</h1>;
}
```

Translation files are in `public/locales/{lang}/{namespace}.json`.

### Styling
Use Tailwind CSS classes:
```tsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <Button className="btn-primary">Save</Button>
</div>
```

## Component Libraries
- `@sudobility/components` - Shared UI components
- `@sudobility/building_blocks` - Layout components
- `@sudobility/auth-components` - Auth UI
- `@radix-ui/*` - Accessible primitives

## Dependencies
- `@sudobility/whisperly_client` - API client
- `@sudobility/whisperly_lib` - Business logic
- `@sudobility/whisperly_types` - Shared types
- Plus various @sudobility UI packages

## Build Output
Production build outputs to `dist/` directory.
