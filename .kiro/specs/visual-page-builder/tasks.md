# Implementation Plan: Visual Page Builder / CMS for Landing Pages

## Overview

Build a WYSIWYG page builder embedded in the existing TechProcod admin panel at `/admin/page-builder`. The builder lets `superadmin` and `editor` roles visually edit the seven public-facing landing pages. Content is persisted in Firestore under `pageContent/{pageId}` and goes live immediately on save. The implementation proceeds in layers: types and registry → Firestore helpers → state hook → UI components → public page integration → role gating.

---

## Tasks

- [x] 1. Define shared TypeScript types and the page registry
  - [x] 1.1 Create `app/admin/page-builder/types.ts` with `FieldType`, `FieldSchema`, `SectionDefinition`, `Section`, `PageContent`, and `PageId` types
    - Export all types; `PageId` must be a union of the seven page slugs
    - _Requirements: 10.1, 10.2_

  - [x] 1.2 Create `app/admin/page-builder/pageRegistry.ts` with `SECTION_DEFINITIONS` and `PAGE_SECTIONS`
    - Define `SectionDefinition` entries for all 15 section types: HeroSection, ClientLogos, ServicesOverview, FeaturedProjects, TechStack, Testimonials, FAQSection, CTASection, AboutHero, Stats, MissionVision, Values, Timeline, TeamSection, ServicesHero, ServicesList, ProcessSection, PortfolioHero, ProjectsGrid, ProductsHero, ProductsList, BlogHero, BlogGrid, CareersHero, JobListings
    - Each definition must include `type`, `label`, `fields` (full `FieldSchema[]`), and `defaultContent` matching the current hardcoded values in the existing components
    - Export `PAGE_SECTIONS` mapping each `PageId` to its ordered section type array
    - Export `DEFAULT_SECTIONS` as a `Record<PageId, Section[]>` built from `SECTION_DEFINITIONS` and `PAGE_SECTIONS`
    - _Requirements: 10.1, 10.2, 2.2_

  - [ ]* 1.3 Write property test for section registry completeness
    - **Property 6: Section Editor Panel Field Coverage** — for each of the 15 supported section types, verify `SECTION_DEFINITIONS[type].fields` covers every key in `defaultContent`
    - **Validates: Requirements 10.2, 5.1**

- [x] 2. Implement Firestore helpers
  - [x] 2.1 Create `lib/pageContent.ts` with `loadPageContent(pageId)` and `savePageContent(pageId, sections)`
    - `loadPageContent` calls `getDoc(doc(db, 'pageContent', pageId))` and returns `Section[] | null`
    - `savePageContent` calls `setDoc(doc(db, 'pageContent', pageId), { sections })` — full overwrite
    - Both functions must be typed with `PageId` and `Section[]` from `types.ts`
    - _Requirements: 2.1, 8.2_

  - [ ]* 2.2 Write property test for Firestore path mapping
    - **Property 14: Page-to-Firestore Path Mapping** — for each valid `PageId`, verify `loadPageContent` constructs the Firestore ref path as exactly `pageContent/{pageId}`
    - **Validates: Requirements 1.6, 2.1**

