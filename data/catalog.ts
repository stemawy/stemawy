import type { Resource, Subject, SubjectContentType } from "@/types";

import type { MigratedDataset } from "./migration-types";

import datasets from "@/data/generated/migrated/index";

// ─────────────────────────────────────────────
// Normalize
// ─────────────────────────────────────────────

const migratedDatasets = (datasets as unknown[]).filter(
  (entry): entry is MigratedDataset =>
    !!entry &&
    typeof entry === "object" &&
    "subject" in entry &&
    !!(entry as { subject?: { id?: string; name?: string } }).subject &&
    typeof (entry as { subject?: { id?: string; name?: string } }).subject
      ?.id === "string" &&
    typeof (entry as { subject?: { id?: string; name?: string } }).subject
      ?.name === "string",
);

function canonicalSubjectKey(subjectIdOrName: string): string {
  const value = String(subjectIdOrName ?? "")
    .trim()
    .toLowerCase();

  if (!value) {
    return "unknown";
  }

  if (value.startsWith("maths") || value.startsWith("mathematics")) {
    return value;
  }

  if (
    value.startsWith("computerscience") ||
    value.startsWith("computer-science")
  ) {
    return value;
  }

  if (value.startsWith("socialstudies") || value.startsWith("social-studies")) {
    return value;
  }

  return value
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const resolvedDatasets = migratedDatasets;

function categoryForSubject(subjectId: string): Subject["category"] {
  if (
    ["physics", "chemistry", "biology", "geology", "maths", "mechanics"].some(
      (key) => subjectId.startsWith(`${key}-`),
    )
  ) {
    return "science";
  }

  if (
    ["arabic", "english", "german", "french"].some((key) =>
      subjectId.startsWith(`${key}-`),
    )
  ) {
    return "languages";
  }

  if (
    subjectId.startsWith("computerscience-") ||
    subjectId.startsWith("computer-science-")
  ) {
    return "computing";
  }

  return "humanities";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeSubject(
  subject: Partial<MigratedDataset["subject"]> | undefined,
): Subject {
  const safeSubject = {
    id: "unknown",
    name: "Untitled subject",
    description: "",
    grade: "11",
    semester: "1",
    icon: "subject",
    content: [],
    category: undefined,
    ...subject,
  };

  const normalizedId = String(safeSubject.id ?? "unknown").trim() || "unknown";
  const normalizedName = String(safeSubject.name ?? "Untitled subject").trim();
  const seenConceptIds = new Set<string>();

  const content = Array.isArray(safeSubject.content)
    ? [...safeSubject.content]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item, itemIndex) => {
          const itemId = String(item.id ?? "").trim();
          const resolvedItemId =
            itemId ||
            `${normalizedId}-unit-${String(itemIndex + 1).padStart(2, "0")}`;
          const seenConcepts = new Set<string>();
          const rawResources = Array.isArray(item.resources)
            ? (item.resources as unknown[])
            : [];

          return {
            ...item,
            id: resolvedItemId,
            title: String(item.title ?? `Unit ${itemIndex + 1}`).trim(),
            description: String(item.description ?? "").trim(),
            resources: Array.from(
              new Set(
                rawResources
                  .filter(
                    (resourceId) => resourceId !== false && Boolean(resourceId),
                  )
                  .map(String),
              ),
            ),
            showResourceSuggestion: !rawResources.includes(false),
            concepts: Array.isArray(item.concepts)
              ? item.concepts.map((concept, conceptIndex) => {
                  const rawId = String(concept.id ?? "").trim();
                  const base =
                    rawId && rawId !== "-" && rawId !== "concept"
                      ? rawId
                      : `${resolvedItemId}-concept-${String(conceptIndex + 1).padStart(2, "0")}`;
                  const fallback = `${base}-${
                    slugify(
                      `${String(concept.title ?? "concept")} ${conceptIndex + 1}`,
                    ) || conceptIndex + 1
                  }`;
                  let uniqueId =
                    rawId && rawId !== "-" && rawId !== "concept"
                      ? rawId
                      : fallback;
                  let counter = 2;

                  while (
                    seenConcepts.has(uniqueId) ||
                    seenConceptIds.has(uniqueId)
                  ) {
                    uniqueId = `${fallback}-${counter}`;
                    counter += 1;
                  }

                  seenConcepts.add(uniqueId);
                  seenConceptIds.add(uniqueId);

                  return {
                    ...concept,
                    id: uniqueId,
                    title: String(
                      concept.title ?? `Concept ${conceptIndex + 1}`,
                    ).trim(),
                    description: String(concept.description ?? "").trim(),
                    resources: Array.from(
                      new Set(
                        (concept.resources ?? []).filter(Boolean).map(String),
                      ),
                    ),
                  };
                })
              : [],
          };
        })
    : [];

  return {
    ...safeSubject,
    name: normalizedName,
    id: normalizedId,
    description: String(safeSubject.description ?? "").trim(),
    grade: String(safeSubject.grade ?? "11").startsWith("Grade")
      ? String(safeSubject.grade)
      : `Grade ${safeSubject.grade ?? "11"}`,
    semester: String(safeSubject.semester ?? "1").startsWith("Semester")
      ? String(safeSubject.semester)
      : `Semester ${safeSubject.semester ?? "1"}`,
    category: safeSubject.category ?? categoryForSubject(normalizedId),
    content,
    units: content.filter((item) => item.type === "unit").length,
  };
}

