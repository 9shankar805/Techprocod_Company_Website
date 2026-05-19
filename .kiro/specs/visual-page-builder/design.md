# Design Document — Visual Page Builder

## Overview

The Visual Page Builder is a client-side admin tool embedded in the existing TechProcod admin panel at `/admin/page-builder`. It provides a two-panel WYSIWYG interface for editing the content of seven public-facing landing pages. Content is persisted in Firestore under `pageContent/{pageId}` and goes live immediately on save — no draft/publish cycle. The builder is gated to `superadmin` and `editor` roles via the existing middleware and `ROLE_PERMISSIONS` map.

---

## Architecture

### High-Level Flow

```
Browser (Admin)
  └── /admin/page-builder (Server Component)
        ├── getSession() → role check → redirect if unauthorized
        └── PageBuilderClient (Client Component)
              ├── Page Selector
              ├── Left Panel: SectionList (dnd-kit)
              ├── Right Panel: PagePreview
              └── Section Editor Panel (slide-in)

Firestore
  └── pageContent/{pageId}
        └── { sections: Section[] }

Public Pages (Server Components)
  └── fetch pageContent/{pageId} → render visible sections in order
```

### Data Flow

1. Admin selects a page → client fetches `pageContent/{pageId}` from Firestore via Firebase client SDK.
2. Sections are sorted by `order` ascending and stored in React state (`localSections`).
3. All edits (field changes, visibility toggles, reordering) mutate `localSections` only — no Firestore writes until Save.
4. "Save Changes" writes the full `sections` array to Firestore in a single `setDoc` call.
5. Public pages fetch the same Firestore document on every request (server component, `cache: 'no-store'`).

---

## Directory Structure

```
app/admin/page-builder/
  page.tsx                    ← Server component: auth check, renders PageBuilderClient
  PageBuilderClient.tsx       ← Main client component: state, layout orchestration
  SectionList.tsx             ← dnd-kit sortable list of section rows
  SectionRow.tsx              ← Single row: drag handle, type label, order, visibility toggle
  PagePreview.tsx             ← Renders visible sections using real public components
  SectionEditorPanel.tsx      ← Slide-in panel: field editors for selected section
  FieldEditor.tsx             ← Renders correct input type per field (text, URL, boolean, array)
  pageRegistry.ts             ← Section type definitions, default content, field schemas
  usePageBuilder.ts           ← Custom hook: state management, Firestore load/save
  types.ts                    ← Shared TypeScript types

lib/
  pageContent.ts              ← Firestore helpers: loadPageContent, savePageContent

components/
  (existing section components — reused as-is in PagePreview)
```

---

## Data Models

### Section

```typescript
// app/admin/page-builder/types.ts

export type FieldType = 'text' | 'textarea' | 'url' | 'boolean' | 'array' | 'number';

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  itemSchema?: FieldSchema[]; // for array fields
}

export interface SectionDefinition {
  type: string;
  label: string;
  fields: FieldSchema[];
  defaultContent: Record<string, unknown>;
}

export interface Section {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  content: Record<string, unknown>;
}

export interface PageContent {
  sections: Section[];
}

export type PageId = 'home' | 'about' | 'services' | 'portfolio' | 'products' | 'blog' | 'careers';
```

### Firestore Document Shape

```
pageContent/{pageId}
{
  sections: [
    {
      id: "hero-1",
      type: "HeroSection",
      order: 0,
      visible: true,
      content: {
        badge: "Nepal's Digital Solutions Partner",
        heading: "Building Smart Digital Solutions for Nepal",
        subheading: "We design and build...",
        primaryCta: { label: "Start Your Project", href: "/contact" },
        secondaryCta: { label: "View Our Work", href: "/portfolio" },
        stats: [
          { value: "50+", label: "Projects Delivered" },
          ...
        ]
      }
    },
    ...
  ]
}
```

---

## Page Registry

The registry (`pageRegistry.ts`) is the single source of truth for:
- Which section types belong to each page
- The field schema for each section type (drives the Section Editor Panel)
- Default content for each section (used when Firestore document is missing)

