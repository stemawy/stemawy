import { GraduationCap } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function GradeSetting({
  grade,
  onChange,
}: {
  grade: 10 | 11;
  onChange: (grade: 10 | 11) => void;
}) {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <h3>
          <span className={styles.rowIcon}>
            <GraduationCap size={19} />
          </span>
          {t.settings.currentGrade}
        </h3>
        <p>{t.settings.gradeDescription}</p>
      </div>
      <div className={styles.controlGroup}>
        {([10, 11] as const).map((value) => (
          <button
            className={grade === value ? styles.controlActive : ""}
            key={value}
            type="button"
            aria-pressed={grade === value}
            onClick={() => onChange(value)}
          >
            {t.settings.grade} {value}
          </button>
        ))}
      </div>
    </div>
  );
}
