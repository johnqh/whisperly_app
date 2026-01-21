import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5127,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Ensure all packages use the same React instance
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: [
      "react",
      "react-dom",
      "zustand",
      "@tanstack/react-query",
      "recharts",
      "@sudobility/di",
      "@sudobility/di_web",
      "@sudobility/auth_lib",
      "@sudobility/auth-components",
      "@sudobility/entity_client",
      "@sudobility/components",
      "@sudobility/types",
      "@sudobility/whisperly_client",
      "@sudobility/whisperly_lib",
    ],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: true,
    chunkSizeWarningLimit: 500,
    modulePreload: {
      resolveDependencies: (_filename, deps) => {
        return deps.filter(
          (dep) =>
            !dep.includes("page-") &&
            !dep.includes("vendor-charts") &&
            !dep.includes("vendor-revenuecat") &&
            !dep.includes("vendor-ui"),
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Core React
            if (id.includes("react-dom") || id.includes("scheduler")) {
              return "vendor-react";
            }
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            // Firebase
            if (id.includes("firebase")) {
              return "vendor-firebase";
            }
            // i18n
            if (id.includes("i18next")) {
              return "vendor-i18n";
            }
            // TanStack Query
            if (id.includes("@tanstack")) {
              return "vendor-query";
            }
            // Sudobility packages
            if (id.includes("@sudobility/auth-components")) {
              return "vendor-auth";
            }
            if (id.includes("@sudobility/subscription-components")) {
              return "vendor-subscription";
            }
            if (
              id.includes("@sudobility/components") ||
              id.includes("@sudobility/design")
            ) {
              return "vendor-ui";
            }
            if (id.includes("@sudobility/whisperly_client")) {
              return "vendor-client";
            }
            if (id.includes("@sudobility/whisperly_lib")) {
              return "vendor-lib";
            }
            if (
              id.includes("@sudobility/ratelimit_client") ||
              id.includes("@sudobility/ratelimit_components")
            ) {
              return "vendor-ratelimit";
            }
            if (id.includes("@sudobility")) {
              return "vendor-sudobility-misc";
            }
            // State management
            if (id.includes("zustand")) {
              return "vendor-zustand";
            }
            // RevenueCat
            if (id.includes("revenuecat") || id.includes("purchases")) {
              return "vendor-revenuecat";
            }
            // Charts
            if (id.includes("recharts") || id.includes("d3")) {
              return "vendor-charts";
            }
            // Helmet
            if (id.includes("react-helmet")) {
              return "vendor-helmet";
            }
          }

          // Split dashboard pages
          if (id.includes("src/pages/dashboard/")) {
            const pageName = id.match(/dashboard\/(\w+)Page/)?.[1];
            if (pageName) {
              return `page-${pageName.toLowerCase()}`;
            }
          }

          // Split public pages
          if (id.includes("src/pages/") && !id.includes("dashboard")) {
            const pageName = id.match(/pages\/(\w+)Page/)?.[1];
            if (pageName) {
              return `page-${pageName.toLowerCase()}`;
            }
          }
        },
      },
    },
  },
});
