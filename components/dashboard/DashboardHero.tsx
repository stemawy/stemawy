import GradeSemesterSelector from "./GradeSemesterSelector";

import type { Grade, Semester } from "@/data/subjects";
import styles from "@/app/dashboard/dashborad.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

type DashboardHeroProps = {
  grade: Grade;
  semester: Semester;
  onGradeChange: (grade: Grade) => void;
  onSemesterChange: (semester: Semester) => void;
};

export default function DashboardHero({
  grade,
  semester,
  onGradeChange,
  onSemesterChange,
}: DashboardHeroProps) {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <GradeSemesterSelector
          grade={grade}
          semester={semester}
          onGradeChange={onGradeChange}
          onSemesterChange={onSemesterChange}
        />
        <h1>
          {t.dashboard.greeting} <span>{t.dashboard.greetingAccent}</span>
        </h1>
        <p>{t.dashboard.progress}</p>
      </div>
    </section>
  );
}
