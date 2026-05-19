import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const snap = await adminDb.collection("finance").orderBy("date", "desc").get();
  return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const ref = await adminDb.collection("finance").add({ ...body, createdAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, ...data } = await req.json();
  await adminDb.collection("finance").doc(id).update(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await adminDb.collection("finance").doc(id).delete();
  return NextResponse.json({ success: true });
}
