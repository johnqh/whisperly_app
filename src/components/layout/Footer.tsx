import { useTranslation } from "react-i18next";
import {
  AppFooter,
  AppFooterForHomePage,
  type FooterLinkSection,
} from "@sudobility/building_blocks";
import { SystemStatusIndicator, useNetwork } from "@sudobility/devops-components";
import { CONSTANTS } from "../../config/constants";
import LocalizedLink from "./LocalizedLink";
import { useBuildingBlocksAnalytics } from "../../hooks/useBuildingBlocksAnalytics";

interface FooterProps {
  variant?: "full" | "compact";
}

// Link wrapper for footer
const LinkWrapper = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <LocalizedLink to={href} className={className}>
    {children}
  </LocalizedLink>
);

export function Footer({ variant = "full" }: FooterProps) {
  const { t } = useTranslation("common");
  const currentYear = String(new Date().getFullYear());
  const { isOnline } = useNetwork();
  const onTrack = useBuildingBlocksAnalytics();

  if (variant === "compact") {
    return (
      <AppFooter
        version={CONSTANTS.APP_VERSION}
        copyrightYear={currentYear}
        companyName={CONSTANTS.COMPANY_NAME}
        companyUrl="/"
        statusIndicator={
          CONSTANTS.STATUS_PAGE_URL
            ? {
                statusPageUrl: CONSTANTS.STATUS_PAGE_URL,
                apiEndpoint: CONSTANTS.STATUS_PAGE_API_URL,
                refreshInterval: 60000,
              }
            : undefined
        }
        StatusIndicatorComponent={SystemStatusIndicator}
        links={[
          { label: t("footer.privacy"), href: "/privacy" },
          { label: t("footer.terms"), href: "/terms" },
        ]}
        LinkComponent={LinkWrapper}
        isNetworkOnline={isOnline}
        onTrack={onTrack}
        sticky
      />
    );
  }

  const linkSections: FooterLinkSection[] = [
    {
      title: t("footer.product"),
      links: [
        { label: t("nav.docs"), href: "/docs" },
        { label: t("nav.pricing"), href: "/pricing" },
        { label: t("footer.apiDocs"), href: "/docs/api" },
      ],
    },
    {
      title: t("nav.useCases"),
      links: [
        { label: t("nav.useCases.websites"), href: "/use-cases/websites" },
        { label: t("nav.useCases.apps"), href: "/use-cases/apps" },
        { label: t("nav.useCases.documents"), href: "/use-cases/documents" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), href: "/privacy" },
        { label: t("footer.terms"), href: "/terms" },
      ],
    },
  ];

  return (
    <AppFooterForHomePage
      logo={{
        appName: CONSTANTS.APP_NAME,
      }}
      linkSections={linkSections}
      statusIndicator={
        CONSTANTS.STATUS_PAGE_URL
          ? {
              statusPageUrl: CONSTANTS.STATUS_PAGE_URL,
              apiEndpoint: CONSTANTS.STATUS_PAGE_API_URL,
              refreshInterval: 60000,
            }
          : undefined
      }
      StatusIndicatorComponent={SystemStatusIndicator}
      version={CONSTANTS.APP_VERSION}
      copyrightYear={currentYear}
      companyName={CONSTANTS.COMPANY_NAME}
      companyUrl="/"
      description={t("footer.description")}
      LinkComponent={LinkWrapper}
      isNetworkOnline={isOnline}
      onTrack={onTrack}
      gridColumns={3}
    />
  );
}

export default Footer;
