import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { CONSTANTS } from "../config/constants";

export function TermsPage() {
  const { t } = useTranslation("terms");

  return (
    <ScreenContainer>
      <Helmet>
        <title>{t("meta.title")} | {CONSTANTS.APP_NAME}</title>
        <meta name="description" content={t("meta.description")} />
      </Helmet>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">{t("title")}</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">{t("lastUpdated")}</p>
          <p>{t("intro")}</p>

          <h2>{t("sections.acceptance.title")}</h2>
          <p>{t("sections.acceptance.content")}</p>

          <h2>{t("sections.services.title")}</h2>
          <p>{t("sections.services.content")}</p>

          <h2>{t("sections.accounts.title")}</h2>
          <p>{t("sections.accounts.content")}</p>

          <h2>{t("sections.usage.title")}</h2>
          <p>{t("sections.usage.content")}</p>

          <h2>{t("sections.termination.title")}</h2>
          <p>{t("sections.termination.content")}</p>

          <h2>{t("sections.contact.title")}</h2>
          <p>{t("sections.contact.content")}</p>
        </div>
      </div>
    </ScreenContainer>
  );
}

export default TermsPage;
