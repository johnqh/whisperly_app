# Whisperly App UI Restructure Plan

This plan restructures whisperly_app to follow the shapeshyft_app architecture patterns.

## Overview

Transform the current simple React app into a full-featured application with:
- Public marketing pages (Home, Use Cases, Docs, Pricing)
- Protected dashboard with master-detail layout
- Full i18n support (language-prefixed routes)
- Consistent layout (TopBar, Breadcrumbs, Footer)
- Reusable @sudobility packages

---

## Phase 1: Project Structure Reorganization

### 1.1 New Directory Structure

```
src/
├── assets/                    # Static assets (logo, images)
├── components/
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── DashboardMasterList.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── GlossaryForm.tsx
│   │   └── analytics/         # Chart components
│   ├── layout/                # Layout components
│   │   ├── TopBar.tsx
│   │   ├── Footer.tsx
│   │   ├── ScreenContainer.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── LanguageRedirect.tsx
│   │   ├── LanguageValidator.tsx
│   │   ├── EntityRedirect.tsx
│   │   └── LocalizedLink.tsx
│   ├── providers/             # Context provider wrappers
│   │   ├── AuthProviderWrapper.tsx
│   │   └── LazySubscriptionProvider.tsx
│   ├── seo/                   # SEO components
│   │   ├── SEO.tsx
│   │   └── AISearchOptimization.tsx
│   └── ui/                    # Generic UI components
│       ├── Toast.tsx
│       └── PreloadLink.tsx
├── config/                    # Configuration
│   ├── auth-config.ts         # Firebase auth texts
│   ├── constants.ts           # App constants, languages
│   ├── entityClient.ts        # EntityClient singleton
│   └── firebase.ts            # Firebase init
├── context/                   # React Contexts
│   ├── ApiContext.tsx
│   ├── ThemeContext.tsx
│   ├── ToastContext.tsx
│   └── AnalyticsContext.tsx
├── hooks/                     # Custom hooks
│   ├── useApi.ts
│   ├── useBreadcrumbs.ts
│   ├── useLocalizedNavigate.ts
│   ├── useToast.ts
│   └── useAnalytics.ts
├── pages/                     # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── PricingPage.tsx
│   ├── SettingsPage.tsx       # Public app settings
│   ├── PrivacyPage.tsx
│   ├── TermsPage.tsx
│   ├── use-cases/
│   │   ├── UseCasesPage.tsx
│   │   ├── UseCasesWebsitesPage.tsx
│   │   ├── UseCasesAppsPage.tsx
│   │   └── UseCasesDocumentsPage.tsx
│   ├── docs/
│   │   ├── DocsPage.tsx
│   │   └── sections/          # Doc sections
│   └── dashboard/
│       ├── DashboardPage.tsx  # Master layout with Outlet
│       ├── ProjectsPage.tsx
│       ├── ProjectNewPage.tsx
│       ├── ProjectDetailPage.tsx
│       ├── GlossariesPage.tsx
│       ├── AnalyticsPage.tsx
│       ├── SubscriptionPage.tsx
│       ├── SettingsPage.tsx
│       ├── RateLimitsPage.tsx
│       ├── WorkspacesPage.tsx
│       ├── MembersPage.tsx
│       └── InvitationsPage.tsx
├── utils/                     # Utilities
│   ├── BreadcrumbBuilder.ts
│   └── analytics.ts
├── i18n.ts                    # i18next config
├── App.tsx                    # Root with routing
└── main.tsx                   # Entry point with DI init
```

### 1.2 Files to Delete
- `src/contexts/` (move to `src/context/`)
- `src/services/firebase.ts` (move to `src/config/firebase.ts`)
- `src/styles/` (use Tailwind directly)

---

## Phase 2: Dependencies & Configuration

### 2.1 Add Dependencies

```json
{
  "dependencies": {
    "@sudobility/auth-components": "^x.x.x",
    "@sudobility/components": "^x.x.x",
    "@sudobility/design": "^x.x.x",
    "@sudobility/subscription-components": "^x.x.x",
    "i18next": "^24.x.x",
    "react-i18next": "^15.x.x",
    "i18next-browser-languagedetector": "^8.x.x",
    "react-helmet-async": "^2.x.x",
    "@heroicons/react": "^2.2.0"
  }
}
```

### 2.2 i18n Setup

Create `src/i18n.ts`:
- Configure i18next with browser language detection
- Support languages: en, es, fr, de, zh-hans, zh-hant, ja, ko, etc.
- Namespace files in `public/locales/{lang}/`

### 2.3 Update vite.config.ts

- Add path aliases for cleaner imports
- Configure dedupe for all @sudobility packages

---

## Phase 3: Layout Components

### 3.1 ScreenContainer.tsx
Reference: `~/shapeshyft/shapeshyft_app/src/components/layout/ScreenContainer.tsx`

Props:
- `footerVariant`: "full" | "compact"
- `topbarVariant`: "default" | "transparent"
- `showFooter`: boolean
- `showBreadcrumbs`: boolean
- `shareConfig`: SEO sharing config

