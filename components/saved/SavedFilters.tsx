import { useState } from "react";
import styles from "@/app/saved/SavedPage.module.scss";

type SavedFiltersProps = {
  onClearAll: () => void;
  value: "all" | "described" | "recent";
  onChange: (value: "all" | "described" | "recent") => void;
};

export default function SavedFilters({
  onClearAll,
  value,
  onChange,
}: SavedFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.menuAnchor}>
      <button
        className={styles.controlButton}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="material-symbols-outlined">filter_list</span>
        Filters{value !== "all" ? <span className={styles.activeDot} /> : null}
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          <button
            type="button"
            className={value === "all" ? styles.selectedOption : ""}
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
          >
            All saved items
          </button>
          <button
            type="button"
            className={value === "recent" ? styles.selectedOption : ""}
            onClick={() => {
              onChange("recent");
              setOpen(false);
            }}
          >
            Saved this week
          </button>
          <button
            type="button"
            className={value === "described" ? styles.selectedOption : ""}
            onClick={() => {
              onChange("described");
              setOpen(false);
            }}
          >
            With descriptions
          </button>
          <button
            type="button"
            className={styles.clearOption}
            onClick={() => {
              onClearAll();
              setOpen(false);
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
