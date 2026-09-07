import { CalendarDays } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";

export default function SemesterSetting({
  semester,
  onChange,
}: {
  semester: 1 | 2;
  onChange: (semester: 1 | 2) => void;
}) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <h3>
          <span className={styles.rowIcon}>
            <CalendarDays size={19} />
          </span>
          Default Semester
        </h3>
        <p>Your preferred semester for dashboards and curriculum views.</p>
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
            Semester {value}
          </button>
        ))}
      </div>
    </div>
  );
}