Structure:
```tsx
<LayoutProvider>
  <TopBar variant={topbarVariant} />
  {showBreadcrumbs && <BreadcrumbSection />}
  <main>{children}</main>
  {showFooter && <Footer variant={footerVariant} />}
</LayoutProvider>
```

### 3.2 TopBar.tsx
Reference: `~/shapeshyft/shapeshyft_app/src/components/layout/TopBar.tsx`

- Use `@sudobility/components` TopBar system
- Left: Logo + Navigation (Use Cases, Docs, Pricing, Dashboard)
- Right: Language selector + AuthAction
- Navigation items with LocalizedLink
- Authenticated dropdown with dashboard shortcuts

### 3.3 Footer.tsx
Reference: `~/shapeshyft/shapeshyft_app/src/components/layout/Footer.tsx`

Full variant (Home page):
- 3-column grid: Product, Use Cases, Company
- Brand section
- Version/copyright

Compact variant (other pages):
- Version, copyright, privacy, terms
- Sticky positioning

### 3.4 ProtectedRoute.tsx
- Check `useAuthStatus()` for authentication
- Redirect to `/:lang/login` if not authenticated
- Show loading spinner during auth check

### 3.5 LanguageRedirect.tsx & LanguageValidator.tsx
- Detect language from localStorage/browser
- Redirect `/` to `/:lang/`
- Validate language param, fallback to `/en`

---

## Phase 4: Provider Setup

### 4.1 main.tsx Changes

Initialize DI services BEFORE App import:
```tsx
import { initializeStorageService, initializeNetworkService } from '@sudobility/di'
import { initializeInfoService } from '@sudobility/di_web'

initializeStorageService()
initializeNetworkService()
initializeInfoService()

// Then import and render App
```

### 4.2 Provider Hierarchy (App.tsx)

```tsx
<HelmetProvider>
  <I18nextProvider>
    <ThemeProvider>
      <QueryClientProvider>
        <ToastProvider>
          <AuthProviderWrapper>
            <ApiProvider>
              <AnalyticsProvider>
                <LazySubscriptionProvider>
                  <BrowserRouter>
                    <Routes />
                  </BrowserRouter>
                </LazySubscriptionProvider>
              </AnalyticsProvider>
            </ApiProvider>
          </AuthProviderWrapper>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </I18nextProvider>
</HelmetProvider>
```

### 4.3 Context Implementations

**ApiContext.tsx** - Similar to shapeshyft:
- Manages baseUrl, networkClient, token
- Fetches Firebase ID token on user login
- Provides refreshToken() function

**ThemeContext.tsx**:
- Theme: light/dark/system
- Font size: small/medium/large
- Persist to localStorage

**ToastContext.tsx**:
- Toast notification system

---

## Phase 5: Routing Structure

### 5.1 Route Hierarchy

```tsx
<Routes>
  {/* Root redirect */}
  <Route path="/" element={<LanguageRedirect />} />

  {/* Language-prefixed routes */}
  <Route path="/:lang" element={<LanguageValidator />}>
    {/* Public routes */}
    <Route index element={<HomePage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="pricing" element={<PricingPage />} />
    <Route path="settings" element={<AppSettingsPage />} />
    <Route path="privacy" element={<PrivacyPage />} />
    <Route path="terms" element={<TermsPage />} />

    {/* Use Cases */}
    <Route path="use-cases" element={<UseCasesPage />} />
    <Route path="use-cases/websites" element={<UseCasesWebsitesPage />} />
    <Route path="use-cases/apps" element={<UseCasesAppsPage />} />
    <Route path="use-cases/documents" element={<UseCasesDocumentsPage />} />

    {/* Docs */}
    <Route path="docs" element={<DocsPage />} />
    <Route path="docs/:section" element={<DocsPage />} />

    {/* Protected Dashboard */}
    <Route path="dashboard" element={<ProtectedRoute><EntityRedirect /></ProtectedRoute>} />
    <Route path="dashboard/:entitySlug" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
      <Route index element={<Navigate to="projects" />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="projects/new" element={<ProjectNewPage />} />
      <Route path="projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="projects/:projectId/glossaries" element={<GlossariesPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="subscription" element={<SubscriptionPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="rate-limits" element={<RateLimitsPage />} />
      <Route path="workspaces" element={<WorkspacesPage />} />
      <Route path="members" element={<MembersPage />} />
      <Route path="invitations" element={<InvitationsPage />} />
    </Route>
  </Route>
</Routes>
```

---

## Phase 6: Dashboard Implementation

### 6.1 DashboardPage.tsx (Master Layout)
Reference: `~/shapeshyft/shapeshyft_app/src/pages/dashboard/DashboardPage.tsx`

- Uses `MasterDetailLayout` from @sudobility/components
- DashboardMasterList as sidebar navigation
- `<Outlet />` for nested route content
- Mobile responsive with view switching

### 6.2 DashboardMasterList.tsx
Reference: `~/shapeshyft/shapeshyft_app/src/components/dashboard/DashboardMasterList.tsx`

Sections:
1. **Projects** - Expandable list of user projects
2. **Quick Links** - Analytics, Subscription, Settings
3. **Workspace** - Rate Limits, Members, Invitations, Workspaces

