# Whisperly - Localization SaaS Platform

## Overview

Whisperly is a localization/translation SaaS that allows clients to:
- Sign up and subscribe to the service (with rate limiting)
- Set up projects with domain-specific instructions and glossaries
- Get translation endpoints for their applications

## Architecture

```
whisperly/
├── whisperly_types/     # Shared TypeScript types (FE/BE)
├── whisperly_api/       # Bun backend API
├── whisperly_client/    # FE client library
├── whisperly_lib/       # FE business logic library
└── whisperly_app/       # FE web application
```

**Dependency Flow:**
```
whisperly_types ─┬─> whisperly_api
                 ├─> whisperly_client ─> whisperly_lib ─> whisperly_app
                 └─────────────────────────────────────────> whisperly_app
```

---

## Project 1: whisperly_types

**Template:** ~/shapeshyft/shapeshyft_types

### Structure
```
whisperly_types/
├── src/
│   └── index.ts           # All type definitions
├── dist/                  # Dual format output (ESM + CJS)
├── .github/workflows/ci-cd.yml
├── .vscode/
├── package.json
├── tsconfig.json
├── tsconfig.esm.json
├── tsconfig.cjs.json
├── eslint.config.mjs
├── .prettierrc
└── .gitignore
```

### Types to Define

```typescript
// Re-exports from @sudobility/types
export { BaseResponse, NetworkClient, Optional } from '@sudobility/types';

// Enums
export type HttpMethod = 'GET' | 'POST';

// Entity Types
export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: Optional<string>;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  organization_name: string;
  organization_path: string;  // URL-safe unique path
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  project_name: string;       // URL-safe identifier
  display_name: string;
  description: Optional<string>;
  instructions: Optional<string>;  // Domain-specific translation instructions
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Glossary {
  id: string;
  project_id: string;
  term: string;               // Source term
  translations: Record<string, string>;  // { "en": "Hello", "ja": "こんにちは" }
  context: Optional<string>;  // Usage context
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id: string;
  user_id: string;
  project_id: string;
  timestamp: string;
  request_count: number;
  string_count: number;
  character_count: number;
  success: boolean;
  error_message: Optional<string>;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  revenuecat_entitlement: string;  // RevenueCat entitlement ID
  monthly_request_limit: number;
  hourly_request_limit: number;
  requests_this_month: number;
  requests_this_hour: number;
  month_reset_at: string;
  hour_reset_at: string;
  created_at: string;
  updated_at: string;
}

// RevenueCat entitlements: "whisperly_starter", "whisperly_pro", "whisperly_enterprise"
export type SubscriptionTier = 'starter' | 'pro' | 'enterprise';

// Request Types
export interface ProjectCreateRequest {
  project_name: string;
  display_name: string;
  description?: string;
  instructions?: string;
}

export interface ProjectUpdateRequest {
  display_name?: string;
  description?: string;
  instructions?: string;
  is_active?: boolean;
}

export interface GlossaryCreateRequest {
  term: string;
  translations: Record<string, string>;
  context?: string;
}

export interface GlossaryUpdateRequest {
  translations?: Record<string, string>;
  context?: string;
}

export interface UserSettingsUpdateRequest {
  organization_name?: string;
  organization_path?: string;
}

// Translation API Types
export interface TranslationRequest {
  strings: string[];
  target_languages: string[];  // e.g., ["en", "ja", "zh"]
  source_language?: string;    // Optional, defaults to auto-detect
}

export interface TranslationResponse {
  translations: Record<string, string[]>;  // { "en": [...], "ja": [...] }
  glossaries_used: string[];
  request_id: string;
}

// Glossary Callback Types (GET endpoint)
// Returns ALL requested languages, with null for missing translations
export interface GlossaryLookupResponse {
  glossary: string;
  translations: Record<string, string | null>;  // { "en": "Hello", "ja": "こんにちは", "fr": null }
}

// Analytics Types
export interface UsageAggregate {
  total_requests: number;
  total_strings: number;
  total_characters: number;
  success_rate: number;
  period_start: string;
  period_end: string;
}

export interface UsageByProject {
  project_id: string;
  project_name: string;
  request_count: number;
  string_count: number;
  character_count: number;
}

export interface AnalyticsResponse {
  aggregate: UsageAggregate;
  by_project: UsageByProject[];
}

// Rate Limit Types
export interface RateLimitStatus {
  monthly_limit: number;
  monthly_used: number;
  monthly_remaining: number;
  hourly_limit: number;
  hourly_used: number;
  hourly_remaining: number;
  resets_at: {
    monthly: string;
    hourly: string;
  };
}

// Response Helpers
export function successResponse<T>(data: T): BaseResponse<T>;
export function errorResponse(message: string): BaseResponse<never>;
```

