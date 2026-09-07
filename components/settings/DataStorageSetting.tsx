import { Bookmark, History, Trash2 } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";

export default function DataStorageSetting({
  onClearSaved,
  onClearSearches,
  onReset,
}: {
  onClearSaved: () => void;
  onClearSearches: () => void;
  onReset: () => void;
}) {
  const rows = [
    {
      icon: Bookmark,
      title: "Saved Content",
      description: "Remove saved units and resources",
      action: "Clear",
      onClick: onClearSaved,
    },
    {
      icon: History,
      title: "Recent Searches",
      description: "Remove search history",
      action: "Clear",
      onClick: onClearSearches,
    },
    {
      icon: Trash2,
      title: "Factory Reset",
      description: "Purge all browser data and reset defaults",
      action: "Reset",
      onClick: onReset,
    },
  ];
  return (
    <>
      {rows.map(({ icon: Icon, title, description, action, onClick }) => (
        <div
          className={`${styles.settingRow} ${title === "Factory Reset" ? styles.dangerRow : ""}`}
          key={title}
        >
          <div className={styles.settingInfo}>
            <h3>
              <span className={styles.rowIcon}>
                <Icon size={19} />
              </span>
              {title}
            </h3>
            <p>{description}</p>
          </div>
          <button
            className={
              title === "Factory Reset"
                ? styles.resetButton
                : styles.clearButton
            }
            type="button"
            onClick={onClick}
          >
            {action}
          </button>
        </div>
      ))}
    </>
  );
}
