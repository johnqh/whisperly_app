/**
 * @fileoverview Consolidated app initialization
 * @description Single entry point for all DI singletons and service initializations
 */

import {
  initializeStorageService,
  initializeNetworkService,
} from "@sudobility/di";
import { initializeInfoService } from "@sudobility/di_web";
import { initializeFirebaseAuth } from "@sudobility/auth_lib";
import { registerServiceWorker } from "../utils/serviceWorker";
import { initWebVitals } from "../utils/webVitals";

/**
 * Initialize all app services and singletons.
 * Must be called before rendering the React app.
 *
 * Initialization order:
 * 1. DI services (storage, network, info)
 * 2. Firebase Auth
 * 3. i18n (imported separately)
 * 4. Performance monitoring (service worker, web vitals)
 */
export function initializeApp(): void {
  // 1. Initialize DI services
  initializeStorageService();
  initializeNetworkService();
  initializeInfoService();

  // 2. Initialize Firebase Auth
  initializeFirebaseAuth({
    config: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    },
  });

  // 3. i18n is initialized via import in main.tsx

  // 4. Initialize performance monitoring
  registerServiceWorker();
  initWebVitals();
}
