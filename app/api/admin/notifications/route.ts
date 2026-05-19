import { NextRequest, NextResponse } from "next/server";
import { adminRtdb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snap = await adminRtdb.ref("notifications").orderByChild("timestamp").limitToLast(20).get();
  const items: object[] = [];
  snap.forEach(child => { items.push({ id: child.key, ...child.val() }); });
  return NextResponse.json(items.reverse());
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const ref = adminRtdb.ref("notifications").push();
  await ref.set({ ...body, timestamp: Date.now(), createdBy: session.name });
  return NextResponse.json({ id: ref.key });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await adminRtdb.ref(`notifications/${id}`).remove();
  return NextResponse.json({ success: true });
}
