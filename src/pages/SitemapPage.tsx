import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { LocalizedLink } from "../components/layout/LocalizedLink";
import {
  CONSTANTS,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "../config/constants";
import { AppSitemapPage } from "@sudobility/building_blocks";
import type {
  SitemapPageText,
  SitemapSection,
  LanguageOption,
  QuickLink,
  LinkComponentProps,
} from "@sudobility/building_blocks";

// Language display names and flags
const LANGUAGE_INFO: Record<string, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇺🇸" },
  ar: { name: "العربية", flag: "🇸🇦" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  it: { name: "Italiano", flag: "🇮🇹" },
  ja: { name: "日本語", flag: "🇯🇵" },
  ko: { name: "한국어", flag: "🇰🇷" },
  pt: { name: "Português", flag: "🇧🇷" },
  ru: { name: "Русский", flag: "🇷🇺" },
  sv: { name: "Svenska", flag: "🇸🇪" },
  th: { name: "ไทย", flag: "🇹🇭" },
  uk: { name: "Українська", flag: "🇺🇦" },
  vi: { name: "Tiếng Việt", flag: "🇻🇳" },
  zh: { name: "简体中文", flag: "🇨🇳" },
  "zh-hant": { name: "繁體中文", flag: "🇹🇼" },
};

// Link wrapper component that integrates with AppSitemapPage
const LinkWrapper: React.FC<LinkComponentProps & { language?: string }> = ({
  href,
  className,
  children,
  language,
}) => {
  if (language) {
    return (
      <LocalizedLink to={href} className={className} language={language as SupportedLanguage}>
        {children}
      </LocalizedLink>
    );
  }
  return (
    <LocalizedLink to={href} className={className}>
      {children}
    </LocalizedLink>
  );
};

export function SitemapPage() {
  const { t } = useTranslation("sitemap");
  const appName = CONSTANTS.APP_NAME;

  // Sort languages by their native name
  const languageOptions: LanguageOption[] = useMemo(() => {
    return [...SUPPORTED_LANGUAGES]
      .map((code) => ({
        code,
        name: LANGUAGE_INFO[code]?.name || code.toUpperCase(),
        flag: LANGUAGE_INFO[code]?.flag || "🌐",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const sections: SitemapSection[] = [
    {
      title: t("sections.main", "Main Pages"),
      icon: "home",
      links: [
        {
          path: "/",
          label: t("links.home", "Home"),
          description: t("descriptions.home", "Landing page"),
        },
        {
          path: "/pricing",
          label: t("links.pricing", "Pricing"),
          description: t("descriptions.pricing", "Subscription plans"),
        },
        {
          path: "/settings",
          label: t("links.settings", "Settings"),
          description: t("descriptions.settings", "App settings"),
        },
      ],
    },
    {
      title: t("sections.dashboard", "Dashboard"),
      icon: "cog",
      links: [
        {
          path: "/dashboard",
          label: t("links.dashboard", "Dashboard"),
          description: t("descriptions.dashboard", "Overview and analytics"),
        },
        {
          path: "/dashboard/projects",
          label: t("links.projects", "Projects"),
          description: t("descriptions.projects", "Manage your projects"),
        },
        {
          path: "/dashboard/glossaries",
          label: t("links.glossaries", "Glossaries"),
          description: t("descriptions.glossaries", "Translation glossaries"),
        },
        {
          path: "/dashboard/analytics",
          label: t("links.analytics", "Analytics"),
          description: t("descriptions.analytics", "Usage statistics"),
        },
      ],
    },
    {
      title: t("sections.team", "Team"),
      icon: "envelope",
      links: [
        {
          path: "/dashboard/workspaces",
          label: t("links.workspaces", "Workspaces"),
          description: t("descriptions.workspaces", "Manage workspaces"),
        },
        {
          path: "/dashboard/members",
          label: t("links.members", "Members"),
          description: t("descriptions.members", "Team members"),
        },
        {
          path: "/dashboard/invitations",
          label: t("links.invitations", "Invitations"),
          description: t("descriptions.invitations", "Pending invitations"),
        },
      ],
    },
    {
      title: t("sections.legal", "Legal"),
      icon: "document",
      links: [
        {
          path: "/privacy",
          label: t("links.privacy", "Privacy Policy"),
          description: t("descriptions.privacy", "Privacy and data protection"),
        },
        {
          path: "/terms",
          label: t("links.terms", "Terms of Service"),
          description: t("descriptions.terms", "Terms and conditions"),
        },
      ],
    },
  ];

  // Build quick links
  const quickLinks: QuickLink[] = [
    {
      path: "/dashboard",
      label: t("quickLinks.dashboard", "Go to Dashboard"),
      variant: "primary",
    },
    {
      path: "/pricing",
      label: t("quickLinks.pricing", "View Pricing"),
      variant: "secondary",
    },
    {
      path: "/dashboard/projects",
      label: t("quickLinks.projects", "Manage Projects"),
      variant: "outline",
      icon: "document",
    },
  ];

  // Build text content
  const text: SitemapPageText = {
    title: t("title", "Sitemap"),
    subtitle: t("subtitle", {
      defaultValue: `Explore all pages and features available on ${appName}`,
      appName,
    }),
    languagesSectionTitle: t("sections.languages", "Languages"),
    languagesDescription: t("languageDescription", {
      defaultValue: `${appName} is available in multiple languages. Select your preferred language:`,
      appName,
    }),
    quickLinksTitle: t("quickLinks.title", "Quick Links"),
  };

  return (
    <ScreenContainer>
      <Helmet>
        <title>{t("meta.title", { defaultValue: `Sitemap - ${appName}`, appName })}</title>
        <meta
          name="description"
          content={t("meta.description", {
            defaultValue: `Navigate all pages and features available on ${appName}`,
            appName,
          })}
        />
      </Helmet>

      <AppSitemapPage
        text={text}
        sections={sections}
        languages={languageOptions}
        quickLinks={quickLinks}
        LinkComponent={LinkWrapper}
      />
    </ScreenContainer>
  );
}

export default SitemapPage;