### package.json
```json
{
  "name": "@sudobility/whisperly_types",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "peerDependencies": {
    "@sudobility/types": "^1.9.36"
  }
}
```

---

## Project 2: whisperly_api

**Template:** ~/shapeshyft/shapeshyft_api

### Structure
```
whisperly_api/
├── src/
│   ├── index.ts                    # Hono app entry point
│   ├── db/
│   │   ├── index.ts               # Database connection
│   │   └── schema.ts              # Drizzle schema
│   ├── routes/
│   │   ├── index.ts               # Route aggregation
│   │   ├── projects.ts            # Project CRUD
│   │   ├── glossaries.ts          # Glossary CRUD
│   │   ├── settings.ts            # User settings
│   │   ├── analytics.ts           # Usage analytics
│   │   ├── subscription.ts        # Subscription status
│   │   └── translate.ts           # Translation endpoints (public)
│   ├── middleware/
│   │   ├── firebaseAuth.ts        # Firebase token verification
│   │   └── rateLimit.ts           # Rate limiting middleware
│   ├── services/
│   │   ├── firebase.ts            # Firebase Admin SDK
│   │   └── translation.ts         # Translation service integration
│   ├── schemas/
│   │   └── index.ts               # Zod validation schemas
│   └── lib/
│       └── env-helper.ts          # Environment variable management
├── .github/workflows/ci-cd.yml
├── .vscode/
├── Dockerfile
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── bunfig.toml
└── .gitignore
```

### Database Schema (PostgreSQL + Drizzle)

```typescript
// Schema: whisperly

// users table
users: {
  id: uuid (PK)
  firebase_uid: varchar (UNIQUE)
  email: varchar
  display_name: varchar (nullable)
  created_at: timestamp
  updated_at: timestamp
}

// user_settings table
user_settings: {
  id: uuid (PK)
  user_id: uuid (FK -> users, UNIQUE)
  organization_name: varchar
  organization_path: varchar (UNIQUE)
  created_at: timestamp
  updated_at: timestamp
}

// projects table
projects: {
  id: uuid (PK)
  user_id: uuid (FK -> users)
  project_name: varchar
  display_name: varchar
  description: text (nullable)
  instructions: text (nullable)
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
  UNIQUE(user_id, project_name)
}

// glossaries table
glossaries: {
  id: uuid (PK)
  project_id: uuid (FK -> projects)
  term: varchar
  translations: jsonb  // Record<string, string>
  context: text (nullable)
  created_at: timestamp
  updated_at: timestamp
  UNIQUE(project_id, term)
}

// subscriptions table
subscriptions: {
  id: uuid (PK)
  user_id: uuid (FK -> users, UNIQUE)
  tier: varchar  // starter, pro, enterprise
  revenuecat_entitlement: varchar  // "whisperly_starter", "whisperly_pro", "whisperly_enterprise"
  monthly_request_limit: integer
  hourly_request_limit: integer
  requests_this_month: integer
  requests_this_hour: integer
  month_reset_at: timestamp
  hour_reset_at: timestamp
  created_at: timestamp
  updated_at: timestamp
}

// usage_records table
usage_records: {
  id: uuid (PK)
  user_id: uuid (FK -> users)
  project_id: uuid (FK -> projects)
  timestamp: timestamp
  request_count: integer
  string_count: integer
  character_count: integer
  success: boolean
  error_message: text (nullable)
  INDEX(user_id, timestamp DESC)
  INDEX(project_id, timestamp DESC)
}
```

### API Routes

```
# Health check
GET  /                                           # Returns version & status

# Protected routes (Firebase auth required)
GET  /api/v1/users/:userId/projects              # List projects
POST /api/v1/users/:userId/projects              # Create project
GET  /api/v1/users/:userId/projects/:projectId   # Get project
PUT  /api/v1/users/:userId/projects/:projectId   # Update project
DELETE /api/v1/users/:userId/projects/:projectId # Delete project

GET  /api/v1/users/:userId/projects/:projectId/glossaries        # List glossaries
POST /api/v1/users/:userId/projects/:projectId/glossaries        # Create glossary
GET  /api/v1/users/:userId/projects/:projectId/glossaries/:id    # Get glossary
PUT  /api/v1/users/:userId/projects/:projectId/glossaries/:id    # Update glossary
DELETE /api/v1/users/:userId/projects/:projectId/glossaries/:id  # Delete glossary

GET  /api/v1/users/:userId/settings              # Get settings
PUT  /api/v1/users/:userId/settings              # Update settings

GET  /api/v1/users/:userId/analytics             # Get usage analytics
GET  /api/v1/users/:userId/subscription          # Get subscription status
GET  /api/v1/users/:userId/rate-limit            # Get rate limit status

# Public translation endpoints (rate-limited by org/project)
POST /api/v1/translate/:orgPath/:projectName     # Translate strings

# Glossary callback endpoint (called by translation service)
GET  /api/v1/glossary/:orgPath/:projectName      # ?glossary={term}&languages=en,ja
```

