"use client";

import { useEffect, useState } from "react";
import { BookOpen, Bookmark, Lightbulb, Trophy } from "lucide-react";
import Link from "next/link";

import type { SavedItem } from "@/lib/saved-items";
import { getSavedItems, getSavedItemsChangeEvent } from "@/lib/saved-items";
import styles from "@/app/dashboard/dashborad.module.scss";

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

export default function RecentlySaved() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Get all saved items, sort by most recent, take top 3
    const allItems = getSavedItems();
    const recentItems = allItems
      .sort((a, b) => b.savedAt - a.savedAt)
      .slice(0, 3);
    setItems(recentItems);
    setIsLoading(false);

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

  if (!isLoading && items.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h2>
            <Bookmark size={22} /> Recently Saved
          </h2>
          <Link href="/saved">View All</Link>
        </div>
        <div className={styles.emptyState}>
          <Bookmark size={48} />
          <h3>No saved items yet</h3>
          <p>
            Start saving resources, subjects, opportunities, and skills to keep
            them handy.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeading}>
        <h2>
          <Bookmark size={22} /> Recently Saved
        </h2>
        <Link href="/saved">View All</Link>
      </div>
      <div className={styles.recentGrid}>
        {items.map((item) => {
          const Icon =
            typeIcons[item.type as keyof typeof typeIcons] ?? BookOpen;
          const color =
            typeColors[item.type as keyof typeof typeColors] ?? "blue";
          const href = item.href || `/saved?id=${item.id}&type=${item.type}`;

          return (
            <a
              className={styles.recentCard}
              href={href}
              key={`${item.id}-${item.type}`}
            >
              <span className={`${styles.subjectIcon} ${styles[color]}`}>
                <Icon size={22} />
              </span>
              <span>
                <small>{item.type}</small>
                <strong>{item.title}</strong>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
