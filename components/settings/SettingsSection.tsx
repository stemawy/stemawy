import type { ReactNode } from "react";
import styles from "@/app/settings/settings.module.scss";

export default function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.settingsSection}>
      <div className={styles.sectionLabel}>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div className={styles.settingsGroup}>{children}</div>
    </section>
  );
}
