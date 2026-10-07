"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type {
  ReportableResource,
  ReportableResourceSearch,
} from "@/lib/resource-reporting";
import type { Language } from "@/lib/i18n";
import styles from "@/app/help/HelpFeedbackPage.module.scss";

const PAGE_SIZE = 40;

export default function ResourceReportPicker({
  language,
  selected,
  onSelectionChange,
  onBack,
  onContinue,
}: {
  language: Language;
  selected: ReportableResource[];
  onSelectionChange: (resources: ReportableResource[]) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [resultState, setResultState] = useState<{
    key: string;
    response: ReportableResourceSearch;
    error: boolean;
  } | null>(null);
  const requestSequence = useRef(0);
  const requestKey = `${language}:${query.trim()}:${limit}`;
  const response =
    resultState?.key === requestKey ? resultState.response : null;
  const requestFailed = resultState?.key === requestKey && resultState.error;
  const selectedKeys = new Set(selected.map((resource) => resource.key));
  const visibleResources = response?.resources ?? [];
  const visibleSelectedCount = visibleResources.filter((resource) =>
    selectedKeys.has(resource.key),
  ).length;
  const allVisibleSelected =
    visibleResources.length > 0 &&
    visibleSelectedCount === visibleResources.length;

  useEffect(() => {
    const requestId = ++requestSequence.current;
    const requestController = new AbortController();
    const timeout = window.setTimeout(() => {
      void fetch(
        `/api/report-resources?q=${encodeURIComponent(query.trim())}&lang=${language}&limit=${limit}`,
        { signal: requestController.signal },
      )
        .then((result) => {
          if (!result.ok) throw new Error("Resource search request failed");
          return result.json() as Promise<ReportableResourceSearch>;
        })
        .then((data) => {
          if (requestSequence.current === requestId) {
            setResultState({ key: requestKey, response: data, error: false });
          }
        })
        .catch(() => {
          if (requestSequence.current === requestId) {
            setResultState({
              key: requestKey,
              response: { total: 0, resources: [] },
              error: true,
            });
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      requestController.abort();
      if (requestSequence.current === requestId) requestSequence.current += 1;
    };
  }, [language, limit, query, requestKey]);

  const toggleResource = (resource: ReportableResource) => {
    if (selectedKeys.has(resource.key)) {
      onSelectionChange(
        selected.filter(
          (selectedResource) => selectedResource.key !== resource.key,
        ),
      );
      return;
    }
    onSelectionChange([...selected, resource]);
  };

  const toggleVisibleResources = () => {
    if (allVisibleSelected) {
      const visibleKeys = new Set(
        visibleResources.map((resource) => resource.key),
      );
      onSelectionChange(
        selected.filter((resource) => !visibleKeys.has(resource.key)),
      );
      return;
    }

    const next = new Map(selected.map((resource) => [resource.key, resource]));
    for (const resource of visibleResources) next.set(resource.key, resource);
    onSelectionChange(Array.from(next.values()));
  };

  const english = language === "en";

  return (
    <section
      className={styles.pickerPanel}
      dir={english ? "ltr" : "rtl"}
      aria-labelledby="resource-picker-title"
    >
      <button className={styles.pickerBack} type="button" onClick={onBack}>
        {english ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        {english ? "Back to feedback" : "العودة إلى الملاحظات"}
      </button>

      <header className={styles.pickerHeader}>
        <span className={styles.pickerEyebrow}>
          {english ? "RESOURCE REPORT" : "الإبلاغ عن مورد"}
        </span>
        <h2 id="resource-picker-title">
          {english
            ? "Choose resources to report"
            : "اختر الموارد التي تريد الإبلاغ عنها"}
        </h2>
        <p>
          {english
            ? "Select one or more resources. You can review your selection before writing your feedback."
            : "اختر موردًا واحدًا أو أكثر، ويمكنك مراجعة اختيارك قبل كتابة ملاحظاتك."}
        </p>
      </header>

      <div className={styles.pickerControls}>
        <label className={styles.pickerSearch}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder={
              english
                ? "Search resources, subjects, or units"
                : "ابحث عن مورد أو مادة أو وحدة"
            }
            aria-label={
              english ? "Search reportable resources" : "البحث عن الموارد"
            }
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(PAGE_SIZE);
            }}
          />
        </label>
        <button
          className={styles.selectVisibleButton}
          type="button"
          disabled={visibleResources.length === 0}
          onClick={toggleVisibleResources}
        >
          {allVisibleSelected
            ? english
              ? "Deselect shown"
              : "إلغاء تحديد الظاهر"
            : english
              ? "Select shown"
              : "تحديد الظاهر"}
        </button>
      </div>

      {selected.length > 0 ? (
        <section
          className={styles.pickerSelectedList}
          aria-label={english ? "Selected resources" : "الموارد المحددة"}
        >
          <div className={styles.pickerSelectedHeader}>
            <strong>
              {english
                ? `${selected.length} selected`
                : `${selected.length} محدد`}
            </strong>
            <button type="button" onClick={() => onSelectionChange([])}>
              {english ? "Clear all" : "مسح الكل"}
            </button>
          </div>
          <div className={styles.pickerSelectedItems}>
            {selected.map((resource) => (
              <button
                className={styles.pickerSelectedItem}
                key={resource.key}
                type="button"
                title={resource.title}
                aria-label={
                  english
                    ? `Remove ${resource.title} from selection`
                    : `إزالة ${resource.title} من التحديد`
                }
                onClick={() => toggleResource(resource)}
              >
                <span>{resource.title}</span>
                <X size={13} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <div className={styles.pickerList} aria-live="polite">
        {response === null ? (
          <div className={styles.pickerStatus}>
            <LoaderCircle size={18} className={styles.pickerSpinner} />
            {english ? "Loading resources..." : "جارٍ تحميل الموارد..."}
          </div>
        ) : requestFailed ? (
          <div className={styles.pickerStatus}>
            {english
              ? "Resources could not be loaded. Try again."
              : "تعذر تحميل الموارد. حاول مرة أخرى."}
          </div>
        ) : visibleResources.length === 0 ? (
          <div className={styles.pickerStatus}>
            {english ? "No matching resources." : "لا توجد موارد مطابقة."}
          </div>
        ) : (
          visibleResources.map((resource) => {
            const checked = selectedKeys.has(resource.key);
            const details = [
              resource.subject,
              resource.grade,
              resource.semester,
              resource.unit,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <label
                className={`${styles.pickerResource} ${checked ? styles.pickerResourceSelected : ""}`}
                key={resource.key}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleResource(resource)}
                />
                <span className={styles.pickerCheckbox} aria-hidden="true">
                  {checked ? <Check size={14} strokeWidth={3} /> : null}
                </span>
                <span className={styles.pickerResourceCopy}>
                  <strong>{resource.title}</strong>
                  <span>
                    {details || resource.subject}
                    {resource.provider ? ` · ${resource.provider}` : ""}
                  </span>
                </span>
                <span className={styles.pickerType}>{resource.type}</span>
              </label>
            );
          })
        )}
      </div>

      {response && response.total > visibleResources.length ? (
        <button
          className={styles.loadMoreButton}
          type="button"
          onClick={() => setLimit((current) => current + PAGE_SIZE)}
        >
          {english
            ? `Show more (${response.total - visibleResources.length} remaining)`
            : `عرض المزيد (المتبقي ${response.total - visibleResources.length})`}
        </button>
      ) : null}

      <footer className={styles.pickerFooter}>
        <div className={styles.pickerSelectionCount} aria-live="polite">
          <strong>{selected.length}</strong>
          {english
            ? ` ${selected.length === 1 ? "resource" : "resources"} selected`
            : ` مورد محدد`}
          {selected.length > 0 ? (
            <button type="button" onClick={() => onSelectionChange([])}>
              {english ? "Clear selection" : "مسح التحديد"}
            </button>
          ) : null}
        </div>
        <button
          className={styles.pickerContinue}
          type="button"
          disabled={selected.length === 0}
          onClick={onContinue}
        >
          {english ? "Continue to feedback" : "متابعة إلى الملاحظات"}
          {english ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
        </button>
      </footer>
    </section>
  );
}
