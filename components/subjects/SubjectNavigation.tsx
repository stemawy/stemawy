import { BookOpen } from "lucide-react";

import type { SubjectContent } from "@/types";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";

export default function SubjectNavigation({
  items,
  selectedId,
  onSelect,
}: {
  items: SubjectContent[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className={styles.navigationPanel} aria-label="Subject contents">
      <h2>Contents</h2>
      <nav className={styles.contentNav}>
        {items.map((item) => {
          const Icon = BookOpen;
          const active = item.id === selectedId;
          return (
            <button
              className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              type="button"
              key={item.id}
              aria-current={active ? "page" : undefined}
              onClick={() => onSelect(item.id)}
            >
              <span className={styles.navCode}>{item.number ?? ""}</span>
              <span className={styles.navTitle}>{item.title}</span>
              <Icon
                className={styles.navItemIcon}
                size={16}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
