import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getSession } from "@/lib/getSession";

// GET /api/admin/page-content?page=home  — public, no auth
export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "home";
  const doc = await adminDb.collection("pageContent").doc(page).get();
  if (!doc.exists) return NextResponse.json({ sections: [] });
  return NextResponse.json(doc.data());
}

// POST /api/admin/page-content  — saves full page sections array
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { page, sections } = body;
  if (!page || !Array.isArray(sections)) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  await adminDb.collection("pageContent").doc(page).set({ sections, updatedAt: new Date().toISOString(), updatedBy: session.name });
  return NextResponse.json({ success: true });
}