- [ ] 3. Build the `usePageBuilder` state hook
  - [x] 3.1 Create `app/admin/page-builder/usePageBuilder.ts` implementing `PageBuilderState` and `PageBuilderActions`
    - State fields: `selectedPageId`, `sections`, `savedSections`, `selectedSectionId`, `loading`, `saving`, `error`, `isDirty`
    - `isDirty` computed via `JSON.stringify(sections) !== JSON.stringify(savedSections)`
    - `selectPage`: fetches via `loadPageContent`; falls back to `DEFAULT_SECTIONS[pageId]` if null; sorts by `order` ascending; sets both `sections` and `savedSections`
    - `updateSectionContent`: immutably updates `content` of the matching section by id
    - `toggleVisibility`: flips `visible` boolean for the matching section
    - `reorderSections`: uses `arrayMove` from `@dnd-kit/sortable`, then reassigns `order` as `0, 1, 2, ...`
    - `save`: calls `savePageContent`; on success sets `savedSections = sections`; on failure sets error without mutating sections
    - `retry`: clears error and re-calls `selectPage` for the current `selectedPageId`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.1–8.6, 7.2_

  - [ ]* 3.2 Write property test for sections loaded in ascending order
    - **Property 2: Sections Loaded in Ascending Order** — generate shuffled section arrays with arbitrary `order` values; verify `selectPage` produces a state where sections are sorted ascending by `order`
    - **Validates: Requirements 2.5**

  - [ ]* 3.3 Write property test for save button enabled iff dirty
    - **Property 10: Save Button Enabled Iff Dirty** — generate dirty/clean state pairs; verify `isDirty` is `true` iff `sections` differs from `savedSections`
    - **Validates: Requirements 8.1, 8.6**

  - [ ]* 3.4 Write property test for reorder produces valid sequential order
    - **Property 9: Reorder Produces Valid Sequential Order** — generate random section arrays and drag positions; verify resulting `order` values are exactly `0..n-1` matching new visual positions
    - **Validates: Requirements 7.2**

  - [ ]* 3.5 Write property test for save round-trip fidelity
    - **Property 11: Save Round-Trip Fidelity** — mock `savePageContent`; call `save()`; verify `savedSections` equals the sections array that was passed to Firestore
    - **Validates: Requirements 8.2, 8.4**

- [~] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Build the `FieldEditor` and `SectionEditorPanel` components
  - [~] 5.1 Create `app/admin/page-builder/FieldEditor.tsx`
    - Render `<input type="text">` for `text` fields
    - Render `<textarea>` for `textarea` fields
    - Render `<input type="url">` with placeholder `"https://..."` for `url` fields
    - Render `<input type="number">` for `number` fields
    - Render a styled toggle switch (checkbox) for `boolean` fields
    - Render a repeatable item list with Add/Remove buttons for `array` fields; each item renders its `itemSchema` fields recursively via `FieldEditor`
    - Each input calls `onChange(key, newValue)` on change
    - _Requirements: 5.2_

  - [~] 5.2 Create `app/admin/page-builder/SectionEditorPanel.tsx`
    - Accept `section: Section | null`, `definition: SectionDefinition | null`, `onClose: () => void`, `onChange: (id, content) => void`
    - When `section` is null: render "Select a section to edit" prompt
    - When `section` is set: render section type label as heading, map `definition.fields` to `<FieldEditor>` components, wire `onChange` to call `updateSectionContent`
    - Include a "Close" button that calls `onClose`
    - Wrap in Framer Motion `motion.div` with `x: 360 → 0` slide-in animation and `AnimatePresence`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 5.3 Write property test for Section Editor Panel field coverage
    - **Property 6: Section Editor Panel Field Coverage** — for each supported section type, render `SectionEditorPanel` with that section and verify an input is rendered for every key in `SECTION_DEFINITIONS[type].fields`
    - **Validates: Requirements 5.1, 5.2, 10.2**

- [ ] 6. Build `SectionRow` and `SectionList` with drag-and-drop
  - [~] 6.1 Create `app/admin/page-builder/SectionRow.tsx`
    - Use `useSortable` from `@dnd-kit/sortable` for drag handle ref and transform styles
    - Display: `GripVertical` icon (drag handle), section type label, order badge, eye/eye-off visibility toggle button
    - Active section: blue left border highlight
    - Hidden sections: reduced opacity and strikethrough on label
    - `onClick` on the row calls `selectSection(section.id)`
    - Visibility toggle calls `toggleVisibility(section.id)`
    - _Requirements: 3.4, 3.5, 6.1, 6.4, 7.1_

  - [~] 6.2 Create `app/admin/page-builder/SectionList.tsx`
    - Wrap with `DndContext` (closestCenter collision detection) and `SortableContext` (verticalListSortingStrategy)
    - `onDragEnd`: call `reorderSections(active.id as string, over.id as string)`
    - Render `DragOverlay` with a ghost `SectionRow` (scale 1.02, box shadow) during drag
    - Map sections to `<SectionRow>` components
    - _Requirements: 7.1, 7.3, 7.4_

  - [ ]* 6.3 Write property test for section list row completeness
    - **Property 4: Section List Row Completeness** — for any section array, verify each rendered `SectionRow` displays type name, order index, visibility indicator, and drag handle element
    - **Validates: Requirements 3.4, 7.1**

