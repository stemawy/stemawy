"use client";

import {
  Check,
  Gift,
  Monitor,
  Moon,
  MoonStar,
  Palette,
  Sun,
} from "lucide-react";
import {
  type Appearance,
  type ThemeFamily,
  useTheme,
} from "@/components/ui/theme-provider";
import { useEffect, useState } from "react";
import styles from "@/app/settings/settings.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function ThemeSetting({
  onChange,
}: {
  onChange: (message: string) => void;
}) {
  const { appearance, theme, setAppearance, setTheme } = useTheme();
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const appearanceOptions: Array<{
    value: Appearance;
    label: string;
    icon: typeof Sun;
  }> = [
    { value: "light", label: t.settings.light, icon: Sun },
    { value: "dark", label: t.settings.dark, icon: Moon },
    { value: "system", label: t.settings.auto, icon: Monitor },
  ];
  const themeOptions: Array<{
    value: ThemeFamily;
    label: string;
    icon: typeof Sun;
  }> = [
    { value: "default", label: t.settings.defaultTheme, icon: Palette },
    { value: "ramadan", label: t.settings.ramadan, icon: MoonStar },
    { value: "christmas", label: t.settings.christmas, icon: Gift },
  ];

  const renderOptions = (
    options: Array<{
      value: Appearance | ThemeFamily;
      label: string;
      icon: typeof Sun;
    }>,
    selected: Appearance | ThemeFamily,
    onSelect: (value: Appearance | ThemeFamily) => void,
  ) =>
    options.map(({ value, label, icon: Icon }) => (
      <button
        className={mounted && selected === value ? styles.controlActive : ""}
        key={value}
        type="button"
        aria-pressed={mounted && selected === value}
        onClick={() => {
          onSelect(value);
          onChange(`${t.settings.themeSwitched} ${label}`);
        }}
      >
        <Icon size={14} />
        {label}
        {mounted && selected === value && <Check size={13} />}
      </button>
    ));

  return (
    <>
      <div className={styles.settingRow}>
        <div className={styles.settingInfo}>
          <h3>
            <span className={styles.rowIcon}>
              <Sun size={19} />
            </span>
            {t.settings.appearance}
          </h3>
          <p>{t.settings.appearanceDescription}</p>
        </div>
        <div className={`${styles.controlGroup} ${styles.themeOptions}`}>
          {renderOptions(appearanceOptions, appearance, (value) =>
            setAppearance(value as Appearance),
          )}
        </div>
      </div>

      <div className={styles.settingRow}>
        <div className={styles.settingInfo}>
          <h3>
            <span className={styles.rowIcon}>
              <Palette size={19} />
            </span>
            {t.settings.theme}
          </h3>
          <p>{t.settings.themeDescription}</p>
        </div>
        <div className={`${styles.controlGroup} ${styles.themeOptions}`}>
          {renderOptions(themeOptions, theme, (value) =>
            setTheme(value as ThemeFamily),
          )}
        </div>
      </div>
    </>
  );
}