```typescript
// app/admin/page-builder/pageRegistry.ts

import { SectionDefinition, PageId } from './types';

export const SECTION_DEFINITIONS: Record<string, SectionDefinition> = {
  HeroSection: {
    type: 'HeroSection',
    label: 'Hero Section',
    fields: [
      { key: 'badge', label: 'Badge Text', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      { key: 'primaryCta', label: 'Primary CTA', type: 'array', itemSchema: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'href', label: 'URL', type: 'url' },
      ]},
      { key: 'secondaryCta', label: 'Secondary CTA', type: 'array', itemSchema: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'href', label: 'URL', type: 'url' },
      ]},
      { key: 'stats', label: 'Stats', type: 'array', itemSchema: [
        { key: 'value', label: 'Value', type: 'text' },
        { key: 'label', label: 'Label', type: 'text' },
      ]},
    ],
    defaultContent: { /* ... */ },
  },
  CTASection: {
    type: 'CTASection',
    label: 'CTA Section',
    fields: [
      { key: 'heading', label: 'Heading', type: 'textarea' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      { key: 'primaryCta', label: 'Primary CTA Label', type: 'text' },
      { key: 'primaryHref', label: 'Primary CTA URL', type: 'url' },
      { key: 'secondaryCta', label: 'Secondary CTA Label', type: 'text' },
      { key: 'secondaryHref', label: 'Secondary CTA URL', type: 'url' },
    ],
    defaultContent: { /* ... */ },
  },
  // ... all other section types
};

export const PAGE_SECTIONS: Record<PageId, string[]> = {
  home:      ['HeroSection', 'ClientLogos', 'ServicesOverview', 'FeaturedProjects', 'TechStack', 'Testimonials', 'FAQSection', 'CTASection'],
  about:     ['AboutHero', 'Stats', 'MissionVision', 'Values', 'Timeline', 'TeamSection', 'CTASection'],
  services:  ['ServicesHero', 'ServicesList', 'ProcessSection', 'CTASection'],
  portfolio: ['PortfolioHero', 'ProjectsGrid', 'CTASection'],
  products:  ['ProductsHero', 'ProductsList', 'CTASection'],
  blog:      ['BlogHero', 'BlogGrid'],
  careers:   ['CareersHero', 'JobListings'],
};
```

---

## Components and Interfaces

### `page.tsx` — Server Component

Handles auth gate. Reads session, checks role, redirects if unauthorized. Passes session to client.

```typescript
// app/admin/page-builder/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/getSession';
import AdminShell from '@/components/admin/AdminShell';
import PageBuilderClient from './PageBuilderClient';

export default async function PageBuilderPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role !== 'superadmin' && session.role !== 'editor') {
    redirect('/admin/unauthorized');
  }
  return (
    <AdminShell role={session.role} name={session.name}>
      <PageBuilderClient />
    </AdminShell>
  );
}
```

### `usePageBuilder.ts` — State Hook

Central state management. Encapsulates all builder logic.

```typescript
interface PageBuilderState {
  selectedPageId: PageId | null;
  sections: Section[];
  savedSections: Section[];       // last-saved snapshot for dirty detection
  selectedSectionId: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isDirty: boolean;               // sections !== savedSections (deep equal)
}

interface PageBuilderActions {
  selectPage: (pageId: PageId) => Promise<void>;
  selectSection: (id: string | null) => void;
  updateSectionContent: (id: string, content: Record<string, unknown>) => void;
  toggleVisibility: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  save: () => Promise<void>;
  retry: () => void;
}
```

Key implementation details:
- `isDirty` is computed by deep-comparing `sections` with `savedSections` using `JSON.stringify`.
- `reorderSections` uses `arrayMove` from `@dnd-kit/sortable` then reassigns `order` values as `0, 1, 2, ...`.
- `save` calls `setDoc(doc(db, 'pageContent', pageId), { sections })` — full overwrite.
- On load, sections are sorted: `[...raw].sort((a, b) => a.order - b.order)`.

### `PageBuilderClient.tsx` — Layout Orchestrator

```typescript
'use client';
// Three-column layout when panel open, two-column otherwise
// Uses Framer Motion AnimatePresence for panel slide-in
// Renders: PageSelector | SectionList | PagePreview | SectionEditorPanel
// Handles beforeunload event for unsaved changes guard
// Handles internal page-switch guard via custom confirm dialog
```

Layout structure:
```
┌─────────────────────────────────────────────────────────┐
│  Page Selector (top bar: 7 page tabs)                   │
├──────────────┬──────────────────────┬───────────────────┤
│ SectionList  │    PagePreview       │ SectionEditorPanel│
│ (240px)      │    (flex: 1)         │ (360px, slide-in) │
└──────────────┴──────────────────────┴───────────────────┘
```

