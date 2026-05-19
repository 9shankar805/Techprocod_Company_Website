'use client';

import { FieldSchema } from './types';

interface FieldEditorProps {
  field: FieldSchema;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}

export default function FieldEditor({ field, value, onChange }: FieldEditorProps) {
  const inputBase =
    'w-full bg-[#1e293b] border border-[#334155] rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

  switch (field.type) {
    case 'text':
      return (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">{field.label}</label>
          <input
            type="text"
            className={inputBase}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">{field.label}</label>
          <textarea
            className={`${inputBase} resize-y min-h-[80px]`}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        </div>
      );

    case 'url':
      return (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">{field.label}</label>
          <input
            type="url"
            className={inputBase}
            placeholder="https://..."
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        </div>
      );

    case 'number':
      return (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400">{field.label}</label>
          <input
            type="number"
            className={inputBase}
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => onChange(field.key, e.target.valueAsNumber)}
          />
        </div>
      );

    case 'boolean': {
      const checked = value === true;
      return (
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs font-medium text-slate-400">{field.label}</label>
          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(field.key, !checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] ${
              checked ? 'bg-blue-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                checked ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      );
    }

    case 'object': {
      const objValue = (value as Record<string, unknown>) ?? {};
      const fields = field.fields ?? [];

      const updateField = (subKey: string, subValue: unknown) => {
        onChange(field.key, { ...objValue, [subKey]: subValue });
      };

      return (
        <div className="flex flex-col gap-2 p-3 bg-[#0f172a] rounded-md border border-[#334155]">
          <label className="text-xs font-medium text-slate-400">{field.label}</label>
          <div className="flex flex-col gap-3">
            {fields.map((subField) => (
              <FieldEditor
                key={subField.key}
                field={subField}
                value={objValue[subField.key]}
                onChange={updateField}
              />
            ))}
          </div>
        </div>
      );
    }

    case 'array': {
      const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      const itemSchema = field.itemSchema ?? [];

      const updateItem = (index: number, itemKey: string, itemValue: unknown) => {
        const updated = items.map((item, i) =>
          i === index ? { ...item, [itemKey]: itemValue } : item
        );
        onChange(field.key, updated);
      };

      const addItem = () => {
        const blank: Record<string, unknown> = {};
        for (const subField of itemSchema) {
          blank[subField.key] =
            subField.type === 'boolean'
              ? false
              : subField.type === 'number'
              ? 0
              : subField.type === 'array'
              ? []
              : '';
        }
        onChange(field.key, [...items, blank]);
      };

      const removeItem = (index: number) => {
        onChange(field.key, items.filter((_, i) => i !== index));
      };

      return (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400">{field.label}</label>

          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-md border border-[#334155] bg-[#0f172a] p-3 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 font-medium">
                    Item {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-0.5 rounded hover:bg-red-900/20"
                  >
                    Remove
                  </button>
                </div>

                {itemSchema.map((subField) => (
                  <FieldEditor
                    key={subField.key}
                    field={subField}
                    value={item[subField.key]}
                    onChange={(subKey, subValue) => updateItem(index, subKey, subValue)}
                  />
                ))}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-1 w-full rounded-md border border-dashed border-[#334155] py-2 text-xs text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
          >
            + Add {field.label}
          </button>
        </div>
      );
    }

    default:
      return null;
  }
}
