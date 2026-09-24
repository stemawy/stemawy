import { Bookmark, History, Trash2 } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function DataStorageSetting({
  onClearSaved,
  onClearSearches,
  onReset,
}: {
  onClearSaved: () => void;
  onClearSearches: () => void;
  onReset: () => void;
}) {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  const rows = [
    {
      icon: Bookmark,
      title: t.settings.savedContent,
      description: t.settings.savedContentDescription,
      action: t.settings.clear,
      onClick: onClearSaved,
    },
    {
      icon: History,
      title: t.settings.recentSearches,
      description: t.settings.recentSearchesDescription,
      action: t.settings.clear,
      onClick: onClearSearches,
    },
    {
      icon: Trash2,
      title: t.settings.factoryReset,
      description: t.settings.factoryResetDescription,
      action: t.settings.reset,
      onClick: onReset,
    },
  ];
  return (
    <>
      {rows.map(({ icon: Icon, title, description, action, onClick }) => (
        <div
          className={`${styles.settingRow} ${title === t.settings.factoryReset ? styles.dangerRow : ""}`}
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
              title === t.settings.factoryReset
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
