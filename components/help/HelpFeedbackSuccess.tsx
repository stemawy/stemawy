import styles from "@/app/help/HelpFeedbackPage.module.scss";

export default function HelpFeedbackSuccess({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className={styles.success}>
      <div className={styles.successIcon}>
        <span className="material-symbols-outlined">check_circle</span>
      </div>
      <h2>Thanks for your feedback!</h2>
      <p>
        We appreciate you helping us improve Stemawy. Your feedback has been
        sent to the Stemawy team.
      </p>
      <button type="button" onClick={onReset}>
        Send another message
      </button>
    </div>
  );
}
