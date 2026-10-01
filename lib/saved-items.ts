export type SavedItemType = "resource" | "subject" | "opportunity" | "skill";

export type SavedItem = {
  id: string;
  type: SavedItemType;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  icon?: string;
  href?: string;
  savedAt: number;
};

const STORAGE_KEY = "stemawy-saved-items";
const CHANGE_EVENT = "stemawy-saved-items-change";
let cachedStorageValue: string | null | undefined;
let cachedItems: SavedItem[] = [];

function writeSavedItems(items: SavedItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function getSavedItems(): SavedItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === cachedStorageValue) return cachedItems;

    cachedStorageValue = stored;
    const parsed: unknown = stored ? JSON.parse(stored) : [];

    if (!Array.isArray(parsed)) {
      cachedItems = [];
      return cachedItems;
    }

    cachedItems = parsed
      .filter(
        (item): item is SavedItem =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as SavedItem).id === "string" &&
          typeof (item as SavedItem).type === "string" &&
          typeof (item as SavedItem).title === "string" &&
          typeof (item as SavedItem).description === "string" &&
          ((item as SavedItem).href === undefined ||
            typeof (item as SavedItem).href === "string") &&
          typeof (item as SavedItem).savedAt === "number",
      )
      .map((item) =>
        item.type === "subject" ? { ...item, type: "resource" } : item,
      );
    return cachedItems;
  } catch {
    cachedItems = [];
    return cachedItems;
  }
}

export function addSavedItem(item: Omit<SavedItem, "savedAt">): SavedItem {
  const saved: SavedItem = { ...item, savedAt: Date.now() };
  const items = getSavedItems();
  const exists = items.some((i) => i.id === item.id && i.type === item.type);
  if (!exists) {
    items.push(saved);
    writeSavedItems(items);
  }
  return exists
    ? items.find(
        (current) => current.id === item.id && current.type === item.type,
      )!
    : saved;
}

export function removeSavedItem(id: string, type: SavedItemType): void {
  const items = getSavedItems().filter(
    (i) => !(i.id === id && i.type === type),
  );
  writeSavedItems(items);
}

export function clearSavedItems(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(STORAGE_KEY);
  cachedStorageValue = null;
  cachedItems = [];
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function isSaved(id: string, type: SavedItemType): boolean {
  return getSavedItems().some((i) => i.id === id && i.type === type);
}

export function getSavedItemsByType(type: SavedItemType): SavedItem[] {
  return getSavedItems().filter((i) => i.type === type);
}

export function getSavedItemsChangeEvent() {
  return CHANGE_EVENT;
}
