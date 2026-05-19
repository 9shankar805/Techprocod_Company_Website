'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Save, Undo2, ExternalLink, LayoutTemplate, Maximize2, Minimize2, Database } from 'lucide-react';
import { usePageBuilder } from './usePageBuilder';
import SectionList from './SectionList';
import PagePreview from './PagePreview';
import SectionEditorPanel from './SectionEditorPanel';
import { SECTION_DEFINITIONS } from './pageRegistry';
import type { PageId } from './types';

// ─── Page Tabs ────────────────────────────────────────────────────────────────

const PAGE_TABS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'products', label: 'Products' },
  { id: 'blog', label: 'Blog' },
  { id: 'careers', label: 'Careers' },
];

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  open,
  message,
  confirmLabel = 'Discard',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm navigation"
    >
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <p className="text-sm text-slate-200 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#0f172a] border border-[#334155] rounded-lg hover:bg-[#334155] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PageBuilderClient ────────────────────────────────────────────────────────

export default function PageBuilderClient() {
  const {
    selectedPageId,
    sections,
    selectedSectionId,
    loading,
    saving,
    error,
    isDirty,
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
  } = usePageBuilder();

  // Track a pending page switch when there are unsaved changes
  const [pendingPageId, setPendingPageId] = useState<PageId | null>(null);

  // Track if the side panels are collapsed (Zen Mode)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // ── Keyboard Shortcut (Zen Mode) ──────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Toggle Zen mode with Ctrl+B (common sidebar toggle shortcut) or just 'z' if not in input
      if ((e.ctrlKey && e.key === 'b') || (e.key === 'z' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        setIsCollapsed((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSeed = async () => {
    if (!confirm('This will overwrite all pages with professional demo data. Continue?')) return;
    
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        alert('Professional data seeded! Refreshing...');
        window.location.reload();
      } else {
        throw new Error('Failed to seed');
      }
    } catch (err) {
      alert('Error seeding data');
    } finally {
      setSeeding(false);
    }
  };

  // ── beforeunload guard ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedPageId) {
      selectPage('home');
    }
  }, [selectedPageId, selectPage]);

  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      // Modern browsers ignore the returnValue string but still show a dialog
      e.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // ── Page tab click handler ──────────────────────────────────────────────────
  function handleTabClick(pageId: PageId) {
    if (pageId === selectedPageId) return;

    if (isDirty) {
      // Show confirm dialog instead of switching immediately
      setPendingPageId(pageId);
    } else {
      selectPage(pageId);
    }
  }

  function handleConfirmDiscard() {
    if (pendingPageId) {
      selectPage(pendingPageId);
    }
    setPendingPageId(null);
  }

  function handleCancelDiscard() {
    setPendingPageId(null);
  }

  // ── Derive selected section and its definition ──────────────────────────────
  const selectedSection = selectedSectionId
    ? (sections.find((s) => s.id === selectedSectionId) ?? null)
    : null;

  const selectedDefinition = selectedSection
    ? (SECTION_DEFINITIONS[selectedSection.type] ?? null)
    : null;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0f172a]">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[#1e293b] bg-[#0f172a] flex-shrink-0 relative z-50">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2 mr-2">
            <img 
              src="/assets/icon.jpg" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-sm font-bold text-white hidden lg:block whitespace-nowrap">
              Page Builder
            </h1>
          </div>

          <div className="h-6 w-[1px] bg-[#1e293b] hidden lg:block" />

          {/* Page tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {PAGE_TABS.map((tab) => {
              const isActive = tab.id === selectedPageId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={[
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-[#1e293b] text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#1e293b]',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-[#1e293b]">
          {!isDirty && (
            <button
              type="button"
              onClick={handleSeed}
              disabled={seeding}
              title="Reset all pages to professional defaults"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-amber-900/10 rounded-md transition-all"
            >
              {seeding ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
              <span className="hidden xl:inline">{seeding ? 'Seeding...' : 'Seed Professional Data'}</span>
            </button>
          )}

          {isDirty && (
            <button
              type="button"
              onClick={discardChanges}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-all"
            >
              <Undo2 size={14} />
              Discard
            </button>
          )}

          <button
            type="button"
            onClick={save}
            disabled={!isDirty || saving}
            className={[
              'flex items-center gap-2 px-5 py-1.5 text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20',
              isDirty && !saving
                ? 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-[#1e293b] text-slate-500 cursor-not-allowed opacity-50',
            ].join(' ')}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>

          {selectedPageId && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Show panels" : "Collapse panels"}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-[#1e293b] rounded-md transition-all"
              >
                {isCollapsed ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                <span className="hidden xl:inline">{isCollapsed ? 'Expand' : 'Collapse'}</span>
              </button>

              <a
                href={selectedPageId === 'home' ? '/' : `/${selectedPageId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-[#1e293b] rounded-md transition-all"
              >
                <ExternalLink size={14} />
                <span className="hidden xl:inline">View Site</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Loading indicator ────────────────────────────────────────────────── */}
      {loading && (
        <div className="w-full flex items-center justify-center py-3 bg-[#0f172a] border-b border-[#1e293b] flex-shrink-0">
          <Loader2 size={18} className="animate-spin text-blue-400 mr-2" />
          <span className="text-sm text-slate-400">Loading page content…</span>
        </div>
      )}

      {/* ── Error banner ─────────────────────────────────────────────────────── */}
      {error && !loading && (
        <div className="w-full flex items-center justify-between px-4 py-2 bg-red-900/30 border-b border-red-800/50 flex-shrink-0">
          <span className="text-sm text-red-300">{error}</span>
          <button
            type="button"
            onClick={retry}
            className="text-sm font-medium text-red-300 hover:text-red-100 underline ml-4 flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Three-panel layout ───────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Left panel — Section List */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex-shrink-0 border-r border-[#1e293b] overflow-y-auto bg-[#0f172a] overflow-hidden"
            >
              {selectedPageId ? (
                <SectionList
                  sections={sections}
                  selectedSectionId={selectedSectionId}
                  onSelect={selectSection}
                  onToggleVisibility={toggleVisibility}
                  onReorder={reorderSections}
                  onAdd={addSection}
                  onRemove={removeSection}
                />
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <p className="text-xs text-slate-500 text-center">
                    Select a page tab above to start editing.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center panel — Page Preview */}
        <div className="flex-1 overflow-y-auto" style={{ background: 'white' }}>
          {selectedPageId ? (
            <div style={{
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              color: '#111827',
              background: 'white',
              minHeight: '100%',
              maxWidth: isCollapsed ? '1200px' : 'none',
              margin: isCollapsed ? '0 auto' : '0',
              boxShadow: isCollapsed ? '0 0 50px rgba(0,0,0,0.1)' : 'none',
              transition: 'max-width 0.4s ease, margin 0.4s ease, box-shadow 0.4s ease',
            }}>
              <PagePreview
                sections={sections}
                selectedSectionId={selectedSectionId}
                onSelectSection={selectSection}
                editMode={true}
                onUpdateContent={updateSectionContent}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-slate-400">
                Select a page to preview and edit its sections.
              </p>
            </div>
          )}
        </div>

        {/* Right panel — Section Editor (slide-in via AnimatePresence inside SectionEditorPanel) */}
        <AnimatePresence>
          {selectedPageId && !isCollapsed && (
            <motion.div
              key="editor-panel-wrapper"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <SectionEditorPanel
                key={selectedSection?.id ?? 'none'}
                section={selectedSection}
                definition={selectedDefinition}
                onClose={() => selectSection(null)}
                onChange={updateSectionContent}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Confirm Dialog (unsaved changes guard) ───────────────────────────── */}
      <ConfirmDialog
        open={pendingPageId !== null}
        message="You have unsaved changes. Discard them and switch pages?"
        confirmLabel="Discard"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
      />
    </div>
  );
}
