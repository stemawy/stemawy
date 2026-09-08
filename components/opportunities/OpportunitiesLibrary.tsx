import type { Opportunity } from "@/data/opportunities";
import OpportunityCard from "./OpportunityCard";
import styles from "@/app/opportunities/OpportunitiesPage.module.scss";
export default function OpportunitiesLibrary({
  language,
  items,
  total,
  onClear,
}: {
  language: "en" | "ar";
  items: Opportunity[];
  total: number;
  onClear: () => void;
}) {
  const ar = language === "ar";
  return (
    <section className={styles.library}>
      <div className={styles.libraryHeading}>
        <div>
          <h2>{ar ? "الفرص المتاحة" : "Opportunities"}</h2>
          <p>
            {ar
              ? `عرض ${items.length} من ${total} فرصة`
              : `Showing ${items.length} of ${total} opportunities`}
          </p>
        </div>
        <span className="material-symbols-outlined">view_agenda</span>
      </div>
      {items.length ? (
        <div className={styles.grid}>
          {items.map((item) => (
            <OpportunityCard key={item.id} item={item} language={language} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className="material-symbols-outlined">search_off</span>
          <h3>No opportunities found</h3>
          <p>Try adjusting your search or filters.</p>
          <button type="button" onClick={onClear}>
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
