import {
  ArrowUpRight,
  BookOpen,
  ClipboardList,
  FileText,
  Play,
  Presentation,
} from "lucide-react";

import type { Resource } from "@/types";
import styles from "./ResourceCard.module.scss";
import type { Language } from "@/lib/i18n";
import { getLocalizedContentText } from "@/lib/i18n";

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

  return (
    <a
      className={styles.card}
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      title={getLocalizedContentText(resource.title, language)}
    >
      <span
        className={`${styles.icon} ${styles[`type-${resource.type}`] ?? ""}`}
        aria-hidden="true"
      >
        <Icon size={18} />
      </span>
      <span className={styles.copy}>
        <strong>{getLocalizedContentText(resource.title, language)}</strong>
        <small>{resource.provider}</small>
      </span>
      <ArrowUpRight className={styles.arrow} size={17} aria-hidden="true" />
    </a>
  );
}
