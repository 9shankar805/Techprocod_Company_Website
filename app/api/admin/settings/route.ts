import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";

const DOC = "adminSettings";
const COL = "settings";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const doc = await adminDb.collection(COL).doc(DOC).get();
  return NextResponse.json(doc.exists ? doc.data() : {});
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  await adminDb.collection(COL).doc(DOC).set(body, { merge: true });
  return NextResponse.json({ success: true });
}
