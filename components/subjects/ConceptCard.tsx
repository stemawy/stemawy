"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";

import type { Concept, Resource } from "@/types";
import ResourceCard from "@/components/resources/ResourceCard";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";

export default function ConceptCard({
  concept,
  resources,
}: {
  concept: Concept;
  resources: Resource[];
}) {
  const [open, setOpen] = useState(false);

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
          <strong>{concept.title}</strong>
          <span>{concept.description}</span>
        </span>
        <span className={styles.conceptSummary}>
          {resources.length > 0 ? (
            <span className={styles.resourceCount}>
              <FileText size={13} /> {resources.length}{" "}
              {resources.length === 1 ? "Resource" : "Resources"}
            </span>
          ) : (
            <span className={styles.noResources}>No resources yet</span>
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
          <p>{concept.description}</p>
          {resources.length > 0 && (
            <div className={styles.conceptResourceGrid}>
              {resources.map((resource) => (
                <ResourceCard resource={resource} key={resource.id} />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
