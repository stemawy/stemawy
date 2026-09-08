import type { OpportunityFiltersState } from "@/app/opportunities/page";
import styles from "@/app/opportunities/OpportunitiesPage.module.scss";
export default function OpportunitiesFilters({
  language,
  values,
  filters,
  onChange,
}: {
  language: "en" | "ar";
  values: {
    type: string[];
    field: string[];
    eligibility: string[];
    location: string[];
  };
  filters: OpportunityFiltersState;
  onChange: (value: OpportunityFiltersState) => void;
}) {
  const ar = language === "ar";
  const update = (key: keyof OpportunityFiltersState, value: string) =>
    onChange({ ...filters, [key]: value });
  return (
    <details className={styles.filterWrap}>
      <summary>
        <span className="material-symbols-outlined">tune</span>
        {ar ? "فلاتر" : "Filters"}
      </summary>
      <div className={styles.filterMenu}>
        {(["type", "field", "eligibility", "location"] as const).map((key) => (
          <label key={key}>
            {key}
            <select
              value={filters[key]}
              onChange={(event) => update(key, event.target.value)}
            >
              <option value="all">All</option>
              {values[key].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label>
          deadline
          <select
            value={filters.deadline}
            onChange={(event) => update("deadline", event.target.value)}
          >
            <option value="all">All</option>
            <option value="has">Has deadline</option>
            <option value="none">No deadline</option>
          </select>
        </label>
      </div>
    </details>
  );
}
