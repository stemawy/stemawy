import { AlertTriangle, X } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function ResetConfirmation({
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel,
  closeLabel,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  closeLabel?: string;
}) {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <div
        className={styles.confirmation}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
      >
        <button
          className={styles.modalClose}
          type="button"
          aria-label={closeLabel ?? t.settings.closeReset}
          onClick={onCancel}
        >
          <X size={18} />
        </button>
        <span className={styles.warningIcon}>
          <AlertTriangle size={22} />
        </span>
        <h2 id="reset-title">{title ?? t.settings.resetAllData}</h2>
        <p>{description ?? t.settings.resetDescription}</p>
        <div className={styles.modalActions}>
          <button type="button" onClick={onCancel}>
            {t.settings.cancel}
          </button>
          <button
            className={styles.dangerButton}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel ?? t.settings.confirmReset}
          </button>
        </div>
      </div>
    </div>
  );
}
