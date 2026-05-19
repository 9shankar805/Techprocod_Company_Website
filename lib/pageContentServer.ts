/**
 * pageContentServer.ts
 *
 * Server-only Firestore helpers using the Firebase Admin SDK.
 * NEVER import this file from client components or usePageBuilder.
 * Only import from Next.js server components (app/page.tsx, etc.)
 */

import { adminDb } from '@/lib/firebaseAdmin';
import { Section, PageId } from '@/app/admin/page-builder/types';

/**
 * Loads page content sections from Firestore using the Admin SDK.
 * Used by public-facing server components — always fetches fresh data.
 * Returns null if the document doesn't exist or the fetch fails.
 */
export async function loadPageContentServer(pageId: PageId): Promise<Section[] | null> {
  try {
    const snap = await adminDb.collection('pageContent').doc(pageId).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return data && Array.isArray(data.sections) ? (data.sections as Section[]) : null;
  } catch {
    return null;
  }
}
