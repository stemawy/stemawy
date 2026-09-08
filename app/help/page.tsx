"use client";

import { useState } from "react";
import HelpFeedbackForm from "@/components/help/HelpFeedbackForm";
import HelpFeedbackHeader from "@/components/help/HelpFeedbackHeader";
import HelpFeedbackResourceCard from "@/components/help/HelpFeedbackResourceCard";
import styles from "./HelpFeedbackPage.module.scss";

export type FeedbackContext = { label: string; detail: string };

const defaultContext: FeedbackContext = {
  label: "Referenced Context",
  detail: "Physics - Unit 03 LO Sheet #4",
};

export default function HelpFeedbackPage() {
  const [context, setContext] = useState<FeedbackContext | null>(
    defaultContext,
  );
  const [feedbackType, setFeedbackType] = useState("report-resource");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setFeedbackType("report-resource");
    setMessage("");
    setEmail("");
    setSubmitted(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <HelpFeedbackHeader />
        <div className={styles.contentGrid}>
          <HelpFeedbackForm
            context={context}
            feedbackType={feedbackType}
            message={message}
            email={email}
            submitted={submitted}
            onContextClear={() => setContext(null)}
            onFeedbackTypeChange={setFeedbackType}
            onMessageChange={setMessage}
            onEmailChange={setEmail}
            onSubmit={() => setSubmitted(true)}
            onReset={resetForm}
          />
          <HelpFeedbackResourceCard />
        </div>
        <p className={styles.privacyNote}>
          <span className="material-symbols-outlined">lock_open</span>
          No account required <span>•</span> Submissions reviewed by peer STEM
          mentors <span>•</span> Anonymous &amp; lightweight
        </p>
      </div>
    </div>
  );
}
