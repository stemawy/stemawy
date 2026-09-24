import styles from "@/app/saved/SavedPage.module.scss";

type SavedHeaderProps = {
  title: string;
  subtitle: string;
  description: string;
};

export default function SavedHeader({
  title,
  subtitle,
  description,
}: SavedHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </header>
  );
}
