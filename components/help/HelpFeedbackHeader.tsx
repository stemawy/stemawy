import Link from "next/link";
import styles from "@/app/help/HelpFeedbackPage.module.scss";

export default function HelpFeedbackHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Stemawy</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <strong>Help &amp; Feedback</strong>
      </nav>
      <h1>Help &amp; Feedback</h1>
      <p>Need help or have an idea? We&apos;re here to listen.</p>
    </header>
  );
}
