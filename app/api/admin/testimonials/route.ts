import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
  const snap = await adminDb.collection("testimonials").where("active", "==", true).orderBy("order", "asc").get();
  if (!snap.empty) {
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }
  // Return defaults if none in DB
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const ref = await adminDb.collection("testimonials").add({ ...body, active: true, createdAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, ...data } = await req.json();
  await adminDb.collection("testimonials").doc(id).update(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await adminDb.collection("testimonials").doc(id).delete();
  return NextResponse.json({ success: true });
}
