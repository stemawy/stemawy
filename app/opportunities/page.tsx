"use client";

import { useMemo, useState } from "react";
import { useLayoutState } from "@/components/layout/layout-context";
import {
  opportunities as fallback,
  type Opportunity,
  type OpportunityCategory,
} from "@/data/opportunities";
import OpportunitiesCategories from "@/components/opportunities/OpportunitiesCategories";
import OpportunitiesHeader from "@/components/opportunities/OpportunitiesHeader";
import OpportunitiesLibrary from "@/components/opportunities/OpportunitiesLibrary";
import styles from "./OpportunitiesPage.module.scss";

export type OpportunitySort = "relevancy" | "deadline" | "newest" | "az" | "za";
export type OpportunityFiltersState = {
  type: string;
  field: string;
  eligibility: string;
  location: string;
  deadline: string;
};

export default function OpportunitiesPage() {
  const { language } = useLayoutState();
  const items = fallback as Opportunity[];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | "all">("all");

  const counts = useMemo(
    () =>
      items.reduce<Record<string, number>>((result, item) => {
        result.all = (result.all ?? 0) + 1;
        result[item.category] = (result[item.category] ?? 0) + 1;
        return result;
      }, {}),
    [items],
  );
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = items.filter((item) => {
      const searchable = [
        item.title,
        item.arTitle,
        item.description,
        item.arDescription,
        item.provider,
        item.category,
        item.type,
        item.field,
        item.location,
        item.eligibility,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (category === "all" || item.category === category) &&
        (!term || searchable.includes(term))
      );
    });
    return result;
  }, [category, items, query]);
  const clear = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div className={styles.page} dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={styles.container}>
        <OpportunitiesHeader
          language={language}
          query={query}
          onQueryChange={setQuery}
        />
        <div className={styles.toolbar}>
          <OpportunitiesCategories
            language={language}
            counts={counts}
            active={category}
            onChange={setCategory}
          />
        </div>
        <OpportunitiesLibrary
          language={language}
          items={filtered}
          total={items.length}
          onClear={clear}
        />
      </div>
    </div>
  );
}