// ─────────────────────────────────────────────
// Normalized subjects
// ─────────────────────────────────────────────

export const importedSubjects: Subject[] = resolvedDatasets.map(({ subject }) =>
  normalizeSubject(subject),
);

// ─────────────────────────────────────────────
// All resources
// ─────────────────────────────────────────────

export const importedResources: Resource[] = resolvedDatasets.flatMap(
  ({ resources }) => resources,
);

// ─────────────────────────────────────────────
// Get all subjects
// ─────────────────────────────────────────────

export function getAllSubjects(): Subject[] {
  return importedSubjects;
}

// ─────────────────────────────────────────────
// Get one subject
// ─────────────────────────────────────────────

export function getImportedSubject(subjectId: string): Subject | undefined {
  return importedSubjects.find(
    (subject) =>
      subject.id === subjectId || subject.id.startsWith(`${subjectId}-`),
  );
}

// ─────────────────────────────────────────────
// Get raw dataset
// ─────────────────────────────────────────────

export function getDataset(subjectId: string): MigratedDataset | undefined {
  return resolvedDatasets.find(
    ({ subject }) =>
      !!subject &&
      typeof subject.id === "string" &&
      (subject.id === subjectId || subject.id.startsWith(`${subjectId}-`)),
  );
}

// ─────────────────────────────────────────────
// Get one resource
// ─────────────────────────────────────────────

export function getImportedResource(resourceId: string): Resource | undefined {
  return importedResources.find((resource) => resource.id === resourceId);
}

// ─────────────────────────────────────────────
// Get all resources for a subject
// ─────────────────────────────────────────────

export function getResourcesForSubject(subjectId: string): Resource[] {
  const dataset = getDataset(subjectId);

  return dataset?.resources ?? [];
}

// ─────────────────────────────────────────────
// Get one piece of subject content
// ─────────────────────────────────────────────

export function getSubjectContent(subjectId: string, contentId: string) {
  const dataset = getDataset(subjectId);

  return dataset?.subject.content.find((content) => content.id === contentId);
}

// ─────────────────────────────────────────────
// Get subjects by grade
// ─────────────────────────────────────────────

export function getSubjectsByGrade(grade: number): Subject[] {
  return importedSubjects.filter(
    (subject) =>
      subject.grade === `Grade ${grade}` || subject.grade === String(grade),
  );
}

// ─────────────────────────────────────────────
// Get subjects by semester
// ─────────────────────────────────────────────

export function getSubjectsBySemester(semester: number): Subject[] {
  return importedSubjects.filter(
    (subject) =>
      subject.semester === `Semester ${semester}` ||
      subject.semester === String(semester),
  );
}

// ─────────────────────────────────────────────
// Get subjects by grade + semester
// ─────────────────────────────────────────────

export function getSubjectsByGradeAndSemester(
  grade: number,
  semester: number,
): Subject[] {
  return importedSubjects.filter(
    (subject) =>
      (subject.grade === `Grade ${grade}` || subject.grade === String(grade)) &&
      (subject.semester === `Semester ${semester}` ||
        subject.semester === String(semester)),
  );
}
