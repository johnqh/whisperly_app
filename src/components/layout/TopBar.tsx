import { useTranslation } from "react-i18next";
import { useParams, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuthStatus, AuthAction } from "@sudobility/auth-components";
import { LocalizedLink } from "./LocalizedLink";
import { useLocalizedNavigate } from "../../hooks/useLocalizedNavigate";
import { CONSTANTS, SUPPORTED_LANGUAGES, NAV_ITEMS } from "../../config/constants";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export function TopBar() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const navigate = useLocalizedNavigate();
  const { user } = useAuthStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { label: t("common:nav.home"), href: "/" },
    {
      label: t("common:nav.useCases"),
      href: "/use-cases",
      children: NAV_ITEMS.USE_CASES.map((uc) => ({
        label: t(`common:nav.useCases.${uc.key}`),
        href: `/use-cases/${uc.path}`,
        description: t(`common:nav.useCases.${uc.key}Desc`, { defaultValue: "" }),
      })),
    },
    {
      label: t("common:nav.docs"),
      href: "/docs",
      children: [
        { label: t("common:nav.docs.gettingStarted"), href: "/docs/getting-started" },
        { label: t("common:nav.docs.api"), href: "/docs/api" },
        { label: t("common:nav.docs.guides"), href: "/docs/guides" },
      ],
    },
    { label: t("common:nav.pricing"), href: "/pricing" },
  ];

  const handleLanguageChange = (newLang: string) => {
    const pathWithoutLang = location.pathname.replace(`/${lang}`, "");
    i18n.changeLanguage(newLang);
    navigate(`/${newLang}${pathWithoutLang || "/"}`, { replace: true });
  };

  const isActive = (href: string) => {
    const pathWithoutLang = location.pathname.replace(`/${lang}`, "");
    if (href === "/") return pathWithoutLang === "" || pathWithoutLang === "/";
    return pathWithoutLang.startsWith(href);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <LocalizedLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">{CONSTANTS.APP_NAME}</span>
          </LocalizedLink>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <LocalizedLink
                  to={item.href}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-4 w-4" />}
                </LocalizedLink>

                {/* Dropdown */}
                {item.children && openDropdown === item.href && (
                  <div className="absolute left-0 top-full mt-2 w-64 rounded-md border border-border bg-background p-2 shadow-lg">
                    {item.children.map((child) => (
                      <LocalizedLink
                        key={child.href}
                        to={child.href}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                      >
                        <div className="font-medium">{child.label}</div>
                        {child.description && (
                          <div className="text-xs text-muted-foreground">
                            {child.description}
                          </div>
                        )}
                      </LocalizedLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language selector */}
            <select
              value={lang || "en"}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="hidden rounded-md border border-border bg-background px-2 py-1 text-sm md:block"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Auth */}
            <div className="hidden md:block">
              {user ? (
                <LocalizedLink
                  to="/dashboard"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {t("common:nav.dashboard")}
                </LocalizedLink>
              ) : (
                <AuthAction
                  avatarSize={32}
                  dropdownAlign="right"
                  onLoginClick={handleLoginClick}
                  menuItems={[]}
                />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <div key={item.href}>
                  <LocalizedLink
                    to={item.href}
                    className={`block text-sm font-medium ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </LocalizedLink>
                  {item.children && (
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {item.children.map((child) => (
                        <LocalizedLink
                          key={child.href}
                          to={child.href}
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </LocalizedLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile language selector */}
              <select
                value={lang || "en"}
                onChange={(e) => {
                  handleLanguageChange(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l.toUpperCase()}
                  </option>
                ))}
              </select>

              {/* Mobile auth */}
              {user ? (
                <LocalizedLink
                  to="/dashboard"
                  className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("common:nav.dashboard")}
                </LocalizedLink>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                >
                  {t("common:nav.signIn")}
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default TopBar;
