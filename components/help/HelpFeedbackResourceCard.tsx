import Link from "next/link";
import styles from "@/app/help/HelpFeedbackPage.module.scss";

export default function HelpFeedbackResourceCard() {
  return (
    <aside className={styles.sideColumn}>
      <div className={styles.resourceCard}>
        <div className={styles.resourceBadge}>
          <span className="material-symbols-outlined">school</span>
          Community Library
        </div>
        <h2>Have a great resource to share?</h2>
        <p>
          Help other students by suggesting an educational resource, problem
          set, or study summary for Stemawy.
        </p>
        <Link href="/suggest-resource">
          Suggest a Resource
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </aside>
  );
}
