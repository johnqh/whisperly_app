import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Section } from "../components/layout/Section";
import { LocalizedLink } from "../components/layout/LocalizedLink";
import { CONSTANTS } from "../config/constants";

export function HomePage() {
  const { t } = useTranslation("home");

  return (
    <ScreenContainer showBreadcrumbs={false}>
      <Helmet>
        <title>{t("meta.title")} | {CONSTANTS.APP_NAME}</title>
        <meta name="description" content={t("meta.description")} />
      </Helmet>

      {/* Hero Section */}
      <Section spacing="5xl" background="gradient-hero" variant="hero">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <div className="flex justify-center gap-4">
            <LocalizedLink
              to="/login"
              className="rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("hero.cta.getStarted")}
            </LocalizedLink>
            <LocalizedLink
              to="/docs"
              className="rounded-md border border-border px-6 py-3 text-lg font-medium hover:bg-muted"
            >
              {t("hero.cta.learnMore")}
            </LocalizedLink>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section spacing="5xl">
        <h2 className="mb-12 text-center text-3xl font-bold">
          {t("features.title")}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {["fast", "accurate", "easy"].map((feature) => (
            <div key={feature} className="rounded-lg border border-border p-6">
              <h3 className="mb-2 text-xl font-semibold">
                {t(`features.${feature}.title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`features.${feature}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </ScreenContainer>
  );
}

export default HomePage;
