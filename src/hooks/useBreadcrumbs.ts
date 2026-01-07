import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();

  return useMemo(() => {
    const pathWithoutLang = location.pathname.replace(`/${lang}`, "");
    const segments = pathWithoutLang.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [{ label: t("common:nav.home") }];
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: t("common:nav.home"), href: "/" },
    ];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Try to get translation for this segment
      let label = t(`common:nav.${segment}`, { defaultValue: "" });

      // If no translation found, format the segment
      if (!label) {
        label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  }, [location.pathname, lang, t]);
}

export default useBreadcrumbs;