### `SectionList.tsx` — Drag-and-Drop List

Uses `@dnd-kit/core` (`DndContext`, `DragOverlay`) and `@dnd-kit/sortable` (`SortableContext`, `useSortable`).

```typescript
// DndContext with closestCenter collision detection
// SortableContext with verticalListSortingStrategy
// onDragEnd: calls reorderSections(active.id, over.id)
// DragOverlay: renders a ghost SectionRow during drag
```

### `SectionRow.tsx` — Single Section Row

```typescript
// useSortable hook for drag handle ref and transform styles
// Displays: GripVertical icon (drag handle) | type label | order badge | eye/eye-off toggle
// Active section highlighted with blue left border
// Hidden sections shown with reduced opacity and strikethrough
```

### `PagePreview.tsx` — Live Preview

```typescript
'use client';
// Renders sections where visible === true, sorted by order
// Each section rendered inside a wrapper div with:
//   - onClick: selectSection(section.id)
//   - data-section-id attribute for scroll-into-view
//   - Blue ring highlight when section.id === selectedSectionId
// Passes section.content as props to the actual component
// Unknown section types: renders a yellow warning banner instead
```

**Component dispatch map:**
```typescript
const SECTION_COMPONENTS: Record<string, React.ComponentType<Record<string, unknown>>> = {
  HeroSection: HeroSection,
  CTASection: CTASection,
  ServicesOverview: ServicesOverview,
  // ... all supported components
};
```

> **Note on existing components:** The existing section components (e.g., `HeroSection`, `CTASection`) currently use hardcoded static data. To support dynamic content from Firestore, each component will need to accept an optional `content` prop. The Page Builder will pass `section.content` as props; components fall back to their hardcoded defaults when no props are provided, preserving backward compatibility for the public pages until they are migrated.

### `SectionEditorPanel.tsx` — Field Editor Panel

```typescript
// Framer Motion: AnimatePresence + motion.div with x: 360 → x: 0 slide animation
// Header: section type label + Close button
// Body: maps section.fields from SECTION_DEFINITIONS to <FieldEditor> components
// onChange: calls updateSectionContent(sectionId, { ...content, [key]: newValue })
```

### `FieldEditor.tsx` — Per-Field Input

```typescript
// Renders based on FieldSchema.type:
//   text     → <input type="text">
//   textarea → <textarea>
//   url      → <input type="url"> with placeholder "https://..."
//   boolean  → toggle switch (styled checkbox)
//   number   → <input type="number">
//   array    → repeatable item list with Add/Remove buttons
//              each item renders its itemSchema fields recursively
```

---

## Firestore Helpers

```typescript
// lib/pageContent.ts

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Section, PageId } from '@/app/admin/page-builder/types';

export async function loadPageContent(pageId: PageId): Promise<Section[] | null> {
  const ref = doc(db, 'pageContent', pageId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return Array.isArray(data.sections) ? data.sections : null;
}

export async function savePageContent(pageId: PageId, sections: Section[]): Promise<void> {
  const ref = doc(db, 'pageContent', pageId);
  await setDoc(ref, { sections });
}
```

---

## Public Page Integration

Each public page server component is updated to fetch from Firestore and fall back to static defaults:

```typescript
// app/page.tsx (home) — pattern repeated for all 7 pages
import { loadPageContent } from '@/lib/pageContent';
import { DEFAULT_SECTIONS } from '@/app/admin/page-builder/pageRegistry';
import { renderSection } from '@/app/admin/page-builder/PagePreview';

export default async function HomePage() {
  let sections = await loadPageContent('home').catch(() => null);
  if (!sections) sections = DEFAULT_SECTIONS['home'];
  
  const visible = sections
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  return <>{visible.map(s => renderSection(s))}</>;
}
```

The `renderSection` helper is extracted from `PagePreview` into a shared utility so both the admin preview and public pages use identical rendering logic.

---

## Role Gating

Two layers of protection:

1. **Middleware** (`middleware.ts`): The existing `canAccess` check will redirect any role without `/admin/page-builder` in their `ROLE_PERMISSIONS` to `/admin/unauthorized`. The `ROLE_PERMISSIONS` map is updated to add `/admin/page-builder` to `superadmin` and `editor`.

