import { BreadcrumbSection as SharedBreadcrumbSection } from "@sudobility/components";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

interface BreadcrumbSectionProps {
  shareConfig?: {
    title: string;
    description: string;
    hashtags: string[];
    onBeforeShare?: (baseUrl: string) => Promise<string>;
  };
}

export function BreadcrumbSection({ shareConfig }: BreadcrumbSectionProps) {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <SharedBreadcrumbSection
      items={breadcrumbs}
      shareConfig={shareConfig}
    />
  );
}

export default BreadcrumbSection;
