"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";

import type { Concept, Resource } from "@/types";
import ResourceCard from "@/components/resources/ResourceCard";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getLocalizedContentText, getTranslations } from "@/lib/i18n";

export default function ConceptCard({
  concept,
  resources,
}: {
  concept: Concept;
  resources: Resource[];
}) {
  const [open, setOpen] = useState(false);
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <article
      className={`${styles.conceptCard} ${open ? styles.conceptCardOpen : ""}`}
    >
      <button
        className={styles.conceptToggle}
        type="button"
        aria-expanded={open}
        aria-controls={`concept-${concept.id}`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.conceptCopy}>
          <strong>{getLocalizedContentText(concept.title, language)}</strong>
        </span>
        <span className={styles.conceptSummary}>
          {resources.length > 0 ? (
            <span className={styles.resourceCount}>
              <FileText size={13} /> {resources.length}{" "}
              {resources.length === 1
                ? t.subjects.detail.resource
                : t.subjects.detail.resources}
            </span>
          ) : (
            <span className={styles.noResources}>
              {t.subjects.detail.noResources}
            </span>
          )}
          <ChevronDown
            className={styles.conceptChevron}
            size={18}
            aria-hidden="true"
          />
        </span>
      </button>
      {open && (
        <div className={styles.conceptDetails} id={`concept-${concept.id}`}>
          <p>{getLocalizedContentText(concept.description, language)}</p>
          {resources.length > 0 && (
            <div className={styles.conceptResourceGrid}>
              {resources.map((resource, index) => (
                <ResourceCard
                  resource={resource}
                  language={language}
                  key={`${resource.id || "resource"}-${index}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
