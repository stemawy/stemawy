"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";

import type { SubjectContent } from "@/types";
import { useSaveItemWithDetails } from "@/hooks";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";

export default function ContentHeader({ item }: { item: SubjectContent }) {
  const { saved, toggle: toggleSaved } = useSaveItemWithDetails({
    id: item.id,
    type: "subject",
    title: item.title,
    description: item.description,
    category: "Subject",
    subcategory: item.number ?? "Learning object",
  });

  return (
    <header className={styles.contentHeader}>
      <div className={styles.contentHeaderCopy}>
        <div className={styles.contentEyebrow}>
          <span>{item.number ?? item.type.toUpperCase()}</span>
          <strong>{item.title}</strong>
        </div>
        <p>{item.description}</p>
      </div>
      {item.type === "unit" && (
        <button
          className={`${styles.saveButton} ${saved ? styles.saved : ""}`}
          type="button"
          onClick={toggleSaved}
          aria-pressed={saved}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          {saved ? "Saved Unit" : "Save Unit"}
        </button>
      )}
    </header>
  );
}
