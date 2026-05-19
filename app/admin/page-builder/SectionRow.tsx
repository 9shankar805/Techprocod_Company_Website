'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Section } from './types';
import { SECTION_DEFINITIONS } from './pageRegistry';

interface SectionRowProps {
  section: Section;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function SectionRow({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onRemove,
}: SectionRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const label = SECTION_DEFINITIONS[section.type]?.label ?? section.type;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={() => onSelect(section.id)}
      className={[
        'flex items-center gap-2 px-3 py-2.5 rounded-md cursor-pointer select-none',
        'bg-[#1e293b] hover:bg-[#263348] transition-colors',
        isSelected ? 'border-l-2 border-blue-500' : 'border-l-2 border-transparent',
        !section.visible ? 'opacity-50' : '',
        isDragging ? 'shadow-lg ring-1 ring-blue-500/40 z-50' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label="Drag to reorder"
        className="flex-shrink-0 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing touch-none"
        onClick={(e) => e.stopPropagation()}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      {/* Section type label */}
      <span
        className={[
          'flex-1 text-sm font-medium text-slate-200 truncate',
          !section.visible ? 'line-through text-slate-400' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </span>

      {/* Order badge */}
      <span className="flex-shrink-0 text-xs font-mono bg-[#0f172a] text-slate-400 rounded px-1.5 py-0.5 min-w-[1.5rem] text-center">
        {section.order + 1}
      </span>

      {/* Visibility toggle */}
      <button
        type="button"
        aria-label={section.visible ? 'Hide section' : 'Show section'}
        className="flex-shrink-0 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 transition-all p-1 rounded"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility(section.id);
        }}
      >
        {section.visible ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>

      {/* Delete button */}
      <button
        type="button"
        aria-label="Remove section"
        className="flex-shrink-0 text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-all p-1 rounded"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm('Are you sure you want to remove this section?')) {
            onRemove(section.id);
          }
        }}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
