import ContentHeader from "./ContentHeader";
import ConceptCard from "./ConceptCard";
import ResourceCard from "@/components/resources/ResourceCard";
import type { Resource, SubjectContent } from "@/types";
import styles from "@/app/subject/[subjectId]/SubjectPage.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getLocalizedContentText, getTranslations } from "@/lib/i18n";

export default function SubjectContent({
  item,
  subjectId,
  reportSubjectId,
  resources,
  reportMode,
  selectedResourceKeys,
  onToggleReportResource,
}: {
  item: SubjectContent;
  subjectId: string;
  reportSubjectId: string;
  resources: Resource[];
  reportMode: boolean;
  selectedResourceKeys: ReadonlySet<string>;
  onToggleReportResource: (key: string) => void;
}) {
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const isUnit = item.type === "unit";
  const itemResources = item.resources
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource): resource is Resource => Boolean(resource));
  return (
    <article className={styles.contentCard}>
      <ContentHeader key={item.id} item={item} subjectId={subjectId} />
      <div className={styles.contentBody}>
        {!(isUnit && item.showResourceSuggestion === false) && (
          <section className={styles.resourcesSection}>
            <div className={styles.sectionHeading}>
              <h2>
                {isUnit
                  ? t.subjects.detail.unitResources
                  : t.subjects.detail.resourcesMaterials}
              </h2>
            </div>
            {itemResources.length > 0 ? (
              <div className={styles.resourceGrid}>
                {itemResources.map((resource, index) => (
                  <ResourceCard
                    resource={resource}
                    language={language}
                    reportMode={reportMode}
                    reportSelected={selectedResourceKeys.has(
                      `${reportSubjectId}:${resource.id}`,
                    )}
                    onReportToggle={() =>
                      onToggleReportResource(
                        `${reportSubjectId}:${resource.id}`,
                      )
                    }
                    key={`${resource.id || "resource"}-${index}`}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyContent}>
                <p>
                  {isUnit
                    ? t.subjects.detail.comingSoonUnit
                    : `${t.subjects.detail.comingSoonMaterials} (${getLocalizedContentText(item.title, language)})`}
                </p>
                <button type="button">
                  {t.subjects.detail.suggestResource}
                </button>
              </div>
            )}
          </section>
        )}
        {isUnit && item.concepts && item.concepts.length > 0 && (
          <section className={styles.conceptsSection}>
            <div className={styles.sectionHeading}>
              <h2>{t.subjects.detail.concepts}</h2>
            </div>
            <div className={styles.conceptList}>
              {item.concepts.map((concept, index) => (
                <ConceptCard
                  concept={concept}
                  resources={concept.resources
                    .map((id) =>
                      resources.find((resource) => resource.id === id),
                    )
                    .filter((resource): resource is Resource =>
                      Boolean(resource),
                    )}
                  reportMode={reportMode}
                  reportSubjectId={reportSubjectId}
                  selectedResourceKeys={selectedResourceKeys}
                  onToggleReportResource={onToggleReportResource}
                  key={`${concept.id || concept.title || "concept"}-${index}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
