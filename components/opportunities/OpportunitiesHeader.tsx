import OpportunitiesSearch from "./OpportunitiesSearch";
import styles from "@/app/opportunities/OpportunitiesPage.module.scss";
export default function OpportunitiesHeader({
  language,
  query,
  onQueryChange,
}: {
  language: "en" | "ar";
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const ar = language === "ar";
  return (
    <header className={styles.header}>
      <h1>{ar ? "استكشف الفرص" : "Explore Opportunities"}</h1>
      <p>
        {ar
          ? "اكتشف المسابقات والبرامج البحثية والدورات والمنح وفرص ريادة الأعمال لتسريع رحلتك في STEM."
          : "Discover academic competitions, scholarships, research programs, courses, and entrepreneurship opportunities to accelerate your STEM journey."}
      </p>
      <OpportunitiesSearch
        language={language}
        value={query}
        onChange={onQueryChange}
      />
    </header>
  );
}
