"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

import type { Grade, Semester } from "@/data/subjects";

type LayoutContextValue = {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
  grade: Grade;
  semester: Semester;
  language: "en" | "ar";
  setGrade: (grade: Grade) => void;
  setSemester: (semester: Semester) => void;
  setLanguage: (language: "en" | "ar") => void;
  resetPreferences: () => void;
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [grade, setGrade] = useState<Grade>(10);
  const [semester, setSemester] = useState<Semester>(1);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const hydrated = useRef(false);

  useEffect(() => {
    const savedCollapsed =
      window.localStorage.getItem("stemawy-sidebar-collapsed") === "true";
    const savedGrade = window.localStorage.getItem("stemawy-grade");
    const savedSemester = window.localStorage.getItem("stemawy-semester");
    const savedLanguage = window.localStorage.getItem("stemawy-language");

    queueMicrotask(() => {
      if (savedCollapsed) {
        setCollapsed(true);
      }
      if (savedGrade === "10" || savedGrade === "11")
        setGrade(Number(savedGrade) as Grade);
      if (savedSemester === "1" || savedSemester === "2")
        setSemester(Number(savedSemester) as Semester);
      if (savedLanguage === "en" || savedLanguage === "ar")
        setLanguage(savedLanguage);
      hydrated.current = true;
    });
  }, []);

  useEffect(() => {
    if (hydrated.current) {
      window.localStorage.setItem(
        "stemawy-sidebar-collapsed",
        String(collapsed),
      );
    }
  }, [collapsed]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    if (hydrated.current) {
      window.localStorage.setItem("stemawy-grade", String(grade));
      window.localStorage.setItem("stemawy-semester", String(semester));
      window.localStorage.setItem("stemawy-language", language);
    }
  }, [grade, semester, language]);

  const resetPreferences = () => {
    setGrade(10);
    setSemester(1);
    setLanguage("en");
    window.localStorage.removeItem("stemawy-grade");
    window.localStorage.removeItem("stemawy-semester");
    window.localStorage.removeItem("stemawy-language");
  };

  return (
    <LayoutContext.Provider
      value={{
        collapsed,
        mobileOpen,
        toggleCollapsed: () => setCollapsed((value) => !value),
        setMobileOpen,
        grade,
        semester,
        language,
        setGrade,
        setSemester,
        setLanguage,
        resetPreferences,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutState() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useLayoutState must be used inside LayoutProvider");
  }

  return context;
}
