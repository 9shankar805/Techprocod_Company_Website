import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";
import { FieldValue } from "firebase-admin/firestore";
import { logAudit } from "@/lib/audit";
import { notifyNewTask } from "@/lib/notify";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snap = await adminDb.collection("tasks").orderBy("createdAt", "desc").get();
  return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.().toISOString() ?? "" })));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const ref = await adminDb.collection("tasks").add({ ...body, createdAt: FieldValue.serverTimestamp() });
  await logAudit(session.name, "created", "task", `${body.title}${body.assignedTo ? ` → ${body.assignedTo}` : ""}`);
  if (body.assignedTo) notifyNewTask(body.title, body.assignedTo, body.project);
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...data } = await req.json();
  await adminDb.collection("tasks").doc(id).update(data);
  await logAudit(session.name, "updated", "task", data.title ?? id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await adminDb.collection("tasks").doc(id).delete();
  await logAudit(session.name, "deleted", "task", id);
  return NextResponse.json({ success: true });
}
