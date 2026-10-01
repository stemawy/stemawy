"use client";

import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  LoaderCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useLayoutState } from "@/components/layout/layout-context";
import {
  MAX_RESOURCE_DESCRIPTION_LENGTH,
  MAX_RESOURCE_SUBJECT_LENGTH,
  MAX_RESOURCE_TITLE_LENGTH,
  MAX_RESOURCE_URL_LENGTH,
  MIN_RESOURCE_DESCRIPTION_LENGTH,
  MIN_RESOURCE_TITLE_LENGTH,
  type ResourceSuggestionType,
  resourceSuggestionTypes,
  validateResourceSuggestion,
} from "@/lib/resource-suggestion";
import styles from "./SuggestResourcePage.module.scss";

const typeLabels: Record<ResourceSuggestionType, { en: string; ar: string }> = {
  video: { en: "Video", ar: "فيديو" },
  article: { en: "Article or guide", ar: "مقال أو دليل" },
  course: { en: "Course or lesson", ar: "دورة أو درس" },
  practice: { en: "Practice or problem set", ar: "تدريب أو مجموعة مسائل" },
  reference: { en: "Reference material", ar: "مادة مرجعية" },
  other: { en: "Other", ar: "أخرى" },
};

type SuggestionFields = {
  title: string;
  url: string;
  resourceType: ResourceSuggestionType;
  subject: string;
  description: string;
  email: string;
};

