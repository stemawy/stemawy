import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";

import SearchResults from "@/components/search/SearchResults";
import { searchStemawy } from "@/lib/search";
import type { Language } from "@/lib/i18n";
import styles from "./SearchPage.module.scss";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const language: Language = params.lang === "ar" ? "ar" : "en";
  const arabic = language === "ar";
  const response = searchStemawy(query, language, 1000);

  return (
    <main className={styles.page} dir={arabic ? "rtl" : "ltr"}>
      <div className={styles.container}>
        <Link className={styles.backLink} href="/subjects">
          <ArrowUpRight size={15} aria-hidden="true" />
          {arabic ? "استكشف المنصة" : "Explore Stemawy"}
        </Link>
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>
            <Search size={14} aria-hidden="true" />
            {arabic ? "بحث شامل" : "GLOBAL SEARCH"}
          </p>
          <h1>{arabic ? "نتائج البحث" : "Search results"}</h1>
          <p>
            {arabic
              ? "الفرص والمهارات والمواد والوحدات، كلها في مكان واحد."
              : "Opportunities, skills, subjects, and units, all in one place."}
          </p>
        </header>

        <div className={styles.queryBar}>
          <Search size={18} aria-hidden="true" />
          <span>{query || (arabic ? "كل المحتوى" : "All content")}</span>
          {query ? (
            <span className={styles.resultCount}>
              {arabic
                ? `${response.total} نتيجة`
                : `${response.total} ${response.total === 1 ? "match" : "matches"}`}
            </span>
          ) : null}
        </div>

        {query.length < 2 ? (
          <div className={styles.emptyState}>
            {arabic
              ? "اكتب كلمتين على الأقل في شريط البحث للعثور على المحتوى."
              : "Enter at least two characters in the header search to find content."}
          </div>
        ) : response.total > 0 ? (
          <SearchResults
            groups={response.groups}
            language={language}
            compact={false}
          />
        ) : (
          <div className={styles.emptyState}>
            {arabic
              ? `لا توجد نتائج لـ “${query}”. جرّب كلمات أخرى.`
              : `No results for “${query}”. Try different keywords.`}
          </div>
        )}
      </div>
    </main>
  );
}
