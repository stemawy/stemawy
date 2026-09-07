# Saved Items System

A localStorage-based system for users to save resources, subjects, opportunities, and skills throughout the Stemawy application.

## Usage

### Basic Save Button (useSaveItem)

For simple items where you only have the ID and type:

```tsx
import { useSaveItem } from "@/hooks/useSaveItem";

export function ResourceCard({ resourceId }) {
  const { saved, toggle } = useSaveItem({ 
    id: resourceId, 
    type: "resource" 
  });

  return (
    <button 
      onClick={toggle}
      className={saved ? "text-primary" : "text-outline"}
    >
      <span className="material-symbols-outlined">
        {saved ? "bookmark" : "bookmark_border"}
      </span>
    </button>
  );
}
```

### Detailed Save Button (useSaveItemWithDetails)

For items with full details that you want to display in the Saved page:

```tsx
import { useSaveItemWithDetails } from "@/hooks/useSaveItem";

export function SubjectCard({ subject }) {
  const { saved, toggle } = useSaveItemWithDetails({
    id: subject.id,
    type: "subject",
    title: subject.name,
    description: subject.description,
    category: subject.category,
    subcategory: subject.grade,
    icon: "menu_book"
  });

  return (
    <button 
      onClick={toggle}
      className={saved ? "text-primary" : "text-outline"}
    >
      <span className="material-symbols-outlined">
        {saved ? "bookmark" : "bookmark_border"}
      </span>
    </button>
  );
}
```

## Data Model

```typescript
type SavedItem = {
  id: string;
  type: "resource" | "subject" | "opportunity" | "skill";
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  icon?: string;
  savedAt: number; // timestamp
};
```

## API

### useSaveItem(props)

Returns `{ saved, toggle, save, unsave }`

- `saved`: boolean - whether the item is currently saved
- `toggle()`: function - toggles save state
- `save()`: function - saves the item if not already saved
- `unsave()`: function - removes the item if saved

### useSaveItemWithDetails(props)

Same return as `useSaveItem` but requires full item details for display in Saved page.

## Storage

- All items stored in `localStorage` under key `stemawy-saved-items`
- Persists across browser sessions
- Can be cleared from browser DevTools

## Saved Page Features

The Saved page (`/app/saved/page.tsx`) includes:

- **Category filtering**: All, Resources, Opportunities, Skills, Subjects
- **Search**: Full-text search across title, description, and category
- **Sorting**: Newest first, oldest first, alphabetical (A-Z)
- **Responsive design**: Adapts from mobile to desktop layouts
- **Item counts**: Shows how many items in each category
- **Remove items**: Delete button on each card to remove from saved

## Implementation Notes

- Uses lazy initialization with useState to avoid React Compiler warnings
- No server-side syncing (uses localStorage only)
- Items show save date in "Saved Month DD" format
- Grid layout: 1 column mobile → 2 columns tablet → 3 columns desktop → 4 columns ultra-wide
