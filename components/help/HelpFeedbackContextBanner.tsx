import styles from "@/app/help/HelpFeedbackPage.module.scss";
import type { ReportableResource } from "@/lib/resource-reporting";

export default function HelpFeedbackContextBanner({
  resources,
  language,
  onEdit,
  onClear,
}: {
  resources: ReportableResource[];
  language: "en" | "ar";
  onEdit: () => void;
  onClear: () => void;
}) {
  const english = language === "en";
  const resourceNames = resources
    .slice(0, 2)
    .map((resource) => resource.title)
    .join(", ");

  return (
    <div className={styles.contextBanner}>
      <div className={styles.contextCopy}>
        <span className="material-symbols-outlined">attachment</span>
        <span>
          <strong>
            {english
              ? `${resources.length} ${resources.length === 1 ? "resource" : "resources"} selected`
              : `${resources.length} ${resources.length === 1 ? "مورد محدد" : "موارد محددة"}`}
          </strong>
          <small>
            {resourceNames}
            {resources.length > 2
              ? english
                ? ` and ${resources.length - 2} more`
                : ` و${resources.length - 2} أخرى`
              : ""}
          </small>
        </span>
      </div>
      <div className={styles.contextActions}>
        <button type="button" onClick={onEdit}>
          {english ? "Edit" : "تعديل"}
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label={
            english ? "Clear selected resources" : "مسح الموارد المحددة"
          }
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
}
