import { GraduationCap } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";

export default function GradeSetting({
  grade,
  onChange,
}: {
  grade: 10 | 11;
  onChange: (grade: 10 | 11) => void;
}) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <h3>
          <span className={styles.rowIcon}>
            <GraduationCap size={19} />
          </span>
          Current Grade
        </h3>
        <p>
          Switches syllabus units, active Capstone challenges, and relevant past
          papers for Grade 10 and Grade 11.
        </p>
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
            Grade {value}
          </button>
        ))}
      </div>
    </div>
  );
}
