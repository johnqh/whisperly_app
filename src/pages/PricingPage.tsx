import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { CONSTANTS } from "../config/constants";

export function PricingPage() {
  const { t } = useTranslation("pricing");

  return (
    <ScreenContainer>
      <Helmet>
        <title>{t("meta.title")} | {CONSTANTS.APP_NAME}</title>
        <meta name="description" content={t("meta.description")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-4 text-center text-4xl font-bold">{t("title")}</h1>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {["free", "pro", "enterprise"].map((plan) => (
            <div
              key={plan}
              className={`rounded-lg border p-6 ${
                plan === "pro" ? "border-primary shadow-lg" : "border-border"
              }`}
            >
              <h3 className="mb-2 text-xl font-semibold">
                {t(`plans.${plan}.name`)}
              </h3>
              <p className="mb-4 text-3xl font-bold">
                {t(`plans.${plan}.price`)}
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                {t(`plans.${plan}.description`)}
              </p>
              <ul className="mb-6 space-y-2 text-sm">
                {(t(`plans.${plan}.features`, { returnObjects: true }) as string[]).map(
                  (feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  )
                )}
              </ul>
              <button
                className={`w-full rounded-md px-4 py-2 font-medium ${
                  plan === "pro"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {t(`plans.${plan}.cta`)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}

export default PricingPage;
