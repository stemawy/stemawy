import Link from "next/link";

import type { Subject } from "@/data/subjects";
import styles from "@/app/dashboard/dashborad.module.scss";
import {
  getSubjectColorStyle,
  renderSubjectIcon,
} from "@/components/subjects/subject-icons";
import { useLayoutState } from "@/components/layout/layout-context";
import { getLocalizedSubject, getTranslations } from "@/lib/i18n";

export default function CoreCurriculum({ subjects }: { subjects: Subject[] }) {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <section className={`${styles.section} ${styles.curriculum}`}>
      <div className={styles.sectionHeading}>
        <h2>
          {t.dashboard.curriculum} <span>{t.dashboard.currentSelection}</span>
        </h2>
        <Link href="/subjects">{t.dashboard.viewAll}</Link>
      </div>
      <div className={styles.curriculumGrid}>
        {subjects.slice(0, 6).map((subject) => {
          const localized = getLocalizedSubject(subject, language);
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
                <small>
                  {unitCount} {t.dashboard.units}
                </small>
              </div>
              <h3>{localized.name}</h3>
              <p>{localized.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
