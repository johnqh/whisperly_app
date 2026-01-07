import { useEffect } from "react";
import { useParams, Navigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../config/constants";

export function LanguageValidator() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();

  // Sync i18n language with URL param
  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // If no lang param or invalid language, redirect to default
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang as (typeof SUPPORTED_LANGUAGES)[number])) {
    const defaultLang = i18n.language || "en";
    const pathWithoutLang = location.pathname.replace(/^\/[^/]+/, "");
    const newPath = `/${defaultLang}${pathWithoutLang || "/"}${location.search}${location.hash}`;
    return <Navigate to={newPath} replace />;
  }

  return <Outlet />;
}

export default LanguageValidator;
