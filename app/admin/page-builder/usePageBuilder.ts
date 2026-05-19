'use client';

import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { loadPageContent, savePageContent } from '@/lib/pageContent';
import { DEFAULT_SECTIONS } from './pageRegistry';
import type { Section, PageId } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PageBuilderState {
  selectedPageId: PageId | null;
  sections: Section[];
  savedSections: Section[];
  selectedSectionId: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isDirty: boolean;
}

export interface PageBuilderActions {
  selectPage: (pageId: PageId) => Promise<void>;
  selectSection: (id: string | null) => void;
  updateSectionContent: (id: string, content: Record<string, unknown>) => void;
  toggleVisibility: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  addSection: (type: string) => void;
  removeSection: (id: string) => void;
  discardChanges: () => void;
  save: () => Promise<void>;
  retry: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePageBuilder(): PageBuilderState & PageBuilderActions {
  const [selectedPageId, setSelectedPageId] = useState<PageId | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [savedSections, setSavedSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // isDirty is computed — true when sections differ from the last-saved snapshot
  const isDirty = JSON.stringify(sections) !== JSON.stringify(savedSections);

  // -------------------------------------------------------------------------
  // selectPage
  // -------------------------------------------------------------------------
  const selectPage = useCallback(async (pageId: PageId) => {
    setSelectedPageId(pageId);
    setSelectedSectionId(null);
    setError(null);
    setLoading(true);

    try {
      let raw = await loadPageContent(pageId);

      // Fall back to registry defaults when Firestore document is missing
      if (raw === null) {
        raw = DEFAULT_SECTIONS[pageId];
      }

      // Sort ascending by order
      const sorted = [...raw].sort((a, b) => a.order - b.order);

      setSections(sorted);
      setSavedSections(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page content.');
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------------------------------------------------------
  // selectSection
  // -------------------------------------------------------------------------
  const selectSection = useCallback((id: string | null) => {
    setSelectedSectionId(id);
  }, []);

  // -------------------------------------------------------------------------
  // updateSectionContent
  // -------------------------------------------------------------------------
  const updateSectionContent = useCallback(
    (id: string, content: Record<string, unknown>) => {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, content } : s))
      );
    },
    []
  );

  // -------------------------------------------------------------------------
  // toggleVisibility
  // -------------------------------------------------------------------------
  const toggleVisibility = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  }, []);

  // -------------------------------------------------------------------------
  // reorderSections
  // -------------------------------------------------------------------------
  const reorderSections = useCallback((activeId: string, overId: string) => {
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === activeId);
      const newIndex = prev.findIndex((s) => s.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      // Move the item to its new position
      const reordered = arrayMove(prev, oldIndex, newIndex);

      // Reassign order values as 0, 1, 2, ...
      return reordered.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  // -------------------------------------------------------------------------
  // addSection
  // -------------------------------------------------------------------------
  const addSection = useCallback(
    (type: string) => {
      const definition = DEFAULT_SECTIONS.home.find((s) => s.type === type) || {
        id: `section-${Date.now()}`,
        type,
        content: {},
        visible: true,
        order: sections.length,
      };

      const newSection: Section = {
        id: `${type.toLowerCase()}-${Date.now()}`,
        type,
        content: JSON.parse(JSON.stringify(definition.content || {})),
        visible: true,
        order: sections.length,
      };

      setSections((prev) => [...prev, newSection]);
      setSelectedSectionId(newSection.id);
    },
    [sections.length]
  );

  // -------------------------------------------------------------------------
  // removeSection
  // -------------------------------------------------------------------------
  const removeSection = useCallback((id: string) => {
    setSections((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      // Reassign orders
      return filtered.map((s, i) => ({ ...s, order: i }));
    });
    setSelectedSectionId((prev) => (prev === id ? null : prev));
  }, []);

  // -------------------------------------------------------------------------
  // discardChanges
  // -------------------------------------------------------------------------
  const discardChanges = useCallback(() => {
    setSections(JSON.parse(JSON.stringify(savedSections)));
  }, [savedSections]);

  // -------------------------------------------------------------------------
  // save
  // -------------------------------------------------------------------------
  const save = useCallback(async () => {
    if (!selectedPageId) return;

    setSaving(true);
    setError(null);

    // Capture the current sections snapshot before the async call
    const sectionsToSave = sections;

    try {
      await savePageContent(selectedPageId, sectionsToSave);
      // On success, update the saved snapshot so isDirty becomes false
      setSavedSections(sectionsToSave);
    } catch (err) {
      // On failure, set error without mutating sections
      setError(err instanceof Error ? err.message : 'Failed to save page content.');
    } finally {
      setSaving(false);
    }
  }, [selectedPageId, sections]);

  // -------------------------------------------------------------------------
  // retry
  // -------------------------------------------------------------------------
  const retry = useCallback(() => {
    if (!selectedPageId) return;
    setError(null);
    selectPage(selectedPageId);
  }, [selectedPageId, selectPage]);

  // -------------------------------------------------------------------------
  // Return combined state + actions
  // -------------------------------------------------------------------------
  return {
    // State
    selectedPageId,
    sections,
    savedSections,
    selectedSectionId,
    loading,
    saving,
    error,
    isDirty,
    // Actions
    selectPage,
    selectSection,
    updateSectionContent,
    toggleVisibility,
    reorderSections,
    addSection,
    removeSection,
    discardChanges,
    save,
    retry,
  };
}
