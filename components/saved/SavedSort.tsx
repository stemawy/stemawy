import { useState } from "react";
import styles from "@/app/saved/SavedPage.module.scss";

type SavedSortProps = {
  value: "newest" | "oldest" | "alphabetical";
  onChange: (value: "newest" | "oldest" | "alphabetical") => void;
};

export default function SavedSort({ value, onChange }: SavedSortProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.menuAnchor}>
      <button
        type="button"
        className={styles.controlButton}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="material-symbols-outlined">sort</span>
        <span>
          Sort:{" "}
          {value === "newest"
            ? "Newest"
            : value === "oldest"
              ? "Oldest"
              : "A - Z"}
        </span>
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          {(["newest", "oldest", "alphabetical"] as const).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={value === option ? styles.selectedOption : ""}
            >
              {option === "newest"
                ? "Newest First"
                : option === "oldest"
                  ? "Oldest First"
                  : "A - Z"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
