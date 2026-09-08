"use client";
import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  MapPin,
} from "lucide-react";
import type { Opportunity } from "@/data/opportunities";
import { useSaveItemWithDetails } from "@/hooks";
import styles from "@/app/opportunities/OpportunitiesPage.module.scss";
export default function OpportunityCard({
  item,
  language,
}: {
  item: Opportunity;
  language: "en" | "ar";
}) {
  const ar = language === "ar";
  const { saved, toggle } = useSaveItemWithDetails({
    id: item.id,
    type: "opportunity",
    title: item.title,
    description: item.description,
    category: item.category,
    subcategory: item.type,
    href: item.href,
  });
  return (
    <article className={styles.card}>
      <div className={styles.cardVisual}>
        {item.imageUrl ? (
          <img
            className={styles.cardImage}
            src={item.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={styles.cardPattern}>
            <span className="material-symbols-outlined">
              {item.category === "research"
                ? "science"
                : item.category === "course"
                  ? "school"
                  : item.category === "competition"
                    ? "emoji_events"
                    : "rocket_launch"}
            </span>
          </div>
        )}
        <button
          className={styles.bookmark}
          type="button"
          onClick={toggle}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save opportunity"}
        >
          {saved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
        </button>
        <span className={styles.typeTag}>{item.type}</span>
      </div>
      <div className={styles.cardBody}>
        <h3>{ar ? item.arTitle : item.title}</h3>
        <p>{ar ? item.arDescription : item.description}</p>
        <div className={styles.metadata}>
          {item.deadline && (
            <span>
              <CalendarDays size={14} />
              {item.deadline}
            </span>
          )}
          {item.eligibility && (
            <span>
              <GraduationCap size={14} />
              {item.eligibility}
            </span>
          )}
          {item.location && (
            <span>
              <MapPin size={14} />
              {item.location}
            </span>
          )}
        </div>
        <div className={styles.cardFooter}>
          <span>{item.provider}</span>
          <a href={item.href} target="_blank" rel="noreferrer">
            {ar ? "عرض التفاصيل" : "View Details"}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
