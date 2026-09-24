"use client";

import { Languages } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";
import { getTranslations } from "@/lib/i18n";

export default function LanguageSetting({
  language,
  onChange,
}: {
  language: "en" | "ar";
  onChange: (language: "en" | "ar") => void;
}) {
  const t = getTranslations(language);

  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <h3>
          <span className={styles.rowIcon}>
            <Languages size={19} />
          </span>
          {t.common.language}
        </h3>
        <p>{t.common.languageDescription}</p>
      </div>
      <div className={styles.controlGroup}>
        <button
          className={language === "en" ? styles.controlActive : ""}
          type="button"
          aria-pressed={language === "en"}
          onClick={() => onChange("en")}
        >
          {t.common.english}
        </button>
        <button
          className={language === "ar" ? styles.controlActive : ""}
          type="button"
          aria-pressed={language === "ar"}
          onClick={() => onChange("ar")}
        >
          {t.common.arabic} <small>{t.common.rtl}</small>
        </button>
      </div>
    </div>
  );
}