### Translation Service Integration

```typescript
// src/services/translation.ts

interface TranslationServicePayload {
  target_languages: string[];
  strings: string[];
  glossaries: string[];  // List of glossary terms found in strings
  glossary_callback_url: string;  // Our callback endpoint URL
}

interface TranslationServiceResponse {
  translations: Record<string, string[]>;  // { "en": [...], "ja": [...] }
}

// Environment variable: TRANSLATION_SERVICE_URL
async function translateStrings(
  payload: TranslationServicePayload
): Promise<TranslationServiceResponse> {
  const response = await fetch(process.env.TRANSLATION_SERVICE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}
```

### Rate Limiting Middleware

```typescript
// src/middleware/rateLimit.ts

// Check both monthly and hourly limits
// Update counters in database
// Return 429 if limits exceeded
// Reset counters when period expires
```

### package.json
```json
{
  "name": "whisperly_api",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "hono": "^4.10.7",
    "drizzle-orm": "^0.45.0",
    "postgres": "^3.4.7",
    "firebase-admin": "^13.6.0",
    "zod": "^3.24.0",
    "@hono/zod-validator": "^0.7.5",
    "@sudobility/whisperly_types": "^1.0.0",
    "@sudobility/types": "^1.9.36"
  }
}
```

---

## Project 3: whisperly_client

**Template:** ~/shapeshyft/shapeshyft_client

### Structure
```
whisperly_client/
├── src/
│   ├── index.ts                    # Main exports
│   ├── types.ts                    # Local types (FirebaseIdToken, QUERY_KEYS)
│   ├── network/
│   │   ├── index.ts
│   │   └── WhisperlyClient.ts      # API client class
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useProjects.ts          # Project CRUD hooks
│   │   ├── useGlossaries.ts        # Glossary CRUD hooks
│   │   ├── useSettings.ts          # Settings hooks
│   │   ├── useAnalytics.ts         # Analytics hooks
│   │   ├── useSubscription.ts      # Subscription hooks
│   │   └── useTranslate.ts         # Translation hooks (public)
│   └── utils/
│       ├── index.ts
│       └── whisperly-helpers.ts    # URL, header, error helpers
├── dist/
├── .github/workflows/ci-cd.yml
├── .vscode/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.js
├── .prettierrc
├── vitest.config.ts
└── .gitignore
```

### WhisperlyClient Class

```typescript
// All methods following shapeshyft_client pattern:
// - URL encoding for path params
// - createAuthHeaders(token) for protected routes
// - handleApiError() for error handling
// - BaseResponse<T> return types

class WhisperlyClient {
  constructor(config: { baseUrl: string; networkClient: NetworkClient });

  // Projects
  getProjects(userId, token): Promise<BaseResponse<Project[]>>;
  getProject(userId, projectId, token): Promise<BaseResponse<Project>>;
  createProject(userId, data, token): Promise<BaseResponse<Project>>;
  updateProject(userId, projectId, data, token): Promise<BaseResponse<Project>>;
  deleteProject(userId, projectId, token): Promise<BaseResponse<Project>>;

  // Glossaries
  getGlossaries(userId, projectId, token): Promise<BaseResponse<Glossary[]>>;
  getGlossary(userId, projectId, glossaryId, token): Promise<BaseResponse<Glossary>>;
  createGlossary(userId, projectId, data, token): Promise<BaseResponse<Glossary>>;
  updateGlossary(userId, projectId, glossaryId, data, token): Promise<BaseResponse<Glossary>>;
  deleteGlossary(userId, projectId, glossaryId, token): Promise<BaseResponse<Glossary>>;

  // Settings
  getSettings(userId, token): Promise<BaseResponse<UserSettings>>;
  updateSettings(userId, data, token): Promise<BaseResponse<UserSettings>>;

  // Analytics
  getAnalytics(userId, token, params?): Promise<BaseResponse<AnalyticsResponse>>;

  // Subscription
  getSubscription(userId, token): Promise<BaseResponse<Subscription>>;
  getRateLimitStatus(userId, token): Promise<BaseResponse<RateLimitStatus>>;

  // Translation (public, no auth)
  translate(orgPath, projectName, request): Promise<BaseResponse<TranslationResponse>>;
}
```

