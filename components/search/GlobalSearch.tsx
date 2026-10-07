"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useLayoutState } from "@/components/layout/layout-context";
import { type GlobalSearchResponse } from "@/lib/search";
import { getTranslations } from "@/lib/i18n";
import headerStyles from "@/components/layout/Header.module.scss";
import styles from "./GlobalSearch.module.scss";
import SearchResults from "./SearchResults";

const MIN_QUERY_LENGTH = 2;

function getResultCountLabel(count: number, language: "en" | "ar") {
  if (language === "ar") return `${count} نتيجة`;
  return `${count} ${count === 1 ? "match" : "matches"}`;
}

export default function GlobalSearch() {
  const container = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const requestSequence = useRef(0);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState("");
  const [resultState, setResultState] = useState<{
    query: string;
    response: GlobalSearchResponse;
  } | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const response =
    resultState?.query === trimmedQuery ? resultState.response : null;
  const loading =
    open && canSearch && (response === null || loadingQuery === trimmedQuery);
  const results = response?.groups.flatMap((group) => group.results) ?? [];

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        input.current?.focus();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleDismiss = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleDismiss);
    return () => document.removeEventListener("mousedown", handleDismiss);
  }, [open]);

  useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`global-search-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    if (!open || !canSearch) {
      requestSequence.current += 1;
      return;
    }

    const requestId = ++requestSequence.current;
    const requestController = new AbortController();
    const timeout = window.setTimeout(() => {
      setLoadingQuery(trimmedQuery);
      void fetch(
        `/api/search?q=${encodeURIComponent(trimmedQuery)}&lang=${language}&limit=4`,
        { signal: requestController.signal },
      )
        .then((result) => {
          if (!result.ok) throw new Error("Search request failed");
          return result.json() as Promise<GlobalSearchResponse>;
        })
        .then((data) => {
          if (requestSequence.current === requestId) {
            setResultState({ query: trimmedQuery, response: data });
          }
        })
        .catch((error: unknown) => {
          if (requestSequence.current !== requestId) return;
          if (error instanceof Error && error.name === "AbortError") return;
          setResultState({
            query: trimmedQuery,
            response: { total: 0, groups: [] },
          });
        })
        .finally(() => {
          if (requestSequence.current === requestId) setLoadingQuery("");
        });
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      requestController.abort();
      if (requestSequence.current === requestId) {
        requestSequence.current += 1;
      }
    };
  }, [canSearch, language, open, trimmedQuery]);

  const closePanel = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const openResult = (index: number) => {
    const result = results[index];
    if (!result) return;

    closePanel();
    if (result.external) {
      window.open(result.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(result.href);
    }
  };

  const openFullResults = () => {
    if (!canSearch) return;
    closePanel();
    router.push(
      `/search?q=${encodeURIComponent(trimmedQuery)}&lang=${language}`,
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      closePanel();
      input.current?.blur();
      return;
    }

    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
      return;
    }

    if (event.key === "Enter" && canSearch) {
      event.preventDefault();
      if (activeIndex >= 0) openResult(activeIndex);
      else openFullResults();
    }
  };

  const searchHint =
    language === "ar"
      ? "ابحث في الفرص والمهارات والمواد والوحدات"
      : "Search opportunities, skills, subjects, and units";
  const typeMore =
    language === "ar"
      ? "اكتب حرفين على الأقل للبحث"
      : "Type at least 2 characters";
  const noResults =
    language === "ar"
      ? "لا توجد نتائج مطابقة. جرّب كلمات أخرى."
      : "No matches found. Try different keywords.";
  const searching = language === "ar" ? "جارٍ البحث..." : "Searching...";
  const viewAll = language === "ar" ? "عرض كل النتائج" : "View all results";

  return (
    <div className={styles.searchControl} ref={container}>
      <div className={styles.searchShellContent}>
        <Search
          className={headerStyles.searchIcon}
          size={21}
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          ref={input}
          className={headerStyles.searchInput}
          type="search"
          value={query}
          placeholder={t.common.searchPlaceholder}
          role="combobox"
          aria-label={t.common.searchStemawy}
          aria-expanded={open}
          aria-controls="global-search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `global-search-option-${activeIndex}` : undefined
          }
          dir={language === "ar" ? "rtl" : "ltr"}
          onFocus={() => {
            setOpen(true);
            setActiveIndex(-1);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {query ? (
          <button
            className={styles.clearButton}
            type="button"
            aria-label={language === "ar" ? "مسح البحث" : "Clear search"}
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
              input.current?.focus();
            }}
          >
            <X size={15} />
          </button>
        ) : null}
        <kbd className={headerStyles.shortcut} aria-label={t.common.controlK}>
          CTRL K
        </kbd>
      </div>

      {open ? (
        <div
          id="global-search-results"
          className={styles.panel}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {!canSearch ? (
            <div className={styles.panelStatus}>
              {query ? typeMore : searchHint}
            </div>
          ) : loading ? (
            <div className={styles.panelStatus} aria-live="polite">
              {searching}
            </div>
          ) : response && response.total > 0 ? (
            <>
              <SearchResults
                groups={response.groups}
                language={language}
                activeIndex={activeIndex}
                onResultClick={closePanel}
              />
              <div className={styles.panelFooter}>
                <span>{getResultCountLabel(response.total, language)}</span>
                <button
                  className={styles.viewAll}
                  type="button"
                  onClick={openFullResults}
                >
                  {viewAll}
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </>
          ) : response ? (
            <div className={styles.panelStatus} aria-live="polite">
              {noResults}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
