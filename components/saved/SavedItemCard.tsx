import type { SavedItem } from "@/lib/saved-items";
import Link from "next/link";
import styles from "@/app/saved/SavedPage.module.scss";

type SavedItemCardProps = {
  item: SavedItem;
  onRemove: (id: string) => void;
};

function getBadge(item: SavedItem) {
  if (item.type === "opportunity" && /robotics|research/i.test(item.title)) {
    return { label: "RESEARCH", color: styles.badgeResearch, icon: "science" };
  }

  if (item.type === "opportunity" && /scholarship/i.test(item.title)) {
    return {
      label: "SCHOLARSHIP",
      color: styles.badgeScholarship,
      icon: "school",
    };
  }

  if (item.type === "resource" && /video|crispr|gene/i.test(item.title)) {
    return { label: "VIDEO", color: styles.badgeVideo, icon: "play_circle" };
  }

  const defaults: Record<
    string,
    { label: string; color: string; icon: string }
  > = {
    resource: {
      label: "RESEARCH",
      color: styles.badgeResearch,
      icon: "science",
    },
    subject: {
      label: "SUBJECT",
      color: styles.badgeSubject,
      icon: "menu_book",
    },
    opportunity: {
      label: "OPPORTUNITY",
      color: styles.badgeOpportunity,
      icon: "explore",
    },
    skill: { label: "SKILL", color: styles.badgeSkill, icon: "psychology" },
  };

  return defaults[item.type];
}

function getItemHref(item: SavedItem) {
  if (item.href) {
    return item.href.replace(
      /^(\/subject\/[^/?]+)-grade-\d+-semester-\d+(\?.*)?$/,
      "$1$2",
    );
  }

  if (item.type === "opportunity") return "/opportunities";
  if (item.type === "skill") return "/skills";
  if (item.type === "resource") {
    return `/search?q=${encodeURIComponent(item.title)}`;
  }

  return "/subjects";
}

export default function SavedItemCard({ item, onRemove }: SavedItemCardProps) {
  const badge = getBadge(item);
  const href = getItemHref(item);

  return (
    <article className={styles.card}>
      <Link
        className={styles.cardLink}
        href={href}
        target="_blank"
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={`Open ${item.title}`}
      />
      <div className={styles.cardTop}>
        <span className={`${styles.badge} ${badge.color}`}>
          <span className="material-symbols-outlined">{badge.icon}</span>
          {badge.label}
        </span>
        <button
          onClick={() => onRemove(item.id)}
          className={styles.removeButton}
          aria-label={`Remove ${item.title} from saved`}
          title="Remove from saved"
        >
          <span className="material-symbols-outlined">bookmark</span>
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
