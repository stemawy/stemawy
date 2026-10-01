import HelpFeedbackContextBanner from "./HelpFeedbackContextBanner";
import HelpFeedbackSuccess from "./HelpFeedbackSuccess";
import styles from "@/app/help/HelpFeedbackPage.module.scss";
import type { ReportableResource } from "@/lib/resource-reporting";

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
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
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
            <small>{message.length} / 600</small>
          </span>
          <textarea
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            maxLength={600}
            placeholder="Tell us what happened or what you'd like to suggest..."
            required
            rows={5}
          />
          <small>
            Be as specific as possible so our curators can verify the syllabus
            reference.
          </small>
        </label>
        <label>
          Email (optional)
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="e.g. name@stemstudent.edu"
          />
          <small>
            Strictly optional. Only provide an email if you&apos;d like us to
            reply back.
          </small>
        </label>
        <button className={styles.submitButton} type="submit">
          <span className="material-symbols-outlined">send</span>Send Feedback
        </button>
      </form>
    </section>
  );
}
