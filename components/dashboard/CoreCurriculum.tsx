import Link from "next/link";

import type { Subject } from "@/data/subjects";
import styles from "@/app/dashboard/dashborad.module.scss";
import {
  getSubjectColorStyle,
  renderSubjectIcon,
} from "@/components/subjects/subject-icons";

export default function CoreCurriculum({ subjects }: { subjects: Subject[] }) {
  return (
    <section className={`${styles.section} ${styles.curriculum}`}>
      <div className={styles.sectionHeading}>
        <h2>
          Core Curriculum <span>Current selection</span>
        </h2>
        <Link href="/subjects">View All</Link>
      </div>
      <div className={styles.curriculumGrid}>
        {subjects.slice(0, 6).map((subject) => {
          const unitCount = subject.content.filter(
            (item) => item.type === "unit",
          ).length;

          return (
            <Link
              className={styles.curriculumCard}
              href={`/subject/${subject.id}`}
              key={subject.id}
            >
              <span
                className={styles.backgroundSubjectIcon}
                style={{ color: getSubjectColorStyle(subject).color }}
                aria-hidden="true"
              >
                {renderSubjectIcon(subject, 154)}
              </span>
              <div className={styles.cardTop}>
                <span
                  className={styles.curriculumIcon}
                  style={getSubjectColorStyle(subject)}
                >
                  {renderSubjectIcon(subject, 24)}
                </span>
                <small>{unitCount} Units</small>
              </div>
              <h3>{subject.name}</h3>
              <p>{subject.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