export default function SuggestResourcePage() {
  const { language } = useLayoutState();
  const arabic = language === "ar";
  const [fields, setFields] = useState<SuggestionFields>({
    title: "",
    url: "",
    resourceType: "article",
    subject: "",
    description: "",
    email: "",
  });
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const descriptionLength = Array.from(fields.description.trim()).length;

  const copy = arabic
    ? {
        breadcrumb: "اقتراح مورد",
        eyebrow: "مكتبة المجتمع",
        title: "اقترح موردًا",
        subtitle:
          "شارك موردًا تعليميًا مفيدًا ليساعد الطلاب الآخرين في رحلتهم الدراسية.",
        formTitle: "تفاصيل المورد",
        formDescription: "أضف رابطًا مباشرًا وبعض المعلومات لمراجعته.",
        name: "اسم المورد",
        url: "رابط المورد",
        type: "نوع المورد",
        subject: "المادة أو الوحدة المرتبطة",
        details: "لماذا تقترح هذا المورد؟",
        email: "بريدك الإلكتروني (اختياري)",
        emailHint: "سنستخدمه فقط للتواصل معك بشأن اقتراحك.",
        submit: "إرسال الاقتراح",
        minTitle: `اكتب ${MIN_RESOURCE_TITLE_LENGTH} أحرف على الأقل.`,
        maxTitle: `استخدم ${MAX_RESOURCE_TITLE_LENGTH} حرفًا أو أقل.`,
        invalidUrl: "أدخل رابطًا صالحًا يبدأ بـ http:// أو https://.",
        requiredSubject: "حدد المادة أو الوحدة المرتبطة.",
        maxSubject: `استخدم ${MAX_RESOURCE_SUBJECT_LENGTH} حرفًا أو أقل.`,
        minDetails: `اكتب ${MIN_RESOURCE_DESCRIPTION_LENGTH} حرفًا على الأقل.`,
        maxDetails: `استخدم ${MAX_RESOURCE_DESCRIPTION_LENGTH} حرفًا أو أقل.`,
        invalidEmail: "أدخل بريدًا صالحًا أو اترك الحقل فارغًا.",
        sendError: "تعذر إرسال الاقتراح. حاول مرة أخرى.",
        setupError: "إرسال البريد غير مُعد حاليًا.",
        rateLimit: "محاولات كثيرة. حاول مرة أخرى لاحقًا.",
        successTitle: "شكرًا على اقتراحك!",
        successDescription: "تم إرسال المورد إلى فريق Stemawy لمراجعته.",
        suggestAnother: "اقتراح مورد آخر",
        back: "العودة إلى المساعدة والملاحظات",
      }
    : {
        breadcrumb: "Suggest a resource",
        eyebrow: "COMMUNITY LIBRARY",
        title: "Suggest a resource",
        subtitle:
          "Share a useful learning resource to support other students in their studies.",
        formTitle: "Resource details",
        formDescription:
          "Add a direct link and a little context for our review.",
        name: "Resource name",
        url: "Resource link",
        type: "Resource type",
        subject: "Related subject or unit",
        details: "Why are you suggesting this resource?",
        email: "Your email (optional)",
        emailHint: "Only used if we need to follow up about your suggestion.",
        submit: "Send suggestion",
        minTitle: `Enter at least ${MIN_RESOURCE_TITLE_LENGTH} characters.`,
        maxTitle: `Use ${MAX_RESOURCE_TITLE_LENGTH} characters or fewer.`,
        invalidUrl: "Enter a valid link beginning with http:// or https://.",
        requiredSubject: "Select a related subject or unit.",
        maxSubject: `Use ${MAX_RESOURCE_SUBJECT_LENGTH} characters or fewer.`,
        minDetails: `Enter at least ${MIN_RESOURCE_DESCRIPTION_LENGTH} characters.`,
        maxDetails: `Use ${MAX_RESOURCE_DESCRIPTION_LENGTH} characters or fewer.`,
        invalidEmail: "Enter a valid email or leave this field blank.",
        sendError: "The suggestion could not be sent. Please try again.",
        setupError: "Resource suggestion email is not configured yet.",
        rateLimit: "Too many submissions. Please try again later.",
        successTitle: "Thanks for your suggestion!",
        successDescription:
          "Your resource has been sent to the Stemawy team for review.",
        suggestAnother: "Suggest another resource",
        back: "Back to help & feedback",
      };

  const updateField = <Key extends keyof SuggestionFields>(
    key: Key,
    value: SuggestionFields[Key],
  ) => {
    setFields((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setFormError("");
  };

  const getFieldError = (field: string, error: string | undefined) => {
    if (!error) return "";
    if (field === "title")
      return error === "too_short" ? copy.minTitle : copy.maxTitle;
    if (field === "url") return copy.invalidUrl;
    if (field === "subject")
      return error === "required" ? copy.requiredSubject : copy.maxSubject;
    if (field === "description") {
      return error === "too_short" ? copy.minDetails : copy.maxDetails;
    }
    if (field === "email") return copy.invalidEmail;
    return copy.sendError;
  };

  const reset = () => {
    setFields({
      title: "",
      url: "",
      resourceType: "article",
      subject: "",
      description: "",
      email: "",
    });
    setCompanyWebsite("");
    setFieldErrors({});
    setFormError("");
    setSubmitted(false);
  };

  const submitSuggestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");

    const validation = validateResourceSuggestion({
      ...fields,
      companyWebsite,
    });
    if (!validation.payload) {
      setFieldErrors(validation.fields);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/resource-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.payload),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        retryAfterSeconds?: number;
        fields?: Record<string, string>;
      };

      if (response.status === 429) {
        setFormError(copy.rateLimit);
      } else if (!response.ok) {
        if (result.error === "delivery_not_configured") {
          setFormError(copy.setupError);
        } else if (result.fields) {
          setFieldErrors(result.fields);
        } else {
          setFormError(copy.sendError);
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setFormError(copy.sendError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page} dir={arabic ? "rtl" : "ltr"}>
      <div className={styles.container}>
        <header className={styles.header}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Stemawy</Link>
            <span aria-hidden="true">/</span>
            <Link href="/help">
              {arabic ? "المساعدة والملاحظات" : "Help & feedback"}
            </Link>
            <span aria-hidden="true">/</span>
            <strong>{copy.breadcrumb}</strong>
          </nav>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>
        </header>

        <div className={styles.layout}>
          <section className={styles.formPanel}>
            {submitted ? (
              <div className={styles.success} role="status" aria-live="polite">
                <span className={styles.successIcon}>
                  <CircleCheck size={26} />
                </span>
                <h2>{copy.successTitle}</h2>
                <p>{copy.successDescription}</p>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={reset}
                >
                  {copy.suggestAnother}
                </button>
                <Link className={styles.backLink} href="/help">
                  {arabic ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                  {copy.back}
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.formHeading}>
                  <span className={styles.stepNumber}>01</span>
                  <div>
                    <h2>{copy.formTitle}</h2>
                    <p>{copy.formDescription}</p>
                  </div>
                </div>

                <form
                  className={styles.form}
                  noValidate
                  onSubmit={submitSuggestion}
                >
                  <div className={styles.formGrid}>
                    <label className={styles.field} htmlFor="resource-title">
                      <span>
                        {copy.name} <b>*</b>
                      </span>
                      <input
                        id="resource-title"
                        value={fields.title}
                        maxLength={MAX_RESOURCE_TITLE_LENGTH}
                        aria-invalid={Boolean(fieldErrors.title)}
                        aria-describedby={
                          fieldErrors.title ? "resource-title-error" : undefined
                        }
                        onChange={(event) =>
                          updateField("title", event.target.value)
                        }
                        placeholder={
                          arabic
                            ? "مثال: دليل الأحياء"
                            : "e.g. Biology revision guide"
                        }
                      />
                      {fieldErrors.title ? (
                        <small
                          className={styles.fieldError}
                          id="resource-title-error"
                        >
                          {getFieldError("title", fieldErrors.title)}
                        </small>
                      ) : null}
                    </label>

                    <label
                      className={`${styles.field} ${styles.fieldType}`}
                      htmlFor="resource-type"
                    >
                      <span>
                        {copy.type} <b>*</b>
                      </span>
                      <select
                        id="resource-type"
                        value={fields.resourceType}
                        onChange={(event) =>
                          updateField(
                            "resourceType",
                            event.target.value as ResourceSuggestionType,
                          )
                        }
                      >
                        {resourceSuggestionTypes.map((type) => (
                          <option key={type} value={type}>
                            {typeLabels[type][language]}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={styles.field} htmlFor="resource-url">
                      <span>
                        {copy.url} <b>*</b>
                      </span>
                      <input
                        id="resource-url"
                        type="url"
                        value={fields.url}
                        maxLength={MAX_RESOURCE_URL_LENGTH}
                        aria-invalid={Boolean(fieldErrors.url)}
                        aria-describedby={
                          fieldErrors.url ? "resource-url-error" : undefined
                        }
                        onChange={(event) =>
                          updateField("url", event.target.value)
                        }
                        placeholder="https://"
                        dir="ltr"
                      />
                      {fieldErrors.url ? (
                        <small
                          className={styles.fieldError}
                          id="resource-url-error"
                        >
                          {getFieldError("url", fieldErrors.url)}
                        </small>
                      ) : null}
                    </label>

                    <label className={styles.field} htmlFor="resource-subject">
                      <span>
                        {copy.subject} <b>*</b>
                      </span>
                      <input
                        id="resource-subject"
                        value={fields.subject}
                        required
                        maxLength={MAX_RESOURCE_SUBJECT_LENGTH}
                        aria-invalid={Boolean(fieldErrors.subject)}
                        aria-describedby={
                          fieldErrors.subject
                            ? "resource-subject-error"
                            : undefined
                        }
                        onChange={(event) =>
                          updateField("subject", event.target.value)
                        }
                        placeholder={
                          arabic
                            ? "مثال: الأحياء، الخلية"
                            : "e.g. Biology, cells"
                        }
                      />
                      {fieldErrors.subject ? (
                        <small
                          className={styles.fieldError}
                          id="resource-subject-error"
                        >
                          {getFieldError("subject", fieldErrors.subject)}
                        </small>
                      ) : null}
                    </label>

                    <label
                      className={`${styles.field} ${styles.fieldFull}`}
                      htmlFor="resource-description"
                    >
                      <span className={styles.fieldLabelRow}>
                        <span>
                          {copy.details} <b>*</b>
                        </span>
                        <small>
                          {descriptionLength}/{MAX_RESOURCE_DESCRIPTION_LENGTH}
                        </small>
                      </span>
                      <textarea
                        id="resource-description"
                        value={fields.description}
                        maxLength={MAX_RESOURCE_DESCRIPTION_LENGTH}
                        aria-invalid={Boolean(fieldErrors.description)}
                        aria-describedby={
                          fieldErrors.description
                            ? "resource-description-error"
                            : undefined
                        }
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        rows={4}
                        placeholder={
                          arabic
                            ? "اشرح كيف سيساعد هذا المورد الطلاب..."
                            : "Tell us what it covers and how it helps students..."
                        }
                      />
                      {fieldErrors.description ? (
                        <small
                          className={styles.fieldError}
                          id="resource-description-error"
                        >
                          {getFieldError(
                            "description",
                            fieldErrors.description,
                          )}
                        </small>
                      ) : null}
                    </label>

                    <label
                      className={`${styles.field} ${styles.fieldFull}`}
                      htmlFor="resource-email"
                    >
                      <span>{copy.email}</span>
                      <input
                        id="resource-email"
                        type="email"
                        value={fields.email}
                        maxLength={254}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={
                          fieldErrors.email ? "resource-email-error" : undefined
                        }
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        placeholder="name@example.com"
                        dir="ltr"
                      />
                      <small>{copy.emailHint}</small>
                      {fieldErrors.email ? (
                        <small
                          className={styles.fieldError}
                          id="resource-email-error"
                        >
                          {getFieldError("email", fieldErrors.email)}
                        </small>
                      ) : null}
                    </label>
                  </div>

                  <label
                    className={styles.honeypot}
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    Website
                    <input
                      value={companyWebsite}
                      onChange={(event) =>
                        setCompanyWebsite(event.target.value)
                      }
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>

                  {formError ? (
                    <p className={styles.formError} role="alert">
                      {formError}
                    </p>
                  ) : null}

                  <div className={styles.formFooter}>
                    <span>
                      {arabic
                        ? "تتم مراجعة الاقتراح قبل نشره."
                        : "Suggestions are reviewed before they’re published."}
                    </span>
                    <button
                      className={styles.submitButton}
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <LoaderCircle className={styles.spinner} size={17} />
                      ) : (
                        <Send size={16} />
                      )}
                      {copy.submit}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
