import { Atom, Code2, Languages, Landmark } from "lucide-react";

import type { Subject } from "@/data/subjects";
import SubjectCard from "./SubjectCard";
import styles from "@/app/subjects/subjects.module.scss";

type SubjectSectionProps = {
  title: string;
  subjects: Subject[];
  icon: "science" | "language" | "computing" | "humanities";
};

const sectionIcons = {
  science: Atom,
  language: Languages,
  computing: Code2,
  humanities: Landmark,
};

export default function SubjectSection({
  title,
  subjects,
  icon,
}: SubjectSectionProps) {
  const Icon = sectionIcons[icon];

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>
        <Icon size={23} />
        <h2>{title}</h2>
      </div>
      <div className={styles.subjectGrid}>
        {subjects.map((subject) => (
          <SubjectCard
            key={`${subject.grade}-${subject.semester}-${subject.id}`}
            subject={subject}
          />
        ))}
      </div>
    </section>
  );
}
