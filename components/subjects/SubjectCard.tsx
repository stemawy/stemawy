import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Subject } from "@/data/subjects";
import styles from "@/app/subjects/subjects.module.scss";
import { getSubjectColorStyle, renderSubjectIcon } from "./subject-icons";

export default function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link className={styles.subjectCard} href={`/subject/${subject.id}`}>
      <span className={styles.cardIcon} style={getSubjectColorStyle(subject)}>
        {renderSubjectIcon(subject, 24)}
      </span>
      <span className={styles.cardCopy}>
        <strong>{subject.name}</strong>
        <span>{subject.description}</span>
      </span>
      <span className={styles.cardAction}>
        View Course <ArrowRight size={18} />
      </span>
    </Link>
  );
}
