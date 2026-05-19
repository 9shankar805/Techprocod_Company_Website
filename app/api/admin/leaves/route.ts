import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";
import { FieldValue } from "firebase-admin/firestore";
import { logAudit } from "@/lib/audit";
import { notifyLeaveApproved, notifyLeaveRejected } from "@/lib/notify";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snap = await adminDb.collection("leaves").orderBy("createdAt", "desc").get();
  return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.().toISOString() ?? "" })));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const ref = await adminDb.collection("leaves").add({ ...body, status: "Pending", createdAt: FieldValue.serverTimestamp() });
  await logAudit(session.name, "created", "leave", `Leave request for ${body.employeeName} (${body.leaveType})`);
  return NextResponse.json({ id: ref.id });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, status, reviewNote, employeeName, leaveType, fromDate, toDate } = await req.json();
  await adminDb.collection("leaves").doc(id).update({ status, reviewNote });
  await logAudit(session.name, status === "Approved" ? "approved" : "rejected", "leave", `${employeeName} - ${leaveType}`);
  if (status === "Approved") notifyLeaveApproved(employeeName, leaveType, fromDate, toDate);
  if (status === "Rejected") notifyLeaveRejected(employeeName, leaveType, reviewNote);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await adminDb.collection("leaves").doc(id).delete();
  await logAudit(session.name, "deleted", "leave", `Leave ID: ${id}`);
  return NextResponse.json({ success: true });
}
