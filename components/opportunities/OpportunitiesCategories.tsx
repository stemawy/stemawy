"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { OpportunityCategory } from "@/data/opportunities";
import styles from "@/app/opportunities/OpportunitiesPage.module.scss";
const categories: Array<{
  id: OpportunityCategory | "all";
  en: string;
  ar: string;
}> = [
  { id: "all", en: "All", ar: "الكل" },
  { id: "research", en: "Research", ar: "بحث" },
  { id: "competition", en: "Competitions", ar: "مسابقات" },
  { id: "course", en: "Courses", ar: "دورات" },
  { id: "development", en: "Development", ar: "تطوير" },
];
export default function OpportunitiesCategories({
  language,
  counts,
  active,
  onChange,
}: {
  language: "en" | "ar";
  counts: Record<string, number>;
  active: OpportunityCategory | "all";
  onChange: (value: OpportunityCategory | "all") => void;
}) {
  const ar = language === "ar";
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = categoriesRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 4);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const element = categoriesRef.current;
    if (!element) return;

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollCategories = (direction: "left" | "right") => {
    categoriesRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.categoryScroller}>
      {canScrollLeft && (
        <button
          type="button"
          className={styles.categoryArrow}
          aria-label="Show previous categories"
          onClick={() => scrollCategories("left")}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
      )}
      <div className={styles.categories} ref={categoriesRef}>
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={active === item.id}
            className={`${styles.category} ${active === item.id ? styles.categoryActive : ""}`}
            onClick={() => onChange(item.id)}
          >
            <span>{ar ? item.ar : item.en}</span>
            <b>{counts[item.id] ?? 0}</b>
          </button>
        ))}
      </div>
      {canScrollRight && (
        <button
          type="button"
          className={styles.categoryArrow}
          aria-label="Show more categories"
          onClick={() => scrollCategories("right")}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
