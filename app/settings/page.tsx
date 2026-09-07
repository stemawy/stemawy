"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsSection from "@/components/settings/SettingsSection";
import ThemeSetting from "@/components/settings/ThemeSetting";
import LanguageSetting from "@/components/settings/LanguageSetting";
import GradeSetting from "@/components/settings/GradeSetting";
import SemesterSetting from "@/components/settings/SemesterSetting";
import DataStorageSetting from "@/components/settings/DataStorageSetting";
import ResetConfirmation from "@/components/settings/ResetConfirmation";
import SettingsToast from "@/components/settings/SettingsToast";
import styles from "./settings.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";

export default function SettingsPage() {
  const {
    language,
    grade,
    semester,
    setLanguage,
    setGrade,
    setSemester,
    resetPreferences,
  } = useLayoutState();
  const { setTheme } = useTheme();
  const [toast, setToast] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = (message: string) => setToast(message);
  const changeLanguage = (value: "en" | "ar") => {
    setLanguage(value);
    notify(
      value === "ar"
        ? "Language switched to Arabic (RTL)"
        : "Language switched to English",
    );
  };
  const changeGrade = (value: 10 | 11) => {
    setGrade(value);
    notify(`Active grade set to Grade ${value}`);
  };
  const changeSemester = (value: 1 | 2) => {
    setSemester(value);
    notify(`Default semester set to Semester ${value}`);
  };
  const clearSaved = () => {
    window.localStorage.removeItem("stemawy-saved");
    notify("Saved content cleared");
  };
  const clearSearches = () => {
    window.localStorage.removeItem("stemawy-searches");
    notify("Recent searches cleared");
  };
  const resetAll = () => {
    window.localStorage.clear();
    resetPreferences();
    setTheme("light");
    setConfirmReset(false);
    notify("All local data and preferences were reset");
  };

  return (
    <div className={styles.page}>
      <SettingsHeader />
      <SettingsSection title="Interface">
        <ThemeSetting onChange={notify} />
        <LanguageSetting language={language} onChange={changeLanguage} />
      </SettingsSection>
      <SettingsSection title="Academic Context">
        <GradeSetting grade={grade} onChange={changeGrade} />
        <SemesterSetting semester={semester} onChange={changeSemester} />
      </SettingsSection>
      <SettingsSection title="Data & Storage">
        <DataStorageSetting
          onClearSaved={clearSaved}
          onClearSearches={clearSearches}
          onReset={() => setConfirmReset(true)}
        />
      </SettingsSection>
      <SettingsToast message={toast} />
      {confirmReset && (
        <ResetConfirmation
          onCancel={() => setConfirmReset(false)}
          onConfirm={resetAll}
        />
      )}
    </div>
  );
}
