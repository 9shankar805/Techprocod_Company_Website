import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const snap = await adminDb.collection("audit").orderBy("timestamp", "desc").limit(100).get();
  return NextResponse.json(snap.docs.map(d => ({
    id: d.id, ...d.data(),
    timestamp: d.data().timestamp?.toDate?.().toISOString() ?? "",
  })));
}
