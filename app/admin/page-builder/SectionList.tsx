'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Section } from './types';
import SectionRow from './SectionRow';
import { SECTION_DEFINITIONS } from './pageRegistry';

interface SectionListProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onAdd: (type: string) => void;
  onRemove: (id: string) => void;
}

export default function SectionList({
  sections,
  selectedSectionId,
  onSelect,
  onToggleVisibility,
  onReorder,
  onAdd,
  onRemove,
}: SectionListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const activeSection = activeId
    ? sections.find((s) => s.id === activeId) ?? null
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-1 p-2 overflow-y-auto bg-[#0f172a]">
          {sections.map((section) => (
            <SectionRow
              key={section.id}
              section={section}
              isSelected={section.id === selectedSectionId}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onRemove={onRemove}
            />
          ))}

          {/* Add Section Button */}
          <div className="mt-2 relative">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-slate-100 bg-[#1e293b] border border-dashed border-[#334155] rounded-md hover:border-blue-500 hover:bg-[#263348] transition-all"
            >
              <Plus size={14} />
              Add Section
            </button>

            {showAddMenu && (
              <div className="absolute left-0 bottom-full mb-2 w-full max-h-64 overflow-y-auto bg-[#1e293b] border border-[#334155] rounded-lg shadow-2xl z-50 p-1">
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-[#334155] mb-1">
                  Select Section Type
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {Object.entries(SECTION_DEFINITIONS).map(([type, def]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        onAdd(type);
                        setShowAddMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white rounded transition-colors flex items-center justify-between group"
                    >
                      <span>{def.label}</span>
                      <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SortableContext>

      <DragOverlay>
        {activeSection ? (
          <div className="scale-[1.02] shadow-xl">
            <SectionRow
              section={activeSection}
              isSelected={activeSection.id === selectedSectionId}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onRemove={onRemove}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