- [ ] 7. Build `PagePreview` with inline editing support
  - [~] 7.1 Create `app/admin/page-builder/PagePreview.tsx` with the `SECTION_COMPONENTS` dispatch map
    - Map all 15+ supported section types to their existing React components
    - Filter to `visible === true` sections sorted by `order`
    - Wrap each section in a `div` with `onClick → selectSection(id)`, `data-section-id` attribute, and blue ring highlight when `id === selectedSectionId`
    - Pass `section.content` as props to each component
    - For unknown section types: render a yellow warning banner instead of the component
    - Export a `renderSection(section: Section)` helper function for reuse in public pages
    - _Requirements: 3.1, 3.2, 3.3, 10.3_

  - [~] 7.2 Add inline editing layer to `PagePreview`
    - When `editMode` is active, wrap text content nodes in `<span contentEditable suppressContentEditableWarning data-field-key="...">` on hover
    - On `input` event: call `updateSectionContent` with the updated field value
    - On `blur` or `Escape`: deactivate `contentEditable` (value already in state)
    - Apply visible border/highlight on hover to distinguish editable elements
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 7.3 Write property test for visibility filtering in preview
    - **Property 3: Visibility Filtering in Preview** — generate sections with random `visible` booleans; render `PagePreview`; verify exactly the `visible === true` sections are rendered and `visible === false` sections are absent
    - **Validates: Requirements 3.2, 3.3, 9.3_

  - [ ]* 7.4 Write property test for visibility toggle state consistency
    - **Property 8: Visibility Toggle State Consistency** — for any section, toggle to hidden → verify `visible: false` in state and section absent from preview; toggle back → verify `visible: true` and section present
    - **Validates: Requirements 6.2, 6.3**

  - [ ]* 7.5 Write property test for field change propagates to preview
    - **Property 7: Field Change Propagates to Preview** — generate random field values; update via `updateSectionContent`; render `PagePreview`; verify the component output reflects the new value
    - **Validates: Requirements 5.3**

  - [ ]* 7.6 Write property test for inline edit synchronization
    - **Property 5: Inline Edit Synchronization** — simulate inline text edits; verify the Section Editor Panel field and local state both reflect the same updated value after editing is deactivated
    - **Validates: Requirements 4.3, 4.4**

- [~] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Build `PageBuilderClient` — layout orchestrator
  - [~] 9.1 Create `app/admin/page-builder/PageBuilderClient.tsx` with the three-panel layout
    - Top bar: 7 page tabs (one per `PageId`); active tab highlighted
    - Left panel (240px): `<SectionList>` with sections from `usePageBuilder`
    - Center panel (flex: 1): `<PagePreview>` with selected section highlight
    - Right panel (360px, slide-in): `<SectionEditorPanel>` wrapped in `AnimatePresence`
    - "Save Changes" button: enabled only when `isDirty`; shows spinner during `saving`; calls `save()`
    - Loading indicator while `loading` is true
    - Error banner with retry button when `error` is set
    - _Requirements: 1.5, 2.3, 2.4, 3.1, 8.1, 8.3, 8.4, 8.5_

  - [~] 9.2 Add unsaved changes guard to `PageBuilderClient`
    - `useEffect`: attach `beforeunload` listener when `isDirty` is true; remove when false
    - Internal page-switch guard: when admin clicks a different page tab while `isDirty`, show a custom `ConfirmDialog`; on confirm reset state and load new page; on cancel close dialog and stay
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ]* 9.3 Write property test for unsaved changes navigation guard
    - **Property 13: Unsaved Changes Navigation Guard** — generate dirty states and simulate navigation events (tab switch, browser navigation); verify confirmation dialog is always presented before navigation proceeds
    - **Validates: Requirements 11.1, 11.4**

