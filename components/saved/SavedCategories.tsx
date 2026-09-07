import styles from "@/app/saved/SavedPage.module.scss";

type SavedCategoriesProps = {
  counts: Record<string, number>;
  active: string;
  onChange: (category: string) => void;
};

const categories = [
  { id: "all", label: "All" },
  { id: "resource", label: "Resources" },
  { id: "opportunity", label: "Opportunities" },
  { id: "skill", label: "Skills" },
];

export default function SavedCategories({
  counts,
  active,
  onChange,
}: SavedCategoriesProps) {
  return (
    <div className={styles.categories}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`${styles.categoryButton} ${active === cat.id ? styles.categoryButtonActive : ""}`}
        >
          <span>{cat.label}</span>
          {counts[cat.id] !== undefined && (
            <span className={styles.count}>{counts[cat.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
