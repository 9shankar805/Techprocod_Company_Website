import { NextRequest, NextResponse } from "next/server";
import { adminRtdb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snap = await adminRtdb.ref("teamMessages").orderByChild("timestamp").limitToLast(100).get();
  const msgs: object[] = [];
  snap.forEach(child => { msgs.push({ id: child.key, ...child.val() }); });
  return NextResponse.json(msgs.reverse());
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });
  const ref = adminRtdb.ref("teamMessages").push();
  await ref.set({ text: text.trim(), sender: session.name, role: session.role, timestamp: Date.now() });
  return NextResponse.json({ id: ref.key });
}
