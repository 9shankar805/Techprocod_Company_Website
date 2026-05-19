import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";
import { FieldValue } from "firebase-admin/firestore";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snap = await adminDb.collection("projects").orderBy("createdAt", "desc").get();
  return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.().toISOString() ?? "" })));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const ref = await adminDb.collection("projects").add({ ...body, createdAt: FieldValue.serverTimestamp() });
  await logAudit(session.name, "created", "project", body.name);
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, ...data } = await req.json();
  await adminDb.collection("projects").doc(id).update(data);
  await logAudit(session.name, "updated", "project", data.name ?? id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await adminDb.collection("projects").doc(id).delete();
  await logAudit(session.name, "deleted", "project", id);
  return NextResponse.json({ success: true });
}
