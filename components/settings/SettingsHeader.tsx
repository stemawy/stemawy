import { ChevronRight } from "lucide-react";
import styles from "@/app/settings/settings.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function SettingsHeader() {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <header className={styles.pageHeader}>
      <div className={styles.breadcrumb}>
        <span>{t.settings.breadcrumbHome}</span>
        <ChevronRight size={14} />
        <strong>{t.settings.title}</strong>
      </div>
      <h1>{t.settings.title}</h1>
      <p>{t.settings.subtitle}</p>
    </header>
  );
}
