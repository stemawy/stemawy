import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Subject } from "@/data/subjects";
import styles from "@/app/subjects/subjects.module.scss";
import { getSubjectColorStyle, renderSubjectIcon } from "./subject-icons";
import { useLayoutState } from "@/components/layout/layout-context";
import { getLocalizedSubject, getTranslations } from "@/lib/i18n";

export default function SubjectCard({ subject }: { subject: Subject }) {
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const localized = getLocalizedSubject(subject, language);

  return (
    <Link className={styles.subjectCard} href={`/subject/${subject.id}`}>
      <span className={styles.cardIcon} style={getSubjectColorStyle(subject)}>
        {renderSubjectIcon(subject, 24)}
      </span>
      <span className={styles.cardCopy}>
        <strong>{localized.name}</strong>
        <span>{localized.description}</span>
      </span>
      <span className={styles.cardAction}>
        {t.subjects.viewCourse} <ArrowRight size={18} />
      </span>
    </Link>
  );
}
