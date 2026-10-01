import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import HelpFeedbackContextBanner from "./HelpFeedbackContextBanner";
import HelpFeedbackSuccess from "./HelpFeedbackSuccess";
import styles from "@/app/help/HelpFeedbackPage.module.scss";
import type { ReportableResource } from "@/lib/resource-reporting";
import {
  MAX_FEEDBACK_MESSAGE_LENGTH,
  MAX_REPORTED_RESOURCES,
  MIN_FEEDBACK_MESSAGE_LENGTH,
} from "@/lib/feedback-validation";

type HelpFeedbackFormProps = {
  selectedResources: ReportableResource[];
  language: "en" | "ar";
  feedbackType: string;
  message: string;
  email: string;
  submitted: boolean;
  onStartResourceReport: () => void;
  onEditResourceSelection: () => void;
  onClearResourceSelection: () => void;
  onFeedbackTypeChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export default function HelpFeedbackForm({
  selectedResources,
  language,
  feedbackType,
  message,
  email,
  submitted,
  onStartResourceReport,
  onEditResourceSelection,
  onClearResourceSelection,
  onFeedbackTypeChange,
  onMessageChange,
  onEmailChange,
  onSubmit,
  onReset,
}: HelpFeedbackFormProps) {
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState("");
  const messageLength = Array.from(message.trim()).length;
  const messageInvalid = messageLength < MIN_FEEDBACK_MESSAGE_LENGTH;

  const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setSubmitError("");

    if (messageInvalid) {
      setSubmitError(
        language === "en"
          ? `Message must be at least ${MIN_FEEDBACK_MESSAGE_LENGTH} characters.`
          : `يجب ألا تقل الرسالة عن ${MIN_FEEDBACK_MESSAGE_LENGTH} حرفًا.`,
      );
      return;
    }

    if (selectedResources.length > MAX_REPORTED_RESOURCES) {
      setSubmitError(
        language === "en"
          ? `You can report up to ${MAX_REPORTED_RESOURCES} resources at a time.`
          : `يمكنك الإبلاغ عن ${MAX_REPORTED_RESOURCES} موردًا كحد أقصى في المرة الواحدة.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackType,
          message,
          email,
          companyWebsite,
          resources: selectedResources.map(({ key, id, title }) => ({
            key,
            id,
            title,
          })),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        retryAfterSeconds?: number;
        fields?: Record<string, string>;
      };

      if (response.status === 429) {
        const minutes = Math.max(
          1,
          Math.ceil((result.retryAfterSeconds ?? 60) / 60),
        );
        setSubmitError(
          language === "en"
            ? `Too many submissions. Please try again in ${minutes} minutes.`
            : `محاولات كثيرة. يرجى إعادة المحاولة بعد ${minutes} دقيقة.`,
        );
        return;
      }

      if (!response.ok) {
        const fields = result.fields ?? {};
        if (result.error === "delivery_not_configured") {
          setSubmitError(
            language === "en"
              ? "Feedback email is not configured yet. Please try again later."
              : "لم يتم إعداد بريد الملاحظات بعد. يرجى المحاولة لاحقًا.",
          );
        } else if (result.error === "email_delivery_failed") {
          setSubmitError(
            language === "en"
              ? "Your feedback couldn't be sent. Please try again shortly."
              : "تعذر إرسال ملاحظاتك. يرجى المحاولة مرة أخرى بعد قليل.",
          );
        } else if (fields.message === "too_short") {
          setSubmitError(
            language === "en"
              ? `Message must be at least ${MIN_FEEDBACK_MESSAGE_LENGTH} characters.`
              : `يجب ألا تقل الرسالة عن ${MIN_FEEDBACK_MESSAGE_LENGTH} حرفًا.`,
          );
        } else if (fields.message === "too_long") {
          setSubmitError(
            language === "en"
              ? `Message must be ${MAX_FEEDBACK_MESSAGE_LENGTH} characters or fewer.`
              : `يجب ألا تتجاوز الرسالة ${MAX_FEEDBACK_MESSAGE_LENGTH} حرفًا.`,
          );
        } else if (fields.email === "invalid") {
          setSubmitError(
            language === "en"
              ? "Enter a valid email address or leave the field empty."
              : "أدخل بريدًا إلكترونيًا صالحًا أو اترك الحقل فارغًا.",
          );
        } else if (fields.resources) {
          setSubmitError(
            language === "en"
              ? "Choose valid resources for this report."
              : "اختر موارد صالحة لهذا البلاغ.",
          );
        } else {
          setSubmitError(
            language === "en"
              ? "We couldn't validate your feedback. Check the form and try again."
              : "تعذر التحقق من الملاحظات. راجع النموذج وحاول مرة أخرى.",
          );
        }
        return;
      }

      onSubmit();
    } catch {
      setSubmitError(
        language === "en"
          ? "Your feedback couldn't be sent. Please check your connection and try again."
          : "تعذر إرسال ملاحظاتك. تحقق من الاتصال وحاول مرة أخرى.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted)
    return (
      <section className={styles.formPanel}>
        <HelpFeedbackSuccess onReset={onReset} />
      </section>
    );

  return (
    <section className={styles.formPanel}>
      <div className={styles.formIntro}>
        <div>
          <span className="material-symbols-outlined">rate_review</span>
          <h2>Send us feedback</h2>
        </div>
        <p>
          Tell us what&apos;s working, what isn&apos;t, or what you&apos;d like
          to see improved.
        </p>
      </div>
      {selectedResources.length > 0 ? (
        <HelpFeedbackContextBanner
          resources={selectedResources}
          language={language}
          onEdit={onEditResourceSelection}
          onClear={onClearResourceSelection}
        />
      ) : (
        <button
          className={styles.startResourceReport}
          type="button"
          onClick={onStartResourceReport}
        >
          <span className="material-symbols-outlined">report</span>
          {language === "en"
            ? "Report one or more resources"
            : "الإبلاغ عن مورد أو أكثر"}
        </button>
      )}
      <form className={styles.form} noValidate onSubmit={submitFeedback}>
        <label>
          Feedback Type <span>*</span>
          <select
            value={feedbackType}
            onChange={(event) => onFeedbackTypeChange(event.target.value)}
            required
          >
            <option value="report-resource">
              Report a Resource (Broken link, bad access)
            </option>
            <option value="suggestion">Suggestion &amp; Feature Idea</option>
            <option value="bug">Bug Report</option>
            <option value="incorrect-info">
              Report Incorrect Academic Information
            </option>
            <option value="general">General Feedback</option>
          </select>
        </label>
        <label>
          <span className={styles.labelRow}>
            Message <span>*</span>
            <small>
              {messageLength} / {MAX_FEEDBACK_MESSAGE_LENGTH}
            </small>
          </span>
          <textarea
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            maxLength={MAX_FEEDBACK_MESSAGE_LENGTH}
            minLength={MIN_FEEDBACK_MESSAGE_LENGTH}
            aria-invalid={submitAttempted && messageInvalid}
            aria-describedby="feedback-message-guidance"
            placeholder="Tell us what happened or what you'd like to suggest..."
            required
            rows={5}
          />
          <small id="feedback-message-guidance">
            {language === "en"
              ? `Enter ${MIN_FEEDBACK_MESSAGE_LENGTH}–${MAX_FEEDBACK_MESSAGE_LENGTH} characters. Be specific so the team can review it.`
              : `اكتب من ${MIN_FEEDBACK_MESSAGE_LENGTH} إلى ${MAX_FEEDBACK_MESSAGE_LENGTH} حرفًا مع توضيح التفاصيل.`}
          </small>
        </label>
        <label>
          Email (optional)
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            maxLength={254}
            placeholder="e.g. name@stemstudent.edu"
          />
          <small>
            Strictly optional. Only provide an email if you&apos;d like us to
            reply back.
          </small>
        </label>
        <label className={styles.honeypot} aria-hidden="true" tabIndex={-1}>
          Website
          <input
            type="text"
            name="companyWebsite"
            value={companyWebsite}
            onChange={(event) => setCompanyWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
        {submitError ? (
          <p className={styles.submitError} role="alert">
            {submitError}
          </p>
        ) : null}
        <button
          className={styles.submitButton}
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <LoaderCircle size={17} className={styles.submitSpinner} />
          ) : (
            <span className="material-symbols-outlined">send</span>
          )}
          {language === "en" ? "Send Feedback" : "إرسال الملاحظات"}
        </button>
      </form>
    </section>
  );
}
