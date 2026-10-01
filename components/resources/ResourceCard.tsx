import {
  ArrowUpRight,
  BookOpen,
  Check,
  ClipboardList,
  FileText,
  Play,
  Presentation,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Resource } from "@/types";
import {
  getResourceProgressChangeEvent,
  isResourceCompleted,
  toggleResourceCompleted,
} from "@/lib/resource-progress";
import styles from "./ResourceCard.module.scss";
import type { Language } from "@/lib/i18n";
import { getLocalizedContentText, getTranslations } from "@/lib/i18n";

const icons = {
  video: Play,
  file: FileText,
  document: FileText,
  slides: Presentation,
  sheet: BookOpen,
  "test-bank": ClipboardList,
  pdf: FileText,
} as const;

export default function ResourceCard({
  resource,
  language = "en",
}: {
  resource: Resource;
  language?: Language;
}) {
  const Icon = icons[resource.type] ?? FileText;
  const [completed, setCompleted] = useState(false);
  const resourceTitle = getLocalizedContentText(resource.title, language);
  const t = getTranslations(language);

  useEffect(() => {
    const syncCompleted = () => setCompleted(isResourceCompleted(resource.id));
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "stemawy-completed-resources") syncCompleted();
    };

    syncCompleted();
    window.addEventListener(getResourceProgressChangeEvent(), syncCompleted);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(
        getResourceProgressChangeEvent(),
        syncCompleted,
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [resource.id]);

  const completionAction = completed
    ? t.subjects.detail.markResourceUnfinished
    : t.subjects.detail.markResourceFinished;

  return (
    <a
      className={`${styles.card} ${completed ? styles.completed : ""}`}
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${resourceTitle} · ${completionAction}`}
      aria-label={`${resourceTitle}. ${completionAction}`}
      onContextMenu={(event) => {
        event.preventDefault();
        setCompleted(toggleResourceCompleted(resource.id));
      }}
    >
      <span
        className={`${styles.icon} ${styles[`type-${resource.type}`] ?? ""}`}
        aria-hidden="true"
      >
        <Icon size={18} />
      </span>
      <span className={styles.copy}>
        <strong>{resourceTitle}</strong>
        <small>{resource.provider}</small>
      </span>
      <ArrowUpRight className={styles.arrow} size={17} aria-hidden="true" />
      {completed && (
        <span className={styles.completedMark} aria-hidden="true">
          <Check size={13} strokeWidth={3} />
        </span>
      )}
    </a>
  );
}
