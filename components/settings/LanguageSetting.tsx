"use client";

import { Languages } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";

export default function LanguageSetting({
  language,
  onChange,
}: {
  language: "en" | "ar";
  onChange: (language: "en" | "ar") => void;
}) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <h3>
          <span className={styles.rowIcon}>
            <Languages size={19} />
          </span>
          Language
        </h3>
        <p>Switch between English and full Arabic localized layout</p>
      </div>
      <div className={styles.controlGroup}>
        <button
          className={language === "en" ? styles.controlActive : ""}
          type="button"
          aria-pressed={language === "en"}
          onClick={() => onChange("en")}
        >
          English
        </button>
        <button
          className={language === "ar" ? styles.controlActive : ""}
          type="button"
          aria-pressed={language === "ar"}
          onClick={() => onChange("ar")}
        >
          العربية <small>RTL</small>
        </button>
      </div>
    </div>
  );
}
