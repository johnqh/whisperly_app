import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useTheme } from "../context/ThemeContext";
import { CONSTANTS } from "../config/constants";
import { GlobalSettingsPage } from "@sudobility/building_blocks";
import { Theme, FontSize } from "@sudobility/types";

export function SettingsPage() {
  const { t } = useTranslation("settings");
  const { theme, setTheme, fontSize, setFontSize } = useTheme();

  return (
    <ScreenContainer>
      <Helmet>
        <title>{t("meta.title")} | {CONSTANTS.APP_NAME}</title>
      </Helmet>

      {/* GlobalSettingsPage is a full-page master-detail layout */}
      <GlobalSettingsPage
        theme={theme}
        fontSize={fontSize}
        onThemeChange={(value) => setTheme(value as Theme)}
        onFontSizeChange={(value) => setFontSize(value as FontSize)}
        t={(key, fallback) => t(key, { defaultValue: fallback })}
        appearanceT={(key, fallback) => t(`appearance.${key}`, { defaultValue: fallback })}
        showAppearanceInfoBox={true}
      />
    </ScreenContainer>
  );
}

export default SettingsPage;