2. **Server component** (`page.tsx`): Explicit role check as a second layer — redirects to `/admin/unauthorized` if role is not `superadmin` or `editor`.

3. **Sidebar**: The `AdminShell` `NAV_GROUPS` array is updated to add a "Page Builder" item under the "Content" group, filtered by the same `allowed` permissions check already in place.

---

## Unsaved Changes Guard

Two mechanisms:

1. **Browser navigation** (`beforeunload`): `useEffect` attaches a `beforeunload` listener when `isDirty` is true, prompting the browser's native "Leave site?" dialog.

2. **Internal navigation** (page switching within builder): A custom `ConfirmDialog` component is shown when the admin clicks a different page tab while `isDirty` is true. On confirm, state resets and the new page loads. On cancel, the dialog closes and the current page remains.

---

## Inline Editing (WYSIWYG)

Inline editing is implemented as a progressive enhancement layer on top of the Section Editor Panel:

- `PagePreview` wraps each text node in a `<span contentEditable suppressContentEditableWarning>` when `editMode` is active.
- On `input` event, the value is synced to `localSections` state via `updateSectionContent`.
- The Section Editor Panel reflects the same value because both read from `localSections`.
- On `blur` or `Escape`, `contentEditable` is deactivated (the value is already in state).
- A `data-field-key` attribute on each editable span identifies which content field to update.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Firestore load fails | Error banner with retry button; sections remain empty |
| Firestore save fails | Error toast; local state unchanged; Save button re-enabled |
| Unknown section type in Firestore | Yellow warning card in preview; section skipped |
| Missing Firestore document | Default sections initialized from registry |
| Role unauthorized | Redirect to `/admin/unauthorized` (middleware + server component) |

---

## Animations

- **Section Editor Panel**: Framer Motion `motion.div` slides in from the right (`x: 360 → 0`) with `spring` easing.
- **Visibility toggle**: CSS transition on opacity and text-decoration.
- **Drag overlay**: `@dnd-kit` `DragOverlay` with slight scale transform (`scale: 1.02`) and box shadow.
- **Save button**: Spinner icon replaces save icon during save operation.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Unauthorized Role Redirect

*For any* admin role that is not `superadmin` or `editor`, attempting to access `/admin/page-builder` should result in a redirect to `/admin/unauthorized`.

**Validates: Requirements 1.3**

---

### Property 2: Sections Loaded in Ascending Order

*For any* array of sections stored in Firestore with arbitrary `order` field values, after loading into the Page Builder the sections array in local state should be sorted in ascending order by the `order` field.

**Validates: Requirements 2.5**

---

### Property 3: Visibility Filtering in Preview

*For any* array of sections with mixed `visible` values, the Page Preview should render exactly the sections where `visible === true` and omit all sections where `visible === false`.

**Validates: Requirements 3.2, 3.3, 9.3**

---

### Property 4: Section List Row Completeness

*For any* section in the sections array, its corresponding row in the section list panel should display the section's type name, order index, visibility status indicator, and a drag handle element.

**Validates: Requirements 3.4, 7.1**

---

### Property 5: Inline Edit Synchronization

*For any* text field edited inline in the Page Preview, the corresponding field in the Section Editor Panel should reflect the same updated value in real time, and the value should be retained in local state after inline editing is deactivated.

**Validates: Requirements 4.3, 4.4**

---

### Property 6: Section Editor Panel Field Coverage

*For any* supported section type, selecting that section should cause the Section Editor Panel to render input fields for every key defined in that section type's `FieldSchema` array in the registry.

**Validates: Requirements 5.1, 5.2, 10.2**

---

### Property 7: Field Change Propagates to Preview

*For any* field value change made in the Section Editor Panel, the Page Preview should re-render the affected section with the updated value reflected in the component output.

**Validates: Requirements 5.3**

---

### Property 8: Visibility Toggle State Consistency

*For any* section, toggling its visibility to hidden should set `visible: false` in local state and remove the section from the preview; toggling it back to visible should set `visible: true` and restore the section in the preview.

**Validates: Requirements 6.2, 6.3**

---

### Property 9: Reorder Produces Valid Sequential Order

