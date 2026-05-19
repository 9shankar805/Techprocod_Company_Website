import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await adminDb.collection("portfolio").orderBy("createdAt", "desc").get();
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const ref = await adminDb.collection("portfolio").add({ ...body, createdAt: new Date().toISOString() });
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  await adminDb.collection("portfolio").doc(id).update(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await adminDb.collection("portfolio").doc(id).delete();
  return NextResponse.json({ success: true });
}
