"use client";

import { useEffect, useState } from "react";
import { BookOpen, Bookmark, Lightbulb, Trophy } from "lucide-react";
import Link from "next/link";

import type { SavedItem } from "@/lib/saved-items";
import { getSavedItems, getSavedItemsChangeEvent } from "@/lib/saved-items";
import styles from "@/app/dashboard/dashborad.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";

const typeIcons = {
  resource: BookOpen,
  subject: BookOpen,
  opportunity: Trophy,
  skill: Lightbulb,
};

const typeColors = {
  resource: "blue",
  subject: "blue",
  opportunity: "green",
  skill: "violet",
} as const;

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:|\/\/)/i.test(href);
}

export default function RecentlySaved() {
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const [items, setItems] = useState<SavedItem[]>(() =>
    getSavedItems()
      .sort((a, b) => b.savedAt - a.savedAt)
      .slice(0, 3),
  );

  useEffect(() => {
    // Listen for changes to saved items
    const handleChange = () => {
      const allItems = getSavedItems();
      const recentItems = allItems
        .sort((a, b) => b.savedAt - a.savedAt)
        .slice(0, 3);
      setItems(recentItems);
    };

    window.addEventListener(getSavedItemsChangeEvent(), handleChange);
    return () => {
      window.removeEventListener(getSavedItemsChangeEvent(), handleChange);
    };
  }, []);

  if (items.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h2>
            <Bookmark size={22} /> {t.dashboard.recentlySaved}
          </h2>
          <Link href="/saved">{t.dashboard.viewAll}</Link>
        </div>
        <div className={styles.emptyState}>
          <Bookmark size={48} />
          <h3>{t.dashboard.noSavedItems}</h3>
          <p>{t.dashboard.noSavedDescription}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeading}>
        <h2>
          <Bookmark size={22} /> {t.dashboard.recentlySaved}
        </h2>
        <Link href="/saved">{t.dashboard.viewAll}</Link>
      </div>
      <div className={styles.recentGrid}>
        {items.map((item) => {
          const Icon =
            typeIcons[item.type as keyof typeof typeIcons] ?? BookOpen;
          const color =
            typeColors[item.type as keyof typeof typeColors] ?? "blue";
          const href = item.href || `/saved?id=${item.id}&type=${item.type}`;
          const external = isExternalHref(href);

          return (
            <a
              className={styles.recentCard}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              key={`${item.id}-${item.type}`}
            >
              <span className={`${styles.subjectIcon} ${styles[color]}`}>
                <Icon size={22} />
              </span>
              <span>
                <small>
                  {t.dashboard.savedTypes[
                    item.type as keyof typeof t.dashboard.savedTypes
                  ] ?? item.type}
                </small>
                <strong>{item.title}</strong>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
