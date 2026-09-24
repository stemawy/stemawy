import { Bot, Send } from "lucide-react";

import styles from "@/app/dashboard/dashborad.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function AIAssistant() {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <section className={styles.ai}>
      <div className={styles.aiTitle}>
        <span>
          <Bot size={18} />
        </span>
        <h2>{t.dashboard.askAi}</h2>
      </div>
      <p>{t.dashboard.aiDescription}</p>
      <div className={styles.aiInput}>
        <input
          placeholder={t.dashboard.aiPlaceholder}
          aria-label={t.dashboard.askAi}
        />
        <button type="button" aria-label={t.dashboard.sendQuestion}>
          <Send size={18} />
        </button>
      </div>
    </section>
  );
}
