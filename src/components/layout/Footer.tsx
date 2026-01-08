import { useTranslation } from "react-i18next";
import {
  Footer as FooterContainer,
  FooterGrid,
  FooterBrand,
  FooterLinkSection,
  FooterLink,
  FooterBottom,
  FooterCompact,
  FooterCompactLeft,
  FooterCompactRight,
  FooterVersion,
  FooterCopyright,
} from "@sudobility/components";
import { SystemStatusIndicator, useNetwork } from "@sudobility/devops-components";
import { CONSTANTS } from "../../config/constants";
import LocalizedLink from "./LocalizedLink";

interface FooterProps {
  variant?: "full" | "compact";
}

export function Footer({ variant = "full" }: FooterProps) {
  const { t } = useTranslation("common");
  const currentYear = String(new Date().getFullYear());
  const { isOnline } = useNetwork();

  if (variant === "compact") {
    return (
      <FooterContainer variant="compact" sticky>
        <FooterCompact>
          <FooterCompactLeft>
            <FooterVersion version={CONSTANTS.APP_VERSION} />
            <FooterCopyright
              year={currentYear}
              companyName={CONSTANTS.COMPANY_NAME}
            />
            {CONSTANTS.STATUS_PAGE_URL && (
              <SystemStatusIndicator
                statusPageUrl={CONSTANTS.STATUS_PAGE_URL}
                apiEndpoint={CONSTANTS.STATUS_PAGE_API_URL}
                refreshInterval={60000}
                size="sm"
                version={CONSTANTS.APP_VERSION}
                isNetworkOnline={isOnline}
              />
            )}
          </FooterCompactLeft>
          <FooterCompactRight>
            <LocalizedLink
              to="/privacy"
              className="text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            >
              {t("footer.privacy")}
            </LocalizedLink>
            <LocalizedLink
              to="/terms"
              className="text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            >
              {t("footer.terms")}
            </LocalizedLink>
          </FooterCompactRight>
        </FooterCompact>
      </FooterContainer>
    );
  }

  return (
    <FooterContainer variant="full">
      <FooterGrid className="md:grid-cols-3">
        <FooterLinkSection title={t("footer.product")}>
          <FooterLink>
            <LocalizedLink to="/docs">{t("nav.docs")}</LocalizedLink>
          </FooterLink>
          <FooterLink>
            <LocalizedLink to="/pricing">{t("nav.pricing")}</LocalizedLink>
          </FooterLink>
          <FooterLink>
            <LocalizedLink to="/docs/api">
              {t("footer.apiDocs")}
            </LocalizedLink>
          </FooterLink>
        </FooterLinkSection>

        <FooterLinkSection title={t("nav.useCases")}>
          <FooterLink>
            <LocalizedLink to="/use-cases/websites">
              {t("nav.useCases.websites")}
            </LocalizedLink>
          </FooterLink>
          <FooterLink>
            <LocalizedLink to="/use-cases/apps">
              {t("nav.useCases.apps")}
            </LocalizedLink>
          </FooterLink>
          <FooterLink>
            <LocalizedLink to="/use-cases/documents">
              {t("nav.useCases.documents")}
            </LocalizedLink>
          </FooterLink>
        </FooterLinkSection>

        <FooterLinkSection title={t("footer.legal")}>
          <FooterLink>
            <LocalizedLink to="/privacy">
              {t("footer.privacy")}
            </LocalizedLink>
          </FooterLink>
          <FooterLink>
            <LocalizedLink to="/terms">
              {t("footer.terms")}
            </LocalizedLink>
          </FooterLink>
        </FooterLinkSection>
      </FooterGrid>

      <FooterBottom>
        <FooterBrand
          description={t("footer.description")}
          className="flex flex-col items-center"
        >
          <LocalizedLink to="/">
            <span className="text-lg font-bold">{CONSTANTS.APP_NAME}</span>
          </LocalizedLink>
        </FooterBrand>
        <FooterVersion version={CONSTANTS.APP_VERSION} />
        <FooterCopyright
          year={currentYear}
          companyName={CONSTANTS.COMPANY_NAME}
        />
        {CONSTANTS.STATUS_PAGE_URL && (
          <SystemStatusIndicator
            statusPageUrl={CONSTANTS.STATUS_PAGE_URL}
            apiEndpoint={CONSTANTS.STATUS_PAGE_API_URL}
            refreshInterval={60000}
            size="sm"
            version={CONSTANTS.APP_VERSION}
            isNetworkOnline={isOnline}
          />
        )}
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;
