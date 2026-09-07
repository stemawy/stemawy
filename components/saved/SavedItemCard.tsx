import type { SavedItem } from "@/lib/saved-items";
import styles from "@/app/saved/SavedPage.module.scss";

type SavedItemCardProps = {
  item: SavedItem;
  onRemove: (id: string) => void;
};

const typeIconMap: Record<string, string> = {
  resource: "article",
  subject: "menu_book",
  opportunity: "explore",
  skill: "psychology",
};

const typeBadgeMap: Record<string, { label: string; color: string }> = {
  resource: { label: "RESEARCH", color: styles.badgeResource },
  subject: { label: "SUBJECT", color: styles.badgeSubject },
  opportunity: { label: "OPPORTUNITY", color: styles.badgeOpportunity },
  skill: { label: "SKILL", color: styles.badgeSkill },
};

export default function SavedItemCard({ item, onRemove }: SavedItemCardProps) {
  const badge = typeBadgeMap[item.type] || typeBadgeMap.resource;
  const icon = typeIconMap[item.type] || "bookmark";

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={`${styles.badge} ${badge.color}`}>
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
          {badge.label}
        </span>
        <button
          onClick={() => onRemove(item.id)}
          className={styles.removeButton}
          aria-label="Remove"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {item.category && item.subcategory && (
        <div className={styles.breadcrumb}>
          {item.category} <span className="text-outline-variant">›</span>{" "}
          {item.subcategory}
        </div>
      )}

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDescription}>{item.description}</p>
      </div>
    </article>
  );
}
