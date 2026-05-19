'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Section, SectionDefinition } from './types';
import FieldEditor from './FieldEditor';

interface SectionEditorPanelProps {
  section: Section | null;
  definition: SectionDefinition | null;
  onClose: () => void;
  onChange: (id: string, content: Record<string, unknown>) => void;
}

export default function SectionEditorPanel({
  section,
  definition,
  onClose,
  onChange,
}: SectionEditorPanelProps) {
  return (
    <AnimatePresence>
      {section ? (
        <motion.div
          key="section-editor-panel"
          initial={{ x: 360 }}
          animate={{ x: 0 }}
          exit={{ x: 360 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-full w-[360px] bg-[#0f172a] border-l border-[#1e293b] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b] flex-shrink-0">
            <h2 className="text-sm font-semibold text-slate-100 truncate">
              {definition?.label ?? section.type}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close editor panel"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-[#1e293b] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
            {definition?.fields.map((field) => (
              <FieldEditor
                key={field.key}
                field={field}
                value={section.content[field.key]}
                onChange={(key, newValue) =>
                  onChange(section.id, { ...section.content, [key]: newValue })
                }
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="section-editor-empty"
          initial={{ x: 360 }}
          animate={{ x: 0 }}
          exit={{ x: 360 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-full w-[360px] bg-[#0f172a] border-l border-[#1e293b] flex items-center justify-center shadow-2xl"
        >
          <p className="text-sm text-slate-500 text-center px-6">
            Select a section to edit
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
