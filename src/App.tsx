import { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { NetworkProvider } from "@sudobility/devops-components";
import { getNetworkService } from "@sudobility/di";
import { InfoBanner } from "@sudobility/di_web";
import i18n from "./i18n";

// Providers
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProviderWrapper } from "./components/providers/AuthProviderWrapper";
import { ApiProvider } from "./context/ApiContext";
import { SubscriptionProviderWrapper } from "./components/providers/SubscriptionProviderWrapper";
import { useCurrentEntity } from "./hooks/useCurrentEntity";

// Layout Components
import { LanguageRedirect } from "./components/layout/LanguageRedirect";
import { LanguageValidator } from "./components/layout/LanguageValidator";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { EntityRedirect } from "./components/layout/EntityRedirect";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Public Pages
import { HomePage } from "./pages/HomePage";
import { PricingPage } from "./pages/PricingPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { CookiesPage } from "./pages/CookiesPage";
import { SitemapPage } from "./pages/SitemapPage";
import { SettingsPage } from "./pages/SettingsPage";
import Login from "./pages/Login";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Glossaries from "./pages/Glossaries";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Subscription from "./pages/Subscription";
import RateLimits from "./pages/RateLimits";
import Workspaces from "./pages/Workspaces";
import Members from "./pages/Members";
import Invitations from "./pages/Invitations";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Wrapper that reads entity ID from URL and passes to subscription provider
function EntityAwareSubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { entityId } = useCurrentEntity();
  return (
    <SubscriptionProviderWrapper entityId={entityId}>
      {children}
    </SubscriptionProviderWrapper>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect to language-prefixed route */}
      <Route path="/" element={<LanguageRedirect />} />

      {/* Language-prefixed routes */}
      <Route path="/:lang" element={<LanguageValidator />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="cookies" element={<CookiesPage />} />
        <Route path="sitemap" element={<SitemapPage />} />

        {/* Protected Dashboard - redirect to entity */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <EntityRedirect />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard with entity */}
        <Route
          path="dashboard/:entitySlug"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="projects/:projectId/glossaries" element={<Glossaries />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="rate-limits" element={<RateLimits />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="members" element={<Members />} />
          <Route path="invitations" element={<Invitations />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const networkService = useMemo(() => getNetworkService(), []);

  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <NetworkProvider networkService={networkService}>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                <AuthProviderWrapper>
                  <ApiProvider>
                    <BrowserRouter>
                      <EntityAwareSubscriptionProvider>
                        <AppRoutes />
                        <InfoBanner />
                      </EntityAwareSubscriptionProvider>
                    </BrowserRouter>
                  </ApiProvider>
                </AuthProviderWrapper>
              </ToastProvider>
            </QueryClientProvider>
          </NetworkProvider>
        </ThemeProvider>
      </I18nextProvider>
    </HelmetProvider>
  );
}

export default App;
