"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import SavedHeader from "@/components/saved/SavedHeader";
import SavedSearch from "@/components/saved/SavedSearch";
import SavedCategories from "@/components/saved/SavedCategories";
import SavedSort from "@/components/saved/SavedSort";
import SavedFilters from "@/components/saved/SavedFilters";
import SavedLibrary from "@/components/saved/SavedLibrary";
import {
  getSavedItems,
  getSavedItemsChangeEvent,
  removeSavedItem,
  type SavedItemType,
} from "@/lib/saved-items";
import styles from "./SavedPage.module.scss";

type FilterMode = "all" | "described" | "recent";
const EMPTY_SAVED_ITEMS: ReturnType<typeof getSavedItems> = [];

function subscribeToSavedItems(onChange: () => void) {
  const eventName = getSavedItemsChangeEvent();
  window.addEventListener(eventName, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(eventName, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export default function SavedPage() {
  const items = useSyncExternalStore(
    subscribeToSavedItems,
    getSavedItems,
    () => EMPTY_SAVED_ITEMS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">(
    "newest",
  );

  // Calculate counts
  const counts = useMemo(() => {
    return {
      all: items.length,
      resource: items.filter((i) => i.type === "resource").length,
      opportunity: items.filter((i) => i.type === "opportunity").length,
      skill: items.filter((i) => i.type === "skill").length,
      subject: items.filter((i) => i.type === "subject").length,
    };
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((i) => i.type === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          (i.category && i.category.toLowerCase().includes(query)),
      );
    }

    if (filterMode === "described") {
      filtered = filtered.filter((item) => item.description.trim().length > 0);
    } else if (filterMode === "recent") {
      const mostRecent = items.reduce(
        (latest, item) => Math.max(latest, item.savedAt),
        0,
      );
      filtered = filtered.filter(
        (item) => item.savedAt >= mostRecent - 7 * 24 * 60 * 60 * 1000,
      );
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => b.savedAt - a.savedAt);
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.savedAt - b.savedAt);
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [items, activeCategory, searchQuery, filterMode, sortBy]);

  const handleRemove = (id: string, type: string) => {
    removeSavedItem(id, type as SavedItemType);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SavedHeader
          title="Saved"
          subtitle="Your personal library"
          description="Keep the resources, topics, opportunities, and skills you want to come back to."
        />

        <SavedSearch value={searchQuery} onChange={setSearchQuery} />

        <div className={styles.controls}>
          <SavedCategories
            counts={counts}
            active={activeCategory}
            onChange={setActiveCategory}
          />
          <div className={styles.controlActions}>
            <div className={styles.controlSpacer} />
            <div className={styles.actionButtons}>
              <SavedFilters
                value={filterMode}
                onChange={setFilterMode}
                onClearAll={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setFilterMode("all");
                }}
              />
              <SavedSort value={sortBy} onChange={setSortBy} />
            </div>
          </div>
        </div>

        <SavedLibrary
          items={filteredItems}
          totalItems={items.length}
          sortBy={sortBy}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
