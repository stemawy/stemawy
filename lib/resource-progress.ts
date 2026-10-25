import type { Resource } from "@/types";

const STORAGE_KEY = "stemawy-completed-resources";
const CHANGE_EVENT = "stemawy-completed-resources-change";

function readCompletedResources(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function isResourceCompleted(resourceId: string): boolean {
  return readCompletedResources().includes(resourceId);
}

export function getCompletedResourceCount(): number {
  return new Set(readCompletedResources()).size;
}

function isPositive(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function getProviderDurationSeconds(provider: string): number | undefined {
  const match =
    /(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)\b/i.exec(
      provider,
    );
  if (!match) return undefined;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith("h")) return value * 3600;
  if (unit.startsWith("m")) return value * 60;
  return value;
}

export function getResourceEffortMinutes(resource: Resource): number {
  if (isPositive(resource.estimatedMinutes)) return resource.estimatedMinutes;

  const durationSeconds = isPositive(resource.durationSeconds)
    ? resource.durationSeconds
    : getProviderDurationSeconds(resource.provider ?? "");
  if (durationSeconds) return durationSeconds / 60;

  const provider = resource.provider ?? "";
  const questionCount = isPositive(resource.questionCount)
    ? resource.questionCount
    : Number(/\b(\d+)\s*questions?\b/i.exec(provider)?.[1] ?? 0);
  if (questionCount > 0) return questionCount * 2;

  const pageCount = isPositive(resource.pageCount)
    ? resource.pageCount
    : Number(/\b(\d+)\s*(?:pages?|slides?)\b/i.exec(provider)?.[1] ?? 0);
  if (pageCount > 0) {
    return pageCount * (resource.type === "slides" ? 1 : 2.5);
  }

  switch (resource.type) {
    case "image":
      return 1;
    case "video":
      return 10;
    case "test-bank":
    case "sheet":
      return 8;
    default:
      return 5;
  }
}

export type ResourceProgressSummary = {
  completedResources: number;
  totalResources: number;
  percent: number;
};

export function calculateResourceProgress(
  resources: Resource[],
  completedIds = readCompletedResources(),
): ResourceProgressSummary {
  const uniqueResources = new Map(
    resources.map((resource) => [resource.id, resource]),
  );
  const completed = new Set(completedIds);
  let totalEffort = 0;
  let completedEffort = 0;
  let completedResources = 0;

  for (const resource of uniqueResources.values()) {
    const effort = getResourceEffortMinutes(resource);
    totalEffort += effort;
    if (completed.has(resource.id)) {
      completedEffort += effort;
      completedResources += 1;
    }
  }

  return {
    completedResources,
    totalResources: uniqueResources.size,
    percent:
      totalEffort > 0 ? Math.round((completedEffort / totalEffort) * 100) : 0,
  };
}

export function clearCompletedResources(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function toggleResourceCompleted(resourceId: string): boolean {
  if (typeof window === "undefined") return false;

  const completed = new Set(readCompletedResources());
  if (completed.has(resourceId)) {
    completed.delete(resourceId);
  } else {
    completed.add(resourceId);
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  } catch {
    return completed.has(resourceId);
  }

  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: resourceId }));
  return completed.has(resourceId);
}

export function getResourceProgressChangeEvent(): string {
  return CHANGE_EVENT;
}
