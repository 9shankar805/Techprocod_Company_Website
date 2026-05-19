import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function logAudit(actor: string, action: string, entity: string, detail: string) {
  try {
    await adminDb.collection("audit").add({
      actor,
      action,   // "created" | "updated" | "deleted" | "approved" | "rejected" | "login"
      entity,   // "project" | "task" | "employee" | "leave" | "finance" etc.
      detail,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch {
    // Non-blocking
  }
}
