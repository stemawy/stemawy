import { AlertTriangle, X } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";

export default function ResetConfirmation({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
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
          aria-label="Close reset dialog"
          onClick={onCancel}
        >
          <X size={18} />
        </button>
        <span className={styles.warningIcon}>
          <AlertTriangle size={22} />
        </span>
        <h2 id="reset-title">Reset All Data?</h2>
        <p>
          This will remove your locally stored Stemawy preferences, saved
          content, and local search data. This cannot be undone.
        </p>
        <div className={styles.modalActions}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.dangerButton}
            type="button"
            onClick={onConfirm}
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
