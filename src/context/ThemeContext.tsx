import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Theme, FontSize } from "@sudobility/types";

const storage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors
    }
  },
};

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = storage.getItem("whisperly-theme");
    return (saved as Theme) || Theme.LIGHT;
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = storage.getItem("whisperly-font-size");
    return (saved as FontSize) || FontSize.MEDIUM;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storage.setItem("whisperly-theme", newTheme);
  };

  const setFontSize = (newFontSize: FontSize) => {
    setFontSizeState(newFontSize);
    storage.setItem("whisperly-font-size", newFontSize);
  };

  useEffect(() => {
    const root = document.documentElement;

    let actualTheme = theme;
    if (theme === Theme.SYSTEM) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      actualTheme = prefersDark ? Theme.DARK : Theme.LIGHT;
    }

    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);

    root.classList.remove("font-small", "font-medium", "font-large");
    root.classList.add(`font-${fontSize}`);
  }, [theme, fontSize]);

  useEffect(() => {
    if (theme === Theme.SYSTEM) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        const actualTheme = e.matches ? Theme.DARK : Theme.LIGHT;
        root.classList.remove("light", "dark");
        root.classList.add(actualTheme);
      };

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    fontSize,
    setTheme,
    setFontSize,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
