import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const snap = await adminDb.collection("adminUsers").orderBy("createdAt", "asc").get();
  const data = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.().toISOString() ?? "" }));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.username || !body.password || !body.name || !body.role) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const ref = await adminDb.collection("adminUsers").add({ ...body, createdAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, ...data } = await req.json();
  await adminDb.collection("adminUsers").doc(id).update(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await adminDb.collection("adminUsers").doc(id).delete();
  return NextResponse.json({ success: true });
}
