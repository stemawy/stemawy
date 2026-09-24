"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SkillCategory } from "@/data/skills";
import styles from "@/app/skills/SkillsPage.module.scss";

const categories: Array<{ id: SkillCategory | "all"; en: string; ar: string }> =
  [
    { id: "all", en: "All", ar: "الكل" },
    { id: "english", en: "English", ar: "الإنجليزية" },
    { id: "programming", en: "Programming", ar: "البرمجة" },
    { id: "study-learning", en: "Study & Learning", ar: "الدراسة والتعلم" },
    { id: "mathematics", en: "Mathematics", ar: "الرياضيات" },
    { id: "science", en: "Science", ar: "العلوم" },
    { id: "productivity", en: "Productivity", ar: "الإنتاجية" },
    { id: "tools-utility", en: "Tools & Utility", ar: "الأدوات" },
  ];

export default function SkillsCategories({
  language,
  counts,
  active,
  onChange,
}: {
  language: "en" | "ar";
  counts: Record<string, number>;
  active: SkillCategory | "all";
  onChange: (category: SkillCategory | "all") => void;
}) {
  const arabic = language === "ar";
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
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.categorySection} aria-label="Skills categories">
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
      <div className={styles.categoryScroller} ref={categoriesRef}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={active === category.id}
            onClick={() => onChange(category.id)}
            className={`${styles.categoryButton} ${active === category.id ? styles.categoryButtonActive : ""}`}
          >
            <span>{arabic ? category.ar : category.en}</span>
            <span className={styles.count}>{counts[category.id] ?? 0}</span>
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
    </section>
  );
}
