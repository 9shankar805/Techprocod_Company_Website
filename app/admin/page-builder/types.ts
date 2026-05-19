// Shared TypeScript types for the Visual Page Builder

export type FieldType = 'text' | 'textarea' | 'url' | 'boolean' | 'array' | 'number' | 'object';

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  itemSchema?: FieldSchema[]; // for array fields
  fields?: FieldSchema[]; // for object fields
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

export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'products'
  | 'blog'
  | 'careers';
