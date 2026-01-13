import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { Section } from "../components/layout/Section";
import { CONSTANTS } from "../config/constants";
import { AppTextPage } from "@sudobility/building_blocks";
import type { TextPageContent } from "@sudobility/building_blocks";

export function PrivacyPage() {
  const { t } = useTranslation("privacy");
  const appName = CONSTANTS.APP_NAME;

  // Build the text content from i18n translations
  const text: TextPageContent = {
    title: t("title"),
    lastUpdated: t("lastUpdated", { date: "{{date}}" }),
    sections: [
      // Introduction
      {
        title: t("sections.introduction.title"),
        content: t("sections.introduction.content"),
      },
      // Information We Collect
      {
        title: t("sections.collection.title"),
        subsections: [
          {
            title: "Information You Provide",
            items: [
              "Account information (email address, name)",
              "API usage data and translation requests",
              "Payment information (processed securely by our payment provider)",
              "Communications you send to us",
            ],
          },
          {
            title: "Information Collected Automatically",
            items: [
              "Device and browser information",
              "IP address and location data",
              "Usage patterns and analytics",
            ],
          },
        ],
      },
      // How We Use
      {
        title: t("sections.use.title"),
        description: "We use the information we collect to:",
        items: [
          "Provide, maintain, and improve our translation services",
          "Process transactions and send related information",
          "Send technical notices, updates, and support messages",
          "Respond to your comments, questions, and requests",
          "Monitor and analyze usage patterns and trends",
        ],
      },
      // Information Sharing
      {
        title: t("sections.sharing.title"),
        description: "We may share your information in the following circumstances:",
        items: [
          "With service providers who assist in our operations",
          "When required by law or legal process",
          "To protect our rights and safety",
          "With your consent",
        ],
      },
      // Data Security
      {
        title: t("sections.security.title"),
        description: "We implement appropriate security measures:",
        items: [
          "Encryption of data in transit and at rest",
          "Regular security assessments",
          "Access controls and authentication",
          "Secure API key management",
        ],
      },
      // Data Retention
      {
        title: "Data Retention",
        content: "We retain your personal information for as long as your account is active or as needed to provide you services. You can request deletion of your account and associated data at any time.",
      },
      // Your Rights
      {
        title: "Your Rights",
        description: "You have the right to:",
        items: [
          "Access your personal information",
          "Correct inaccurate data",
          "Request deletion of your data",
          "Export your data in a portable format",
          "Opt out of marketing communications",
        ],
      },
      // International Transfers
      {
        title: "International Data Transfers",
        content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.",
      },
      // Children's Privacy
      {
        title: "Children's Privacy",
        content: "Our service is not intended for children under 13. We do not knowingly collect information from children under 13.",
      },
      // Cookies
      {
        title: "Cookies and Tracking",
        content: "We use essential cookies to maintain your session and preferences. We do not use third-party tracking cookies for advertising purposes.",
      },
      // Changes
      {
        title: "Changes to This Policy",
        content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date.",
      },
    ],
    contact: {
      title: t("sections.contact.title"),
      description: "If you have any questions about this Privacy Policy, please contact us:",
      info: {
        emailLabel: "Email:",
        email: CONSTANTS.SUPPORT_EMAIL,
        websiteLabel: "Website:",
        websiteUrl: `https://${CONSTANTS.APP_DOMAIN}`,
        dpoLabel: "Data Protection Officer:",
        dpoEmail: CONSTANTS.SUPPORT_EMAIL,
      },
      gdprNotice: {
        title: "GDPR Rights",
        content: "If you are in the European Union, you have additional rights under GDPR including the right to lodge a complaint with a supervisory authority.",
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

export default PrivacyPage;
