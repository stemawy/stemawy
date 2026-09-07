import { useState } from "react";
import {
  isSaved,
  addSavedItem,
  removeSavedItem,
  type SavedItemType,
} from "@/lib/saved-items";

type UseSaveItemProps = {
  id: string;
  type: SavedItemType;
};

export function useSaveItem({ id, type }: UseSaveItemProps) {
  const [saved, setSaved] = useState(() => isSaved(id, type));

  const toggle = () => {
    if (saved) {
      removeSavedItem(id, type);
    } else {
      addSavedItem({
        id,
        type,
        title: "Unknown Item",
        description: "Saved from Stemawy",
      });
    }
    setSaved(!saved);
  };

  return { saved, toggle, save: () => !saved && toggle(), unsave: () => saved && toggle() };
}

export function useSaveItemWithDetails({
  id,
  type,
  title,
  description,
  category,
  subcategory,
  icon,
}: {
  id: string;
  type: SavedItemType;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  icon?: string;
}) {
  const [saved, setSaved] = useState(() => isSaved(id, type));

  const toggle = () => {
    if (saved) {
      removeSavedItem(id, type);
      setSaved(false);
    } else {
      addSavedItem({
        id,
        type,
        title,
        description,
        category,
        subcategory,
        icon,
      });
      setSaved(true);
    }
  };

  return { saved, toggle, save: () => !saved && toggle(), unsave: () => saved && toggle() };
}
