/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API
  readonly VITE_API_BASE_URL: string;

  // Firebase
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;

  // RevenueCat
  readonly VITE_REVENUECAT_API_KEY: string;
  readonly VITE_REVENUECAT_API_KEY_SANDBOX: string;
  readonly VITE_REVENUECAT_OFFER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
