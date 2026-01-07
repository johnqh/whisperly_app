import { Outlet, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEntities } from "@sudobility/entity_client";
import { entityClient } from "../../config/entityClient";
import { ScreenContainer } from "./ScreenContainer";
import { LocalizedLink } from "./LocalizedLink";
import { useLocalizedNavigate } from "../../hooks/useLocalizedNavigate";
import {
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  Settings,
  CreditCard,
  Zap,
  Users,
  Building2,
  Mail,
  ChevronDown,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "overview", path: "", icon: LayoutDashboard },
  { key: "projects", path: "projects", icon: FolderOpen },
  { key: "analytics", path: "analytics", icon: BarChart3 },
  { key: "rateLimits", path: "rate-limits", icon: Zap },
  { key: "subscription", path: "subscription", icon: CreditCard },
  { key: "workspaces", path: "workspaces", icon: Building2 },
  { key: "members", path: "members", icon: Users },
  { key: "invitations", path: "invitations", icon: Mail },
  { key: "settings", path: "settings", icon: Settings },
];

export function DashboardLayout() {
  const { t } = useTranslation("dashboard");
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const { entitySlug } = useParams<{ entitySlug: string }>();
  const { data: entities } = useEntities(entityClient);

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

  return (
    <ScreenContainer showBreadcrumbs={true} compactFooter={true}>
      <div className="flex min-h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-border bg-muted/30 md:block">
          <div className="sticky top-16 p-4">
            {/* Entity Selector */}
            <div className="mb-6">
              <div className="relative">
                <select
                  value={entitySlug || ""}
                  onChange={(e) => handleEntityChange(e.target.value)}
                  className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-8 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {entities?.map((entity) => (
                    <option key={entity.entitySlug} value={entity.entitySlug}>
                      {entity.displayName || entity.entitySlug}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <LocalizedLink
                    key={item.key}
                    to={`/dashboard/${entitySlug}${item.path ? `/${item.path}` : ""}`}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(`navigation.${item.key}`)}
                  </LocalizedLink>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </ScreenContainer>
  );
}

export default DashboardLayout;
