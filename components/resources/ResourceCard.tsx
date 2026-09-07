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

const icons = {
  video: Play,
  document: FileText,
  slides: Presentation,
  sheet: BookOpen,
  "test-bank": ClipboardList,
  pdf: FileText,
};

export default function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = icons[resource.type];

  return (
    <a
      className={styles.card}
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      title={resource.title}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon size={18} />
      </span>
      <span className={styles.copy}>
        <strong>{resource.title}</strong>
        <small>{resource.provider}</small>
      </span>
      <ArrowUpRight className={styles.arrow} size={17} aria-hidden="true" />
    </a>
  );
}
