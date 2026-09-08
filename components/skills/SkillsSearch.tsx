"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/skills/SkillsPage.module.scss";

export default function SkillsSearch({
  language,
  value,
  onChange,
}: {
  language: "en" | "ar";
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return (
    <div className={styles.searchShell}>
      <span className="material-symbols-outlined">search</span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={language === "ar" ? "البحث في المهارات" : "Search skills"}
        placeholder={
          language === "ar"
            ? "ابحث في المهارات والفئات والمصادر..."
            : "Search skills by title, category, provider, or keywords..."
        }
      />
      {value && (
        <button
          type="button"
          className={styles.clearSearch}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
      <kbd>CTRL K</kbd>
    </div>
  );
}
