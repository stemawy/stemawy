"use client";

import { useEffect, useState } from "react";

import { useLayoutState } from "@/components/layout/layout-context";
import {
  calculateResourceProgress,
  getResourceProgressChangeEvent,
  type ResourceProgressSummary,
} from "@/lib/resource-progress";
import { getTranslations } from "@/lib/i18n";
import type { Resource } from "@/types";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";

export default function ResourceProgress({
  resources,
  title,
}: {
  resources: Resource[];
  title: string;
}) {
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const [progress, setProgress] = useState<ResourceProgressSummary>(() =>
    calculateResourceProgress(resources, []),
  );

  useEffect(() => {
    const updateProgress = () =>
      setProgress(calculateResourceProgress(resources));
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "stemawy-completed-resources") updateProgress();
    };

    updateProgress();
    window.addEventListener(getResourceProgressChangeEvent(), updateProgress);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(
        getResourceProgressChangeEvent(),
        updateProgress,
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [resources]);

  if (progress.totalResources === 0) return null;

  const summary = t.subjects.detail.progressSummary
    .replace("{completed}", String(progress.completedResources))
    .replace("{total}", String(progress.totalResources));

  return (
    <section className={styles.subjectProgress} aria-label={title}>
      <div className={styles.progressSummary}>
        <strong>{title}</strong>
        <span>{progress.percent}%</span>
      </div>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-valuetext={`${progress.percent}%. ${summary}`}
      >
        <span style={{ width: `${progress.percent}%` }} />
      </div>
      <div className={styles.progressDetails}>
        <span>{summary}</span>
        <small>{t.subjects.detail.progressEstimate}</small>
      </div>
    </section>
  );
}
