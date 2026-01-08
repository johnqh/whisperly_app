import packageJson from "../../package.json";

// App Constants
export const CONSTANTS = {
  // Branding
  APP_NAME: import.meta.env.VITE_APP_NAME || "Whisperly",
  APP_DOMAIN: import.meta.env.VITE_APP_DOMAIN || "whisperly.io",
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || "Sudobility",
  APP_VERSION: packageJson.version,
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || "support@whisperly.io",

  // API
  API_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  DEV_MODE: import.meta.env.VITE_DEV_MODE === "true",

  // Testnet/Sandbox Mode
  TESTNET_ONLY: import.meta.env.VITE_TESTNET_ONLY === "true",

  // RevenueCat API key (selects sandbox when testnet mode enabled)
  REVENUECAT_API_KEY:
    import.meta.env.VITE_TESTNET_ONLY === "true"
      ? import.meta.env.VITE_REVENUECAT_API_KEY_SANDBOX || ""
      : import.meta.env.VITE_REVENUECAT_API_KEY || "",

  // Social handles (without @ or full URL)
  TWITTER_HANDLE: import.meta.env.VITE_TWITTER_HANDLE || "",
  DISCORD_INVITE: import.meta.env.VITE_DISCORD_INVITE || "",
  LINKEDIN_COMPANY: import.meta.env.VITE_LINKEDIN_COMPANY || "",
  GITHUB_ORG: import.meta.env.VITE_GITHUB_ORG || "",

  // Social links (full URLs)
  SOCIAL_LINKS: {
    twitter: import.meta.env.VITE_TWITTER_URL || "",
    reddit: import.meta.env.VITE_REDDIT_URL || "",
    discord: import.meta.env.VITE_DISCORD_URL || "",
    linkedin: import.meta.env.VITE_LINKEDIN_URL || "",
    farcaster: import.meta.env.VITE_FARCASTER_URL || "",
    telegram: import.meta.env.VITE_TELEGRAM_URL || "",
    github: import.meta.env.VITE_GITHUB_URL || "",
  },

  // External pages
  STATUS_PAGE_URL: import.meta.env.VITE_STATUS_PAGE_URL || "",
  STATUS_PAGE_API_URL: import.meta.env.VITE_STATUS_PAGE_API_URL || "",

} as const;

// Navigation items
export const NAV_ITEMS = {
  // Use cases (for dropdown menu)
  USE_CASES: [
    { key: "websites", path: "websites" },
    { key: "apps", path: "apps" },
    { key: "documents", path: "documents" },
  ],

  // Docs sections (for dropdown menu)
  DOCS: [
    { key: "gettingStarted", path: "getting-started" },
    { key: "api", path: "api" },
    { key: "guides", path: "guides" },
  ],

  // Main navigation
  MAIN: [
    { label: "home", href: "/" },
    { label: "useCases", href: "/use-cases" },
    { label: "docs", href: "/docs" },
    { label: "pricing", href: "/pricing" },
  ],

  // Dashboard navigation
  DASHBOARD: [
    { key: "overview", path: "", icon: "LayoutDashboard" },
    { key: "projects", path: "projects", icon: "FolderOpen" },
    { key: "analytics", path: "analytics", icon: "BarChart3" },
    { key: "settings", path: "settings", icon: "Settings" },
  ],
} as const;

// Supported languages for i18n
export const SUPPORTED_LANGUAGES = [
  "en",
  "ar",
  "de",
  "es",
  "fr",
  "it",
  "ja",
  "ko",
  "pt",
  "ru",
  "sv",
  "th",
  "uk",
  "vi",
  "zh",
  "zh-hant",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const isLanguageSupported = (
  lang: string,
): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};
