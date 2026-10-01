import { opportunities } from "@/data/opportunities";
import { skills } from "@/data/skills";
import { getAllSubjects } from "@/data/catalog";
import {
  getLocalizedContentText,
  getLocalizedSubject,
  type Language,
} from "@/lib/i18n";

export type GlobalSearchType = "opportunity" | "skill" | "subject" | "unit";

export type GlobalSearchResult = {
  id: string;
  type: GlobalSearchType;
  title: string;
  description: string;
  detail: string;
  href: string;
  external: boolean;
};

export type GlobalSearchGroup = {
  type: GlobalSearchType;
  count: number;
  results: GlobalSearchResult[];
};

export type GlobalSearchResponse = {
  total: number;
  groups: GlobalSearchGroup[];
};

type Candidate = {
  result: GlobalSearchResult;
  title: string;
  searchable: string;
};

const RESULTS_PER_GROUP = 4;

function normalizeSearchText(value: string): string {
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

function scoreCandidate(query: string, candidate: Candidate): number {
  const normalizedTitle = normalizeSearchText(candidate.title);
  const searchable = normalizeSearchText(
    `${candidate.title} ${candidate.searchable}`,
  );

  if (normalizedTitle === query) return 1000;
  if (normalizedTitle.startsWith(query)) return 900;
  if (normalizedTitle.includes(query)) return 800;
  if (searchable.includes(query)) return 700;

  const terms = query.split(" ").filter(Boolean);
  const matchedTerms = terms.filter((term) => searchable.includes(term)).length;
  return matchedTerms === terms.length ? 600 + matchedTerms : 0;
}

function makeGroup(
  type: GlobalSearchType,
  query: string,
  candidates: Candidate[],
  limit: number,
): GlobalSearchGroup | null {
  const matches = candidates
    .map((candidate) => ({
      result: candidate.result,
      score: scoreCandidate(query, candidate),
    }))
    .filter((match) => match.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.result.title.localeCompare(right.result.title),
    );

  if (matches.length === 0) return null;

  return {
    type,
    count: matches.length,
    results: matches.slice(0, limit).map((match) => match.result),
  };
}

export function searchStemawy(
  rawQuery: string,
  language: Language,
  limit = RESULTS_PER_GROUP,
): GlobalSearchResponse {
  const query = normalizeSearchText(rawQuery.slice(0, 120));
  if (query.length < 2) return { total: 0, groups: [] };

  const subjects = getAllSubjects();
  const opportunityCandidates: Candidate[] = opportunities.map((item) => ({
    title: language === "ar" ? item.arTitle : item.title,
    searchable: [
      item.title,
      item.arTitle,
      item.description,
      item.arDescription,
      item.provider,
      item.category,
      item.type,
      item.field,
      item.location,
      item.eligibility,
    ]
      .filter(Boolean)
      .join(" "),
    result: {
      id: item.id,
      type: "opportunity",
      title: language === "ar" ? item.arTitle : item.title,
      description: language === "ar" ? item.arDescription : item.description,
      detail: `${item.provider} · ${item.type}`,
      href: item.href,
      external: true,
    },
  }));

  const skillCandidates: Candidate[] = skills.map((item) => ({
    title: language === "ar" ? item.arTitle : item.title,
    searchable: [
      item.title,
      item.arTitle,
      item.description,
      item.arDescription,
      item.provider,
      item.category,
      item.type,
    ].join(" "),
    result: {
      id: item.id,
      type: "skill",
      title: language === "ar" ? item.arTitle : item.title,
      description: language === "ar" ? item.arDescription : item.description,
      detail: `${item.provider} · ${item.category.replaceAll("-", " ")}`,
      href: item.href,
      external: true,
    },
  }));

  const subjectCandidates: Candidate[] = [];
  const unitCandidates: Candidate[] = [];

  for (const subject of subjects) {
    const localizedSubject = getLocalizedSubject(subject, language);
    const subjectDetail = `${subject.grade} · ${subject.semester}`;
    const subjectSearchText = [
      subject.name,
      subject.description,
      localizedSubject.name,
      localizedSubject.description,
      subject.grade,
      subject.semester,
      subject.category,
    ].join(" ");

    subjectCandidates.push({
      title: localizedSubject.name,
      searchable: subjectSearchText,
      result: {
        id: subject.id,
        type: "subject",
        title: localizedSubject.name,
        description: localizedSubject.description,
        detail: subjectDetail,
        href: `/subject/${subject.id}`,
        external: false,
      },
    });

    for (const unit of subject.content) {
      if (unit.type !== "unit") continue;

      const title = getLocalizedContentText(unit.title, language);
      const description = getLocalizedContentText(unit.description, language);
      const conceptSearchText = (unit.concepts ?? [])
        .flatMap((concept) => [
          concept.title,
          getLocalizedContentText(concept.title, language),
          concept.description,
          getLocalizedContentText(concept.description, language),
        ])
        .join(" ");

      unitCandidates.push({
        title,
        searchable: [
          title,
          unit.title,
          description,
          unit.description,
          localizedSubject.name,
          subject.name,
          subject.grade,
          subject.semester,
          conceptSearchText,
        ].join(" "),
        result: {
          id: unit.id,
          type: "unit",
          title,
          description,
          detail: `${localizedSubject.name} · ${subjectDetail}`,
          href: `/subject/${subject.id}?unit=${encodeURIComponent(unit.id)}`,
          external: false,
        },
      });
    }
  }

  const groups = [
    makeGroup("opportunity", query, opportunityCandidates, limit),
    makeGroup("skill", query, skillCandidates, limit),
    makeGroup("subject", query, subjectCandidates, limit),
    makeGroup("unit", query, unitCandidates, limit),
  ].filter((group): group is GlobalSearchGroup => group !== null);

  return {
    total: groups.reduce((total, group) => total + group.count, 0),
    groups,
  };
}
