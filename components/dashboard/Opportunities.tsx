import Image from "next/image";
import { Compass, Timer } from "lucide-react";

import type { Opportunity } from "@/data/opportunities";
import styles from "@/app/dashboard/dashborad.module.scss";

export default function Opportunities({ items }: { items: Opportunity[] }) {
  return (
    <section className={styles.opportunities}>
      <header>
        <h2>Opportunities</h2>
        <Compass size={22} />
      </header>
      <div className={styles.opportunityList}>
        {items.map((item) => (
          <a href="/opportunities" className={styles.opportunity} key={item.id}>
            <Image src={item.image} alt="" width={48} height={48} />
            <span>
              <strong>{item.title}</strong>
              <small className={item.urgent ? styles.urgent : ""}>
                {item.urgent && <Timer size={14} />}
                {item.date}
              </small>
            </span>
          </a>
        ))}
        <a className={styles.findLink} href="/opportunities">
          Find Opportunities
        </a>
      </div>
    </section>
  );
}
