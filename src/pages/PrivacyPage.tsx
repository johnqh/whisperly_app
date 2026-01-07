import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { CONSTANTS } from "../config/constants";

export function PrivacyPage() {
  const { t } = useTranslation("privacy");

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

          <h2>{t("sections.collection.title")}</h2>
          <p>{t("sections.collection.content")}</p>

          <h2>{t("sections.use.title")}</h2>
          <p>{t("sections.use.content")}</p>

          <h2>{t("sections.sharing.title")}</h2>
          <p>{t("sections.sharing.content")}</p>

          <h2>{t("sections.security.title")}</h2>
          <p>{t("sections.security.content")}</p>

          <h2>{t("sections.contact.title")}</h2>
          <p>{t("sections.contact.content")}</p>
        </div>
      </div>
    </ScreenContainer>
  );
}

export default PrivacyPage;
