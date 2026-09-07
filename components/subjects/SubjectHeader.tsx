import Link from "next/link";
import { Atom, ChevronRight } from "lucide-react";

import type { Subject } from "@/types";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";

export default function SubjectHeader({ subject }: { subject: Subject }) {
  return (
    <>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/subjects">Subjects</Link>
        <ChevronRight size={15} />
        <span>Grade {subject.grade}</span>
        <ChevronRight size={15} />
        <span>Semester {subject.semester}</span>
        <ChevronRight size={15} />
        <strong>{subject.name}</strong>
      </nav>
      <header className={styles.subjectHeader}>
        <div className={styles.subjectHeading}>
          <span className={styles.subjectIcon} aria-hidden="true">
            <Atom size={31} />
          </span>
          <div>
            <h1>{subject.name}</h1>
            <p>{subject.description}</p>
          </div>
        </div>
        <div className={styles.metadata}>
          <span>{subject.grade}</span>
          <span>{subject.semester}</span>
          <span className={styles.primaryMeta}>Core Subject</span>
        </div>
      </header>
    </>
  );
}