### 6.3 Dashboard Pages

Each page follows pattern:
```tsx
export default function ProjectsPage() {
  const { t } = useTranslation(["dashboard", "common"])
  const { entitySlug } = useParams()
  const { networkClient, baseUrl, token, isReady } = useApi()

  const { projects, isLoading, error } = useProjectsManager({
    baseUrl, networkClient, entitySlug, token,
    autoFetch: isReady && !!entitySlug
  })

  // Error handling with InfoService
  useEffect(() => {
    if (error) getInfoService().show(t("common.error"), error, InfoType.ERROR)
  }, [error])

  return (
    <ItemList
      title={t("projects.title")}
      items={projects}
      renderItem={renderProjectCard}
      loading={isLoading}
      actions={[/* new project action */]}
    />
  )
}
```

---

## Phase 7: Public Pages

### 7.1 HomePage.tsx
Reference: `~/shapeshyft/shapeshyft_app/src/pages/HomePage.tsx`

Sections:
- Hero with CTA (Start Translating / Go to Dashboard)
- Features grid
- Use cases preview
- Pricing preview
- Full footer

### 7.2 Use Cases Pages

**UseCasesPage.tsx** - Overview with links to:
- Websites - Website/webapp localization
- Apps - Mobile app translation
- Documents - Document/content translation

Each subpage explains the use case with examples.

### 7.3 DocsPage.tsx
- API documentation
- Getting started guide
- Glossary management
- Integration examples

### 7.4 PricingPage.tsx
- Tier comparison (Starter, Pro, Enterprise)
- Feature matrix
- CTA buttons

---

## Phase 8: Library Updates

### 8.1 whisperly_client Updates
Path: `../whisperly_client`

Restructure to match shapeshyft_client:
- Ensure hooks follow same patterns
- Add any missing CRUD hooks
- Export consistent types

### 8.2 whisperly_lib Updates
Path: `../whisperly_lib`

Restructure to match shapeshyft_lib:
```
src/
├── business/
│   ├── stores/
│   │   ├── projectsStore.ts
│   │   ├── glossariesStore.ts
│   │   └── ...
│   ├── hooks/
│   │   ├── useProjectsManager.ts
│   │   ├── useGlossariesManager.ts
│   │   └── ...
│   └── index.ts
└── index.ts
```

Add manager hooks:
- useProjectsManager
- useGlossariesManager
- useAnalyticsManager
- useSettingsManager

---

## Phase 9: Hooks

### 9.1 useBreadcrumbs.ts
Reference: `~/shapeshyft/shapeshyft_app/src/hooks/useBreadcrumbs.ts`

- Auto-generate breadcrumbs from pathname
- Fetch project names for rich titles
- Localized labels via i18n

### 9.2 useLocalizedNavigate.ts
- Wrapper around useNavigate
- Prepends current language code
- Used for all navigation

### 9.3 useApi.ts
- Access to ApiContext values
- Shorthand hook

---

## Implementation Order

1. **Setup** - Dependencies, i18n config, vite config
2. **Config** - Move firebase.ts, create constants.ts, auth-config.ts
3. **Context** - ApiContext, ThemeContext, ToastContext
4. **Providers** - AuthProviderWrapper, main.tsx DI init
5. **Layout** - ScreenContainer, TopBar, Footer
6. **Routing** - LanguageRedirect, LanguageValidator, ProtectedRoute, App.tsx routes
7. **Hooks** - useApi, useLocalizedNavigate, useBreadcrumbs
8. **Public Pages** - HomePage, PricingPage, Use Cases, Docs
9. **Dashboard** - DashboardPage, DashboardMasterList
10. **Dashboard Pages** - Projects, Glossaries, Analytics, etc.
11. **Library Updates** - whisperly_client, whisperly_lib restructure

---

## Key Files Reference

### ShapeShyft Reference Files
- Layout: `~/shapeshyft/shapeshyft_app/src/components/layout/`
- Providers: `~/shapeshyft/shapeshyft_app/src/components/providers/`
- Context: `~/shapeshyft/shapeshyft_app/src/context/`
- Hooks: `~/shapeshyft/shapeshyft_app/src/hooks/`
- Pages: `~/shapeshyft/shapeshyft_app/src/pages/`
- Config: `~/shapeshyft/shapeshyft_app/src/config/`
- i18n: `~/shapeshyft/shapeshyft_app/src/i18n.ts`
- App: `~/shapeshyft/shapeshyft_app/src/App.tsx`
- main: `~/shapeshyft/shapeshyft_app/src/main.tsx`

### Current Whisperly Files to Modify
- `src/App.tsx` - Complete rewrite for new routing
- `src/main.tsx` - Add DI initialization
- `src/contexts/` → `src/context/` - Restructure
- `src/pages/` - Add new pages, restructure existing

### New Files to Create
- `src/i18n.ts`
- `src/config/constants.ts`
- `src/config/auth-config.ts`
- `src/components/layout/*`
- `src/components/providers/*`
- `src/hooks/*`
- `public/locales/{lang}/*.json`
