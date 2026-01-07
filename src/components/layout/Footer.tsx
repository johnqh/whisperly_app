import { useTranslation } from "react-i18next";
import { LocalizedLink } from "./LocalizedLink";
import { CONSTANTS } from "../../config/constants";

interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact = false }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  if (compact) {
    return (
      <footer className="border-t border-border bg-background py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
            <p>
              &copy; {currentYear} {CONSTANTS.APP_NAME}. {t("common:footer.rights")}
            </p>
            <div className="flex gap-4">
              <LocalizedLink to="/privacy" className="hover:text-foreground">
                {t("common:footer.privacy")}
              </LocalizedLink>
              <LocalizedLink to="/terms" className="hover:text-foreground">
                {t("common:footer.terms")}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{CONSTANTS.APP_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              {t("common:footer.description")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 font-medium">{t("common:footer.product")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <LocalizedLink to="/use-cases" className="hover:text-foreground">
                  {t("common:nav.useCases")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/pricing" className="hover:text-foreground">
                  {t("common:nav.pricing")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/docs" className="hover:text-foreground">
                  {t("common:nav.docs")}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-medium">{t("common:footer.resources")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <LocalizedLink to="/docs/getting-started" className="hover:text-foreground">
                  {t("common:footer.gettingStarted")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/docs/api" className="hover:text-foreground">
                  {t("common:footer.apiDocs")}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-medium">{t("common:footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <LocalizedLink to="/privacy" className="hover:text-foreground">
                  {t("common:footer.privacy")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink to="/terms" className="hover:text-foreground">
                  {t("common:footer.terms")}
                </LocalizedLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {CONSTANTS.APP_NAME}. {t("common:footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
