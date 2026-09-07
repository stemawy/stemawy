import { Calculator, FlaskConical, Gauge, PlayCircle } from "lucide-react";

import type { RecentLearning } from "@/lib/storage";
import type { Semester } from "@/data/subjects";
import styles from "@/app/dashboard/dashborad.module.scss";

const icons = { calculator: Calculator, gauge: Gauge, flask: FlaskConical };

export default function JumpBackIn({
  items,
  semester,
}: {
  items: RecentLearning[];
  semester: Semester;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeading}>
        <h2>
          <PlayCircle size={22} /> Jump Back In
        </h2>
        <span>Semester {semester}</span>
      </div>
      <div className={styles.recentGrid}>
        {items.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons] ?? Gauge;
          return (
            <a className={styles.recentCard} href="#" key={item.id}>
              <span className={`${styles.subjectIcon} ${styles[item.tone]}`}>
                <Icon size={22} />
              </span>
              <span>
                <small>{item.subject}</small>
                <strong>{item.topic}</strong>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
