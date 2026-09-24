import { CalendarDays } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function SemesterSetting({
  semester,
  onChange,
}: {
  semester: 1 | 2;
  onChange: (semester: 1 | 2) => void;
}) {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <h3>
          <span className={styles.rowIcon}>
            <CalendarDays size={19} />
          </span>
          {t.settings.defaultSemester}
        </h3>
        <p>{t.settings.semesterDescription}</p>
      </div>
      <div className={styles.controlGroup}>
        {([1, 2] as const).map((value) => (
          <button
            className={semester === value ? styles.controlActive : ""}
            key={value}
            type="button"
            aria-pressed={semester === value}
            onClick={() => onChange(value)}
          >
            {t.settings.semester} {value}
          </button>
        ))}
      </div>
    </div>
  );
}
