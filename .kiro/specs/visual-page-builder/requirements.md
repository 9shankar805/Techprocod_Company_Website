# Requirements Document

## Introduction

The Visual Page Builder is a WYSIWYG content management system embedded in the existing TechProcod admin panel. It enables administrators and editors to visually edit the content of seven public-facing landing pages (home, about, services, portfolio, products, blog, careers) without touching code. Each page is composed of typed sections stored in Firestore under `pageContent/{pageId}`. Changes are saved directly to Firestore and reflected on the public site in real time — there is no draft/publish workflow. The builder is accessible only to users with the `superadmin` or `editor` role.

## Glossary

- **Page Builder**: The admin UI at `/admin/page-builder` that allows visual editing of landing page content.
- **Page**: One of the seven supported public-facing pages: home, about, services, portfolio, products, blog, careers.
- **Section**: A typed, ordered content block within a page (e.g., HeroSection, CTASection). Each section has an `id`, `type`, `order`, `visible` flag, and a `content` object with type-specific fields.
- **Section Editor Panel**: The side panel that appears when a section is selected, exposing editable fields for that section's content.
- **Inline Edit**: Clicking directly on text in the page preview to edit it in place.
- **Firestore**: Google Cloud Firestore, the database used to persist page content under the collection `pageContent/{pageId}`.
- **Page Preview**: The live visual representation of a page rendered inside the Page Builder using the actual public-facing section components.
- **Drag Handle**: A UI affordance on each section row that enables reordering via drag-and-drop using `@dnd-kit`.
- **Visibility Toggle**: A per-section control that sets the `visible` field to `true` or `false`, hiding or showing the section on the public page.
- **Admin**: A user with the `superadmin` or `editor` role as defined in `ROLE_PERMISSIONS`.
- **Public Page**: A Next.js App Router page that renders content fetched from Firestore in real time.
- **PageId**: The Firestore document identifier for a page's content, matching the page slug (e.g., `home`, `about`).

---

## Requirements

### Requirement 1 — Page Builder Access and Navigation

**User Story:** As an admin, I want to access the Page Builder from the admin sidebar so that I can navigate to any supported page and begin editing.

#### Acceptance Criteria

1. THE Page Builder SHALL be accessible at the route `/admin/page-builder`.
2. WHEN a user with the `superadmin` or `editor` role navigates to `/admin/page-builder`, THE Page Builder SHALL render the page selection interface.
3. IF a user without the `superadmin` or `editor` role attempts to access `/admin/page-builder`, THEN THE Page Builder SHALL redirect the user to `/admin/unauthorized`.
4. THE Admin sidebar SHALL include a "Page Builder" navigation item linking to `/admin/page-builder` visible only to users with the `superadmin` or `editor` role.
5. THE Page Builder SHALL display a list of the seven supported pages: home, about, services, portfolio, products, blog, careers.
6. WHEN an admin selects a page from the list, THE Page Builder SHALL load the selected page's sections from Firestore collection `pageContent/{pageId}`.

---

### Requirement 2 — Firestore Data Loading

**User Story:** As an admin, I want the Page Builder to load the current page content from Firestore so that I am always editing the live version of the page.

#### Acceptance Criteria

1. WHEN a page is selected in the Page Builder, THE Page Builder SHALL fetch the document at `pageContent/{pageId}` from Firestore and populate the sections array.
2. IF the Firestore document for a page does not exist, THEN THE Page Builder SHALL initialize the sections array with the default section definitions for that page and display them in the editor.
3. THE Page Builder SHALL display a loading indicator while the Firestore document is being fetched.
4. IF the Firestore fetch fails, THEN THE Page Builder SHALL display an error message describing the failure and provide a retry action.
5. THE sections array loaded from Firestore SHALL be ordered by the `order` field in ascending order before rendering in the Page Builder.

---

### Requirement 3 — Page Preview with Section List

**User Story:** As an admin, I want to see a live visual preview of the page alongside a section list so that I understand how my edits affect the final appearance.

#### Acceptance Criteria

1. THE Page Builder SHALL render a two-panel layout: a left panel containing the ordered section list and a right panel containing the Page Preview.
2. THE Page Preview SHALL render each section with `visible: true` using the actual public-facing React component for that section type.
3. WHILE a section has `visible: false`, THE Page Preview SHALL not render that section's component.
4. THE section list panel SHALL display each section's type name, order index, visibility status, and a drag handle.
5. WHEN an admin clicks a section in the section list, THE Page Builder SHALL highlight the corresponding section in the Page Preview and open the Section Editor Panel.

---

### Requirement 4 — Inline Text Editing (WYSIWYG)

**User Story:** As an admin, I want to click on text in the Page Preview to edit it inline so that I can see changes in context as I type.

#### Acceptance Criteria

1. WHEN the Page Builder is in edit mode, THE Page Preview SHALL render text fields as contenteditable elements on hover.
2. WHEN an admin clicks on an editable text element in the Page Preview, THE Page Builder SHALL activate inline editing for that field and place the cursor at the click position.
3. WHILE inline editing is active, THE Page Builder SHALL reflect text changes in the Section Editor Panel's corresponding field in real time.
4. WHEN an admin finishes editing a text field (by pressing Escape or clicking outside), THE Page Builder SHALL deactivate inline editing and retain the updated value in the local section state.
5. THE inline editing affordance SHALL be visually distinct from non-editable elements using a visible border or highlight on hover.

---

### Requirement 5 — Section Editor Panel

**User Story:** As an admin, I want a side panel to appear when I select a section so that I can edit all fields for that section including images and settings.