### package.json
```json
{
  "name": "@sudobility/whisperly_client",
  "version": "1.0.0",
  "type": "module",
  "peerDependencies": {
    "@sudobility/whisperly_types": "^1.0.0",
    "@sudobility/types": "^1.9.36",
    "@tanstack/react-query": ">=5.0.0",
    "react": ">=18.0.0"
  }
}
```

---

## Project 4: whisperly_lib

**Template:** ~/shapeshyft/shapeshyft_lib

### Structure
```
whisperly_lib/
├── src/
│   ├── index.ts
│   ├── business/
│   │   ├── index.ts
│   │   ├── hooks/
│   │   │   ├── index.ts
│   │   │   ├── useProjectsManager.ts
│   │   │   ├── useGlossariesManager.ts
│   │   │   ├── useSettingsManager.ts
│   │   │   ├── useAnalyticsManager.ts
│   │   │   ├── useSubscriptionManager.ts
│   │   │   └── useTranslationTester.ts   # Test translations
│   │   ├── stores/
│   │   │   ├── index.ts
│   │   │   ├── projectsStore.ts
│   │   │   ├── glossariesStore.ts
│   │   │   ├── settingsStore.ts
│   │   │   ├── analyticsStore.ts
│   │   │   └── subscriptionStore.ts
│   │   └── templates/
│   │       ├── index.ts
│   │       └── project-templates.ts      # Pre-built project templates
├── dist/
├── .github/workflows/ci-cd.yml
├── .vscode/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.js
├── .prettierrc
├── vitest.config.ts
└── .gitignore
```

### Project Templates

```typescript
// Pre-built templates for common use cases
export const projectTemplates = {
  mobileApp: {
    display_name: 'Mobile App',
    description: 'UI strings for mobile applications',
    instructions: 'Keep translations concise. Preserve placeholders like {name}.',
  },
  webApp: {
    display_name: 'Web Application',
    description: 'UI strings for web applications',
    instructions: 'Maintain HTML entities. Preserve variables like {{count}}.',
  },
  documentation: {
    display_name: 'Documentation',
    description: 'Technical documentation and help content',
    instructions: 'Keep technical terms untranslated. Preserve code blocks.',
  },
  marketing: {
    display_name: 'Marketing Content',
    description: 'Marketing copy and promotional content',
    instructions: 'Adapt tone for target culture. May localize idioms.',
  },
  legal: {
    display_name: 'Legal Documents',
    description: 'Legal and compliance content',
    instructions: 'Precise translation required. Do not paraphrase.',
  },
};
```

### package.json
```json
{
  "name": "@sudobility/whisperly_lib",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "zustand": "^5.0.8"
  },
  "peerDependencies": {
    "@sudobility/whisperly_client": "^1.0.0",
    "@sudobility/whisperly_types": "^1.0.0",
    "@sudobility/types": "^1.9.36",
    "@tanstack/react-query": ">=5.0.0",
    "react": ">=18.0.0"
  }
}
```

---

## Project 5: whisperly_app

**Template:** ~/shapeshyft/shapeshyft_app

### Structure
```
whisperly_app/
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── DocsPage.tsx
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx
│   │       ├── ProjectsPage.tsx
│   │       ├── ProjectNewPage.tsx
│   │       ├── ProjectDetailPage.tsx
│   │       ├── GlossariesPage.tsx        # Manage project glossaries
│   │       ├── GlossaryNewPage.tsx
│   │       ├── GlossaryDetailPage.tsx
│   │       ├── AnalyticsPage.tsx
│   │       ├── SubscriptionPage.tsx
│   │       ├── SettingsPage.tsx
│   │       └── PlaygroundPage.tsx        # Test translations
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── providers/
│   │   │   ├── AuthProviderWrapper.tsx
│   │   │   └── SubscriptionProviderWrapper.tsx
│   │   └── dashboard/
│   │       ├── ProjectForm.tsx
│   │       ├── GlossaryForm.tsx
│   │       ├── GlossaryTable.tsx
│   │       ├── TranslationTester.tsx
│   │       └── UsageChart.tsx
│   ├── context/
│   │   ├── ApiContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/
│   ├── config/
│   │   ├── firebase.ts
│   │   └── auth-config.ts
│   ├── utils/
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   ├── i18n.ts
│   └── index.css
├── public/
│   └── locales/en/
├── .github/workflows/ci-cd.yml
├── .vscode/
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── eslint.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

### Routes

```
/:lang/                          # Home
/:lang/login                     # Login
/:lang/pricing                   # Pricing
/:lang/docs                      # Documentation
/:lang/dashboard/                # Dashboard (protected)
  ├── /                          # Projects list
  ├── /projects/new              # Create project
  ├── /projects/:projectId       # Project detail
  ├── /projects/:projectId/glossaries         # Glossaries list
  ├── /projects/:projectId/glossaries/new     # Create glossary
  ├── /projects/:projectId/glossaries/:id     # Edit glossary
  ├── /playground                # Translation tester
  ├── /analytics                 # Usage analytics
  ├── /subscription              # Subscription management
  └── /settings                  # User settings
