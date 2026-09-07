import { ChevronDown, GraduationCap } from "lucide-react";

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
        <div className={styles.selectorRow}>
          <GraduationCap size={17} />
          <label>
            <span className={styles.srOnly}>Grade</span>
            <select
              value={grade}
              onChange={(event) =>
                onGradeChange(Number(event.target.value) as Grade)
              }
            >
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
            </select>
          </label>
          <span aria-hidden="true">•</span>
          <label>
            <span className={styles.srOnly}>Semester</span>
            <select
              value={semester}
              onChange={(event) =>
                onSemesterChange(Number(event.target.value) as Semester)
              }
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </label>
          <ChevronDown size={15} aria-hidden="true" />
        </div>
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
