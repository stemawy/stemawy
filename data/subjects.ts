import type { Grade, Semester, Subject } from "@/types";
import { importedSubjects } from "@/data/catalog";

export const subjects: Subject[] = importedSubjects;

export type { Grade, Semester, Subject } from "@/types";

export function getSubjects(grade: Grade, semester: Semester) {
  return importedSubjects.filter(
    (subject) =>
      subject.grade === `Grade ${grade}` &&
      subject.semester === `Semester ${semester}`,
  );
}
