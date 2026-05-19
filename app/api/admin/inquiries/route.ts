import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const snap = await adminDb.collection("inquiries").orderBy("createdAt", "desc").get();
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) ?? "" }));
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  await adminDb.collection("inquiries").doc(id).update({ status });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await adminDb.collection("inquiries").doc(id).delete();
  return NextResponse.json({ success: true });
}
