import {
  ArrowUpRight,
  BookOpen,
  Check,
  ClipboardList,
  FileText,
  Image as ImageIcon,
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
  image: ImageIcon,
} as const;

export default function ResourceCard({
  resource,
  language = "en",
  reportMode = false,
  reportSelected = false,
  onReportToggle,
}: {
  resource: Resource;
  language?: Language;
  reportMode?: boolean;
  reportSelected?: boolean;
  onReportToggle?: () => void;
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
  const reportAction =
    language === "ar"
      ? reportSelected
        ? "إزالة من الموارد المحددة للإبلاغ"
        : "تحديد للإبلاغ"
      : reportSelected
        ? "Remove from report selection"
        : "Select for report";

  return (
    <a
      className={`${styles.card} ${completed ? styles.completed : ""} ${reportMode ? styles.reportMode : ""} ${reportSelected ? styles.reportSelected : ""}`}
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      role={reportMode ? "checkbox" : undefined}
      aria-checked={reportMode ? reportSelected : undefined}
      title={`${resourceTitle} · ${reportMode ? reportAction : completionAction}`}
      aria-label={`${resourceTitle}. ${reportMode ? reportAction : completionAction}`}
      onClick={(event) => {
        if (!reportMode) return;
        event.preventDefault();
        onReportToggle?.();
      }}
      onKeyDown={(event) => {
        if (reportMode && (event.key === " " || event.key === "Enter")) {
          event.preventDefault();
          onReportToggle?.();
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        if (reportMode) return;
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
        <small>{resource.linkText || resource.provider}</small>
      </span>
      <ArrowUpRight className={styles.arrow} size={17} aria-hidden="true" />
      {completed && (
        <span className={styles.completedMark} aria-hidden="true">
          <Check size={13} strokeWidth={3} />
        </span>
      )}
      {reportSelected && (
        <span className={styles.reportMark} aria-hidden="true">
          <Check size={13} strokeWidth={3} />
        </span>
      )}
    </a>
  );
}
