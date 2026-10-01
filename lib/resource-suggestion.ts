export const MIN_RESOURCE_TITLE_LENGTH = 3;
export const MAX_RESOURCE_TITLE_LENGTH = 160;
export const MIN_RESOURCE_DESCRIPTION_LENGTH = 20;
export const MAX_RESOURCE_DESCRIPTION_LENGTH = 600;
export const MAX_RESOURCE_URL_LENGTH = 2048;
export const MAX_RESOURCE_SUBJECT_LENGTH = 160;

export const resourceSuggestionTypes = [
  "video",
  "article",
  "course",
  "practice",
  "reference",
  "other",
] as const;

export type ResourceSuggestionType = (typeof resourceSuggestionTypes)[number];

export type ResourceSuggestionPayload = {
  title: string;
  url: string;
  resourceType: ResourceSuggestionType;
  subject: string;
  description: string;
  email: string;
  companyWebsite: string;
};

export function validateResourceSuggestion(value: unknown): {
  payload?: ResourceSuggestionPayload;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};
  if (!value || typeof value !== "object") {
    return { fields: { form: "invalid" } };
  }

  const raw = value as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const url = typeof raw.url === "string" ? raw.url.trim() : "";
  const subject = typeof raw.subject === "string" ? raw.subject.trim() : "";
  const description =
    typeof raw.description === "string" ? raw.description.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const companyWebsite =
    typeof raw.companyWebsite === "string" ? raw.companyWebsite.trim() : "";
  const resourceType = raw.resourceType;

  const titleLength = Array.from(title).length;
  const descriptionLength = Array.from(description).length;

  if (titleLength < MIN_RESOURCE_TITLE_LENGTH) fields.title = "too_short";
  else if (titleLength > MAX_RESOURCE_TITLE_LENGTH) fields.title = "too_long";

  if (!url || url.length > MAX_RESOURCE_URL_LENGTH) {
    fields.url = "invalid";
  } else {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        fields.url = "invalid";
      }
    } catch {
      fields.url = "invalid";
    }
  }

  if (
    typeof resourceType !== "string" ||
    !resourceSuggestionTypes.includes(resourceType as ResourceSuggestionType)
  ) {
    fields.resourceType = "invalid";
  }

  if (!subject) {
    fields.subject = "required";
  } else if (subject.length > MAX_RESOURCE_SUBJECT_LENGTH) {
    fields.subject = "too_long";
  }
  if (descriptionLength < MIN_RESOURCE_DESCRIPTION_LENGTH) {
    fields.description = "too_short";
  } else if (descriptionLength > MAX_RESOURCE_DESCRIPTION_LENGTH) {
    fields.description = "too_long";
  }
  if (
    email.length > 254 ||
    (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) {
    fields.email = "invalid";
  }

  if (Object.keys(fields).length > 0) return { fields };

  return {
    fields,
    payload: {
      title,
      url,
      resourceType: resourceType as ResourceSuggestionType,
      subject,
      description,
      email,
      companyWebsite,
    },
  };
}
