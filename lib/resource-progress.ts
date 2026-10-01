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
