"use client";

import Link from "next/link";
import { Flag, Send, X } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import {
  SubjectContent,
  SubjectHeader,
  SubjectNavigation,
} from "@/components/subjects";
import { getResourcesForSubject } from "@/data/catalog";
import { resources as allResources } from "@/data/resources";
import { subjects } from "@/data/subjects";
import { fetchDjangoSubject, type DjangoSubject } from "@/lib/django-api";
import styles from "./SubjectPage.module.scss";
import { useLayoutState } from "@/components/layout/layout-context";
import { getTranslations } from "@/lib/i18n";
import { REPORT_SELECTION_STORAGE_KEY } from "@/lib/resource-reporting";

export default function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = use(params);
  const router = useRouter();
  const { language } = useLayoutState();
  const t = getTranslations(language);
  const searchParams = useSearchParams();
  const fallbackSubject = subjects.find(
    (item) =>
      item.id === subjectId || item.id.startsWith(`${subjectId}-grade-`),
  );
  const [djangoSubject, setDjangoSubject] = useState<DjangoSubject>();

  useEffect(() => {
    fetchDjangoSubject(subjectId)
      .then(setDjangoSubject)
      .catch(() => setDjangoSubject(undefined));
  }, [subjectId]);

  const subject = djangoSubject ?? fallbackSubject;
  const contentItems = subject?.content ?? [];
  const requestedUnit = searchParams.get("unit");
  const [selectedId, setSelectedId] = useState(
    requestedUnit ?? contentItems[0]?.id ?? "",
  );
  const [reportMode, setReportMode] = useState(false);
  const [selectedReportKeys, setSelectedReportKeys] = useState<string[]>([]);

  if (!subject) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>{t.subjects.detail.subjectNotFound}</h1>
          <Link href="/subjects">{t.subjects.detail.backToSubjects}</Link>
        </div>
      </div>
    );
  }

  const selectedItem =
    contentItems.find((item) => item.id === selectedId) ?? contentItems[0];
  const selectedReportKeySet = new Set(selectedReportKeys);
  const toggleReportResource = (key: string) => {
    setSelectedReportKeys((current) =>
      current.includes(key)
        ? current.filter((selectedKey) => selectedKey !== key)
        : [...current, key],
    );
  };
  const exitReportMode = () => {
    setReportMode(false);
    setSelectedReportKeys([]);
  };
  const sendToFeedback = () => {
    if (selectedReportKeys.length === 0) return;
    window.sessionStorage.setItem(
      REPORT_SELECTION_STORAGE_KEY,
      JSON.stringify(selectedReportKeys),
    );
    router.push("/help?report=resources");
  };
  const english = language === "en";

  return (
    <div className={styles.page} dir={language === "ar" ? "rtl" : "ltr"}>
      <SubjectHeader subject={subject} />
      <div
        className={`${styles.reportModeToolbar} ${reportMode ? styles.reportModeToolbarActive : ""}`}
        aria-live="polite"
      >
        {!reportMode ? (
          <button
            className={styles.reportModeButton}
            type="button"
            onClick={() => setReportMode(true)}
          >
            <Flag size={16} aria-hidden="true" />
            {english ? "Report resources" : "الإبلاغ عن موارد"}
          </button>
        ) : (
          <>
            <div className={styles.reportModeStatus}>
              <Flag size={17} aria-hidden="true" />
              <strong>
                {english ? "Resource reporting mode" : "وضع الإبلاغ عن الموارد"}
              </strong>
              <span>
                {selectedReportKeys.length === 0
                  ? english
                    ? "Select resources from any unit"
                    : "حدد الموارد من أي وحدة"
                  : english
                    ? `${selectedReportKeys.length} selected`
                    : `${selectedReportKeys.length} محدد`}
              </span>
            </div>
            <div className={styles.reportModeActions}>
              {selectedReportKeys.length > 0 ? (
                <button
                  className={styles.reportClearButton}
                  type="button"
                  onClick={() => setSelectedReportKeys([])}
                >
                  {english ? "Clear selection" : "مسح التحديد"}
                </button>
              ) : null}
              <button
                className={styles.reportExitButton}
                type="button"
                onClick={exitReportMode}
              >
                <X size={15} aria-hidden="true" />
                {english ? "Exit" : "إنهاء"}
              </button>
              <button
                className={styles.reportSendButton}
                type="button"
                disabled={selectedReportKeys.length === 0}
                onClick={sendToFeedback}
              >
                <Send size={15} aria-hidden="true" />
                {english ? "Send to feedback" : "إرسال إلى الملاحظات"}
              </button>
            </div>
          </>
        )}
      </div>
      <div className={styles.layout}>
        <SubjectNavigation
          items={contentItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <SubjectContent
          item={selectedItem}
          subjectId={subjectId}
          reportSubjectId={subject.id}
          reportMode={reportMode}
          selectedResourceKeys={selectedReportKeySet}
          onToggleReportResource={toggleReportResource}
          resources={
            djangoSubject
              ? (djangoSubject.resources ?? [])
              : getResourcesForSubject(subject.id).length > 0
                ? getResourcesForSubject(subject.id)
                : allResources
          }
        />
      </div>
    </div>
  );
}
