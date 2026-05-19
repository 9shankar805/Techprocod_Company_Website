import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Section, PageId } from '@/app/admin/page-builder/types';

/**
 * Loads page content sections from Firestore using the client SDK.
 * Used by the admin Page Builder (client component).
 */
export async function loadPageContent(pageId: PageId): Promise<Section[] | null> {
  const ref = doc(db, 'pageContent', pageId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return Array.isArray(data.sections) ? (data.sections as Section[]) : null;
}

/**
 * Saves page content sections to Firestore via the admin API.
 * This ensures the custom session is verified on the server.
 */
export async function savePageContent(pageId: PageId, sections: Section[]): Promise<void> {
  const response = await fetch('/api/admin/page-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: pageId, sections }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save page content (${response.status})`);
  }
}
