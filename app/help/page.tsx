"use client";

import { useState } from "react";
import HelpFeedbackForm from "@/components/help/HelpFeedbackForm";
import HelpFeedbackHeader from "@/components/help/HelpFeedbackHeader";
import HelpFeedbackResourceCard from "@/components/help/HelpFeedbackResourceCard";
import ResourceReportPicker from "@/components/help/ResourceReportPicker";
import { useLayoutState } from "@/components/layout/layout-context";
import type { ReportableResource } from "@/lib/resource-reporting";
import styles from "./HelpFeedbackPage.module.scss";

export default function HelpFeedbackPage() {
  const { language } = useLayoutState();
  const [selectedResources, setSelectedResources] = useState<
    ReportableResource[]
  >([]);
  const [reportingMode, setReportingMode] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
