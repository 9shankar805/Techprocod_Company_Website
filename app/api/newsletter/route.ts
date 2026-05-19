import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }

    const normalized = email.toLowerCase();
    const existing = await adminDb.collection("newsletter").where("email", "==", normalized).limit(1).get();

    if (!existing.empty) {
      return NextResponse.json({ success: true, message: "Already subscribed" });
    }

    await adminDb.collection("newsletter").add({
      email: normalized,
      subscribedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
