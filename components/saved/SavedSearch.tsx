import styles from "@/app/saved/SavedPage.module.scss";

type SavedSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SavedSearch({ value, onChange }: SavedSearchProps) {
  return (
    <div className={styles.searchShell}>
      <span className={`material-symbols-outlined ${styles.searchIcon}`}>
        search
      </span>
      <input
        className={styles.searchInput}
        placeholder="Search your saved items..."
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
