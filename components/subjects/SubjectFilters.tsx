import { Search } from "lucide-react";

import type { Grade, Semester } from "@/data/subjects";
import styles from "@/app/subjects/subjects.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

type SubjectFiltersProps = {
  grade: Grade;
  semester: Semester;
  query: string;
  onGradeChange: (grade: Grade) => void;
  onSemesterChange: (semester: Semester) => void;
  onQueryChange: (query: string) => void;
};

export default function SubjectFilters({
  grade,
  semester,
  query,
  onGradeChange,
  onSemesterChange,
  onQueryChange,
}: SubjectFiltersProps) {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <div className={styles.filters}>
      <div
        className={styles.segmentedControl}
        aria-label={t.subjects.chooseGrade}
      >
        {[10, 11].map((value) => (
          <button
            className={grade === value ? styles.selected : ""}
            key={value}
            type="button"
            aria-pressed={grade === value}
            onClick={() => onGradeChange(value as Grade)}
          >
            {language === "ar" ? `الصف ${value}` : `Grade ${value}`}
          </button>
        ))}
      </div>
      <div
        className={styles.segmentedControl}
        aria-label={t.subjects.chooseSemester}
      >
        {[1, 2].map((value) => (
          <button
            className={semester === value ? styles.selected : ""}
            key={value}
            type="button"
            aria-pressed={semester === value}
            onClick={() => onSemesterChange(value as Semester)}
          >
            {language === "ar"
              ? `${t.subjects.semester} ${value}`
              : `Semester ${value}`}
          </button>
        ))}
      </div>
      <label className={styles.searchBox}>
        <Search size={21} aria-hidden="true" />
        <span className={styles.srOnly}>{t.subjects.title}</span>
        <input
          type="search"
          value={query}
          placeholder={t.subjects.searchPlaceholder}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
    </div>
  );
}
