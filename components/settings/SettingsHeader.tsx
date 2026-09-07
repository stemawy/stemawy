import { ChevronRight } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";

export default function SettingsHeader() {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.breadcrumb}>
        <span>Stemawy</span>
        <ChevronRight size={14} />
        <strong>Settings</strong>
      </div>
      <h1>Settings</h1>
      <p>Preferences and local browser cache</p>
    </header>
  );
}
