import type { Subject } from "@/data/subjects";
import type { Resource } from "@/types";
import type { Opportunity } from "@/data/opportunities";
import {
  getResourcesForSubject,
  getSubjectsByGradeAndSemester,
  getImportedSubject,
} from "@/data/catalog";

export type DjangoSubject = Subject & { resources?: Resource[] };
export type DjangoOpportunity = Opportunity;

export async function fetchDjangoSubjects(
  grade: number,
  semester: number,
): Promise<DjangoSubject[]> {
  return getSubjectsByGradeAndSemester(grade, semester).map((subject) => ({
    ...subject,
    resources: getResourcesForSubject(subject.id),
  }));
}

export async function fetchDjangoSubject(
  subjectId: string,
): Promise<DjangoSubject> {
  const subject = getImportedSubject(subjectId);

  if (!subject) {
    throw new Error(`Local subject data not found: ${subjectId}`);
  }

  return {
    ...subject,
    resources: getResourcesForSubject(subject.id),
  };
}

export async function fetchDjangoOpportunities(): Promise<DjangoOpportunity[]> {
  return [];
}
