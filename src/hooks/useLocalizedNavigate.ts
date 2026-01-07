import { useNavigate, type NavigateOptions } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const localizedNavigate = useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        navigate(to);
        return;
      }

      const currentLang = i18n.language || "en";

      // Don't localize external links, hash links, or already localized paths
      const shouldLocalize =
        !to.startsWith("http") &&
        !to.startsWith("#") &&
        !to.startsWith("mailto:") &&
        !to.match(/^\/[a-z]{2}(\/|$)/);

      const localizedTo = shouldLocalize ? `/${currentLang}${to}` : to;
      navigate(localizedTo, options);
    },
    [navigate, i18n.language],
  );

  return localizedNavigate;
}

export default useLocalizedNavigate;