- [ ] 10. Create the server component entry point and wire role gating
  - [~] 10.1 Create `app/admin/page-builder/page.tsx` as a server component
    - Call `getSession()`; redirect to `/admin/login` if no session
    - Redirect to `/admin/unauthorized` if role is not `superadmin` or `editor`
    - Render `<AdminShell>` wrapping `<PageBuilderClient>`
    - _Requirements: 1.1, 1.2, 1.3_

  - [~] 10.2 Update `lib/adminAuth.ts` — add `/admin/page-builder` to `ROLE_PERMISSIONS` for `superadmin` and `editor`
    - _Requirements: 1.3_

  - [~] 10.3 Update `components/admin/AdminShell.tsx` — add "Page Builder" nav item to the "Content" group
    - Import `LayoutTemplate` (or similar) icon from lucide-react
    - Add `{ label: "Page Builder", href: "/admin/page-builder", icon: LayoutTemplate }` to the Content group
    - The existing `allowed` filter will automatically hide it from `support` role
    - _Requirements: 1.4_

  - [ ]* 10.4 Write property test for unauthorized role redirect
    - **Property 1: Unauthorized Role Redirect** — for any role that is not `superadmin` or `editor`, verify `canAccess(role, '/admin/page-builder')` returns `false`
    - **Validates: Requirements 1.3**

- [ ] 11. Update existing section components to accept optional `content` prop
  - [~] 11.1 Update `components/home/HeroSection.tsx` to accept an optional `content` prop and use it when provided, falling back to hardcoded defaults
    - Pattern: `const data = content ?? HARDCODED_DEFAULTS; return <section>...{data.heading}...</section>`
    - _Requirements: 9.1, 9.4_

  - [~] 11.2 Update `components/home/CTASection.tsx` with the same optional `content` prop pattern
    - _Requirements: 9.1, 9.4_

  - [~] 11.3 Update all remaining section components with the optional `content` prop pattern: `ServicesOverview`, `FeaturedProjects`, `TechStack`, `Testimonials`, `StatsSection`, `AboutHero`, `MissionVision`, `Timeline`, `TeamSection`, `ServicesList`, `ProcessSection`, `PortfolioHero`, `ProjectsGrid`, `ProductsList`, `BlogGrid`, `JobListings`
    - Each component reads from `content` prop when provided; falls back to its current hardcoded data otherwise
    - _Requirements: 9.1, 9.4_

- [ ] 12. Integrate public pages with Firestore content
  - [~] 12.1 Update `app/page.tsx` (home) to fetch from `loadPageContent('home')`, fall back to `DEFAULT_SECTIONS['home']`, filter visible sections, sort by order, and render using `renderSection`
    - Use `cache: 'no-store'` on the Firestore fetch (server component, no caching)
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [~] 12.2 Update `app/about/page.tsx`, `app/services/page.tsx`, `app/portfolio/page.tsx`, `app/products/page.tsx`, `app/blog/page.tsx`, and `app/careers/page.tsx` with the same Firestore-fetch-and-render pattern
    - Each page uses its own `PageId` string
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 12.3 Write property test for public page renders visible sections in order
    - **Property 12: Public Page Renders Visible Sections in Order** — for any Firestore document with mixed visibility and arbitrary order values, verify the public page renders only `visible === true` sections in ascending `order` using the correct component for each type
    - **Validates: Requirements 9.3, 9.1**

- [~] 13. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical boundaries
- Property tests validate universal correctness properties across random inputs
- Unit tests validate specific behaviors and edge cases (loading state, error state, missing document, save success/failure, unknown section type, close panel, discard confirm/cancel)
- The `renderSection` helper exported from `PagePreview.tsx` is the shared rendering utility used by both the admin preview and all seven public pages — keep it pure and side-effect-free
- Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, and `framer-motion` if not already present before starting task 6

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["1.3", "2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "3.5", "5.1"] },
    { "id": 4, "tasks": ["5.2", "6.1"] },
    { "id": 5, "tasks": ["5.3", "6.2"] },
    { "id": 6, "tasks": ["6.3", "7.1"] },
    { "id": 7, "tasks": ["7.2"] },
    { "id": 8, "tasks": ["7.3", "7.4", "7.5", "7.6", "9.1"] },
    { "id": 9, "tasks": ["9.2", "10.1", "10.2", "10.3", "11.1", "11.2"] },
    { "id": 10, "tasks": ["9.3", "10.4", "11.3"] },
    { "id": 11, "tasks": ["12.1"] },
    { "id": 12, "tasks": ["12.2"] },
    { "id": 13, "tasks": ["12.3"] }
  ]
}
```