```

### package.json
```json
{
  "name": "whisperly_app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router": "^7.9.4",
    "firebase": "^12.4.0",
    "@revenuecat/purchases-js": "^1.22.1",
    "@tanstack/react-query": "^5.90.5",
    "i18next": "^24.2.3",
    "react-i18next": "^15.5.1",
    "recharts": "^3.6.0",
    "@sudobility/auth-components": "^1.0.0",
    "@sudobility/components": "^4.0.94",
    "@sudobility/design": "^1.1.15",
    "@sudobility/di": "^1.5.8",
    "@sudobility/di_web": "^0.1.17",
    "@sudobility/subscription-components": "^1.0.3",
    "@sudobility/whisperly_client": "^1.0.0",
    "@sudobility/whisperly_lib": "^1.0.0",
    "@sudobility/whisperly_types": "^1.0.0",
    "@sudobility/types": "^1.9.36"
  }
}
```

---

## Environment Variables

### whisperly_api (.env)
```
PORT=3000
DATABASE_URL=postgres://...
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
TRANSLATION_SERVICE_URL=  # Custom translation endpoint
```

### whisperly_app (.env)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_REVENUECAT_API_KEY=
VITE_REVENUECAT_ENTITLEMENT_ID=premium
VITE_WHISPERLY_API_URL=http://localhost:3000
```

---

## Key Business Logic

### Translation Flow
1. Client calls `POST /api/v1/translate/:orgPath/:projectName` with strings and target languages
2. API checks rate limits (hourly + monthly)
3. API extracts glossary terms from project's glossaries table
4. API calls external Translation Service with:
   - `strings`: Strings to translate
   - `target_languages`: Target language codes
   - `glossaries`: List of glossary terms found in strings
   - `glossary_callback_url`: Our callback endpoint URL
5. Translation Service may call our glossary callback for official translations
6. API returns translated strings to client
7. API logs usage record

### Glossary Callback Flow
1. Translation Service calls `GET /api/v1/glossary/:orgPath/:projectName?glossary={term}&languages=en,ja`
2. API looks up glossary term in project's glossaries table
3. API returns translations for ALL requested languages (null if missing)

### Glossary Management (Database-Managed)
- Users manage glossaries via the dashboard UI
- Each project has its own glossary entries
- Glossary entries store: term, translations (per-language), optional context
- Glossaries are automatically used when translation requests contain matching terms

### RevenueCat Integration
- Entitlements: `whisperly_starter`, `whisperly_pro`, `whisperly_enterprise`
- Subscription status synced from RevenueCat
- Rate limits based on subscription tier
- Default limits (placeholder, define actual values later):
  - Starter: 500/hr, 10K/mo
  - Pro: 2K/hr, 100K/mo
  - Enterprise: 10K/hr, 1M/mo

---

## Implementation Order

1. **whisperly_types** - Shared types first (all projects depend on this)
2. **whisperly_api** - Backend API
3. **whisperly_client** - Client library (depends on types)
4. **whisperly_lib** - Business logic (depends on client)
5. **whisperly_app** - Web application (depends on all)

---

## Configuration Files to Copy

From each shapeshyft template, copy and adapt:
- `tsconfig.json` / `tsconfig.*.json`
- `eslint.config.js` / `eslint.config.mjs`
- `.prettierrc`
- `.gitignore`
- `.vscode/settings.json`
- `.vscode/extensions.json`
- `.github/workflows/ci-cd.yml`
- `vitest.config.ts` (where applicable)
- `bunfig.toml` (for whisperly_api)
- `vite.config.ts` (for whisperly_app)
- `tailwind.config.js` (for whisperly_app)
- `postcss.config.js` (for whisperly_app)
