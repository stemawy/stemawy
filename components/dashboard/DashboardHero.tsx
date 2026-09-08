import GradeSemesterSelector from "./GradeSemesterSelector";

import type { Grade, Semester } from "@/data/subjects";
import styles from "@/app/dashboard/dashborad.module.scss";

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
          Good Morning! <span>Ready to learn?</span>
        </h1>
        <p>
          Your progress is saved locally. Continue your journey in Physics and
          Mathematics today.
        </p>
      </div>
    </section>
  );
}
