import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSubscriptionContext } from "@sudobility/subscription-components";
import {
  AppSubscriptionsPage,
  type SubscriptionPageLabels,
  type SubscriptionPageFormatters,
} from "@sudobility/building_blocks";
import { getInfoService } from "@sudobility/di";
import { InfoType } from "@sudobility/types";
import { useToast } from "../hooks/useToast";
import { useCurrentEntity } from "../hooks/useCurrentEntity";

// Package ID to entitlement mapping (from RevenueCat configuration)
const PACKAGE_ENTITLEMENT_MAP: Record<string, string> = {
  pro_yearly: "whisperly_pro",
  pro_monthly: "whisperly_pro",
  starter_yearly: "whisperly_starter",
  starter_monthly: "whisperly_starter",
};

export default function Subscription() {
  const { t } = useTranslation("subscription");
  const { success } = useToast();
  const { currentEntityId } = useCurrentEntity();
  const subscriptionContext = useSubscriptionContext();

  const handlePurchaseSuccess = () => {
    success(t("purchase.success", "Subscription activated successfully!"));
  };

  const handleRestoreSuccess = () => {
    success(t("restore.success", "Purchases restored successfully!"));
  };

  const handleError = (title: string, message: string) => {
    getInfoService().show(title, message, InfoType.ERROR, 5000);
  };

  const handleWarning = (title: string, message: string) => {
    getInfoService().show(title, message, InfoType.WARNING, 5000);
  };

  // Memoize labels to prevent unnecessary re-renders
  const labels: SubscriptionPageLabels = useMemo(
    () => ({
      title: t("title", "Subscription"),
      errorTitle: t("common.error", "Error"),
      purchaseError: t("purchase.error", "Failed to complete purchase"),
      restoreError: t("restore.error", "Failed to restore purchases"),
      restoreNoPurchases: t("restore.noPurchases", "No purchases to restore"),

      // Periods
      periodYear: t("periods.year", "/year"),
      periodMonth: t("periods.month", "/month"),
      periodWeek: t("periods.week", "/week"),

      // Billing period toggle
      billingMonthly: t("billingPeriod.monthly", "Monthly"),
      billingYearly: t("billingPeriod.yearly", "Yearly"),

      // Rate limits
      unlimited: t("rateLimits.unlimited", "Unlimited"),
      unlimitedRequests: t("rateLimits.unlimitedRequests", "Unlimited requests"),

      // Current status
      currentStatusLabel: t("currentStatus.label", "Current Status"),
      statusActive: t("currentStatus.active", "Active Subscription"),
      statusInactive: t("currentStatus.inactive", "No Active Subscription"),
      statusInactiveMessage: t(
        "currentStatus.inactiveMessage",
        "Subscribe to unlock premium features"
      ),
      labelPlan: t("currentStatus.plan", "Plan"),
      labelPremium: t("currentStatus.premium", "Premium"),
      labelExpires: t("currentStatus.expires", "Expires"),
      labelWillRenew: t("currentStatus.willRenew", "Will Renew"),
      labelMonthlyUsage: t("currentStatus.monthlyUsage", "Monthly Usage"),
      labelDailyUsage: t("currentStatus.dailyUsage", "Daily Usage"),
      yes: t("common.yes", "Yes"),
      no: t("common.no", "No"),

      // Buttons
      buttonSubscribe: t("buttons.subscribe", "Subscribe Now"),
      buttonPurchasing: t("buttons.purchasing", "Processing..."),
      buttonRestore: t("buttons.restore", "Restore Purchases"),
      buttonRestoring: t("buttons.restoring", "Restoring..."),

      // Empty states
      noProducts: t("noProducts", "No subscription products available"),
      noProductsForPeriod: t(
        "noProductsForPeriod",
        "No products available for this billing period"
      ),

      // Free tier
      freeTierTitle: t("freeTier.title", "Free"),
      freeTierPrice: t("freeTier.price", "$0"),
      freeTierFeatures: [
        t("freeTier.basicTranslations", "Basic translations"),
        t("freeTier.limitedProjects", "Up to 3 projects"),
        t("freeTier.communitySupport", "Community support"),
      ],

      // Badges
      currentPlanBadge: t("badges.currentPlan", "Current Plan"),
    }),
    [t]
  );

  // Memoize formatters to prevent unnecessary re-renders
  const formatters: SubscriptionPageFormatters = useMemo(
    () => ({
      formatHourlyLimit: (limit: string) =>
        t("rateLimits.hourly", "{{limit}} requests/hour", { limit }),
      formatDailyLimit: (limit: string) =>
        t("rateLimits.daily", "{{limit}} requests/day", { limit }),
      formatMonthlyLimit: (limit: string) =>
        t("rateLimits.monthly", "{{limit}} requests/month", { limit }),
      formatTrialDays: (count: number) =>
        t("trial.days", "{{count}} day free trial", { count }),
      formatTrialWeeks: (count: number) =>
        t("trial.weeks", "{{count}} week free trial", { count }),
      formatTrialMonths: (count: number) =>
        t("trial.months", "{{count}} month free trial", { count }),
      formatSavePercent: (percent: number) =>
        t("badges.savePercent", "Save {{percent}}%", { percent }),
      formatIntroNote: (price: string) =>
        t("intro.note", "Then {{price}}", { price }),
    }),
    [t]
  );

  return (
    <AppSubscriptionsPage
      subscription={subscriptionContext}
      subscriptionUserId={currentEntityId ?? undefined}
      labels={labels}
      formatters={formatters}
      packageEntitlementMap={PACKAGE_ENTITLEMENT_MAP}
      onPurchaseSuccess={handlePurchaseSuccess}
      onRestoreSuccess={handleRestoreSuccess}
      onError={handleError}
      onWarning={handleWarning}
    />
  );
}
