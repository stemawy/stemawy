import Image from "next/image";
import { Compass, Timer } from "lucide-react";

import type { Opportunity } from "@/data/opportunities";
import styles from "@/app/dashboard/dashborad.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

export default function Opportunities({ items }: { items: Opportunity[] }) {
  const { language } = useLayoutState();
  const t = getTranslations(language);

  return (
    <section className={styles.opportunities}>
      <header>
        <h2>{t.dashboard.opportunities}</h2>
        <Compass size={22} />
      </header>
      <div className={styles.opportunityList}>
        {items.map((item) => (
          <a href="/opportunities" className={styles.opportunity} key={item.id}>
            {item.image ? (
              <Image src={item.image} alt="" width={48} height={48} />
            ) : (
              <div className={styles.opportunityPlaceholder} />
            )}
            <span>
              <strong>{language === "ar" ? item.arTitle : item.title}</strong>
              <small className={item.urgent ? styles.urgent : ""}>
                {item.urgent && <Timer size={14} />}
                {item.deadline || item.date}
              </small>
            </span>
          </a>
        ))}
        <a className={styles.findLink} href="/opportunities">
          {t.dashboard.findOpportunities}
        </a>
      </div>
    </section>
  );
}
