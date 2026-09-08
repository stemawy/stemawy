import ContentHeader from "./ContentHeader";
import ConceptCard from "./ConceptCard";
import ResourceCard from "@/components/resources/ResourceCard";
import type { Resource, SubjectContent } from "@/types";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";

export default function SubjectContent({
  item,
  subjectId,
  resources,
}: {
  item: SubjectContent;
  subjectId: string;
  resources: Resource[];
}) {
  const isUnit = item.type === "unit";
  const itemResources = item.resources
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource): resource is Resource => Boolean(resource));
  return (
    <article className={styles.contentCard}>
      <ContentHeader key={item.id} item={item} subjectId={subjectId} />
      <div className={styles.contentBody}>
        <section className={styles.resourcesSection}>
          <div className={styles.sectionHeading}>
            <h2>{isUnit ? "Unit Resources" : "Resources & Materials"}</h2>
          </div>
          {itemResources.length > 0 ? (
            <div className={styles.resourceGrid}>
              {itemResources.map((resource) => (
                <ResourceCard resource={resource} key={resource.id} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyContent}>
              <p>
                {isUnit
                  ? "Resources for this unit are coming soon."
                  : `Materials for ${item.title} are coming soon.`}
              </p>
              <button type="button">Suggest a Resource</button>
            </div>
          )}
        </section>
        {isUnit && item.concepts && item.concepts.length > 0 && (
          <section className={styles.conceptsSection}>
            <div className={styles.sectionHeading}>
              <h2>Concepts</h2>
            </div>
            <div className={styles.conceptList}>
              {item.concepts.map((concept) => (
                <ConceptCard
                  concept={concept}
                  resources={concept.resources
                    .map((id) =>
                      resources.find((resource) => resource.id === id),
                    )
                    .filter((resource): resource is Resource =>
                      Boolean(resource),
                    )}
                  key={concept.id}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
