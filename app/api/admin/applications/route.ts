import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snap = await adminDb.collection("applications").orderBy("createdAt", "desc").get();
  const data = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.().toISOString() ?? "" }));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  // Public endpoint — no auth required (from careers page)
  const body = await req.json();
  if (!body.name || !body.email || !body.jobTitle) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const ref = await adminDb.collection("applications").add({
    ...body,
    status: "New",
    createdAt: FieldValue.serverTimestamp(),
  });
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...data } = await req.json();
  await adminDb.collection("applications").doc(id).update(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await adminDb.collection("applications").doc(id).delete();
  return NextResponse.json({ success: true });
}
