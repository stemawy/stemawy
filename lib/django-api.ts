import type { Subject } from "@/data/subjects";
import type { Resource } from "@/types";

export type DjangoSubject = Subject & { resources?: Resource[] };

const API_URL =
  process.env.NEXT_PUBLIC_STEMAWY_API_URL ?? "http://127.0.0.1:8000/api";

export async function fetchDjangoSubjects(
  grade: number,
  semester: number,
): Promise<DjangoSubject[]> {
  const response = await fetch(
    `${API_URL}/subjects/?grade=${grade}&semester=${semester}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Django subjects request failed: ${response.status}`);
  }

  const data = (await response.json()) as { subjects: DjangoSubject[] };
  return data.subjects;
}

export async function fetchDjangoSubject(
  subjectId: string,
): Promise<DjangoSubject> {
  const response = await fetch(`${API_URL}/subjects/${subjectId}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Django subject request failed: ${response.status}`);
  }

  return (await response.json()) as Subject;
}