#### Acceptance Criteria

1. WHEN an admin selects a section, THE Section Editor Panel SHALL open and display all editable fields for that section's `content` object.
2. THE Section Editor Panel SHALL render text fields as text inputs or textareas, image fields as URL text inputs, boolean fields as toggle switches, and array fields as repeatable item editors.
3. WHEN an admin changes a field value in the Section Editor Panel, THE Page Builder SHALL update the local section state and re-render the Page Preview in real time.
4. THE Section Editor Panel SHALL display the section type name as a heading.
5. WHEN no section is selected, THE Section Editor Panel SHALL display a prompt instructing the admin to select a section to edit.
6. THE Section Editor Panel SHALL include a "Close" action that deselects the current section and collapses the panel.

---

### Requirement 6 — Section Visibility Toggle

**User Story:** As an admin, I want to toggle the visibility of individual sections so that I can hide sections without deleting their content.

#### Acceptance Criteria

1. THE section list panel SHALL display a visibility toggle for each section.
2. WHEN an admin toggles a section's visibility to hidden, THE Page Builder SHALL set that section's `visible` field to `false` in the local state and remove the section from the Page Preview.
3. WHEN an admin toggles a section's visibility to visible, THE Page Builder SHALL set that section's `visible` field to `true` in the local state and render the section in the Page Preview.
4. THE visibility toggle SHALL display a distinct visual state for hidden versus visible sections.

---

### Requirement 7 — Section Reordering via Drag and Drop

**User Story:** As an admin, I want to drag and drop sections to reorder them so that I can control the layout of the page.

#### Acceptance Criteria

1. THE section list panel SHALL render a drag handle on each section row using `@dnd-kit`.
2. WHEN an admin drags a section to a new position in the section list, THE Page Builder SHALL update the `order` field of all affected sections in the local state to reflect the new sequence.
3. WHEN section reordering is complete, THE Page Preview SHALL re-render the sections in the updated order.
4. THE drag-and-drop interaction SHALL provide visual feedback during the drag operation, including a placeholder indicating the drop target position.

---

### Requirement 8 — Save Changes to Firestore

**User Story:** As an admin, I want to save my edits so that the changes are immediately reflected on the public-facing website.

#### Acceptance Criteria

1. THE Page Builder SHALL display a "Save Changes" button that is enabled when unsaved local changes exist.
2. WHEN an admin clicks "Save Changes", THE Page Builder SHALL write the full sections array to the Firestore document at `pageContent/{pageId}`, overwriting the previous value.
3. WHILE the save operation is in progress, THE Page Builder SHALL display a loading indicator on the "Save Changes" button and disable further edits.
4. WHEN the save operation completes successfully, THE Page Builder SHALL display a success notification and mark the local state as saved.
5. IF the save operation fails, THEN THE Page Builder SHALL display an error notification with the failure reason and leave the local state unchanged so the admin can retry.
6. THE "Save Changes" button SHALL be disabled when no unsaved changes exist.

---

### Requirement 9 — Real-Time Public Page Rendering

**User Story:** As a site visitor, I want the public pages to display the latest content from Firestore so that I always see up-to-date information.

#### Acceptance Criteria

1. THE public page components (home, about, services, portfolio, products, blog, careers) SHALL fetch their content from the Firestore document at `pageContent/{pageId}` on each request or via a real-time listener.
2. WHEN an admin saves changes in the Page Builder, THE public page SHALL reflect the updated content without requiring a code deployment or server restart.
3. THE public page SHALL render only sections where `visible` is `true`, in ascending `order`.
4. IF the Firestore document for a page does not exist or cannot be fetched, THEN THE public page SHALL fall back to rendering the default static content for that page.

---

### Requirement 10 — Supported Pages and Section Types

**User Story:** As an admin, I want the Page Builder to support all seven landing pages and their defined section types so that I can manage the full public website.

#### Acceptance Criteria

1. THE Page Builder SHALL support editing the following pages and their respective section types:
   - **home**: HeroSection, ClientLogos, ServicesOverview, FeaturedProjects, TechStack, Testimonials, FAQSection, CTASection
   - **about**: AboutHero, Stats, MissionVision, Values, Timeline, TeamSection, CTASection
   - **services**: ServicesHero, ServicesList, ProcessSection, CTASection
   - **portfolio**: PortfolioHero, ProjectsGrid, CTASection
   - **products**: ProductsHero, ProductsList, CTASection
   - **blog**: BlogHero, BlogGrid
   - **careers**: CareersHero, JobListings
2. THE Section Editor Panel SHALL render the correct field schema for each section type, derived from the section's `content` object structure.
3. IF a section type loaded from Firestore is not in the supported section type list for its page, THEN THE Page Builder SHALL display a warning and skip rendering that section in the Page Preview.

---

### Requirement 11 — Unsaved Changes Guard

**User Story:** As an admin, I want to be warned before losing unsaved changes so that I do not accidentally discard my edits.

#### Acceptance Criteria

1. WHEN an admin attempts to navigate away from the Page Builder with unsaved changes, THE Page Builder SHALL display a confirmation dialog asking whether to discard the changes.
2. IF the admin confirms discarding changes, THEN THE Page Builder SHALL allow navigation and reset the local state.
3. IF the admin cancels the confirmation dialog, THEN THE Page Builder SHALL remain on the current page with the unsaved changes intact.
4. WHEN an admin switches between pages within the Page Builder with unsaved changes, THE Page Builder SHALL display the same confirmation dialog before loading the new page's content.
