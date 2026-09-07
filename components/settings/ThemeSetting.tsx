"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "@/app/settings/settings.module.scss";

export default function ThemeSetting({
  onChange,
}: {
  onChange: (message: string) => void;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "Auto", icon: Monitor },
  ];
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <h3>
          <span className={styles.rowIcon}>
            <Sun size={19} />
          </span>
          Theme
        </h3>
        <p>Choose light, dark, or sync with your system preference</p>
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
              onChange(`Theme switched to ${label}`);
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
