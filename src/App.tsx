import { Routes, Route, Navigate } from "react-router-dom";
import { SudobilityAppWithFirebaseAuthAndEntities } from "@sudobility/building_blocks/firebase";
import { CONSTANTS } from "./config/constants";

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
import ProjectNew from "./pages/ProjectNew";
import ProjectDetail from "./pages/ProjectDetail";
import Dictionary from "./pages/Dictionary";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Subscription from "./pages/Subscription";
import RateLimits from "./pages/RateLimits";
import Workspaces from "./pages/Workspaces";
import Members from "./pages/Members";
import Invitations from "./pages/Invitations";

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
          <Route path="projects/new" element={<ProjectNew />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route
            path="projects/:projectId/dictionary"
            element={<Dictionary />}
          />
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
  return (
    <SudobilityAppWithFirebaseAuthAndEntities
      apiUrl={CONSTANTS.API_URL}
      testMode={CONSTANTS.DEV_MODE}
      revenueCatApiKey={CONSTANTS.REVENUECAT_API_KEY}
      revenueCatApiKeySandbox={CONSTANTS.REVENUECAT_API_KEY_SANDBOX}
    >
      <AppRoutes />
    </SudobilityAppWithFirebaseAuthAndEntities>
  );
}

export default App;
