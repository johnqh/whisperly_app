import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../config/constants";

function detectBrowserLanguage(): string {
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const langCode = browserLang.split("-")[0].toLowerCase();

  // Check if browser language is supported
  if (SUPPORTED_LANGUAGES.includes(langCode as (typeof SUPPORTED_LANGUAGES)[number])) {
    return langCode;
  }

  return "en";
}

export function LanguageRedirect() {
  const location = useLocation();
  const { i18n } = useTranslation();

  // Try to get language from i18n (which may have been set from localStorage)
  // Otherwise detect from browser
  const targetLang = i18n.language || detectBrowserLanguage();

  // Preserve the rest of the path and query string
  const redirectPath = `/${targetLang}${location.pathname}${location.search}${location.hash}`;

  return <Navigate to={redirectPath} replace />;
}

export default LanguageRedirect;
