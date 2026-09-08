"use client";

import { useEffect, useMemo, useState } from "react";
import { useLayoutState } from "@/components/layout/layout-context";
import {
  opportunities as fallback,
  type Opportunity,
  type OpportunityCategory,
} from "@/data/opportunities";
import { fetchDjangoOpportunities } from "@/lib/django-api";
import OpportunitiesCategories from "@/components/opportunities/OpportunitiesCategories";
import OpportunitiesFilters from "@/components/opportunities/OpportunitiesFilters";
import OpportunitiesHeader from "@/components/opportunities/OpportunitiesHeader";
import OpportunitiesLibrary from "@/components/opportunities/OpportunitiesLibrary";
import OpportunitiesSort from "@/components/opportunities/OpportunitiesSort";
import styles from "./OpportunitiesPage.module.scss";

export type OpportunitySort = "relevancy" | "deadline" | "newest" | "az" | "za";
export type OpportunityFiltersState = {
  type: string;
  field: string;
  eligibility: string;
  location: string;
  deadline: string;
};
const initialFilters: OpportunityFiltersState = {
  type: "all",
  field: "all",
  eligibility: "all",
  location: "all",
  deadline: "all",
};

export default function OpportunitiesPage() {
  const { language } = useLayoutState();
  const [items, setItems] = useState<Opportunity[]>(fallback);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | "all">("all");
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState<OpportunitySort>("relevancy");

  useEffect(() => {
    fetchDjangoOpportunities()
      .then(setItems)
      .catch(() => setItems(fallback));
  }, []);

  const counts = useMemo(
    () =>
      items.reduce<Record<string, number>>((result, item) => {
        result.all = (result.all ?? 0) + 1;
        result[item.category] = (result[item.category] ?? 0) + 1;
        return result;
      }, {}),
    [items],
  );
  const values = useMemo(
    () => ({
      type: [...new Set(items.map((item) => item.type))],
      field: [
        ...new Set(items.map((item) => item.field).filter(Boolean)),
      ] as string[],
      eligibility: [
        ...new Set(items.map((item) => item.eligibility).filter(Boolean)),
      ] as string[],
      location: [
        ...new Set(items.map((item) => item.location).filter(Boolean)),
      ] as string[],
    }),
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
        (!term || searchable.includes(term)) &&
        (filters.type === "all" || item.type === filters.type) &&
        (filters.field === "all" || item.field === filters.field) &&
        (filters.eligibility === "all" ||
          item.eligibility === filters.eligibility) &&
        (filters.location === "all" || item.location === filters.location) &&
        (filters.deadline === "all" ||
          Boolean(item.deadline) === (filters.deadline === "has"))
      );
    });
    return [...result].sort((a, b) =>
      sort === "az"
        ? a.title.localeCompare(b.title)
        : sort === "za"
          ? b.title.localeCompare(a.title)
          : Number(b.featured) - Number(a.featured),
    );
  }, [category, filters, items, query, sort]);
  const clear = () => {
    setQuery("");
    setCategory("all");
    setFilters(initialFilters);
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
          <div className={styles.toolbarActions}>
            <OpportunitiesFilters
              language={language}
              values={values}
              filters={filters}
              onChange={setFilters}
            />
            <OpportunitiesSort
              value={sort}
              onChange={setSort}
              language={language}
            />
          </div>
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
