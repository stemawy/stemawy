"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useEffect, useState } from "react";
import styles from "@/app/settings/settings.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function ThemeSetting({
  onChange,
}: {
  onChange: (message: string) => void;
}) {
  const { theme, setTheme } = useTheme();
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const options: Array<{
    value: "light" | "dark" | "system";
    label: string;
    icon: typeof Sun;
  }> = [
    { value: "light", label: t.settings.light, icon: Sun },
    { value: "dark", label: t.settings.dark, icon: Moon },
    { value: "system", label: t.settings.auto, icon: Monitor },
  ];
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <h3>
          <span className={styles.rowIcon}>
            <Sun size={19} />
          </span>
          {t.settings.theme}
        </h3>
        <p>{t.settings.themeDescription}</p>
      </div>
      <div className={styles.controlGroup}>
        {options.map(({ value, label, icon: Icon }) => (
          <button
            className={mounted && theme === value ? styles.controlActive : ""}
            key={value}
            type="button"
            aria-pressed={mounted && theme === value}
            onClick={() => {
              setTheme(value);
              onChange(`${t.settings.themeSwitched} ${label}`);
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
