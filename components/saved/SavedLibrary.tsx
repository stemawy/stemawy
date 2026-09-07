import type { SavedItem } from "@/lib/saved-items";
import SavedItemCard from "./SavedItemCard";
import styles from "@/app/saved/SavedPage.module.scss";

type SavedLibraryProps = {
  items: SavedItem[];
  totalItems: number;
  sortBy: "newest" | "oldest" | "alphabetical";
  onRemove: (id: string, type: string) => void;
};

export default function SavedLibrary({
  items,
  totalItems,
  sortBy,
  onRemove,
}: SavedLibraryProps) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
          bookmark
        </span>
        <h3 className={styles.emptyTitle}>
          {totalItems === 0 ? "No saved items yet" : "No matching saved items"}
        </h3>
        <p className={styles.emptyText}>
          {totalItems === 0
            ? "Start saving resources, subjects, and opportunities to see them here."
            : "Try a different search or clear one of the active filters."}
        </p>
      </div>
    );
  }

  return (
    <section className={styles.library}>
      <div className={styles.resultsBar}>
        <span className={styles.resultsLabel}>
          <span className="material-symbols-outlined">bookmark</span>
          <span>
            Showing <strong>{items.length}</strong> saved{" "}
            {items.length === 1 ? "item" : "items"}
          </span>
        </span>
        <span className={styles.resultSort}>
          Sorted by:{" "}
          <strong>
            {sortBy === "newest"
              ? "Newest first"
              : sortBy === "oldest"
                ? "Oldest first"
                : "A - Z"}
          </strong>
        </span>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <SavedItemCard
            key={`${item.type}-${item.id}`}
            item={item}
            onRemove={(id) => onRemove(id, item.type)}
          />
        ))}
      </div>
    </section>
  );
}
