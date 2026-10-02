import type { Subject } from "@/data/subjects";
import type { Resource } from "@/types";
import type { Opportunity } from "@/data/opportunities";
import type { Skill } from "@/data/skills";
import type { GlobalSearchResponse } from "@/lib/search";
import { opportunities as bundledOpportunities } from "@/data/opportunities";
import { skills as bundledSkills } from "@/data/skills";
import {
  getResourcesForSubject,
  getSubjectsByGradeAndSemester,
  getImportedSubject,
} from "@/data/catalog";

export type DjangoSubject = Subject & { resources?: Resource[] };
export type DjangoOpportunity = Opportunity;
export type DjangoAnnouncement = {
  id: number;
  title: string;
  arTitle: string;
  message: string;
  arMessage: string;
  href: string;
  createdAt: string;
};

const configuredApiBase =
  process.env.NEXT_PUBLIC_STEMAWY_API_URL ?? "http://127.0.0.1:8000/api";
const apiBaseUrl = new URL(
  /^https?:\/\//i.test(configuredApiBase)
    ? configuredApiBase
    : `https://${configuredApiBase}`,
);
if (!apiBaseUrl.pathname || apiBaseUrl.pathname === "/") {
  apiBaseUrl.pathname = "/api";
}
const apiBase = apiBaseUrl.toString().replace(/\/+$/, "");
const cacheDuration = 60_000;
const responseCache = new Map<
  string,
  { expiresAt: number; promise: Promise<unknown> }
>();

async function fetchCatalog<T>(path: string): Promise<T> {
  const url = `${apiBase}${path}`;
  const cached = responseCache.get(url);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise as Promise<T>;
  }

  const promise = fetch(url, {
    headers: { Accept: "application/json" },
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Django API returned ${response.status} for ${path}`);
    }
    return (await response.json()) as T;
  });

  responseCache.set(url, {
    expiresAt: Date.now() + cacheDuration,
    promise,
  });
  try {
    return await promise;
  } catch (error) {
    responseCache.delete(url);
    throw error;
  }
}

export async function fetchDjangoSubjects(
  grade: number,
  semester: number,
): Promise<DjangoSubject[]> {
  const fallback = getSubjectsByGradeAndSemester(grade, semester).map(
    (subject) => ({
      ...subject,
      resources: getResourcesForSubject(subject.id),
    }),
  );
  try {
    const result = await fetchCatalog<{ subjects: DjangoSubject[] }>(
      `/subjects/?grade=${grade}&semester=${semester}`,
    );
    return result.subjects;
  } catch {
    return fallback;
  }
}

export async function fetchDjangoSubject(
  subjectId: string,
): Promise<DjangoSubject> {
  try {
    return await fetchCatalog<DjangoSubject>(
      `/subjects/${encodeURIComponent(subjectId)}/`,
    );
  } catch {
    const subject = getImportedSubject(subjectId);
    if (!subject) {
      throw new Error(`Subject data is unavailable: ${subjectId}`);
    }
    return {
      ...subject,
      resources: getResourcesForSubject(subject.id),
    };
  }
}

export async function fetchDjangoOpportunities(): Promise<DjangoOpportunity[]> {
  try {
    const result = await fetchCatalog<{ opportunities: DjangoOpportunity[] }>(
      "/opportunities/",
    );
    return result.opportunities;
  } catch {
    return bundledOpportunities;
  }
}

export async function fetchDjangoSkills(): Promise<Skill[]> {
  try {
    const result = await fetchCatalog<{ skills: Skill[] }>("/skills/");
    return result.skills;
  } catch {
    return bundledSkills;
  }
}

export async function fetchDjangoAnnouncements(): Promise<
  DjangoAnnouncement[]
> {
  try {
    const result = await fetchCatalog<{ announcements: DjangoAnnouncement[] }>(
      "/announcements/",
    );
    return result.announcements;
  } catch {
    return [];
  }
}

export async function fetchDjangoSearch(
  query: string,
  language: "en" | "ar",
  limit = 4,
): Promise<GlobalSearchResponse | null> {
  const params = new URLSearchParams({
    q: query,
    lang: language,
    limit: String(limit),
  });
  try {
    return await fetchCatalog<GlobalSearchResponse>(`/search/?${params}`);
  } catch {
    return null;
  }
}
