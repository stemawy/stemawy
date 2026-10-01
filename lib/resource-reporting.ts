import { getAllSubjects, getDataset } from "@/data/catalog";
import {
  getLocalizedContentText,
  getLocalizedSubject,
  type Language,
} from "@/lib/i18n";

export type ReportableResource = {
  key: string;
  id: string;
  title: string;
  type: string;
  provider: string;
  subject: string;
  grade: string;
  semester: string;
  unit: string;
};

export type ReportableResourceSearch = {
  total: number;
  resources: ReportableResource[];
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim();
}

export function searchReportableResources(
  rawQuery: string,
  language: Language,
  limit = 40,
): ReportableResourceSearch {
  const query = normalize(rawQuery.slice(0, 120));
  const resources: ReportableResource[] = [];

  for (const subject of getAllSubjects()) {
    const dataset = getDataset(subject.id);
    if (!dataset) continue;

    const localizedSubject = getLocalizedSubject(subject, language);
    const unitByResource = new Map<string, string>();

    for (const content of dataset.subject.content) {
      if (content.type !== "unit") continue;
      const unitTitle = getLocalizedContentText(content.title, language);
      for (const resourceId of content.resources) {
        if (typeof resourceId === "string") {
          unitByResource.set(resourceId, unitTitle);
        }
      }
      for (const concept of content.concepts) {
        for (const resourceId of concept.resources) {
          unitByResource.set(resourceId, unitTitle);
        }
      }
    }

    const grade = subject.grade.replace(/^Grade\s*/i, "Grade ");
    const semester = subject.semester.replace(/^Semester\s*/i, "Semester ");

    for (const resource of dataset.resources) {
      resources.push({
        key: `${subject.id}:${resource.id}`,
        id: resource.id,
        title: getLocalizedContentText(resource.title, language),
        type: resource.type,
        provider: resource.provider,
        subject: localizedSubject.name,
        grade,
        semester,
        unit: unitByResource.get(resource.id) ?? "",
      });
    }
  }

  const normalizedResources = resources.map((resource) => {
    const searchable = normalize(
      [
        resource.title,
        resource.type,
        resource.provider,
        resource.subject,
        resource.grade,
        resource.semester,
        resource.unit,
      ].join(" "),
    );
    const terms = query.split(" ").filter(Boolean);
    const matchedTerms = terms.filter((term) => searchable.includes(term));
    const score = !query
      ? 1
      : matchedTerms.length !== terms.length
        ? 0
        : normalize(resource.title).startsWith(query)
          ? 3
          : 2;

    return { resource, score };
  });

  const matches = normalizedResources
    .filter((entry) => entry.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.resource.subject.localeCompare(right.resource.subject) ||
        left.resource.title.localeCompare(right.resource.title),
    );

  return {
    total: matches.length,
    resources: matches.slice(0, limit).map(({ resource }) => resource),
  };
}
