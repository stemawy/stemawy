import type { OpportunityCategory } from "@/data/opportunities";
import styles from "@/app/opportunities/OpportunitiesPage.module.scss";
const categories: Array<{
  id: OpportunityCategory | "all";
  en: string;
  ar: string;
}> = [
  { id: "all", en: "All", ar: "الكل" },
  { id: "research", en: "Research", ar: "بحث" },
  { id: "competition", en: "Competitions", ar: "مسابقات" },
  { id: "course", en: "Courses", ar: "دورات" },
  { id: "development", en: "Development", ar: "تطوير" },
];
export default function OpportunitiesCategories({
  language,
  counts,
  active,
  onChange,
}: {
  language: "en" | "ar";
  counts: Record<string, number>;
  active: OpportunityCategory | "all";
  onChange: (value: OpportunityCategory | "all") => void;
}) {
  const ar = language === "ar";
  return (
    <div className={styles.categories}>
      {categories.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={active === item.id}
          className={`${styles.category} ${active === item.id ? styles.categoryActive : ""}`}
          onClick={() => onChange(item.id)}
        >
          <span>{ar ? item.ar : item.en}</span>
          <b>{counts[item.id] ?? 0}</b>
        </button>
      ))}
    </div>
  );
}
