import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { BreadcrumbItem } from "../hooks/useBreadcrumbs";

interface LayoutContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
  showFooter: boolean;
  setShowFooter: (show: boolean) => void;
  compactFooter: boolean;
  setCompactFooter: (compact: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbItem[]>([]);
  const [pageTitle, setPageTitleState] = useState("");
  const [showFooter, setShowFooterState] = useState(true);
  const [compactFooter, setCompactFooterState] = useState(false);

  const setBreadcrumbs = useCallback((items: BreadcrumbItem[]) => {
    setBreadcrumbsState(items);
  }, []);

  const setPageTitle = useCallback((title: string) => {
    setPageTitleState(title);
  }, []);

  const setShowFooter = useCallback((show: boolean) => {
    setShowFooterState(show);
  }, []);

  const setCompactFooter = useCallback((compact: boolean) => {
    setCompactFooterState(compact);
  }, []);

  const value: LayoutContextType = {
    breadcrumbs,
    setBreadcrumbs,
    pageTitle,
    setPageTitle,
    showFooter,
    setShowFooter,
    compactFooter,
    setCompactFooter,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export default LayoutContext;
