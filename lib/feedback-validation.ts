export const MIN_FEEDBACK_MESSAGE_LENGTH = 20;
export const MAX_FEEDBACK_MESSAGE_LENGTH = 600;
export const MAX_REPORTED_RESOURCES = 100;
export const MAX_FEEDBACK_PAYLOAD_BYTES = 32_768;

export const feedbackTypes = [
  "report-resource",
  "suggestion",
  "bug",
  "incorrect-info",
  "general",
] as const;

export type FeedbackType = (typeof feedbackTypes)[number];

export type FeedbackPayload = {
  feedbackType: FeedbackType;
  message: string;
  email: string;
  resources: Array<{ key: string; id: string; title: string }>;
  companyWebsite: string;
};

export function validateFeedbackPayload(value: unknown): {
  payload?: FeedbackPayload;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};
  if (!value || typeof value !== "object") {
    return { fields: { form: "invalid" } };
  }

  const raw = value as Record<string, unknown>;
  const feedbackType = raw.feedbackType;
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const companyWebsite =
    typeof raw.companyWebsite === "string" ? raw.companyWebsite.trim() : "";
  const rawResources = Array.isArray(raw.resources) ? raw.resources : [];
  const resources = rawResources.filter(
    (resource): resource is FeedbackPayload["resources"][number] =>
      !!resource &&
      typeof resource === "object" &&
      typeof (resource as { key?: unknown }).key === "string" &&
      typeof (resource as { id?: unknown }).id === "string" &&
      typeof (resource as { title?: unknown }).title === "string",
  );
  const messageLength = Array.from(message).length;

  if (
    typeof feedbackType !== "string" ||
    !feedbackTypes.includes(feedbackType as FeedbackType)
  ) {
    fields.feedbackType = "invalid";
  }
  if (messageLength < MIN_FEEDBACK_MESSAGE_LENGTH) {
    fields.message = "too_short";
  } else if (messageLength > MAX_FEEDBACK_MESSAGE_LENGTH) {
    fields.message = "too_long";
  }
  if (
    email.length > 254 ||
    (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) {
    fields.email = "invalid";
  }
  if (
    !Array.isArray(raw.resources) ||
    resources.length !== rawResources.length ||
    resources.length > MAX_REPORTED_RESOURCES
  ) {
    fields.resources = "invalid";
  }
  if (feedbackType === "report-resource" && resources.length === 0) {
    fields.resources = "required";
  }
  if (feedbackType !== "report-resource" && resources.length > 0) {
    fields.resources = "unexpected";
  }

  if (Object.keys(fields).length > 0) return { fields };

  return {
    fields,
    payload: {
      feedbackType: feedbackType as FeedbackType,
      message,
      email,
      resources,
      companyWebsite,
    },
  };
}
