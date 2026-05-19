import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");

  let query = adminDb.collection("attendance").orderBy("date", "desc") as FirebaseFirestore.Query;
  if (employeeId) query = query.where("employeeId", "==", employeeId);

  const snap = await query.limit(100).get();
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const ref = await adminDb.collection("attendance").add({
    ...body,
    createdAt: FieldValue.serverTimestamp(),
  });
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  await adminDb.collection("attendance").doc(id).update(data);
  return NextResponse.json({ success: true });
}
