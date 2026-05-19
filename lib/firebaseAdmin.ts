import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";

let app: App;

const hasConfig = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (!getApps().length) {
  if (hasConfig) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } else {
    // During build time, environment variables might be missing.
    // We initialize a placeholder or handle it lazily to avoid crashing the build.
    app = initializeApp({
      projectId: "placeholder-project-id", // Minimal config to avoid crash
    }, "placeholder-app");
  }
} else {
  app = getApps()[0];
}

// Firestore — persistent structured data
export const adminDb = getFirestore(app);

// Realtime Database — live/ephemeral data
export const adminRtdb = getDatabase(app);
