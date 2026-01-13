import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Section } from "../components/layout/Section";
import { CONSTANTS } from "../config/constants";
import { AppTextPage } from "@sudobility/building_blocks";
import type { TextPageContent } from "@sudobility/building_blocks";

export function TermsPage() {
  const { t } = useTranslation("terms");
  const appName = CONSTANTS.APP_NAME;

  // Build the text content from i18n translations
  const text: TextPageContent = {
    title: t("title"),
    lastUpdated: t("lastUpdated", { date: "{{date}}" }),
    sections: [
      // Section 1: Acceptance of Terms
      {
        title: t("sections.acceptance.title"),
        content: t("sections.acceptance.content"),
      },
      // Section 2: Services
      {
        title: t("sections.services.title"),
        content: t("sections.services.content"),
      },
      // Section 3: User Accounts
      {
        title: t("sections.accounts.title"),
        content: t("sections.accounts.content"),
      },
      // Section 4: Acceptable Use
      {
        title: t("sections.usage.title"),
        content: t("sections.usage.content"),
      },
      // Section 5: API Usage
      {
        title: "API Usage and Rate Limits",
        content: "Your use of the API is subject to rate limits based on your subscription tier. We reserve the right to throttle or suspend access for excessive usage or abuse.",
      },
      // Section 6: Intellectual Property
      {
        title: "Intellectual Property",
        content: `${appName} and its original content, features, and functionality are owned by ${CONSTANTS.COMPANY_NAME} and are protected by international copyright, trademark, and other intellectual property laws. Your data and translation outputs remain yours.`,
      },
      // Section 7: Limitation of Liability
      {
        title: "Limitation of Liability",
        content: `${appName} is provided 'as is' without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.`,
      },
      // Section 8: Termination
      {
        title: t("sections.termination.title"),
        content: t("sections.termination.content"),
      },
      // Section 9: Changes to Terms
      {
        title: "Changes to Terms",
        content: "We reserve the right to modify these terms at any time. We will notify you of significant changes via email or through the service. Continued use after changes constitutes acceptance of the new terms.",
      },
    ],
    contact: {
      title: t("sections.contact.title"),
      description: "For questions about these Terms of Service, please contact us:",
      info: {
        emailLabel: "Email:",
        email: CONSTANTS.SUPPORT_EMAIL,
        websiteLabel: "Website:",
        websiteUrl: `https://${CONSTANTS.APP_DOMAIN}`,
      },
    },
  };

  return (
    <ScreenContainer>
      <Helmet>
        <title>{t("meta.title")} | {appName}</title>
        <meta name="description" content={t("meta.description")} />
      </Helmet>

      <Section spacing="3xl">
        <AppTextPage
          text={text}
          lastUpdatedDate={new Date().toLocaleDateString()}
        />
      </Section>
    </ScreenContainer>
  );
}

export default TermsPage;
