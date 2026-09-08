import styles from "@/app/help/HelpFeedbackPage.module.scss";
import type { FeedbackContext } from "@/app/help/page";

export default function HelpFeedbackContextBanner({
  context,
  onClear,
}: {
  context: FeedbackContext;
  onClear: () => void;
}) {
  return (
    <div className={styles.contextBanner}>
      <div>
        <span className="material-symbols-outlined">attachment</span>
        <span>
          {context.label}: <strong>{context.detail}</strong>
        </span>
      </div>
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear referenced context"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
