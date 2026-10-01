import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import type { Language } from "@/lib/i18n";
import type { GlobalSearchGroup, GlobalSearchType } from "@/lib/search";
import styles from "./SearchResults.module.scss";

const icons = {
  opportunity: Trophy,
  skill: Lightbulb,
  subject: GraduationCap,
  unit: BookOpen,
};

const labels: Record<GlobalSearchType, { en: string; ar: string }> = {
  opportunity: { en: "Opportunities", ar: "الفرص" },
  skill: { en: "Skills", ar: "المهارات" },
  subject: { en: "Subjects", ar: "المواد" },
  unit: { en: "Units", ar: "الوحدات" },
};

export default function SearchResults({
  groups,
  language,
  activeIndex = -1,
  onResultClick,
  compact = true,
}: {
  groups: GlobalSearchGroup[];
  language: Language;
  activeIndex?: number;
  onResultClick?: () => void;
  compact?: boolean;
}) {
  let resultIndex = 0;

  return (
    <div
      className={`${styles.results} ${compact ? "" : styles.fullResults}`}
      role="listbox"
      aria-label={language === "ar" ? "نتائج البحث" : "Search results"}
    >
      {groups.map((group) => {
        const Icon = icons[group.type];
        const label = labels[group.type][language];

        return (
          <section
            className={styles.group}
            key={group.type}
            role="group"
            aria-label={label}
          >
            <div className={styles.groupHeading}>
              <span>{label}</span>
              <span className={styles.groupCount}>{group.count}</span>
            </div>
            <ul>
              {group.results.map((result) => {
                const optionIndex = resultIndex++;
                const active = optionIndex === activeIndex;
                const content = (
                  <>
                    <span className={styles.resultIcon} aria-hidden="true">
                      <Icon size={17} />
                    </span>
                    <span className={styles.resultCopy}>
                      <strong>{result.title}</strong>
                      <span className={styles.resultDetail}>
                        {result.detail}
                      </span>
                      <span className={styles.resultDescription}>
                        {result.description}
                      </span>
                    </span>
                    {result.external ? (
                      <ArrowUpRight
                        className={styles.resultArrow}
                        size={15}
                        aria-hidden="true"
                      />
                    ) : null}
                  </>
                );

                return (
                  <li key={`${result.type}-${result.id}`}>
                    {result.external ? (
                      <a
                        id={`global-search-option-${optionIndex}`}
                        className={`${styles.resultLink} ${active ? styles.resultActive : ""}`}
                        href={result.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="option"
                        aria-selected={active}
                        onClick={onResultClick}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        id={`global-search-option-${optionIndex}`}
                        className={`${styles.resultLink} ${active ? styles.resultActive : ""}`}
                        href={result.href}
                        role="option"
                        aria-selected={active}
                        onClick={onResultClick}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
