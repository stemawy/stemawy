"use client";

import * as React from "react";

export type Appearance = "light" | "dark" | "system";
export type ThemeFamily = "default" | "ramadan" | "christmas";

type ThemeContextValue = {
  appearance: Appearance;
  theme: ThemeFamily;
  resolvedTheme: "light" | "dark";
  setAppearance: (appearance: Appearance) => void;
  setTheme: (theme: ThemeFamily) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearanceState] = React.useState<Appearance>("system");
  const [theme, setThemeState] = React.useState<ThemeFamily>("default");

  React.useEffect(() => {
    const savedAppearance = window.localStorage.getItem(
      "stemawy-appearance",
    ) as Appearance | null;
    const savedTheme = window.localStorage.getItem(
      "stemawy-theme-family",
    ) as ThemeFamily | null;
    const legacyTheme = window.localStorage.getItem("stemawy-theme");

    if (savedAppearance) setAppearanceState(savedAppearance);
    if (savedTheme) setThemeState(savedTheme);

    if (!savedAppearance && !savedTheme && legacyTheme) {
      if (legacyTheme === "ramadan" || legacyTheme === "christmas") {
        setThemeState(legacyTheme);
        setAppearanceState(legacyTheme === "ramadan" ? "dark" : "light");
      } else if (
        legacyTheme === "light" ||
        legacyTheme === "dark" ||
        legacyTheme === "system"
      ) {
        setAppearanceState(legacyTheme);
      }
    }
  }, []);

  const resolvedTheme = appearance === "system" ? getSystemTheme() : appearance;

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      "light",
      "dark",
      "ramadan-light",
      "ramadan-dark",
      "christmas-light",
      "christmas-dark",
    );
    root.classList.add(
      theme === "default" ? resolvedTheme : `${theme}-${resolvedTheme}`,
    );
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, theme]);

  const setAppearance = React.useCallback((nextAppearance: Appearance) => {
    setAppearanceState(nextAppearance);
    window.localStorage.setItem("stemawy-appearance", nextAppearance);
  }, []);

  const setTheme = React.useCallback((nextTheme: ThemeFamily) => {
    setThemeState(nextTheme);
    window.localStorage.setItem("stemawy-theme-family", nextTheme);
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      appearance,
      theme,
      resolvedTheme,
      setAppearance,
      setTheme,
    }),
    [appearance, resolvedTheme, setAppearance, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
