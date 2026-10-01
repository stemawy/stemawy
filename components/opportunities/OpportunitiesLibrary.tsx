"use client";

import { useState } from "react";
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
  const [listView, setListView] = useState(false);
  const toggleLabel = ar
    ? listView
      ? "التبديل إلى العرض الشبكي"
      : "التبديل إلى عرض القائمة"
    : listView
      ? "Switch to grid view"
      : "Switch to list view";

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
        <button
          className={styles.viewToggle}
          type="button"
          aria-label={ar ? "تبديل تخطيط الفرص" : "Toggle opportunity layout"}
          aria-pressed={listView}
          title={toggleLabel}
          onClick={() => setListView((current) => !current)}
        >
          <span className="material-symbols-outlined">
            {listView ? "view_agenda" : "grid_view"}
          </span>
        </button>
      </div>
      {items.length ? (
        <div className={`${styles.grid} ${listView ? styles.list : ""}`}>
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
