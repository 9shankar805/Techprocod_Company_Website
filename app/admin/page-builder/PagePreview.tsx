'use client';

import React from 'react';
import { Section } from './types';
import { SECTION_COMPONENTS, renderSection } from './renderSections';
import { SECTION_DEFINITIONS } from './pageRegistry';

// Re-export renderSection so existing imports from PagePreview still work
export { renderSection };

interface PagePreviewProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  editMode?: boolean;
  onUpdateContent?: (sectionId: string, content: Record<string, unknown>) => void;
}

export default function PagePreview({
  sections,
  selectedSectionId,
  onSelectSection,
  editMode = false,
  onUpdateContent: _onUpdateContent,
}: PagePreviewProps) {
  // In editMode, show all sections so they can be selected/edited.
  // In live mode (editMode=false), only show visible ones.
  const displaySections = editMode
    ? [...sections].sort((a, b) => a.order - b.order)
    : sections.filter((s) => s.visible === true).sort((a, b) => a.order - b.order);

  return (
    <div style={{ width: '100%' }}>
      {displaySections.map((section) => {
        const isSelected = section.id === selectedSectionId;
        const Component = SECTION_COMPONENTS[section.type];
        const isHidden = !section.visible;

        return (
          <div
            key={section.id}
            data-section-id={section.id}
            onClick={() => onSelectSection(section.id)}
            className={[
              'relative',
              editMode ? 'group cursor-pointer' : '',
              isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '',
              editMode && isHidden ? 'opacity-40 grayscale-[0.5]' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ position: 'relative' }}
          >
            {/* Click Capture Overlay in Edit Mode */}
            {editMode && (
              <div
                className="absolute inset-0 z-30"
                style={{
                  background: isHidden ? 'rgba(100, 116, 139, 0.05)' : 'transparent',
                  cursor: 'pointer',
                }}
              />
            )}

            {/* Hover/Selection Border Overlay */}
            {editMode && (
              <div
                className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: isHidden ? 'rgba(100, 116, 139, 0.1)' : 'rgba(37, 99, 235, 0.05)',
                  border: isHidden ? '2px dashed rgba(100, 116, 139, 0.4)' : '2px solid rgba(37, 99, 235, 0.3)',
                  pointerEvents: 'none',
                  borderRadius: 2,
                }}
              />
            )}

            {/* Labels */}
            {editMode && (
              <div
                className="absolute top-2 right-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: isHidden ? 'rgba(100, 116, 139, 0.9)' : 'rgba(37, 99, 235, 0.9)',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 6,
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {isHidden && <span>🚫 Hidden</span>}
                <span>Click to edit</span>
              </div>
            )}

            {editMode && isSelected && (
              <div
                className="absolute bottom-2 right-2 z-40 pointer-events-none"
                style={{
                  background: 'rgba(37, 99, 235, 0.95)',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 6,
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                Editing: {SECTION_DEFINITIONS[section.type]?.label || section.type} →
              </div>
            )}

            <div className={editMode ? 'pointer-events-none' : ''}>
              {Component ? (
                <Component {...(section.content as object)} />
              ) : (
                <div
                  style={{
                    padding: '24px',
                    background: 'rgba(234, 179, 8, 0.1)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: 8,
                    color: '#ca8a04',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  ⚠️ Unknown section type: <strong>{section.type}</strong>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {displaySections.length === 0 && (
        <div
          style={{
            padding: '80px 24px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: 14,
          }}
        >
          No visible sections. Toggle visibility in the section list to show sections here.
        </div>
      )}
    </div>
  );
}
