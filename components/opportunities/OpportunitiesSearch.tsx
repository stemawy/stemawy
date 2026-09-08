import styles from "@/app/opportunities/OpportunitiesPage.module.scss";
export default function OpportunitiesSearch({
  language,
  value,
  onChange,
}: {
  language: "en" | "ar";
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.search}>
      <span className="material-symbols-outlined">search</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          language === "ar"
            ? "ابحث في الفرص بالعنوان أو المجال أو الكلمات المفتاحية..."
            : "Search opportunities by title, field, provider, or keyword..."
        }
        aria-label="Search opportunities"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
}
