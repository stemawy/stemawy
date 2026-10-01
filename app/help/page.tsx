"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import HelpFeedbackForm from "@/components/help/HelpFeedbackForm";
import HelpFeedbackHeader from "@/components/help/HelpFeedbackHeader";
import HelpFeedbackResourceCard from "@/components/help/HelpFeedbackResourceCard";
import ResourceReportPicker from "@/components/help/ResourceReportPicker";
import { useLayoutState } from "@/components/layout/layout-context";
import type { ReportableResource } from "@/lib/resource-reporting";
import { REPORT_SELECTION_STORAGE_KEY } from "@/lib/resource-reporting";
import styles from "./HelpFeedbackPage.module.scss";

export default function HelpFeedbackPage() {
  const router = useRouter();
  const { language } = useLayoutState();
  const handoffSequence = useRef(0);
  const [selectedResources, setSelectedResources] = useState<
    ReportableResource[]
  >([]);
  const [handoffError, setHandoffError] = useState(false);
  const [reportingMode, setReportingMode] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (
      new URLSearchParams(window.location.search).get("report") !== "resources"
    ) {
      return;
    }

    let keys: string[] = [];
    try {
      const stored = JSON.parse(
        window.sessionStorage.getItem(REPORT_SELECTION_STORAGE_KEY) ?? "[]",
      ) as unknown;
      if (Array.isArray(stored)) {
        keys = stored.filter((key): key is string => typeof key === "string");
      }
    } catch {
      keys = [];
    }

    if (keys.length === 0) {
      router.replace("/help", { scroll: false });
      return;
    }

    const requestId = ++handoffSequence.current;
    void fetch("/api/report-resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys, language }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load selected resources");
        return response.json() as Promise<{ resources: ReportableResource[] }>;
      })
      .then(({ resources }) => {
        if (handoffSequence.current !== requestId) return;
        setSelectedResources(resources);
        if (resources.length > 0) setFeedbackType("report-resource");
        window.sessionStorage.removeItem(REPORT_SELECTION_STORAGE_KEY);
        router.replace("/help", { scroll: false });
      })
      .catch(() => {
        if (handoffSequence.current === requestId) setHandoffError(true);
      });

    return () => {
      if (handoffSequence.current === requestId) handoffSequence.current += 1;
    };
  }, [language, router]);

  const resetForm = () => {
    setFeedbackType("general");
    setMessage("");
    setEmail("");
    setSelectedResources([]);
    setReportingMode(false);
    setSubmitted(false);
  };

  const continueToFeedback = () => {
    if (selectedResources.length === 0) return;
    setFeedbackType("report-resource");
    setReportingMode(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <HelpFeedbackHeader />
        {handoffError ? (
          <p className={styles.reportHandoffError} role="status">
            {language === "en"
              ? "We couldn't load the selected resources. You can retry the report from the subject page."
              : "تعذر تحميل الموارد المحددة. يمكنك إعادة محاولة الإبلاغ من صفحة المادة."}
          </p>
        ) : null}
        <div className={styles.contentGrid}>
          {reportingMode ? (
            <ResourceReportPicker
              language={language}
              selected={selectedResources}
              onSelectionChange={setSelectedResources}
              onBack={() => setReportingMode(false)}
              onContinue={continueToFeedback}
            />
          ) : (
            <HelpFeedbackForm
              selectedResources={selectedResources}
              language={language}
              feedbackType={feedbackType}
              message={message}
              email={email}
              submitted={submitted}
              onStartResourceReport={() => setReportingMode(true)}
              onEditResourceSelection={() => setReportingMode(true)}
              onClearResourceSelection={() => {
                setSelectedResources([]);
                setFeedbackType("general");
              }}
              onFeedbackTypeChange={(value) => {
                if (value === "report-resource") {
                  setReportingMode(true);
                  return;
                }
                setFeedbackType(value);
              }}
              onMessageChange={setMessage}
              onEmailChange={setEmail}
              onSubmit={() => setSubmitted(true)}
              onReset={resetForm}
            />
          )}
          <HelpFeedbackResourceCard />
        </div>
      </div>
    </div>
  );
}
