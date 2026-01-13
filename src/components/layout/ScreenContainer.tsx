import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { LayoutProvider } from "../../context/LayoutContext";
import { BreadcrumbSection } from "./BreadcrumbSection";

interface ScreenContainerProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
  showFooter?: boolean;
  compactFooter?: boolean;
  className?: string;
}

export function ScreenContainer({
  children,
  showBreadcrumbs = true,
  showFooter = true,
  compactFooter = false,
  className = "",
}: ScreenContainerProps) {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen flex-col">
        {/* Sticky header containing topbar and breadcrumbs */}
        <div className="sticky top-0 z-40">
          <TopBar />
          {showBreadcrumbs && <BreadcrumbSection />}
        </div>

        <main className={`flex-1 ${className}`}>
          {children}
        </main>

        {showFooter && <Footer variant={compactFooter ? "compact" : "full"} />}
      </div>
    </LayoutProvider>
  );
}

export default ScreenContainer;
