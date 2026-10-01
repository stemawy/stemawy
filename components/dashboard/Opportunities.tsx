import Image from "next/image";
import Link from "next/link";
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
          <a
            href={item.href}
            className={styles.opportunity}
            key={item.id}
            target="_blank"
            rel="noopener noreferrer"
          >
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
        <Link className={styles.findLink} href="/opportunities">
          {t.dashboard.findOpportunities}
        </Link>
      </div>
    </section>
  );
}
