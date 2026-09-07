# Saved Page Integration Guide

The Saved page system is fully implemented and ready to integrate throughout the app. Here's how to add save buttons to different component types.

## Quick Start

### 1. Subject Cards (in Dashboard and Subjects page)

```tsx
// components/dashboard/CoreCurriculum.tsx or similar
'use client';
import { useSaveItemWithDetails } from "@/hooks/useSaveItem";

export function SubjectCard({ subject }: { subject: Subject }) {
  const { saved, toggle } = useSaveItemWithDetails({
    id: subject.id,
    type: "subject",
    title: subject.name,
    description: subject.description,
    category: subject.category,
    subcategory: `Grade ${subject.grade}`,
    icon: "menu_book"
  });

  return (
    <div className="relative">
      {/* existing card content */}
      
      {/* Add save button in corner */}
      <button
        onClick={toggle}
        className="absolute top-3 right-3 p-2 rounded-lg hover:bg-surface-container transition-colors"
        title={saved ? "Remove from saved" : "Add to saved"}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${saved ? 1 : 0}` }}>
          bookmark
        </span>
      </button>
    </div>
  );
}
```

### 2. Resource Cards

```tsx
// components/resources/ResourceCard.tsx
'use client';
import { useSaveItemWithDetails } from "@/hooks/useSaveItem";

export function ResourceCard({ resource }: { resource: Resource }) {
  const { saved, toggle } = useSaveItemWithDetails({
    id: resource.id,
    type: "resource",
    title: resource.title,
    description: resource.description,
    category: resource.category,
    subcategory: resource.subject,
    icon: resource.icon
  });

  return (
    <article>
      {/* existing resource content */}
      
      <button
        onClick={toggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          saved 
            ? 'bg-primary/10 text-primary' 
            : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${saved ? 1 : 0}` }}>
          bookmark
        </span>
        {saved ? 'Saved' : 'Save'}
      </button>
    </article>
  );
}
```

### 3. Opportunity Cards

```tsx
// components/opportunities/OpportunityCard.tsx
'use client';
import { useSaveItemWithDetails } from "@/hooks/useSaveItem";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { saved, toggle } = useSaveItemWithDetails({
    id: opportunity.id,
    type: "opportunity",
    title: opportunity.title,
    description: opportunity.description,
    category: opportunity.type,
    subcategory: opportunity.level,
    icon: "explore"
  });

  return (
    <div>
      {/* existing opportunity content */}
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        className="flex items-center gap-1"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${saved ? 1 : 0}` }}>
          bookmark
        </span>
      </button>
    </div>
  );
}
```

### 4. Skill Cards

```tsx
// components/skills/SkillCard.tsx
'use client';
import { useSaveItemWithDetails } from "@/hooks/useSaveItem";

export function SkillCard({ skill }: { skill: Skill }) {
  const { saved, toggle } = useSaveItemWithDetails({
    id: skill.id,
    type: "skill",
    title: skill.name,
    description: skill.description,
    category: skill.category,
    subcategory: skill.level,
    icon: "psychology"
  });

  return (
    <div>
      {/* existing skill content */}
      
      <button
        onClick={toggle}
        className={`w-full py-2 rounded-lg font-label-md transition-colors ${
          saved
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
        }`}
      >
        {saved ? '✓ Saved' : 'Save Skill'}
      </button>
    </div>
  );
}
```

## State Management Pattern

The `useSaveItemWithDetails` hook:
- Initializes saved state from localStorage (lazy initialization)
- Provides `saved` boolean for displaying current state
- Provides `toggle()` to save/unsave
- Automatically syncs to localStorage
- Works client-side only (no server calls)

```tsx
const { saved, toggle, save, unsave } = useSaveItemWithDetails({
  id: "unique-item-id",
  type: "subject" | "resource" | "opportunity" | "skill",
  title: "Display Title",
  description: "Item Description",
  category: "Category Name",
  subcategory: "Subcategory Name",
  icon: "material-symbol-name"
});

// saved: boolean - true if currently saved
// toggle(): void - switch save state
// save(): void - save if not saved
// unsave(): void - remove if saved
```

## Styling Patterns

### Icon Fill Animation
Use Material Symbols' FILL variation for animated bookmark:
```tsx
<span className="material-symbols-outlined" 
  style={{ fontVariationSettings: `'FILL' ${saved ? 1 : 0}` }}>
  bookmark
</span>
```

### Active State Indicators
```tsx
className={saved 
  ? 'bg-primary-container text-on-primary-container font-bold'
  : 'bg-surface-container text-on-surface-variant'
}
```

### Responsive Button Sizes
```tsx
// Mobile
<button className="p-2 rounded-lg">
  <span className="material-symbols-outlined">bookmark</span>
</button>

// Desktop
<button className="px-4 py-2 rounded-lg flex items-center gap-2">
  <span className="material-symbols-outlined">bookmark</span>
  <span>Save Item</span>
</button>
```

## Data Persistence

All data is stored in browser localStorage:
- Key: `stemawy-saved-items`
- Format: JSON array of SavedItem objects
- Persists across browser sessions
- No server sync required

### Clearing Saved Items
Users can clear data via:
1. Browser Settings → Clear browsing data → Cookies and site data
2. Browser Console: `localStorage.removeItem('stemawy-saved-items')`
3. DevTools → Application → Storage → Local Storage

## Error Handling

The system gracefully handles:
- Missing or corrupted localStorage data (defaults to empty array)
- Server-side rendering (checks `typeof window` before accessing localStorage)
- Rapid toggles (debounced through React state)

## Testing

### Load Demo Data
In browser console:
```javascript
// First, import demo data
import { loadDemoData } from '/lib/demo-saved-data.ts';
loadDemoData();

// Or run directly
fetch('/lib/demo-saved-data.ts').then(r => r.text()).then(eval);
```

### View Current State
```javascript
// View all saved items
viewSavedItems();

// Check if specific item is saved
isSaved('item-id', 'resource');

// Clear all
clearAllSaved();
```

## Performance Considerations

- Lazy initialization avoids hydration mismatch
- useMemo used for filtered items to prevent unnecessary re-renders
- localStorage operations are synchronous but fast for typical data sizes
- Grid layout uses CSS Grid (efficient rendering)

## Accessibility

- Buttons have clear labels and ARIA attributes
- Keyboard navigation supported
- Material Symbols provide visual feedback
- Color is not sole indicator of state

## Browser Support

Works in all modern browsers with localStorage support:
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge 12+
- iOS Safari 3.2+

Limited storage: ~5-10MB per domain depending on browser.