*For any* drag-and-drop reorder operation moving a section from position A to position B, the resulting sections array should contain the same set of section IDs with `order` values reassigned as a contiguous sequence `0, 1, 2, ..., n-1` matching the new visual position.

**Validates: Requirements 7.2**

---

### Property 10: Save Button Enabled Iff Dirty

*For any* local state, the "Save Changes" button should be enabled if and only if the current `sections` array differs from the last-saved `sections` snapshot (i.e., `isDirty === true`).

**Validates: Requirements 8.1, 8.6**

---

### Property 11: Save Round-Trip Fidelity

*For any* sections array in local state, after a successful save operation the Firestore document at `pageContent/{pageId}` should contain exactly that sections array, and the local `savedSections` snapshot should equal the saved array.

**Validates: Requirements 8.2, 8.4**

---

### Property 12: Public Page Renders Visible Sections in Order

*For any* Firestore document at `pageContent/{pageId}` containing sections with mixed visibility and arbitrary order values, the public page should render only the sections where `visible === true`, in ascending `order`, using the correct component for each section type.

**Validates: Requirements 9.3, 9.1**

---

### Property 13: Unsaved Changes Navigation Guard

*For any* navigation event (browser navigation or internal page switch) that occurs while `isDirty === true`, a confirmation dialog should be presented to the admin before the navigation proceeds.

**Validates: Requirements 11.1, 11.4**

---

### Property 14: Page-to-Firestore Path Mapping

*For any* valid `PageId` from the supported set, selecting that page in the Page Builder should trigger a Firestore read at the path `pageContent/{pageId}` where `{pageId}` exactly matches the selected `PageId` string.

**Validates: Requirements 1.6, 2.1**

---

## Testing Strategy

### Unit Tests (Example-Based)

Focus on specific behaviors and edge cases that are not covered by property tests:

- **Role rendering**: Verify `superadmin` and `editor` roles see the Page Builder UI; `support` role is redirected.
- **Page selector**: Verify exactly 7 page tabs are rendered with correct labels.
- **Loading state**: Mock a slow Firestore fetch and verify the loading spinner is shown.
- **Error state**: Mock a Firestore failure and verify the error banner and retry button appear.
- **Missing document**: Mock `getDoc` returning no document and verify default sections are initialized.
- **Save success**: Mock `setDoc` resolving and verify success toast and `isDirty === false`.
- **Save failure**: Mock `setDoc` rejecting and verify error toast and state unchanged.
- **No section selected**: Verify Section Editor Panel shows the "select a section" prompt.
- **Close panel**: Verify clicking Close deselects the section and collapses the panel.
- **Discard confirm**: Verify confirming the unsaved-changes dialog allows navigation and resets state.
- **Discard cancel**: Verify cancelling the dialog keeps the page and preserves changes.
- **Unknown section type**: Load a section with type `"UnknownWidget"` and verify a warning card renders instead of a component.

### Property Tests (Universal)

Each property test runs a minimum of 100 iterations with randomly generated inputs:

- **Property 1** — Generate random roles from `['support', 'viewer', 'guest', ...]`; verify all redirect.
- **Property 2** — Generate shuffled section arrays; verify sorted output is ascending by `order`.
- **Property 3** — Generate sections with random `visible` booleans; verify preview contains exactly the visible ones.
- **Property 4** — Generate random section arrays; verify each row has type, order, visibility, and drag handle.
- **Property 5** — Generate random text strings; type inline; verify panel field and state match.
- **Property 6** — For each of the 15 supported section types; verify all schema fields are rendered in the panel.
- **Property 7** — Generate random field values; change in panel; verify preview re-renders with new value.
- **Property 8** — Generate random sections; toggle visibility; verify state and preview consistency.
- **Property 9** — Generate random section arrays and drag positions; verify resulting `order` is `0..n-1`.
- **Property 10** — Generate dirty/clean states; verify button enabled state matches `isDirty`.
- **Property 11** — Generate random sections arrays; save; verify Firestore receives exact array.
- **Property 12** — Generate sections with mixed visibility/order; verify public render output.
- **Property 13** — Generate dirty states and navigation events; verify dialog always appears.
- **Property 14** — For each `PageId`; verify Firestore path matches exactly.

### Integration Tests

- After saving via the Page Builder, fetch the public page and verify the updated content is rendered.
- Verify Firestore `pageContent/{pageId}` is called with `cache: 'no-store'` on public page requests.
