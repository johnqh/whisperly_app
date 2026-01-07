import { Link, type LinkProps } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { forwardRef } from "react";

interface LocalizedLinkProps extends Omit<LinkProps, "to"> {
  to: string;
  skipLocalization?: boolean;
}

export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ to, skipLocalization = false, children, ...props }, ref) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language || "en";

    // Don't localize external links, hash links, or if explicitly skipped
    const shouldLocalize =
      !skipLocalization &&
      !to.startsWith("http") &&
      !to.startsWith("#") &&
      !to.startsWith("mailto:");

    const localizedTo = shouldLocalize ? `/${currentLang}${to}` : to;

    return (
      <Link ref={ref} to={localizedTo} {...props}>
        {children}
      </Link>
    );
  },
);

LocalizedLink.displayName = "LocalizedLink";

export default LocalizedLink;
