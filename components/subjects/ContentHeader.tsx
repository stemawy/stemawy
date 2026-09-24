"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";

import type { SubjectContent } from "@/types";
import { useSaveItemWithDetails } from "@/hooks";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getLocalizedContentText, getTranslations } from "@/lib/i18n";

export default function ContentHeader({
  item,
  subjectId,
}: {
  item: SubjectContent;
  subjectId: string;
}) {
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const title = getLocalizedContentText(item.title, language);

  const { saved, toggle: toggleSaved } = useSaveItemWithDetails({
    id: item.id,
    type: "resource",
    title: item.title,
    description: item.description,
    category: "Subject",
    subcategory: item.number ?? "Learning object",
    href: `/subject/${subjectId}?unit=${encodeURIComponent(item.id)}`,
  });

  return (
    <header className={styles.contentHeader}>
      <div className={styles.contentHeaderCopy}>
        <div className={styles.contentEyebrow}>
          <span>{item.number ?? item.type.toUpperCase()}</span>
          <strong>{title}</strong>
        </div>
        <p>{getLocalizedContentText(item.description, language)}</p>
      </div>
      {item.type === "unit" && (
        <button
          className={`${styles.saveButton} ${saved ? styles.saved : ""}`}
          type="button"
          onClick={toggleSaved}
          aria-pressed={saved}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          {saved ? t.subjects.detail.savedUnit : t.subjects.detail.saveUnit}
        </button>
      )}
    </header>
  );
}
