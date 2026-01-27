/// <reference types="vite/client" />

interface ImportMetaEnv {
  // =============================================================================
  // Branding
  // =============================================================================
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_DOMAIN?: string;
  readonly VITE_COMPANY_NAME?: string;
  readonly VITE_SUPPORT_EMAIL?: string;

  // =============================================================================
  // API
  // =============================================================================
  readonly VITE_API_BASE_URL: string;

  // =============================================================================
  // Firebase
  // =============================================================================
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;

  // =============================================================================
  // RevenueCat
  // =============================================================================
  readonly VITE_REVENUECAT_API_KEY?: string;
  readonly VITE_REVENUECAT_API_KEY_SANDBOX?: string;
  readonly VITE_REVENUECAT_OFFER_ID?: string;

  // =============================================================================
  // Feature Flags
  // =============================================================================
  readonly VITE_DEV_MODE?: string;
  readonly VITE_MEET_FOUNDER_URL?: string;

  // =============================================================================
  // Social Links
  // =============================================================================
  readonly VITE_TWITTER_URL?: string;
  readonly VITE_REDDIT_URL?: string;
  readonly VITE_DISCORD_URL?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_FARCASTER_URL?: string;
  readonly VITE_TELEGRAM_URL?: string;
  readonly VITE_GITHUB_URL?: string;

  readonly VITE_TWITTER_HANDLE?: string;
  readonly VITE_DISCORD_INVITE?: string;
  readonly VITE_LINKEDIN_COMPANY?: string;
  readonly VITE_GITHUB_ORG?: string;

  // =============================================================================
  // Status Page
  // =============================================================================
  readonly VITE_STATUS_PAGE_URL?: string;
  readonly VITE_STATUS_PAGE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
