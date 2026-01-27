import { useState, useRef } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEntities } from "@sudobility/entity_client";
import { MasterDetailLayout } from "@sudobility/components";
import { entityClient } from "../../config/entityClient";
import { ScreenContainer } from "./ScreenContainer";
import { useLocalizedNavigate } from "../../hooks/useLocalizedNavigate";
import {
  Squares2X2Icon,
  FolderOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  BoltIcon,
  UsersIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { key: "overview", path: "", icon: Squares2X2Icon },
  { key: "projects", path: "projects", icon: FolderOpenIcon },
  { key: "analytics", path: "analytics", icon: ChartBarIcon },
  { key: "rateLimits", path: "rate-limits", icon: BoltIcon },
  { key: "subscription", path: "subscription", icon: CreditCardIcon },
  { key: "workspaces", path: "workspaces", icon: BuildingOffice2Icon },
  { key: "members", path: "members", icon: UsersIcon },
  { key: "invitations", path: "invitations", icon: EnvelopeIcon },
  { key: "settings", path: "settings", icon: Cog6ToothIcon },
];

export function DashboardLayout() {
  const { t } = useTranslation("dashboard");
  const location = useLocation();
  const { navigate } = useLocalizedNavigate();
  const { entitySlug } = useParams<{ entitySlug: string }>();
  const { data: entities } = useEntities(entityClient);
  const [mobileView, setMobileView] = useState<"navigation" | "content">("navigation");
  const animationRef = useRef<{ triggerTransition: (onContentChange: () => void) => void } | null>(null);

  const handleEntityChange = (slug: string) => {
    localStorage.setItem("whisperly_last_entity", slug);
    navigate(`/dashboard/${slug}`);
  };

  const isActive = (path: string) => {
    const basePath = `/dashboard/${entitySlug}`;
    if (path === "") {
      return location.pathname === basePath || location.pathname === `${basePath}/`;
    }
    return location.pathname.includes(`${basePath}/${path}`);
  };

  const handleNavigate = (path: string) => {
    if (animationRef.current) {
      animationRef.current.triggerTransition(() => {
        navigate(path);
        setMobileView("content");
      });
    } else {
      navigate(path);
      setMobileView("content");
    }
  };

  const handleBackToNavigation = () => {
    setMobileView("navigation");
  };

  // Get detail title based on current route
  const getDetailTitle = (): string => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    // Find the segment after entitySlug
    const entityIndex = pathSegments.indexOf(entitySlug || '');
    const pageSegment = pathSegments[entityIndex + 1];

    if (!pageSegment) return t("navigation.overview");

    const navItem = NAV_ITEMS.find(item => item.path === pageSegment);
    if (navItem) {
      return t(`navigation.${navItem.key}`);
    }

    return pageSegment.charAt(0).toUpperCase() + pageSegment.slice(1);
  };

  // Master content (sidebar navigation)
  const masterContent = (
    <div className="p-4">
      {/* Entity Selector */}
      <div className="mb-6">
        <div className="relative">
          <select
            value={entitySlug || ""}
            onChange={(e) => handleEntityChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 pr-8 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {entities?.map((entity) => (
              <option key={entity.entitySlug} value={entity.entitySlug}>
                {entity.displayName || entity.entitySlug}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const path = `/dashboard/${entitySlug}${item.path ? `/${item.path}` : ""}`;
          const active = isActive(item.path);

          return (
            <button
              key={item.key}
              onClick={() => handleNavigate(path)}
              className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
              }`}
            >
              {active && (
                <div className="absolute inset-1 bg-blue-500/15 dark:bg-blue-400/15 rounded-lg pointer-events-none" />
              )}
              <Icon className={`relative h-4 w-4 ${active ? "text-blue-600 dark:text-blue-400" : ""}`} />
              <span className="relative">{t(`navigation.${item.key}`)}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  // Detail content (main area with nested routes)
  const detailContent = (
    <div className="p-4 md:p-6">
      <Outlet />
    </div>
  );

  return (
    <ScreenContainer showBreadcrumbs={true} compactFooter={true}>
      <MasterDetailLayout
        masterTitle={t("title")}
        masterContent={masterContent}
        detailContent={detailContent}
        detailTitle={getDetailTitle()}
        mobileView={mobileView}
        onBackToNavigation={handleBackToNavigation}
        animationRef={animationRef}
        enableAnimations={true}
        animationDuration={150}
        masterWidth={260}
        stickyTopOffset={80}
      />
    </ScreenContainer>
  );
}

export default DashboardLayout;
