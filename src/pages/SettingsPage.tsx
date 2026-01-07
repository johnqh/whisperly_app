import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useTheme } from "../context/ThemeContext";
import { CONSTANTS, SUPPORTED_LANGUAGES } from "../config/constants";
import { Theme, FontSize } from "@sudobility/types";

export function SettingsPage() {
  const { t, i18n } = useTranslation("settings");
  const { theme, setTheme, fontSize, setFontSize } = useTheme();

  return (
    <ScreenContainer>
      <Helmet>
        <title>{t("meta.title")} | {CONSTANTS.APP_NAME}</title>
      </Helmet>

      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

        <div className="space-y-8">
          {/* Theme */}
          <div className="rounded-lg border border-border p-6">
            <h2 className="mb-4 text-lg font-semibold">{t("appearance.title")}</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t("appearance.theme")}
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2"
                >
                  <option value={Theme.LIGHT}>{t("appearance.themes.light")}</option>
                  <option value={Theme.DARK}>{t("appearance.themes.dark")}</option>
                  <option value={Theme.SYSTEM}>{t("appearance.themes.system")}</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {t("appearance.fontSize")}
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as FontSize)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2"
                >
                  <option value={FontSize.SMALL}>{t("appearance.fontSizes.small")}</option>
                  <option value={FontSize.MEDIUM}>{t("appearance.fontSizes.medium")}</option>
                  <option value={FontSize.LARGE}>{t("appearance.fontSizes.large")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="rounded-lg border border-border p-6">
            <h2 className="mb-4 text-lg font-semibold">{t("language.title")}</h2>
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}

export default SettingsPage;
