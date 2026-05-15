import { NextRequest, NextResponse } from "next/server";

// In-memory store (resets on server restart — replace with DB for production)
const subscribers: string[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }

    if (subscribers.includes(email.toLowerCase())) {
      return NextResponse.json({ success: true, message: "Already subscribed" });
    }

    subscribers.push(email.toLowerCase());
    console.log(`Newsletter subscription: ${email} (total: ${subscribers.length})`);

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
