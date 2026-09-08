import type { SkillCategory } from "@/data/skills";
import styles from "@/app/skills/SkillsPage.module.scss";

const categories: Array<{ id: SkillCategory | "all"; en: string; ar: string }> =
  [
    { id: "all", en: "All", ar: "الكل" },
    { id: "english", en: "English", ar: "الإنجليزية" },
    { id: "programming", en: "Programming", ar: "البرمجة" },
    { id: "study-learning", en: "Study & Learning", ar: "الدراسة والتعلم" },
    { id: "mathematics", en: "Mathematics", ar: "الرياضيات" },
    { id: "science", en: "Science", ar: "العلوم" },
    { id: "productivity", en: "Productivity", ar: "الإنتاجية" },
    { id: "tools-utility", en: "Tools & Utility", ar: "الأدوات" },
  ];

export default function SkillsCategories({
  language,
  counts,
  active,
  resultCount,
  onChange,
}: {
  language: "en" | "ar";
  counts: Record<string, number>;
  active: SkillCategory | "all";
  resultCount: number;
  onChange: (category: SkillCategory | "all") => void;
}) {
  const arabic = language === "ar";
  return (
    <section className={styles.categorySection} aria-label="Skills categories">
      <div className={styles.categoryScroller}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={active === category.id}
            onClick={() => onChange(category.id)}
            className={`${styles.categoryPill} ${active === category.id ? styles.categoryPillActive : ""}`}
          >
            <span>{arabic ? category.ar : category.en}</span>
            <span className={styles.categoryCount}>
              {counts[category.id] ?? 0}
            </span>
          </button>
        ))}
      </div>
      <div className={styles.categoryMeta}>
        <span>
          {arabic
            ? `عرض ${resultCount} مهارة`
            : `Showing ${resultCount} skills`}
        </span>
        <span className={styles.metaDivider} />
        <span className={styles.typeIndicator}>
          <span className="material-symbols-outlined">tune</span>
          {arabic ? "كل الأنواع" : "All Types"}
        </span>
      </div>
    </section>
  );
}
