import { useTranslation } from "react-i18next";
import { AppBreadcrumbs } from "@sudobility/building_blocks";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { CONSTANTS } from "../../config/constants";

interface BreadcrumbSectionProps {
  shareConfig?: {
    title: string;
    description: string;
    hashtags: string[];
    onBeforeShare?: (baseUrl: string) => Promise<string>;
  };
}

export function BreadcrumbSection({ shareConfig }: BreadcrumbSectionProps) {
  const { t } = useTranslation("common");
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <AppBreadcrumbs
      items={breadcrumbs}
      shareConfig={shareConfig}
      talkToFounder={
        CONSTANTS.MEET_FOUNDER_URL
          ? {
              meetingUrl: CONSTANTS.MEET_FOUNDER_URL,
              buttonText: t("common.talkToFounder"),
            }
          : undefined
      }
    />
  );
}

export default BreadcrumbSection;
