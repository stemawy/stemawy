import Link from "next/link";
import { Atom, ChevronRight } from "lucide-react";

import type { Subject } from "@/types";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getLocalizedSubject, getTranslations } from "@/lib/i18n";

export default function SubjectHeader({ subject }: { subject: Subject }) {
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const localized = getLocalizedSubject(subject, language);

  return (
    <>
      <nav
        className={styles.breadcrumbs}
        aria-label={t.subjects.detail.breadcrumb}
      >
        <Link href="/subjects">{t.subjects.detail.breadcrumb}</Link>
        <ChevronRight size={15} />
        <span>
          {language === "ar"
            ? `الصف ${subject.grade.replace("Grade ", "")}`
            : subject.grade}
        </span>
        <ChevronRight size={15} />
        <span>
          {language === "ar"
            ? `الفصل الدراسي ${subject.semester.replace("Semester ", "")}`
            : subject.semester}
        </span>
        <ChevronRight size={15} />
        <strong>{localized.name}</strong>
      </nav>
      <header className={styles.subjectHeader}>
        <div className={styles.subjectHeading}>
          <span className={styles.subjectIcon} aria-hidden="true">
            <Atom size={31} />
          </span>
          <div>
            <h1>{localized.name}</h1>
            <p>{localized.description}</p>
          </div>
        </div>
        <div className={styles.metadata}>
          <span>
            {language === "ar"
              ? `الصف ${subject.grade.replace("Grade ", "")}`
              : subject.grade}
          </span>
          <span>
            {language === "ar"
              ? `الفصل الدراسي ${subject.semester.replace("Semester ", "")}`
              : subject.semester}
          </span>
          <span className={styles.primaryMeta}>
            {t.subjects.detail.coreSubject}
          </span>
        </div>
      </header>
    </>
  );
}
