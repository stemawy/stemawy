import type { OpportunitySort } from "@/app/opportunities/page";
import styles from "@/app/opportunities/OpportunitiesPage.module.scss";
export default function OpportunitiesSort({
  language,
  value,
  onChange,
}: {
  language: "en" | "ar";
  value: OpportunitySort;
  onChange: (value: OpportunitySort) => void;
}) {
  return (
    <label className={styles.sort}>
      <span>{language === "ar" ? "ترتيب" : "Sort by"}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as OpportunitySort)}
      >
        <option value="relevancy">Relevancy</option>
        <option value="deadline">Deadline Soonest</option>
        <option value="newest">Newest</option>
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
      </select>
      <span className="material-symbols-outlined">sort</span>
    </label>
  );
}
