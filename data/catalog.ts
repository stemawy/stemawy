import type { Resource, Subject } from "@/types";

import type { MigratedDataset } from "./migration-types";

import datasets from "@/data/generated/migrated/index";

// ─────────────────────────────────────────────
// Normalize
// ─────────────────────────────────────────────

const migratedDatasets = datasets as MigratedDataset[];

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

function normalizeSubject(subject: MigratedDataset["subject"]): Subject {
  const content = [...subject.content].sort((a, b) => a.order - b.order);

  return {
    ...subject,
    name: subject.name.trim(),

    grade: subject.grade.startsWith("Grade")
      ? subject.grade
      : `Grade ${subject.grade}`,

    semester: subject.semester.startsWith("Semester")
      ? subject.semester
      : `Semester ${subject.semester}`,

    category: subject.category ?? categoryForSubject(subject.id),

    content,

    units: content.filter((item) => item.type === "unit").length,
  };
}

// ─────────────────────────────────────────────
// Normalized subjects
// ─────────────────────────────────────────────

export const importedSubjects: Subject[] = migratedDatasets.map(({ subject }) =>
  normalizeSubject(subject),
);

// ─────────────────────────────────────────────
// All resources
// ─────────────────────────────────────────────

export const importedResources: Resource[] = migratedDatasets.flatMap(
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
  return migratedDatasets.find(
    ({ subject }) =>
      subject.id === subjectId || subject.id.startsWith(`${subjectId}-`),
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
