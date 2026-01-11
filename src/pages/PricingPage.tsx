import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useAuthStatus } from "@sudobility/auth-components";
import {
  AppPricingPage,
  type PricingPageLabels,
  type PricingPageFormatters,
  type PricingProduct,
  type FAQItem,
  type EntitlementMap,
  type EntitlementLevels,
} from "@sudobility/building_blocks";
import { useSafeSubscriptionContext } from "../components/providers/SafeSubscriptionContext";
import { useCurrentEntity } from "../hooks/useCurrentEntity";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useLocalizedNavigate } from "../hooks/useLocalizedNavigate";
import { useToast } from "../hooks/useToast";
import { CONSTANTS } from "../config/constants";

// Package ID to entitlement mapping (from RevenueCat configuration)
const PACKAGE_ENTITLEMENT_MAP: EntitlementMap = {
  pro_yearly: "whisperly_pro",
  pro_monthly: "whisperly_pro",
  starter_yearly: "whisperly_starter",
  starter_monthly: "whisperly_starter",
};

// Entitlement to level mapping (higher = better tier)
const ENTITLEMENT_LEVELS: EntitlementLevels = {
  none: 0,
  whisperly_starter: 1,
  whisperly_pro: 2,
};

export function PricingPage() {
  const { t } = useTranslation("pricing");
  const { t: tSub } = useTranslation("subscription");
  const { user, openModal } = useAuthStatus();
  const { products: rawProducts, currentSubscription, purchase } =
    useSafeSubscriptionContext();
  const { currentEntityId, currentEntitySlug } = useCurrentEntity();
  const { navigate } = useLocalizedNavigate();
  const { success, error: showError } = useToast();

  const isAuthenticated = !!user;
  const hasActiveSubscription = currentSubscription?.isActive ?? false;

  // Map products to the format expected by AppPricingPage
  const products: PricingProduct[] = rawProducts.map((p) => ({
    identifier: p.identifier,
    title: p.title,
    price: p.price,
    priceString: p.priceString,
    period: p.period,
  }));

  const handlePlanClick = async (planIdentifier: string) => {
    if (isAuthenticated) {
      // Directly initiate purchase flow
      try {
        const result = await purchase(planIdentifier);
        if (result) {
          success(tSub("purchase.success", "Subscription activated successfully!"));
          // Navigate to dashboard after successful purchase
          if (currentEntitySlug) {
            navigate(`/dashboard/${currentEntitySlug}`);
          } else {
            navigate("/dashboard");
          }
        }
      } catch (err) {
        showError(
          err instanceof Error
            ? err.message
            : tSub("purchase.error", "Failed to complete purchase")
        );
      }
    } else {
      openModal();
    }
  };

  const handleFreePlanClick = () => {
    if (isAuthenticated) {
      if (currentEntitySlug) {
        navigate(`/dashboard/${currentEntitySlug}`);
      } else {
        navigate("/dashboard");
      }
    } else {
      openModal();
    }
  };

  // Static feature lists for pricing page
  const getProductFeatures = (packageId: string): string[] => {
    const entitlement = PACKAGE_ENTITLEMENT_MAP[packageId];
    if (entitlement === "whisperly_pro") {
      return [
        t("features.unlimitedProjects", "Unlimited projects"),
        t("features.prioritySupport", "Priority support"),
        t("features.customGlossaries", "Custom glossaries"),
        t("features.advancedAnalytics", "Advanced analytics"),
      ];
    }
    if (entitlement === "whisperly_starter") {
      return [
        t("features.tenProjects", "Up to 10 projects"),
        t("features.emailSupport", "Email support"),
        t("features.basicGlossaries", "Basic glossaries"),
      ];
    }
    return [];
  };

  // Build labels object from translations
  const labels: PricingPageLabels = {
    // Header
    title: t("title", "Pricing"),
    subtitle: t("subtitle", "Choose the plan that works for you"),

    // Periods
    periodYear: tSub("periods.year", "/year"),
    periodMonth: tSub("periods.month", "/month"),
    periodWeek: tSub("periods.week", "/week"),

    // Billing period toggle
    billingMonthly: tSub("billingPeriod.monthly", "Monthly"),
    billingYearly: tSub("billingPeriod.yearly", "Yearly"),

    // Free tier
    freeTierTitle: t("plans.free.name", "Free"),
    freeTierPrice: t("plans.free.price", "$0"),
    freeTierFeatures: [
      t("freeTier.basicTranslations", "Basic translations"),
      t("freeTier.threeProjects", "Up to 3 projects"),
      t("freeTier.communitySupport", "Community support"),
    ],

    // Badges
    currentPlanBadge: t("badges.currentPlan", "Current Plan"),
    mostPopularBadge: t("badges.mostPopular", "Most Popular"),

    // CTA buttons
    ctaLogIn: t("cta.logIn", "Log in to Continue"),
    ctaTryFree: t("cta.tryFree", "Try it for Free"),
    ctaUpgrade: t("cta.upgrade", "Upgrade"),

    // FAQ
    faqTitle: t("faq.title", "Frequently Asked Questions"),
  };

  // Build formatters object
  const formatters: PricingPageFormatters = {
    formatSavePercent: (percent: number) =>
      tSub("badges.savePercent", "Save {{percent}}%", { percent }),
    getProductFeatures,
  };

  // Get FAQ items from translations (if available)
  const faqItems: FAQItem[] = t("faq.items", {
    returnObjects: true,
    defaultValue: [],
  }) as FAQItem[];

  return (
    <ScreenContainer>
      <Helmet>
        <title>
          {t("meta.title", "Pricing")} | {CONSTANTS.APP_NAME}
        </title>
        <meta
          name="description"
          content={t(
            "meta.description",
            `${CONSTANTS.APP_NAME} pricing plans. Choose the plan that works for you.`
          )}
        />
      </Helmet>
      <AppPricingPage
        products={products}
        isAuthenticated={isAuthenticated}
        hasActiveSubscription={hasActiveSubscription}
        currentProductIdentifier={currentSubscription?.productIdentifier}
        subscriptionUserId={currentEntityId ?? undefined}
        labels={labels}
        formatters={formatters}
        entitlementMap={PACKAGE_ENTITLEMENT_MAP}
        entitlementLevels={ENTITLEMENT_LEVELS}
        onPlanClick={handlePlanClick}
        onFreePlanClick={handleFreePlanClick}
        faqItems={faqItems.length > 0 ? faqItems : undefined}
      />
    </ScreenContainer>
  );
}

export default PricingPage;
